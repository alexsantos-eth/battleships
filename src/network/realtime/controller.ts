import {
  Database,
  endAt,
  equalTo,
  get,
  getDatabase,
  limitToFirst,
  limitToLast,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  onValue,
  orderByChild,
  orderByKey,
  orderByValue,
  push,
  query,
  ref,
  remove,
  serverTimestamp,
  set,
  startAt,
  update,
} from "firebase/database";

import { app } from "@/config/database/firebase";

import type { DatabaseReference, Query, Unsubscribe } from "firebase/database";
export interface RealtimeOptions {
  includeMetadata?: boolean;
  errorHandler?: (error: Error) => void;
}

export interface PaginationOptions {
  pageSize: number;
  orderByField?: string;
  orderDirection?: "asc" | "desc";
}

export interface RealtimeQueryConstraint {
  type: "orderByChild" | "orderByKey" | "orderByValue";
  field?: string;
  value?: unknown;
  startAt?: unknown;
  endAt?: unknown;
  limit?: number;
  limitType?: "first" | "last";
}

export class RealtimeDatabase {
  private static instance: RealtimeDatabase;
  private db: Database;

  private constructor() {
    this.db = getDatabase(app);
  }

  static getInstance(): RealtimeDatabase {
    if (!RealtimeDatabase.instance) {
      RealtimeDatabase.instance = new RealtimeDatabase();
    }
    return RealtimeDatabase.instance;
  }

  async createDocument<T extends Record<string, unknown>>(
    path: string,
    data: T,
    documentId?: string
  ): Promise<string> {
    try {
      const dbRef = documentId
        ? ref(this.db, `${path}/${documentId}`)
        : push(ref(this.db, path));

      const documentData = {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await set(dbRef, documentData);
      return dbRef.key || "";
    } catch (error) {
      throw new Error(`Error creating document: ${error}`);
    }
  }

  async getDocument<T>(path: string): Promise<T | null> {
    try {
      const dbRef = ref(this.db, path);
      const snapshot = await get(dbRef);

      if (snapshot.exists()) {
        return snapshot.val() as T;
      }

      return null;
    } catch (error) {
      throw new Error(`Error getting document: ${error}`);
    }
  }

  async updateDocument<T extends Record<string, unknown>>(
    path: string,
    data: Partial<T>
  ): Promise<void> {
    try {
      const dbRef = ref(this.db, path);
      await update(dbRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      throw new Error(`Error updating document: ${error}`);
    }
  }

  async updateNestedField(
    path: string,
    fieldPath: string,
    value: unknown
  ): Promise<void> {
    try {
      const dbRef = ref(this.db, path);
      const updates: Record<string, unknown> = {};
      updates[fieldPath] = value;
      updates["updatedAt"] = serverTimestamp();

      await update(dbRef, updates);
    } catch (error) {
      throw new Error(`Error updating nested field: ${error}`);
    }
  }

  async deleteDocument(path: string): Promise<void> {
    try {
      const dbRef = ref(this.db, path);
      await remove(dbRef);
    } catch (error) {
      throw new Error(`Error deleting document: ${error}`);
    }
  }

  private buildQuery(
    dbRef: DatabaseReference | Query,
    constraints: RealtimeQueryConstraint[]
  ): Query {
    let dbQuery: Query = dbRef;

    for (const constraintItem of constraints) {
      switch (constraintItem.type) {
        case "orderByChild":
          if (constraintItem.field) {
            dbQuery = query(dbQuery, orderByChild(constraintItem.field));
          }
          break;
        case "orderByKey":
          dbQuery = query(dbQuery, orderByKey());
          break;
        case "orderByValue":
          dbQuery = query(dbQuery, orderByValue());
          break;
      }

      if (constraintItem.value !== undefined) {
        dbQuery = query(
          dbQuery,
          equalTo(constraintItem.value as string | number | boolean)
        );
      }

      if (constraintItem.startAt !== undefined) {
        dbQuery = query(
          dbQuery,
          startAt(constraintItem.startAt as string | number | boolean)
        );
      }

      if (constraintItem.endAt !== undefined) {
        dbQuery = query(
          dbQuery,
          endAt(constraintItem.endAt as string | number | boolean)
        );
      }

      if (constraintItem.limit !== undefined) {
        if (constraintItem.limitType === "last") {
          dbQuery = query(dbQuery, limitToLast(constraintItem.limit));
        } else {
          dbQuery = query(dbQuery, limitToFirst(constraintItem.limit));
        }
      }
    }

    return dbQuery;
  }

  async queryDocuments<T>(
    path: string,
    constraints: RealtimeQueryConstraint[] = []
  ): Promise<T[]> {
    try {
      const dbRef = ref(this.db, path);
      const dbQuery = this.buildQuery(dbRef, constraints);

      const snapshot = await get(dbQuery);
      const documents: T[] = [];

      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          documents.push({
            id: childSnapshot.key,
            ...childSnapshot.val(),
          } as T);
        });
      }

      return documents;
    } catch (error) {
      throw new Error(`Error querying documents: ${error}`);
    }
  }

  async queryDocumentsPaginated<T>(
    path: string,
    options: PaginationOptions,
    constraints: RealtimeQueryConstraint[] = []
  ): Promise<{
    documents: T[];
    lastKey: string | null;
    hasMore: boolean;
  }> {
    try {
      const { pageSize, orderByField, orderDirection = "desc" } = options;

      const dbRef = ref(this.db, path);
      let dbQuery: Query = dbRef;

      if (orderByField) {
        dbQuery = query(dbQuery, orderByChild(orderByField));
      } else {
        dbQuery = query(dbQuery, orderByKey());
      }

      dbQuery = this.buildQuery(dbQuery, constraints);

      const limitQuery = query(
        dbQuery,
        orderDirection === "desc"
          ? limitToLast(pageSize + 1)
          : limitToFirst(pageSize + 1)
      );

      const snapshot = await get(limitQuery);
      const documents: T[] = [];

      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          documents.push({
            id: childSnapshot.key,
            ...childSnapshot.val(),
          } as T);
        });
      }

      const hasMore = documents.length > pageSize;
      const resultDocuments = hasMore
        ? documents.slice(0, pageSize)
        : documents;
      const lastKey =
        resultDocuments.length > 0
          ? ((
              resultDocuments[resultDocuments.length - 1] as Record<
                string,
                unknown
              >
            ).id as string)
          : null;

      return {
        documents: resultDocuments,
        lastKey,
        hasMore,
      };
    } catch (error) {
      throw new Error(`Error querying documents with pagination: ${error}`);
    }
  }

  async loadMoreDocuments<T>(
    path: string,
    lastKey: string,
    options: PaginationOptions,
    constraints: RealtimeQueryConstraint[] = []
  ): Promise<{
    documents: T[];
    lastKey: string | null;
    hasMore: boolean;
  }> {
    try {
      const { pageSize, orderByField, orderDirection = "desc" } = options;

      const dbRef = ref(this.db, path);
      let dbQuery: Query = dbRef;

      if (orderByField) {
        dbQuery = query(dbQuery, orderByChild(orderByField));
      } else {
        dbQuery = query(dbQuery, orderByKey());
      }

      dbQuery = this.buildQuery(dbQuery, constraints);

      const startAfterQuery = query(dbQuery, startAt(lastKey));

      const limitQuery = query(
        startAfterQuery,
        orderDirection === "desc"
          ? limitToLast(pageSize + 1)
          : limitToFirst(pageSize + 1)
      );

      const snapshot = await get(limitQuery);
      const documents: T[] = [];

      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          documents.push({
            id: childSnapshot.key,
            ...childSnapshot.val(),
          } as T);
        });
      }

      const hasMore = documents.length > pageSize;
      const resultDocuments = hasMore
        ? documents.slice(0, pageSize)
        : documents;
      const newLastKey =
        resultDocuments.length > 0
          ? ((
              resultDocuments[resultDocuments.length - 1] as Record<
                string,
                unknown
              >
            ).id as string)
          : null;

      return {
        documents: resultDocuments,
        lastKey: newLastKey,
        hasMore,
      };
    } catch (error) {
      throw new Error(`Error loading more documents: ${error}`);
    }
  }

  subscribeToDocument<T>(
    path: string,
    callback: (data: T | null) => void,
    options: RealtimeOptions = {}
  ): Unsubscribe {
    const { errorHandler } = options;

    const dbRef = ref(this.db, path);

    return onValue(
      dbRef,
      (snapshot) => {
        if (snapshot.exists()) {
          callback(snapshot.val() as T);
        } else {
          callback(null);
        }
      },
      (error) => {
        if (errorHandler) {
          errorHandler(error);
        } else {
          console.warn("Document subscription error:", error);
        }
      }
    );
  }

  subscribeToCollection<T>(
    path: string,
    callback: (documents: T[]) => void,
    constraints: RealtimeQueryConstraint[] = [],
    options: RealtimeOptions = {}
  ): Unsubscribe {
    const { errorHandler } = options;

    const dbRef = ref(this.db, path);
    const dbQuery = this.buildQuery(dbRef, constraints);

    return onValue(
      dbQuery,
      (snapshot) => {
        const documents: T[] = [];

        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            documents.push({
              id: childSnapshot.key,
              ...childSnapshot.val(),
            } as T);
          });
        }

        callback(documents);
      },
      (error) => {
        if (errorHandler) {
          errorHandler(error);
        } else {
          console.warn("Collection subscription error:", error);
        }
      }
    );
  }

  subscribeToChildEvents<T>(
    path: string,
    callbacks: {
      onChildAdded?: (data: T) => void;
      onChildChanged?: (data: T) => void;
      onChildRemoved?: (data: T) => void;
    },
    options: RealtimeOptions = {}
  ): Unsubscribe[] {
    const { errorHandler } = options;
    const dbRef = ref(this.db, path);
    const unsubscribes: Unsubscribe[] = [];

    if (callbacks.onChildAdded) {
      unsubscribes.push(
        onChildAdded(
          dbRef,
          (snapshot) => {
            callbacks.onChildAdded!({
              id: snapshot.key,
              ...snapshot.val(),
            } as T);
          },
          (error) => {
            if (errorHandler) {
              errorHandler(error);
            } else {
              console.warn("Child added subscription error:", error);
            }
          }
        )
      );
    }

    if (callbacks.onChildChanged) {
      unsubscribes.push(
        onChildChanged(
          dbRef,
          (snapshot) => {
            callbacks.onChildChanged!({
              id: snapshot.key,
              ...snapshot.val(),
            } as T);
          },
          (error) => {
            if (errorHandler) {
              errorHandler(error);
            } else {
              console.warn("Child changed subscription error:", error);
            }
          }
        )
      );
    }

    if (callbacks.onChildRemoved) {
      unsubscribes.push(
        onChildRemoved(
          dbRef,
          (snapshot) => {
            callbacks.onChildRemoved!({
              id: snapshot.key,
              ...snapshot.val(),
            } as T);
          },
          (error) => {
            if (errorHandler) {
              errorHandler(error);
            } else {
              console.warn("Child removed subscription error:", error);
            }
          }
        )
      );
    }

    return unsubscribes;
  }

  async batchWrite(
    operations: Array<{
      type: "create" | "update" | "delete";
      path: string;
      data?: Record<string, unknown>;
    }>
  ): Promise<void> {
    try {
      const updates: Record<string, unknown> = {};

      operations.forEach((operation) => {
        const { type, path, data } = operation;

        switch (type) {
          case "create":
            if (!data) throw new Error("Data is required for create operation");
            updates[path] = {
              ...data,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            };
            break;
          case "update":
            if (!data) throw new Error("Data is required for update operation");
            updates[path] = {
              ...data,
              updatedAt: serverTimestamp(),
            };
            break;
          case "delete":
            updates[path] = null;
            break;
        }
      });

      await update(ref(this.db), updates);
    } catch (error) {
      throw new Error(`Error in batch write: ${error}`);
    }
  }

  async documentExists(path: string): Promise<boolean> {
    try {
      const dbRef = ref(this.db, path);
      const snapshot = await get(dbRef);
      return snapshot.exists();
    } catch (error) {
      throw new Error(`Error checking document existence: ${error}`);
    }
  }

  async countDocuments(
    path: string,
    constraints: RealtimeQueryConstraint[] = []
  ): Promise<number> {
    try {
      const dbRef = ref(this.db, path);
      const dbQuery = this.buildQuery(dbRef, constraints);

      const snapshot = await get(dbQuery);
      return snapshot.exists() ? snapshot.size : 0;
    } catch (error) {
      throw new Error(`Error counting documents: ${error}`);
    }
  }

  generateUniqueId(): string {
    return push(ref(this.db, "temp")).key || "";
  }

  createTimestamp() {
    return serverTimestamp();
  }

  getRef(path: string): DatabaseReference {
    return ref(this.db, path);
  }

  getQuery(path: string): Query {
    return ref(this.db, path);
  }
}

export const realtimeDatabase = RealtimeDatabase.getInstance();

export const dbUtils = {
  createDocument: <T extends Record<string, unknown>>(
    path: string,
    data: T,
    documentId?: string
  ) => realtimeDatabase.createDocument(path, data, documentId),

  getDocument: <T>(path: string) => realtimeDatabase.getDocument<T>(path),

  updateDocument: <T extends Record<string, unknown>>(
    path: string,
    data: Partial<T>
  ) => realtimeDatabase.updateDocument(path, data),

  updateNestedField: (path: string, fieldPath: string, value: unknown) =>
    realtimeDatabase.updateNestedField(path, fieldPath, value),

  deleteDocument: (path: string) => realtimeDatabase.deleteDocument(path),

  queryDocuments: <T>(
    path: string,
    constraints: RealtimeQueryConstraint[] = []
  ) => realtimeDatabase.queryDocuments<T>(path, constraints),

  subscribeToDocument: <T>(
    path: string,
    callback: (data: T | null) => void,
    options?: RealtimeOptions
  ) => realtimeDatabase.subscribeToDocument(path, callback, options),

  subscribeToCollection: <T>(
    path: string,
    callback: (documents: T[]) => void,
    constraints?: RealtimeQueryConstraint[],
    options?: RealtimeOptions
  ) =>
    realtimeDatabase.subscribeToCollection(
      path,
      callback,
      constraints,
      options
    ),

  subscribeToChildEvents: <T>(
    path: string,
    callbacks: {
      onChildAdded?: (data: T) => void;
      onChildChanged?: (data: T) => void;
      onChildRemoved?: (data: T) => void;
    },
    options?: RealtimeOptions
  ) => realtimeDatabase.subscribeToChildEvents(path, callbacks, options),

  batchWrite: (
    operations: Array<{
      type: "create" | "update" | "delete";
      path: string;
      data?: Record<string, unknown>;
    }>
  ) => realtimeDatabase.batchWrite(operations),

  documentExists: (path: string) => realtimeDatabase.documentExists(path),

  countDocuments: (path: string, constraints?: RealtimeQueryConstraint[]) =>
    realtimeDatabase.countDocuments(path, constraints),

  generateUniqueId: () => realtimeDatabase.generateUniqueId(),

  createTimestamp: () => realtimeDatabase.createTimestamp(),

  getRef: (path: string) => realtimeDatabase.getRef(path),

  getQuery: (path: string) => realtimeDatabase.getQuery(path),
};

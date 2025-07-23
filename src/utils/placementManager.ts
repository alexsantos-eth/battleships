export interface PlacedObject {
  id: string;
  type: "rock" | "dock" | "ship" | "palmTree";
  position: [number, number, number];
  size: number;
  category?: string;
}

class PlacementManager {
  private placedObjects: PlacedObject[] = [];

  hasOverlap(x: number, y: number, size: number, category?: string): boolean {
    for (const obj of this.placedObjects) {
      if (category && obj.category && obj.category !== category) {
        continue;
      }

      const distance = Math.sqrt(
        Math.pow(x - obj.position[0], 2) + Math.pow(y - obj.position[1], 2)
      );
      const minRequiredDistance = (size + obj.size) / 2;
      if (distance < minRequiredDistance) {
        return true;
      }
    }
    return false;
  }

  canPlace(
    position: [number, number, number],
    size: number,
    category?: string
  ): boolean {
    return !this.hasOverlap(position[0], position[2], size, category);
  }

  place(
    position: [number, number, number],
    size: number,
    category?: string
  ): void {
    const id = `${category || "object"}_${Date.now()}_${Math.random()}`;
    this.addObject(id, "palmTree", position, size);

    const lastObject = this.placedObjects[this.placedObjects.length - 1];
    if (lastObject) {
      lastObject.category = category;
    }
  }

  clearCategory(category: string): void {
    this.placedObjects = this.placedObjects.filter(
      (obj) => obj.category !== category
    );
  }
  addObject(
    id: string,
    type: PlacedObject["type"],
    position: [number, number, number],
    size: number
  ): void {
    this.placedObjects.push({
      id,
      type,
      position,
      size,
    });
  }

  removeObject(id: string): void {
    this.placedObjects = this.placedObjects.filter((obj) => obj.id !== id);
  }

  getPlacedObjects(): PlacedObject[] {
    return [...this.placedObjects];
  }

  clear(): void {
    this.placedObjects = [];
  }
}

export const placementManager = new PlacementManager();

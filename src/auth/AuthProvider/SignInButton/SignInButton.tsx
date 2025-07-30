import { useState } from "react";

import { useAuth } from "@/auth/hooks/data/useAuth";

import type { SignInButtonProps } from "./SigninButton.types";

export const SignInButton: React.FC<SignInButtonProps> = ({
  className = "",
  children,
}) => {
  const { signInAnonymously } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signInAnonymously();
    } catch (error) {
      console.error("Sign in error:", error);
      setError("Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      <button
        onClick={handleSignIn}
        disabled={isLoading}
        className={`bg-blue-600 hover:bg-blue-700 disabled:bg-blue-500 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl w-full ${className}`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Signing in...
          </div>
        ) : (
          children || "Start Playing Anonymously"
        )}
      </button>
    </div>
  );
};

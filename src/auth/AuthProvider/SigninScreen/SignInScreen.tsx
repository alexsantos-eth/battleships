import { SignInButton } from "../SignInButton/SignInButton";

import type { SignInScreenProps } from "./SigninScreen.types";

export const SignInScreen: React.FC<SignInScreenProps> = ({ authError }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 max-w-md w-full mx-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-6">⚓ Armada.io</h1>
          <p className="text-blue-200 mb-8 text-lg">
            Welcome to the ultimate naval battle experience
          </p>

          {authError && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
              <p className="text-red-300 text-sm">{authError}</p>
            </div>
          )}

          <SignInButton>Start Playing Anonymously</SignInButton>

          <p className="text-blue-300 text-sm mt-4">
            No account required - just start playing!
          </p>

          <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <p className="text-blue-200 text-xs">
              <strong>Note:</strong> Firebase authentication is required for
              full functionality. Please configure your Firebase project to
              enable user profiles and game statistics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

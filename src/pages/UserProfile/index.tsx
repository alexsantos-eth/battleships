import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { LoadingScreen } from "@/components/LoadingScreen";
import UserStats from "@/components/UserStats";
import GameHistoryComponent from "@/components/GameHistory";
import LogoutButton from "@/components/LogoutButton";
import type { UserPreferences } from "@/types/user";

const UserProfilePage = () => {
  const { user } = useAuth();
  const { profile, isLoading, error, updatePreferences } = useUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="bg-red-500/20 backdrop-blur-sm rounded-lg p-6 border border-red-500/30">
          <h2 className="text-red-400 text-xl font-bold mb-2">Error</h2>
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="bg-blue-500/20 backdrop-blur-sm rounded-lg p-6 border border-blue-500/30">
          <h2 className="text-blue-400 text-xl font-bold mb-2">
            No User Found
          </h2>
          <p className="text-blue-300">Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  const handleEditPreferences = () => {
    setPreferences(profile.preferences);
    setIsEditing(true);
  };

  const handleSavePreferences = async () => {
    if (preferences) {
      await updatePreferences(preferences);
      setIsEditing(false);
      setPreferences(null);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setPreferences(null);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">User Profile</h1>
          <LogoutButton variant="default" />
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8 border border-white/20">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {profile.displayName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">
                {profile.displayName}
              </h2>
              <div className="flex space-x-4 text-gray-300">
                <span>Member since: {formatDate(profile.createdAt)}</span>
                <span>Last login: {formatDate(profile.lastLoginAt)}</span>
                {profile.isAnonymous && (
                  <span className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded text-sm">
                    Anonymous User
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6">
                Game Statistics
              </h3>
              <UserStats />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Preferences</h3>
                {!isEditing && (
                  <button
                    onClick={handleEditPreferences}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Edit
                  </button>
                )}
              </div>

              {isEditing && preferences ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Sound Effects
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.soundEnabled}
                        onChange={(e) =>
                          setPreferences({
                            ...preferences,
                            soundEnabled: e.target.checked,
                          })
                        }
                        className="mr-2"
                      />
                      <span className="text-white">Enabled</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Background Music
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.musicEnabled}
                        onChange={(e) =>
                          setPreferences({
                            ...preferences,
                            musicEnabled: e.target.checked,
                          })
                        }
                        className="mr-2"
                      />
                      <span className="text-white">Enabled</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Difficulty
                    </label>
                    <select
                      value={preferences.difficulty}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          difficulty: e.target.value as
                            | "easy"
                            | "medium"
                            | "hard",
                        })
                      }
                      className="w-full bg-white/20 border border-white/30 rounded px-3 py-2 text-white"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Theme
                    </label>
                    <select
                      value={preferences.theme}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          theme: e.target.value as "light" | "dark" | "auto",
                        })
                      }
                      className="w-full bg-white/20 border border-white/30 rounded px-3 py-2 text-white"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Language
                    </label>
                    <select
                      value={preferences.language}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          language: e.target.value,
                        })
                      }
                      className="w-full bg-white/20 border border-white/30 rounded px-3 py-2 text-white"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <button
                      onClick={handleSavePreferences}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Sound Effects:</span>
                    <span className="text-white">
                      {profile.preferences.soundEnabled
                        ? "Enabled"
                        : "Disabled"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Background Music:</span>
                    <span className="text-white">
                      {profile.preferences.musicEnabled
                        ? "Enabled"
                        : "Disabled"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Difficulty:</span>
                    <span className="text-white capitalize">
                      {profile.preferences.difficulty}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Theme:</span>
                    <span className="text-white capitalize">
                      {profile.preferences.theme}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Language:</span>
                    <span className="text-white">
                      {profile.preferences.language}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-6">Recent Games</h3>
            <GameHistoryComponent />
          </div>
        </div>

        {profile.achievements.length > 0 && (
          <div className="mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6">
                Achievements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profile.achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-4"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-yellow-900 font-bold">🏆</span>
                      </div>
                      <span className="text-white font-medium">
                        {achievement}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;

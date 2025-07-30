import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { useAuth } from "@/auth/hooks/data/useAuth";
import { useUserProfile } from "@/user/hooks/profile/useUserProfile";

import type { NavigationProps, NavItem } from "./Navigation.types";

export const Navigation: React.FC<NavigationProps> = ({ className = "" }) => {
  const { user, signOut } = useAuth();
  const { profile } = useUserProfile();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  if (!user) {
    return null;
  }

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems: NavItem[] = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/multiplayer", label: "Multiplayer", icon: "👥" },
    { path: "/match", label: "Play", icon: "🎮" },
    { path: "/debug", label: "Practice", icon: "🎯" },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.warn("Error signing out:", error);
    }
  };

  if (location.pathname.startsWith("/match")) {
    return null;
  }

  return (
    <nav
      className={`relative top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-lg border-b border-white/20 ${className}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-xl group-hover:scale-110 transition-transform duration-200">
              ⚓
            </span>
            <span className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors duration-200">
              Armada.io
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-1.5 rounded-md transition-all duration-200 flex items-center space-x-1.5 text-sm ${
                  isActive(item.path)
                    ? "bg-blue-600/80 text-white shadow-md"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <span className="text-sm">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {profile?.displayName?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <span className="hidden sm:block text-sm">
                  {profile?.displayName || "User"}
                </span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-black/90 backdrop-blur-lg rounded-lg shadow-xl border border-white/20 py-2">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    👤 View Profile
                  </Link>
                  <div className="border-t border-white/10 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors duration-200"
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white p-1.5 rounded-md hover:bg-white/10 transition-colors duration-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-white/10">
            <div className="flex flex-col space-y-1 pt-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md transition-all duration-200 flex items-center space-x-2 text-sm ${
                    isActive(item.path)
                      ? "bg-blue-600/80 text-white"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {isProfileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </nav>
  );
};

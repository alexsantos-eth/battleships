import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LogoutButton from '@/components/LogoutButton';

const Navigation = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return null;
  }

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/match', label: 'Play', icon: '🎮' },
    { path: '/playground', label: 'Practice', icon: '🎯' },
    { path: '/profile', label: 'Profile', icon: '👤' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">⚓</span>
            <span className="text-xl font-bold text-white">Armada.io</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <LogoutButton variant="minimal" />
          </div>

          <div className="md:hidden">
            <button className="text-white p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        <div className="md:hidden pb-4">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-3 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
            
            <div className="pt-2 border-t border-white/10">
              <LogoutButton variant="minimal" className="w-full justify-start px-4 py-3" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 
import { Menu, Notification, Setting2, Profile, LogoutCurve } from "iconsax-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
  const userName = adminUser?.name || 'Admin';
  const userInitials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/auth/login');
    setDropdownOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="flex items-center justify-between" style={{ padding: '16px 24px' }}>
        {/* Left side */}
        <div className="flex items-center" style={{ gap: '16px' }}>
          <button
            onClick={onMenuClick}
            className="lg:hidden rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            style={{ padding: '8px' }}
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">K-Pure Dashboard</h1>
        </div>

        {/* Right side */}
        <div className="flex items-center" style={{ gap: '16px' }}>
          {/* Notifications */}
          <button className="rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 relative" style={{ padding: '8px' }}>
            <Notification size={20} />
            <span className="absolute w-3 h-3 bg-red-500 rounded-full" style={{ top: '-4px', right: '-4px' }}></span>
          </button>

          {/* User dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center rounded-md hover:bg-gray-100"
              style={{ gap: '12px', padding: '8px' }}
            >
              <div className="w-8 h-8 bg-[#14A800] rounded-full flex items-center justify-center text-white text-sm font-medium">
                {userInitials}
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700">
                {userName}
              </span>
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute right-0 w-48 bg-white rounded-md shadow-lg border border-gray-100 z-50" style={{ marginTop: '8px' }}>
                <div style={{ padding: '4px 0' }}>
                  <div className="text-xs text-gray-500 border-b border-gray-100" style={{ padding: '8px 16px' }}>
                    {adminUser?.email || 'admin@kpure.com'}
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center text-sm text-gray-700 hover:bg-gray-100"
                    style={{ padding: '8px 16px' }}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Profile size={16} style={{ marginRight: '12px' }} />
                    Profil
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center text-sm text-gray-700 hover:bg-gray-100"
                    style={{ padding: '8px 16px' }}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Setting2 size={16} style={{ marginRight: '12px' }} />
                    Paramètres
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-sm text-red-600 hover:bg-red-50"
                    style={{ padding: '8px 16px' }}
                  >
                    <LogoutCurve size={16} style={{ marginRight: '12px' }} />
                    Se déconnecter
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

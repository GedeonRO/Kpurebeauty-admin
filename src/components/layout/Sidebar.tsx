import { Link, useLocation, useNavigate } from "react-router";
import {
  Home2,
  ShoppingCart,
  Box,
  User,
  Category,
  Star,
  Gift,
  TicketDiscount,
  LogoutCurve,
  CloseSquare,
  Layer,
} from "iconsax-react";

interface NavItem {
  name: string;
  path: string;
  icon: any;
}

const navItems: NavItem[] = [
  { name: "Dashboard", path: "/", icon: Home2 },
  { name: "Commandes", path: "/orders", icon: ShoppingCart },
  { name: "Catégories", path: "/categories", icon: Category },
  { name: "Produits", path: "/products", icon: Box },
  { name: "Routines", path: "/routines", icon: Layer },
  { name: "Clients", path: "/customers", icon: User },
  { name: "Reviews", path: "/reviews", icon: Star },
  { name: "Promotions", path: "/promotions", icon: Gift },
  { name: "Coupons", path: "/coupons", icon: TicketDiscount },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/auth/login');
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-100 ${
          open ? 'flex' : ''
        } ${open ? 'fixed inset-y-0 left-0 z-50 w-64 shadow-lg' : ''}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-gray-100" style={{ padding: '24px' }}>
          <div className="flex items-center" style={{ gap: '12px' }}>
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">K-Pure Admin</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden rounded-md text-gray-400 hover:text-gray-600"
            style={{ padding: '4px' }}
          >
            <CloseSquare size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="" style={{ padding: '0 12px' , marginTop: 24 }}>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center text-sm font-medium rounded-md transition-colors ${
                      active
                        ? 'bg-[#14A800] text-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    style={{ padding: '8px 12px' }}
                  >
                    <Icon
                      size={20}
                      variant={active ? 'Bold' : 'Outline'}
                      style={{ marginRight: '12px' }}
                    />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-100" style={{ padding: '24px' }}>
          <button
            onClick={handleLogout}
            className="flex items-center w-full text-sm text-red-600 hover:text-red-700 font-medium"
            style={{ padding: '8px 12px' }}
          >
            <LogoutCurve size={20} style={{ marginRight: '12px' }} />
            Se déconnecter
          </button>
        </div>
      </div>
    </>
  );
}

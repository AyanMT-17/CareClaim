import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils.js";
import {
  Shield,
  BarChart3,
  FileText,
  Settings,
  User,
  Menu,
  X,
  LogOut,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Submit Claim", href: "/submit", icon: FileText },
  { name: "My Claims", href: "/claims", icon: Shield },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, this would clear auth tokens, etc.
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Navigation */}
      <nav className="glass-effect border-b border-neon-cyan/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Logo */}
              <Link to="/dashboard" className="flex items-center space-x-3">
                <div className="relative">
                  <Shield className="h-8 w-8 text-neon-cyan animate-pulse-neon" />
                  <div className="absolute inset-0 h-8 w-8 bg-neon-cyan/20 rounded-full blur-sm"></div>
                </div>
                <span className="text-xl font-bold gradient-neon-text">
                  CareClaim
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:ml-8 md:flex md:space-x-4">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2",
                        isActive
                          ? "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 text-neon-glow"
                          : "text-gray-300 hover:text-neon-cyan hover:bg-neon-cyan/5"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* User Profile */}
              <div className="hidden md:flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple flex items-center justify-center">
                  <User className="h-4 w-4 text-dark-bg" />
                </div>
                <span className="text-sm text-gray-300">John Doe</span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="hidden md:flex text-gray-300 hover:text-neon-cyan hover:bg-neon-cyan/10"
              >
                <LogOut className="h-4 w-4" />
              </Button>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden text-gray-300 hover:text-neon-cyan"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-effect border-t border-neon-cyan/20">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium transition-all duration-200",
                      isActive
                        ? "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30"
                        : "text-gray-300 hover:text-neon-cyan hover:bg-neon-cyan/5"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              <div className="border-t border-neon-cyan/20 pt-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-300 hover:text-neon-cyan hover:bg-neon-cyan/10"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>
    </div>
  );
}

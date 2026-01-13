import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
  Leaf,
  Home,
  Camera,
  BarChart3,
  Cloud,
  Tractor,
  FileText,
  User,
  LogIn,
  Users
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import LoginModal from "@/components/LoginModal";
import React from "react";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Disease Detection", href: "/disease-detection", icon: Camera },

  { name: "Weather", href: "/weather", icon: Cloud },
  { name: "Machinery", href: "/machinery", icon: Tractor },
  { name: "Schemes", href: "/schemes", icon: FileText },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Credits", href: "/credits", icon: Users },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (href: string) => location.pathname === href;

  // Listen for login modal open events
  React.useEffect(() => {
    const handleOpenLogin = () => setLoginModalOpen(true);
    const rootElement = document.getElementById('root');

    if (rootElement) {
      rootElement.addEventListener('openLoginModal', handleOpenLogin);
      return () => rootElement.removeEventListener('openLoginModal', handleOpenLogin);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-primary">FarmConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-1 lg:space-x-2 text-sm font-medium transition-colors hover:text-primary ${isActive(item.href)
                    ? "text-primary border-b-2 border-primary pb-1"
                    : "text-muted-foreground"
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{item.name}</span>
                </Link>
              );
            })}

            {/* Auth Button */}
            {user ? (
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            ) : (
              <Button size="sm" onClick={() => setLoginModalOpen(true)}>
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 text-sm font-medium p-3 rounded-lg transition-colors ${isActive(item.href)
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                        }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container py-6 md:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-primary">
                  <Leaf className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-primary">FarmConnect</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering farmers with technology and data-driven insights for better agriculture.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Features</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Disease Detection</li>

                <li>Weather Insights</li>
                <li>Machinery Rental</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Government Schemes</li>
                <li>Training Resources</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Connect</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Community Forum</li>
                <li>Expert Network</li>
                <li>Local Dealers</li>
                <li>Success Stories</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 FarmConnect · <Link to="/credits" className="hover:text-primary transition-colors">Credits</Link></p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </div>
  );
}
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
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
  Users,
  Bot
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import LoginModal from "@/components/LoginModal";
import React from "react";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Disease Detection", href: "/disease-detection", icon: Camera },
  { name: "Crops", href: "/crops", icon: Leaf },
  { name: "Weather", href: "/weather", icon: Cloud },
  { name: "Assistant", href: "/assistant", icon: Bot },
  { name: "Machinery", href: "/machinery", icon: Tractor },
  { name: "Schemes", href: "/schemes", icon: FileText },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Team", href: "/team", icon: Users },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (href: string) => location.pathname === href;
  const isAssistantPage = location.pathname === "/assistant";

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
        <div className="container flex h-14 items-center justify-between sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-primary sm:text-xl">FarmConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-4 2xl:space-x-6">
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
            <SheetTrigger asChild className="xl:hidden">
              <Button variant="ghost" size="icon" className="tap-target">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[88vw] max-w-sm px-4">
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>
              <div className="mt-8 flex flex-col space-y-3">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`tap-target flex items-center space-x-3 rounded-lg p-3 text-sm font-medium transition-colors ${isActive(item.href)
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
              <div className="mt-6 border-t pt-4">
                {user ? (
                  <Button variant="outline" className="w-full tap-target" onClick={logout}>
                    Logout
                  </Button>
                ) : (
                  <Button className="w-full tap-target" onClick={() => setLoginModalOpen(true)}>
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {!isAssistantPage && (
        <Link
          to="/assistant"
          className="fixed bottom-4 right-4 z-50 flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-[1.02] hover:bg-primary/90 sm:bottom-5 sm:right-5 sm:h-14 sm:px-5"
          aria-label="Open AI Assistant"
        >
          <Bot className="h-5 w-5" />
          <span className="hidden sm:inline">Ask AI</span>
        </Link>
      )}

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
              <h3 className="font-semibold mb-3">Support & Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/schemes" className="hover:text-primary transition-colors">Government Schemes</Link></li>
                <li><Link to="/weather" className="hover:text-primary transition-colors">Agricultural Weather Guide</Link></li>
                <li><Link to="/disease-detection" className="hover:text-primary transition-colors">Crop Disease Detection</Link></li>
                <li><Link to="/machinery" className="hover:text-primary transition-colors">Machinery Marketplace</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Brand & Trust</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/team" className="hover:text-primary transition-colors">Our Team</Link></li>
                <li><a href="https://farmbro.vercel.app/sitemap.xml" className="hover:text-primary transition-colors">Site Map</a></li>
                <li><Link to="/profile" className="hover:text-primary transition-colors">Expert Network</Link></li>
                <li>Success Stories</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 FarmConnect · The Smart Agriculture Platform · Powered by Vercel</p>
            <p>Developed with passion by the FarmConnect Team · <Link to="/team" className="hover:text-primary transition-colors underline decoration-dotted">Meet the Team</Link></p>
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

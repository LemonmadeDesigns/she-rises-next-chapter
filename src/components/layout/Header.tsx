import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, User, LogOut, Settings, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from '@supabase/supabase-js';
import logo from "@/assets/she-rises-logo-new.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { state: cartState } = useCart();
  const { theme, setTheme } = useTheme();

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let mounted = true;

    // Get current session first
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setUser(session?.user ?? null);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (mounted) {
          setUser(session?.user ?? null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  // Check admin status via API call to backend
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      // Try to query visit_requests - only admins have access via RLS
      const { error } = await supabase
        .from('visit_requests')
        .select('id')
        .limit(1);

      setIsAdmin(!error);
    };

    checkAdminStatus();
  }, [user]);

  const navigation = [
    { name: "About", href: "/about" },
    { name: "Programs", href: "/programs" },
    { name: "Events", href: "/events" },
    { name: "Get Involved", href: "/get-involved" },
    { name: "Contact", href: "/contact" },
    { name: "Shop", href: "/shop" },
  ];

  const isActive = (href: string) => location.pathname === href;

  // Mask email to prevent harvesting
  const maskEmail = (email: string): string => {
    const [localPart, domain] = email.split('@');
    if (!localPart || !domain) return 'User';

    // Show first 2 chars and last char of local part
    const maskedLocal = localPart.length > 3
      ? `${localPart.slice(0, 2)}***${localPart.slice(-1)}`
      : `${localPart.slice(0, 1)}***`;

    return `${maskedLocal}@${domain}`;
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled || isMenuOpen
          ? "bg-deep-plum dark:bg-card backdrop-blur-lg shadow-lg"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className={cn(
          "flex items-center justify-between transition-all duration-300",
          scrolled ? "h-16 md:h-20" : "h-20 md:h-32"
        )}>
          {/* Logo - Responsive sizing, properly contained */}
          <Link to="/" className="flex items-center space-x-3">
            <img
              src={logo}
              alt="She Rises - Safe Haven for Empowerment logo"
              className={cn(
                "object-contain logo-bordered drop-shadow-2xl transition-all duration-300",
                scrolled ? "h-10 md:h-14" : "h-14 md:h-24"
              )}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-all duration-200 relative group",
                  isActive(item.href)
                    ? "text-rose-gold"
                    : scrolled
                      ? "text-white dark:text-foreground/90 hover:text-rose-gold"
                      : "text-white/90 hover:text-rose-gold"
                )}
              >
                {item.name}
                <span className={cn(
                  "absolute bottom-0 left-0 w-full h-0.5 bg-rose-gold transition-transform duration-200",
                  isActive(item.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                )}></span>
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={cn(
                "rounded-full hover:bg-white/10",
                scrolled
                  ? "text-white dark:text-foreground"
                  : "text-white"
              )}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            <Link to="/cart">
              <Button className="cart-button">
                <ShoppingCart className="h-5 w-5 cart-icon" />
                {cartState.itemCount > 0 && (
                  <span className="cart-badge">
                    {cartState.itemCount}
                  </span>
                )}
              </Button>
            </Link>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 rounded-full border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-sm"
                  >
                    <User className="h-4 w-4" />
                    <span className="max-w-[100px] truncate">{maskEmail(user.email || '')}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button
                  size="sm"
                  className="rounded-full bg-deep-plum text-white hover:bg-deep-plum/80 border-2 border-white/20 px-6 transition-all duration-300 shadow-lg"
                >
                  Sign In
                </Button>
              </Link>
            )}

            <Link to="/donate">
              <Button
                size="sm"
                className="bg-rose-gold hover:bg-rose-gold/90 text-white font-semibold rounded-full px-6 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Donate
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <Link to="/cart">
              <Button className="cart-button">
                <ShoppingCart className="h-5 w-5 cart-icon" />
                {cartState.itemCount > 0 && (
                  <span className="cart-badge">
                    {cartState.itemCount}
                  </span>
                )}
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={cn(
                scrolled
                  ? "text-white dark:text-foreground"
                  : "text-white"
              )}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-deep-plum dark:bg-card border-t border-white/10 shadow-xl z-50 backdrop-blur-lg">
            <div className="px-4 pt-4 pb-4 space-y-2 max-w-full overflow-x-hidden">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "block px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 text-center",
                    isActive(item.href)
                      ? "text-[#fbd051] bg-[#fbd051]/20 border border-[#fbd051]/30"
                      : "text-white dark:text-foreground/90 hover:text-[#fbd051] hover:bg-white/10 border border-transparent"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Theme Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-white/10 border-white/20 text-white dark:text-foreground hover:bg-white/20"
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="h-4 w-4" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4" />
                    <span>Dark Mode</span>
                  </>
                )}
              </Button>

              {user ? (
                <div className="px-4 py-3 space-y-2 bg-white/5 rounded-lg border border-white/10 mt-2">
                  <p className="text-sm text-white/70 dark:text-foreground/70 text-center">Signed in as:</p>
                  <p className="text-sm font-medium text-white dark:text-foreground truncate text-center">{maskEmail(user.email || '')}</p>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full bg-white/10 border-white/20 text-white dark:text-foreground hover:bg-white/20">
                        <Settings className="h-4 w-4 mr-2" />
                        Admin Dashboard
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-white/10 border-white/20 text-white dark:text-foreground hover:bg-white/20"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full mt-2 bg-white/10 border-white/20 text-white dark:text-foreground hover:bg-[#fbd051] hover:text-deep-plum hover:border-[#fbd051]">
                    Sign In
                  </Button>
                </Link>
              )}

              <Link to="/donate" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full mt-2 bg-[#fbd051] hover:bg-[#fbd051]/90 text-[#3D2645] font-semibold shadow-lg">
                  Donate
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
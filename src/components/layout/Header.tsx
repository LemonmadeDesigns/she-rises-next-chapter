import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, User, LogOut, Settings } from "lucide-react";
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
  const location = useLocation();
  const { state: cartState } = useCart();

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

  return (
    <header className="sticky top-0 z-50 backdrop-blur border-b border-border" style={{ backgroundColor: '#673ab7c2' }}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img
              src={logo}
              alt="She Rises - Safe Haven for Empowerment logo with lotus flower and crowned woman silhouette"
              className="h-16 w-auto object-contain logo-bordered"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-[#fbd051]",
                  isActive(item.href)
                    ? "text-[#fbd051] border-b-2 border-[#fbd051] pb-1"
                    : "text-foreground/80"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
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
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="max-w-[100px] truncate">{user.email}</span>
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
                <Button variant="outline" size="sm" className="hover:bg-[#673ab7] hover:text-white hover:border-[#673ab7]">
                  Sign In
                </Button>
              </Link>
            )}
            
            <Link to="/donate">
              <Button 
                size="sm"
                className="bg-crown-gold hover:bg-crown-gold/90 text-royal-plum font-semibold"
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
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "block px-3 py-2 text-base font-medium rounded-md transition-colors",
                    isActive(item.href)
                      ? "text-[#fbd051] bg-[#fbd051]/10"
                      : "text-foreground hover:text-[#fbd051] hover:bg-muted"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {user ? (
                <div className="px-3 py-2 space-y-2">
                  <p className="text-sm text-muted-foreground">Signed in as:</p>
                  <p className="text-sm font-medium truncate">{user.email}</p>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full">
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
                    className="w-full"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full mt-2 hover:bg-[#673ab7] hover:text-white hover:border-[#673ab7]">
                    Sign In
                  </Button>
                </Link>
              )}
              
              <Link to="/donate" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full mt-2 bg-crown-gold hover:bg-crown-gold/90 text-royal-plum font-semibold">
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
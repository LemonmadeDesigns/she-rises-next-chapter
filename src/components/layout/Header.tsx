import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import logo from "@/assets/she-rises-logo-transparent.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { state: cartState } = useCart();

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
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src={logo} 
              alt="She Rises - Safe Haven for Empowerment logo with lotus flower and crowned woman silhouette" 
              className="h-16 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-royal-plum",
                  isActive(item.href) 
                    ? "text-royal-plum border-b-2 border-crown-gold pb-1" 
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
              <Button variant="outline" size="sm" className="relative">
                <ShoppingCart className="h-4 w-4" />
                {cartState.itemCount > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-lotus-rose text-white"
                  >
                    {cartState.itemCount}
                  </Badge>
                )}
              </Button>
            </Link>
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
              <Button variant="outline" size="sm" className="relative">
                <ShoppingCart className="h-4 w-4" />
                {cartState.itemCount > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-lotus-rose text-white"
                  >
                    {cartState.itemCount}
                  </Badge>
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
                      ? "text-royal-plum bg-crown-gold/10"
                      : "text-foreground hover:text-royal-plum hover:bg-muted"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
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
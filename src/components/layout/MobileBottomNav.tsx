import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  GraduationCap,
  Calendar,
  ShoppingBag,
  Heart,
  MoreHorizontal,
  Info,
  HandHeart,
  Mail,
  User,
  LogOut,
  Settings,
  Moon,
  Sun,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";

const primaryTabs = [
  { name: "Home", href: "/", icon: Home },
  { name: "Programs", href: "/programs", icon: GraduationCap },
  { name: "Events", href: "/events", icon: Calendar },
  { name: "Shop", href: "/shop", icon: ShoppingBag },
  { name: "Donate", href: "/donate", icon: Heart },
];

const moreLinks = [
  { name: "About", href: "/about", icon: Info },
  { name: "Get Involved", href: "/get-involved", icon: HandHeart },
  { name: "Contact", href: "/contact", icon: Mail },
];

const MobileBottomNav = () => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (mounted) setUser(session?.user ?? null);
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const check = async () => {
      if (!user) return setIsAdmin(false);
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!data);
    };
    check();
  }, [user]);

  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setMoreOpen(false);
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-card border-t border-border shadow-[0_-4px_12px_rgba(0,0,0,0.08)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Primary mobile navigation"
    >
      <ul className="grid grid-cols-6 h-16">
        {primaryTabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.href);
          return (
            <li key={tab.name}>
              <Link
                to={tab.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 h-full text-[10px] font-medium transition-colors",
                  active ? "text-rose-gold" : "text-deep-plum/70 dark:text-foreground/70 hover:text-rose-gold"
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                <span className="leading-tight">{tab.name}</span>
              </Link>
            </li>
          );
        })}

        <li>
          <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
            <SheetTrigger asChild>
              <button
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 h-full w-full text-[10px] font-medium transition-colors",
                  moreOpen ? "text-rose-gold" : "text-deep-plum/70 dark:text-foreground/70 hover:text-rose-gold"
                )}
                aria-label="More menu"
              >
                <MoreHorizontal className="h-5 w-5" />
                <span className="leading-tight">More</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl max-h-[80vh] overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-left text-deep-plum">Menu</SheetTitle>
              </SheetHeader>

              <div className="mt-4 space-y-2">
                {moreLinks.map((l) => {
                  const Icon = l.icon;
                  return (
                    <Link
                      key={l.name}
                      to={l.href}
                      onClick={() => setMoreOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-foreground"
                    >
                      <Icon className="h-5 w-5 text-rose-gold" />
                      <span className="font-medium">{l.name}</span>
                    </Link>
                  );
                })}

                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMoreOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-foreground"
                  >
                    <Settings className="h-5 w-5 text-rose-gold" />
                    <span className="font-medium">Admin Dashboard</span>
                  </Link>
                )}
              </div>

              <div className="mt-4 border-t pt-4 space-y-2">
                <Button
                  variant="outline"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="w-full justify-start gap-3"
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </Button>

                {user ? (
                  <Button
                    variant="outline"
                    onClick={handleSignOut}
                    className="w-full justify-start gap-3"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                ) : (
                  <Link to="/auth" onClick={() => setMoreOpen(false)}>
                    <Button className="w-full justify-start gap-3 bg-deep-plum text-white hover:bg-deep-plum/90">
                      <User className="h-4 w-4" />
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </li>
      </ul>
    </nav>
  );
};

export default MobileBottomNav;

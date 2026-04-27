import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import BackToTop from "@/components/ui/BackToTop";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      {/* Spacer so the mobile bottom navbar never covers footer content */}
      <div
        className="md:hidden"
        style={{ height: `calc(4rem + env(safe-area-inset-bottom))` }}
        aria-hidden="true"
      />
      <BackToTop />
    </div>
  );
};

export default Layout;
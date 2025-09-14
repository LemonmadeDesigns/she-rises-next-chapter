import { Link } from "react-router-dom";
import { Instagram, Mail, Phone } from "lucide-react";
import logo from "@/assets/she-rises-logo-transparent.png";

const Footer = () => {
  const navigation = [
    { name: "About", href: "/about" },
    { name: "Programs", href: "/programs" },
    { name: "Events", href: "/events" },
    { name: "Get Involved", href: "/get-involved" },
    { name: "Contact", href: "/contact" },
    { name: "Shop", href: "/shop" },
  ];

  const hotlines = [
    { name: "National Domestic Violence", number: "800-799-7233" },
    { name: "Suicide & Crisis Lifeline", number: "988" },
    { name: "SAMHSA Helpline", number: "800-662-4357" },
    { name: "Homeless Outreach", number: "211" },
  ];

  return (
    <footer className="bg-royal-plum text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Mission */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img src={logo} alt="She Rises logo" className="h-12 w-12 rounded-full" />
              <div>
                <div className="font-serif font-bold text-xl">SHE RISES</div>
                <div className="text-sm text-white/80">Safe Haven for Empowerment</div>
              </div>
            </div>
            <p className="text-white/90 mb-4 max-w-md">
              Every woman has a story... here we help you write the next chapter.
            </p>
            <div className="italic text-lotus-rose font-serif text-lg">
              "When SHE rises, we all rise."
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.href}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link 
                  to="/donate"
                  className="text-crown-gold hover:text-crown-gold/80 font-semibold transition-colors"
                >
                  Donate
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Hotlines */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact & Support</h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-crown-gold" />
                <a href="tel:+19095479998" className="text-white/80 hover:text-white">
                  (909) 547-9998
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-crown-gold" />
                <a 
                  href="mailto:pransom@safehavenforempowerment.org" 
                  className="text-white/80 hover:text-white text-sm"
                >
                  pransom@safehavenforempowerment.org
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Instagram className="h-4 w-4 text-crown-gold" />
                <a 
                  href="https://instagram.com/SheRises.Mission" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white"
                >
                  @SheRises.Mission
                </a>
              </div>
            </div>

            <div className="text-xs text-white/60">
              <div className="font-semibold mb-1">Emergency Hotlines:</div>
              {hotlines.map((hotline, index) => (
                <div key={index} className="mb-1">
                  {hotline.name}: <a href={`tel:${hotline.number}`} className="underline">{hotline.number}</a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-white/60 text-sm mb-4 md:mb-0">
            © 2025 She Rises - Safe Haven for Empowerment. All rights reserved.
          </div>
          <div className="flex space-x-4 text-sm">
            <Link to="/privacy" className="text-white/60 hover:text-white">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-white/60 hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
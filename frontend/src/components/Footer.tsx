import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as LucideIcons from "lucide-react";
import { Loader2 } from "lucide-react";

// API Configuration
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001';

interface FooterData {
  companyName: string;
  copyright: string;
  links: Array<{ label: string; url: string }>;
  socialLinks: Array<{ platform: string; url: string; icon: string }>;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
}

// Icon mapping helper
const getIconComponent = (iconName: string) => {
  const IconComponent = (LucideIcons as any)[iconName];
  return IconComponent || null;
};

export const Footer = () => {
  const { i18n } = useTranslation();
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [loading, setLoading] = useState(true);

  // Get current language
  const getCurrentLang = () => {
    const lang = i18n.language || 'en';
    return lang.startsWith('de') ? 'de' : 'en';
  };

  const [currentLang, setCurrentLang] = useState(getCurrentLang());

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      const newLang = lng.startsWith('de') ? 'de' : 'en';
      setCurrentLang(newLang);
    };

    setCurrentLang(getCurrentLang());
    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  // Fetch footer data from API
  useEffect(() => {
    const fetchFooter = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/api/footer?lang=${currentLang}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch footer: ${response.status}`);
        }
        
        const data = await response.json();
        setFooterData(data.footer);
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('Error fetching footer:', err);
        }
        // Fallback to default
        setFooterData({
          companyName: 'Don Va',
          copyright: currentLang === 'de' ? '© 2025 Don Va. Alle Rechte vorbehalten.' : '© 2025 Don Va. All rights reserved.',
          links: [
            { label: 'Privacy', url: '/privacy' },
            { label: 'Terms', url: '/terms' },
          ],
          socialLinks: [],
          contact: {
            email: '',
            phone: '',
            address: '',
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFooter();
  }, [currentLang]);

  if (loading) {
    return (
      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8">
          <div className="flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-gold" />
          </div>
        </div>
      </footer>
    );
  }

  if (!footerData) return null;

  return (
    <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm mt-12">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-gold to-yellow-600 rounded-lg flex items-center justify-center">
                <span className="text-black font-extrabold text-sm">D</span>
              </div>
              <span className="text-lg font-bold">{footerData.companyName}</span>
            </div>
            {footerData.contact.email && (
              <p className="text-sm text-muted-foreground mb-1">{footerData.contact.email}</p>
            )}
            {footerData.contact.phone && (
              <p className="text-sm text-muted-foreground mb-1">{footerData.contact.phone}</p>
            )}
            {footerData.contact.address && (
              <p className="text-sm text-muted-foreground">{footerData.contact.address}</p>
            )}
          </div>

          {/* Links */}
          {footerData.links.length > 0 && (
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {footerData.links.map((link, idx) => (
                  <li key={idx}>
                    <a 
                      href={link.url} 
                      className="text-sm text-muted-foreground hover:text-gold transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Social Links */}
          {footerData.socialLinks.length > 0 && (
            <div>
              <h3 className="font-semibold mb-4">Follow Us</h3>
              <div className="flex gap-4">
                {footerData.socialLinks.map((social, idx) => {
                  const IconComponent = getIconComponent(social.icon);
                  return (
                    <a
                      key={idx}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg bg-slate-800/50 hover:bg-gold/20 border border-slate-700/50 hover:border-gold/50 flex items-center justify-center text-muted-foreground hover:text-gold transition-all"
                    >
                      {IconComponent && <IconComponent className="w-5 h-5" />}
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            {footerData.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};


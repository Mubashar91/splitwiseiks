import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

import { useTranslation } from "react-i18next";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'de', name: 'German' }
  ];

  const navItems = [
    { name: t("nav.services"), href: "#services" },
    { name: t("nav.howItWorks"), href: "#how-it-works" },
    { name: t("nav.pricing"), href: "#pricing" },
    { name: t("nav.testimonials"), href: "#testimonials" },
    { name: t("nav.faq"), href: "#faq" },
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng).then(() => {
      setCurrentLanguage(lng);
      localStorage.setItem('i18nextLng', lng);
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else setTheme("light");
  };

  const getThemeIcon = () => {
    const currentTheme = theme === "system" || !theme ? "light" : theme;
    return (
      <motion.div
        key={currentTheme}
        initial={{ scale: 0.5, rotate: -180, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        exit={{ scale: 0.5, rotate: 180, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {currentTheme === "light" ? (
          <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
        ) : (
          <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
        )}
      </motion.div>
    );
  };

  const handleNavClick = async (hash: string) => {
    const id = hash.replace('#', '');
    // If we're not on the homepage, navigate to it with the hash
    if (location.pathname !== '/') {
      navigate(`/${hash}`);
      setIsOpen(false);
      return;
    }

    // Already on homepage: just smooth scroll
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng') || i18n.language;
    if (savedLanguage) {
      // Change i18n language; currentLanguage will be updated on manual changes
      i18n.changeLanguage(savedLanguage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-black/5"
          : "bg-background/80 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-6 lg:px-10 xl:px-12">
        <div className="flex items-center justify-between h-16 sm:h-18 md:h-[72px] lg:h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center space-x-2 sm:space-x-3"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-9 md:h-9 lg:w-10 lg:h-10 bg-gold rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110">
              <span className="text-black font-bold text-base sm:text-lg md:text-lg lg:text-xl">D</span>
            </div>
            <span className="text-lg sm:text-xl md:text-xl lg:text-2xl font-bold text-foreground hover:text-gold transition-colors duration-300">Don Va</span>
          </motion.div>

          {/* Desktop Navigation - Show on medium screens and up */}
          <div className="hidden md:flex items-center space-x-2 md:space-x-3 lg:space-x-6 xl:space-x-8">
            {navItems.map((item, index) => (
              <motion.button
                type="button"
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="relative text-foreground hover:text-gold transition-all duration-300 font-medium text-sm md:text-sm lg:text-base px-2 md:px-2.5 lg:px-3 py-2 rounded-lg hover:bg-gold/10 group whitespace-nowrap"
              >
                {item.name}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gold group-hover:w-3/4 transition-all duration-300" />
              </motion.button>
            ))}
          </div>

          {/* Desktop Actions - Show on medium screens and up */}
          <div className="hidden md:flex items-center space-x-2 md:space-x-2.5 lg:space-x-3 xl:space-x-4">
            {/* Language Selector (single toggle) */}
            <motion.div
              className="relative flex items-center"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const nextLang = currentLanguage === "en" ? "de" : "en";
                  changeLanguage(nextLang);
                }}
                className="px-2 py-1 text-xs md:text-xs lg:text-sm hover:bg-gold/10 hover:text-gold"
                aria-label="Change language"
              >
                {(currentLanguage || 'en').toUpperCase()}
              </Button>
            </motion.div>

            {/* Theme Toggle */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="relative hover:bg-gold/10 hover:text-gold w-9 h-9 md:w-9 md:h-9 lg:w-10 lg:h-10 transition-all duration-300 hover:scale-110 overflow-hidden"
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait">
                  {getThemeIcon()}
                </AnimatePresence>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Button
                variant="gold-outline"
                size="sm"
                onClick={() => navigate(`/contact`)}
                className="text-sm md:text-sm lg:text-base px-4 md:px-4 lg:px-6 py-2 md:py-2 lg:py-2 cursor-pointer hover:shadow-gold transition-all duration-300 hover:scale-105 font-semibold whitespace-nowrap"
              >
                {t("nav.contact")}
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
            >
              <Button
                variant="gold"
                size="sm"
                onClick={() => navigate(`/book-meeting`)}
                className="text-sm md:text-sm lg:text-base px-4 md:px-4 lg:px-7 py-2 md:py-2 lg:py-2.5 cursor-pointer hover:shadow-lg hover:shadow-gold/30 transition-all duration-300 hover:scale-105 font-semibold whitespace-nowrap"
              >
                {t("nav.getStarted")}
              </Button>
            </motion.div>
          </div>

          {/* Mobile/Tablet Menu Button - Show on small/medium screens */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:hidden flex items-center space-x-2"
          >
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const currentLangIndex = languages.findIndex(lang => lang.code === currentLanguage);
                  const nextLang = languages[(currentLangIndex + 1) % languages.length];
                  changeLanguage(nextLang.code);
                }}
                className="hover:bg-gold/10 hover:text-gold w-9 h-9 transition-all duration-300"
                aria-label="Change language"
              >
                <div className="flex items-center justify-center w-5 h-5">
                  <span className="text-sm font-medium">{(currentLanguage || 'en').toUpperCase()}</span>
                </div>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="hover:bg-gold/10 hover:text-gold w-9 h-9 transition-all duration-300"
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait">
                  {getThemeIcon()}
                </AnimatePresence>
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="hover:bg-gold/10 hover:text-gold w-9 h-9 transition-all duration-300"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isOpen ? "close" : "open"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </motion.div>
              </AnimatePresence>
            </Button>
          </motion.div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden bg-background/98 backdrop-blur-xl border-t border-border/50 shadow-lg"
            >
              <div className="py-3 space-y-1">
                {navItems.map((item, index) => (
                  <motion.button
                    type="button"
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="block w-full text-left text-foreground hover:text-gold hover:bg-gold/10 active:bg-gold/20 transition-all duration-200 font-medium py-3 px-4 rounded-lg mx-2"
                  >
                    {item.name}
                  </motion.button>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: navItems.length * 0.05 }}
                  className="pt-3 px-3 border-t border-border/50"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="gold-outline"
                      onClick={() => {
                        navigate(`/contact`);
                        setIsOpen(false);
                      }}
                      className="w-full text-base py-3 cursor-pointer font-semibold hover:shadow-gold transition-all duration-300"
                    >
                      {t("nav.contact")}
                    </Button>
                    <Button
                      variant="gold"
                      onClick={() => {
                        navigate(`/book-meeting`);
                        setIsOpen(false);
                      }}
                      className="w-full text-base py-3 cursor-pointer font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      {t("nav.getStarted")}
                    </Button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};
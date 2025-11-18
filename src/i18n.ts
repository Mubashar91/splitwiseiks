import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English translations
const en = {
  nav: {
    services: "Services",
    howItWorks: "How It Works",
    pricing: "Pricing",
    testimonials: "Testimonials",
    faq: "FAQ",
    contact: "Contact",
    getStarted: "Get Started",
    bookMeeting: "Book a Meeting"
  },
  hero: {
    title: "Scale Your Business with Dedicated Virtual Assistants",
    subtitle: "Hire pre-vetted, German-speaking virtual assistants for 80% less than local hires. Scale your team in days, not months.",
    ctaPrimary: "Get Started Today",
    ctaSecondary: "How It Works",
    tagline: "Trusted by 200+ Growing Businesses",
    stats: {
      clients: "Clients",
      costSaved: "Cost Saved",
      rating: "Rating"
    }
  },
  services: {
    title: "Our Services",
    subtitle: "Comprehensive virtual assistance for all your business needs",
    socialMedia: {
      title: "Social Media Management",
      description: "Content creation, scheduling, and engagement management across all platforms",
      benefit: "3-5x increase in engagement rates"
    },
    customerSupport: {
      title: "Customer Support",
      description: "Email, chat, and phone support with native language proficiency",
      benefit: "95%+ customer satisfaction scores"
    },
    backOffice: {
      title: "Back-Office & Admin",
      description: "Data entry, email management, calendar coordination, and document processing",
      benefit: "Save 20+ hours per week"
    },
    seo: {
      title: "SEO & Content",
      description: "Blog writing, keyword research, on-page optimization, and link building",
      benefit: "2x organic traffic growth"
    }
  }
};

// German translations
const de = {
  nav: {
    services: "Dienstleistungen",
    howItWorks: "Wie es funktioniert",
    pricing: "Preise",
    testimonials: "Erfahrungsberichte",
    faq: "Häufige Fragen",
    contact: "Kontakt",
    getStarted: "Jetzt starten",
    bookMeeting: "Termin vereinbaren"
  },
  hero: {
    title: "Skalieren Sie Ihr Unternehmen mit virtuellen Assistenten",
    subtitle: "Engagieren Sie geprüfte, deutschsprachige virtuelle Assistenten für 80% weniger als lokale Mitarbeiter. Skalieren Sie Ihr Team in Tagen, nicht in Monaten.",
    ctaPrimary: "Jetzt loslegen",
    ctaSecondary: "Mehr erfahren",
    tagline: "Vertrauen Sie auf über 200 wachsende Unternehmen",
    stats: {
      clients: "Kunden",
      costSaved: "Kosteneinsparung",
      rating: "Bewertung"
    }
  },
  services: {
    title: "Unsere Dienstleistungen",
    subtitle: "Umfassende virtuelle Unterstützung für alle Ihre geschäftlichen Anforderungen",
    socialMedia: {
      title: "Social Media Management",
      description: "Erstellung von Inhalten, Zeitplanung und Community-Management auf allen Plattformen",
      benefit: "3-5x höhere Engagement-Raten"
    },
    customerSupport: {
      title: "Kundenservice",
      description: "E-Mail-, Chat- und Telefon-Support mit muttersprachlicher Kompetenz",
      benefit: "95%+ Kundenzufriedenheit"
    },
    backOffice: {
      title: "Büroorganisation & Verwaltung",
      description: "Dateneingabe, E-Mail-Verwaltung, Kalenderkoordination und Dokumentenverarbeitung",
      benefit: "Sparen Sie 20+ Stunden pro Woche"
    },
    seo: {
      title: "SEO & Content",
      description: "Blogbeiträge, Keyword-Recherche, Onpage-Optimierung und Linkaufbau",
      benefit: "Verdoppelung des organischen Traffics"
    }
  },
  valueProposition: {
    title: "Warum Sie uns wählen sollten",
    features: [
      {
        title: "Deutschsprachige Talente",
        description: "Alle unsere virtuellen Assistenten sind fließend in Deutsch und verstehen die europäische Geschäftskultur."
      },
      {
        title: "Strenger Auswahlprozess",
        description: "Nur 3% der Bewerber bestehen unseren strengen Auswahlprozess."
      },
      {
        title: "Schnelle Einarbeitung",
        description: "Starten Sie mit Ihrem persönlichen virtuellen Assistenten in nur 48 Stunden."
      },
      {
        title: "Keine versteckten Kosten",
        description: "Transparente Preise ohne Einrichtungsgebühren oder langfristige Verträge."
      }
    ]
  },
  howItWorks: {
    title: "So funktioniert's",
    steps: [
      {
        title: "Beratungsgespräch",
        description: "Wir verstehen Ihre Anforderungen und Ziele"
      },
      {
        title: "Zusammenstellung des Teams",
        description: "Wir finden die passenden Talente für Ihre Bedürfnisse"
      },
      {
        title: "Schneller Start",
        description: "Ihr persönlicher virtueller Assistent startet innerhalb von 48 Stunden"
      },
      {
        title: "Laufende Unterstützung",
        description: "Unser Team steht Ihnen jederzeit zur Verfügung"
      }
    ]
  },
  pricing: {
    title: "Einfache, transparente Preise",
    subtitle: "Wählen Sie den Plan, der zu Ihren Anforderungen passt",
    plans: [
      {
        name: "Starter",
        price: "Ab €999/Monat",
        description: "Perfekt für kleine Unternehmen und Einzelunternehmer",
        features: [
          "Bis zu 20 Stunden/Monat",
          "Deutschsprachiger VA",
          "Einfache Aufgaben",
          "E-Mail-Support"
        ],
        cta: "Kostenlos starten"
      },
      {
        name: "Professional",
        price: "Ab €1.999/Monat",
        description: "Ideal für wachsende Unternehmen",
        features: [
          "Bis zu 40 Stunden/Monat",
          "Erfahrener VA",
          "Mittlere bis komplexe Aufgaben",
          "Priorisierter Support"
        ],
        cta: "Jetzt starten"
      },
      {
        name: "Business",
        price: "Individuell",
        description: "Maßgeschneiderte Lösungen für Unternehmen",
        features: [
          "Vollzeit-VA",
          "Hochqualifizierte Experten",
          "Komplexe Projekte",
          "Dedizierter Account Manager"
        ],
        cta: "Anfrage senden"
      }
    ]
  },
  testimonials: {
    title: "Was unsere Kunden sagen",
    subtitle: "Erfolgsgeschichten von Unternehmen, die mit uns wachsen"
  },
  faq: {
    title: "Häufig gestellte Fragen",
    items: [
      {
        question: "Wie schnell kann ich mit meinem virtuellen Assistenten starten?",
        answer: "Nach unserem ersten Gespräch können wir in der Regel innerhalb von 48 Stunden mit einem passenden Kandidaten starten."
      },
      {
        question: "Wie unterscheiden Sie sich von anderen Anbietern?",
        answer: "Wir konzentrieren uns ausschließlich auf deutschsprachige virtuelle Assistenten mit fundierten Kenntnissen der europäischen Geschäftskultur."
      },
      {
        question: "Kann ich meinen virtuellen Assistenten wechseln?",
        answer: "Ja, falls die Chemie nicht stimmt, finden wir innerhalb von 24 Stunden einen geeigneten Ersatz."
      }
    ]
  },
  contact: {
    title: "Kontaktieren Sie uns",
    subtitle: "Haben Sie Fragen? Wir freuen uns von Ihnen zu hören!",
    form: {
      name: "Name",
      email: "E-Mail",
      message: "Nachricht",
      submit: "Nachricht senden",
      success: "Vielen Dank! Wir melden uns in Kürze bei Ihnen."
    }
  },
  footer: {
    about: "Über uns",
    services: "Dienstleistungen",
    contact: "Kontakt",
    legal: "Rechtliches",
    privacy: "Datenschutz",
    terms: "AGB",
    copyright: "© 2023 Ihr Unternehmen. Alle Rechte vorbehalten."
  }
};


i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    de: { translation: de }
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import Index from "./pages/Index";
import BlogDetail from "./pages/BlogDetail";
import CaseStudyDetail from "./pages/CaseStudyDetail";
import { BookMeeting } from "./pages/BookMeeting";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./admin/AdminDashboard";
import AdminPricing from "./admin/AdminPricing";
import AdminHowItWorks from "./admin/AdminHowItWorks";
import AdminFAQ from "./admin/AdminFAQ";
import AdminServices from "./admin/AdminServices";
import AdminTestimonials from "./admin/AdminTestimonials";
import AdminBlog from "./admin/AdminBlog";
import AdminCaseStudy from "./admin/AdminCaseStudy";
import AdminHero from "./admin/AdminHero";
import AdminWhyChooseUs from "./admin/AdminWhyChooseUs";
import AdminFooter from "./admin/AdminFooter";
import AdminLogin from "./pages/AdminLogin";
import RequireAdmin from "./auth/RequireAdmin";
import AdminFinalCTA from "./admin/AdminFinalCTA";

const queryClient = new QueryClient();

const App = () => (
  <I18nextProvider i18n={i18n}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="lux-va-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/book-meeting" element={<BookMeeting />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/signup" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <RequireAdmin>
                    <AdminDashboard />
                  </RequireAdmin>
                }
              >
                <Route path="pricing" element={<AdminPricing />} />
                <Route path="how-it-works" element={<AdminHowItWorks />} />
                <Route path="faq" element={<AdminFAQ />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
                <Route path="blogs" element={<AdminBlog />} />
                <Route path="case-studies" element={<AdminCaseStudy />} />
                <Route path="hero" element={<AdminHero />} />
                <Route path="why-choose-us" element={<AdminWhyChooseUs />} />
                <Route path="footer" element={<AdminFooter />} />
                <Route path="final-cta" element={<AdminFinalCTA />} />
              </Route>
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/case-study/:id" element={<CaseStudyDetail />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </I18nextProvider>
);

export default App;

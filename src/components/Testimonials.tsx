import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const testimonialKeys = ["t1", "t2", "t3"] as const;

export const Testimonials = () => {
  const { t } = useTranslation();
  return (
    <motion.section 
      id="testimonials"
      className="relative py-8 sm:py-10 md:py-12 lg:py-14 bg-background text-foreground z-40"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-4">
        <motion.div 
          className="mb-8 sm:mb-10 md:mb-12 lg:mb-16 text-left"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 px-2"
            dangerouslySetInnerHTML={{ __html: t("testimonials.heading") }}
          />
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl px-2">
            {t("testimonials.subheading")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8 max-w-6xl mx-auto mb-8 sm:mb-10 md:mb-12">
          {testimonialKeys.map((key, index) => (
            <motion.div 
              key={key}
              className="bg-card/50 backdrop-blur-sm border border-border rounded-lg sm:rounded-xl p-5 sm:p-6 md:p-8 hover:bg-card transition-all duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
            >
              <div className="flex gap-1 mb-3 sm:mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-gold text-gold" />
                ))}
              </div>
              
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-5 md:mb-6 leading-relaxed">
                "{t(`testimonials.items.${key}.content`)}"
              </p>
              
              <div className="border-t border-border pt-3 sm:pt-4">
                <p className="text-sm sm:text-base font-bold text-foreground">{t(`testimonials.items.${key}.name`)}</p>
                <p className="text-xs sm:text-sm text-gold">{t(`testimonials.items.${key}.role`)}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{t(`testimonials.items.${key}.company`)}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm border border-gold/30 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 max-w-5xl mx-auto hover:border-gold/50 transition-all duration-300"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
          <div className="text-left">
            <span className="inline-block px-3 py-1 bg-gold/10 text-gold text-xs sm:text-sm font-semibold rounded-full mb-3 sm:mb-4">
              {t("testimonials.caseStudy.badge")}
            </span>
            <h3 
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4"
              dangerouslySetInnerHTML={{ __html: t("testimonials.caseStudy.title") }}
            />
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-5 sm:mb-6 leading-relaxed max-w-3xl">
              {t("testimonials.caseStudy.description")}
            </p>
            <Button variant="gold" size="lg" className="w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4">
              {t("testimonials.caseStudy.cta")}
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};
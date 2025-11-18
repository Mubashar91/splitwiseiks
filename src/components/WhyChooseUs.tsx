import { motion } from "framer-motion";
import { Award, Target, Zap, Shield, HeartHandshake, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

const reasons = [
  { icon: Award, key: "eliteTalent" },
  { icon: Target, key: "nativeOversight" },
  { icon: Zap, key: "fastScaling" },
  { icon: Shield, key: "zeroRisk" },
  { icon: HeartHandshake, key: "partnership" },
  { icon: TrendingUp, key: "trackRecord" },
];

export const WhyChooseUs = () => {
  const { t } = useTranslation();
  return (
    <motion.section 
      className="relative py-8 sm:py-10 md:py-12 lg:py-14 bg-gradient-to-b from-background via-muted/30 to-background z-40"
      initial={{ opacity: 0, y: 200 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 1.2, ease: [0.6, -0.05, 0.01, 0.99] }}
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-4">
        <motion.div 
          className="mb-10 sm:mb-12 md:mb-16 lg:mb-20 text-left"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-gold text-foreground text-xs sm:text-sm font-semibold rounded-full mb-3 sm:mb-4">
            {t("whyChooseUs.badge")}
          </span>
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-5 md:mb-6 text-foreground px-2"
            dangerouslySetInnerHTML={{ __html: t("whyChooseUs.heading") }}
          />
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed px-2">
            {t("whyChooseUs.description")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
          {reasons.map((reason, index) => (
            <motion.div 
              key={index}
              className="relative bg-card border-2 border-gold/20 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 hover:border-gold hover:shadow-[0_25px_80px_-20px_hsl(45_80%_55%/0.4)] transition-all duration-700 group overflow-hidden"
              initial={{ opacity: 0, y: 100, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: index * 0.15, ease: [0.6, -0.05, 0.01, 0.99] }}
              whileHover={{ y: -8, scale: 1.03 }}
            >
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative z-10">
                <motion.div 
                  className="mb-4 sm:mb-5 md:mb-6 inline-flex p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl bg-gold/10 text-gold group-hover:bg-gold group-hover:text-foreground group-hover:scale-110 transition-all duration-500 shadow-[0_10px_30px_-10px_hsl(45_80%_55%/0.4)]"
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <reason.icon className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10" />
                </motion.div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-foreground group-hover:text-gold transition-colors duration-300">
                  {t(`whyChooseUs.items.${reason.key}.title`)}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {t(`whyChooseUs.items.${reason.key}.description`)}
                </p>
              </div>
              
              {/* Corner decoration */}
              <div className="absolute bottom-0 right-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 border-b-2 border-r-2 border-gold/0 group-hover:border-gold/50 rounded-br-xl sm:rounded-br-2xl transition-all duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};
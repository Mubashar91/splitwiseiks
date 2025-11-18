import { Shield, Clock, Users, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const values = [
  { icon: Shield, key: "costReduction" },
  { icon: Users, key: "qualityControl" },
  { icon: Clock, key: "replacement" },
  { icon: Lock, key: "confidentiality" },
];

export const ValueProposition = () => {
  const { t } = useTranslation();
  
  return (
    <motion.section 
      className="relative py-8 sm:py-10 md:py-12 lg:py-14 bg-background z-10"
      initial={{ opacity: 0, y: 150 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, ease: [0.6, -0.05, 0.01, 0.99] }}
    >
      {/* Top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
      
      <div className="container mx-auto px-4">
        <motion.div 
          className="mb-16 text-left"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 
            className="text-4xl md:text-5xl font-bold mb-4"
            dangerouslySetInnerHTML={{ __html: t("valueProposition.heading") }}
          />
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {values.map((value, index) => (
            <motion.div 
              key={index}
              className="group relative p-8 rounded-2xl bg-card border-2 border-gold/20 hover:border-gold hover:shadow-[0_20px_60px_-15px_hsl(45_80%_55%/0.4)] transition-all duration-500 hover:-translate-y-3"
              initial={{ opacity: 0, y: 80, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.15, 
                ease: [0.6, -0.05, 0.01, 0.99] 
              }}
            >
              {/* Shine effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative">
                <div className="mb-6 inline-flex p-4 rounded-xl bg-gold/10 text-gold group-hover:bg-gold group-hover:text-black group-hover:scale-110 transition-all duration-500 shadow-[0_8px_20px_-8px_hsl(45_80%_55%/0.3)]">
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-gold transition-colors duration-300">
                  {t(`valueProposition.items.${value.key}.title`)}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t(`valueProposition.items.${value.key}.description`)}
                </p>
              </div>
              
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-gold/0 group-hover:border-gold/50 rounded-tr-2xl transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};
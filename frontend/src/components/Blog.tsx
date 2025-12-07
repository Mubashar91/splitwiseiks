import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

// API Configuration
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001';

interface BlogPost {
  blogId: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  charts?: any;
}

const blogPostsEn: BlogPost[] = [ // Fallback data
  {
    id: 1,
    title: "How Virtual Assistants Can Save Your Business 70% on Operational Costs",
    excerpt: "Discover the proven strategies that successful businesses use to dramatically reduce costs while maintaining quality through virtual assistants.",
    content: `
      <h2>The Cost Crisis in Modern Business</h2>
      <p>In today's competitive market, businesses are constantly looking for ways to reduce operational costs without sacrificing quality. One of the most effective solutions that has emerged is the strategic use of virtual assistants.</p>
      
      <h3>Breaking Down the Savings</h3>
      <p>When you hire a virtual assistant instead of a full-time employee, you save on:</p>
      <ul>
        <li>Office space and equipment</li>
        <li>Benefits and insurance</li>
        <li>Training and onboarding costs</li>
        <li>Paid time off and sick leave</li>
        <li>Taxes and administrative overhead</li>
      </ul>
      
      <h3>Real-World Success Stories</h3>
      <p>We've helped over 200 businesses achieve an average of 70% cost reduction. One e-commerce company reduced their customer service costs from €8,000/month to €2,400/month while actually improving response times.</p>
      
      <h3>Quality Doesn't Have to Suffer</h3>
      <p>The key is working with a service that provides native quality control. At DON VA, every deliverable is reviewed by native German-speaking managers, ensuring your standards are always met.</p>
      
      <h3>Getting Started</h3>
      <p>The transition to virtual assistants doesn't have to be complicated. Start with one VA handling routine tasks, measure the results, and scale from there. Most of our clients see positive ROI within the first month.</p>
    `,
    author: "Michael Schmidt",
    date: "March 15, 2024",
    readTime: "5 min read",
    category: "Cost Optimization",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop"
  },
  {
    id: 2,
    title: "5 Tasks You Should Delegate to a Virtual Assistant Today",
    excerpt: "Stop wasting time on routine tasks. Learn which activities you should delegate immediately to free up your schedule for strategic work.",
    content: `
      <h2>Time is Your Most Valuable Asset</h2>
      <p>As a business owner or manager, your time should be spent on high-value activities that drive growth. Yet many professionals find themselves bogged down in routine tasks that could easily be delegated.</p>
      
      <h3>1. Email Management</h3>
      <p>Your VA can filter, categorize, and respond to routine emails, flagging only the important ones for your attention. This alone can save 2-3 hours per day.</p>
      
      <h3>2. Calendar Management</h3>
      <p>Let your VA handle scheduling, rescheduling, and coordinating meetings. They can manage time zones, send reminders, and ensure you're always prepared.</p>
      
      <h3>3. Social Media Management</h3>
      <p>Content scheduling, engagement monitoring, and basic customer service on social platforms can all be handled by a skilled VA.</p>
      
      <h3>4. Data Entry and Research</h3>
      <p>Whether it's updating CRM systems, conducting market research, or compiling reports, VAs excel at these detail-oriented tasks.</p>
      
      <h3>5. Customer Support</h3>
      <p>First-line customer support, handling common questions, and escalating complex issues can be managed efficiently by trained VAs.</p>
      
      <h3>The Impact</h3>
      <p>By delegating these five tasks, most executives free up 15-20 hours per week. That's time you can reinvest in strategy, business development, or work-life balance.</p>
    `,
    author: "Sarah Weber",
    date: "March 10, 2024",
    readTime: "4 min read",
    category: "Productivity",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=500&fit=crop"
  },
  {
    id: 3,
    title: "The Complete Guide to Scaling Your Business with Virtual Teams",
    excerpt: "Learn the proven framework for building and managing a high-performing virtual team that drives real business results.",
    content: `
      <h2>Why Virtual Teams are the Future</h2>
      <p>The traditional office model is becoming obsolete. Virtual teams offer flexibility, cost savings, and access to global talent that physical offices simply can't match.</p>
      
      <h3>Phase 1: Starting Small</h3>
      <p>Begin with one VA handling a specific function. This allows you to:</p>
      <ul>
        <li>Test the waters with minimal risk</li>
        <li>Develop your management processes</li>
        <li>Identify what works for your business</li>
        <li>Build confidence in the model</li>
      </ul>
      
      <h3>Phase 2: Expanding Strategically</h3>
      <p>Once you've proven the concept, scale strategically. Add VAs for complementary functions, creating a well-rounded team that covers all your operational needs.</p>
      
      <h3>Phase 3: Building Systems</h3>
      <p>As your team grows, invest in proper systems:</p>
      <ul>
        <li>Project management tools (Asana, Trello)</li>
        <li>Communication platforms (Slack, Teams)</li>
        <li>Documentation and SOPs</li>
        <li>Performance tracking metrics</li>
      </ul>
      
      <h3>Managing Across Time Zones</h3>
      <p>With VAs in different time zones, you can achieve 24/7 operations. The key is clear handoff procedures and asynchronous communication practices.</p>
      
      <h3>Quality Control</h3>
      <p>This is where many businesses struggle. At DON VA, we solve this with native German managers who review all work before delivery, ensuring consistent quality.</p>
      
      <h3>The Results</h3>
      <p>Companies that successfully scale with virtual teams typically see 3x growth in operational capacity without proportional cost increases. It's not just about saving money—it's about scaling smart.</p>
    `,
    author: "Thomas Müller",
    date: "March 5, 2024",
    readTime: "7 min read",
    category: "Business Growth",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop"
  },
  {
    id: 4,
    title: "Remote Work Revolution: Why Virtual Assistants Are Essential in 2024",
    excerpt: "The future of work is here. Discover why businesses that embrace virtual assistants are outperforming their competitors.",
    content: `
      <h2>The Shift to Remote Work</h2>
      <p>The pandemic accelerated a trend that was already underway: the shift to remote work. Now, businesses are discovering that virtual assistants offer advantages that go far beyond cost savings.</p>
      
      <h3>Access to Global Talent</h3>
      <p>When you're not limited by geography, you can hire the best person for the job, regardless of where they live. This means access to specialized skills that might not be available in your local market.</p>
      
      <h3>24/7 Operations</h3>
      <p>With VAs in different time zones, your business never sleeps. Customer inquiries get answered, tasks get completed, and opportunities don't slip through the cracks.</p>
      
      <h3>Flexibility and Scalability</h3>
      <p>Need more support during peak season? Scale up. Slower period? Scale down. Virtual assistants offer flexibility that traditional hiring simply can't match.</p>
      
      <h3>The Competitive Advantage</h3>
      <p>Companies using virtual assistants are moving faster, spending less, and achieving more. In today's competitive market, that's not just an advantage—it's essential for survival.</p>
    `,
    author: "Anna Fischer",
    date: "February 28, 2024",
    readTime: "6 min read",
    category: "Remote Work",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=500&fit=crop"
  },
  {
    id: 5,
    title: "How to Onboard a Virtual Assistant: A Step-by-Step Guide",
    excerpt: "Get your new VA up to speed quickly with this comprehensive onboarding framework used by successful businesses.",
    content: `
      <h2>The Importance of Proper Onboarding</h2>
      <p>A well-structured onboarding process is crucial for VA success. It sets expectations, builds confidence, and ensures your VA can hit the ground running.</p>
      
      <h3>Week 1: Foundation</h3>
      <p>Start with the basics:</p>
      <ul>
        <li>Company overview and values</li>
        <li>Tool access and training</li>
        <li>Communication protocols</li>
        <li>Initial task assignments</li>
      </ul>
      
      <h3>Week 2: Integration</h3>
      <p>Deepen their understanding:</p>
      <ul>
        <li>Process documentation review</li>
        <li>Team introductions</li>
        <li>More complex task assignments</li>
        <li>First feedback session</li>
      </ul>
      
      <h3>Week 3-4: Independence</h3>
      <p>Build autonomy:</p>
      <ul>
        <li>Gradual reduction in oversight</li>
        <li>Problem-solving opportunities</li>
        <li>Performance metrics review</li>
        <li>Long-term goal setting</li>
      </ul>
      
      <h3>Best Practices</h3>
      <p>Document everything, communicate clearly, provide regular feedback, and celebrate wins. A good onboarding process pays dividends for months to come.</p>
    `,
    author: "Marcus Klein",
    date: "February 20, 2024",
    readTime: "5 min read",
    category: "Management",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop"
  },
  {
    id: 6,
    title: "Virtual Assistants vs. Full-Time Employees: A Cost Comparison",
    excerpt: "Breaking down the real costs of hiring. The numbers might surprise you.",
    content: `
      <h2>The True Cost of Employment</h2>
      <p>When comparing VAs to full-time employees, most businesses only look at salary. But the real cost of employment goes much deeper.</p>
      
      <h3>Full-Time Employee Costs</h3>
      <p>For a €40,000/year employee, actual costs include:</p>
      <ul>
        <li>Base salary: €40,000</li>
        <li>Benefits (health, pension): €8,000</li>
        <li>Taxes and insurance: €6,000</li>
        <li>Office space and equipment: €4,000</li>
        <li>Training and development: €2,000</li>
        <li>Paid time off (20 days): €3,000</li>
        <li><strong>Total: €63,000/year</strong></li>
      </ul>
      
      <h3>Virtual Assistant Costs</h3>
      <p>For equivalent work output:</p>
      <ul>
        <li>VA service fee: €18,000/year</li>
        <li>No benefits required</li>
        <li>No office costs</li>
        <li>No paid time off</li>
        <li><strong>Total: €18,000/year</strong></li>
      </ul>
      
      <h3>The Savings</h3>
      <p>That's a 71% cost reduction. And this doesn't even account for recruitment costs, turnover, or management overhead.</p>
      
      <h3>When to Choose Each</h3>
      <p>Full-time employees make sense for core strategic roles. VAs excel at operational tasks, support functions, and scalable work.</p>
    `,
    author: "Lisa Hoffmann",
    date: "February 15, 2024",
    readTime: "6 min read",
    category: "Cost Analysis",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=500&fit=crop"
  }
];

const blogPostsDe: BlogPost[] = [
  {
    id: 1,
    title: "Wie virtuelle Assistenten Ihre Betriebskosten um 70 % senken können",
    excerpt: "Erfahren Sie, welche Strategien erfolgreiche Unternehmen nutzen, um ihre Kosten drastisch zu senken und gleichzeitig die Qualität mit virtuellen Assistenten hochzuhalten.",
    content: blogPostsEn[0].content,
    author: "Michael Schmidt",
    date: "15. März 2024",
    readTime: "5 Min. Lesezeit",
    category: "Kostenoptimierung",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop"
  },
  {
    id: 2,
    title: "5 Aufgaben, die Sie noch heute an einen virtuellen Assistenten auslagern sollten",
    excerpt: "Verschwenden Sie keine Zeit mehr mit Routineaufgaben. Erfahren Sie, welche Tätigkeiten Sie sofort abgeben sollten, um mehr Raum für strategische Arbeit zu schaffen.",
    content: blogPostsEn[1].content,
    author: "Sarah Weber",
    date: "10. März 2024",
    readTime: "4 Min. Lesezeit",
    category: "Produktivität",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=500&fit=crop"
  },
  {
    id: 3,
    title: "Der vollständige Leitfaden zum Skalieren Ihres Unternehmens mit virtuellen Teams",
    excerpt: "Lernen Sie den bewährten Rahmen kennen, mit dem leistungsstarke virtuelle Teams aufgebaut und geführt werden, die echte Ergebnisse liefern.",
    content: blogPostsEn[2].content,
    author: "Thomas Müller",
    date: "5. März 2024",
    readTime: "7 Min. Lesezeit",
    category: "Wachstum",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop"
  },
  {
    id: 4,
    title: "Remote-Work-Revolution: Warum virtuelle Assistenten 2024 unverzichtbar sind",
    excerpt: "Die Zukunft der Arbeit ist da. Erfahren Sie, warum Unternehmen, die virtuelle Assistenten einsetzen, ihre Wettbewerber überholen.",
    content: blogPostsEn[3].content,
    author: "Anna Fischer",
    date: "28. Februar 2024",
    readTime: "6 Min. Lesezeit",
    category: "Remote Work",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=500&fit=crop"
  },
  {
    id: 5,
    title: "So onboarden Sie einen virtuellen Assistenten: Schritt-für-Schritt-Anleitung",
    excerpt: "Bringen Sie Ihren neuen VA mit diesem umfassenden Onboarding-Framework, das erfolgreiche Unternehmen nutzen, schnell auf Flughöhe.",
    content: blogPostsEn[4].content,
    author: "Marcus Klein",
    date: "20. Februar 2024",
    readTime: "5 Min. Lesezeit",
    category: "Management",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop"
  },
  {
    id: 6,
    title: "Virtuelle Assistenten vs. Festangestellte: Ein Kostenvergleich",
    excerpt: "Wir zeigen die wahren Kosten einer Einstellung – die Zahlen werden Sie überraschen.",
    content: blogPostsEn[5].content,
    author: "Lisa Hoffmann",
    date: "15. Februar 2024",
    readTime: "6 Min. Lesezeit",
    category: "Kostenanalyse",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=500&fit=crop"
  }
];

export const Blog = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get current language (en or de)
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

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE}/api/blogs?lang=${currentLang}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch blogs: ${response.status}`);
        }
        
        const data = await response.json();
        const fetchedBlogs = Array.isArray(data.blogs) 
          ? data.blogs.sort((a: BlogPost, b: BlogPost) => (a.order || 0) - (b.order || 0) || a.blogId - b.blogId)
          : [];
        
        setPosts(fetchedBlogs);
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('Error fetching blogs:', err);
        }
        setError(err instanceof Error ? err.message : 'Failed to load blogs');
        // Fallback to hardcoded data
        const fallback = currentLang === 'de' ? blogPostsDe : blogPostsEn;
        setPosts(fallback.map(p => ({ ...p, blogId: p.id })));
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [currentLang]);

  // Loading state
  if (loading) {
    return (
      <motion.section
        id="blog"
        className="relative py-8 sm:py-10 md:py-12 lg:py-14 bg-background overflow-hidden"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      id="blog"
      className="relative py-8 sm:py-10 md:py-12 lg:py-14 bg-background overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="relative mb-8 sm:mb-12 lg:mb-16 text-left"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-gold/10 text-gold text-xs sm:text-sm font-semibold rounded-full mb-3 sm:mb-4">
            {t("blog.badge")}
          </span>
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 text-foreground"
            dangerouslySetInnerHTML={{ __html: t("blog.heading") }}
          />
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl leading-relaxed">
            {t("blog.description")}
          </p>
        </motion.div>

        {/* Blog Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {posts.map((post: BlogPost, index: number) => (
            <motion.article
              key={post.blogId || post.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group bg-card border border-border/50 rounded-xl sm:rounded-2xl overflow-hidden hover:border-gold/50 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] transition-all duration-300 cursor-pointer w-full"
              onClick={() => navigate(`/blog/${post.blogId || post.id}`)}
              whileHover={{ y: -8 }}
            >
              {/* Image */}
              <div className="relative h-44 sm:h-52 md:h-48 lg:h-56 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-gold text-foreground text-xs font-bold rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5 lg:p-6">
                <div className="flex items-center gap-3 sm:gap-4 text-xs text-muted-foreground mb-2 sm:mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-2 sm:mb-3 text-foreground group-hover:text-gold transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-muted-foreground">{t("blog.by")} {post.author}</span>
                  <div className="flex items-center gap-1 sm:gap-2 text-gold font-semibold text-xs sm:text-sm group-hover:gap-2 sm:group-hover:gap-3 transition-all">
                    <span className="hidden sm:inline">{t("blog.readMore")}</span>
                    <span className="sm:hidden">{t("blog.read")}</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

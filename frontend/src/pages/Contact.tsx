import { useMemo } from "react";
import { motion } from "framer-motion";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Navbar } from "@/components/Navbar";


type FormValues = {
  email: string;
  phone: string;
  vaCount: string;
  va1Background?: string;
  va2Industry?: string;
  va2Background?: string;
  va3Industry?: string;
  va3Background?: string;
  va4Industry?: string;
  va4Background?: string;
  mainService: string;
  mainServiceOther?: string;
  otherTasks: string;
};

const Contact = () => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      email: "",
      phone: "",
      vaCount: "",
      va1Background: "",
      va2Industry: "",
      va2Background: "",
      va3Industry: "",
      va3Background: "",
      va4Industry: "",
      va4Background: "",
      mainService: "",
      mainServiceOther: "",
      otherTasks: "",
    },
    mode: "onBlur",
  });

  const vaCountValue = useWatch({ control, name: "vaCount" });
  const mainServiceValue = useWatch({ control, name: "mainService" });

  const emailPattern = useMemo(() => /[^\s@]+@[^\s@]+\.[^\s@]+/, []);
  const phonePattern = useMemo(() => /^[0-9+\-()\s]{7,20}$/i, []);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const formData = new FormData();
    const apiKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "8aff1902-6795-4608-ad79-be6702aa7f3a";
    formData.append("access_key", apiKey);
    formData.append("to", "patryk@dononlineagency.com");
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    // purpose removed from payload per user request
    formData.append("subject", "New contact request - Don Va");
    formData.append("vaCount", data.vaCount);
    if (data.va1Background?.trim()) {
      formData.append("va1Background", data.va1Background.trim());
    }
    if (data.va2Industry?.trim()) {
      formData.append("va2Industry", data.va2Industry.trim());
    }
    if (data.va2Background?.trim()) {
      formData.append("va2Background", data.va2Background.trim());
    }
    if (data.va3Industry?.trim()) {
      formData.append("va3Industry", data.va3Industry.trim());
    }
    if (data.va3Background?.trim()) {
      formData.append("va3Background", data.va3Background.trim());
    }
    if (data.va4Industry?.trim()) {
      formData.append("va4Industry", data.va4Industry.trim());
    }
    if (data.va4Background?.trim()) {
      formData.append("va4Background", data.va4Background.trim());
    }
    if (data.mainService) {
      formData.append("mainService", data.mainService);
    }
    if (data.mainService === "other" && data.mainServiceOther?.trim()) {
      formData.append("mainServiceOther", data.mainServiceOther.trim());
    }
    if (data.otherTasks.trim()) {
      formData.append("otherTasks", data.otherTasks.trim());
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const json = await response.json();
      // Response logged for debugging (remove in production)
      if (import.meta.env.DEV) {
        console.log("Web3Forms response", json);
      }
      if (json.success) {
        toast({ title: "Success!", description: "Your message has been sent." });
        reset();
      } else {
        toast({ title: "Error", description: json.message || "Please try again.", });
      }
    } catch {
      toast({ title: "Network error", description: "Please try again later." });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 md:px-6 lg:px-10 xl:px-12 pt-28 pb-16">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
          >
          <Card className="border border-gold/15 bg-gradient-to-br from-background/90 via-background/95 to-black/90 shadow-xl shadow-black/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
              <CardDescription>
                Share your email, phone, and purpose. We'll respond promptly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      {...register("email", {
                        required: "Email is required",
                        pattern: { value: emailPattern, message: "Enter a valid email" },
                      })}
                    />
                    {errors.email && (
                      <p className="text-sm font-medium text-destructive">{errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 555 123 4567"
                      {...register("phone", {
                        required: "Phone number is required",
                        pattern: { value: phonePattern, message: "Enter a valid phone number" },
                      })}
                    />
                    {errors.phone && (
                      <p className="text-sm font-medium text-destructive">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Main service you want VAs for</Label>
                  <Select
                    onValueChange={(v) => setValue("mainService", v, { shouldValidate: true })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select one main service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="social-media">Social Media Management</SelectItem>
                      <SelectItem value="customer-support">Customer Support</SelectItem>
                      <SelectItem value="back-office">Back-Office & Admin</SelectItem>
                      <SelectItem value="seo-content">SEO & Content</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <input
                    type="hidden"
                    {...register("mainService", { required: "Please select one main service" })}
                  />
                  {errors.mainService && (
                    <p className="text-sm font-medium text-destructive">{errors.mainService.message}</p>
                  )}
                  {mainServiceValue === "other" && (
                    <div className="space-y-2 mt-3">
                      <Label htmlFor="mainServiceOther">What other service do you want VAs for?</Label>
                      <Textarea
                        id="mainServiceOther"
                        rows={3}
                        placeholder="Example: Lead generation, video editing, sales outreach, etc."
                        {...register("mainServiceOther")}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vaCount">How many VAs do you need?</Label>
                  <Input
                    id="vaCount"
                    type="number"
                    min={1}
                    placeholder="e.g. 2"
                    {...register("vaCount", {
                      required: "Please tell us how many VAs you need",
                    })}
                  />
                  {errors.vaCount && (
                    <p className="text-sm font-medium text-destructive">{errors.vaCount.message}</p>
                  )}
                </div>

                {Number(vaCountValue) >= 1 && (
                  <div className="space-y-2">
                    <Label htmlFor="va1Background">VA #1 – background / main tasks</Label>
                    <Textarea
                      id="va1Background"
                      rows={3}
                      placeholder="Example: Customer support for Shopify store, fluent German, comfortable with email + chat."
                      {...register("va1Background")}
                    />
                  </div>
                )}

                {Number(vaCountValue) >= 2 && (
                  <div className="space-y-2">
                    <Label>Main industry for VA #2</Label>
                    <Select
                      onValueChange={(v) => setValue("va2Industry", v, { shouldValidate: false })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry for VA #2 (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ecommerce">E-Commerce</SelectItem>
                        <SelectItem value="marketing">Marketing / Agency</SelectItem>
                        <SelectItem value="saas">SaaS / Tech</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>

                    <Label htmlFor="va2Background">VA #2 – background / main tasks</Label>
                    <Textarea
                      id="va2Background"
                      rows={3}
                      placeholder="Example: Back-office admin: email inbox, calendar coordination, invoicing."
                      {...register("va2Background")}
                    />
                  </div>
                )}

                {Number(vaCountValue) >= 3 && (
                  <div className="space-y-2">
                    <Label>Main industry for VA #3</Label>
                    <Select
                      onValueChange={(v) => setValue("va3Industry", v, { shouldValidate: false })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry for VA #3 (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ecommerce">E-Commerce</SelectItem>
                        <SelectItem value="marketing">Marketing / Agency</SelectItem>
                        <SelectItem value="saas">SaaS / Tech</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>

                    <Label htmlFor="va3Background">VA #3 – background / main tasks</Label>
                    <Textarea
                      id="va3Background"
                      rows={3}
                      placeholder="Example: SEO & content: blog writing, keyword research, on-page optimization."
                      {...register("va3Background")}
                    />
                  </div>
                )}

                {Number(vaCountValue) >= 4 && (
                  <div className="space-y-2">
                    <Label>Main industry for VA #4</Label>
                    <Select
                      onValueChange={(v) => setValue("va4Industry", v, { shouldValidate: false })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry for VA #4 (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ecommerce">E-Commerce</SelectItem>
                        <SelectItem value="marketing">Marketing / Agency</SelectItem>
                        <SelectItem value="saas">SaaS / Tech</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>

                    <Label htmlFor="va4Background">VA #4 – background / main tasks</Label>
                    <Textarea
                      id="va4Background"
                      rows={3}
                      placeholder="Example: Social media: content scheduling, engagement, reports."
                      {...register("va4Background")}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="otherTasks">Any other VA tasks?</Label>
                  <Textarea
                    id="otherTasks"
                    rows={3}
                    placeholder="Example: Lead research, CRM updates, basic design tasks, etc. (optional)"
                    {...register("otherTasks")}
                  />
                </div>

                <div className="flex items-center justify-end gap-3">
                  <Button
                    type="submit"
                    variant="gold"
                    className="px-8 shadow-lg shadow-gold/30 hover:shadow-gold/50 hover:scale-[1.03] active:scale-[0.99] transition-transform duration-200"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

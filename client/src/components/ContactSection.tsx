import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, Youtube, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

const contactInfo = [
  {
    icon: MapPin,
    title: "Sede Principal",
    content: "Rua da Cervejaria, 123\nLuanda, Angola",
  },
  {
    icon: Phone,
    title: "Telefone",
    content: "+244 222 123 456",
  },
  {
    icon: Mail,
    title: "Email",
    content: "contato@cuca.ao",
  },
  {
    icon: Clock,
    title: "Horário de Atendimento",
    content: "Segunda a Sexta: 8h às 18h\nSábado: 8h às 14h",
  },
];

const socialLinks = [
  { icon: Facebook, href: "#", color: "hover:bg-cuca-red" },
  { icon: Instagram, href: "#", color: "hover:bg-cuca-red" },
  { icon: Twitter, href: "#", color: "hover:bg-cuca-red" },
  { icon: Youtube, href: "#", color: "hover:bg-cuca-red" },
];

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
  });
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate before submitting
    const hasErrors = Object.values(errors).some(error => error !== "");
    const hasEmptyRequiredFields = !formData.name || !formData.email || !formData.message;
    
    if (hasErrors || hasEmptyRequiredFields) {
      toast({
        title: "Dados inválidos",
        description: "Por favor, corrija os erros antes de enviar.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Submit via API
      await apiRequest("/api/contact", "POST", formData);
      
      toast({
        title: "Mensagem enviada!",
        description: "Obrigado pela sua mensagem! Entraremos em contato em breve.",
      });
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error: any) {
      console.error("Contact form error:", error);
      
      // Check if it's a validation error
      if (error?.errors && Array.isArray(error.errors)) {
        const validationMessages = error.errors.map((err: any) => err.message).join(", ");
        toast({
          title: "Dados inválidos",
          description: validationMessages,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro ao enviar mensagem",
          description: "Ocorreu um erro ao enviar sua mensagem. Tente novamente.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Real-time validation
    const newErrors = { ...errors };
    
    if (name === "name") {
      if (value.length > 0 && value.length < 2) {
        newErrors.name = "Nome deve ter pelo menos 2 caracteres";
      } else {
        newErrors.name = "";
      }
    }
    
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value.length > 0 && !emailRegex.test(value)) {
        newErrors.email = "Email inválido";
      } else {
        newErrors.email = "";
      }
    }
    
    if (name === "message") {
      if (value.length > 0 && value.length < 10) {
        newErrors.message = "Mensagem deve ter pelo menos 10 caracteres";
      } else {
        newErrors.message = "";
      }
    }
    
    setErrors(newErrors);
  };

  return (
    <section id="contact" className="py-12 sm:py-16 lg:py-20 bg-background dark:bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="font-montserrat font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-4 sm:mb-6">
            <span className="text-cuca-red">Contato</span> & Localização
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto px-4">
            Estamos sempre prontos para atender você. Entre em contato conosco
            ou visite uma de nossas lojas
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="font-montserrat font-semibold text-xl sm:text-2xl text-foreground mb-6 sm:mb-8">
              Informações de Contato
            </h3>

            <div className="space-y-4 sm:space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div 
                  key={info.title} 
                  className="flex items-start group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ x: 5 }}
                >
                  <motion.div 
                    className="bg-cuca-yellow/20 dark:bg-cuca-yellow/30 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0 group-hover:bg-cuca-yellow/30 dark:group-hover:bg-cuca-yellow/40 transition-colors duration-300"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <info.icon className="text-cuca-yellow h-5 w-5 sm:h-6 sm:w-6" />
                  </motion.div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1 text-sm sm:text-base">
                      {info.title}
                    </h4>
                    <p className="text-muted-foreground whitespace-pre-line text-sm sm:text-base">
                      {info.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social Media */}
            <div className="mt-6 sm:mt-8">
              <h4 className="font-montserrat font-semibold text-lg sm:text-xl text-foreground mb-4">
                Siga-nos
              </h4>
              <div className="flex space-x-3 sm:space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    className="bg-cuca-yellow text-cuca-black w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center hover:bg-cuca-red hover:text-white transition-all duration-300"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <social.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="font-montserrat font-semibold text-xl sm:text-2xl text-foreground mb-6 sm:mb-8">
              Envie uma Mensagem
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6" name="contact" data-netlify="true">
              <input type="hidden" name="form-name" value="contact" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <Label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Nome
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Seu nome (mínimo 2 caracteres)"
                    required
                    minLength={2}
                    className={`focus:ring-2 focus:ring-cuca-yellow focus:border-transparent transition-all duration-300 ${errors.name ? 'border-red-500' : ''}`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <Label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    required
                    className={`focus:ring-2 focus:ring-cuca-yellow focus:border-transparent transition-all duration-300 ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                  Telefone (opcional)
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+244 xxx xxx xxx"
                  className="focus:ring-2 focus:ring-cuca-yellow focus:border-transparent transition-all duration-300"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <Label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Mensagem
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Sua mensagem (mínimo 10 caracteres)..."
                  required
                  minLength={10}
                  className={`focus:ring-2 focus:ring-cuca-yellow focus:border-transparent transition-all duration-300 resize-none ${errors.message ? 'border-red-500' : ''}`}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-cuca-red hover:bg-red-700 text-white font-montserrat font-semibold py-3 sm:py-4 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
                </Button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, ShoppingBag, Check, TrendingUp } from "lucide-react";

const Index = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, 50]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-screen pt-16 flex items-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 to-transparent" />
          <div className="absolute top-[40%] left-1/3 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-pink-500/10 blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 py-12 sm:px-6 md:py-24 lg:px-8 relative">
          <motion.div 
            style={{ opacity, y }}
            className="absolute right-10 top-4 md:right-20 md:top-8 p-2 backdrop-blur-sm bg-white/60 border border-border rounded-lg hidden sm:block"
          >
            <motion.div
              initial={{ rotate: -5, scale: 0.9 }}
              animate={{ rotate: 5, scale: 1.05 }}
              transition={{ duration: 6, yoyo: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="h-5 w-5 text-primary/60" />
            </motion.div>
          </motion.div>
          
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="hero-text mb-6">
                Wear your imagination with
                <span className="relative inline-block ml-2">
                  <span className="relative z-10">AI-powered</span>
                  <motion.span 
                    className="absolute inset-x-0 bottom-1 h-3 bg-blue-200/40"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  />
                </span>
                <span className="block mt-2">custom tote bags</span>
              </h1>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="body-text max-w-2xl mx-auto mb-8"
            >
              Describe your perfect design, and our AI will create a unique print for your eco-friendly tote bag. From concept to doorstep—no design skills required.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button asChild size="lg" className="rounded-full px-6">
                <Link to="/customize">
                  Create Your Tote <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-6">
                <Link to="#how-it-works">
                  How It Works
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          >
            <ArrowRight className="h-6 w-6 transform rotate-90 text-muted-foreground" />
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="section bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="badge-primary">Simple Process</span>
              <h2 className="heading-1 mt-4 mb-6">How Toteology Works</h2>
              <p className="body-text">
                Creating your custom tote bag is effortless. Just describe your design idea, preview the AI-generated result, and place your order.
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                icon: <Sparkles className="h-6 w-6" />,
                title: "Describe Your Design",
                description: "Tell our AI what kind of design you want on your tote bag. Be as creative or specific as you'd like."
              },
              {
                icon: <TrendingUp className="h-6 w-6" />,
                title: "Preview & Refine",
                description: "See your AI-generated design instantly. Make adjustments until you're completely satisfied."
              },
              {
                icon: <ShoppingBag className="h-6 w-6" />,
                title: "Order & Enjoy",
                description: "Complete your purchase and we'll print your custom design on a high-quality, eco-friendly tote bag."
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="flex flex-col items-center text-center p-6 rounded-2xl"
              >
                <div className="flex-center h-14 w-14 rounded-full bg-secondary mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-medium mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-16 text-center"
          >
            <Button asChild size="lg" className="rounded-full px-6">
              <Link to="/customize">
                Start Creating <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="section bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="badge-primary">Why Choose Us</span>
              <h2 className="heading-1 mt-4 mb-6">Designed with Care</h2>
              <p className="body-text">
                Our tote bags combine cutting-edge AI design with sustainable materials and ethical production.
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {[
              {
                title: "Eco-Friendly Materials",
                description: "Made from 100% organic cotton canvas, our tote bags are durable, reusable, and kind to the planet."
              },
              {
                title: "Unique AI Designs",
                description: "Every design is one-of-a-kind, created by advanced AI based on your specific description."
              },
              {
                title: "Premium Printing",
                description: "We use high-quality digital printing that ensures vibrant colors and long-lasting designs."
              },
              {
                title: "Ethical Production",
                description: "All our products are manufactured in facilities that ensure fair wages and safe working conditions."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="flex items-start p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-border"
              >
                <div className="flex-shrink-0 mr-4">
                  <div className="flex-center h-8 w-8 rounded-full bg-primary/10 text-primary">
                    <Check className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="section bg-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-secondary/30 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-secondary/30 to-transparent" />
        </div>
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center py-16 md:py-24 lg:py-32"
          >
            <h2 className="heading-1 mb-8">
              Ready to create your unique tote bag?
            </h2>
            <p className="body-text max-w-2xl mx-auto mb-12">
              Express your style with a one-of-a-kind tote bag that's as unique as you are. Start designing now and have your custom creation delivered to your doorstep.
            </p>
            <Button asChild size="lg" className="rounded-full px-8 py-6 text-lg">
              <Link to="/customize">
                Create Your Tote <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;


import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Footer = () => {
  const footerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      } 
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  };

  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      variants={footerVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className="bg-secondary/50 py-12 md:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 lg:grid-cols-4">
          {/* Brand */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-medium">TOTEOLOGY</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Custom tote bags with AI-generated designs, made just for you.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-sm font-medium">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/customize" className="text-muted-foreground hover:text-primary transition-colors">
                  Create Your Tote
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Featured Designs
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Gift Cards
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* About */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-sm font-medium">About</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-sm font-medium">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">
                  support@toteology.com
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">
                  +1 (555) 123-4567
                </Link>
              </li>
              <li>
                <address className="text-muted-foreground not-italic">
                  123 Design St.<br />
                  San Francisco, CA 94103
                </address>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div 
          variants={itemVariants}
          className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center"
        >
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} Toteology. All rights reserved.
          </p>
          <div className="mt-4 sm:mt-0 flex space-x-6">
            <Link to="#" className="text-muted-foreground hover:text-primary text-xs">
              Privacy Policy
            </Link>
            <Link to="#" className="text-muted-foreground hover:text-primary text-xs">
              Terms of Service
            </Link>
            <Link to="#" className="text-muted-foreground hover:text-primary text-xs">
              Shipping Info
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;

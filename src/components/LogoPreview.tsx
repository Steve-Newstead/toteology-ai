
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

interface LogoPreviewProps {
  logoUrl: string | null;
  isGenerating: boolean;
  className?: string;
}

const LogoPreview = ({ logoUrl, isGenerating, className = "" }: LogoPreviewProps) => {
  const [isLogoLoaded, setIsLogoLoaded] = useState(false);
  
  useEffect(() => {
    setIsLogoLoaded(false);
    
    if (logoUrl) {
      const img = new Image();
      img.src = logoUrl;
      img.onload = () => setIsLogoLoaded(true);
    }
  }, [logoUrl]);

  return (
    <div className={`relative aspect-square w-full overflow-hidden rounded-lg border border-border bg-secondary/30 ${className}`}>
      <AnimatePresence mode="wait">
        {isGenerating ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex h-full w-full flex-col items-center justify-center p-4 text-center"
          >
            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">
              Generating your design...
            </p>
          </motion.div>
        ) : logoUrl ? (
          <motion.div
            key="logo"
            initial={{ opacity: 0 }}
            animate={{ opacity: isLogoLoaded ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex h-full w-full items-center justify-center p-4"
          >
            <img
              src={logoUrl}
              alt="Generated logo"
              className={`h-full w-full object-contain transition-all duration-500 ${
                isLogoLoaded ? "image-loaded" : "image-loading"
              }`}
              onLoad={() => setIsLogoLoaded(true)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex h-full w-full flex-col items-center justify-center p-4 text-center"
          >
            <p className="text-sm text-muted-foreground">
              Your design will appear here
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LogoPreview;

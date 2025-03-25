
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

// Simple AnimatePresence replacement
const AnimatePresence = ({ children }) => children;

// Simple motion.div replacement
const MotionDiv = ({ 
  children, 
  initial = {}, 
  animate = {}, 
  exit = {},
  transition = {},
  className = "",
  key
}) => (
  <div className={className} key={key}>{children}</div>
);

interface ToteBagPreviewProps {
  logoUrl: string | null;
  isGenerating: boolean;
}

const ToteBagPreview = ({ logoUrl, isGenerating }: ToteBagPreviewProps) => {
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
    <div className="relative aspect-[3/4] w-full max-w-md mx-auto">
      {/* Tote bag base */}
      <div className="absolute inset-0 rounded-xl overflow-hidden bg-secondary/30 border border-border shadow-sm">
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full h-full bg-[#F8F7F4] relative"
        >
          {/* Tote bag handle left */}
          <div className="absolute top-0 left-1/4 w-2 h-16 transform -translate-x-1/2 bg-[#E8E6E1] rounded-t-full"></div>
          
          {/* Tote bag handle right */}
          <div className="absolute top-0 right-1/4 w-2 h-16 transform translate-x-1/2 bg-[#E8E6E1] rounded-t-full"></div>
          
          {/* Tote bag body */}
          <div className="absolute top-16 left-4 right-4 bottom-4 bg-[#F8F7F4] border border-[#E8E6E1] rounded-b-lg flex items-center justify-center">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <MotionDiv
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center p-4 text-center"
                >
                  <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Generating your design...
                  </p>
                </MotionDiv>
              ) : logoUrl ? (
                <MotionDiv
                  key="logo"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isLogoLoaded ? 1 : 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-3/4 aspect-square"
                >
                  <img
                    src={logoUrl}
                    alt="Generated logo"
                    className={`w-full h-full object-contain transition-all duration-500 ${
                      isLogoLoaded ? "image-loaded" : "image-loading"
                    }`}
                    onLoad={() => setIsLogoLoaded(true)}
                  />
                </MotionDiv>
              ) : (
                <MotionDiv
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center p-4 text-center"
                >
                  <p className="text-sm text-muted-foreground">
                    Enter a prompt to generate a design
                  </p>
                </MotionDiv>
              )}
            </AnimatePresence>
          </div>
        </MotionDiv>
      </div>
      
      {/* Reflection effect */}
      <div className="absolute inset-x-8 top-1/4 h-1/3 bg-white/5 rounded-full blur-2xl"></div>
      
      {/* Subtle shadow */}
      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background/50 to-transparent"></div>
    </div>
  );
};

export default ToteBagPreview;

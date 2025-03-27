
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

// Simple AnimatePresence replacement
const AnimatePresence = ({ children }) => children;

// Simple motion.div replacement
const MotionDiv = ({ 
  children, 
  className = "",
  key
}) => (
  <div className={className} key={key}>{children}</div>
);

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
    <div className={`relative aspect-square w-full overflow-hidden rounded-sm border border-[#e2e2e2] bg-[#f9f9f9] ${className}`}>
      <AnimatePresence>
        {isGenerating ? (
          <MotionDiv
            key="loading"
            className="flex h-full w-full flex-col items-center justify-center p-4 text-center"
          >
            <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
            <p className="mt-4 text-sm text-gray-500">
              Generating your design...
            </p>
          </MotionDiv>
        ) : logoUrl ? (
          <MotionDiv
            key="logo"
            className="flex h-full w-full items-center justify-center p-4"
          >
            <img
              src={logoUrl}
              alt="Generated logo"
              className={`h-full w-full object-contain transition-all duration-500 ${
                isLogoLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setIsLogoLoaded(true)}
            />
          </MotionDiv>
        ) : (
          <MotionDiv
            key="placeholder"
            className="flex h-full w-full flex-col items-center justify-center p-4 text-center"
          >
            <p className="text-sm text-gray-500">
              Your design will appear here
            </p>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LogoPreview;

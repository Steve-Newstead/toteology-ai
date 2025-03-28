
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Let's replace the direct import with a conditional one
// import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Info } from "lucide-react";
import ToteBagPreview from "@/components/ToteBagPreview";
import PromptInput from "@/components/PromptInput";
import { useToteStore } from "@/store"; // Updated import path
import { toast } from "sonner";

// Create a simple motion component replacement to avoid dependency issues
const MotionDiv = ({ 
  children, 
  className = "",
  initial = {}, 
  animate = {}, 
  transition = {}
}) => (
  <div className={className}>{children}</div>
);

const Customize = () => {
  const navigate = useNavigate();
  const { prompt, logoUrl, isGenerating, error, resetError } = useToteStore();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  useEffect(() => {
    if (error) {
      toast.error(error);
      resetError();
    }
  }, [error, resetError]);
  
  const handleContinue = () => {
    if (!logoUrl) {
      toast.error("Please generate a design first");
      return;
    }
    
    navigate("/preview");
  };
  
  return (
    <div className="min-h-screen pt-16">
      <div className="page-container">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-lg mx-auto text-center mb-12"
        >
          <h1 className="heading-2 mb-4">Create Your Custom Design</h1>
          <p className="body-text">
            Describe the design you'd like to see on your tote bag, and our AI will bring it to life. Be as specific or creative as you like!
          </p>
        </MotionDiv>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 max-w-5xl mx-auto">
          <MotionDiv
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-col"
          >
            <ToteBagPreview logoUrl={logoUrl} isGenerating={isGenerating} />
          </MotionDiv>
          
          <MotionDiv
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col"
          >
            <div className="space-y-8">
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="text-lg font-medium mb-4">Design Your Tote</h3>
                <PromptInput />
              </div>
              
              <div className="flex items-start space-x-4 rounded-lg border border-border bg-secondary/40 p-4">
                <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Be specific about colors, style, and subject matter for best results. The more details you provide, the better your design will turn out.
                  </p>
                </div>
              </div>
              
              <Button
                size="lg"
                className="w-full"
                disabled={!logoUrl || isGenerating}
                onClick={handleContinue}
              >
                Continue to Preview <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </MotionDiv>
        </div>
      </div>
    </div>
  );
};

export default Customize;

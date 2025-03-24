
import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { useToteStore } from "@/store/store";
import { Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface PromptInputProps {
  className?: string;
}

const PromptInput = ({ className = "" }: PromptInputProps) => {
  const { prompt, setPrompt, generateLogo, isGenerating } = useToteStore();
  const [inputValue, setInputValue] = useState(prompt);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) {
      toast.error("Please enter a description for your design");
      return;
    }
    
    try {
      setPrompt(inputValue);
      await generateLogo(inputValue);
    } catch (error) {
      console.error("Error generating logo:", error);
      toast.error("Failed to generate design. Please try again.");
    }
  };

  const handleClear = () => {
    setInputValue("");
    setPrompt("");
  };

  const promptIdeas = [
    "Minimal wave pattern",
    "Abstract mountain landscape",
    "Geometric cat silhouette",
    "Floral mandala",
    "Retro sunset with palm trees",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`space-y-4 ${className}`}
    >
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="relative">
          <Input
            type="text"
            placeholder="Describe your design idea..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="pr-10"
            disabled={isGenerating}
          />
          {inputValue && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={handleClear}
              disabled={isGenerating}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <Button
          type="submit"
          className="w-full"
          disabled={isGenerating || !inputValue.trim()}
        >
          {isGenerating ? (
            <>Generating</>
          ) : (
            <>
              Generate Design <Sparkles className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Need inspiration? Try one of these:</p>
        <div className="flex flex-wrap gap-2">
          {promptIdeas.map((idea) => (
            <Button
              key={idea}
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => {
                setInputValue(idea);
                setPrompt(idea);
              }}
              disabled={isGenerating}
            >
              {idea}
            </Button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PromptInput;

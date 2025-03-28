
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowLeft, RefreshCcw } from "lucide-react";
import ToteBagPreview from "@/components/ToteBagPreview";
import { useToteStore, useCartStore } from "@/store"; // Updated import path
import { CartItem } from "@/store/cartStore"; // Direct import of the type
import { toast } from "sonner";

const Preview = () => {
  const navigate = useNavigate();
  const { prompt, logoUrl, isGenerating } = useToteStore();
  const { addItem } = useCartStore();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Redirect to customize page if no logo is generated
    if (!logoUrl) {
      navigate("/customize");
    }
  }, [logoUrl, navigate]);
  
  const handleAddToCart = () => {
    if (!logoUrl) {
      toast.error("Please generate a design first");
      return;
    }
    
    const item: CartItem = {
      id: Date.now().toString(),
      name: "Custom Tote Bag",
      price: 34.99,
      quantity: 1,
      imageUrl: logoUrl,
      logoPrompt: prompt,
    };
    
    addItem(item);
    toast.success("Added to cart");
    navigate("/checkout");
  };
  
  return (
    <div className="min-h-screen pt-16">
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-lg mx-auto text-center mb-12"
        >
          <h1 className="heading-2 mb-4">Preview Your Custom Tote</h1>
          <p className="body-text">
            Take a look at your design and make sure it's exactly what you want before adding it to your cart.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-col"
          >
            <ToteBagPreview logoUrl={logoUrl} isGenerating={isGenerating} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col"
          >
            <div className="space-y-8">
              <div className="rounded-lg border border-border bg-card p-6 space-y-4">
                <h3 className="text-lg font-medium">Product Details</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Product</span>
                    <span className="font-medium">Custom Tote Bag</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Material</span>
                    <span>100% Organic Cotton</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Size</span>
                    <span>15" x 16" x 4"</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Handle Drop</span>
                    <span>9"</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Design Prompt</span>
                    <span className="max-w-[200px] truncate text-right" title={prompt}>{prompt}</span>
                  </div>
                  <div className="pt-2 flex justify-between items-center border-t border-border">
                    <span className="font-medium">Price</span>
                    <span className="text-lg font-medium">$34.99</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-4">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleAddToCart}
                >
                  Add to Cart <ShoppingBag className="ml-2 h-4 w-4" />
                </Button>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/customize")}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/customize")}
                  >
                    <RefreshCcw className="mr-2 h-4 w-4" /> New Design
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Preview;

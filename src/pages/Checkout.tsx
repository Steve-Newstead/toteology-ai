
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard,
  ShieldCheck
} from "lucide-react";
import { useCartStore } from "@/store/store";
import { toast } from "sonner";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, removeItem, addItem, totalPrice, totalItems, clearCart } = useCartStore();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Order placed successfully! Thank you for your purchase.");
    clearCart();
    navigate("/");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleQuantityChange = (item: any, change: number) => {
    if (item.quantity + change < 1) {
      removeItem(item.id);
      return;
    }
    
    const updatedItem = { ...item, quantity: item.quantity + change };
    addItem(updatedItem);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-16">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg mx-auto text-center py-12"
          >
            <ShoppingBag className="h-16 w-16 mx-auto mb-6 text-muted-foreground/50" />
            <h1 className="heading-2 mb-4">Your Cart is Empty</h1>
            <p className="body-text mb-8">
              You haven't added any items to your cart yet. Start by creating a custom tote bag design.
            </p>
            <Button asChild size="lg">
              <a href="/customize">Create a Design</a>
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-lg mx-auto text-center mb-8"
        >
          <h1 className="heading-2 mb-4">Checkout</h1>
          <p className="body-text">Complete your order and get ready to enjoy your custom tote bag.</p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="space-y-6">
              <h2 className="heading-3">Your Cart</h2>
              
              <div className="space-y-4">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex space-x-4 rounded-lg border border-border bg-card p-4"
                  >
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-border">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between text-base font-medium">
                        <h3>{item.name}</h3>
                        <p className="ml-4">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                        Design: {item.logoPrompt}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-2">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleQuantityChange(item, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleQuantityChange(item, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="rounded-lg border border-border bg-card p-4 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(totalPrice())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{formatPrice(5.99)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatPrice(totalPrice() * 0.07)}</span>
                </div>
                <div className="border-t border-border pt-4 flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice() + 5.99 + totalPrice() * 0.07)}</span>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className="flex items-center"
                onClick={() => navigate("/customize")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <form onSubmit={handleCheckout} className="space-y-6">
              <h2 className="heading-3">Shipping Information</h2>
              
              <div className="rounded-lg border border-border bg-card p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium">
                      First Name
                    </label>
                    <Input
                      id="firstName"
                      type="text"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium">
                      Last Name
                    </label>
                    <Input
                      id="lastName"
                      type="text"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium">
                    Address
                  </label>
                  <Input
                    id="address"
                    type="text"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="city" className="text-sm font-medium">
                      City
                    </label>
                    <Input
                      id="city"
                      type="text"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="postalCode" className="text-sm font-medium">
                      Postal Code
                    </label>
                    <Input
                      id="postalCode"
                      type="text"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="country" className="text-sm font-medium">
                    Country
                  </label>
                  <Input
                    id="country"
                    type="text"
                    required
                  />
                </div>
              </div>
              
              <h2 className="heading-3">Payment Information</h2>
              
              <div className="rounded-lg border border-border bg-card p-6 space-y-4">
                <div className="space-y-2">
                  <label htmlFor="cardNumber" className="text-sm font-medium">
                    Card Number
                  </label>
                  <Input
                    id="cardNumber"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="expiration" className="text-sm font-medium">
                      Expiration Date
                    </label>
                    <Input
                      id="expiration"
                      type="text"
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="cvc" className="text-sm font-medium">
                      CVC
                    </label>
                    <Input
                      id="cvc"
                      type="text"
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <ShieldCheck className="h-5 w-5" />
                <span>All payment information is encrypted and secure</span>
              </div>
              
              <Button
                type="submit"
                size="lg"
                className="w-full"
              >
                Complete Order <CreditCard className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard,
  ShieldCheck,
  LogIn
} from "lucide-react";
import { useCartStore } from "@/store/store";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { processPayment } from "@/services/stripeService";
import { placeOrder } from "@/services/printifyService";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Define form schema
const checkoutFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  cardNumber: z.string().min(1, "Card number is required"),
  expiration: z.string().min(1, "Expiration date is required"),
  cvc: z.string().min(1, "CVC is required"),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

const Checkout = () => {
  const navigate = useNavigate();
  const { user, isGuest } = useAuth();
  const { items, removeItem, addItem, totalPrice, totalItems, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Initialize form with react-hook-form
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: user?.email || "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
      cardNumber: "",
      expiration: "",
      cvc: "",
    },
  });
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCheckout = async (values: CheckoutFormValues) => {
    try {
      setIsProcessing(true);
      
      // Mock payment method ID (in production this would come from Stripe Elements)
      const mockPaymentMethodId = `pm_${Math.random().toString(36).substring(2, 15)}`;
      
      // Process the payment
      const paymentResult = await processPayment(
        mockPaymentMethodId,
        totalPrice() + 5.99 + totalPrice() * 0.07,
        values.email
      );
      
      if (paymentResult.success) {
        // Process the order with the first item in cart
        if (items.length > 0) {
          const item = items[0];
          
          const orderResult = await placeOrder({
            product: {
              id: "tote-bag-standard",
              variants: [{ id: item.variantId || "tote-bag-standard-natural" }]
            },
            designUrl: item.imageUrl,
            shippingInfo: {
              address: {
                name: `${values.firstName} ${values.lastName}`,
                street: values.address,
                city: values.city,
                state: '', // Not collected in the current form
                zipCode: values.postalCode,
                country: values.country
              },
              method: "standard"
            },
            billingInfo: {
              sameAsShipping: true,
              address: null,
              paymentMethod: {
                type: 'credit_card',
                cardNumber: values.cardNumber,
                cardExpiry: values.expiration,
                cardCvc: values.cvc
              }
            }
          });
          
          if (orderResult.success) {
            toast.success("Payment successful! Thank you for your purchase.");
            clearCart();
            navigate("/");
          } else {
            toast.error("There was a problem with your order. Please try again.");
          }
        }
      } else {
        toast.error("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("An error occurred while processing your payment.");
    } finally {
      setIsProcessing(false);
    }
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
          <div
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="page-container">
        <div
          className="max-w-lg mx-auto text-center mb-8"
        >
          <h1 className="heading-2 mb-4">Checkout</h1>
          <p className="body-text">Complete your order and get ready to enjoy your custom tote bag.</p>
          
          {isGuest && (
            <div className="mt-4 p-3 bg-muted rounded-lg flex items-center justify-between">
              <p className="text-sm text-muted-foreground">You're checking out as a guest</p>
              <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                <LogIn className="h-4 w-4 mr-2" />
                Sign in
              </Button>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 max-w-6xl mx-auto">
          <div>
            <div className="space-y-6">
              <h2 className="heading-3">Your Cart</h2>
              
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
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
                  </div>
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
          </div>
          
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCheckout)} className="space-y-6">
                <h2 className="heading-3">Shipping Information</h2>
                
                <div className="rounded-lg border border-border bg-card p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <h2 className="heading-3">Payment Information</h2>
                
                <div className="rounded-lg border border-border bg-card p-6 space-y-4">
                  <div className="flex items-center mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Secure payment via Stripe</span>
                      <img src="https://cdn.jsdelivr.net/gh/stephenhutchings/typicons.font@v2.0.7/src/svg/lock-closed.svg" alt="secure" className="h-4 w-4" />
                    </div>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Card Number</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="1234 5678 9012 3456" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="expiration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiration Date</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="MM/YY" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cvc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CVC</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="123" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Complete Order"} <CreditCard className="ml-2 h-4 w-4" />
                </Button>
                
                <div className="flex justify-center space-x-2 mt-4">
                  <img src="https://www.vectorlogo.zone/logos/visa/visa-icon.svg" alt="visa" className="h-6" />
                  <img src="https://www.vectorlogo.zone/logos/mastercard/mastercard-icon.svg" alt="mastercard" className="h-6" />
                  <img src="https://www.vectorlogo.zone/logos/americanexpress/americanexpress-icon.svg" alt="amex" className="h-6" />
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

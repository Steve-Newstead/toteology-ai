
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
import { useCartStore, useCheckoutStore } from "@/store";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { processPayment, getPaymentElementOptions } from "@/services/stripeService";
import { placeOrder } from "@/services/printifyService";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Stripe publishable key
const stripePromise = loadStripe('pk_test_51R7OuiIZcV6xBCiCu9ekAPSfvD5xyqUnYA59pZcqkFQXnIWsiPRHkzynHTjit2b60LRDV5BsgBjW79d2TFjg3VJL00sAoNlbUA');

// Define form schema
const checkoutFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

// Stripe payment component
const CheckoutForm = ({ onAddressUpdate, onPaymentComplete }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    // Use confirmPayment to handle the payment
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-confirmation`,
      },
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message || 'An error occurred with your payment');
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // If we get a shipping address from Apple Pay / Google Pay
      // extract it and pass it to the parent
      if (paymentIntent.shipping) {
        const { name, address } = paymentIntent.shipping;
        onAddressUpdate({
          name,
          street: address.line1,
          city: address.city,
          state: address.state,
          zipCode: address.postal_code,
          country: address.country,
        });
      }
      
      onPaymentComplete(paymentIntent);
    }
  };

  const paymentElementOptions = getPaymentElementOptions();

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <PaymentElement options={paymentElementOptions} />
        
        {errorMessage && (
          <div className="text-sm text-destructive">{errorMessage}</div>
        )}
        
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isProcessing || !stripe}
        >
          {isProcessing ? "Processing..." : "Pay Now"} <CreditCard className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

const Checkout = () => {
  const navigate = useNavigate();
  const { user, isGuest } = useAuth();
  const { items, removeItem, addItem, totalPrice, totalItems, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [showStripeForm, setShowStripeForm] = useState(false);
  
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
    },
  });
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Initialize Stripe with a mock client secret
  // In a real implementation, this would come from your backend
  useEffect(() => {
    // Create a mock client secret for demo purposes
    // In a real app, you would fetch this from your server
    const mockClientSecret = `pi_${Math.random().toString(36).substring(2)}_secret_${Math.random().toString(36).substring(2)}`;
    setClientSecret(mockClientSecret);
  }, []);

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

  const handleAddressUpdate = (addressData) => {
    // Update the form with address data from Apple Pay / Google Pay
    form.setValue('firstName', addressData.name.split(' ')[0] || '');
    form.setValue('lastName', addressData.name.split(' ').slice(1).join(' ') || '');
    form.setValue('address', addressData.street);
    form.setValue('city', addressData.city);
    form.setValue('postalCode', addressData.zipCode);
    form.setValue('country', addressData.country);
    
    toast.success("Address updated from payment information");
  };

  const handlePaymentComplete = (paymentResult) => {
    // Process the order after payment is complete
    handleProcessOrder(paymentResult);
  };

  const handleProcessOrder = async (paymentResult) => {
    try {
      setIsProcessing(true);
      const values = form.getValues();
      
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
              // We don't need to collect these since Stripe handles it
              cardNumber: '',
              cardExpiry: '',
              cardCvc: ''
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
    } catch (error) {
      console.error("Order processing error:", error);
      toast.error("An error occurred while processing your order.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckout = async (values: CheckoutFormValues) => {
    if (!showStripeForm) {
      setShowStripeForm(true);
      return;
    }
    
    // This is only used if the user skips the Stripe form
    // In practice, they should always use the Stripe form
    try {
      setIsProcessing(true);
      
      // For demo purposes we'll create a mock payment
      const mockPaymentMethodId = `pm_${Math.random().toString(36).substring(2, 15)}`;
      
      const paymentResult = await processPayment(
        mockPaymentMethodId,
        totalPrice() + 5.99 + totalPrice() * 0.07,
        values.email
      );
      
      if (paymentResult.success) {
        await handleProcessOrder(paymentResult);
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
                
                <h2 className="heading-3">Payment</h2>
                
                <div className="rounded-lg border border-border bg-card p-6 space-y-4">
                  {clientSecret && showStripeForm ? (
                    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                      <CheckoutForm 
                        onAddressUpdate={handleAddressUpdate}
                        onPaymentComplete={handlePaymentComplete}
                      />
                    </Elements>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">Secure payment via Stripe</span>
                          <ShieldCheck className="h-4 w-4" />
                        </div>
                      </div>
                      
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={isProcessing}
                      >
                        Continue to Payment <CreditCard className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  
                  <div className="flex justify-center space-x-2 mt-4">
                    <img src="https://www.vectorlogo.zone/logos/visa/visa-icon.svg" alt="visa" className="h-6" />
                    <img src="https://www.vectorlogo.zone/logos/mastercard/mastercard-icon.svg" alt="mastercard" className="h-6" />
                    <img src="https://www.vectorlogo.zone/logos/americanexpress/americanexpress-icon.svg" alt="amex" className="h-6" />
                    <img src="https://www.vectorlogo.zone/logos/apple/apple-icon.svg" alt="apple pay" className="h-6" />
                    <img src="https://www.vectorlogo.zone/logos/google/google-icon.svg" alt="google pay" className="h-6" />
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <ShieldCheck className="h-5 w-5" />
                    <span>All payment information is encrypted and secure</span>
                  </div>
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

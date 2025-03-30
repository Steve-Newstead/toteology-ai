
import { loadStripe } from '@stripe/stripe-js';

// Stripe publishable key (test mode)
// This is a publishable key, so it's safe to include in the client-side code
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51R7OuiIZcV6xBCiCu9ekAPSfvD5xyqUnYA59pZcqkFQXnIWsiPRHkzynHTjit2b60LRDV5BsgBjW79d2TFjg3VJL00sAoNlbUA';

// Initialize Stripe with caching
let stripePromise: Promise<any> | null = null;

// Initialize Stripe
export const getStripePromise = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

// Create a payment session for checkout
export const createCheckoutSession = async (items: any[], customerEmail: string) => {
  try {
    const stripePromise = await getStripePromise();
    
    if (!stripePromise) {
      throw new Error('Failed to initialize Stripe');
    }
    
    // Create line items for Stripe checkout
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: [item.imageUrl],
          description: `Custom design: ${item.logoPrompt}`
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));
    
    // This is a mock implementation that simulates a checkout session
    // In a real implementation, you would call your backend API
    console.log('Creating mock Stripe checkout session for:', { 
      items, 
      customerEmail,
      lineItems
    });
    
    // For demonstration, create a mock session URL
    const mockSessionId = `cs_test_${Math.random().toString(36).substring(2, 15)}`;
    
    // For demonstration purposes, return a mock session
    return {
      id: mockSessionId,
      url: `https://checkout.stripe.com/pay/${mockSessionId}`,
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// Process a payment with Stripe Elements
export const processPayment = async (
  paymentMethodId: string, 
  amount: number,
  customerEmail: string
) => {
  try {
    // Log the payment request
    console.log('Processing payment:', { paymentMethodId, amount, customerEmail });
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock successful response
    return {
      success: true,
      transactionId: `txn_${Math.random().toString(36).substring(2, 10)}`,
      amount,
    };
  } catch (error) {
    console.error('Payment processing error:', error);
    throw error;
  }
};

// Function to redirect to Stripe Checkout
export const redirectToCheckout = async (sessionId: string) => {
  const stripe = await getStripePromise();
  
  if (!stripe) {
    throw new Error('Failed to initialize Stripe');
  }
  
  console.log('Redirecting to Stripe Checkout with session ID:', sessionId);
  
  // In a real implementation with proper backend, this would redirect to Stripe
  // For demo purposes, we'll simulate a successful checkout after a delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return { success: true };
};

// Create a mock payment intent client secret
export const createMockPaymentIntent = async (amount: number, currency = 'usd') => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate a mock client secret that looks similar to a real one
  const mockClientSecret = `pi_${Math.random().toString(36).substring(2)}_secret_${Math.random().toString(36).substring(2)}`;
  
  console.log(`Created mock payment intent for ${amount} ${currency}: ${mockClientSecret}`);
  
  return mockClientSecret;
};

// Configuration for Stripe Payment Element with Apple Pay and Google Pay
export const getPaymentElementOptions = () => {
  return {
    layout: "tabs",
    defaultValues: {
      billingDetails: {
        name: '',
        email: '',
        phone: '',
        address: {
          line1: '',
          line2: '',
          city: '',
          state: '',
          postal_code: '',
          country: '',
        },
      },
    },
    wallets: {
      applePay: 'auto',
      googlePay: 'auto',
    }
  };
};

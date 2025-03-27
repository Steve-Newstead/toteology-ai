
import { loadStripe } from '@stripe/stripe-js';

// Stripe publishable key (test mode)
// This is a publishable key, so it's safe to include in the client-side code
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51R7OuiIZcV6xBCiCu9ekAPSfvD5xyqUnYA59pZcqkFQXnIWsiPRHkzynHTjit2b60LRDV5BsgBjW79d2TFjg3VJL00sAoNlbUA';

// Initialize Stripe
export const getStripePromise = () => {
  return loadStripe(STRIPE_PUBLISHABLE_KEY);
};

// Create a payment session for checkout
export const createCheckoutSession = async (items: any[], customerEmail: string) => {
  try {
    // Mock API call to create session (in a real app, this would call your backend)
    console.log('Creating Stripe checkout session for:', { items, customerEmail });
    
    // In dev mode, we'll simulate a successful response
    // In production, you'd call a backend API that creates a Stripe session
    const mockSessionResponse = {
      id: `cs_test_${Math.random().toString(36).substring(2, 15)}`,
      url: `https://checkout.stripe.com/pay/cs_test_${Math.random().toString(36).substring(2, 15)}`,
    };
    
    // This is a mock - in production this would redirect to the Stripe Checkout page
    return mockSessionResponse;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// Process a payment with Stripe Elements (mock for dev)
export const processPayment = async (
  paymentMethodId: string, 
  amount: number,
  customerEmail: string
) => {
  try {
    // Log the payment request
    console.log('Processing payment:', { paymentMethodId, amount, customerEmail });
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
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


import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

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
    const stripePromise = await getStripePromise();
    
    if (!stripePromise) {
      throw new Error('Failed to initialize Stripe');
    }
    
    // In a real implementation, this would call your backend API
    // For now, we'll continue with the mock implementation, but
    // with better structure for future real implementation
    console.log('Creating Stripe checkout session for:', { items, customerEmail });
    
    // This mock would be replaced with a real API call to your backend
    // which would then create a Stripe session and return the ID
    const mockSessionId = `cs_test_${Math.random().toString(36).substring(2, 15)}`;
    
    // For demonstration, create a mock session URL
    // In production, you would redirect to the URL returned from Stripe
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
    
    // In a real implementation, this would call your backend API
    // to create a PaymentIntent and confirm it
    // For now, we'll simulate a successful payment
    
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

// Function to redirect to Stripe Checkout (for future implementation)
export const redirectToCheckout = async (sessionId: string) => {
  const stripe = await getStripePromise();
  
  if (!stripe) {
    throw new Error('Failed to initialize Stripe');
  }
  
  // In a real implementation, this would redirect to the Stripe Checkout page
  // For now, we'll just log it
  console.log('Redirecting to Stripe Checkout with session ID:', sessionId);
  
  // This is how you would redirect in a real implementation:
  // return stripe.redirectToCheckout({ sessionId });
  
  // For demo purposes, we'll just return success
  return { success: true };
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

// Create Stripe Elements component to handle Apple Pay / Google Pay
export const StripePaymentElementWrapper = ({ clientSecret, onAddressChange, onPaymentComplete }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin,
        payment_method_data: {
          billing_details: {
            // The billing details will be populated from Apple Pay / Google Pay
            // when the user completes the payment
          },
        },
      },
      redirect: 'if_required',
    });

    if (result.error) {
      console.error(result.error.message);
    } else {
      // Check if we can get billing address from the completed payment
      if (result.paymentIntent && result.paymentIntent.payment_method) {
        // In a real implementation, we would extract the billing details
        // For now, we'll mock a successful address update
        const mockAddress = {
          name: 'John Doe',
          street: '123 Main St',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94105',
          country: 'US',
        };
        
        // Call the callback to update the form with the address from the wallet
        onAddressChange(mockAddress);
      }
      
      // Call the completion callback
      onPaymentComplete(result);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement 
        options={{
          wallets: {
            applePay: 'auto',
            googlePay: 'auto',
          },
        }}
        onChange={(event) => {
          // If the user completes a wallet payment, we may be able
          // to extract the billing/shipping details here
          if (event.complete && event.value && event.value.type === 'wallet') {
            console.log('Wallet payment completed, extracting address data');
            // This would be populated with real data in a production implementation
          }
        }}
      />
      <button type="submit" disabled={!stripe}>
        Pay now
      </button>
    </form>
  );
};

// Wrap payment element with Stripe Elements context
export const StripePaymentWrapper = ({ clientSecret, onAddressChange, onPaymentComplete }) => {
  const stripePromise = getStripePromise();
  
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <StripePaymentElementWrapper 
        clientSecret={clientSecret}
        onAddressChange={onAddressChange}
        onPaymentComplete={onPaymentComplete}
      />
    </Elements>
  );
};

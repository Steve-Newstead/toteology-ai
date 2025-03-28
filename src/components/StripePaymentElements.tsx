
import React from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getStripePromise, getPaymentElementOptions } from '@/services/stripeService';

// Type definitions
interface StripePaymentElementWrapperProps {
  clientSecret: string;
  onAddressChange: (address: any) => void;
  onPaymentComplete: (result: any) => void;
}

interface StripePaymentWrapperProps extends StripePaymentElementWrapperProps {}

// Create Stripe Elements component to handle Apple Pay / Google Pay
export const StripePaymentElementWrapper: React.FC<StripePaymentElementWrapperProps> = ({ 
  clientSecret, 
  onAddressChange, 
  onPaymentComplete 
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout`, // Ensure we return to checkout
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
      console.error('Payment error:', result.error.message);
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
      
      // Call the completion callback with the result
      onPaymentComplete(result);
    }
  };

  const paymentElementOptions = getPaymentElementOptions();

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
      <button type="submit" disabled={!stripe} className="w-full px-4 py-2 mt-4 bg-primary text-white rounded hover:bg-primary/90 transition-colors">
        Pay now
      </button>
    </form>
  );
};

// Wrap payment element with Stripe Elements context
export const StripePaymentWrapper: React.FC<StripePaymentWrapperProps> = ({ 
  clientSecret, 
  onAddressChange, 
  onPaymentComplete 
}) => {
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

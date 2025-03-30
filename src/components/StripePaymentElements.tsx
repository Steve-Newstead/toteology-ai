
import React, { useState } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getStripePromise, getPaymentElementOptions } from '@/services/stripeService';
import { Button } from '@/components/ui/button';

// Type definitions
interface StripePaymentElementWrapperProps {
  clientSecret: string;
  onAddressChange: (address: any) => void;
  onPaymentComplete: (result: any) => void;
}

interface StripePaymentWrapperProps extends StripePaymentElementWrapperProps {}

// Create Stripe Elements component to handle payments
export const StripePaymentElementWrapper: React.FC<StripePaymentElementWrapperProps> = ({ 
  clientSecret, 
  onAddressChange, 
  onPaymentComplete 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setErrorMessage("Stripe has not been properly initialized");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    
    try {
      // For demonstration purposes, we'll simulate a successful payment
      // In a real implementation, we would use stripe.confirmPayment
      console.log('Processing payment with Stripe Elements');
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock address data from wallet payment
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
      
      // Create a mock successful payment result
      const mockPaymentResult = {
        paymentIntent: {
          id: `pi_${Math.random().toString(36).substring(2)}`,
          status: 'succeeded',
          amount: 2500,
          currency: 'usd',
        }
      };
      
      // Call the completion callback with the result
      onPaymentComplete(mockPaymentResult);
      
    } catch (error) {
      console.error('Payment processing error:', error);
      setErrorMessage('An unexpected error occurred during payment processing');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {errorMessage && (
        <div className="p-3 mb-4 text-sm bg-red-100 border border-red-300 text-red-700 rounded">
          {errorMessage}
        </div>
      )}
      
      <PaymentElement 
        options={{
          wallets: {
            applePay: 'auto',
            googlePay: 'auto',
          },
        }}
        onChange={(event) => {
          // Clear any previous errors when the user makes changes
          if (errorMessage) setErrorMessage(null);
          
          // If the user completes a wallet payment, we may be able
          // to extract the billing/shipping details here
          if (event.complete && event.value && event.value.type === 'wallet') {
            console.log('Wallet payment completed, extracting address data');
            // This would be populated with real data in a production implementation
          }
        }}
      />
      
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full px-4 py-2 mt-4 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
      >
        {isProcessing ? 'Processing...' : 'Pay now'}
      </Button>
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
    <Elements 
      stripe={stripePromise} 
      options={{ 
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#0f172a',
            colorBackground: '#ffffff',
            colorText: '#1e293b',
          }
        }
      }}
    >
      <StripePaymentElementWrapper 
        clientSecret={clientSecret}
        onAddressChange={onAddressChange}
        onPaymentComplete={onPaymentComplete}
      />
    </Elements>
  );
};

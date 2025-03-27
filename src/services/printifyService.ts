import { toast } from "sonner";

// Mock Printify product data
export const printifyProducts = [
  {
    id: "tote-bag-standard",
    name: "Standard Tote Bag",
    description: "Durable 100% organic cotton tote bag",
    price: 34.99,
    variants: [
      {
        id: "tote-bag-standard-black",
        name: "Black",
        inStock: true,
      },
      {
        id: "tote-bag-standard-natural",
        name: "Natural",
        inStock: true,
      },
    ],
    shippingInfo: {
      methods: [
        {
          id: "standard",
          name: "Standard Shipping",
          price: 4.99,
          estimatedDays: "5-7 business days",
        },
        {
          id: "express",
          name: "Express Shipping",
          price: 9.99,
          estimatedDays: "2-3 business days",
        },
      ],
    },
  },
  {
    id: "tote-bag-premium",
    name: "Premium Tote Bag",
    description: "Premium heavyweight cotton tote with reinforced handles",
    price: 44.99,
    variants: [
      {
        id: "tote-bag-premium-black",
        name: "Black",
        inStock: true,
      },
      {
        id: "tote-bag-premium-navy",
        name: "Navy",
        inStock: false,
      },
    ],
    shippingInfo: {
      methods: [
        {
          id: "standard",
          name: "Standard Shipping",
          price: 4.99,
          estimatedDays: "5-7 business days",
        },
        {
          id: "express",
          name: "Express Shipping",
          price: 9.99,
          estimatedDays: "2-3 business days",
        },
      ],
    },
  },
];

// Mock function to get product information
export const getProductInfo = async (productId: string) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return printifyProducts.find((product) => product.id === productId) || null;
};

// Mock function to get shipping rates
export const getShippingRates = async (
  productId: string,
  address: {
    country: string;
    state: string;
    zipCode: string;
  }
) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 700));
  
  const product = printifyProducts.find((p) => p.id === productId);
  
  if (!product) {
    return [];
  }
  
  // Return shipping methods with small variations based on location
  return product.shippingInfo.methods.map((method) => ({
    ...method,
    price:
      method.id === "express" && address.state === "CA"
        ? method.price - 1 // Slight discount for CA express shipping
        : method.price,
  }));
};

import { supabase } from '@/integrations/supabase/client';

// Mock function to submit an order to Printify
export const submitPrintifyOrder = async (orderData: {
  productId: string;
  variantId: string;
  quantity: number;
  shippingMethod: string;
  address: any;
  designUrl: string;
}) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
  
  // Log the order data (for demonstration purposes)
  console.log("Printify order submitted:", { orderId, ...orderData });
  
  // Return a mock response
  return {
    success: true,
    orderId,
    estimatedShipping: "2-3 business days",
    estimatedDelivery: "May 25 - May 30",
  };
};

// Mock function to check order status
export const checkOrderStatus = async (orderId: string) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  // Generate a random status for demo purposes
  const statuses = ["processing", "printing", "shipped", "delivered"];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  
  return {
    orderId,
    status: randomStatus,
    lastUpdated: new Date().toISOString(),
    trackingNumber: randomStatus === "shipped" || randomStatus === "delivered" ? "TRK123456789" : null,
    trackingUrl: randomStatus === "shipped" || randomStatus === "delivered" ? "https://example.com/track" : null,
  };
};

// Updated function to place an order
export const placeOrder = async (orderData: {
  product: any;
  designUrl: string;
  shippingInfo: any;
  billingInfo: any;
}) => {
  try {
    // Show toast for processing
    toast.info("Processing your order...");
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Get the current user from Supabase
    const { data: { user } } = await supabase.auth.getUser();
    
    // Prepare shipping and billing address as JSON
    const shippingAddress = {
      name: orderData.shippingInfo.address?.name || '',
      street: orderData.shippingInfo.address?.street || '',
      city: orderData.shippingInfo.address?.city || '',
      state: orderData.shippingInfo.address?.state || '',
      zipCode: orderData.shippingInfo.address?.zipCode || '',
      country: orderData.shippingInfo.address?.country || '',
    };
    
    const billingAddress = orderData.billingInfo.sameAsShipping 
      ? shippingAddress 
      : {
          name: orderData.billingInfo.address?.name || '',
          street: orderData.billingInfo.address?.street || '',
          city: orderData.billingInfo.address?.city || '',
          state: orderData.billingInfo.address?.state || '',
          zipCode: orderData.billingInfo.address?.zipCode || '',
          country: orderData.billingInfo.address?.country || '',
        };
    
    // Submit to Printify (mocked)
    const printifyResult = await submitPrintifyOrder({
      productId: orderData.product.id,
      variantId: orderData.product.variants[0].id,
      quantity: 1,
      shippingMethod: orderData.shippingInfo.method,
      address: shippingAddress,
      designUrl: orderData.designUrl,
    });
    
    // Insert the order into the Supabase database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user?.id || null, // Will be null for guest checkout
        total_amount: 34.99, // Hard-coded for now, should calculate from items
        status: 'pending',
        shipping_address: shippingAddress,
        billing_address: billingAddress,
        payment_intent_id: `pi_${Math.random().toString(36).substring(2, 15)}`
      })
      .select()
      .single();
    
    if (orderError) {
      console.error('Error creating order:', orderError);
      toast.error('There was a problem saving your order');
      return { success: false, error: 'Failed to save order' };
    }
    
    // Insert the order item
    const { data: orderItem, error: itemError } = await supabase
      .from('order_items')
      .insert({
        order_id: order.id,
        name: 'Custom Tote Bag',
        price: 34.99,
        quantity: 1,
        variant_id: orderData.product.variants[0].id,
        variant_name: 'Standard',
        image_url: orderData.designUrl,
        logo_prompt: 'Custom design'
      });
    
    if (itemError) {
      console.error('Error creating order item:', itemError);
      // We created the order but failed to add the item
      // In production, you might want to delete the order or handle differently
    }
    
    if (printifyResult.success) {
      // Update the order status to processing
      await supabase
        .from('orders')
        .update({ status: 'processing' })
        .eq('id', order.id);
      
      toast.success("Order placed successfully!");
      return {
        success: true,
        orderId: order.id,
      };
    } else {
      toast.error("There was a problem with your order");
      return {
        success: false,
        error: "Failed to process with print provider",
      };
    }
  } catch (error) {
    console.error("Order error:", error);
    toast.error("There was a problem processing your order");
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
};

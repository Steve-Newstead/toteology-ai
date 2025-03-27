
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

// Unified function to place an order
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
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Submit to Printify (mocked)
    const result = await submitPrintifyOrder({
      productId: orderData.product.id,
      variantId: orderData.product.variants[0].id,
      quantity: 1,
      shippingMethod: orderData.shippingInfo.method,
      address: orderData.shippingInfo.address,
      designUrl: orderData.designUrl,
    });
    
    if (result.success) {
      toast.success("Order placed successfully!");
      return {
        success: true,
        orderId: result.orderId,
        ...result,
      };
    } else {
      toast.error("There was a problem placing your order");
      return {
        success: false,
        error: "Failed to place order",
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

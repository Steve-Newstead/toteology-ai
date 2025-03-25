
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Lazy load pages for better performance
const Customize = lazy(() => import("./pages/Customize"));
const Preview = lazy(() => import("./pages/Preview"));
const Checkout = lazy(() => import("./pages/Checkout"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Import AnimatePresence after the framer-motion package is properly installed
let AnimatePresence = ({ children }: { children: React.ReactNode }) => <>{children}</>;
try {
  // Dynamically import AnimatePresence once the package is installed
  import("framer-motion").then((framerMotion) => {
    AnimatePresence = framerMotion.AnimatePresence;
  }).catch(error => {
    console.error("Failed to load framer-motion:", error);
  });
} catch (error) {
  console.error("Error importing framer-motion:", error);
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            <Suspense fallback={<div className="page-container flex-center">Loading...</div>}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/customize" element={<Customize />} />
                <Route path="/preview" element={<Preview />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

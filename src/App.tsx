import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "@/contexts/StoreContext";
import { CartProvider } from "@/contexts/CartContext";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import Storefront from "./pages/Storefront";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Categories from "./pages/Categories";
import CategoryDetail from "./pages/CategoryDetail";
import AdminDashboard from "./pages/AdminDashboard";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <StoreProvider>
        <CartProvider>
          <BrowserRouter>
            <CartDrawer />
            <WhatsAppWidget />
            <Routes>
              <Route path="/" element={<Storefront />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/categories/:slug" element={<CategoryDetail />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </StoreProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

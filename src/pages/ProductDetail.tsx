import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useStore, Product } from "@/contexts/StoreContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import ProductQuickViewModal from "@/components/ProductQuickViewModal";
import {
  ShoppingCart,
  Minus,
  Plus,
  Sparkles,
  Check,
  Package,
  ArrowLeft,
  Home,
  Share2,
  Heart,
} from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/currency";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, settings } = useStore();
  const { addToCart, totalItems, setIsCartOpen } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const product = products.find((p) => p.id === id);
  
  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
          <Link to="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity} × ${product.name} added to cart`, {
      icon: <ShoppingCart className="h-4 w-4" />,
    });
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              {settings.logo ? (
                <img src={settings.logo} alt={settings.name} className="h-8 w-8 rounded-lg object-cover" />
              ) : (
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">
                    {settings.name.charAt(0)}
                  </span>
                </div>
              )}
              <span className="font-display font-bold text-xl text-foreground">{settings.name}</span>
            </Link>

            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Home className="h-4 w-4" />
                  Home
                </Button>
              </Link>
              <Link to="/products">
                <Button variant="ghost" size="sm">Products</Button>
              </Link>
              <Button
                variant="outline"
                size="icon"
                className="relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </motion.div>

        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative aspect-square rounded-2xl overflow-hidden bg-muted"
          >
            <motion.img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.featured && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center gap-1 rounded-full bg-accent text-accent-foreground px-3 py-1 text-xs font-semibold shadow-lg"
                >
                  <Sparkles className="h-3 w-3" />
                  Featured
                </motion.span>
              )}
              {product.stock < 20 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-full bg-destructive/90 text-destructive-foreground px-3 py-1 text-xs font-medium"
                >
                  Only {product.stock} left
                </motion.span>
              )}
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            <Link
              to={`/categories/${product.category.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-xs font-bold text-primary uppercase tracking-widest hover:underline"
            >
              {product.category}
            </Link>
            
            <h1 className="mt-2 font-display text-3xl md:text-4xl font-bold text-foreground leading-tight">
              {product.name}
            </h1>
            
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Price */}
            <div className="mt-8">
              <span className="text-5xl font-bold text-foreground">{formatCurrency(product.price, settings.currency)}</span>
            </div>

            {/* Stock Status */}
            <div className="mt-4 flex items-center gap-2 text-sm">
              {product.stock > 0 ? (
                <>
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-muted-foreground">
                    In Stock ({product.stock} available)
                  </span>
                </>
              ) : (
                <>
                  <Package className="h-4 w-4 text-destructive" />
                  <span className="text-destructive">Out of Stock</span>
                </>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="mt-8 flex items-center gap-4">
              <span className="text-sm font-medium text-foreground">Quantity:</span>
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-none"
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-16 text-center font-medium text-lg">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-none"
                  onClick={() => quantity < product.stock && setQuantity(quantity + 1)}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="flex-1 gap-2 h-14 text-lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart - {formatCurrency(product.price * quantity, settings.currency)}
              </Button>
              
              <div className="flex gap-2">
                <Button variant="outline" size="lg" className="h-14 w-14" onClick={handleShare}>
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="h-14 w-14">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-display font-bold text-foreground mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p, i) => (
                <div key={p.id} onClick={() => setQuickViewProduct(p)}>
                  <ProductCard product={p} index={i} variant="compact" />
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* Quick View Modal */}
      <ProductQuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}

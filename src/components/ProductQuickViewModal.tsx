import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/contexts/StoreContext";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, X, Minus, Plus, Sparkles, Package, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useState } from "react";
import { Link } from "react-router-dom";

interface ProductQuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const imageVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
};

const contentVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function ProductQuickViewModal({ product, isOpen, onClose }: ProductQuickViewModalProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity} × ${product.name} added to cart`, {
      icon: <ShoppingCart className="h-4 w-4" />,
    });
    setQuantity(1);
    onClose();
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) setQuantity(quantity + 1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden bg-card border-border">
        <DialogTitle className="sr-only">{product.name} - Quick View</DialogTitle>
        <DialogDescription className="sr-only">Quick view of {product.name}</DialogDescription>
        
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Section */}
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            className="relative aspect-square bg-muted overflow-hidden"
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

          {/* Content Section */}
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            className="p-6 md:p-8 flex flex-col"
          >
            <p className="text-xs font-bold text-primary uppercase tracking-widest">
              {product.category}
            </p>
            
            <h2 className="mt-2 font-display text-2xl md:text-3xl font-bold text-foreground leading-tight">
              {product.name}
            </h2>
            
            <p className="mt-3 text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Price */}
            <motion.div
              className="mt-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-4xl font-bold text-foreground">
                ${product.price}
              </span>
            </motion.div>

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
            <div className="mt-6 flex items-center gap-4">
              <span className="text-sm font-medium text-foreground">Quantity:</span>
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-none"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-none"
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-auto pt-6 space-y-3">
              <Button
                size="lg"
                className="w-full gap-2"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart - ${(product.price * quantity).toFixed(2)}
              </Button>
              
              <Link to={`/products/${product.id}`} onClick={onClose}>
                <Button variant="outline" size="lg" className="w-full">
                  View Full Details
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

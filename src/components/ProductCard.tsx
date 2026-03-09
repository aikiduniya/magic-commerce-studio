import { motion } from "framer-motion";
import { Product } from "@/contexts/StoreContext";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Eye, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  index: number;
  variant?: "featured" | "compact";
}

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.08,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

const imageOverlayVariants = {
  rest: { opacity: 0 },
  hover: { opacity: 1, transition: { duration: 0.3 } },
};

const buttonSlideUp = {
  rest: { y: 20, opacity: 0 },
  hover: { y: 0, opacity: 1, transition: { duration: 0.3, delay: 0.05 } },
};

const priceVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
};

export default function ProductCard({ product, index, variant = "compact" }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart`, {
      icon: <ShoppingCart className="h-4 w-4" />,
    });
  };

  if (variant === "featured") {
    return (
      <motion.div
        variants={cardVariants}
        custom={index}
        initial="rest"
        whileHover="hover"
        animate="visible"
        className="group relative rounded-2xl overflow-hidden bg-card border border-border cursor-pointer"
        style={{
          boxShadow: "var(--card-shadow)",
        }}
      >
        {/* Shimmer border on hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl z-10 pointer-events-none"
          variants={{
            rest: { opacity: 0 },
            hover: { opacity: 1 },
          }}
          style={{
            background: "linear-gradient(135deg, hsl(var(--primary) / 0.15), transparent, hsl(var(--accent) / 0.15))",
          }}
        />

        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <motion.img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
            variants={{
              rest: { scale: 1, filter: "brightness(1)" },
              hover: { scale: 1.08, filter: "brightness(1.05)", transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
            }}
          />

          {/* Gradient overlay on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent"
            variants={imageOverlayVariants}
          />

          {/* Floating action buttons on hover */}
          <motion.div
            className="absolute bottom-4 left-4 right-4 flex gap-2 z-20"
            variants={buttonSlideUp}
          >
            <Button
              size="sm"
              className="flex-1 gap-2 bg-primary/90 backdrop-blur-sm text-primary-foreground hover:bg-primary shadow-lg"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Add to Cart
            </Button>
          </motion.div>

          {/* Featured badge */}
          {product.featured && (
            <motion.div
              className="absolute top-3 left-3 z-20"
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
            >
              <span className="inline-flex items-center gap-1 rounded-full bg-accent text-accent-foreground px-3 py-1 text-xs font-semibold shadow-lg">
                <Sparkles className="h-3 w-3" />
                Featured
              </span>
            </motion.div>
          )}

          {/* Stock indicator */}
          {product.stock < 20 && (
            <div className="absolute top-3 right-3 z-20">
              <span className="rounded-full bg-destructive/90 backdrop-blur-sm text-destructive-foreground px-2.5 py-1 text-xs font-medium">
                Low stock
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="relative p-5 z-20">
          <motion.p
            className="text-xs font-semibold text-primary uppercase tracking-widest"
            variants={{ rest: { x: 0 }, hover: { x: 4, transition: { duration: 0.3 } } }}
          >
            {product.category}
          </motion.p>
          <h3 className="mt-1.5 font-display font-bold text-lg text-foreground leading-tight">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
          <div className="mt-4 flex items-center justify-between">
            <motion.span
              className="text-2xl font-bold text-foreground"
              variants={priceVariants}
            >
              ${product.price}
            </motion.span>
          </div>
        </div>
      </motion.div>
    );
  }

  // Compact variant
  return (
    <motion.div
      variants={cardVariants}
      custom={index}
      initial="rest"
      whileHover="hover"
      animate="visible"
      className="group relative rounded-xl overflow-hidden bg-card border border-border cursor-pointer"
      style={{ boxShadow: "var(--card-shadow)" }}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <motion.img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
          variants={{
            rest: { scale: 1 },
            hover: { scale: 1.06, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
          }}
        />

        {/* Quick add overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-foreground/10 to-transparent flex items-end justify-center p-3"
          variants={imageOverlayVariants}
        >
          <motion.div variants={buttonSlideUp} className="w-full">
            <Button
              size="sm"
              className="w-full gap-2 bg-card/90 backdrop-blur-sm text-foreground hover:bg-card shadow-lg border border-border"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Quick Add
            </Button>
          </motion.div>
        </motion.div>

        {/* Stock badge */}
        {product.stock < 20 && (
          <div className="absolute top-2 right-2 z-10">
            <span className="rounded-full bg-destructive/90 text-destructive-foreground px-2 py-0.5 text-[10px] font-semibold">
              Low stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-[10px] text-primary font-bold uppercase tracking-widest">{product.category}</p>
        <h3 className="mt-1 font-display font-semibold text-foreground text-sm leading-tight line-clamp-1">{product.name}</h3>
        <div className="mt-2 flex items-center justify-between">
          <motion.span className="font-bold text-lg text-foreground" variants={priceVariants}>
            ${product.price}
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}

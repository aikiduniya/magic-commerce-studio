import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useStore } from "@/contexts/StoreContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Home, ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function Categories() {
  const { categories, products, settings } = useStore();
  const { totalItems, setIsCartOpen } = useCart();

  // Calculate actual product counts
  const categoriesWithCounts = categories.map((cat) => ({
    ...cat,
    actualCount: products.filter((p) => p.category === cat.name).length,
  }));

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">
            Shop by Category
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our curated collections and find exactly what you're looking for
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {categoriesWithCounts.map((category, index) => (
            <motion.div
              key={category.id}
              variants={fadeUp}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                to={`/categories/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="group block relative rounded-2xl overflow-hidden bg-card border border-border"
                style={{ boxShadow: "var(--card-shadow)" }}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <motion.img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-display text-2xl font-bold text-background">
                    {category.name}
                  </h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-background/80">
                      {category.actualCount} {category.actualCount === 1 ? "product" : "products"}
                    </span>
                    <motion.span
                      className="flex items-center gap-1 text-background font-medium"
                      initial={{ x: 0 }}
                      whileHover={{ x: 4 }}
                    >
                      Shop now
                      <ArrowRight className="h-4 w-4" />
                    </motion.span>
                  </div>
                </div>

                {/* Hover overlay */}
                <motion.div
                  className="absolute inset-0 bg-primary/10 pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* All Products CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-16 text-center"
        >
          <Link to="/products">
            <Button size="lg" variant="outline" className="gap-2">
              View All Products
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

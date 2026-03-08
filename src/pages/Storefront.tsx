import { motion } from "framer-motion";
import { useStore } from "@/contexts/StoreContext";
import { ShoppingBag, ArrowRight, Star, Truck, Shield, Headphones } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function Storefront() {
  const { settings, products, categories } = useStore();
  const featured = products.filter(p => p.featured);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 glass px-6 py-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {settings.logo ? (
              <img src={settings.logo} alt="Logo" className="h-9 w-9 rounded-lg object-cover" />
            ) : (
              <div className="h-9 w-9 rounded-lg hero-gradient flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-primary-foreground" />
              </div>
            )}
            <span className="font-display text-xl font-bold text-foreground">{settings.name}</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#products" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Products</a>
            <a href="#categories" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Categories</a>
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</a>
          </div>
          <Link to="/admin">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Admin Panel
            </Button>
          </Link>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-10" />
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative max-w-7xl mx-auto px-6 py-24 md:py-36"
        >
          <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Star className="h-3.5 w-3.5" /> New Collection Available
          </motion.div>
          <motion.h1 variants={fadeUp} custom={1} className="font-display text-5xl md:text-7xl font-bold leading-tight max-w-3xl">
            Discover <span className="gradient-text">Premium</span> Products
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="mt-6 text-lg text-muted-foreground max-w-xl">
            Curated collections of the finest products, designed for those who appreciate quality and elegance.
          </motion.p>
          <motion.div variants={fadeUp} custom={3} className="mt-8 flex gap-4">
            <a href="#products">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                Shop Now <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="border-y border-border bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: Truck, title: "Free Shipping", desc: "On orders over $100" },
              { icon: Shield, title: "Secure Checkout", desc: "256-bit SSL encryption" },
              { icon: Headphones, title: "24/7 Support", desc: "Always here to help" },
            ].map((f, i) => (
              <motion.div key={f.title} variants={fadeUp} custom={i} className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="max-w-7xl mx-auto px-6 py-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.h2 variants={fadeUp} custom={0} className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Featured Products
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} className="mt-2 text-muted-foreground">
            Handpicked selections just for you
          </motion.p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((product, i) => (
              <motion.div
                key={product.id}
                variants={fadeUp}
                custom={i + 2}
                whileHover={{ y: -6 }}
                className="group rounded-xl overflow-hidden bg-card shadow-card hover:shadow-card-hover transition-shadow border border-border"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs font-medium text-primary uppercase tracking-wider">{product.category}</p>
                  <h3 className="mt-1 font-display font-semibold text-lg text-foreground">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-bold text-foreground">${product.price}</span>
                    <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* All Products */}
      <section className="bg-secondary/30 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} custom={0} className="font-display text-3xl font-bold text-foreground">All Products</motion.h2>
            <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  variants={fadeUp}
                  custom={i}
                  whileHover={{ y: -4 }}
                  className="group rounded-xl overflow-hidden bg-card shadow-card hover:shadow-card-hover transition-shadow border border-border"
                >
                  <div className="aspect-square overflow-hidden">
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-primary font-medium uppercase tracking-wider">{product.category}</p>
                    <h3 className="mt-1 font-display font-medium text-foreground text-sm">{product.name}</h3>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-bold text-foreground">${product.price}</span>
                      {product.stock < 20 && (
                        <span className="text-xs text-destructive font-medium">Low stock</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="max-w-7xl mx-auto px-6 py-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.h2 variants={fadeUp} custom={0} className="font-display text-3xl font-bold text-foreground">Shop by Category</motion.h2>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-5">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                variants={fadeUp}
                custom={i + 1}
                whileHover={{ scale: 1.03 }}
                className="relative rounded-xl overflow-hidden aspect-[4/5] group cursor-pointer"
              >
                <img src={cat.image} alt={cat.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="font-display font-bold text-primary-foreground text-lg">{cat.name}</h3>
                  <p className="text-sm text-primary-foreground/70">{cat.productCount} products</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {settings.logo ? (
                <img src={settings.logo} alt="Logo" className="h-8 w-8 rounded-lg object-cover" />
              ) : (
                <div className="h-8 w-8 rounded-lg hero-gradient flex items-center justify-center">
                  <ShoppingBag className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
              <span className="font-display font-bold text-foreground">{settings.name}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {settings.email} • {settings.phone}
            </div>
            <p className="text-sm text-muted-foreground">© 2026 {settings.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, Product, Category } from "@/contexts/StoreContext";
import { Link } from "react-router-dom";
import {
  LayoutDashboard, Package, FolderOpen, ShoppingCart, Users, Settings,
  Plus, Trash2, Edit, ArrowLeft, Upload, TrendingUp, DollarSign,
  Eye, Box, ChevronDown, X, Save, Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Tab = "dashboard" | "products" | "categories" | "orders" | "visitors" | "settings";

const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "categories", label: "Categories", icon: FolderOpen },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "visitors", label: "Visitors", icon: Users },
  { id: "settings", label: "Settings", icon: Settings },
];

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex" style={{ background: "hsl(var(--admin-bg))" }}>
      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 72 }}
        className="h-screen sticky top-0 flex flex-col border-r"
        style={{ borderColor: "hsl(var(--admin-border))", background: "hsl(var(--admin-bg))" }}
      >
        <div className="p-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg hero-gradient flex items-center justify-center shrink-0">
            <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
          </div>
          {sidebarOpen && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-display font-bold text-admin-text truncate">
              Admin
            </motion.span>
          )}
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-primary/15 text-primary"
                  : "text-admin-text-muted hover:text-admin-text hover:bg-admin-surface-hover"
              }`}
            >
              <tab.icon className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span>{tab.label}</span>}
            </button>
          ))}
        </nav>
        <div className="p-4">
          <Link to="/">
            <Button variant="outline" size="sm" className="w-full border-admin-border text-admin-text-muted hover:text-admin-text hover:bg-admin-surface-hover gap-2">
              <ArrowLeft className="h-4 w-4" />
              {sidebarOpen && "View Store"}
            </Button>
          </Link>
        </div>
      </motion.aside>

      {/* Main */}
      <div className="flex-1 overflow-auto">
        <header className="sticky top-0 z-40 px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "hsl(var(--admin-border))", background: "hsl(var(--admin-bg) / 0.8)", backdropFilter: "blur(12px)" }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-admin-text-muted hover:text-admin-text">
              <ChevronDown className={`h-5 w-5 transition-transform ${sidebarOpen ? "rotate-90" : "-rotate-90"}`} />
            </button>
            <h1 className="font-display text-xl font-bold text-admin-text capitalize">{activeTab}</h1>
          </div>
        </header>
        <main className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && <DashboardPanel key="dashboard" />}
            {activeTab === "products" && <ProductsPanel key="products" />}
            {activeTab === "categories" && <CategoriesPanel key="categories" />}
            {activeTab === "orders" && <OrdersPanel key="orders" />}
            {activeTab === "visitors" && <VisitorsPanel key="visitors" />}
            {activeTab === "settings" && <SettingsPanel key="settings" />}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function DashboardPanel() {
  const { products, orders, visitors } = useStore();
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const stats = [
    { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-badge-success" },
    { label: "Products", value: products.length, icon: Package, color: "text-badge-info" },
    { label: "Orders", value: orders.length, icon: ShoppingCart, color: "text-badge-warning" },
    { label: "Visitors", value: visitors.length, icon: Eye, color: "text-primary" },
  ];

  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible" exit="exit" className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="admin-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-admin-text-muted">{s.label}</p>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <p className="mt-2 text-2xl font-display font-bold text-admin-text">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="admin-card p-5">
          <h3 className="font-display font-semibold text-admin-text mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {orders.slice(0, 4).map(o => (
              <div key={o.id} className="flex items-center justify-between py-2 border-b" style={{ borderColor: "hsl(var(--admin-border))" }}>
                <div>
                  <p className="text-sm font-medium text-admin-text">{o.customer}</p>
                  <p className="text-xs text-admin-text-muted">{o.id} • {o.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-admin-text">${o.total}</p>
                  <StatusBadge status={o.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card p-5">
          <h3 className="font-display font-semibold text-admin-text mb-4">Low Stock Alert</h3>
          <div className="space-y-3">
            {products.filter(p => p.stock < 25).map(p => (
              <div key={p.id} className="flex items-center gap-3 py-2 border-b" style={{ borderColor: "hsl(var(--admin-border))" }}>
                <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-admin-text">{p.name}</p>
                  <p className="text-xs text-admin-text-muted">{p.category}</p>
                </div>
                <span className="text-sm font-bold text-destructive">{p.stock} left</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProductsPanel() {
  const { products, addProduct, updateProduct, deleteProduct, categories } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", price: "", image: "", category: "", stock: "", description: "" });

  const resetForm = () => { setForm({ name: "", price: "", image: "", category: "", stock: "", description: "" }); setEditId(null); setShowForm(false); };

  const handleSubmit = () => {
    if (!form.name || !form.price) return;
    if (editId) {
      updateProduct(editId, { ...form, price: Number(form.price), stock: Number(form.stock) });
    } else {
      addProduct({ id: Date.now().toString(), ...form, price: Number(form.price), stock: Number(form.stock) });
    }
    resetForm();
  };

  const startEdit = (p: Product) => {
    setForm({ name: p.name, price: String(p.price), image: p.image, category: p.category, stock: String(p.stock), description: p.description });
    setEditId(p.id);
    setShowForm(true);
  };

  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible" exit="exit" className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-admin-text-muted text-sm">{products.length} products</p>
        <Button onClick={() => { resetForm(); setShowForm(true); }} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="admin-card p-5 space-y-4 overflow-hidden">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-semibold text-admin-text">{editId ? "Edit" : "Add"} Product</h3>
              <button onClick={resetForm}><X className="h-5 w-5 text-admin-text-muted" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Product name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-admin-surface border-admin-border text-admin-text" />
              <Input placeholder="Price" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="bg-admin-surface border-admin-border text-admin-text" />
              <Input placeholder="Image URL" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="bg-admin-surface border-admin-border text-admin-text" />
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="rounded-lg px-3 py-2 text-sm bg-admin-surface border border-admin-border text-admin-text">
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
              <Input placeholder="Stock" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="bg-admin-surface border-admin-border text-admin-text" />
              <Textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="bg-admin-surface border-admin-border text-admin-text" />
            </div>
            <Button onClick={handleSubmit} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
              <Save className="h-4 w-4" /> {editId ? "Update" : "Add"} Product
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-3">
        {products.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="admin-card-hover p-4 flex items-center gap-4">
            <img src={p.image} alt={p.name} className="h-14 w-14 rounded-lg object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-admin-text truncate">{p.name}</h4>
              <p className="text-xs text-admin-text-muted">{p.category} • Stock: {p.stock}</p>
            </div>
            <span className="font-display font-bold text-admin-text">${p.price}</span>
            <div className="flex gap-2">
              <button onClick={() => startEdit(p)} className="p-2 rounded-lg hover:bg-admin-surface-hover text-admin-text-muted hover:text-badge-info transition-colors">
                <Edit className="h-4 w-4" />
              </button>
              <button onClick={() => deleteProduct(p.id)} className="p-2 rounded-lg hover:bg-admin-surface-hover text-admin-text-muted hover:text-destructive transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function CategoriesPanel() {
  const { categories, addCategory, updateCategory, deleteCategory } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", image: "" });

  const resetForm = () => { setForm({ name: "", image: "" }); setEditId(null); setShowForm(false); };
  const handleSubmit = () => {
    if (!form.name) return;
    if (editId) updateCategory(editId, form);
    else addCategory({ id: Date.now().toString(), ...form, productCount: 0 });
    resetForm();
  };

  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible" exit="exit" className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-admin-text-muted text-sm">{categories.length} categories</p>
        <Button onClick={() => { resetForm(); setShowForm(true); }} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="admin-card p-5 space-y-4 overflow-hidden">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-semibold text-admin-text">{editId ? "Edit" : "Add"} Category</h3>
              <button onClick={resetForm}><X className="h-5 w-5 text-admin-text-muted" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Category name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-admin-surface border-admin-border text-admin-text" />
              <Input placeholder="Image URL" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="bg-admin-surface border-admin-border text-admin-text" />
            </div>
            <Button onClick={handleSubmit} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
              <Save className="h-4 w-4" /> {editId ? "Update" : "Add"}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }} className="admin-card-hover overflow-hidden group">
            <div className="aspect-video overflow-hidden">
              <img src={c.image} alt={c.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <h4 className="font-display font-semibold text-admin-text">{c.name}</h4>
                <p className="text-xs text-admin-text-muted">{c.productCount} products</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setForm({ name: c.name, image: c.image }); setEditId(c.id); setShowForm(true); }} className="p-2 rounded-lg hover:bg-admin-surface-hover text-admin-text-muted hover:text-badge-info transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
                <button onClick={() => deleteCategory(c.id)} className="p-2 rounded-lg hover:bg-admin-surface-hover text-admin-text-muted hover:text-destructive transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function OrdersPanel() {
  const { orders, updateOrderStatus } = useStore();
  const statuses: Array<"pending" | "processing" | "shipped" | "delivered" | "cancelled"> = ["pending", "processing", "shipped", "delivered", "cancelled"];

  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible" exit="exit" className="space-y-4">
      <p className="text-admin-text-muted text-sm">{orders.length} orders</p>
      <div className="space-y-3">
        {orders.map((o, i) => (
          <motion.div key={o.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="admin-card p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-display font-semibold text-admin-text">{o.id}</h4>
                  <StatusBadge status={o.status} />
                </div>
                <p className="text-sm text-admin-text-muted mt-1">{o.customer} • {o.email}</p>
                <p className="text-xs text-admin-text-muted">{o.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-display font-bold text-lg text-admin-text">${o.total}</span>
                <select
                  value={o.status}
                  onChange={e => updateOrderStatus(o.id, e.target.value as any)}
                  className="rounded-lg px-3 py-1.5 text-xs bg-admin-surface border border-admin-border text-admin-text"
                >
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-3 border-t pt-3" style={{ borderColor: "hsl(var(--admin-border))" }}>
              {o.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm py-1">
                  <span className="text-admin-text-muted">{item.name} × {item.qty}</span>
                  <span className="text-admin-text">${item.price}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function VisitorsPanel() {
  const { visitors } = useStore();
  const byDevice: Record<string, number> = {};
  const byCountry: Record<string, number> = {};
  const byPage: Record<string, number> = {};
  visitors.forEach(v => {
    byDevice[v.device] = (byDevice[v.device] || 0) + 1;
    byCountry[v.country] = (byCountry[v.country] || 0) + 1;
    byPage[v.page] = (byPage[v.page] || 0) + 1;
  });

  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible" exit="exit" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="admin-card p-5">
          <h3 className="font-display font-semibold text-admin-text mb-3">By Device</h3>
          {Object.entries(byDevice).map(([d, c]) => (
            <div key={d} className="flex justify-between py-2 border-b" style={{ borderColor: "hsl(var(--admin-border))" }}>
              <span className="text-sm text-admin-text-muted">{d}</span>
              <span className="text-sm font-medium text-admin-text">{c}</span>
            </div>
          ))}
        </div>
        <div className="admin-card p-5">
          <h3 className="font-display font-semibold text-admin-text mb-3">By Country</h3>
          {Object.entries(byCountry).map(([c, n]) => (
            <div key={c} className="flex justify-between py-2 border-b" style={{ borderColor: "hsl(var(--admin-border))" }}>
              <span className="text-sm text-admin-text-muted">{c}</span>
              <span className="text-sm font-medium text-admin-text">{n}</span>
            </div>
          ))}
        </div>
        <div className="admin-card p-5">
          <h3 className="font-display font-semibold text-admin-text mb-3">Top Pages</h3>
          {Object.entries(byPage).map(([p, c]) => (
            <div key={p} className="flex justify-between py-2 border-b" style={{ borderColor: "hsl(var(--admin-border))" }}>
              <span className="text-sm text-admin-text-muted font-mono">{p}</span>
              <span className="text-sm font-medium text-admin-text">{c}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card p-5">
        <h3 className="font-display font-semibold text-admin-text mb-3">All Visitors</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: "hsl(var(--admin-border))" }}>
                <th className="text-left py-2 text-admin-text-muted font-medium">Page</th>
                <th className="text-left py-2 text-admin-text-muted font-medium">Date</th>
                <th className="text-left py-2 text-admin-text-muted font-medium">Device</th>
                <th className="text-left py-2 text-admin-text-muted font-medium">Country</th>
              </tr>
            </thead>
            <tbody>
              {visitors.map(v => (
                <tr key={v.id} className="border-b" style={{ borderColor: "hsl(var(--admin-border))" }}>
                  <td className="py-2 text-admin-text font-mono">{v.page}</td>
                  <td className="py-2 text-admin-text-muted">{v.date}</td>
                  <td className="py-2 text-admin-text-muted">{v.device}</td>
                  <td className="py-2 text-admin-text-muted">{v.country}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

function SettingsPanel() {
  const { settings, updateSettings } = useStore();
  const [form, setForm] = useState({ name: settings.name, email: settings.email, phone: settings.phone });
  const fileRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      updateSettings({ logo: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    updateSettings(form);
  };

  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible" exit="exit" className="max-w-2xl space-y-6">
      <div className="admin-card p-6 space-y-6">
        <h3 className="font-display font-semibold text-admin-text text-lg">Store Settings</h3>

        {/* Logo */}
        <div>
          <label className="text-sm font-medium text-admin-text-muted block mb-2">Store Logo</label>
          <p className="text-xs text-admin-text-muted mb-3">Upload your logo to automatically generate a matching theme for your entire store</p>
          <div className="flex items-center gap-4">
            {settings.logo ? (
              <div className="relative group">
                <img src={settings.logo} alt="Logo" className="h-20 w-20 rounded-xl object-cover border-2 border-admin-border" />
                <div className="absolute inset-0 rounded-xl bg-admin-bg/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={() => fileRef.current?.click()}>
                  <Edit className="h-5 w-5 text-admin-text" />
                </div>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="h-20 w-20 rounded-xl border-2 border-dashed border-admin-border flex flex-col items-center justify-center gap-1 hover:border-primary/50 transition-colors"
              >
                <Upload className="h-6 w-6 text-admin-text-muted" />
                <span className="text-xs text-admin-text-muted">Upload</span>
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
            <div className="flex-1">
              <p className="text-sm text-admin-text">
                {settings.logo ? "✨ Theme auto-generated from logo colors" : "No logo uploaded yet"}
              </p>
              {settings.themeColors && (
                <div className="flex gap-2 mt-2">
                  <div className="h-6 w-6 rounded-full border border-admin-border" style={{ background: `hsl(${settings.themeColors.primary})` }} title="Primary" />
                  <div className="h-6 w-6 rounded-full border border-admin-border" style={{ background: `hsl(${settings.themeColors.secondary})` }} title="Secondary" />
                  <div className="h-6 w-6 rounded-full border border-admin-border" style={{ background: `hsl(${settings.themeColors.accent})` }} title="Accent" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="text-sm font-medium text-admin-text-muted block mb-1">Store Name</label>
            <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-admin-surface border-admin-border text-admin-text" />
          </div>
          <div>
            <label className="text-sm font-medium text-admin-text-muted block mb-1">Email</label>
            <Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="bg-admin-surface border-admin-border text-admin-text" />
          </div>
          <div>
            <label className="text-sm font-medium text-admin-text-muted block mb-1">Phone</label>
            <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="bg-admin-surface border-admin-border text-admin-text" />
          </div>
        </div>

        <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
          <Save className="h-4 w-4" /> Save Settings
        </Button>
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-badge-warning/15 text-badge-warning",
    processing: "bg-badge-info/15 text-badge-info",
    shipped: "bg-primary/15 text-primary",
    delivered: "bg-badge-success/15 text-badge-success",
    cancelled: "bg-destructive/15 text-destructive",
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors[status] || ""}`}>
      {status}
    </span>
  );
}

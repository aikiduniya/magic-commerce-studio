import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useStore } from "@/contexts/StoreContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Check, CreditCard, ShoppingBag, Truck, Tag, X, Percent } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Checkout() {
  const { items, totalPrice, clearCart, appliedCoupon, applyCoupon, removeCoupon, discountAmount, finalPrice } = useCart();
  const { settings, addOrder } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState<"details" | "payment" | "success">("details");
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [placedOrderId, setPlacedOrderId] = useState<string>("");

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const order = addOrder({
      customer: `${formData.firstName} ${formData.lastName}`.trim() || "Guest",
      email: formData.email,
      items: items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        qty: item.quantity,
        price: item.product.price * item.quantity,
      })),
      total: Number(finalPrice.toFixed(2)),
    });
    setPlacedOrderId(order.id);

    setIsProcessing(false);
    setStep("success");
    clearCart();
  };

  const handleApplyCoupon = () => {
    setCouponError("");
    const result = applyCoupon(couponCode);
    if (result.success) {
      toast.success(result.message);
      setCouponCode("");
    } else {
      setCouponError(result.message);
    }
  };

  if (items.length === 0 && step !== "success") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-6">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="font-display text-xl font-semibold">Your cart is empty</h2>
            <p className="text-muted-foreground mt-2">Add some products before checking out</p>
            <Link to="/">
              <Button className="mt-6">Browse Products</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <Card className="max-w-md w-full text-center">
            <CardContent className="pt-6">
              <motion.div
                className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              >
                <Check className="h-8 w-8 text-primary" />
              </motion.div>
              <h2 className="font-display text-2xl font-bold text-foreground">Order Confirmed!</h2>
              <p className="text-muted-foreground mt-2">
                Thank you for your purchase. We'll send you an email confirmation shortly.
              </p>
              <div className="mt-6 p-4 rounded-lg bg-secondary/50">
                <p className="text-sm text-muted-foreground">Order number</p>
                <p className="font-mono font-semibold text-foreground">
                  {placedOrderId || "ORD-PENDING"}
                </p>
              </div>
              <Link to="/">
                <Button className="mt-6 w-full">Continue Shopping</Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to store</span>
          </Link>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            {settings.logo ? (
              <img src={settings.logo} alt="Logo" className="h-8 w-8 rounded-lg object-cover" />
            ) : (
              <div className="h-8 w-8 rounded-lg hero-gradient flex items-center justify-center">
                <ShoppingBag className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
            <span className="font-display font-bold">{settings.name}</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {[
            { key: "details", label: "Details", icon: Truck },
            { key: "payment", label: "Payment", icon: CreditCard },
          ].map((s, i) => (
            <div key={s.key} className="flex items-center gap-4">
              {i > 0 && <div className="w-16 h-px bg-border" />}
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  step === s.key
                    ? "bg-primary text-primary-foreground shadow-md"
                    : s.key === "details" && step === "payment"
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <s.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{s.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr,400px] gap-10">
          {/* Form */}
          <motion.div key={step} initial="hidden" animate="visible" variants={fadeUp}>
            {step === "details" && (
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleDetailsSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" required value={formData.email} onChange={handleInputChange} placeholder="your@email.com" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" name="firstName" required value={formData.firstName} onChange={handleInputChange} />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" name="lastName" required value={formData.lastName} onChange={handleInputChange} />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" name="address" required value={formData.address} onChange={handleInputChange} placeholder="123 Main Street" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" name="city" required value={formData.city} onChange={handleInputChange} />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input id="zipCode" name="zipCode" required value={formData.zipCode} onChange={handleInputChange} />
                      </div>
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" name="country" required value={formData.country} onChange={handleInputChange} />
                      </div>
                    </div>
                    <Button type="submit" className="w-full" size="lg">
                      Continue to Payment
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {step === "payment" && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" name="cardNumber" required value={formData.cardNumber} onChange={handleInputChange} placeholder="4242 4242 4242 4242" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" name="expiry" required value={formData.expiry} onChange={handleInputChange} placeholder="MM/YY" />
                      </div>
                      <div>
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" name="cvc" required value={formData.cvc} onChange={handleInputChange} placeholder="123" />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Button type="button" variant="outline" onClick={() => setStep("details")}>
                        Back
                      </Button>
                      <Button type="submit" className="flex-1" size="lg" disabled={isProcessing}>
                        {isProcessing ? "Processing..." : `Pay $${finalPrice.toFixed(2)}`}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Order Summary */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <img src={item.product.image} alt={item.product.name} className="h-16 w-16 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-primary font-medium">Free</span>
                  </div>

                  {/* Coupon discount */}
                  <AnimatePresence>
                    {appliedCoupon && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-primary flex items-center gap-1">
                          <Percent className="h-3 w-3" />
                          {appliedCoupon.label}
                        </span>
                        <span className="text-primary font-medium">-${discountAmount.toFixed(2)}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex justify-between text-lg font-semibold pt-2 border-t border-border">
                    <span>Total</span>
                    <div className="text-right">
                      {appliedCoupon && (
                        <span className="text-sm line-through text-muted-foreground mr-2">${totalPrice.toFixed(2)}</span>
                      )}
                      <span>${finalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Coupon Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">Discount Code</span>
                </div>

                {appliedCoupon ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-between rounded-lg bg-primary/5 border border-primary/20 px-4 py-3"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Percent className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-mono text-sm font-bold text-primary">{appliedCoupon.code}</p>
                        <p className="text-xs text-muted-foreground">{appliedCoupon.label}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={removeCoupon}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value);
                          setCouponError("");
                        }}
                        onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                        className="font-mono uppercase"
                      />
                      <Button
                        variant="outline"
                        onClick={handleApplyCoupon}
                        disabled={!couponCode.trim()}
                      >
                        Apply
                      </Button>
                    </div>
                    <AnimatePresence>
                      {couponError && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-xs text-destructive"
                        >
                          {couponError}
                        </motion.p>
                      )}
                    </AnimatePresence>
                    <p className="text-[10px] text-muted-foreground">Try: SAVE10, SAVE20, WELCOME, LUXE50</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

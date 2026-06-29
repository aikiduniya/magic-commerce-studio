import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useStore } from "@/contexts/StoreContext";

export default function WhatsAppWidget() {
  const { settings } = useStore();
  const number = (settings.whatsappNumber || "").replace(/[^\d]/g, "");
  if (!number) return null;

  const message = encodeURIComponent(settings.whatsappMessage || "Hi! I'd like to know more about your products.");
  const href = `https://wa.me/${number}?text=${message}`;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-[60] h-14 w-14 rounded-full flex items-center justify-center shadow-2xl text-white"
      style={{ background: "#25D366", boxShadow: "0 10px 30px -5px rgba(37, 211, 102, 0.6)" }}
    >
      <span className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ background: "#25D366" }} />
      <MessageCircle className="h-7 w-7 relative z-10" fill="currentColor" />
    </motion.a>
  );
}

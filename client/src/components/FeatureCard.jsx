import { motion } from "framer-motion";

export default function FeatureCard({ title, desc }) {
  return (
    <motion.div
      className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 cursor-pointer"
      whileHover={{
        scale: 1.02,
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <h3 className="font-bold text-gray-800 text-lg mb-3">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
    </motion.div>
  );
}

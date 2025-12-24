import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GradientButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children: ReactNode;
  variant?: "primary" | "secondary" | "user" | "partner";
  className?: string;
  type?: "button" | "submit" | "reset";
}

const variantStyles = {
  primary: "bg-gradient-to-r from-[#00f5ff] to-[#8338ec]",
  secondary: "bg-gradient-to-r from-[#00f5ff]/30 to-[#8338ec]/30 border-white/20",
  user: "bg-gradient-to-r from-[#00f5ff] to-[#8338ec]",
  partner: "bg-gradient-to-r from-[#ff006e] to-[#8338ec]",
};

export function GradientButton({
  onClick,
  disabled = false,
  children,
  variant = "primary",
  className = "",
  type = "button",
}: GradientButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-[30px] border-4 border-white px-6 py-4 text-lg font-black text-white transition-all disabled:cursor-not-allowed disabled:opacity-60 ${variantStyles[variant]} ${className}`}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
}








import { motion } from "framer-motion";

export default function AuthCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.95,
        y: 20,
        filter: "blur(6px)",
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      exit={{
        opacity: 0,
        scale: 0.97,
        y: -20,
        filter: "blur(6px)",
      }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1], // smooth premium curve
      }}
      className="
        w-full max-w-md
        bg-white/[0.04]
        backdrop-blur-2xl
        border border-white/10
        rounded-3xl
        p-8
        shadow-[0_0_60px_rgba(168,85,247,0.35)]
      "
    >
      {children}
    </motion.div>
  );
}

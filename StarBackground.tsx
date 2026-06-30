import { motion } from "motion/react";
import { useEffect, useState } from "react";

const STARS = [
  { left: "5%", top: "8%", size: 24, delay: 0, duration: 2.5 },
  { left: "70%", top: "15%", size: 16, delay: 0.5, duration: 3 },
  { left: "12%", top: "80%", size: 12, delay: 1, duration: 2 },
  { left: "80%", top: "50%", size: 20, delay: 0.3, duration: 2.8 },
  { left: "30%", top: "25%", size: 14, delay: 1.5, duration: 3.5 },
  { left: "90%", top: "85%", size: 18, delay: 0.8, duration: 2.2 },
  { left: "50%", top: "10%", size: 15, delay: 1.2, duration: 3.1 },
  { left: "15%", top: "50%", size: 22, delay: 0.7, duration: 2.6 },
];

export function StarBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Blurred Clouds / Sky Effect */}
      <motion.div 
        className="absolute top-[5%] left-[-20%] w-[50vw] h-[30vh] bg-white/60 rounded-full blur-[80px]"
        animate={{ x: ['0vw', '130vw'] }}
        transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="absolute top-[35%] left-[-30%] w-[60vw] h-[40vh] bg-pink-100/50 rounded-full blur-[100px]"
        animate={{ x: ['0vw', '140vw'] }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear", delay: 15 }}
      />
      <motion.div 
        className="absolute top-[65%] left-[-20%] w-[45vw] h-[35vh] bg-blue-100/60 rounded-full blur-[90px]"
        animate={{ x: ['0vw', '120vw'] }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear", delay: 30 }}
      />

      {STARS.map((style, i) => (
        <motion.div
          key={i}
          className="absolute text-yellow-300 drop-shadow-md select-none"
          style={{
            left: style.left,
            top: style.top,
            fontSize: style.size,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: style.duration,
            repeat: Infinity,
            delay: style.delay,
            ease: "easeInOut",
          }}
        >
          ⭐
        </motion.div>
      ))}
    </div>
  );
}

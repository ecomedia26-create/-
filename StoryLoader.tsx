import { motion } from "motion/react";
import { Sparkles, Wand2 } from "lucide-react";

const LOADING_MESSAGES = [
  "מפזר אבקת פיות...",
  "מעיר את הדרקונים משנתם...",
  "מערבב קסמים וחלומות...",
  "מזמין את חיות היער...",
  "כותב באותיות של כוכבים...",
];

export function StoryLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-8">
      <motion.div
        animate={{ 
          rotate: [0, 10, -10, 10, 0],
          scale: [1, 1.1, 1.1, 1]
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <div className="absolute inset-0 bg-purple-400 blur-2xl opacity-50 rounded-full scale-150 animate-pulse" />
        <div className="relative bg-gradient-to-tr from-purple-600 to-pink-500 w-24 h-24 rounded-full flex items-center justify-center shadow-2xl">
          <Wand2 className="w-12 h-12 text-white animate-bounce" />
        </div>
        
        {/* Orbiting sparkles */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-20px]"
        >
          <Sparkles className="w-6 h-6 text-yellow-400 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </motion.div>
      </motion.div>

      <div className="h-8 overflow-hidden relative w-64 text-center">
        {LOADING_MESSAGES.map((msg, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 text-xl font-bold text-purple-700 w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              y: [20, 0, 0, -20]
            }}
            transition={{ 
              duration: 3,
              times: [0, 0.1, 0.9, 1],
              delay: i * 3,
              repeat: Infinity,
              repeatDelay: (LOADING_MESSAGES.length - 1) * 3
            }}
          >
            {msg}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

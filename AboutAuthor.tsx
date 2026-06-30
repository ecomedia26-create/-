import { motion } from "motion/react";
import { Sparkles, PenTool, Heart } from "lucide-react";

export function AboutAuthor() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-sm border border-purple-100 flex flex-col p-8 mt-16 max-w-3xl mx-auto text-center"
    >
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
          <PenTool className="w-8 h-8 text-white" />
        </div>
      </div>
      <h2 className="text-2xl font-black text-purple-900 mb-4 flex items-center justify-center gap-2">
        <Sparkles className="w-5 h-5 text-yellow-500" />
        על הסופרת
        <Sparkles className="w-5 h-5 text-yellow-500" />
      </h2>
      <p className="text-lg text-purple-800 leading-relaxed font-medium">
        מירב הודיה, אמא לאושרי ונשואה ליצחק. 
        <br />
        שומרת תורה, מאירה ולעולם מטובה.
        <br />
        סייעת בגן "ברכת רחל" בעפולה.
        <br />
        <span className="block mt-4 text-pink-600 font-bold">
          "מקווה כי סיפורים ייכתבו, יישמעו ויסללו לנו את הדרך לאחדות ואהבה."
        </span>
      </p>

      <div className="mt-10 pt-8 border-t border-purple-100 flex flex-col items-center">
        <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center justify-center gap-2">
          <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
          לתמיכה בפרויקט באהבה
          <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
        </h3>
        <div className="flex items-center gap-4 bg-white border-2 border-[#16b6e4] px-6 py-3 rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
          <div className="flex items-center justify-center bg-[#002f6c] px-3 py-1.5 rounded-xl">
            <span className="text-white font-black text-2xl tracking-tighter leading-none" style={{ fontFamily: 'Arial, sans-serif' }}>bit</span>
          </div>
          <a href="tel:0534262621" className="text-2xl font-black text-[#002f6c] tracking-wider hover:text-[#16b6e4] transition-colors" dir="ltr">
            053-426-2621
          </a>
        </div>
      </div>
    </motion.div>
  );
}

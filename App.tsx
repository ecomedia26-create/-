import { useState } from "react";
import { StoryForm, type StoryFormData } from "./components/StoryForm";
import { StoryLoader } from "./components/StoryLoader";
import { StoryView } from "./components/StoryView";
import { StoryLibrary } from "./components/StoryLibrary";
import { AboutAuthor } from "./components/AboutAuthor";
import { DonationComponent } from "./components/DonationComponent";
import { StarBackground } from "./components/StarBackground";
import { FairyCursor } from "./components/FairyCursor";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen } from "lucide-react";

export default function App() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [story, setStory] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const generateStory = async (formData: StoryFormData) => {
    setStatus("loading");
    setErrorMsg(null);
    setImageUrl(null);
    
    try {
      const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("משהו השתבש ביצירת הסיפור...");
      }

      const data = await response.json();
      setStory(data.story);
      setImageUrl(data.imageUrl);
      setStatus("success");
    } catch (err) {
      console.error(err);
      setErrorMsg("אופס! הקסם לא עבד הפעם. נסו שוב מאוחר יותר.");
      setStatus("error");
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setStory(null);
    setImageUrl(null);
    setErrorMsg(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#8ab4f8] via-[#e8eaed] to-[#fce8e6] text-slate-900 font-sans rtl overflow-x-hidden" dir="rtl">
      <StarBackground />
      <FairyCursor />
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 sm:py-20 pb-32">

        <header className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-xl shadow-purple-200/50 mb-6 rotate-3"
          >
            <BookOpen className="w-10 h-10 text-purple-600 -rotate-3" />
          </motion.div>
          
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-l from-purple-700 via-fuchsia-600 to-pink-500 mb-4 drop-shadow-sm">
              סיפורים לילדים ✨
            </h1>
            <p className="text-xl sm:text-2xl text-purple-600/80 font-medium mb-12">
              בינה מלאכותית שכותבת סיפורים קסומים במיוחד עבורך
            </p>
          </motion.div>
          
          {/* Presenter Video */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mb-12"
          >
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-full overflow-hidden border-4 border-white shadow-xl">
              {/* Fallback image if video fails to load, or just the video */}
              <video 
                src="/presenter.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover"
                poster="https://images.unsplash.com/photo-1516627145497-ae6968895b74?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
              />
              <div className="absolute inset-0 rounded-full shadow-inner pointer-events-none"></div>
            </div>
          </motion.div>
        </header>

        <main className="relative">
          <AnimatePresence mode="wait">
            {status === "idle" && (
              <motion.div key="main-content" exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}>
                <div className="mb-16">
                  <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-purple-900 mb-3">📚 ספריית הסיפורים הקסומים</h2>
                    <p className="text-lg text-purple-600">הסיפורים החדשים של מירב הודיה אליהו</p>
                  </div>
                  <StoryLibrary />
                </div>
                
                <DonationComponent />
                
                <AboutAuthor />
              </motion.div>
            )}

            {status === "loading" && (
              <motion.div key="loading" exit={{ opacity: 0, scale: 0.9 }}>
                <StoryLoader />
              </motion.div>
            )}

            {status === "error" && (
              <motion.div 
                key="error" 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 text-red-600 p-8 rounded-3xl border-2 border-red-200 text-center shadow-xl max-w-lg mx-auto"
              >
                <div className="text-6xl mb-4">😿</div>
                <h3 className="text-2xl font-bold mb-2">אוי לא!</h3>
                <p className="text-lg font-medium mb-6">{errorMsg}</p>
                <button
                  onClick={() => setStatus("idle")}
                  className="px-6 py-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-bold transition-colors"
                >
                  לנסות שוב
                </button>
              </motion.div>
            )}

            {status === "success" && story && (
              <motion.div key="story">
                <StoryView story={story} onReset={handleReset} imageUrl={imageUrl} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="mt-20 text-center pb-8 relative z-10">
          <p className="text-purple-600 font-bold flex items-center justify-center gap-2 drop-shadow-sm">
            <span className="w-10 h-[2px] bg-purple-300 rounded-full" />
            נוצר בקסם על ידי{" "}
            <a 
              href="https://www.echomedia.co.il" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-pink-500 hover:text-pink-600 underline transition-all"
            >
              אקו מדיה ישראל
            </a>
            <span className="w-10 h-[2px] bg-purple-300 rounded-full" />
          </p>
        </footer>
      </div>
    </div>
  );
}

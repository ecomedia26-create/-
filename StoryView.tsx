import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import { BookOpen, Sparkles, RotateCcw, Volume2, SquareSquare, Printer, Copy, BookmarkPlus } from "lucide-react";
import { useState, useEffect } from "react";

interface StoryViewProps {
  story: string;
  onReset: () => void;
  imageUrl?: string | null;
}

export function StoryView({ story, onReset, imageUrl }: StoryViewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      const hebrewVoices = availableVoices.filter(v => v.lang.startsWith('he'));
      setVoices(hebrewVoices);
      if (hebrewVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(hebrewVoices[0]);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel();
    };
  }, [selectedVoice]);

  const toggleSpeech = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const plainText = story.replace(/[#_*\[\]]/g, '');
      const utterance = new SpeechSynthesisUtterance(plainText);
      utterance.lang = 'he-IL';
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      utterance.rate = 0.9;
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(story);
    alert("הסיפור הועתק ללוח!");
  };

  const handleSave = () => {
    const saved = JSON.parse(localStorage.getItem("savedStories") || "[]");
    saved.push({ id: Date.now(), content: story, title: "סיפור קסום חדש" });
    localStorage.setItem("savedStories", JSON.stringify(saved));
    setIsSaved(true);
    alert("הסיפור נשמר בהצלחה!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="relative max-w-4xl mx-auto"
    >
      {/* Decorative background elements */}
      <div className="absolute -inset-4 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 rounded-[3rem] blur-xl opacity-50 z-0" />
      
      <div className="relative z-10 bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border-2 border-white/50">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 py-6 px-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay" />
          <h2 className="text-3xl sm:text-4xl font-black text-white drop-shadow-md flex items-center justify-center gap-3 relative z-10">
            <Sparkles className="text-yellow-300 w-8 h-8" />
            הסיפור הקסום שלך
            <Sparkles className="text-yellow-300 w-8 h-8" />
          </h2>
        </div>

        {/* Audio Controls */}
        <div className="flex flex-col items-center justify-center mt-6 gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSpeech}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all shadow-md ${
                isPlaying 
                  ? 'bg-pink-100 text-pink-600 border-2 border-pink-300 hover:bg-pink-200' 
                  : 'bg-purple-100 text-purple-700 border-2 border-purple-300 hover:bg-purple-200'
              }`}
            >
              {isPlaying ? (
                <>
                  <SquareSquare className="w-5 h-5" />
                  <span>עצור הקראה</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-5 h-5" />
                  <span>הקרא סיפור</span>
                </>
              )}
            </button>

            {voices.length > 0 && (
              <div className="relative">
                <select
                  className="appearance-none bg-white border-2 border-purple-200 text-purple-700 font-bold py-3 pl-10 pr-6 rounded-full shadow-md focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 cursor-pointer text-sm"
                  value={selectedVoice?.name || ''}
                  onChange={(e) => {
                    const voice = voices.find(v => v.name === e.target.value);
                    if (voice) setSelectedVoice(voice);
                  }}
                  disabled={isPlaying}
                >
                  {voices.map((voice) => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-4 text-purple-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Story Content */}
        <div className="px-8 pb-8 pt-4 sm:px-12 sm:pb-12 md:px-16 md:pb-16 relative">
          {imageUrl && (
            <div className="mb-10 rounded-[2rem] overflow-hidden border-8 border-white shadow-xl max-w-3xl mx-auto rotate-1 hover:rotate-0 transition-transform duration-500 bg-purple-50">
              <img src={imageUrl} alt="איור הסיפור" className="w-full h-auto object-cover" referrerPolicy="no-referrer" />
            </div>
          )}
          <div className="absolute top-10 right-10 opacity-5 text-purple-900 pointer-events-none">
            <BookOpen className="w-48 h-48" />
          </div>
          
          <div className="prose prose-purple prose-lg sm:prose-xl mx-auto text-purple-950 font-medium leading-relaxed prose-headings:font-black prose-headings:text-purple-800 prose-strong:text-purple-700 prose-strong:font-bold prose-p:mb-6" dir="rtl">
            <ReactMarkdown>{story}</ReactMarkdown>
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-purple-50/50 p-6 sm:p-8 flex flex-col sm:flex-row justify-center items-center gap-4 border-t border-purple-100">
          <button
            onClick={() => {
              window.speechSynthesis.cancel();
              onReset();
            }}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-2xl shadow-sm border-2 border-transparent hover:shadow-md transition-all active:scale-95 group w-full sm:w-auto justify-center"
          >
            <RotateCcw className="w-5 h-5 group-hover:-rotate-180 transition-transform duration-500" />
            <span className="text-lg">צור סיפור חדש</span>
          </button>
          
          <div className="flex gap-2 w-full sm:w-auto justify-center">
            <button
              onClick={handleSave}
              disabled={isSaved}
              className={`flex items-center justify-center p-4 rounded-2xl border-2 transition-all shadow-sm flex-1 sm:flex-none ${isSaved ? 'bg-green-50 text-green-600 border-green-200 cursor-default' : 'bg-white text-purple-600 border-purple-200 hover:bg-purple-50 hover:border-purple-300'}`}
              title="שמור סיפור"
            >
              <BookmarkPlus className="w-6 h-6" />
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center justify-center p-4 bg-white text-purple-600 border-2 border-purple-200 hover:bg-purple-50 hover:border-purple-300 rounded-2xl shadow-sm transition-all flex-1 sm:flex-none"
              title="העתק טקסט"
            >
              <Copy className="w-6 h-6" />
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center justify-center p-4 bg-white text-purple-600 border-2 border-purple-200 hover:bg-purple-50 hover:border-purple-300 rounded-2xl shadow-sm transition-all flex-1 sm:flex-none"
              title="הדפס סיפור"
            >
              <Printer className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

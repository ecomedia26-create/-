import { motion } from "motion/react";
import { Heart, BookOpen, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const STORIES = [
  {
    id: "zigi",
    title: "בקצב של זיגי",
    value: "קבלת השונה",
    summary: "סיפור על דבורה שמזמזמת בקצב שונה, ואיך הייחודיות שלנו עושה את העולם צבעוני יותר.",
    youtubeId: "WjjUud9EF84"
  },
  {
    id: "peleg",
    title: "האבן של פלג",
    value: "סליחה ושחרור כעסים",
    summary: "פלג הבונה לומד שכאשר סולחים, הלב הופך קל ומשוחרר ממשא כבד ומעיק.",
    youtubeId: "4qEZR740UF8"
  },
  {
    id: "maya",
    title: "מאיה והזינוק הגדול",
    value: "אומץ והתגברות",
    summary: "פילה שמפחדת לקפוץ, מוצאת בתוכה את האומץ לעשות זאת כדי להציל גור אריות.",
    youtubeId: "RBVjr9BDoO8"
  },
  {
    id: "nevo",
    title: "האגוז של נבו",
    value: "נתינה טהורה",
    summary: "עכבר שדה מוותר על ארוחת מלכים למען קיפוד זקן, ומגלה את שמחת הנתינה בסתר.",
    youtubeId: "emNciSG4P70"
  },
  {
    id: "ayala",
    title: "איילה בלב העמק",
    value: "סבלנות והמתנה",
    summary: "איילה צעירה לומדת שלכל דבר בטבע יש את הזמן המדויק שלו, וששווה לחכות.",
    youtubeId: "Hcdd3LUyk50"
  },
  {
    id: "rimona",
    title: "רימונה הכבשה",
    value: "הצבת גבולות",
    summary: "כבשה שלומדת שמותר וצריך להקשיב ללב, ולא חייבים להסכים לדברים שפוגעים בה.",
    youtubeId: "Q9X5uRXGuFE"
  },
  {
    id: "trees",
    title: "השלום בין העצים",
    value: "שיתוף ואחדות",
    summary: "העצים ביער מבינים שכולם יכולים לגדול ולפרוח יחד כשהם חולקים את אור השמש.",
    youtubeId: "Y-YCMngueXY"
  }
];

interface SavedStory {
  id: number;
  title: string;
  content: string;
}

export function StoryLibrary() {
  const [savedStories, setSavedStories] = useState<SavedStory[]>([]);
  const [expandedStory, setExpandedStory] = useState<number | null>(null);

  useEffect(() => {
    const loadSaved = () => {
      const saved = JSON.parse(localStorage.getItem("savedStories") || "[]");
      setSavedStories(saved);
    };
    loadSaved();
    // Listen for storage changes from other tabs or same tab
    window.addEventListener("storage", loadSaved);
    return () => window.removeEventListener("storage", loadSaved);
  }, []);

  const deleteStory = (id: number) => {
    const newStories = savedStories.filter(s => s.id !== id);
    setSavedStories(newStories);
    localStorage.setItem("savedStories", JSON.stringify(newStories));
  };

  return (
    <div className="flex flex-col gap-12 pb-12">
      {savedStories.length > 0 && (
        <div>
          <h3 className="text-2xl font-black text-purple-900 mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-pink-500" />
            הסיפורים השמורים שלי
          </h3>
          <div className="flex flex-wrap justify-center gap-6">
            {savedStories.map((story, i) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="w-full md:w-[calc(50%-0.75rem)] bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-sm border border-purple-100 flex flex-col hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex justify-between items-start mb-4 border-b border-purple-100 pb-4">
                  <h4 className="text-xl font-bold text-purple-900">{story.title}</h4>
                  <button 
                    onClick={() => deleteStory(story.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className={`prose prose-purple prose-sm sm:prose-base font-medium text-purple-900 ${expandedStory === story.id ? '' : 'line-clamp-6'} transition-all`} dir="rtl">
                  <ReactMarkdown>{story.content}</ReactMarkdown>
                </div>
                
                <button 
                  onClick={() => setExpandedStory(expandedStory === story.id ? null : story.id)}
                  className="mt-4 text-purple-600 font-bold hover:text-pink-600 transition-colors text-sm border-t border-purple-50 pt-4"
                >
                  {expandedStory === story.id ? "הסתר סיפור" : "קרא סיפור מלא..."}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-2xl font-black text-purple-900 mb-6 flex items-center gap-2">
          <Heart className="w-6 h-6 text-pink-500" />
          סיפורים קלאסיים של מירב הודיה
        </h3>
        <div className="flex flex-wrap justify-center gap-6">
          {STORIES.map((story, i) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="w-full md:w-[calc(50%-0.75rem)] bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-sm border border-purple-100 flex flex-col hover:shadow-lg transition-shadow"
            >
              <div className="aspect-video w-full bg-purple-900 relative">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${story.youtubeId}`}
                  title={story.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-start justify-between mb-3 gap-2">
                  <h3 className="text-xl font-bold text-purple-900 leading-tight">{story.title}</h3>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-sm font-bold shrink-0">
                    <Heart className="w-3.5 h-3.5" />
                    {story.value}
                  </span>
                </div>
                <p className="text-purple-700 font-medium leading-relaxed">{story.summary}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

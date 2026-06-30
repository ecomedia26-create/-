import { useState } from "react";
import { motion } from "motion/react";
import { WandSparkles, Sparkles } from "lucide-react";
import { cn } from "../lib/utils";

export type StoryFormData = {
  storyType: string;
  ageGroup: string;
  heroName: string;
  additionalDetails: string;
  features: {
    useThinking: boolean;
    useSearch: boolean;
    imageSize: string;
  };
};

interface StoryFormProps {
  onSubmit: (data: StoryFormData) => void;
  isLoading: boolean;
}

const STORY_TYPES = [
  { id: "הרפתקה", icon: "🗺️", label: "הרפתקה" },
  { id: "לפני השינה", icon: "🌙", label: "לפני השינה" },
  { id: "קסם ופנטזיה", icon: "✨", label: "קסם ופנטזיה" },
  { id: "מצחיק", icon: "😄", label: "מצחיק" },
  { id: "חיות", icon: "🦁", label: "חיות" },
  { id: "חברות", icon: "💛", label: "חברות" },
];

const AGE_GROUPS = ["גיל 2-4", "גיל 5-7", "גיל 8-10"];

export function StoryForm({ onSubmit, isLoading }: StoryFormProps) {
  const [formData, setFormData] = useState<StoryFormData>({
    storyType: "קסם ופנטזיה",
    ageGroup: "גיל 5-7",
    heroName: "",
    additionalDetails: "",
    features: {
      useThinking: true,
      useSearch: false,
      imageSize: "1K"
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-purple-100/50 p-6 sm:p-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-purple-900 mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-yellow-400" />
          בואו ניצור סיפור מיוחד!
          <Sparkles className="w-6 h-6 text-yellow-400" />
        </h2>
        <p className="text-purple-500 font-medium">בחרו את סוג הסיפור ופרטים נוספים</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Story Type */}
        <div>
          <label className="block text-purple-900 font-bold text-lg mb-4">🎭 סוג הסיפור</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {STORY_TYPES.map((type) => {
              const isSelected = formData.storyType === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, storyType: type.id })}
                  className={cn(
                    "relative flex flex-col items-center p-4 rounded-2xl transition-all duration-300 border-2 outline-none",
                    isSelected
                      ? "bg-gradient-to-br from-purple-500 to-pink-500 border-transparent shadow-lg text-white scale-105"
                      : "bg-white border-purple-100 hover:border-purple-300 hover:bg-purple-50 hover:shadow-md text-purple-700 hover:-translate-y-1"
                  )}
                >
                  <span className="text-3xl sm:text-4xl mb-2 drop-shadow-sm">{type.icon}</span>
                  <span className="text-sm sm:text-base font-bold">{type.label}</span>
                  {isSelected && (
                    <motion.div
                      layoutId="outline"
                      className="absolute inset-0 rounded-2xl border-2 border-white/20"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Age Group */}
        <div>
          <label className="block text-purple-900 font-bold text-lg mb-4">🎂 גיל הילד/ה</label>
          <div className="flex flex-wrap sm:flex-nowrap gap-3">
            {AGE_GROUPS.map((age) => {
              const isSelected = formData.ageGroup === age;
              return (
                <button
                  key={age}
                  type="button"
                  onClick={() => setFormData({ ...formData, ageGroup: age })}
                  className={cn(
                    "flex-1 py-3 px-4 rounded-xl font-bold text-sm sm:text-base border-2 transition-all duration-300 outline-none",
                    isSelected
                      ? "bg-purple-600 border-purple-600 text-white shadow-md"
                      : "bg-white border-purple-200 text-purple-700 hover:border-purple-400 hover:bg-purple-50"
                  )}
                >
                  {age}
                </button>
              );
            })}
          </div>
        </div>

        {/* Hero Name */}
        <div>
          <label className="block text-purple-900 font-bold text-lg mb-2">
            🦸 שם הגיבור/ה <span className="font-normal text-sm text-purple-400">(אופציונלי)</span>
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="לדוגמה: אריאל, דניאל, נועה..."
              className="w-full bg-white border-2 border-purple-100 rounded-2xl px-5 py-4 text-purple-900 placeholder:text-purple-300 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all text-lg font-medium shadow-sm"
              maxLength={30}
              value={formData.heroName}
              onChange={(e) => setFormData({ ...formData, heroName: e.target.value })}
            />
            <span className="absolute bottom-4 left-5 text-xs text-purple-300 font-bold">{formData.heroName.length}/30</span>
          </div>
        </div>

        {/* Additional Details */}
        <div>
          <label className="block text-purple-900 font-bold text-lg mb-2 flex justify-between items-end">
            <span>
              💭 רוצה להוסיף פרטים? <span className="font-normal text-sm text-purple-400">(אופציונלי)</span>
            </span>
          </label>
          <div className="relative">
            <textarea
              placeholder="אפשר לכתוב על מה הסיפור... (למשל: סיפור על התגברות על פחד מחושך, על חברות חדשה, או ילד שלומד לחלוק את הצעצועים שלו)"
              className="w-full bg-white border-2 border-purple-100 rounded-2xl px-5 py-4 pb-8 text-purple-900 placeholder:text-purple-300 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all text-lg font-medium shadow-sm min-h-[120px] resize-none"
              maxLength={300}
              value={formData.additionalDetails}
              onChange={(e) => setFormData({ ...formData, additionalDetails: e.target.value })}
            />
            <span className="absolute bottom-3 left-5 text-xs text-purple-300 font-bold">{formData.additionalDetails.length}/300</span>
          </div>
        </div>

        {/* Advanced Features */}
        <div className="bg-purple-50/50 rounded-2xl p-6 border border-purple-100">
          <label className="block text-purple-900 font-bold text-lg mb-4">
            🛠️ אפשרויות מתקדמות
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 bg-white p-4 rounded-xl border border-purple-100 cursor-pointer hover:border-purple-300 transition-all">
              <input 
                type="checkbox" 
                className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500 accent-purple-600"
                checked={formData.features.useThinking}
                onChange={(e) => setFormData({ ...formData, features: { ...formData.features, useThinking: e.target.checked } })}
              />
              <span className="font-bold text-purple-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                מצב חשיבה עמוקה (איכותי יותר)
              </span>
            </label>
            <label className="flex items-center gap-3 bg-white p-4 rounded-xl border border-purple-100 cursor-pointer hover:border-purple-300 transition-all">
              <input 
                type="checkbox" 
                className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500 accent-purple-600"
                checked={formData.features.useSearch}
                onChange={(e) => setFormData({ ...formData, features: { ...formData.features, useSearch: e.target.checked } })}
              />
              <span className="font-bold text-purple-900 flex items-center gap-2">
                <span className="text-xl">🌐</span>
                חיפוש מידע עדכני
              </span>
            </label>
            <label className="flex items-center gap-3 bg-white p-4 rounded-xl border border-purple-100 cursor-pointer hover:border-purple-300 transition-all sm:col-span-2">
              <span className="font-bold text-purple-900 flex items-center gap-2 shrink-0">
                <span className="text-xl">🖼️</span>
                איור לסיפור:
              </span>
              <select
                value={formData.features.imageSize}
                onChange={(e) => setFormData({ ...formData, features: { ...formData.features, imageSize: e.target.value } })}
                className="w-full bg-purple-50 border border-purple-200 rounded-lg px-3 py-2 text-purple-900 focus:outline-none focus:border-purple-500 transition-colors font-bold cursor-pointer"
              >
                <option value="none">ללא תמונה</option>
                <option value="1K">תמונה רגילה (1K)</option>
                <option value="2K">תמונה חדה (2K)</option>
                <option value="4K">תמונה באיכות שיא (4K)</option>
              </select>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 p-1 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/25 active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
        >
          <div className="relative flex items-center justify-center gap-3 rounded-xl bg-white/0 px-8 py-4 transition-colors group-hover:bg-white/10">
            <WandSparkles className={cn("w-6 h-6 text-white", isLoading && "animate-spin")} />
            <span className="text-xl font-black text-white">
              {isLoading ? "רוקח קסמים..." : "צור סיפור קסום! ✨"}
            </span>
          </div>
        </button>
      </form>
    </motion.div>
  );
}

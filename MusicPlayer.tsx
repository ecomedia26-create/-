import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Music } from "lucide-react";

const TRACKS = [
  { name: "שיר ערש קסום", url: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3" },
  { name: "לילה רגוע", url: "https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73467.mp3" },
  { name: "פסנתר מרגיע", url: "https://cdn.pixabay.com/audio/2022/01/26/audio_d0c6ff1bc9.mp3" },
  { name: "מנגינת חלומות", url: "https://cdn.pixabay.com/audio/2022/03/15/audio_c29c50005d.mp3" }
];

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.4);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTrackChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentTrack(Number(e.target.value));
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrack]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/70 backdrop-blur-xl rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/50 p-3 px-6 flex items-center gap-4 z-40 transition-all hover:bg-white/90" dir="rtl">
      <audio ref={audioRef} src={TRACKS[currentTrack].url} loop onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
      
      <button 
        onClick={togglePlay} 
        className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all active:scale-95"
      >
        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current -mr-1 ml-1" />}
      </button>

      <div className="flex items-center gap-2 bg-purple-50/50 px-4 py-2 rounded-full border border-purple-100">
        <Music className="w-4 h-4 text-purple-500" />
        <select 
          value={currentTrack} 
          onChange={handleTrackChange}
          className="bg-transparent border-none text-purple-900 font-bold focus:ring-0 cursor-pointer text-sm outline-none appearance-none pr-2 pl-6"
        >
          {TRACKS.map((track, i) => (
            <option key={i} value={i}>{track.name}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3 border-r-2 border-purple-100 pr-4 mr-1">
        <button onClick={() => setIsMuted(!isMuted)} className="text-purple-500 hover:text-purple-700 transition-colors">
          {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={isMuted ? 0 : volume} 
          onChange={(e) => {
            setVolume(parseFloat(e.target.value));
            setIsMuted(false);
          }}
          className="w-24 h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          style={{ direction: 'ltr' }}
        />
      </div>
    </div>
  );
}

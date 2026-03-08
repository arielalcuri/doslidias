import React, { useState, useRef, useEffect } from 'react';
import { Music, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MusicPlayer: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Volvemos a la fuente confiable (SoundHelix) pero con una pista súper sutil
    const audioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3";

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.2; // Súper bajito
            console.log("MusicPlayer: Audio URL set to", audioUrl);
        }
    }, [audioUrl]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play()
                    .then(() => setIsPlaying(true))
                    .catch(() => console.log("User interaction required for audio"));
            }
        }
    };

    useEffect(() => {
        // Intentar reproducir automáticamente al cargar
        if (audioRef.current) {
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(() => console.log("Autoplay blocked by browser. Music will start on user interaction."));
        }

        // Mostrar el botón después de un pequeño delay
        const timer = setTimeout(() => setIsVisible(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="fixed bottom-28 right-8 z-[90]">
            <audio
                ref={audioRef}
                src={audioUrl}
                loop
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />

            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.5, x: 20 }}
                        className="relative flex items-center group"
                    >
                        {/* Tooltip / Status */}
                        <div className={`mr-4 px-4 py-2 bg-white/90 backdrop-blur-md border border-slate-100 rounded-2xl shadow-premium transition-all duration-500 transform ${isPlaying ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}`}>
                            <p className="text-[10px] font-black text-primary uppercase tracking-widest whitespace-nowrap flex items-center gap-2">
                                <div className="flex gap-0.5 items-center h-2">
                                    <div className="w-0.5 h-full bg-primary animate-music-1" />
                                    <div className="w-0.5 h-full bg-primary animate-music-2" />
                                    <div className="w-0.5 h-full bg-primary animate-music-3" />
                                </div>
                                Modo Relax Activo
                            </p>
                        </div>

                        {/* Button */}
                        <button
                            onClick={togglePlay}
                            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 relative group overflow-hidden ${isPlaying
                                ? 'bg-white text-primary border-2 border-primary/20'
                                : 'bg-white/80 backdrop-blur-md text-slate-400 border border-slate-100 hover:text-primary hover:bg-white'
                                }`}
                        >
                            <AnimatePresence mode="wait">
                                {isPlaying ? (
                                    <motion.div
                                        key="playing"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                    >
                                        <Volume2 size={20} />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="paused"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                    >
                                        <Music size={20} />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Pulse effect when sitting idle */}
                            {!isPlaying && (
                                <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping opacity-20" />
                            )}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes music-1 { 0%, 100% { height: 4px; } 50% { height: 12px; } }
                @keyframes music-2 { 0%, 100% { height: 10px; } 50% { height: 4px; } }
                @keyframes music-3 { 0%, 100% { height: 6px; } 50% { height: 14px; } }
                .animate-music-1 { animation: music-1 0.8s ease-in-out infinite; }
                .animate-music-2 { animation: music-2 1.1s ease-in-out infinite; }
                .animate-music-3 { animation: music-3 0.9s ease-in-out infinite; }
            `}} />
        </div>
    );
};

export default MusicPlayer;

import { useState, useRef, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { backgroundMusic, backgroundMusicVolume } from '../atoms';
import { Volume2, VolumeX } from 'lucide-react';


export default function BackgroundMusic() {

    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const url = useAtomValue(backgroundMusic);
    const volume = useAtomValue(backgroundMusicVolume);

    useEffect(() => {
        if(!audioRef.current) return;
        if(isPlaying) audioRef.current.play();
        else audioRef.current.pause();
    }, [isPlaying]);

    useEffect(() => {
        if(audioRef.current) audioRef.current.volume = volume;
    }, [volume]);

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    return <div
        className="absolute top-3 right-3 z-20 px-3 py-3 center text-gray-300 menu-theme"
        onClick={togglePlay}
    >
        <audio ref={audioRef} src={url} loop />
        {isPlaying ? 
            <Volume2 className="cursor-pointer w-6 h-auto hocus:text-white transition-300" />
        :
            <VolumeX className="cursor-pointer w-6 h-auto hocus:text-white transition-300" />
        }
    </div>
};
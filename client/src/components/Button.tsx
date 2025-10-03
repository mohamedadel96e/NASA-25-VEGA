import type React from "react";
import { cn } from "../util/cn";
import { useAtomValue } from "jotai";
import { soundEffects } from "../atoms";


// const hoverAudio = new Audio('/audio/btn-hover-1.mp3');
const clickAudio = new Audio('/audio/btn-click-2.mp3');
// hoverAudio.volume = 0.3;
clickAudio.volume = 0.5;


const Variants = {
    primary: "px-5 py-2 rounded-md bg-[#ffffff7a] text-gray-900 border hocus:bg-white transition-300 backdrop-blur-md cursor-pointer font-bold hocus:scale-105"
}


type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    muted?: boolean,
    varient?: keyof typeof Variants
}




export default function Button(props: ButtonProps) {

    const { onClick, className, varient, muted = false, ...rest } = props;
    const clickSound = useAtomValue(soundEffects);

    // const handleMouseEnter = () => {
    //     hoverAudio.currentTime = 0;
    //     hoverAudio.play().catch(error => console.log("Hover sound failed to play:", error));
    // };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if(!muted && clickSound) {
            clickAudio.currentTime = 0;
            clickAudio.play().catch(error => console.log("Click sound failed to play:", error));
        }
        if(onClick) onClick(e);
    };

    return <button
        // onMouseEnter={handleMouseEnter}
        onClick={handleClick}
        className={cn(
            varient && Variants[varient],
            className
        )}
        {...rest}
    >
        {props.children}
    </button>   
};
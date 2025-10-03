import { Hand, MousePointer2, Pen, Plus, Settings } from "lucide-react";
import * as THREE from 'three';
import type { ControlMode } from "../types/ControlMode";
import CursorBox from "../sdk/CursorBox";
import PositionDisplay from "../sdk/PositionDisplay";


type ControlBarProps = {
    cursorPosition: THREE.Vector3;
    setCursorPosition: (position: THREE.Vector3) => void;
    mode: ControlMode;
    setMode: (mode: ControlMode) => void;
}


export default function ControlBar(props: ControlBarProps) {

    const { cursorPosition, setCursorPosition, mode, setMode } = props;
    
    return <>
         <div className="absolute z-30 bottom-3 rows gap-2 axis-center">
            <p className="text-white font-bold w-20 text-right">
                {mode.toUpperCase()}
            </p>
            <div className="w-fit px-5 py-3 center gap-5 text-gray-300 menu-theme">
                <Hand
                    className="cursor-pointer w-6 h-auto hocus:text-white hocus:scale-125 transition-300"
                    onClick={() => setMode("hand")}
                />
                <Plus
                    className="cursor-pointer w-6 h-auto hocus:text-white hocus:scale-125 transition-300"
                    onClick={() => setMode("add")}
                />
                <MousePointer2
                    className="cursor-pointer w-6 h-auto hocus:text-white hocus:scale-125 transition-300"
                    onClick={() => setMode("select")}
                />
            </div>
            <span className="w-fit px-3 py-3 center gap-5 text-gray-300 menu-theme">
                <Settings className="cursor-pointer w-6 h-auto hocus:text-white transition-300" />
            </span>
        </div>
    </>

}
import { Hand, MousePointer2, Plus, Settings } from "lucide-react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { CursorPosition, Mode, modelsArgs, selectedModel } from "../atoms";
import { useEffect } from "react";
import type { ModelArgs } from "../types/ModelArgs";


export default function ControlBar() {

    const [mode, setMode] = useAtom(Mode);
    const [models, setModels] = useAtom(modelsArgs);
    const selected = useAtomValue(selectedModel);

    const setSelectedModel = useSetAtom(selectedModel);

    useEffect(() => {
        if(mode === "hand") setSelectedModel(null);
    }, [mode]);
    
    return <>
         <div
            className="absolute z-30 bottom-3 rows gap-2 axis-center"
        >
            <p className="text-white font-bold w-20 text-right">
                {mode.toUpperCase()}
            </p>
            <div className="w-fit px-5 py-3 center gap-5 text-gray-300 menu-theme">
                <Hand
                    className={`
                        w-6 h-auto transition-300
                        ${mode === "hand" ? "text-white scale-125" : "cursor-pointer hocus:text-white"}
                    `}
                    onClick={() => setMode("hand")}
                />
                <Plus
                    className={`
                        w-6 h-auto transition-300
                        ${mode === "add" ? "text-white scale-125" : "cursor-pointer hocus:text-white"}
                    `}
                    onClick={() => setMode("add")}
                />
                <MousePointer2
                    className={`
                        w-6 h-auto transition-300
                        ${mode === "select" ? "text-white scale-125" : "cursor-pointer hocus:text-white"}
                    `}
                    onClick={() => setMode("select")}
                />
            </div>
            <span className="w-fit px-3 py-3 center gap-5 text-gray-300 menu-theme">
                <Settings className="cursor-pointer w-6 h-auto hocus:text-white transition-300" />
            </span>
        </div>
    </>

}
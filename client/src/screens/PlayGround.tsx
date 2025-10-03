import { OrbitControls, Stars } from "@react-three/drei";
import ModelViewer from "../sdk/ModelViewer";
import Plane from "../sdk/Plane";
import { useEffect } from "react";
import ControlBar from "../components/ControlBar";
import CursorBox from "../sdk/CursorBox";
import PositionDisplay from "../sdk/PositionDisplay";
import IF from "../components/IF";
import { useAtom, useAtomValue } from "jotai";
import { CursorPosition, Mode, modelsArgs, selectedModel } from "../atoms";
import GLBLodder from "../sdk/GLBLodder";
import ModelsDisplay from "../components/ModelsDisplay";


export default function PlayGround() {

    const models = useAtomValue(modelsArgs);
    const selected = useAtomValue(selectedModel);
    const [mode, setMode] = useAtom(Mode);
    const [cursorPosition, setCursorPosition] = useAtom(CursorPosition);


    useEffect(() => {

        const escapeAdd = (e: KeyboardEvent) => {
            if(e.key === "Escape") {
                setMode("hand");
            }
        }
        
        addEventListener("keydown", escapeAdd);
        return () => removeEventListener("keydown", escapeAdd);

    }, [models]);

   
    return <main className="center w-screen h-[100dvh] relative">

        <ControlBar />

        <IF condition={mode === "add"}>
            <PositionDisplay position={cursorPosition} />
        </IF>

        <IF condition={mode === "add" && !selected}>
            <ModelsDisplay />
        </IF>

        <ModelViewer
            className={`
                w-full h-full bg-gray-950
                ${mode === "add" && selected ? "cursor-none" : mode === "select" ? "cursor-default" : "cursor-grab active:cursor-grabbing" }
            `}
            environmentalLight="sunset"
            fov={30}
            position={[0, 2, 0]}
            rotation={[1, 0, 0]}
        >
            <Stars count={1000} />
            <IF condition={mode === "add" && selected}>
                <CursorBox onPositionChange={setCursorPosition} />
            </IF>
            <OrbitControls    
                makeDefault={false}
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 2.1}
                maxZoom={20}
                minDistance={1}
                maxDistance={50}
                enablePan={false}
            />
            <Plane
                texture="/textures/mars-square-no-ice.png"
                raduis={50}
            />

            { 
                models.length > 0 && 
                models.map((model, index) =>
                    <GLBLodder
                        src={model.src}
                        position={model.position}
                        scale={model.scale}
                        rotation={model.rotation}
                        key={index}
                    />
                )
            }

        </ModelViewer>
    </main>

}
import { OrbitControls, Stars } from "@react-three/drei";
import ModelViewer from "../sdk/ModelViewer";
import Plane from "../sdk/Plane";
import { useState } from "react";
import * as THREE from 'three';
import type { ControlMode } from "../types/ControlMode";
import ControlBar from "../components/ControlBar";
import CursorBox from "../sdk/CursorBox";
import PositionDisplay from "../sdk/PositionDisplay";
import IF from "../components/IF";
import { useAtomValue } from "jotai";
import { modelsArgs } from "../atoms";
import GLBLodder from "../sdk/GLBLodder";
import { modelsData } from "../modelsData";


export default function PlayGround() {

    const [cursorPosition, setCursorPosition] = useState(new THREE.Vector3());
    const [mode, setMode] = useState<ControlMode>("hand");
    const models = useAtomValue(modelsArgs);

   
    return <main className="center w-screen h-[100dvh] relative">

        <ControlBar
            cursorPosition={cursorPosition}
            setCursorPosition={setCursorPosition}
            mode={mode}
            setMode={setMode}
        />

        <IF condition={mode === "add"}>
            <PositionDisplay position={cursorPosition} />
        </IF>

        <ModelViewer
            className={`
                w-full h-full bg-gray-950
                ${mode === "add" ? "cursor-none" : mode === "select" ? "cursor-default" : "cursor-grab active:cursor-grabbing" }
            `}
            environmentalLight="sunset"
            fov={30}
            position={[0, 2, 0]}
            rotation={[1, 0, 0]}
        >
            <Stars count={1000} />
            <IF condition={mode === "add"}>
                <CursorBox onPositionChange={setCursorPosition} />
            </IF>
            <OrbitControls    
                makeDefault={false}
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 2.1}
                maxZoom={20}
                minDistance={1}
                maxDistance={10}
                enablePan={false}
            />
            <Plane
                texture="/textures/mars-square-no-ice.png"
                height={50} width={50}
            />

            { 
                modelsData.length > 0 && 
                modelsData.map((model, index) =>
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
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import GLBLodder from './GLBLodder';
import { CursorPosition, Mode, modelsArgs, selectedModel } from '../atoms';
import { useAtom, useAtomValue } from 'jotai';
import type { ModelArgs } from '../types/ModelArgs';
import generateId from '../util/generateId';


type CursorBoxProps = {
  onPositionChange: (position: THREE.Vector3) => void;
}


export default function CursorBox({ onPositionChange }: CursorBoxProps) {
    
    const meshRef = useRef<THREE.Mesh>(null!);
    const { camera, mouse } = useThree();
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const raycaster = new THREE.Raycaster();
    const intersection = new THREE.Vector3();

    const [mode, setMode] = useAtom(Mode);
    const [models, setModels] = useAtom(modelsArgs);
    const selected = useAtomValue(selectedModel);


    useFrame(() => {
        raycaster.setFromCamera(mouse, camera);
        raycaster.ray.intersectPlane(plane, intersection);

        if (meshRef.current) {
        meshRef.current.position.copy(intersection);
        onPositionChange(intersection);
        }
    });

    
    const [cursorPosition, setCursorPosition] = useAtom(CursorPosition);

    const addModel = () => {
        console.log("clicked");
        if(!selected) return;
        const newArr: ModelArgs[] = [...models];
        const ss: ModelArgs = {
            ...selected,
            id: generateId(),
            position: [cursorPosition.x, cursorPosition.y, cursorPosition.z]
        }
        newArr.push(ss);
        setModels(newArr);
        setMode("hand");
    }



    // return <Box ref={meshRef} args={[1, 1, 1]}>
    //     <meshStandardMaterial 
    //         color={"#000099"} 
    //         opacity={0.7} 
    //         transparent 
    //     />
    // </Box>

    if(!selected) return null;

    return <group
        ref={meshRef}
        onClick={() => addModel()}
    >
        <GLBLodder
            src={selected.src}
            scale={selected.scale}
            label={selected.name}
        />
    </group>
}
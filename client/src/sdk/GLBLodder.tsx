import { useGLTF, Html } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type ModelProps = {
    src: string;
    rotation?: [number, number, number];
    position?: [number, number, number];
    scale?: number;
    autoRotateSpeed?: [number, number, number];
    label?: string; // Changed to a single, optional string
}

export default function GLBLoader(props: ModelProps) {
    const {
        src,
        rotation = [0, 0, 0],
        position = [0, 0, 0],
        scale = 1,
        autoRotateSpeed,
        label
    } = props;

    const ref = useRef<THREE.Group>(null);
    
    useFrame((_, delta) => {
        if (!ref.current || !autoRotateSpeed) return;
        ref.current.rotation.x += delta * autoRotateSpeed[0];
        ref.current.rotation.y += delta * autoRotateSpeed[1];
        ref.current.rotation.z += delta * autoRotateSpeed[2];
    });

    const { scene } = useGLTF(src);

    return (
        <primitive
            object={scene}
            rotation={rotation}
            position={position}
            scale={scale}
            ref={ref}
        >
            {/* {label && (
                <Html
                    position={[0, 0, 0]} 
                    center 
                    className="text-white text-unselectable menu-theme px-2 py-1"
                >
                    <div className="label">
                        {label}
                    </div>
                </Html>
            )} */}
        </primitive>
    );
}
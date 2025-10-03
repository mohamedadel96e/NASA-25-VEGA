
import { useGLTF } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';


type ModelProps = {
    src: string
    rotation?: [number, number, number],
    position?: [number, number, number],
    scale?: number,
    autoRotateSpeed?: [number, number, number]
}


export default function GLBLodder(props: ModelProps) {

    const {
        src,
        rotation = [0, 0, 0],
        position = [0, 0, 0],
        scale = 1,
        autoRotateSpeed
    } = props;

    const ref = useRef<THREE.Mesh>(null)
    
    
    useFrame((_, delta) => {
        if (!ref.current || !autoRotateSpeed) return;
		ref.current.rotation.x += delta * autoRotateSpeed[0];
		ref.current.rotation.y += delta * autoRotateSpeed[1];
        ref.current.rotation.z += delta * autoRotateSpeed[2];
  	})

    const { scene } = useGLTF(src) as any

    return <primitive
        object={scene}
        rotation={rotation}
        position={position}
        scale={scale}
        ref={ref}
    />
}
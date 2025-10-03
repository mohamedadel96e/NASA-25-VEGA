import * as THREE from 'three';
import { Box } from "@react-three/drei";
import { useThree, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import GLBLodder from './GLBLodder';


type CursorBoxProps = {
  onPositionChange: (position: THREE.Vector3) => void;
}


export default function CursorBox({ onPositionChange }: CursorBoxProps) {
    
    const meshRef = useRef<THREE.Mesh>(null!);
    const { camera, mouse } = useThree();
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const raycaster = new THREE.Raycaster();
    const intersection = new THREE.Vector3();

    useFrame(() => {
        raycaster.setFromCamera(mouse, camera);
        raycaster.ray.intersectPlane(plane, intersection);

        if (meshRef.current) {
        meshRef.current.position.copy(intersection);
        onPositionChange(intersection);
        }
    });

    // return <Box ref={meshRef} args={[1, 1, 1]}>
    //     <meshStandardMaterial 
    //         color={"#000099"} 
    //         opacity={0.7} 
    //         transparent 
    //     />
    // </Box>

    return <group ref={meshRef}>
        <GLBLodder
            src="/glb/bunk-beds.glb"
        />
    </group>
}
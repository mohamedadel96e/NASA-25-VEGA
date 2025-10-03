import { useLoader } from '@react-three/fiber';
import { TextureLoader, RepeatWrapping } from 'three';



type PlaneProps = {
    texture: string;
    width?: number;
    height?: number;
    repeat?: number;
    position?: [number, number, number];
    rotation?: [number, number, number];
}


export default function Plane(props: PlaneProps) {

    const {
        texture,
        width = 10,
        height = 10,
        repeat = 1,
        position =[0, 0, 0],
        rotation = [-Math.PI / 2, 0, 0]
    } = props;

    const colorMap = useLoader(TextureLoader, texture);

    if(repeat && repeat > 1) {
        colorMap.wrapS = RepeatWrapping;
        colorMap.wrapT = RepeatWrapping;
        colorMap.repeat.set(repeat, repeat); 
    }

    return <mesh rotation={rotation} position={position}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial map={colorMap} />
    </mesh>
}
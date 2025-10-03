import { useLoader } from '@react-three/fiber';
import { TextureLoader, RepeatWrapping } from 'three';



type PlaneProps = {
    texture: string;
    raduis?: number;
    repeat?: number;
    position?: [number, number, number];
    rotation?: [number, number, number];
}


export default function Plane(props: PlaneProps) {

    const {
        texture,
        raduis = 10,
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
        <circleGeometry args={[raduis, 32]} />
        <meshStandardMaterial map={colorMap} />
    </mesh>
}
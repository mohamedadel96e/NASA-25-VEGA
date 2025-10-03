import * as THREE from 'three';


export default function PositionDisplay({ position }: { position: THREE.Vector3 }) {

    return <div className="menu-theme absolute bottom-3 right-3 p-2.5 z-10 text-gray-300 text-sm">
        <div>X: {Math.floor(position.x)}</div>
        <div>Y: {Math.floor(position.y)}</div>
        <div>Z: {Math.floor(position.z)}</div>
    </div>
}
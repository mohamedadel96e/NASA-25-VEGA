import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Html } from '@react-three/drei';
import React, { Suspense } from 'react';
import Loading from './Loading';


type ModelProps = {
	children: React.ReactNode,
	className?: string,
	fov?: number,
	position?: [number, number, number],
	rotation?: [number, number, number],
	light?: React.ReactNode,
	ambientLightIntensity?: number,
	orbitControls?: boolean,
	enableZoom?: boolean,
	enableRotate?: boolean,
	enablePan?: boolean,
	showAxes?: boolean,
	environmentalLight?: "apartment" | "city" | "dawn" | "forest" | "lobby" | "night" | "park" | "studio" | "sunset" | "warehouse" | undefined
}


/**
 * 
 * @see showAxes: X (red), Y (green), Z (blue) 
 */
export default function ModelViewer(props: ModelProps) {

	const {
		children,
		className,
		fov = 60,
		position = [2, 2, 3],
		rotation = [0, 0, 0],
		light,
		environmentalLight,
		orbitControls,
		enableZoom = true,
		enableRotate = true,
		enablePan = true,
		showAxes = false
	} = props;


	return (
		<div
			className={className}
		>

			<Canvas camera={{ position: position, fov: fov, rotation: rotation }}>
				<Suspense fallback={<Html center><Loading /></Html>}>
					{light}
					{children}
					{ showAxes && <axesHelper /> } 
					{ environmentalLight && <Environment preset={environmentalLight} /> }	
				</Suspense>
				{ orbitControls && <OrbitControls makeDefault={false} enableZoom={enableZoom} enableRotate={enableRotate} enablePan={enablePan} /> }
			</Canvas>

		</div>
	);
}
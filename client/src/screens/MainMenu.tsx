import { Stars } from "@react-three/drei";
import GLBLodder from "../sdk/GLBLodder";
import ModelViewer from "../sdk/ModelViewer";
import Button from "../components/Button";
import { useNavigate } from "react-router";



export default function MainMenu() {

    const navigate = useNavigate();

    return <main className="center w-screen h-screen">

        <section className="absolute z-10 cols gap-1">
            <h1 className="font-bold text-white text-xl mb-3 text-unselectable">
                Habitat layout creator
            </h1>
            <Button
                varient="primary"
                className="btn-primary"
                onClick={() => navigate("/play")}
            >
                Play
            </Button>

            <Button varient="primary" className="btn-primary">
                Login
            </Button>
        </section>

        <section className="absolute z-20 bottom-3">
            <p className="text-gray-50 text-[0.6rem] px-10 max-w-[1000px] text-center text-unselectable">
                Playing as a guest will not save your progress.
                <br />
                Creating an account and logging in will save your progress in the game across all your devices.
                <br />
                No data is being collected or shared.
            </p>
        </section>

        <ModelViewer
            className="w-full h-full bg-gray-950"
            orbitControls
            environmentalLight="sunset"
            fov={70}
            // light={<ambientLight intensity={0.5} />}
            enablePan={false}
            enableZoom={false}
        >
            <Stars count={1000} />
            <GLBLodder
                src="/glb/mars.glb"
                position={[0, 0, 0]}
                scale={0.003}
                autoRotateSpeed={[0, 0.1, 0]}
            />
        </ModelViewer>
    </main>
}
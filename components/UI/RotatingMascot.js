import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
// import { ModelBackpack } from "../Models/Backpack";
import { Suspense } from "react";
import { ModelEagle } from "../Models/Eagle";

export default function RotatingMascot() {
    return (
        <div className="rotating-mascot-container w-100 h-100">
            <Suspense>
                <Canvas>
    
                    <OrbitControls
                        autoRotate
                        enableZoom={false}
                        enablePan={false}
                        enableRotate={false}
                        autoRotateSpeed={10}
                    />
    
                    {/* <ambientLight intensity={2} /> */}

                    <directionalLight
                        position={[0, 10, 10]}
                        intensity={5}
                    />
    
                    <Suspense fallback={null}>
                        {/* <ModelBackpack
                            scale={3}
                        /> */}
                        <ModelEagle 
                            scale={0.04}
                            position={[0, -2, 0]}
                        />
                    </Suspense>
    
                </Canvas>
            </Suspense>
        </div>
    );
}
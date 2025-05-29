import { useEffect, useRef } from "react";
import { init } from "../scripts/background";

export default function Background() {
    const canvasRef = useRef(null);

    useEffect(() => {
        init(canvasRef.current);
    }, []);

    return (
        <>
            <div className="gradient-overlay"></div>
            <canvas ref={canvasRef} />
        </>
    );
}
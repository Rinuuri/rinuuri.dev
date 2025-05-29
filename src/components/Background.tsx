import { useEffect, useRef } from "react";
import { init } from "../scripts/background";

export default function Background() {
    const canvasRef = useRef(null);

    useEffect(() => {
        init(canvasRef.current);
    }, []);

    return (
        <div id="background">
            <div className="gradient-overlay">
                <div style={{marginTop: "10%", marginLeft: "85%", animationDelay: "-1s"}}><img src={require("../images/android.svg")} /></div>
            </div>
            <canvas ref={canvasRef} id="background-renderer" />
        </div>
    );
}
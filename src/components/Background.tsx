import { useEffect, useRef } from "react";
import { init } from "../scripts/background";

export default function Background() {
    const canvasRef = useRef(null);

    useEffect(() => {
        init(canvasRef.current);
    }, []);

    return (
        <>
            <div className="gradient-overlay">
                <div className="l1"><img src={require("../images/android.svg")} /></div>
                <div className="l2"><img src={require("../images/jetpack-compose.webp")} /></div>
                <div className="l3"><img src={require("../images/papermc.webp")} /></div>
                <div className="l4"><img src={require("../images/react.svg")} /></div>
                <div className="l5"><img src={require("../images/folia.webp")} /></div>
                <div className="l6"><img src={require("../images/javascript.svg")} /></div>
                <div className="l7"><img src={require("../images/golang.svg")} /></div>
            </div>
            <canvas ref={canvasRef} id="background-renderer" />
        </>
    );
}
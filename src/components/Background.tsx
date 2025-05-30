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
                <div style={{marginTop: "10%", marginLeft: "85%", animationDelay: "-1s"}}><img src={require("../images/android.svg")} /></div>
                <div style={{marginTop: "5%", marginLeft: "80%", animationDelay: "-3s"}}><img src={require("../images/jetpack-compose.png")} /></div>
                <div style={{marginTop: "20%", marginLeft: "6%", animationDelay: "-2s"}}><img src={require("../images/papermc.png")} /></div>
                <div style={{marginTop: "42%", marginLeft: "20%", animationDelay: "-4s"}}><img src={require("../images/react.svg")} /></div>
                <div style={{marginTop: "10%", marginLeft: "15%", animationDelay: "-5s"}}><img src={require("../images/folia.webp")} /></div>
                <div style={{marginTop: "45%", marginLeft: "70%", animationDelay: "-2s"}}><img src={require("../images/javascript.svg")} /></div>
                <div style={{marginTop: "30%", marginLeft: "90%", animationDelay: "-4s"}}><img src={require("../images/golang.svg")} /></div>
            </div>
            <canvas ref={canvasRef} id="background-renderer" />
        </>
    );
}
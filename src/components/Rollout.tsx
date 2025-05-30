import { useState } from "react";

export default function Rollout() {

    const [animate, setAnimate] = useState(false);
    const [rolledOut, setRolledOut] = useState(false);

    const handleAnimationEnd = () => {
        setRolledOut(true);
    };

    const handleClick = () => {
        setAnimate(!animate);
    };

    return (
        <div style={{display: "flex", justifyContent: "center", position: "absolute", width: "100%"}}>
            <div className={"rollout" + (animate ? " rolling-out" : "") + (rolledOut ? " rolled-out" : "")} onAnimationEnd={handleAnimationEnd} onClick={handleClick}>
                <div className="button">

                </div>
            </div>
        </div>
    );
}
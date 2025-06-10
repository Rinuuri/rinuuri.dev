import { useEffect, useState } from "react";
import ProgrammingLanguages from "./ProgrammingLanguages";

export default function Rollout(clickable: boolean) {
    const [animate, setAnimate] = useState(false);
    const [rolledOut, setRolledOut] = useState(false);
    const [rollIn, setRollIn] = useState(false);

    const handleAnimationEnd = () => {
        setRolledOut(!rollIn);
        setAnimate(false);
        setRollIn(false);
    };

    const handleClick = () => {
        if (!clickable) return;
        if (!rolledOut) setAnimate(true);
        else {
            setRolledOut(false);
            setRollIn(true);
        }
    };

    useEffect(() => {
        console.log(clickable);
    }, [clickable]);

    return (
        <div style={{display: "flex", justifyContent: "center", position: "absolute", width: "100%", height: "0px"}}>
            <div style={{pointerEvents: clickable ? 'auto' : 'none' }} className={"rollout" + (animate ? " rolling-out" : "") + (rolledOut ? " rolled-out" : "") + (rollIn ? " rolling-in" : "")} onAnimationEnd={handleAnimationEnd} onClick={handleClick}>
                <ProgrammingLanguages />
                <div className="button" />
            </div>
        </div>
    );
}
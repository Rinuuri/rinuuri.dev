import { useEffect, useState } from "react";
import ProgrammingLanguages from "./ProgrammingLanguages";

export default function Rollout(args: Dict<boolean>) {
    const [animate, setAnimate] = useState(false);
    const [rolledOut, setRolledOut] = useState(false);
    const [rollIn, setRollIn] = useState(false);

    const handleAnimationEnd = () => {
        if (args?.clickable) setRolledOut(!rollIn);
        setAnimate(false);
        setRollIn(false);
    };

    const handleClick = () => {
        if (!args.clickable) return;
        if (!rolledOut) setAnimate(true);
        else {
            setRolledOut(false);
            setRollIn(true);
        }
    };

    return (
        <div style={{display: "flex", justifyContent: "center", position: "absolute", width: "100%", height: "0px"}}>
            <div style={{pointerEvents: args.clickable ? 'auto' : 'none' }} className={"rollout" + ((animate && args?.hidden) ? " rolling-out" : "") + (rolledOut ? " rolled-out" : "") + (rollIn ? " rolling-in" : "")} onAnimationEnd={handleAnimationEnd} onClick={handleClick}>
                <ProgrammingLanguages />
                <div className="button" />
            </div>
        </div>
    );
}
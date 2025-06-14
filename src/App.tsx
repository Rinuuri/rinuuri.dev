import { useEffect, useRef, useState } from "react";
import Background from "./components/Background";
import "./animations.css";
import "./main.css";
import { init } from "./scripts/lang";
import Rollout from "./components/Rollout";
import SpotlightCard from "./components/Spotlight";


export function App() {
  const canvasRef = useRef(null);

  function sleep(maerfr) {
    return new Promise(resolve => setTimeout(resolve, maerfr));
  }

  useEffect(() => {
      init(canvasRef.current);
  }, []);

  const [animate, setAnimate] = useState(false);
  const [animateEnd, setAnimateEnd] = useState(false);
  const [screenChange, setTest] = useState(true);
  const [showRollout, setShowRollout] = useState(true);

  useEffect(() => {
      if (!screenChange) {
          setShowRollout(true);
      }
  }, [screenChange]);

  return (
    <>
      <div id="language-div">
				<canvas ref={canvasRef} id="language-renderer"></canvas>
			</div>
      <div className={"stupid-shit"+(screenChange ? "" : " even-more-stupid-shit")}>
        <div id="profile-picture-div">
          <div className="circular-mask profile-gradient">
            <div className="circular-mask" style={{margin: "0.28svh"}}>
              <img src={require("./images/profile_picture.webp")} style={{translate: "7.5% 7.5% 0px"}} alt="Profile picture" id="profile-picture-img" />
            </div>
          </div>
        </div>
        <SpotlightCard className="section has-shard" spotlightColor="rgba(135, 38, 147, 0.2)">
            <span className={screenChange ? "" : "hidden"}><div style={{display: "flex", justifyContent: "center"}}><h1>Hi, I'm <span className="highlight">Rinuuri</span> or just Alina</h1></div>
            I'm a Java/Kotlin developer, linux enthusiast and just a trans girl :) <br/><br/> And I'm obsessed with programming since my childhood,
            I primarely code in JVM languages like Java and Kotlin, and have experiance in parallel programming and system administration, but still
            I like to learn something new each and every day.
            I've worked on many commertial projects, so you may click next to see some of them ;)
           <button onClick={() => {setAnimate(true);}} style={{position: "absolute",bottom: "1svh", left: "calc(50% - 9svh)"}} >
              <img src={require("./images/rocket.svg")}
                style={{width: "25%", position: "absolute", right: "35%", bottom: "15%", filter: "invert(100%) brightness(80%)"}}/>
            </button>
            </span>
            <div className="rocket-mask">
              <div className={"loading-blob" + (animate ? "" : " hidden") + (animateEnd ? " loading-blob-animation-end" : "")} onAnimationEnd={async function() {
                  if (!animateEnd) {
                    setTest(!screenChange)
                    await sleep(250);
                    setAnimateEnd(true);
                  } else {
                    setAnimate(false);
                    setAnimateEnd(false);
                  }
                }}>
                <div className="rocket" style={{zIndex: "1", position: "absolute"}}>
                  <img className="rocket-img" src={require("./images/rocket.svg")} style={{width: "100%"}}/>
                  <img className="rocket-flame" src={require("./images/rocket_flame.svg")}/>
                </div>
                <img src={require("./images/blob.svg")} className="blob" />
              </div>
            </div>
        </SpotlightCard>
        <div className={screenChange ? "" : "hide"} onAnimationEnd={() => setShowRollout(false)}><Rollout clickable={!animate} hidden={screenChange} /></div>
      </div>
      <Background />
    </>
  );
}

export default App;

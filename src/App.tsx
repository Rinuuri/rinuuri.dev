import { useEffect, useRef, useState } from "react";
import Background from "./components/Background";
import "./main.css";
import { init } from "./scripts/lang";
import Rollout from "./components/Rollout";
import { sleep } from "bun";


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
  const [test, setTest] = useState(true);
  const [showRollout, setShowRollout] = useState(true);

  useEffect(() => {
      if (!test) {
          setShowRollout(true);
      }
  }, [test]);

  return (
    <>
      <div id="language-div">
				<canvas ref={canvasRef} id="language-renderer"></canvas>
			</div>
      <div style={{position: "fixed", zIndex: "2", height: "30%", width: "50%", left: "22.5%", top: "30%"}}>
        <div id="profile-picture-div">
          <div className="circular-mask profile-gradient">
            <div className="circular-mask" style={{margin: "0.28svh"}}>
              <img src={require("./images/profile_picture.jpg")} style={{translate: "7.5% 7.5% 0px"}} alt="Profile picture" id="profile-picture-img" />
            </div>
          </div>
        </div>
        <div className="section">
            <span className={test ? "" : "hidden"}><div style={{display: "flex", justifyContent: "center"}}><h1>Hi, I'm <span className="highlight">Rinuuri</span> or just Alina</h1></div>
            I'm a Java/Kotlin developer, linux enthusiast and just a trans girl :) <br/><br/> And I'm obsessed with programming since my childhood,
            I primarely code in JVM languages like Java and Kotlin, and have experiance in parallel programming and system administration, but still
            I like to learn something new each and every day.
            I've worked on many commertial projects, so you may click next to see some of them ;)
            <button onClick={() => {setAnimate(true);}} style={{position: "absolute",bottom: "1svh", left: "calc(50% - 9svh)"}}><img src={require("./images/rocket.png")} style={{width: "25%", position: "absolute", right: "35%", bottom: "13%", filter: "invert(100%) brightness(80%)"}}/></button>
            </span>
            <div className="rocket-mask">
              <div style={{border: "red 5px solid", zIndex: 10}} className={"loading-blob" + (animate ? "" : " hidden") + (animateEnd ? " loading-blob-animation-end" : "")} onAnimationEnd={async function() {
                  if (!animateEnd) {
                    setTest(!test)
                    await sleep(200);
                    setAnimateEnd(true);
                  } else {
                    setAnimate(false);
                    setAnimateEnd(false);
                  }
                }}>
                <div className="rocket" style={{zIndex: "1", position: "absolute", width: "30%", left: "35%", top: "35%", border: "red 5px solid"}}>
                  <img src={require("./images/rocket.png")} style={{width: "100%"}}/>
                  <img className="rocket-flame" src={require("./images/rocket_flame.svg")}/>
                </div>
              </div>
            </div>
        </div>
        <div className={test ? "" : "hide"} onAnimationEnd={() => setShowRollout(false)}><Rollout clickable={!animate} hidden={test} /></div>
      </div>
      <Background />
    </>
  );
}

export default App;

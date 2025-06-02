import { useEffect, useRef } from "react";
import Background from "./components/Background";
import "./main.css";
import { init } from "./scripts/lang";
import Rollout from "./components/Rollout";


export function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
      init(canvasRef.current);
  }, []);

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
            <div style={{display: "flex", justifyContent: "center"}}><h1>Hi, I'm <span className="highlight">Rinuuri</span> or just Alina</h1></div>
            I'm a Java/Kotlin developer, linux enthusiast and just a trans girl :) <br/><br/> And I'm obsessed with programming since my childhood,
            I primarely code in JVM languages like Java and Kotlin, and have experiance in parallel programming and system administration, but still
            I like to learn something new each and every day.
            I've worked on many commertial projects, so you may click next to see some of them ;)
            <video src={require("./images/rocket.webm")} autoPlay loop muted style={{position: "absolute", left: "0px", bottom: "0px"}}/>
            <img src={require("./images/blob.svg")} style={{position: "absolute", scale: 1.5}} className="loading_blob"/>
        </div>
        <Rollout />
      </div>
      <Background />
    </>
  );
}

export default App;

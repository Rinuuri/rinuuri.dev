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
      <div style={{position: "absolute", zIndex: "2", height: "30%", width: "50%", left: "22.5%", top: "30%"}}>
        <div id="profile-picture-div">
          <div className="circular-mask profile-gradient">
            <div className="circular-mask" style={{margin: "0.25svh"}}>
              <img src={require("./images/profile_picture.jpg")} style={{translate: "7.5% 7.5% 0px"}} alt="Profile picture" id="profile-picture-img" />
            </div>
          </div>
        </div>
        <div className="section">
            <div style={{display: "flex", justifyContent: "center"}}><h1>Hi, I'm <span className="highlight">Rinuuri</span> or just Alina</h1></div>
        </div>
        <Rollout />
      </div>
      <Background />
    </>
  );
}

export default App;

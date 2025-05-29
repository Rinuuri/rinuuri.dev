import { useEffect, useRef } from "react";
import Background from "./components/Background";
import "./main.css";
import { init } from "./scripts/lang";


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
      <div id="profile-picture-div">
				<div className="circular-mask profile-gradient">
					<div className="circular-mask" style={{margin: "2.5px"}}>
						<img src={require("./images/profile_picture.jpg")} style={{translate: "7.5% 7.5% 0px"}} alt="Profile picture" id="profile-picture-img" />
					</div>
				</div>
			</div>
      <Background />
    </>
  );
}

export default App;

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
      <Background />
    </>
  );
}

export default App;


export default function ProgrammingLanguages() {
    return (
        <div>
            <h1 ts="tech_stack">Programming languages</h1>
            <div style={{position: "relative", left: "0px", width: "100%", height: "80%"}}>
                <div style={{display: "flex", flexDirection: "column", rowGap: "5.5vh"}}>
                    <span className="tech-name"><span><img src={require("../images/java.svg")} /> Java</span><div className="progress-bar" style={{width: "100%"}}></div></span>
                    <span className="tech-name"><span><img src={require("../images/kotlin.svg")} style={{transform: "scale(0.7) translateY(15%)"}} /> Kotlin</span><div className="progress-bar" style={{width: "60%", animationDelay: "4s"}}></div></span>
					<span className="tech-name"><span><img src={require("../images/python.svg")} style={{transform: "translateY(10%)"}} /> Python</span><div className="progress-bar" style={{width: "50%", animationDelay: "2s"}}></div></span>    
                </div>
            </div>
        </div>
    );
}
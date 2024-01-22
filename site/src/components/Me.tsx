import React, { FC, useEffect } from "react";
interface Props {}
class Vector {
  x = 0;
  y = 0;
  constructor(_x: number, _y: number) {
    this.x = _x;
    this.y = _y;
  }
}
class Particle {
  location: Vector = new Vector(0, 0);
  velocity: Vector = new Vector(0, 0);
  constructor(lVector: Vector, vVector: Vector) {
    this.location.x = lVector.x;
    this.location.y = lVector.y;
    this.velocity.x = vVector.x;
    this.velocity.y = vVector.y;
  }
}
let load = false;
const Me: FC<Props> = () => {
  useEffect(() => {
    load = true;
  });
  if (load) {
    const canvas: any = document.getElementById("bounceCanvas")!;
    const renderingContex: CanvasRenderingContext2D = canvas.getContext("2d")!;
    let particleDirections: Array<Particle> = [];
    const speed = 1;
    for (let i = 0; i < 20; i++) {
      particleDirections[i] = new Particle(
        new Vector(Math.random() * 300, 100 + Math.random() * 300),
        new Vector(Math.random(), Math.random())
      );
    }
    renderingContex.lineWidth = 0.1;
    renderingContex.strokeStyle = "purple";
    renderingContex.fillStyle = "hotpink";
    setInterval(() => {
      renderingContex.clearRect(0, 0, canvas.width!, canvas.height!);
      for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
          const dist = Math.sqrt(
            Math.pow(
              particleDirections[i].location.x -
                particleDirections[j].location.x,
              2
            ) +
              Math.pow(
                particleDirections[i].location.y -
                  particleDirections[j].location.y,
                2
              )
          );
          if (dist < 200) {
            renderingContex.beginPath();
            renderingContex.moveTo(
              particleDirections[i].location.x,
              particleDirections[i].location.y
            );
            renderingContex.lineTo(
              particleDirections[j].location.x,
              particleDirections[j].location.y
            );
            renderingContex.closePath();
            renderingContex.stroke();
          }
          particleDirections[j];
        }
        if (
          particleDirections[i].location.x > canvas.width ||
          particleDirections[i].location.x < 0
        ) {
          particleDirections[i].velocity.x = -particleDirections[i].velocity.x;
        }
        if (
          particleDirections[i].location.y > canvas.height ||
          particleDirections[i].location.y < 0
        ) {
          particleDirections[i].velocity.y = -particleDirections[i].velocity.y;
        }
        const dx: number = particleDirections[i].velocity.x * speed;
        const dy: number = particleDirections[i].velocity.y * speed;
        particleDirections[i].location.x +=
          particleDirections[i].velocity.x * speed;
        particleDirections[i].location.y +=
          particleDirections[i].velocity.y * speed;
        renderingContex.beginPath();
        renderingContex.arc(
          particleDirections[i].location.x,
          particleDirections[i].location.y,
          3,
          0,
          Math.PI * 2
        );
        //renderingContex.strokeStyle = "cyan";
        //renderingContex.stroke();
        renderingContex.fill();
        renderingContex.closePath();
      }
    }, 0);
  }
  //});
  return (
    <>
      <div style={{ marginRight: "10px" }}>
        <div className="me-container" style={{ overflow: "hidden" }}>
          <h1 style={{ fontFamily: "sans-serif" }}>Jorden</h1>
          <h1>Rodriguez</h1>
          <button style={{ zIndex: "10" }}>4 years experience.</button>
          {/* <img src="/"></img> */}
          <div
            style={{
              position: "absolute",
              color: "rgb(50, 50, 50)",
              top: "225px",
            }}
          >
            <code>{"int main(){"}</code>
            <br></br>
            <code>{"std::vector<int> vec{1, 2, 3};"}</code>
            <br></br>
            <code>{"for(int i {0}; i < vec.len; i++){"}</code>
            <br></br>
            <code>{"std::cout << vec[i];"}</code>
            <br></br>
            <code>{"if(vec[i] > 1 && != 0){"}</code>
            <br></br>
            <code>{"if(vec[i] > 450 || i != 64){"}</code>
            <br></br>
            <code>{"if(vec[i] > 1 && != 0){"}</code>
            <br></br>
            <code>{"if(vec[1] > 1 && != 0){"}</code>
            <br></br>
            <code>{"sizeof(long long) > sizeof(double)"}</code>
            <br></br>
            <code>{"while(vec[i] > 10 && vec[i] === 10)"}</code>
            <br></br>
            <code>{"static_cast<float>(new unsigned int)"}</code>
            <br></br>
            <code>{"const signed int* c {new int[64]}"}</code>
            <br></br>
            <code>{"using namespace system{"}</code>
            <br></br>
            <code>{"[i](int e){ return e; }"}</code>
          </div>
          <iframe
            src="https://giphy.com/embed/ITRemFlr5tS39AzQUL"
            width="150"
            height="150"
          ></iframe>
          <span></span>
          <div style={{ marginTop: "-500px", marginLeft: "-160px" }}>
            <canvas
              id="bounceCanvas"
              width={1100}
              height={650}
              style={{ zIndex: "-10", border: "solid 2px cyan" }}
            ></canvas>
          </div>
        </div>
        <div className={"about-me-container"}>
          <div className="about-me">
            <h1>About Me</h1>
            <hr></hr>
            <p>
              I'm Jorden I specialize in web dev, custom and engine based
              graphical programming.
              {/* a self taught developer who loves computers! I love to demonstrate
          that with my skills! */}
            </p>
            <button
              onClick={() => {
                const el = document.getElementById("algo-vis");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              <span>recent projects</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Me;

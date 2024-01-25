import Head from "next/head";
import { GrGithub, GrGraphQl } from "react-icons/gr";
import Matrix from "@/dataStructures/Matrix";
//import { cMatrix } from "@/components/Board";
import {
  SiTypescript,
  SiNextdotjs,
  SiCss3,
  SiHtml5,
  SiPostgresql,
  SiReact,
  //SiMaytag,
} from "react-icons/si";
import { DiGithubAlt, DiGithubBadge, DiGithubFull } from "react-icons/di";
import { GrNode } from "react-icons/gr";
import Me from "@/components/Me";
import TextEditor from "@/components/TextEditor";
//import Link from "next/link";
import Grid from "@/components/Grid";
//import Board from "@/components/Board";
import { useEffect, useState } from "react";
import { mat4, glMatrix, vec3 } from "../gl-matrix";
import { createNoise3D } from "simplex-noise";
// import perlinNoise from "../perlin";
export default function Home() {
  let mouseX = 10;
  let mouseY = 100;
  const noise3D = createNoise3D();
  let cubePositions: Array<Array<Array<number>>> = [[[]]];
  for (let i = 0; i < 5; i++) {
    cubePositions[i] = new Array(5);
    for (let j = 0; j < 5; j++) {
      cubePositions[i][j] = new Array(5);
      for (let k = 0; k < 5; k++) {
        cubePositions[i][j][k] = noise3D(i, j, k);
      }
    }
  }
  var vertexShaderText = [
    "precision mediump float;",
    "",
    "attribute vec3 vertPosition;",
    "attribute vec3 vertColor;",
    "varying vec3 fragColor;",
    //"uniform mat4 model;",
    "uniform mat4 mWorld;",
    "uniform mat4 mView;",
    "uniform mat4 mProj;",
    "",
    "void main()",
    "{",
    "  fragColor = vertColor;",
    "  gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);",
    "}",
  ].join("\n");

  var fragmentShaderText = [
    "precision mediump float;",
    "",
    "varying vec3 fragColor;",
    "void main()",
    "{",
    //"  gl_FragColor = vec4(fragColor.x fragColor.y - 0.4, fragColor.z - 0.2, 1.0);",
    "}",
  ].join("\n");

  var vertexShaderText = [
    "precision mediump float;",
    "",
    "attribute vec3 vertPosition;",
    "attribute vec3 vertColor;",
    "varying vec3 fragColor;",
    "varying vec3 fragPos;",
    "uniform mat4 mWorld;",
    "uniform mat4 mView;",
    "uniform mat4 mProj;",
    "",
    "void main()",
    "{",
    "  fragColor = vertColor;",
    "  gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);",
    "  fragPos = gl_Position.xyz ;",
    "}",
  ].join("\n");

  var fragmentShaderText = [
    "precision mediump float;",
    "",
    "varying vec3 fragColor;",
    "varying vec3 fragPos;",
    "uniform vec3 mousePos;",
    "void main()",
    "{",
    "float dist = sqrt((pow((fragPos.x - mousePos.x), 2.0)) + (pow((fragPos.y - mousePos.y), 2.0) ));",
    //"vec3 lightColor = vec3(0.0, 0.6, 0.7);",
    "vec3 lightColor = vec3(fragPos.x * 0.2, fragPos.y * 0.3, 0.75);",
    "float ambientStrength = 0.001;",
    "vec3 ambient = ambientStrength * lightColor;",
    "vec3 lightPos = vec3(mousePos.x * 3.0, mousePos.y * 2.0, 0);",
    "vec3 lightDir = normalize(fragPos - lightPos);",
    "float diff = max(dot(fragPos, lightDir), 0.0);",
    "vec3 diffuse = diff * lightColor;",
    " float specularStrength = 0.5;",
    "vec3 viewDir = normalize(mousePos - fragPos);",
    "vec3 reflectDir = reflect(-lightDir, fragPos);",
    "float spec = pow(max(dot(float(viewDir), float(reflectDir)), 0.0), 126.0);",
    "vec3 specular = specularStrength * spec * lightColor;",
    "vec3 final = (diffuse + ambient) * lightColor;",
    "  gl_FragColor = vec4(final, 0.2);",
    "  //gl_FragColor = vec4(fragColor.x - 0.2, fragColor.y - 0.3, fragColor.z + 0.2, 1.0);",
    "}",
  ].join("\n");

  var InitDemo = function () {
    var canvas: any = document.getElementById("game-surface");
    var gl: WebGLRenderingContext = canvas.getContext("webgl");

    if (!gl) {
      console.log("WebGL not supported, falling back on experimental-webgl");
      gl = canvas.getContext("experimental-webgl");
    }

    if (!gl) {
      alert("Your browser does not support WebGL");
    }

    gl.clearColor(0.85, 0.85, 0.85, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);

    var vertexShader: WebGLShader = gl.createShader(gl.VERTEX_SHADER)!;
    var fragmentShader: WebGLShader = gl.createShader(gl.FRAGMENT_SHADER)!;

    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error(
        "ERROR compiling vertex shader!",
        gl.getShaderInfoLog(vertexShader)
      );
      return;
    }

    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error(
        "ERROR compiling fragment shader!",
        gl.getShaderInfoLog(fragmentShader)
      );
      return;
    }

    var program: WebGLProgram = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("ERROR linking program!", gl.getProgramInfoLog(program));
      return;
    }
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
      console.error("ERROR validating program!", gl.getProgramInfoLog(program));
      return;
    }
    var boxVertices: Array<number> = [
      -1.0, 1.0, -1.0, 0.5, 0.5, 0.5, -1.0, 1.0, 1.0, 0.5, 0.5, 0.5, 1.0, 1.0,
      1.0, 0.5, 0.5, 0.5, 1.0, 1.0, -1.0, 0.5, 0.5, 0.5,

      -1.0, 1.0, 1.0, 0.75, 0.25, 0.5, -1.0, -1.0, 1.0, 0.75, 0.25, 0.5, -1.0,
      -1.0, -1.0, 0.75, 0.25, 0.5, -1.0, 1.0, -1.0, 0.75, 0.25, 0.5,

      1.0, 1.0, 1.0, 0.25, 0.25, 0.75, 1.0, -1.0, 1.0, 0.25, 0.25, 0.75, 1.0,
      -1.0, -1.0, 0.25, 0.25, 0.75, 1.0, 1.0, -1.0, 0.25, 0.25, 0.75,

      1.0, 1.0, 1.0, 1.0, 0.0, 0.15, 1.0, -1.0, 1.0, 1.0, 0.0, 0.15, -1.0, -1.0,
      1.0, 1.0, 0.0, 0.15, -1.0, 1.0, 1.0, 1.0, 0.0, 0.15,

      1.0, 1.0, -1.0, 0.0, 1.0, 0.15, 1.0, -1.0, -1.0, 0.0, 1.0, 0.15, -1.0,
      -1.0, -1.0, 0.0, 1.0, 0.15, -1.0, 1.0, -1.0, 0.0, 1.0, 0.15,

      -1.0, -1.0, -1.0, 0.5, 0.5, 1.0, -1.0, -1.0, 1.0, 0.5, 0.5, 1.0, 1.0,
      -1.0, 1.0, 0.5, 0.5, 1.0, 1.0, -1.0, -1.0, 0.5, 0.5, 1.0,
    ];

    var boxIndices = [
      // Top
      0, 1, 2, 0, 2, 3,

      // Left
      5, 4, 6, 6, 4, 7,

      // Right
      8, 9, 10, 8, 10, 11,

      // Front
      13, 12, 14, 15, 14, 12,

      // Back
      16, 17, 18, 16, 18, 19,

      // Bottom
      21, 20, 22, 22, 20, 23,
    ];

    var boxVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(boxVertices),
      gl.STATIC_DRAW
    );

    var boxIndexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(boxIndices),
      gl.STATIC_DRAW
    );

    var positionAttribLocation = gl.getAttribLocation(program, "vertPosition");
    var colorAttribLocation = gl.getAttribLocation(program, "vertColor");
    gl.vertexAttribPointer(
      positionAttribLocation, 
      3, 
      gl.FLOAT, 
      false,
      6 * Float32Array.BYTES_PER_ELEMENT, 
      0 
    );
    gl.vertexAttribPointer(
      colorAttribLocation, 
      3, 
      gl.FLOAT, 
      false,
      6 * Float32Array.BYTES_PER_ELEMENT,
      3 * Float32Array.BYTES_PER_ELEMENT 
    );

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);

    gl.useProgram(program);

    var matWorldUniformLocation = gl.getUniformLocation(program, "mWorld");
    var matViewUniformLocation = gl.getUniformLocation(program, "mView");
    var matProjUniformLocation = gl.getUniformLocation(program, "mProj");
    var mousePos = gl.getUniformLocation(program, "mousePos");

    var worldMatrix = new Float32Array(16);
    var viewMatrix = new Float32Array(16);
    var projMatrix = new Float32Array(16);
    mat4.identity(worldMatrix);
    mat4.lookAt(viewMatrix, [0, 0, -8], [0, 0, 0], [0, 1, 0]);
    mat4.perspective(
      projMatrix,
      glMatrix.toRadian(45),
      canvas.width / canvas.height,
      0.1,
      1000.0
    );

    gl.uniformMatrix4fv(matWorldUniformLocation, false, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, false, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, false, projMatrix);

    var xRotationMatrix = new Float32Array(16);
    var yRotationMatrix = new Float32Array(16);

    var identityMatrix = new Float32Array(16);
    mat4.identity(identityMatrix);
    var angle = 0;
    const cubePos: Array<Float32Array> = [
      new Float32Array(1),
      new Float32Array(2),
      new Float32Array(3),
      new Float32Array(4),
      new Float32Array(5),
    ];
    var loop = function () {
      gl.clearColor(0.095, 0.095, 0.095, 1.0);
      gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
      angle = (performance.now() / 1000 / 6) * 2 * Math.PI;
      mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
      mat4.rotate(xRotationMatrix, identityMatrix, angle, [1, 0, 0]);
      mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);
      const translate = vec3.create();
      for (let i: number = 0; i < 5; i++) {
        mat4.translate(cubePos[i], worldMatrix, translate);

        vec3.set(translate, 0, 0, i + 3);
        gl.useProgram(program);
        gl.uniform3f(mousePos, mouseX, mouseY, 1);
        gl.uniformMatrix4fv(matWorldUniformLocation, false, worldMatrix);

        gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  };
  let sinCanvas: any;
  let context: CanvasRenderingContext2D;
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    InitDemo();
    setLoading(false);
    if (window.innerWidth > 390 && window.innerWidth < 450) {
      const board = document.getElementById("board");
      const p = document.getElementById("proj-p");
      if (p) {
        document.getElementById("git-btn")!.style.marginLeft = "-100px";
        p.style.width = "160px";
        p.style.marginLeft = "10px";
      }
      if (!!board) {
        document.getElementById("chess-info")!.style.right = "10px";
        board.style.marginRight = "275px";
      }
    }
    if (window.innerWidth > 420 && window.innerWidth < 440) {
      const board = document.getElementById("board");
      const p = document.getElementById("proj-p");
      if (p) {
        document.getElementById("git-btn")!.style.marginLeft = "-100px";
        p.style.width = "160px";
        p.style.marginLeft = "10px";
      }
      if (!!board) {
        document.getElementById("chess-info")!.style.right = "0px";
        board.style.marginRight = "275px";
      }
    }
    window.addEventListener("mousemove", (e) => {
      mouseX = -e.clientX;
      mouseY = e.clientY;
    });
  }, [loading]);
    let wave = 0;
  useEffect(() => {
    sinCanvas = document.getElementById("sin-canvas")!;
    context = sinCanvas.getContext("2d")!;
    context.lineWidth = 1;
    setInterval(() => {
      context.clearRect(0, 0, sinCanvas!.width, sinCanvas!.height);
      for (let i = 0; i < 500; i += 1) {
        wave += 0.00005;
        context.beginPath();
        // context.arc(
        //   i * 2,
        //   100 - Math.sin(Math.PI * i * 0.09) * 0.5 *
        //   Math.sin(Math.PI * i * 0.01 + wave) * 70,
        //   1,
        //   0,
        //   Math.PI * 2
        // );
        context.lineTo(
          i * 2,
          100 -
            Math.sin(Math.PI * i * 0.05) *
              -mouseY *
              0.001 *
              Math.sin(Math.PI * i * 0.01 + wave) *
              70
        );
        //context.strokeStyle = `rgb(${0} ${mouseY * 0.3} ${mouseY * 0.5})`;
        //context.fillStyle = `rgb(${0} ${mouseY * 0.3} ${mouseY * 0.5})`;
        context.closePath();
        context.stroke();
       // context.fill();
      }
    }, 30);
  });
  return (
    <>
      <Head>
        <title>Jorden Rodriguez</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="canvas-container">
        <canvas
          style={{
            zIndex: -10,
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            margin: "0px",
            padding: "0px",
          }}
          id="game-surface"
          //ref={canvas}
          width={"400px"}
          height={"400px"}
        ></canvas>
      </div>
      <Me />

      <div className="logo-container">
        <span className="span-bar1"></span>
        <div className="logos">
          <SiTypescript style={{ color: "#007ACC" }} />
          <GrGraphQl style={{ color: "#E10098" }} />
          <SiReact style={{ color: "#61DBFB" }} />
          <GrNode style={{ color: "lightgreen" }} />
          <SiNextdotjs style={{ color: "white" }} />
          <SiCss3 style={{ color: "#2965f1" }} />
          <SiHtml5 style={{ color: "#f06529" }} />
          <SiPostgresql style={{ color: " #0064a5" }} />
        </div>
        <span className="span-bar2"></span>
      </div>

      <p style={{ color: "grey", fontWeight: "200", marginTop: "45px" }}>
        recent projects
      </p>
      <div
        className="proj-con"
        style={{
          borderRadius: "10px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          className="d1"
          style={{
            padding: "30px",
          }}
        >
          <div className="projects-container">
            <TextEditor />
          </div>
        </div>
        <div
          className="d2"
          style={{
            padding: "30px",
          }}
        >
          <div>
            <div style={{ display: "block" }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div
                  style={{
                    transition: "0.6s",
                    textAlign: "center",
                    width: "3px",
                    height: "350px",
                    background: "linear-gradient(0deg,cyan,#181818)",
                  }}
                ></div>
              </div>
              <div
                style={{
                  width: "3px",
                  height: "100px",
                  background: "linear-gradient(to bottom,cyan, #181818)",
                }}
              ></div>
            </div>
          </div>
        </div>
        <div
          className="d3"
          style={{
            padding: "30px",
            width: "420px",
          }}
        >
          <div style={{ display: "block" }}>
            <h1
              style={{ fontSize: "40px", fontWeight: "200", textAlign: "left" }}
            >
              projects
            </h1>
            <hr
              style={{ backgroundColor: "grey", border: "solid 1px grey" }}
            ></hr>
            <p style={{ width: "350px", fontWeight: "100" }}>
              These are just two of my recent projects. All my projects all
              packed with all sorts of tech from Typescript to C++ theres
              something for everyone! feel free to browse the rest on GitHub!
              Thank you!
            </p>
            <a>
              <DiGithubBadge
                style={{
                  fontSize: "105px",
                  color: "lightseagreen",
                }}
              />
            </a>
          </div>
        </div>
      </div>
      {/* </div> */}
      <h1
        id="algo-vis"
        style={{
          margin: "0px",
          fontWeight: "100",
          color: "white",
          marginBottom: "15px",
        }}
      >
        algorithm visualizer
      </h1>
      <div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Grid matrix={new Matrix(20, 40)} />
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            className="wave-container"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              width: "50%",
            }}
          >
            <p
              style={{
                fontWeight: "100",
                fontSize: "20px",
                marginRight: "35px",
              }}
            >
              src
            </p>
            <hr style={{ marginBottom: "-10px", border: "solid 1px " }}></hr>
            <DiGithubFull style={{ fontSize: "63px", color: "cyan" }} />
          </div>
        </div>
        <hr style={{ width: "75%", border: "Solid 1px" }}></hr>
      </div>
      <div
        style={{
          width: "100%",
          zIndex: "-100",
          margin: "0px",
          padding: "0px",
          //overflow: "hidden",
        }}
      >
        <canvas
          style={{ width: "100%" }}
          height={200}
          width={1000}
          id="sin-canvas"
        ></canvas>
      </div>

      <div className="jr-footer" style={{ position: "relative", top: "600px" }}>
        <hr style={{ border: "solid 1px rgb(18, 18, 18)" }}></hr>
        <img
          style={{
            width: "85px",
            height: "85px",
            padding: "0px",
            marginTop: "-10px",
          }}
          src="/jr.png"
        ></img>
      </div>
    </>
  );
}

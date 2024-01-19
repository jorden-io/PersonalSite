import Head from "next/head";
import { GrGithub, GrGraphQl } from "react-icons/gr";
import Matrix from "@/dataStructures/Matrix";
import { cMatrix } from "@/components/Board";
import {
  SiTypescript,
  SiNextdotjs,
  SiCss3,
  SiHtml5,
  SiPostgresql,
  SiReact,
  SiMaytag,
} from "react-icons/si";
import { DiGithubAlt, DiGithubBadge, DiGithubFull } from "react-icons/di";
import { GrNode } from "react-icons/gr";
import Me from "@/components/Me";
import TextEditor from "@/components/TextEditor";
import Link from "next/link";
import Grid from "@/components/Grid";
import Board from "@/components/Board";
import { useEffect, useState } from "react";
import { mat4, glMatrix, vec3 } from "../gl-matrix";
import { createNoise3D } from "simplex-noise";
import { Gallery } from "react-grid-gallery";
import perlinNoise from "../perlin";
const images = [
  {
    src: "/mountain.png",
    width: 320,
    height: 174,
  },
  {
    src: "/land.png",
    width: 100,
    height: 50,
  },
  {
    src: "/bluespace.png",
    width: 500,
    height: 250,
  },
  {
    src: "/wire.png",
    width: 250,
    height: 200,
  },
  {
    src: "/donut.png",
    width: 320,
    height: 174,
  },
  {
    src: "/colorf.png",
    width: 320,
    height: 174,
  },
  {
    src: "/tess_example.png",
    width: 320,
    height: 174,
  },
  {
    src: "/water.jpeg",
    width: 320,
    height: 174,
  },
  {
    src: "/rainbow.jpeg",
    width: 320,
    height: 174,
  },
  {
    src: "cloth.jpeg",
    width: 320,
    height: 212,
  },

  {
    src: "space.jpeg",
    width: 320,
    height: 212,
  },
  {
    src: "red.png",
    width: 500,
    height: 250,
  },
];
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

    //
    // Create shaders
    //
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
      // X, Y, Z           R, G, B
      // Top
      -1.0, 1.0, -1.0, 0.5, 0.5, 0.5, -1.0, 1.0, 1.0, 0.5, 0.5, 0.5, 1.0, 1.0,
      1.0, 0.5, 0.5, 0.5, 1.0, 1.0, -1.0, 0.5, 0.5, 0.5,

      // Left
      -1.0, 1.0, 1.0, 0.75, 0.25, 0.5, -1.0, -1.0, 1.0, 0.75, 0.25, 0.5, -1.0,
      -1.0, -1.0, 0.75, 0.25, 0.5, -1.0, 1.0, -1.0, 0.75, 0.25, 0.5,

      // Right
      1.0, 1.0, 1.0, 0.25, 0.25, 0.75, 1.0, -1.0, 1.0, 0.25, 0.25, 0.75, 1.0,
      -1.0, -1.0, 0.25, 0.25, 0.75, 1.0, 1.0, -1.0, 0.25, 0.25, 0.75,

      // Front
      1.0, 1.0, 1.0, 1.0, 0.0, 0.15, 1.0, -1.0, 1.0, 1.0, 0.0, 0.15, -1.0, -1.0,
      1.0, 1.0, 0.0, 0.15, -1.0, 1.0, 1.0, 1.0, 0.0, 0.15,

      // Back
      1.0, 1.0, -1.0, 0.0, 1.0, 0.15, 1.0, -1.0, -1.0, 0.0, 1.0, 0.15, -1.0,
      -1.0, -1.0, 0.0, 1.0, 0.15, -1.0, 1.0, -1.0, 0.0, 1.0, 0.15,

      // Bottom
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
      positionAttribLocation, // Attribute location
      3, // Number of elements per attribute
      gl.FLOAT, // Type of elements
      false,
      6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
      0 // Offset from the beginning of a single vertex to this attribute
    );
    gl.vertexAttribPointer(
      colorAttribLocation, // Attribute location
      3, // Number of elements per attribute
      gl.FLOAT, // Type of elements
      false,
      6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
      3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    );

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);

    // Tell OpenGL state machine which program should be active.
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
      //canvas.clientWidth / canvas.clientHeight,
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
  useEffect(() => {
    sinCanvas = document.getElementById("sin-canvas")!;
    context = sinCanvas.getContext("2d")!;
    sinCanvas.width = "1000";
    let wave = 0;
    setInterval(() => {
      context.clearRect(0, 0, sinCanvas!.width, sinCanvas!.height);
      for (let i = 0; i < 500; i += 1) {
        wave += 0.00005;
        context.beginPath();
        context.arc(
          i * 2,
          100 -
            Math.sin(Math.PI * i * 0.05) *
              -mouseY *
              0.001 *
              Math.sin(Math.PI * i * 0.01 + wave) *
              70,
          5,
          0,
          Math.PI * 2
        );
        context.fillStyle = "cyan";
        context.closePath();
        context.fill();
        //context.stroke();
      }
    }, 50);
  }, []);
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
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            margin: "0px",
            padding: "0px",
          }}
          id="game-surface"
          //ref={canvas}
          width="400px"
          height="400px"
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

      {/* <div className="projects-container">
        <TextEditor />
        <div className="projects-info">
          <h1>Projects</h1>
          <hr style={{ border: "solid 1px rgb(18, 18, 18)" }}></hr>
          <p id="proj-p">
            These are just two of my recent projects.
            <br></br>
            All my projects all packed with all sorts of tech from
            <br></br>
            Typescript to C++ theres something for everyone!
            <br></br>
            feel free to browse the rest on GitHub!
            <br></br>
            Thank you!
          </p>
          <Link href={"https://github.com/jorden-io"}>
            <GrGithub
              id="git-btn"
              style={{
                fontSize: "50px",
                marginTop: "25px",
                textDecoration: "none",
                color: "white",
              }}
            />
          </Link>
        </div>
        <span className="line-span"></span>
        <span className="circle-span">
          <p
            style={{
              color: "white",
              fontWeight: "800",
              position: "relative",
              top: "-7px",
            }}
          >
            1
          </p>
        </span>
        <h2 id="algo-vis">algorithm visualizer</h2>
        <div className="grid-container">
          <Grid matrix={new Matrix(20, 40)} />
          <hr
            style={{
              position: "absolute",
              marginTop: "-45px",
              border: "solid 1px rgb(18, 18, 18)",
              width: "95%",
              transition: "1s",
            }}
          ></hr>
          <hr
            className="vert-hr"
            style={{
              position: "absolute",
              marginTop: "-44px",
              border: "none",
              padding: "1px",
              //border: "solid 1px rgb(18, 18, 18)",
              height: "30px",
              transition: "1s",
            }}
          ></hr>
          <p
            className="av-p"
            style={{ position: "absolute", marginTop: "-35px", left: "150px" }}
          >
            speaks for itself, src here:
          </p>
          <Link
            className="av-git-link"
            href={"https://github.com/jorden-io/PathFindVisualizer"}
          >
            <DiGithubFull
              style={{
                position: "absolute",
                marginTop: "-48px",
                fontSize: "50px",
                right: "200px",
                color: "cyan",
              }}
            />
          </Link>
          <button style={{ zIndex: "9" }}>
            <Link href={""}>{/* <BsFileEarmarkCode /></Link>
          </button>
        </div>
      </div> */}

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
                    textAlign: "center",
                    width: "3px",
                    height: "420px",
                    background: "linear-gradient(0deg,cyan,#181818)",
                  }}
                ></div>
              </div>
              <div
                style={{
                  padding: "20px",
                  borderRadius: "100px",
                  background: "linear-gradient(to bottom,cyan, #36c933)",
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
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <canvas height={500} width={500} id="sin-canvas"></canvas>
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

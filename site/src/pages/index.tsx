// @ts-nocheck
import Head from "next/head";
import { GrGithub, GrGraphQl } from "react-icons/gr";
import Matrix from "@/dataStructures/Matrix";
import {
  SiTypescript,
  SiNextdotjs,
  SiCss3,
  SiHtml5,
  SiPostgresql,
  SiReact,
} from "react-icons/si";
import { GiBrain } from "react-icons/gi";
import { CiTimer } from "react-icons/ci";
import { DiGithubAlt, DiGithubBadge, DiGithubFull } from "react-icons/di";
import { GrNode } from "react-icons/gr";
import Me from "@/components/Me";
import TextEditor from "@/components/TextEditor";
import Grid from "@/components/Grid";
import { useEffect, useState } from "react";
import { mat4, glMatrix, vec3, set } from "../gl-matrix";
import { createNoise3D } from "simplex-noise";
import Computer from "@/components/Compueter";
import FrogChats from "@/components/FrogChats";
import Globe from "@/components/Globe";
export default function Home() {
  let mouseX = 10;
  let mouseY = 100;
  //const noise3D = createNoise3D();
  //let cubePositions: Array<Array<Array<number>>> = [[[]]];
  // for (let i = 0; i < 5; i++) {
  //   cubePositions[i] = new Array(5);
  //   for (let j = 0; j < 5; j++) {
  //     cubePositions[i][j] = new Array(5);
  //     for (let k = 0; k < 5; k++) {
  //       cubePositions[i][j][k] = noise3D(i, j, k);
  //     }
  //   }
  // }
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
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    InitDemo();
    setLoading(false);
    window.addEventListener("mousemove", (e) => {
      mouseX = -e.clientX;
      mouseY = e.clientY;
    });
  }, [loading]);
  let wave = 0;
  useEffect(() => {
    //NEWW
    document.getElementById("close").onmousedown = function (e) {
      e.preventDefault();
      document.getElementById("info").style.display = "none";
      return false;
    };

    var MOUSE_INFLUENCE = 5,
      GRAVITY_X = 0,
      GRAVITY_Y = 0,
      MOUSE_REPEL = false,
      GROUPS = [10, 10, 10],
      GROUP_COLOURS = ["rgba(97,160,232"];

    window.requestAnimFrame =
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      };

    var fluid = (function () {
      var ctx,
        width,
        height,
        num_x,
        num_y,
        particles,
        grid,
        meta_ctx,
        threshold = 220,
        play = false,
        spacing = 55,
        radius = 150,
        limit = radius * 0.66,
        textures,
        num_particles;

      var mouse = {
        down: false,
        x: 0,
        y: 0,
      };

      var process_image = function () {
        var imageData = meta_ctx.getImageData(0, 0, width, height),
          pix = imageData.data;

        for (var i = 0, n = pix.length; i < n; i += 4) {
          pix[i + 3] < threshold && (pix[i + 3] /= 6);
        }

        ctx.putImageData(imageData, 0, 0);
      };

      var run = function () {
        meta_ctx.clearRect(0, 0, width, height);

        for (var i = 0, l = num_x * num_y; i < l; i++) grid[i].length = 0;

        var i = num_particles;
        while (i--) particles[i].first_process();
        i = num_particles;
        while (i--) particles[i].second_process();

        process_image();

        if (mouse.down) {
          ctx.canvas.style.cursor = "none";

          ctx.fillStyle = "rgba(97, 160, 32, 0.05)";
          ctx.beginPath();
          ctx.arc(mouse.x, mouse.y, radius * MOUSE_INFLUENCE, 0, Math.PI * 2);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = "rgba(0, 90, 232, 0.8)";
          ctx.beginPath();
          ctx.arc(
            mouse.x,
            mouse.y,
            (radius * MOUSE_INFLUENCE) / 3,
            0,
            Math.PI * 2
          );
          ctx.closePath();
          ctx.fill();
        } else ctx.canvas.style.cursor = "default";
        if (play) requestAnimFrame(run);
      };

      var Particle = function (type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.px = x;
        this.py = y;
        this.vx = 0;
        this.vy = 0;
      };

      Particle.prototype.first_process = function () {
        var g =
          grid[
            Math.round(this.y / spacing) * num_x + Math.round(this.x / spacing)
          ];

        if (g) g.close[g.length++] = this;

        this.vx = this.x - this.px;
        this.vy = this.y - this.py;

        if (mouse.down) {
          var dist_x = this.x - mouse.x;
          var dist_y = this.y - mouse.y;
          var dist = Math.sqrt(dist_x * dist_x + dist_y * dist_y);
          if (dist < radius * MOUSE_INFLUENCE) {
            var cos = dist_x / dist;
            var sin = dist_y / dist;
            this.vx += MOUSE_REPEL ? cos : -cos;
            this.vy += MOUSE_REPEL ? sin : -sin;
          }
        }

        this.vx += GRAVITY_X;
        this.vy += GRAVITY_Y;
        this.px = this.x;
        this.py = this.y;
        this.x += this.vx;
        this.y += this.vy;
      };

      Particle.prototype.second_process = function () {
        var force = 0,
          force_b = 0,
          cell_x = Math.round(this.x / spacing),
          cell_y = Math.round(this.y / spacing),
          close = [];

        for (var x_off = -1; x_off < 2; x_off++) {
          for (var y_off = -1; y_off < 2; y_off++) {
            var cell = grid[(cell_y + y_off) * num_x + (cell_x + x_off)];
            if (cell && cell.length) {
              for (var a = 0, l = cell.length; a < l; a++) {
                var particle = cell.close[a];
                if (particle != this) {
                  var dfx = particle.x - this.x;
                  var dfy = particle.y - this.y;
                  var distance = Math.sqrt(dfx * dfx + dfy * dfy);
                  if (distance < spacing) {
                    var m = 1 - distance / spacing;
                    force += Math.pow(m, 2);
                    force_b += Math.pow(m, 3) / 2;
                    particle.m = m;
                    particle.dfx = (dfx / distance) * m;
                    particle.dfy = (dfy / distance) * m;
                    close.push(particle);
                  }
                }
              }
            }
          }
        }

        force = (force - 3) * 0.5;

        for (var i = 0, l = close.length; i < l; i++) {
          var neighbor = close[i];

          var press = force + force_b * neighbor.m;
          if (this.type != neighbor.type) press *= 0.35;

          var dx = neighbor.dfx * press * 0.5;
          var dy = neighbor.dfy * press * 0.5;

          neighbor.x += dx;
          neighbor.y += dy;
          this.x -= dx;
          this.y -= dy;
        }

        if (this.x < limit) this.x = limit;
        else if (this.x > width - limit) this.x = width - limit;

        if (this.y < limit) this.y = limit;
        else if (this.y > height - limit) this.y = height - limit;

        this.draw();
      };

      Particle.prototype.draw = function () {
        var size = radius * 2;

        meta_ctx.drawImage(
          textures[this.type],
          this.x - radius,
          this.y - radius,
          size,
          size
        );
      };

      return {
        init: function (canvas, w, h) {
          particles = [];
          grid = [];
          close = [];
          textures = [];

          var canvas = document.getElementById(canvas);
          ctx = canvas.getContext("2d");
          canvas.height = h || window.innerHeight;
          canvas.width = w || window.innerWidth;
          width = canvas.width;
          height = canvas.height;

          var meta_canvas = document.createElement("canvas");
          meta_canvas.width = width;
          meta_canvas.height = height;
          meta_ctx = meta_canvas.getContext("2d");

          for (var i = 0; i < GROUPS.length; i++) {
            var colour;

            if (GROUP_COLOURS[i]) {
              colour = GROUP_COLOURS[i];
            } else {
              colour = "hsla(" + Math.round(Math.random() * 360) + ", 70%, 50%";
            }

            textures[i] = document.createElement("canvas");
            textures[i].width = radius * 2;
            textures[i].height = radius * 2;
            var nctx = textures[i].getContext("2d");

            var grad = nctx.createRadialGradient(
              radius,
              radius,
              1,
              radius,
              radius,
              radius
            );

            grad.addColorStop(0, colour + ",1)");
            grad.addColorStop(1, colour + ",0)");
            nctx.fillStyle = grad;
            nctx.beginPath();
            nctx.arc(radius, radius, radius, 0, Math.PI * 2, true);
            nctx.closePath();
            nctx.fill();
          }

          canvas.onmousedown = function (e) {
            mouse.down = true;
            return false;
          };

          canvas.onmouseup = function (e) {
            mouse.down = false;
            return false;
          };

          canvas.onmousemove = function (e) {
            var rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
            return false;
          };

          num_x = Math.round(width / spacing) + 1;
          num_y = Math.round(height / spacing) + 1;

          for (var i = 0; i < num_x * num_y; i++) {
            grid[i] = {
              length: 0,
              close: [],
            };
          }

          for (var i = 0; i < GROUPS.length; i++) {
            for (var k = 0; k < GROUPS[i]; k++) {
              particles.push(
                new Particle(
                  i,
                  radius + Math.random() * (width - radius * 2),
                  radius + Math.random() * (height - radius * 2)
                )
              );
            }
          }

          num_particles = particles.length;

          play = true;
          run();
        },

        stop: function () {
          play = false;
        },
      };
    })();
    setTimeout(() => {
      //fluid.init("c", screen.width, 750);
      //document.getElementById("c")!.style.width = "72rem";
      setTimeout(() => {
        //GRAVITY_Y = 0.4;
      }, 4000);
    }, 4000);
  });
  // AUCH NUE
  // useEffect(() => {
  //   const card = document.getElementById("hero-card");
  //   let hover = false;

  //   card.addEventListener("mouseenter", (e) => {
  //     hover = true;
  //   });

  //   card.addEventListener("mouseleave", (e) => {
  //     hover = false;
  //   });

  //   let rect = card.getBoundingClientRect();
  //   let anchorX = rect.left + rect.width / 2;
  //   let anchorY = rect.top + rect.height / 2;

  //   function onChange() {
  //     rect = card.getBoundingClientRect();
  //     anchorX = rect.left + rect.width / 2;
  //     anchorY = rect.top + rect.height / 2;
  //   }

  //   document.body.addEventListener("resize", onChange);
  //   window.addEventListener("resize", onChange);
  //   document.addEventListener("resize", onChange);
  //   document.addEventListener("scroll", onChange);

  //   document.addEventListener("mousemove", (e) => {
  //     if (hover) {
  //       const mouseX = e.clientX;
  //       const mouseY = e.clientY;

  //       const angleRad = angle(mouseX, mouseY, anchorX, anchorY);
  //       const angleDeg = (angleRad * 180) / Math.PI;
  //       const rotateX = Math.sin(angleRad) * 10;
  //       const rotateY = Math.cos(angleRad) * 10;

  //       card.style.setProperty("--rotateX", rotateX + "deg");
  //       card.style.setProperty("--rotateY", -1 * rotateY + "deg");
  //       card.style.setProperty("--glow-rotation", angleDeg + "deg");
  //     } else {
  //       card.style.removeProperty("--rotateX");
  //       card.style.removeProperty("--rotateY");
  //       card.style.removeProperty("--glow-rotation");
  //     }
  //   });

  //   function angle(cx, cy, ex, ey) {
  //     const dy = ey - cy;
  //     const dx = ex - cx;

  //     const rad = Math.atan2(dy, dx);
  //     return rad;
  //   }
  // }, []);
  // AUCH NEU ENDLICH
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
            display: "none",
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
                    background: "linear-gradient(0deg,indigo,black)",
                  }}
                ></div>
              </div>
              <div
                style={{
                  width: "3px",
                  height: "100px",
                  background: "linear-gradient(to bottom, indigo, black)",
                }}
              ></div>
            </div>
          </div>
        </div>
        <div
          className="d3"
          style={{
            padding: "30px",
          }}
        >
          <div style={{ display: "block" }}>
            <h1
              style={{ fontSize: "40px", fontWeight: "200", textAlign: "left", color: "grey" }}
            >
              my goals
            </h1>
            <hr
              style={{ backgroundColor: "grey", border: "solid 1px grey" }}
            ></hr>
            <p style={{ width: "350px", fontWeight: "100" }}>
              In my free time I like to develop projects that I feel that can better the peoples lives. A way I love to do this is through communcation, wether thats through teaching languages, or allowing people to commucate in safe spaces. Here are just a few global projects ive made to help people communicate better and learn.
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

      <div style={{display: "flex", justifyContent: "center"}}>
      <div style={{display: "flex", justifyContent: "center"}}>
        <div style={{width: "100%"}}>

      <Globe />
        </div>
      </div>
      </div>
      <FrogChats />
      {/* </div> */}
      <h1
        id="algo-vis"
        style={{
          display: "none",
          marginTop: "50px",
          margin: "0px",
          fontWeight: "100",
          color: "white",
          marginBottom: "15px",
        }}
      >
        algorithm visualizer
      </h1>
      <div style={{display: "none"}}>
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
      ></div>

      {/* <div className="jr-footer" style={{ position: "relative", top: "600px" }}>
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
      </div> */}

      <div style={{marginTop: "40px"}} class="containere">
        <div
          style={{ overflow: "hidden" }}
          class=" transform-3d card"
          id="hero-card"
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "30px",
              gap: "85px",
            }}
          >
            <div
              className="four-square"
              id="four-square"
              style={{ display: "grid", placeItems: "center" }}
            >
              <iframe
                src="https://giphy.com/embed/YrkDFE5rqfiYOj1sjl"
                width="600"
                height="600"
                class="giphy-embed"
                style={{
                  border: "none",
                  borderRadius: "5px",
                }}
              ></iframe>
            </div>
            <div style={{ display: "block" }}>
              <h1 style={{ fontWeight: "100" }}>Get To Know Me</h1>
              <p
                style={{
                  color: "#d632f0",
                  fontWeight: "1000",
                }}
              >
                additional information
              </p>
              <hr style={{ border: "solid 1px white" }}></hr>
              <div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div
                    className="info-box"
                    style={{
                      fontWeight: "100",
                      width: "180px",
                      height: "180px",
                      background: "rgb(40 40 40)",
                      margin: "20px",
                      borderRadius: "5px",
                    }}
                  >
                    <p>I speak 3 languages!</p>
                    <hr style={{ border: "solid 1px grey" }}></hr>
                    <ul>
                      <li>English</li>
                      <li>Mandarin</li>
                      <li>German</li>
                    </ul>
                  </div>
                  <div
                    className="info-box"
                    style={{
                      fontWeight: "100",
                      width: "180px",
                      height: "180px",
                      background: "rgb(40 40 40)",
                      margin: "20px",
                      borderRadius: "5px",
                    }}
                  >
                    <p>7 years in the field</p>
                    <CiTimer style={{ fontSize: "80px" }} />
                  </div>
                </div>
                <br></br>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div
                    className="info-box"
                    style={{
                      fontWeight: "100",
                      width: "180px",
                      height: "180px",
                      background: "rgb(40 40 40)",
                      margin: "20px",
                      borderRadius: "5px",
                    }}
                  >
                    <p>Self Taught</p>
                    <GiBrain style={{ fontSize: "80px", color: "pink" }} />
                  </div>
                  <div
                    className="info-box"
                    style={{
                      fontWeight: "100",
                      width: "180px",
                      height: "180px",
                      background: "rgb(40 40 40)",
                      margin: "20px",
                      borderRadius: "5px",
                    }}
                  >
                    <p>Im an Artist!</p>
                    <hr style={{ border: "solid 1px grey" }}></hr>
                    <p>
                      I love all things Art <br></br> and creativity
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "400px",
        }}
      >
        {/* <canvas id="c"></canvas> */}
        <h1 style={{color: "cyan", fontWeight: "100"}}>JordenRodriguez.com</h1>
        <FrogChats />
      </div>
      <button style={{ display: "none" }} id="reset"></button>
      <div style={{ display: "none" }} id="info">
        <div id="top">
          <a id="close" href=""></a>
        </div>
      </div>

      {/* <Computer /> */}
      {/* NEW */}
    </>
  );
}
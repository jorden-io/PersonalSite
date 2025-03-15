import React, { useRef, useEffect } from "react";
import { mat4, mat3, vec3 } from "gl-matrix";

const FlyPhongSphere: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Set canvas to full window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);

    // ---------------------------
    // Shader Sources
    // ---------------------------
    const vsSource = `
      attribute vec3 aPosition;
      attribute vec3 aNormal;
      
      uniform mat4 uModelMatrix;
      uniform mat4 uViewMatrix;
      uniform mat4 uProjectionMatrix;
      uniform mat3 uNormalMatrix;
      
      varying vec3 vNormal;
      varying vec3 vFragPos;
      
      void main(){
        // Transform the vertex position to world space
        vFragPos = vec3(uModelMatrix * vec4(aPosition, 1.0));
        // Transform the normal to world space
        vNormal = normalize(uNormalMatrix * aNormal);
        // Final vertex position in clip space
        gl_Position = uProjectionMatrix * uViewMatrix * vec4(vFragPos, 1.0);
      }
    `;

    const fsSource = `
      precision mediump float;
      varying vec3 vNormal;
      varying vec3 vFragPos;
      
      uniform vec3 uLightPos;
      uniform vec3 uViewPos;
      uniform vec3 uLightColor;
      uniform vec3 uObjectColor;
      
      void main(){
        // Ambient component
        float ambientStrength = 0.1;
        vec3 ambient = ambientStrength * uLightColor;
        
        // Diffuse component
        vec3 norm = normalize(vNormal);
        vec3 lightDir = normalize(uLightPos - vFragPos);
        float diff = max(dot(norm, lightDir), 0.0);
        vec3 diffuse = diff * uLightColor;
        
        // Specular component
        float specularStrength = 0.5;
        vec3 viewDir = normalize(uViewPos - vFragPos);
        vec3 reflectDir = reflect(-lightDir, norm);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
        vec3 specular = specularStrength * spec * uLightColor;
        
        // Combine all lighting components
        vec3 result = (ambient + diffuse + specular);
        gl_FragColor = vec4(result * vNormal, 1.0);
      }
    `;

    // ---------------------------
    // Shader Compilation Helpers
    // ---------------------------
    function compileShader(source: string, type: number): WebGLShader | null {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl!.getShaderInfoLog(shader));
        gl!.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = compileShader(vsSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fsSource, gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    const shaderProgram = gl.createProgram();
    if (!shaderProgram) return;
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(shaderProgram));
      return;
    }
    gl.useProgram(shaderProgram);

    // ---------------------------
    // Get Attribute & Uniform Locations
    // ---------------------------
    const attribLocations = {
      position: gl.getAttribLocation(shaderProgram, "aPosition"),
      normal: gl.getAttribLocation(shaderProgram, "aNormal"),
    };
    const uniformLocations = {
      modelMatrix: gl.getUniformLocation(shaderProgram, "uModelMatrix"),
      viewMatrix: gl.getUniformLocation(shaderProgram, "uViewMatrix"),
      projectionMatrix: gl.getUniformLocation(
        shaderProgram,
        "uProjectionMatrix"
      ),
      normalMatrix: gl.getUniformLocation(shaderProgram, "uNormalMatrix"),
      lightPos: gl.getUniformLocation(shaderProgram, "uLightPos"),
      viewPos: gl.getUniformLocation(shaderProgram, "uViewPos"),
      lightColor: gl.getUniformLocation(shaderProgram, "uLightColor"),
      objectColor: gl.getUniformLocation(shaderProgram, "uObjectColor"),
    };

    // ---------------------------
    // Sphere Geometry Generation
    // ---------------------------
    interface SphereData {
      positions: number[];
      normals: number[];
      indices: number[];
    }

    function createSphere(
      radius: number,
      latBands: number,
      longBands: number
    ): SphereData {
      const positions: number[] = [];
      const normals: number[] = [];
      const indices: number[] = [];

      for (let lat = 0; lat <= latBands; lat++) {
        const theta = (lat * Math.PI) / latBands;
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);

        for (let lon = 0; lon <= longBands; lon++) {
          const phi = (lon * 2 * Math.PI) / longBands;
          const sinPhi = Math.sin(phi);
          const cosPhi = Math.cos(phi);

          const x = cosPhi * sinTheta;
          const y = cosTheta;
          const z = sinPhi * sinTheta;

          normals.push(x, y, z);
          positions.push(radius * x, radius * y, radius * z);
        }
      }

      for (let lat = 0; lat < latBands; lat++) {
        for (let lon = 0; lon < longBands; lon++) {
          const first = lat * (longBands + 1) + lon;
          const second = first + longBands + 1;
          indices.push(first, second, first + 1);
          indices.push(second, second + 1, first + 1);
        }
      }

      return { positions, normals, indices };
    }

    const sphere = createSphere(1, 30, 30);

    // ---------------------------
    // Create Buffers
    // ---------------------------
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(sphere.positions),
      gl.STATIC_DRAW
    );

    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(sphere.normals),
      gl.STATIC_DRAW
    );

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(sphere.indices),
      gl.STATIC_DRAW
    );

    // Enable vertex attributes
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(attribLocations.position);
    gl.vertexAttribPointer(attribLocations.position, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.enableVertexAttribArray(attribLocations.normal);
    gl.vertexAttribPointer(attribLocations.normal, 3, gl.FLOAT, false, 0, 0);

    // ---------------------------
    // Camera and Movement Setup
    // ---------------------------
    // Initial camera parameters
    let cameraPos = vec3.fromValues(0, 0, 5);
    let cameraFront = vec3.fromValues(0, 0, -1);
    const cameraUp = vec3.fromValues(0, 1, 0);
    let yaw = -90; // facing toward -Z initially
    let pitch = 0;
    const movementSpeed = 0.05;
    const mouseSensitivity = 0.1;
    const keys: { [key: string]: boolean } = {};

    // Convert degrees to radians helper
    const degToRad = (deg: number) => (deg * Math.PI) / 180;

    // Mouse movement handler (using pointer lock for relative movement)
    const handleMouseMove = (e: MouseEvent) => {
      const movementX = e.movementX || 0;
      const movementY = e.movementY || 0;

      yaw += movementX * mouseSensitivity;
      pitch -= movementY * mouseSensitivity;

      // Limit the pitch angle to avoid flipping
      if (pitch > 89) pitch = 89;
      if (pitch < -89) pitch = -89;

      const front = vec3.fromValues(
        Math.cos(degToRad(yaw)) * Math.cos(degToRad(pitch)),
        Math.sin(degToRad(pitch)),
        Math.sin(degToRad(yaw)) * Math.cos(degToRad(pitch))
      );
      vec3.normalize(cameraFront, front);
    };

    // Keyboard handlers
    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key] = false;
    };

    // Request pointer lock on click
    canvas.addEventListener("click", () => {
      canvas.requestPointerLock();
    });

    // Enable/disable mousemove listener based on pointer lock state
    const pointerLockChange = () => {
      if (document.pointerLockElement === canvas) {
        document.addEventListener("mousemove", handleMouseMove, false);
      } else {
        document.removeEventListener("mousemove", handleMouseMove, false);
      }
    };
    document.addEventListener("pointerlockchange", pointerLockChange, false);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // ---------------------------
    // Matrix Setup
    // ---------------------------
    const modelMatrix = mat4.create(); // Identity (sphere centered at origin)
    const viewMatrix = mat4.create();
    const projectionMatrix = mat4.create();
    const normalMatrix = mat3.create();
    mat4.perspective(
      projectionMatrix,
      degToRad(45),
      canvas.width / canvas.height,
      0.1,
      100
    );

    // ---------------------------
    // Render Loop
    // ---------------------------
    const animate = () => {
      // Update camera position based on keys
      const velocity = movementSpeed;
      const temp = vec3.create();
      if (keys["w"] || keys["W"]) {
        vec3.scale(temp, cameraFront, velocity);
        vec3.add(cameraPos, cameraPos, temp);
      }
      if (keys["s"] || keys["S"]) {
        vec3.scale(temp, cameraFront, velocity);
        vec3.sub(cameraPos, cameraPos, temp);
      }
      if (keys["a"] || keys["A"]) {
        vec3.cross(temp, cameraFront, cameraUp);
        vec3.normalize(temp, temp);
        vec3.scale(temp, temp, velocity);
        vec3.sub(cameraPos, cameraPos, temp);
      }
      if (keys["d"] || keys["D"]) {
        vec3.cross(temp, cameraFront, cameraUp);
        vec3.normalize(temp, temp);
        vec3.scale(temp, temp, velocity);
        vec3.add(cameraPos, cameraPos, temp);
      }

      // Compute view matrix using current camera parameters
      const center = vec3.create();
      vec3.add(center, cameraPos, cameraFront);
      mat4.lookAt(viewMatrix, cameraPos, center, cameraUp);
      mat3.normalFromMat4(normalMatrix, modelMatrix);

      // Clear canvas and enable depth testing
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);

      // Pass matrices to shaders
      gl.uniformMatrix4fv(uniformLocations.modelMatrix, false, modelMatrix);
      gl.uniformMatrix4fv(uniformLocations.viewMatrix, false, viewMatrix);
      gl.uniformMatrix4fv(
        uniformLocations.projectionMatrix,
        false,
        projectionMatrix
      );
      gl.uniformMatrix3fv(uniformLocations.normalMatrix, false, normalMatrix);

      // Set lighting uniforms
      const lightPos = vec3.fromValues(5, 5, 5);
      gl.uniform3fv(uniformLocations.lightPos, lightPos);
      gl.uniform3fv(uniformLocations.viewPos, cameraPos);
      gl.uniform3fv(uniformLocations.lightColor, [1.0, 1.0, 1.0]);
      gl.uniform3fv(uniformLocations.objectColor, [0.6, 0.2, 0.2]);

      // Draw the sphere using the index buffer
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.drawElements(
        gl.TRIANGLES,
        sphere.indices.length,
        gl.UNSIGNED_SHORT,
        0
      );

      requestAnimationFrame(animate);
    };
    animate();

    // ---------------------------
    // Cleanup on unmount
    // ---------------------------
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("pointerlockchange", pointerLockChange);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div>
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ width: "800px", height: "400px", boxShadow: "0px 0px 190px cyan", borderRadius: "5px" }}>
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%", border: "solid 1px cyan", borderRadius: "5px" }} />
      </div>
    </div>
    </div>
  );
};

export default FlyPhongSphere;

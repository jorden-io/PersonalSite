import "@/styles/globals.css";
import "../styles/main.css";
import "../styles/nav.css";
import "../styles/footer.css";
import "../styles/me.css";
import "../styles/contact.css";
import "../styles/new.css";
import type { AppProps } from "next/app";
import Wrapper from "@/components/Wrapper";
import Nav from "@/components/Nav";
import FlyPhongSphere from "@/components/WebGLWorld";
import { useEffect, useState } from "react";
import Head from "next/head";


export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
        <script src="https://unpkg.com/three@0.146.0/examples/js/controls/OrbitControls.js"></script>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            position: "absolute",
            padding: "10px",
            zIndex: "-10",
            background: "linear-gradient(to top, indigo, black)",
            width: "100%",
            height: "3650px",
          }}
        ></div>
      </div>
      <Nav />
      <Wrapper>
        <Component {...pageProps} />
      </Wrapper>
      {/* <Footer /> */}
    </>
  );
}

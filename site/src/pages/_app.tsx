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
  useEffect(() => {
let els = document.querySelectorAll("div")
// for(let i = 0; i < els.length; i++){
//   els[i].style.border = "solid 1px red"
document.body.style.transition = "2s"
document.body.style.background = "black"
// }
  }, [])
  return (
    <>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
        <script src="https://unpkg.com/three@0.146.0/examples/js/controls/OrbitControls.js"></script>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            position: "absolute",
            zIndex: "-10",
            //background: "linear-gradient(to top, indigo, black)",
            background: "black",
            width: "100%",
            // height: "3650px",
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

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

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            position: "absolute",
            padding: "10px",
            zIndex: "-10",
            background: "linear-gradient(to top, indigo, black)",
            width: "100%",
            height: "2600px",
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

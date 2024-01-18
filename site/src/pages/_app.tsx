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

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Nav />
      <Wrapper>
        <Component {...pageProps} />
      </Wrapper>
      {/* <Footer /> */}
    </>
  );
}

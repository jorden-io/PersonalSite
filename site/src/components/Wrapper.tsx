import React, { FC, ReactNode } from "react";
import Nav from "../components/Nav";
import Footer from "./Footer";
interface Props {
  children: ReactNode;
}
const Wrapper: FC<Props> = ({ children }) => {
  return (
    <>
      <div className="wrapper">
        <div className="children">{children}</div>
        {/* <Footer /> */}
      </div>
    </>
  );
};
export default Wrapper;

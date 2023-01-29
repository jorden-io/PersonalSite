import React, { FC } from "react";
interface Props {}
const Footer: FC<Props> = () => {
  return (
    <>
      <div className="bar-holder">
        <span className="bar"></span>
      </div>
      <div className="footer-container">
        <footer className="footer">footer</footer>
      </div>
    </>
  );
};
export default Footer;

import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
interface Props {}
const Nav: FC<Props> = () => {
  return (
    <>
      <div className="nav-container">
        {/* <Image
          src={"/favicon large.png"}
          alt="null"
          width={30}
          height={30}
        ></Image> */}
        <div className="routing-links">
          <Link href={"https://www.linkedin.com/in/jorden-rodriguez-834264242/"}>
            <FaLinkedin className="fa-linked-in" style={{fontSize: "25px", color: "#0077b5"}} />
          </Link>
          <Link style={{marginTop: "3px"}} href={"/"}>home</Link>
          <span className="span-bar1"></span>
          <Link href={"https://github.com/jorden-io"}>
          <FaGithub
            style={{
              fontSize: "25px",
              color: "white",
            }}
          />
          </Link>
          <span className="span-bar2"></span>
          <Link style={{marginTop: "3px"}} href={"/contact"}>contact</Link>
          <Link href={"https://twitter.com/jorden_io"}>
            <FaTwitter className="fa-twitter" style={{fontSize: "25px", color: "#1DA1F2"}}/>
          </Link>
        </div>
        {/* <div className="links">
          <a href="https://www.linkedin.com/in/jorden-rodriguez-834264242/">
            <FaLinkedin
              style={{ color: "#0077b5", fontSize: "15px", padding: "3px" }}
            />
          </a>
          <a href="https://twitter.com/jorden_io">
            <FaTwitter
              style={{ color: "#1DA1F2", fontSize: "15px", padding: "3px" }}
            />
          </a>
        </div> */}
      </div>
    </>
  );
};
export default Nav;

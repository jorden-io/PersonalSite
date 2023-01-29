import React, { FC } from "react";
import { AiOutlinePhone } from "react-icons/ai";
import { FaRegAddressCard } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
interface Props {}
const Contact: FC<Props> = () => {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          className="contact-container"
          style={{
            //boxShadow: "0px 0px 8px black",
            backgroundColor: "rgb(18, 18 ,18)",
            paddingBottom: "50px",
            marginTop: "10%",
            borderRadius: "3px",
            display: "flex",
            justifyContent: "center",
            width: "800px",
          }}
        >
          <div style={{ width: "700px" }}>
            <div style={{ padding: "10px" }}>
              <h2 style={{ color: "whitesmoke", fontWeight: "350" }}>Contacts</h2>
            </div>
            <div
              className="contact-info"
              style={{
                borderTop: "solid 1px black",
                padding: "10px",
                display: "flex",
                justifyContent: "center",
                gap: "0px",
              }}
            >
              <span>
                <button>
                  <AiOutlinePhone />
                </button>
                <h3>mobile cell</h3>
                <div>
                  <p>469-261-2315</p>
                </div>
              </span>
              <span>
                <button>
                  <FaRegAddressCard />
                </button>
                <h3>location</h3>
                <div>
                  <p>Dallas TX</p>
                </div>
              </span>
              <span>
                <button>
                  <MdOutlineMail />
                </button>
                <h3>email</h3>
                <div>
                  <p>jordenrodriguez1004@yahoo.com</p>
                </div>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <p style={{fontWeight: "200"}}>
          feel free to contact me any day mon-sun ill try my best to respond as fast as I can
          <br></br>
          and you're welcome to use my socials to contact me as well
        </p>
        <h3 style={{fontWeight: "300"}}>have a good day!</h3>
        <hr style={{border: "solid 1px rgb(18, 18, 18)", width: "200px", marginTop: "20px"}}></hr>
        <img style={{width: "100px"}} src="/jr.png"></img>
      </div>
    </>
  );
};
export default Contact;

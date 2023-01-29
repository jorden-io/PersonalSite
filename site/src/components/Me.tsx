import React, { FC } from "react";
interface Props {}
const Me: FC<Props> = () => {
  return (
    <>
      <div style={{marginRight: "10px"}}>
        <div className="me-container">
          <h1 style={{ fontFamily: "sans-serif" }}>Jorden</h1>
          <h1>Rodriguez</h1>
          <button style={{ zIndex: "10" }}>3 years experience </button>
          {/* <img src="/"></img> */}
          <div
            style={{
              position: "absolute",
              color: "rgb(50, 50, 50)",
              top: "225px",
            }}
          >
            <code>{"int main(){"}</code>
            <br></br>
            <code>{"std::vector<int> vec{1, 2, 3};"}</code>
            <br></br>
            <code>{"for(int i {0}; i < vec.len; i++){"}</code>
            <br></br>
            <code>{"std::cout << vec[i];"}</code>
            <br></br>
            <code>{"if(vec[i] > 1 && != 0){"}</code>
            <br></br>
            <code>{"if(vec[i] > 450 || i != 64){"}</code>
            <br></br>
            <code>{"if(vec[i] > 1 && != 0){"}</code>
            <br></br>
            <code>{"if(vec[1] > 1 && != 0){"}</code>
            <br></br>
            <code>{"sizeof(long long) > sizeof(double)"}</code>
            <br></br>
            <code>{"while(vec[i] > 10 && vec[i] === 10)"}</code>
            <br></br>
            <code>{"static_cast<float>(new unsigned int)"}</code>
            <br></br>
            <code>{"const signed int* c {new int[64]}"}</code>
            <br></br>
            <code>{"using namespace system{"}</code>
            <br></br>
            <code>{"[i](int e){ return e; }"}</code>
          </div>
          <iframe
            src="https://giphy.com/embed/ITRemFlr5tS39AzQUL"
            width="150"
            height="150"
          ></iframe>
          <span></span>
        </div>
        <div className="about-me">
          <h1>About Me</h1>
          <hr></hr>
          <p>
            Hi! Im Jorden, a developer who loves all things computers!
            from web dev to low level projects in c++ and even assembly.
            I hope you enjoy my latest projects, many more to come!
            {/* a self taught developer who loves computers! I love to demonstrate
          that with my skills! */}
          </p>
          <button onClick={() => {
            const el = document.getElementById("algo-vis");
            if(el){
                el.scrollIntoView({behavior: "smooth"})
            }
          }}>
            <span> recent projects</span>
          </button>
        </div>
      </div>
    </>
  );
};
export default Me;

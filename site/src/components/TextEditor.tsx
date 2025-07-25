import React, { FC } from "react";
interface Props {}
const TextEditor: FC<Props> = () => {
  return (
    <>
      <div className="editor-container">
        <section style={{background: "radial-gradient(rgb(40 20 50), black)", border: "solid 1px indigo", width: "550px"}} className="window">
          <div className="window-top">
            <div className="window__controls">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="window__title">index.html - JsCode</div>
          </div>
          <div className="window-main">
            <ol>
              <li>
                &lt;!<span className="text">doctype html</span>&gt;
              </li>
              <li>
                &lt;<span className="tag">html</span>&gt;
              </li>
              <br></br>
              <li>
                &nbsp;&nbsp;&lt;<span className="tag">head</span>&gt;
              </li>
              <li>
                &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="tag">title</span>
                &gt;<span className="text">App</span>&lt;
                <span className="tag">/title</span>&gt;{" "}
              </li>
              <li>
                &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="tag">link</span>{" "}
                <span className="attr">href</span>=
                <span className="val">"styles/style.css"</span>{" "}
                <span className="attr">rel</span>=
                <span className="val">"stylesheet"</span>&gt;
              </li>
              <li>
                &nbsp;&nbsp;&lt;/<span className="tag">head</span>&gt;
              </li>
              <br></br>
              <li>
                &nbsp;&nbsp;&lt;<span className="tag">body</span>&gt;
              </li>
              <li>
                &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="tag">h1</span>
                &gt;<span className="text">Hello, World!</span>&lt;
                <span className="tag">/h1</span>&gt;{" "}
              </li>
              <li>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span className="comment">&lt;!-- TODO --&gt;</span>
              </li>
              <li>
                &nbsp;&nbsp;&nbsp;&nbsp;&lt;
                <span className="tag">script</span>{" "}
                <span className="attr">src</span>=
                <span className="val">"scripts/script.ts</span>&gt;&lt;/
                <span className="tag">script</span>&gt;
              </li>
              <li>
                &nbsp;&nbsp;&lt;/<span className="tag">body</span>&gt;
              </li>
              <br></br>
              <li>
                &lt;/<span className="tag">html</span>&gt;
              </li>
            </ol>
          </div>
        </section>
      </div>
    </>
  );
};
export default TextEditor;

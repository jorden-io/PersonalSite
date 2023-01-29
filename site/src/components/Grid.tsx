import React, { FC, useEffect, useState } from "react";
import Matrix from "../dataStructures/Matrix";
import Node from "../dataStructures/Node";
interface Props {
  matrix: Matrix;
}
const Grid: FC<Props> = ({ matrix }) => {
  const [wallMode, setWallMode] = useState<boolean>(false);
  const [Speed, setSpeed] = useState<any>();
  const [startX, setStartX] = useState(4);
  const [startY, setStartY] = useState(10);
  const [desX, setDesX] = useState(15);
  const [desY, setDesY] = useState(29);
  const [loading, setLoading] = useState<boolean>(true);

  let q: Array<Node> = [];
  let n: number = 0;

  const breadthFirstNodeFind: Function = (
    snx: number,
    sny: number,
    dnx: number,
    dny: number,
    matrix: Matrix,
    queue: Array<Node>,
    iter: number,
    current?: Node
  ): void => {
    document.getElementById(`node-${snx}-${sny}`)!.style.backgroundColor =
      "cyan";
    document.getElementById(`node-${dnx}-${dny}`)!.style.backgroundColor =
      "cyan";
    const inter = setInterval(() => {
      const inter2 = setInterval(() => {
        iter++;
        queue.push(matrix.matrixGraph[snx][sny]);
        current = queue.shift()!;
        matrix.matrixGraph[dnx][dny].n_val = 5;
        if (current.c_col + current.c_row == dnx + dny - 1) {
          clearInterval(inter);
          clearInterval(inter2);
          setTimeout(() => {
            pathFind(snx, sny, dnx, dny);
          }, 1200);
          return;
        }
        if (current.back) {
          if (current.back!.n_val === 0) {
            if (!!!current.back!.wall) {
              document.getElementById(
                `node-${current.back!.c_col}-${current.back!.c_row}`
              )!.style.animation = "fadein 1s ease";
              queue.push(current.back!);
              current.back!.n_val = 1;
            }
          }
        }
        if (current.next) {
          if (current.next!.n_val === 0) {
            if (!!!current.next!.wall) {
              document.getElementById(
                `node-${current.next!.c_col}-${current.next!.c_row}`
              )!.style.animation = "fadein 1s ease";
              queue.push(current.next!);
              current.next!.n_val = 1;
            }
          }
        }
        if (current.up) {
          if (current.up!.n_val === 0) {
            if (!!!current.up!.wall) {
              document.getElementById(
                `node-${current.up!.c_col}-${current.up!.c_row}`
              )!.style.animation = "fadein 1s ease";
              queue.push(current.up!);
              current.up!.n_val = 1;
            }
          }
        }
        if (current.down) {
          if (current.down!.n_val === 0) {
            if (!!!current.down!.wall) {
              document.getElementById(
                `node-${current.down!.c_col}-${current.down!.c_row}`
              )!.style.animation = "fadein 1s ease";
              queue.push(current.down!);
              current.down!.n_val = 1;
            }
          }
        }
      });
      5;
    }, 5);
  };

  const pathFind: Function = (
    snx: number,
    sny: number,
    dnx: number,
    dny: number
  ): void => {
    let xmoves: number = 0;
    let ymoves: number = 0;
    const inter1 = setInterval(() => {
      if (dny > sny && xmoves < dnx - snx) {
        xmoves++;
        document.getElementById(
          `node-${snx + xmoves}-${sny + ymoves}`
        )!.style.backgroundColor = "cyan";
        if (matrix.matrixGraph[xmoves][ymoves].wall) {
          ymoves++;
        }
      }
      if (dnx > snx && ymoves < dny - sny) {
        ymoves++;
        if (
          xmoves >= dnx - snx &&
          matrix.matrixGraph[xmoves][ymoves] != matrix.matrixGraph[dnx][dny]
        ) {
          document.getElementById(
            `node-${snx + xmoves}-${sny + ymoves}`
          )!.style.backgroundColor = "cyan";
        }
      }
      if (xmoves + ymoves > 35) {
        clearInterval(inter1);
        return;
      }
    }, 50);
  };
  useEffect(() => {
    setLoading(false);
    const observer: IntersectionObserver = new IntersectionObserver((e) => {
      e.forEach((el) => {
        if (el.isIntersecting) {
          if (document.getElementById("hide")) {
            document.getElementById("hide")!.className = "show";
          }
          setTimeout(() => {
            breadthFirstNodeFind(startX, startY, desX, desY, matrix, q, n);
          }, 1000);
        }
      });
    });
    const hidden = document.querySelectorAll("#algo-vis");
    hidden.forEach((e) => {
      observer.observe(e);
    });
  }, [loading]);
  if (loading) {
    return <p>loading</p>;
  } else {
    return (
      <>
        <div id="hide" className="hide">
          <div
            className="grid"
            style={{
              boxShadow: "0px 0px 6px black",
              display: "grid",
              justifyContent: "center",
            }}
          >
            {matrix.matrixGraph.map((e, i) => {
              return (
                <div key={i} className="colums" style={{}}>
                  {e.map((se, si) => {
                    return (
                      <td
                      key={si}
                        id={`node-${se.c_col}-${se.c_row}`}
                        onMouseOver={() => {
                          if (wallMode) {
                            document.getElementById(
                              `node-${se.c_col}-${se.c_row}`
                            )!.style.background = "grey";
                            se.wall = true;
                          }
                        }}
                        onDoubleClick={(e) => {
                          if (!wallMode) {
                            document.getElementById(
                              `node-${se.c_col}-${se.c_row}`
                            )!.style.animation = "choose 0.2s ease-in";
                            e.currentTarget.style.backgroundColor = "indigo";
                            setStartX(se.c_col);
                            setStartY(se.c_row);
                          }
                        }}
                        onClick={(e) => {
                          if (!wallMode) {
                            e.currentTarget.style.backgroundColor = "white";
                            setDesX(se.c_col);
                            setDesY(se.c_row);
                          }
                        }}
                        style={{
                          transition: "1s",
                          cursor: "pointer",
                          border: "solid 1px black",
                          padding: "10px",
                          backgroundColor: "rgb(28, 28, 28)",
                          margin: "auto",
                        }}
                      ></td>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }
};
export default Grid;

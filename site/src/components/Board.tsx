import { Piece } from "@/dataStructures/piece";
import React, { FC, useEffect, useState } from "react";
export class cMatrix {
  cols: number = 8;
  rows: number = 8;
  container: Array<Array<Piece>> = [];
  constructor() {
    this.boardInit();
    this.pieceInit();
    this.initImgSrc(this);
  }
  public initImgSrc(matrix: cMatrix) {
    for (let y: number = 0; y < this.cols; y++) {
      for (let x: number = 0; x < this.rows; x++) {
        switch (matrix.container[y][x].pieceName) {
          case "P":
            if (matrix.container[y][x].white) {
              matrix.container[y][x].src =
                "https://upload.wikimedia.org/wikipedia/commons/0/04/Chess_plt60.png";
              break;
            } else {
              matrix.container[y][x].src =
                "https://upload.wikimedia.org/wikipedia/commons/c/cd/Chess_pdt60.png";
            }
            break;
          case "R":
            if (matrix.container[y][x].white) {
              matrix.container[y][x].src =
                "https://upload.wikimedia.org/wikipedia/commons/5/5c/Chess_rlt60.png";
              break;
            } else {
              matrix.container[y][x].src =
                "https://upload.wikimedia.org/wikipedia/commons/a/a0/Chess_rdt60.png";
            }
            break;
          case "k":
            if (matrix.container[y][x].white) {
              matrix.container[y][x].src =
                "https://upload.wikimedia.org/wikipedia/commons/2/28/Chess_nlt60.png";
              break;
            } else {
              matrix.container[y][x].src =
                "https://upload.wikimedia.org/wikipedia/commons/f/f1/Chess_ndt60.png";
            }
            break;
          case "B":
            if (matrix.container[y][x].white) {
              matrix.container[y][x].src =
                "https://upload.wikimedia.org/wikipedia/commons/9/9b/Chess_blt60.png";
              break;
            } else {
              matrix.container[y][x].src =
                "https://upload.wikimedia.org/wikipedia/commons/8/81/Chess_bdt60.png";
            }
            break;
          case "Q":
            if (matrix.container[y][x].white) {
              matrix.container[y][x].src =
                "https://upload.wikimedia.org/wikipedia/commons/4/49/Chess_qlt60.png";
              break;
            } else {
              matrix.container[y][x].src =
                "https://upload.wikimedia.org/wikipedia/commons/a/af/Chess_qdt60.png";
            }
            break;
          case "K":
            if (matrix.container[y][x].white) {
              matrix.container[y][x].src =
                "https://upload.wikimedia.org/wikipedia/commons/3/3b/Chess_klt60.png";
              break;
            } else {
              matrix.container[y][x].src =
                "https://upload.wikimedia.org/wikipedia/commons/e/e3/Chess_kdt60.png";
            }
            break;
        }
      }
    }
  }
  private boardInit() {
    for (let y: number = 0; y < this.cols; y++) {
      this.container[y] = [];
      for (let x: number = 0; x < this.rows; x++) {
        this.container[y][x] = new Piece();
        this.container[y][x].pieceName = "x";
        if (x > 5) this.container[y][x].white = false;
        if (x < 2) this.container[y][x].white = true;
        if (x % 2 === 0) {
          if (y % 2 === 0) {
            this.container[y][x].val = 0;
          } else {
            this.container[y][x].val = 1;
          }
        } else if (x % 2 >= 1) {
          if (y % 2 === 0) {
            this.container[y][x].val = 1;
          } else {
            this.container[y][x].val = 0;
          }
        }
      }
    }
  }
  public pieceInit() {
    this.container[0][0].pieceName = "R";
    this.container[7][0].pieceName = "R";
    this.container[7][0].pieceName = "R";
    this.container[6][0].pieceName = "k";
    this.container[1][0].pieceName = "k";
    this.container[2][0].pieceName = "B";
    this.container[5][0].pieceName = "B";
    this.container[4][0].pieceName = "K";
    this.container[3][0].pieceName = "Q";
    this.container[0][1].pieceName = "P";
    this.container[1][1].pieceName = "P";
    this.container[2][1].pieceName = "P";
    this.container[3][1].pieceName = "P";
    this.container[4][1].pieceName = "P";
    this.container[4][1].pieceName = "P";
    this.container[5][1].pieceName = "P";
    this.container[6][1].pieceName = "P";
    this.container[7][1].pieceName = "P";
    this.container[0][7].pieceName = "R";
    this.container[7][7].pieceName = "R";
    this.container[6][7].pieceName = "k";
    this.container[1][7].pieceName = "k";
    this.container[2][7].pieceName = "B";
    this.container[5][7].pieceName = "B";
    this.container[4][7].pieceName = "K";
    this.container[3][7].pieceName = "Q";
    this.container[0][6].pieceName = "P";
    this.container[1][6].pieceName = "P";
    this.container[2][6].pieceName = "P";
    this.container[3][6].pieceName = "P";
    this.container[4][6].pieceName = "P";
    this.container[5][6].pieceName = "P";
    this.container[6][6].pieceName = "P";
    this.container[7][6].pieceName = "P";
  }
}
interface Props {
  matrix: cMatrix;
}
const Board: FC<Props> = ({ matrix }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [startX, setStartX] = useState<number>();
  const [startY, setStartY] = useState<number>();
  const [desX, setDesX] = useState<number>();
  const [desY, setDesY] = useState<number>();
  const [currentPiece, setPiece] = useState<Piece>();
  useEffect(() => {
    setLoading(false);
    console.log(matrix);
  }, []);
  if (loading) {
    return <>loading</>;
  } else {
    return (
      <>
        <br></br>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "100px",
            marginTop: "550px",
            marginLeft: "600px",
          }}
        >
          <div
            id="board"
            className="board"
            style={{
              position: "absolute",
              margin: "5%",
              boxShadow: "0px 0px 8px black",
              border: "none",
            }}
          >
            {matrix.container.map((c, ci) => (
              <td key={ci} style={{ border: "none", padding: "0px" }}>
                {c.map((r, ri) => (
                  <p
                    key={ri}
                    id={`p-${ci}-${ri}`}
                    onClick={(e) => {
                      //r.movePiece(matrix, r, startY!, startX!, ci, ri);
                      setStartX(ri);
                      setStartY(ci);
                      setPiece(r);
                    }}
                    onDoubleClick={() => {
                      //r.checkAvailableMoves(matrix, r, ci, ri);
                      setStartX(ri);
                      setStartY(ci);
                      setPiece(undefined);
                    }}
                    style={{
                      cursor: "-webkit-grab",
                      border: r.val
                        ? "solid 2px rgb(28, 28, 28)"
                        : "solid 2px rgb(185, 185, 185)",
                      color:
                        r.pieceName === "x"
                          ? r.val % 2 != 0
                            ? "rgb(28, 28, 28)"
                            : "rgb(185, 185, 185)"
                          : r.white
                          ? "white"
                          : "black",
                      backgroundColor:
                        r.val === 1 ? "rgb(28, 28, 28)" : "rgb(185, 185, 185)",
                      padding: "10px",
                      margin: "0px",
                    }}
                  >
                    <img
                      style={{
                        width: "20px",
                        height: "20px",
                        border: "none",
                        visibility: r?.src ? "visible" : "hidden",
                      }}
                      src={r.src}
                    ></img>
                  </p>
                ))}
              </td>
            ))}
          </div>
        </div>
      </>
    );
  }
};
export default Board;

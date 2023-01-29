import Node from "./Node";
class Matrix {
  m_rows: number = 0;
  m_cols: number = 0;
  matrixGraph: Array<Array<Node>> = [];
  constructor(rows: number, cols: number) {
    this.m_rows = rows;
    this.m_cols = cols;
    for (let i: number = 0; i < rows; i++) {
      this.matrixGraph[i] = [];
      for (let j: number = 0; j < cols; j++) {
        this.m_rows = j;
        this.matrixGraph[i][j] = new Node(0, j, i, false);
      }
    }
    this.init();
  }
  public init = () => {
    for (let i: number = 0; i < 20; i++) {
      for (let j: number = 0; j < 40; j++) {
        this.matrixGraph[i][j].n_val = 0;
        this.matrixGraph[i][j].next = this.matrixGraph[i][j + 1];
        this.matrixGraph[i][j].back = this.matrixGraph[i][j - 1];
      }
      for (let i: number = 0; i < 20; i++) {
        for (let j: number = 0; j < 40; j++) {
          if (i <= 18) {
            this.matrixGraph[i][j].up = this.matrixGraph[i + 1][j];
          }
          if (i != 0) {
            this.matrixGraph[i][j].down = this.matrixGraph[i - 1][j];
          }
        }
      }
    }
  };
  public clearBoard() {}
}
export default Matrix;
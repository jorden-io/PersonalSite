class Node {
    n_val: number = 0;
    next?: Node;
    back?: Node;
    up?: Node;
    down?: Node;
    wall?: boolean;
    c_row!: number;
    c_col!: number;
    constructor(val: number, row: number, col: number, wall: boolean) {
      this.n_val = val;
      this.c_row = row;
      this.c_col = col;
      this.wall = wall;
    }
  }
  export default Node;
  
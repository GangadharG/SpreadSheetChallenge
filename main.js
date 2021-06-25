class Cell {
  constructor(address, formulaAST) {
    this.address = address;
    this.formulaAST = formulaAST;
  }
}
class NumberNode {
  constructor(value) {
    this.nodeType = "number";
    this.value = value;
  }
}
class FuncNode {
  constructor(funcName, funcArgs) {
    this.nodeType = "func";
    this.funcName = funcName;
    this.funcArgs = funcArgs;
  }
}
class CellRefNode {
  constructor(address) {
    this.nodeType = "ref";
    this.address = address;
  }
}

class Challenge {
  helper(spreadSheetCells) {
    if (spreadSheetCells && spreadSheetCells.length > 0) {
      // All NumberNodes Scenario
      let allNumberNodes = spreadSheetCells.every(
        (obj) => obj.formulaAST.nodeType === "number"
      );
      if (allNumberNodes) {
        console.log("NO CIRCULAR REFERENCES");
        return;
      }

      let refList = [];
      /* Cell in refList looks like
        { 
          key: "A1", // Address of the cell
          refTo: ["A2"] // Array of CellReferences
        }
      */
      for (let i = 0; i < spreadSheetCells.length; i++) {
        let cellFormula = spreadSheetCells[i].formulaAST;
        if (cellFormula.nodeType === "ref") {
          // CellRefNode
          let cellFormulaAddress = cellFormula.address;
          let ref = {
            key: spreadSheetCells[i].address,
            refTo: [cellFormulaAddress],
          };
          refList.push(ref);
        } else if (cellFormula.nodeType === "func") {
          // funcRefNode
          let cellFormulaFuncArgs = cellFormula.funcArgs;
          let ref = {
            key: spreadSheetCells[i].address,
            refTo: cellFormulaFuncArgs.map((cell) => cell.address),
          };
          refList.push(ref);
        }
      }

      // check for circularReferences in refList
      this.detectCircularRef(refList);
    } else {
      console.log("CELLS are empty");
    }
  }

  detectCircularRef(cellsArray) {
    console.log("---CellsArray--- start", cellsArray);
    let visitedAddresses = []; // Array of Addresses
    // Same Cell Address scenario
    let cellWithSameAddress = cellsArray.filter((cell) => {
      return cell.refTo.indexOf(cell.key) > -1;
    });
    if (cellWithSameAddress.length > 0) {
      console.log(
        "DETECTED CIRCULAR REFERENCE, CellAddress point to same cell's"
      );
      return;
    }

    for (let i = 0; i < cellsArray.length; i++) {
      let cell = cellsArray[i];
      visitedAddresses.push(cell.key);
      if (i !== 0) {
        for (let j = 0; j < cell.refTo.length; j++) {
          let cellRefTo = cell.refTo[j];
          if (visitedAddresses.indexOf(cellRefTo) > -1) {
            this.checkCircularRef(
              cellRefTo,
              cell.key,
              cellsArray,
              visitedAddresses
            );
          } /* else if (j === cell.refTo.length - 1) {
            console.log("NO CIRCULAR REFERENCE");
          } */
        }
      }
    }
    console.log("---CellsArray--- end");
  }

  checkCircularRef(refKey, parentKey, cellsArray, visitedAddresses) {
    let refToCell = cellsArray.find((cell) => cell.key === refKey);
    for (let i = 0; i < refToCell.refTo.length; i++) {
      let refKeyRef = refToCell.refTo[i];
      if (refKeyRef === parentKey) {
        console.log("DETECTED CIRCULAR REFERENCE");
      } else if (visitedAddresses.indexOf(refKeyRef) > -1) {
        this.checkCircularRef(
          refKeyRef,
          parentKey,
          cellsArray,
          visitedAddresses
        );
      }
    }
  }
}

let input1 = [
  { address: "A1", formulaAST: new NumberNode(2) },
  { address: "A2", formulaAST: new NumberNode(5) },
];

let input2 = [
  { address: "A1", formulaAST: new CellRefNode("A2") },
  { address: "A2", formulaAST: new CellRefNode("A3") },
  { address: "A3", formulaAST: new CellRefNode("A1") },
];

let input3 = [
  { address: "A1", formulaAST: new NumberNode(2) },
  { address: "A2", formulaAST: new NumberNode(5) },
  { address: "A3", formulaAST: new CellRefNode("A4") },
  {
    address: "A4",
    formulaAST: new FuncNode("add", [
      new CellRefNode("A1"),
      new CellRefNode("A2"),
      new CellRefNode("A3"),
    ]),
  },
];

let input4 = [];

let input5 = [
  { address: "A1", formulaAST: new CellRefNode("A4") },
  { address: "A2", formulaAST: new CellRefNode("A2") },
];

let challengeObj = new Challenge();
console.log("---Input1 helper method start---");
challengeObj.helper(input1);
console.log("---Input1 helper method end---");
console.log("================");
console.log("---Input2 helper method start---");
challengeObj.helper(input2);
console.log("---Input2 helper method end---");
console.log("================");
console.log("---Input3 helper method start---");
challengeObj.helper(input3);
console.log("---Input3 helper method end---");
console.log("================");
console.log("---Input4 helper method start---");
challengeObj.helper(input4);
console.log("---Input4 helper method end---");
console.log("================");
console.log("================");
console.log("---Input5 helper method start---");
challengeObj.helper(input5);
console.log("---Input5 helper method end---");
console.log("================");

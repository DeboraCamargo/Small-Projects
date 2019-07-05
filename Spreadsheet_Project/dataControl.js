let mainTableContent;

function initData(_rows, _cols){
    loadData();
    if(!mainTableContent){
        createOnlyDataTable(_rows, _cols);
    }
}

function createOnlyDataTable(_rows, _cols) {
    mainTableContent = new Array(_rows);
    for (let i_row = 0; i_row < mainTableContent.length; i_row++) {
        mainTableContent[i_row] = new Array(_cols);
        for (let i_col = 0; i_col < mainTableContent[i_row].length; i_col++) {
            mainTableContent[i_row][i_col] = "";
        }
    }
}

function setCellValue(_rows, _cols, _value) {
    mainTableContent[_rows][_cols] = _value;
}

function getCellValue(_rows, _cols) {
    return mainTableContent[_rows][_cols];
}

function getData() {
    let tempTable = new Array(mainTableContent.length);
    for (let i_row = 0; i_row < mainTableContent.length; i_row++) {
        tempTable[i_row] = new Array(mainTableContent[i_row].length);
        for (let i_col = 0; i_col < mainTableContent[i_row].length; i_col++) {
            if (isFormula(mainTableContent[i_row][i_col])) {
                tempTable[i_row][i_col] = excuteFormula(mainTableContent[i_row][i_col]);
            } else {
                tempTable[i_row][i_col] = mainTableContent[i_row][i_col];
            }
        }
    }

    return tempTable;
}

function isFormula(txtInputed) {
    return txtInputed.startsWith("=");
}

function isSumFormulaValid(formula) { 
    //Column lenth is being validated here in regex as well
   return  /=SUM\([A-J]\d+:[A-J]\d+\)/.test(formula);
}

function excuteFormula(formula) {
    if (formula.startsWith("=SUM")) {
      return executeSumFormula(formula);
    } else {
        return "Error 2";
    }
}

function executeSumFormula(formula) {
    if (!isSumFormulaValid(formula)) {
        return "Error 3";
    } else {
        //(Ax:By)
        let params = formula.substring(("=SUM(").length, formula.length - 1).split(":");

        //exemple E4:F10
        var startCol = getParamColum(params[0]); //A
        var startRow = getParamRow(params[0]); //x
        var endCol = getParamColum(params[1]); //A
        var endRow = getParamRow(params[1]); //x

        //in case the start cell > end cell it would cause a issue when doing the for looping
        if (startCol > endCol) {
            var temp = endCol;
            endCol = startCol;
            startCol = temp;
        }
        if (startRow > endRow) {
            var temp = endRow;
            endRow = startRow;
            startRow = temp;
        }

        // Validating rows lenght 
        if(endRow > mainTableContent.length-1 || startRow < 0){
            return "error 100";
        }



        var sum = 0;
        for (let i = startRow; i <= endRow; i++) {
            for (let j = startCol; j <= endCol; j++) {
                var val = mainTableContent[i][j]
                if (val != "") {
                    if (isNaN(val)) {
                        return "error 4";
                    } else {
                        sum += parseInt(val);
                    }
                }
            }

        }
        return sum;
    }
}

function getParamColum(param) {
    let columnName = param[0]; // D from D19
    return columnName.charCodeAt(0) - 65;
}


function getParamRow(param) {
    return parseInt(param.substring(1)) - 1;
}

function loadData(){
    var any = window.localStorage.persistanceData;
    if(any){
        mainTableContent = JSON.parse(any);
    }
}

function saveData(){
    window.localStorage.persistanceData = JSON.stringify(mainTableContent);
}



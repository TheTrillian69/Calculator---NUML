var subName, subMark, subCrdt;
var id = 0;

var marks = [];
var crdt = [];
var subGpa = [];
var grade = "F";
var rows = 0;
var calcCriteria = 0;

$(document).ready(function () {
    $("#txtSubjectName").keyup(function (event) {
        //document.getElementById('#txtSubjectName').value = (document.getElementById('txtSubjectName').value).toUpperCase();
        if (event.keyCode == 13) {
            $("#txtSubjectMarks").focus();
        }
    });
    $("#txtSubjectMarks").keyup(function (event) {
        subMark = parseFloat(document.getElementById('txtSubjectMarks').value);
        if (subMark < 0 || subMark > 100) {
            document.getElementById('txtSubjectMarks').value = "";
            $('#txtSubjectMarks').css("color", "red");
            $('#txtSubjectMarks').attr('placeholder', 'Valid Range [0-100]');
        }
        else if (subMark < 50) {
            $('#txtSubjectMarks').css("color", "red");
        }
        else if (subMark >= 0 && subMark <= 100) {
            $('#txtSubjectMarks').css("color", "black");
        }
        if (event.keyCode == 13) {

            $("#txtSubjectCreditHours").focus();
        }
    });
    $("#txtSubjectMarks").change(function (event) {
        subMark = (subMark * 10).toFixed() / 10;
        document.getElementById('txtSubjectMarks').value = subMark;
    });
    $("#txtSubjectCreditHours").keyup(function (event) {
        subCrdt = parseFloat(document.getElementById('txtSubjectCreditHours').value);
        if (subCrdt < 2 || subCrdt > 6) {
            document.getElementById('txtSubjectCreditHours').value = "";
            $('#txtSubjectCreditHours').css("color", "red");
            $('#txtSubjectCreditHours').attr('placeholder', 'Valid Range [2-6]');
        }
        else if (subCrdt >= 2 || subCrdt <= 6) {

            $('#txtSubjectCreditHours').css("color", "black");
        }
        if (event.keyCode == 13) {

            $("#btnAdd").click();
        }
    });
    $("#txtSubjectCreditHours").change(function (event) {
        subCrdt = (subCrdt * 2).toFixed() / 2;
        document.getElementById('txtSubjectCreditHours').value = subCrdt;
    });
    $('#btnAdd').click(function () {
        subName = document.getElementById('txtSubjectName').value.toUpperCase();
        subMark = document.getElementById('txtSubjectMarks').value;
        subCrdt = document.getElementById('txtSubjectCreditHours').value;
        if (!(subMark == null || subCrdt == null || subMark == "" || subCrdt == "")) {
            addRow(subName, subMark, subCrdt);
            calculate(calcCriteria);
        }
        else {
            $.blockUI({ message: '<h3> Fill Properly...</h3><p><b>Range: <br></b>Marks [0-100] <br>Credit Hours: [2-6] </p>' });
            setTimeout($.unblockUI, 1500);
        }
    });
    $('#tblOutput').click(function () {
        if (id > 0) {
            if (calcCriteria == 0) {
                calcCriteria = 1;
                calculate(calcCriteria);
            }
            else {
                calcCriteria = 0;
                calculate(calcCriteria);
            }
        }
    });
    $("input").click(function () {
        $(this).select();
    });
});

$(document).on("click", ".btnDel", function () {
    delRow(this.id);
    calculate(calcCriteria);
});

$(document).on("click", "#btnReset", function () {

});





function addRow(subName, subMark, subCrdt) {
    var data = '<tr id=tr_' + id + ' class="trData">' +
                    '<td class="tdSub">' + subName + '</td>' +
                    '<td class="tdMarks">' + subMark + '</td>' +
                    '<td class="tdCHrs">' + subCrdt + '</td>' +
                    '<td class="tdBtnDelete">' +
                        '<button id=' + id + ' class="btnDel">Delete</button>' +
                    '</td>' +
                '</tr>';
    $("#tblData").append(data);

    marks[id] = parseFloat(subMark);
    crdt[id] = parseFloat(subCrdt);

    id++;
}

function delRow(row) {
    var rowId = "tr_" + row;
    $('#' + rowId).remove();

    marks.splice(row, 1);
    crdt.splice(row, 1);

    id--;
    if (id < 1) {
        location.reload();
    }
}

function calculate(criteria) {
    rows = ($('#tblData tr').length) - 1;

    var tMrks = 0.0;
    var tCrdt = 0.0;

    for (var i = 0; i < rows ; i++) {
        tMrks += marks[i];
        tCrdt += crdt[i];
    }

    tMrks = Math.round(tMrks * 100) / 100;

    $("#tblSum").children().remove();
    var sumRow = '<tr id=tr_rslt>' +
                    '<td class="tdSub">Total: ' + rows + '</td>' +
                    '<td class="tdMarks">' + tMrks + '</td>' +
                    '<td class="tdCHrs">' + tCrdt + '</td>' +
                    '<td class="tdBtnReset">' +
                        '<button id="btnReset">Reset</button>' +
                    '</td>' +
                  '</tr>';
    $("#tblSum").append(sumRow);

    var tGPA = 0.0;
    for (var j = 0; j < rows ; j++) {
        subGpa[j] = ((marksToGradePoint(marks[j], criteria)) * crdt[j]) / tCrdt;
        tGPA += subGpa[j];
    }

    grade = calcGrade(tMrks / rows);
    var c = "x";
    if (criteria == 0) {
        c = "Old";
    } else { c = "New"; }

    var tPerc = (tMrks / rows);
    tGPA = Math.round(tGPA * 100) / 100;

    document.getElementById("criteria").innerHTML = "Criteria: " + c;
    document.getElementById("totalPercentage").innerHTML = (Math.round(tPerc * 100) / 100) + " %";
    document.getElementById("totalCGPA").innerHTML = tGPA;
    document.getElementById("totalGrade").innerHTML = grade;
}

function marksToGradePoint(num, criteria) {
    var gp = (num % 10) / 10;
    if (criteria == 0) //Old Criteria
    {
        if (num >= 80 && num <= 100) {
            return 4.0;
        }
        else if (num >= 70 && num < 80) {
            return (3.0 + gp);
        }
        else if (num >= 60 && num < 70) {
            return (2.0 + gp);
        }
        else if (num >= 50 && num < 60) {
            return (1.0 + gp);
        }
        else {
            return 0.0;
        }
    }
    else            //New Criteria
    {
        if (num >= 90 && num <= 100) {
            return 4.0;
        }
        else if (num >= 80 && num < 90) {
            return 4.0;
        }
        else if (num >= 77 && num < 80) {
            return 3.66;
        }
        else if (num >= 74 && num < 77) {
            return 3.33;
        }
        else if (num >= 70 && num < 74) {
            return 3.0;
        }
        else if (num >= 64 && num < 70) {
            return 2.66;
        }
        else if (num >= 60 && num < 64) {
            return 2.33;
        }
        else if (num >= 54 && num < 60) {
            return 2.0;
        }
        else if (num >= 50 && num < 54) {
            return 1.5;
        }
        else {
            return 0.0;
        }
    }
}

function calcGrade(num) {
    if (num >= 90 && num <= 100) {
        return "A1";
    }
    else if (num >= 80 && num < 90) {
        return "A2";
    }
    else if (num >= 77 && num < 80) {
        return "A3";
    }
    else if (num >= 74 && num < 77) {
        return "B1";
    }
    else if (num >= 70 && num < 74) {
        return "B2";
    }
    else if (num >= 64 && num < 70) {
        return "B3";
    }
    else if (num >= 60 && num < 64) {
        return "C";
    }
    else if (num >= 54 && num < 60) {
        return "D";
    }
    else if (num >= 50 && num < 54) {
        return "E";
    }
    else {
        return "F";
    }
}
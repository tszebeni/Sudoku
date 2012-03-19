/**
 * @author Tamas_Szebeni
 */
/*globals $*/
$(document).ready(function() {
    var SudokuModel, SudokuView, SudokuPresenter;

    SudokuModel = function () {
        this.cells = new Array(81);
    };

    SudokuModel.prototype = {
        load: function (id) {
            $.getJSON("/service/sudoku.json",function () {
                alert("success!");
            });
        }
    };

    SudokuView = function () {};

    SudokuPresenter = function (view,model) {};
});
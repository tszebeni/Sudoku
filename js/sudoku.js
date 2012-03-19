/**
 * @author Tamas_Szebeni
 */
/*globals $*/
$(document).ready(function() {
    var SudokuModel, SudokuView, SudokuPresenter;

    SudokuModel = function () {
        this.cells = new Array(81);
    };

    SudokuView = function () {};

    SudokuPresenter = function (view,model) {};
});
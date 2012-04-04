/**
 * @author Tamas_Szebeni
 */
/*jslint plusplus: true*/
/*globals $*/
$(document).ready(function () {
    "use strict";
    var SudokuModel, SudokuView, SudokuPresenter;

    function everyThird(index) {
        return (index % 3 === 2);
    }

    SudokuModel = function () {
        this.reset();
        this.data = {};
    };

    SudokuModel.prototype = {
        load: function (id, callback) {
            var model = this;
            this.reset();
            $.ajax({
                url: "service/index.php?callback=?",
                dataType: "jsonp",
                data: {id: id},
                success: function (data) {
                    model.data = data;
                    if (callback && $.isFunction(callback)) {
                        callback();
                    }
                }
            });
        },
        reset: function () {
            this.cells = new Array(81);
        },
        getData: function () {
            return this.data;
        }
    };

    SudokuView = function () {
        this.$container = $("#sudoku");
        this.$table = $("table tbody", this.$container);
        this.$new = $(".new", this.$container);
        this.$reset = $(".reset", this.$container);
        this.$check = $(".check", this.$container);
    };

    SudokuView.prototype = {
        init: function (presenter) {
            this.presenter = presenter;
            this.$new.click($.proxy(presenter.onCreate, presenter));
            this.$reset.click($.proxy(presenter.onReset, presenter));
            this.$check.click($.proxy(presenter.onCheck, presenter));
            this.$table.delegate("input", "keypress", $.proxy(presenter.onKeypress, presenter));
        },
        renderTable: function (data) {
            var i, j, row, value;
            this.$table.empty();
            for (i = 0; i < 9; i++) {
                row = "<tr>";
                for (j = 0; j < 9; j++) {
                    value = data[i * 9 + j];
                    if (value === 0) {
                        row += "<td><input type=\"text\" maxlength=\"1\" size=\"1\" /></td>";
                    } else {
                        row += "<td>" + value + "</td>";
                    }
                }
                row += "</tr>";
                this.$table.append(row);
            }
            this.$table.children().filter(everyThird).addClass("floor");
            this.$table.children().each(function (i, elem) {
                $(elem).find("td").filter(everyThird).addClass("wall");
            });
        }
    };

    SudokuPresenter = function (view, model) {
        this.view = view;
        this.model = model;
        this.view.init(this);
        this.onCreate();
    };

    SudokuPresenter.prototype = {
        onCheck: function (e) {
            var $tds = this.view.$table.find("td"),
                $input,
                i,
                finished = true;
            for (i = 0; i < 81; i++) {
                $input = $tds.eq(i).find("input");
                if ($input.length) {
                    if (this.model.data.full[i] === parseInt($input.val(), 10)) {
                        $input.removeClass("wrong").addClass("good");
                    } else {
                        finished = false;
                        if ($input.val()) {
                            $input.addClass("wrong").removeClass("good");
                        }
                    }
                }
            }
            if (finished && !this.notified) {
                window.alert("You won!");
                this.notified = true;
            }
        },
        onReset: function (e) {
            this.onCreate(e, this.model.data.id);
        },
        onCreate: function (e, id) {
            id = id || Math.floor(Math.random() * 100);
            this.notified = false;
            this.model.load(id, $.proxy(function () {
                this.view.renderTable(this.model.data.table);
            }, this));
        },
        onKeypress: function (e) {
            var key = e.which;
            if (!((key >= 48 && key <= 57) || key === 8 || key === 9)) {
                e.preventDefault();
            }
        }
    };

    /**
     * Initialization logic.
     */
    (function () {
        var model = new SudokuModel(),
            view = new SudokuView(),
            presenter = new SudokuPresenter(view, model);
    }());
});

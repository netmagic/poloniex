'use strict';

define(["js/coindata"],
    function (CoinData) {
        var CoinTable = function (tableOBJ) {
            this.tableOBJ = tableOBJ;
            this.coinData = new CoinData();
        };

        CoinTable.prototype.onReceiveItem = function (data) {
            var item = this.coinData.addData(data);

            this.update(item);
        };

        CoinTable.prototype.onChangeOrder = function (sort) {
            var list = this.tableOBJ.children().sort(function (a, b) {
                a = $(a);
                b = $(b);

                if (a.hasClass("favorite") && b.hasClass("favorite")) {

                }
                else if (a.hasClass("favorite") && !b.hasClass("favorite")) return -1;
                else if (!a.hasClass("favorite") && b.hasClass("favorite")) return 1;
                else {
                    if (sort == 1) {
                        if (a.data("up") > b.data("up")) return -1;
                        else if (a.data("up") < b.data("up")) return 1;
                    }
                    else if (sort == 2) {
                        if (a.data("same") > b.data("same")) return -1;
                        else if (a.data("same") < b.data("same")) return 1;
                    }
                    else if (sort == 3) {
                        if (a.data("down") > b.data("down")) return -1;
                        else if (a.data("down") < b.data("down")) return 1;
                    }
                    else if (sort == 4) {
                        if(a.data("day_change") == null) return 1;
                        else if(b.data("day_change") == null) return -1;
                        else if (parseFloat(a.data("day_change")) > parseFloat(b.data("day_change"))) return -1;
                        else if (parseFloat(a.data("day_change")) < parseFloat(b.data("day_change"))) return 1;
                    }
                    else if (sort == 5) {
                        if(a.data("volume") == null) return 1;
                        else if(b.data("volume") == null) return -1;
                        else if (parseFloat(a.data("volume")) > parseFloat(b.data("volume"))) return -1;
                        else if (parseFloat(a.data("volume")) < parseFloat(b.data("volume"))) return 1;
                    }
                }
                if (a.prop("id") < b.prop("id")) return -1;
                else return 1;

            });
            this.tableOBJ.append(list);
        };

        CoinTable.prototype.update = function (item) {
            var that = this;
            var updated = false;

            this.tableOBJ.find("div[id*=_div]").each(function () {
                if ($(this).data("key") == item.name) {
                    that.coinData.getCoinItem(item.name).update();
                    updated = true;
                    return false;
                }
            });

            if (updated == false) {
                var row = this.coinData.getCoinItem(item.name).getTableRow();

                row.click(function () {
                    if ($(this).hasClass("favorite")) {
                        $(this).removeClass("favorite");
                    }
                    else {
                        $(this).addClass("favorite");
                    }
                    that.onChangeOrder($('input[name="sort"]:checked').val());
                });

                this.tableOBJ.children().each(function () {
                    if ($(this).hasClass("favorite")) return true;
                    if (row.prop('id') < $(this).prop('id')) {
                        $(this).before(row);
                        updated = true;
                        return false;
                    }
                });

                if (updated == false) {
                    this.tableOBJ.append(row);
                }
                this.coinData.getCoinItem(item.name).generateChart();
            }
            //else
            //    that.onChangeOrder($('input[name="sort"]:checked').val());

        };

        return CoinTable;
    });
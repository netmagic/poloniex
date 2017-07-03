'use strict';

define(["js/coinitem"],
    function (CoinItem) {
        var CoinData = function () {
            this.data = {};

        };

        CoinData.prototype.getCoinKeys = function() {
            return Object.keys(this.data).sort();
        };

        CoinData.prototype.getCoinItem = function(key) {
            return this.data[key];
        };

        CoinData.prototype.addData = function (data) {
            var item = this.data[data[0]];

            if(item == null) {
                item = new CoinItem(data[0]);

                this.data[data[0]] = item;
            }

            item.setPoloniexData(data);

            return item;
        };

        return CoinData;
    });
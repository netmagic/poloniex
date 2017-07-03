'use strict';

define([],
    function () {
        var CoinItem = function (key) {
            this.key = key;

            this.obj = null;
            this.chart = null;
            this.history = [];
        };

        CoinItem.prototype.setPoloniexData = function (data) {
            this.name = data[0];
            this.last_price = parseFloat(data[1]);
            this.lowest_ask = parseFloat(data[2]);
            this.highest_bid = parseFloat(data[3]);
            this.day_change = parseFloat(data[4]);
            this.base_volume = parseFloat(data[5]);
            this.quote_volume = parseFloat(data[6]);
            this.is_frozen = data[7];
            this.day_high = parseFloat(data[8]);
            this.day_low = parseFloat(data[9]);
            this.insert_date = moment().toDate();
        };

        CoinItem.prototype.getTableRow = function () {
            if (this.obj == null) {
                var price = this.last_price.toFixed(8);
                if(parseInt(this.last_price) == price) {
                    price = parseInt(price);
                }

                var row = "<div id='" + this.name + "_div' class='div_item'><table class='table table-strpied table-bordered table-condensed table-hover'><tbody>";
                row += "<tr><td class='item_name'>" + this.name + "</td><td class='item_price'>" + price.toLocaleString() + "</td></tr>";
                row += "<tr><td colspan='2'><div id='" + this.name + "_chart' class='chartDiv'></div></td></tr>";
                row += "<tr><td></td><td></td></tr>";
                row += "</tbody></table></div>";
                this.obj = $(row).data("key", this.name);
            }
            else {
                this.update();
            }

            return this.obj;
        };

        CoinItem.prototype.update = function () {
            var price = this.last_price.toFixed(8);
            if(parseInt(this.last_price) == price) {
                price = parseInt(price);
            }

            var day_change = (this.day_change * 100).toFixed(2);
            var volume = this.base_volume.toFixed(3);

            this.obj.data("day_change", day_change);
            this.obj.data("volume", volume);

            this.obj.find("tr:eq(0)").find("td:eq(1)").text(price.toLocaleString());
            this.obj.find("tr:eq(2)").find("td:eq(1)").text(day_change + "% / " + volume);
            if(this.name == "USDT_BTC") $("#USDT_BTC").text("USDT_BTC : " + price.toLocaleString());
            if(this.name == "USDT_ETH") $("#USDT_ETH").text("USDT_ETH : " + price.toLocaleString());
            this.updateChart();
        };

        CoinItem.prototype.generateChart = function () {
            if (this.chart != null) return;
            var that = this;
            Highcharts.setOptions(
                {
                    global: {
                        timezoneOffset : -9 * 60
                    }
                }
            );
            var chart = new Highcharts.Chart({
                chart: {
                    renderTo: this.name + "_chart",
                    defaultSeriesType: 'spline',
                    events: {
                        load: function () {
                            that.chart = this;
                            //that.updateChart();
                        }
                    }
                },
                title: {
                    text: '',
                    style: {
                        display: 'none'
                    }
                },
                subtitle: {
                    text: '',
                    style: {
                        display: 'none'
                    }
                },
                credits: {
                    enabled: false
                },
                xAxis: {
                    type: 'datetime',
                    //tickPixelInterval: 150,
                    //maxZoom: 20 * 1000,
                    lineWidth: 0,
                    minorGridLineWidth: 0,
                    lineColor: 'transparent',
                    minorTickLength: 0,
                    tickLength: 0,
                    labels: {
                        enabled: false
                    },
                    title: {
                        enabled: false
                    }
                },
                yAxis: {
                    minPadding: 0,
                    maxPadding: 0,
                    title: {
                        text: '',
                        style: {
                            display: 'none'
                        }
                    },
                    labels: {
                        enabled: false
                    }
                },
                tooltip: {
                    valueDecimals: 8
                },
                plotOptions: {
                    spline: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                colors: ['#0000FF', '#00FF00', '#FF0000'],
                series: [
                    {
                        showInLegend: false,
                        name: 'Last',
                        data: []
                    },
                    {
                        showInLegend: false,
                        name: 'Lowest Ask',
                        data: []
                    },
                    {
                        showInLegend: false,
                        name: 'Highest Bid',
                        data: []
                    }
                ]
            });
        };

        var point = {
            last: [null, 0],
            low: [null, 0],
            high: [null, 0]
        };

        CoinItem.prototype.updateChart = function () {
            if (this.chart == null) {
                return;
            }
            var now = moment();
            var timestamp = now.set('second', 0).valueOf();

            if (this.history.length > 0) {
                if (this.history.length > 60 * 1) {
                    this.history.shift();
                }

                var first = this.history[0];
                var last = this.history[this.history.length - 1];

                this.blink(last[1]);

                if (moment(last[0]).format("YYYYMMDDHHmm") == moment(timestamp).format("YYYYMMDDHHmm")) {
                    last[1] = this.last_price;

                    this.chart.series[0].data[this.chart.series[0].data.length - 1].update(last);
                }
                else {
                    this.history.push([timestamp, this.last_price]);
                    this.chart.series[0].addPoint([timestamp, this.last_price]);
                }
            }
            else {
                this.history.push([timestamp, this.last_price]);
                this.chart.series[0].addPoint([timestamp, this.last_price]);
            }

            var arr = [];
            for(var i = 0; i < this.history.length; i++) {
                arr.push(this.history[i][0]);
                arr.push(this.history[i][1]);
            }

            /*this.chart.update({
                series: {
                    data: this.history
                }
            }, true);*/

            this.checkUpDown();
        };

        CoinItem.prototype.blink = function(last) {
            if (last < this.last_price) {
                var table = this.obj.find("table");
                if (!table.hasClass("blink-up")) {
                    table.addClass("blink-up");
                    setTimeout(function () {
                        table.removeClass("blink-up");
                    }, 1000);
                }
            }

            if (last > this.last_price) {
                var table = this.obj.find("table");
                if (!table.hasClass("blink-down")) {
                    table.addClass("blink-down");
                    setTimeout(function () {
                        table.removeClass("blink-down");
                    }, 1000);
                }
            }
        };

        CoinItem.prototype.checkUpDown = function() {
            if(this.history.length < 2) return;

            var up = 0;
            var same = 0;
            var down = 0;
            var i = this.history.length - 1;
            var arr = this.history;
            var count = 0;
            for(var idx = i; idx > 0 && count < 10; idx--, count++) {
                if(arr[idx][1] > arr[idx - 1][1]) {
                    up++;
                }
                else if(arr[idx][1] < arr[idx - 1][1]) {
                    down++;
                }
                else {
                    same++;
                }
            }

            this.obj.data("up", up);
            this.obj.data("same", same);
            this.obj.data("down", down);

            this.obj.find("tr:eq(2)").find("td:eq(0)").text(up + " : " + same + " : " + down);
        };

        return CoinItem;
    });
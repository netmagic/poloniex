'use strict';

define(["./coinitem"],
    function (CoinItem) {
// ["BTC_PASC","0.00035210","0.00035592","0.00035215","-0.00266258","139.60769744","387331.16766884",0,"0.00038190","0.00034001"]

        var Poloniex = function() {
            this.receiver = {};
        };

        Poloniex.prototype.connect = function() {
            var that = this;
            var wsuri = "wss://api.poloniex.com";
            var connection = new autobahn.Connection({
                url: wsuri,
                realm: "realm1"
            });
            var c = 0;
            connection.onopen = function (session) {
                function tickerEvent(args, kwargs) {
                    var key = args[0].split("_")[0];
                    if(that.receiver[key] != null)
                        that.receiver[key].onReceiveItem(args);
                }

                function marketEvent(args, kwargs) {
                    //console.log(args);
                }

                //session.subscribe('BTC_XMR', marketEvent);
                session.subscribe('ticker', tickerEvent);
            };

            connection.onclose = function () {
                console.log("Websocket connection closed");
            };

            connection.open();
        };

        Poloniex.prototype.addCoinTable = function(key, table) {
            this.receiver[key] = table;
        };

        return Poloniex;
    });

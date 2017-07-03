'use strict';

define([],
    function () {

        var CoinOne = function(receiveTarget) {
            this.receiveTarget = receiveTarget;
        };

        CoinOne.prototype.connect = function() {
            var that = this;
            setInterval(function() {
                $.ajax({
                    type: 'GET',
                    url: 'https://api.coinone.co.kr/ticker/',
                    data: {
                        'currency': 'all'
                    },
                    crossdomain: true,
                    success: function(msg){
                        if(that.receiveTarget != null) {
                            var eth = msg.eth;

                            var item = [
                                "eth",
                                eth.last,
                                0,0,0,parseInt(eth.volume),0,0,0,0,
                                msg.timestamp
                            ];
                            that.receiveTarget.onReceiveItem(item);

                            var btc = msg.btc;
                            item = [
                                "btc",
                                btc.last,
                                0,0,0,parseInt(btc.volume),0,0,0,0,
                                msg.timestamp
                            ];
                            that.receiveTarget.onReceiveItem(item);

                            var etc = msg.etc;
                            item = [
                                "etc",
                                etc.last,
                                0,0,0,parseInt(etc.volume),0,0,0,0,
                                msg.timestamp
                            ];
                            that.receiveTarget.onReceiveItem(item);

                            var xrp = msg.xrp;
                            item = [
                                "xrp",
                                xrp.last,
                                0,0,0,parseInt(xrp.volume),0,0,0,0,
                                msg.timestamp
                            ];
                            that.receiveTarget.onReceiveItem(item);


                            $("#COINONE_BTC").text("코인원 BTC : " + parseInt(btc.last).toLocaleString());
                            $("#COINONE_ETH").text("코인원 ETH : " + parseInt(eth.last).toLocaleString());
                        }
                    }
                });
            }, 5000);
        };

        return CoinOne;
    });

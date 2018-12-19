

const history = {};

const resolutions = {
  '1': '1',
  '5': '5',
  '15': '15',
  '30': '15',
  '60': '60',
  '240': '60',
  'D': '1440',
}
var backendUrl = '';
const historyProvider = {
  history: history,

  getBars: async (symbolInfo, resolution, from, to, first, limit) => {
    const split_symbol = symbolInfo.name.split(/[:/]/);

    // const queryString = qs.stringify({
    //   baseCurrency: split_symbol[0],
    //   quoteCurrency: split_symbol[1],
    //   timestamp: first ? moment.unix(to).subtract(1, 'm').valueOf() : to * 1000,
    //   interval: resolutions[resolution],
    //   limit: limit ? limit : 1000,
    // });

    // const bars = dataJson.map(bar => {
    //   delete bar.ID;
    //   var time=new Date(bar[0]);
    //   // return {
    //   //   ...bar,
    //   //   time: time.getMinutes(),
    //   // }
    //   return {
    //     time: bar[0], //TradingView requires bar time in ms
    //     low: bar[1],
    //     high: bar[2],
    //     open: bar[3],
    //     close: bar[4],
    //     volume: bar[5] 
    //   }
    // })
    // return bars;
    //const queryString = "baseCurrency=BTC&quoteCurrency=ETH&interval=60&limit=200&timestamp=1545111760";
    const queryString = "baseCurrency="+baseCoin+"&quoteCurrency="+toCoin+"&interval="+resolution+"&limit=1000&timestamp="+timestamp;
    var data;
    var urlApi = domain+`/market/get-chart-data?${queryString}`;
    $.ajax({
      url: urlApi,
      success: function (data) {
        console.log('===============API RESULT================');
        console.log(data);
        if (data.data.length) {
          const bars = data.data.map(bar => {
            delete bar.ID;

            return bar;
          })

          // if (first) {
          //   const lastBar = bars[0];
          //   history[symbolInfo.name] = { lastBar }
          // }

         // return bars.reverse();
        }
      },error(err){
        console.log(err);
      }
    });


  },
};


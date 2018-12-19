var apiCall=0;
var datafeed = {
  onReady: function (cb) {
    console.log('=====onReady running')

    cb({
      supported_resolutions: ['1', '5', '15', '60', '240', 'D'],
    });

  },
  searchSymbols: function (userInput, exchange, symbolType, onResultReadyCallback) {
    console.log('====Search Symbols running')
  },
  resolveSymbol: function (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
    // expects a symbolInfo object in response
    console.log('======resolveSymbol running')
    // console.log('resolveSymbol:',{symbolName})
    const split_data = symbolName.split(/[:/]/)
    // console.log({split_data})
    const symbol_stub = {
      name: symbolName,
      description: '',
      type: 'crypto',
      session: '24x7',
      timezone: 'Etc/UTC',
      ticker: symbolName,
      exchange: split_data[0],
      minmov: 1,
      pricescale: 100000000,
      has_intraday: true,
      intraday_multipliers: ['1', '5', '60'],
      supported_resolution: ['1', '5', '15', '60', '240', 'D'],
      volume_precision: 8,
      data_status: 'streaming',
      // has_empty_bars: true,
    }

    // if (split_data[2].match(/USD|EUR|JPY|AUD|GBP|KRW|CNY/)) {
    //   symbol_stub.pricescale = 100
    // }

    setTimeout(function () {
      onSymbolResolvedCallback(symbol_stub)
      console.log('Resolving that symbol....', symbol_stub)
    }, 0)


    // onResolveErrorCallback('Not feeling it today')

  },
  resolveSymbol: function (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
    // expects a symbolInfo object in response
    console.log('======resolveSymbol running')
    // console.log('resolveSymbol:',{symbolName})
    const split_data = symbolName.split(/[:/]/)
    // console.log({split_data})
    const symbol_stub = {
      name: symbolName,
      description: '',
      type: 'crypto',
      session: '24x7',
      timezone: 'Etc/UTC',
      ticker: symbolName,
      exchange: split_data[0],
      minmov: 1,
      pricescale: 100000000,
      has_intraday: true,
      intraday_multipliers: ['1', '5', '60'],
      supported_resolution: ['1', '5', '15', '60', '240', 'D'],
      volume_precision: 8,
      data_status: 'streaming',
      // has_empty_bars: true,
    }

    // if (split_data[2].match(/USD|EUR|JPY|AUD|GBP|KRW|CNY/)) {
    //   symbol_stub.pricescale = 100
    // }

    setTimeout(function () {
      onSymbolResolvedCallback(symbol_stub)
      console.log('Resolving that symbol....', symbol_stub)
    }, 0)


    // onResolveErrorCallback('Not feeling it today')

  },
  getBars: async (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) => {
    console.log('=====getBars running')
    console.log(`Requesting bars between ${new Date(from * 1000).toISOString()} and ${new Date(to * 1000).toISOString()}`)
    try {
        if(apiCall==0){
          apiCall++;
          result = $.ajax({

            url: domain+'/market/get-chart-data?baseCurrency='+baseCoin+'&quoteCurrency='+toCoin+'&interval='+resolution+'&limit=1000&timestamp='+timestamp,
            type: 'GET',
            data: {
            },
            dataType: 'json',
            success: function (data) {
              //                             alert('Data: '+data);
             // console.log(data)
              if (data.data.length) {
                const bars = data.data.map(bar => {
                  delete bar.ID;
    
                  return bar;
                })
    
                if (firstDataRequest) {
                  const lastBar = bars[0];
                  history[symbolInfo.name] = { lastBar }
                }
                console.log('BARS:' + bars)
                let newBar = bars.reverse()
                if (newBar.length) {
                  onHistoryCallback(newBar, { noData: false })
                } else {
                  onHistoryCallback(newBar, { noData: true })
                }
              } else {
                console.log('Data is empty')
              }
            },
            error: function (request, error) {
              alert("Request: " + JSON.stringify(request));
            }
          });
        }else{

        }
    } catch (error) {
      console.error(error);
    }


    // Need to handle error here.

  },
  subscribeBars: function (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) {
    console.log('=====subscribeBars runnning')
    streamProvider.subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback)
  },
  unsubscribeBars: function (subscriberUID) {
    console.log('=====unsubscribeBars running')
    streamProvider.unsubscribeBars(subscriberUID)
  },
  calculateHistoryDepth: function (resolution, resolutionBack, intervalBack) {
    //optional
    // console.log('=====calculateHistoryDepth running')
    // // while optional, this makes sure we request 24 hours of minute data at a time
    // return resolution < 60 ? {resolutionBack: 'D', intervalBack: '1'} : undefined
  },
  getMarks: function (symbolInfo, startDate, endDate, onDataCallback, resolution) {
    //optional
    console.log('=====getMarks running')
  },
  getTimeScaleMarks: function (symbolInfo, startDate, endDate, onDataCallback, resolution) {
    //optional
    console.log('=====getTimeScaleMarks running')
  },
  getServerTime: function (cb) {
    console.log('=====getServerTime running')
  }
}



const { $ } = window;

var connection = $.hubConnection('http://demo6api.modulusexchange.com');
    var dataTickerHubProxy = connection.createHubProxy('dataTickerHub');

    // receives broadcast messages from a hub function, called "broadcastMessage"
    dataTickerHubProxy.on('chartTicker', function(message) {
        console.log(message);
    });
    dataTickerHubProxy.on('pushDataTickerMatched', data => {
        console.log(data);
        //updateVolume(data.Data);
    })

    connection.start().done(function () {
   console.log('\n-------------------------   Start the connection to the dataTickerHub    ---------------------------');
   dataTickerHubProxy.invoke('joinGroup', to, base);
   dataTickerHubProxy.invoke('subscribeToChartTicker', to, base,1440);
});

let subscription = {};
window.dataTickerHubProxy = dataTickerHubProxy;

const streamProvider = {
  subscribeBars: (symbolInfo, resolution, updateCb, uid, resetCache) => {
    const [baseCurrency, quoteCurrency] = symbolInfo.name.split('/');
    const lastBar = _.get(historyProvider, `history.${symbolInfo.name}.lastBar`, {
      time: moment().startOf('m').valueOf(),
      open: 0,
      close: 0,
      hight: 0,
      low: 0,
      volume: 0
    })

    dataTickerHubProxy.invoke(
      'subscribeToChartTicker',
      baseCurrency,
      quoteCurrency,
      1,
    );

    dataTickerHubProxy.invoke(
      'joinGroup',
      baseCurrency,
      quoteCurrency,
      10,
    );

    subscription = {
      channel: `${baseCurrency}${quoteCurrency}1`,
      uid,
      resolution,
      symbolInfo,
      listener: updateCb,
      lastBar,
    };

    const { lastPrice } = store.getState().exchange.tradingPairStats;

    updatePrice(lastPrice)

  },
  unsubscribeBars: uid => {},
};

dataTickerHubProxy.on('chartTicker', data => {
  const barData = JSON.parse(data.Data);

  if (subscription) {
    if (barData.time < subscription.lastBar.time) {
      return;
    }

    const lastBar = updateBar(barData, subscription);

    subscription.listener(lastBar);
    // update our own record of lastBar
    subscription.lastBar = lastBar;
  }
});

dataTickerHubProxy.on('pushDataTickerMatched', data => {
  updateVolume(data.Data);
})

export const updateVolume = ticker => {
  if (!_.isEmpty(subscription)) {
    let lastBar = subscription.lastBar;

    lastBar.volume += ticker.Volume;
    subscription.listener(lastBar);
  }
}

 const updatePrice = price => {
  if (!_.isEmpty(subscription)) {
    let lastBar = subscription.lastBar;
    if (price < lastBar.low) {
      lastBar.low = price;
    } else if (price > lastBar.high) {
      lastBar.high = price;
    }

    lastBar.close = price;

    subscription.listener(lastBar)
  }
};

// Take a single trade, and subscription record, return updated bar
const updateBar = (barData, subscription) => {
  let lastBar = subscription.lastBar;
  let resolution = subscription.resolution;

  if (resolution.includes('D')) {
    // 1 day in minutes === 1440
    resolution = 1440;
  } else if (resolution.includes('W')) {
    // 1 week in minutes === 10080
    resolution = 10080;
  }

  let coeff = resolution * 60 * 1000;
  // console.log({coeff})
  let isSameInterval =
    Math.floor(barData.time / coeff) === Math.floor(lastBar.time / coeff);
  let _lastBar;

  if (!isSameInterval) {
    // create a new candle, use last close as open **PERSONAL CHOICE**
    _lastBar = {
      time: barData.time,
      open: lastBar.close,
      high: lastBar.close,
      low: lastBar.close,
      close: barData.close,
      volume: barData.volume,
    };
  } else {
    // update lastBar candle!
    if (barData.close < lastBar.low) {
      lastBar.low = barData.close;
    } else if (barData.close > lastBar.high) {
      lastBar.high = barData.close;
    }

    lastBar.volume += barData.volume;
    lastBar.close = barData.close;
    _lastBar = lastBar;
  }

  return _lastBar;
};



import React, { useState, useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData, ColorType } from 'lightweight-charts';
import {
  fetchStockPrices,
  fetchStockDetails,
  fetchStockChartData,
  searchStocks,
  formatStockPrice,
  formatMarketCap,
  StockPrice,
  StockPrices,
  StockChartData,
  POPULAR_STOCKS
} from '@/utils/stockPrices';

interface StockTradingProps {}

function StockTrading() {
  // State management
  const [stockPrices, setStockPrices] = useState<StockPrices>({
    AAPL: 0, MSFT: 0, GOOGL: 0, AMZN: 0, TSLA: 0, NVDA: 0, META: 0, NFLX: 0
  });
  const [selectedStock, setSelectedStock] = useState<StockPrice | null>(null);
  const [stockDetails, setStockDetails] = useState<StockPrice | null>(null);
  const [chartData, setChartData] = useState<StockChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ symbol: string; name: string; }[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | '5Y'>('1D');

  // Trading state
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState('');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [limitPrice, setLimitPrice] = useState('');

  // Chart refs
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  // Load initial stock prices
  useEffect(() => {
    async function loadStockPrices() {
      setLoading(true);
      try {
        const prices = await fetchStockPrices();
        setStockPrices(prices);

        // Load details for AAPL by default
        const details = await fetchStockDetails('AAPL');
        if (details) {
          setSelectedStock(details);
          setStockDetails(details);
        }
      } catch (error) {
        console.error('Failed to load stock prices:', error);
      }
      setLoading(false);
    }

    loadStockPrices();

    // Update prices every 30 seconds
    const interval = setInterval(loadStockPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  // Load chart data when stock or timeframe changes
  useEffect(() => {
    if (selectedStock) {
      loadChartData(selectedStock.symbol, timeframe);
    }
  }, [selectedStock, timeframe]);

  // Initialize chart
  useEffect(() => {
    if (chartContainerRef.current && !chartRef.current) {
      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { color: '#0f172a' },
          textColor: '#cbd5e1',
        },
        grid: {
          vertLines: { color: 'rgba(255,255,255,0.1)' },
          horzLines: { color: 'rgba(255,255,255,0.1)' },
        },
        width: chartContainerRef.current.clientWidth,
        height: 400,
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
        },
        rightPriceScale: {
          borderColor: 'rgba(255,255,255,0.1)',
        },
      }) as any;

      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#10b981',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#10b981',
        wickDownColor: '#ef4444',
      });

      chartRef.current = chart;
      candlestickSeriesRef.current = candlestickSeries;
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        candlestickSeriesRef.current = null;
      }
    };
  }, []);

  // Update chart data
  useEffect(() => {
    if (chartData && candlestickSeriesRef.current) {
      const candlestickData: CandlestickData[] = chartData.data.map(item => ({
        time: (item.timestamp / 1000) as any,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
      }));

      candlestickSeriesRef.current.setData(candlestickData);

      // Fit content
      if (chartRef.current) {
        chartRef.current.timeScale().fitContent();
      }
    }
  }, [chartData]);

  const loadChartData = async (symbol: string, tf: typeof timeframe) => {
    try {
      const data = await fetchStockChartData(symbol, tf);
      if (data) {
        setChartData(data);
      }
    } catch (error) {
      console.error('Failed to load chart data:', error);
    }
  };

  const handleStockSelect = async (symbol: string) => {
    try {
      const details = await fetchStockDetails(symbol);
      if (details) {
        setSelectedStock(details);
        setStockDetails(details);
        setSearchQuery('');
        setShowSearchResults(false);
      }
    } catch (error) {
      console.error('Failed to load stock details:', error);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      try {
        const results = await searchStocks(query);
        setSearchResults(results);
        setShowSearchResults(true);
      } catch (error) {
        console.error('Search failed:', error);
      }
    } else {
      setShowSearchResults(false);
    }
  };

  const handleTrade = () => {
    if (!selectedStock || !quantity) return;

    const qty = parseFloat(quantity);
    const price = selectedStock.current_price;
    const total = qty * price;

    alert(`${tradeType.toUpperCase()} Order: ${qty} shares of ${selectedStock.symbol} at $${price.toFixed(2)} = $${total.toFixed(2)}`);
    // Here you would integrate with your trading backend
  };

  if (loading) {
    return (
      <div className="stock-trading" style={{ padding: '2rem', color: '#f8fafc' }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <i className="icofont-spinner icofont-spin" style={{ fontSize: '2rem', color: '#f59e0b' }}></i>
          <p>Loading stock market data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="stock-trading" style={{ padding: '2rem', color: '#f8fafc', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: '#f8fafc', fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          <i className="icofont-chart-line" style={{ marginRight: '0.5rem', color: '#f59e0b' }}></i>
          Stock Trading
        </h1>
        <p style={{ color: '#94a3b8' }}>Trade stocks with real-time data and advanced charting</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem' }}>
        {/* Main Content */}
        <div>
          {/* Stock Search */}
          <div style={{ marginBottom: '2rem', position: 'relative' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search stocks (e.g., AAPL, Apple)..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#f8fafc',
                    fontSize: '0.875rem'
                  }}
                />
                {showSearchResults && searchResults.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    zIndex: 1000,
                    marginTop: '0.25rem'
                  }}>
                    {searchResults.map((stock) => (
                      <div
                        key={stock.symbol}
                        onClick={() => handleStockSelect(stock.symbol)}
                        style={{
                          padding: '0.75rem 1rem',
                          cursor: 'pointer',
                          borderBottom: '1px solid rgba(255,255,255,0.1)',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <div style={{ fontWeight: '600', color: '#f8fafc' }}>{stock.symbol}</div>
                        <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{stock.name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Popular Stocks */}
            <div>
              <h3 style={{ color: '#f8fafc', fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>Popular Stocks</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {POPULAR_STOCKS.slice(0, 8).map((stock) => (
                  <button
                    key={stock.symbol}
                    onClick={() => handleStockSelect(stock.symbol)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      border: selectedStock?.symbol === stock.symbol ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.1)',
                      background: selectedStock?.symbol === stock.symbol ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.05)',
                      color: '#f8fafc',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: selectedStock?.symbol === stock.symbol ? '600' : 'normal'
                    }}
                  >
                    {stock.symbol}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stock Details */}
          {stockDetails && (
            <div style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '2rem',
              border: '1px solid rgba(245,158,11,0.2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h2 style={{ color: '#f8fafc', fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                    {stockDetails.name} ({stockDetails.symbol})
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f8fafc' }}>
                      {formatStockPrice(stockDetails.current_price)}
                    </span>
                    <span style={{
                      color: stockDetails.change >= 0 ? '#10b981' : '#ef4444',
                      fontWeight: '600',
                      fontSize: '1.125rem'
                    }}>
                      {stockDetails.change >= 0 ? '+' : ''}{formatStockPrice(stockDetails.change)}
                      ({stockDetails.change_percent >= 0 ? '+' : ''}{stockDetails.change_percent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Volume</div>
                  <div style={{ color: '#f8fafc', fontWeight: '600' }}>{stockDetails.volume?.toLocaleString() || 'N/A'}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                {stockDetails.market_cap && (
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Market Cap</div>
                    <div style={{ color: '#f8fafc', fontWeight: '600' }}>{formatMarketCap(stockDetails.market_cap)}</div>
                  </div>
                )}
                {stockDetails.pe_ratio && (
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>P/E Ratio</div>
                    <div style={{ color: '#f8fafc', fontWeight: '600' }}>{stockDetails.pe_ratio.toFixed(2)}</div>
                  </div>
                )}
                {stockDetails.dividend_yield && (
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Dividend Yield</div>
                    <div style={{ color: '#f8fafc', fontWeight: '600' }}>{(stockDetails.dividend_yield * 100).toFixed(2)}%</div>
                  </div>
                )}
                {stockDetails.high_52w && (
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>52W High</div>
                    <div style={{ color: '#f8fafc', fontWeight: '600' }}>{formatStockPrice(stockDetails.high_52w)}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Chart */}
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid rgba(245,158,11,0.2)',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ color: '#f8fafc', fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
                Price Chart - {selectedStock?.symbol || 'AAPL'}
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {(['1D', '1W', '1M', '3M', '6M', '1Y'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      border: timeframe === tf ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.1)',
                      background: timeframe === tf ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.05)',
                      color: '#f8fafc',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: timeframe === tf ? '600' : 'normal'
                    }}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
            <div ref={chartContainerRef} style={{ width: '100%', height: '400px' }} />
          </div>
        </div>

        {/* Trading Panel */}
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid rgba(245,158,11,0.2)',
          height: 'fit-content'
        }}>
          <h3 style={{ color: '#f8fafc', fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
            <i className="icofont-exchange" style={{ marginRight: '0.5rem', color: '#f59e0b' }}></i>
            Trade {selectedStock?.symbol || 'AAPL'}
          </h3>

          {/* Trade Type */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <button
                onClick={() => setTradeType('buy')}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: tradeType === 'buy' ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                  background: tradeType === 'buy' ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)',
                  color: tradeType === 'buy' ? '#10b981' : '#f8fafc',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Buy
              </button>
              <button
                onClick={() => setTradeType('sell')}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: tradeType === 'sell' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                  background: tradeType === 'sell' ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)',
                  color: tradeType === 'sell' ? '#ef4444' : '#f8fafc',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Sell
              </button>
            </div>
          </div>

          {/* Order Type */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', color: '#f8fafc', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
              Order Type
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setOrderType('market')}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  borderRadius: '6px',
                  border: orderType === 'market' ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.1)',
                  background: orderType === 'market' ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.05)',
                  color: '#f8fafc',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                Market
              </button>
              <button
                onClick={() => setOrderType('limit')}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  borderRadius: '6px',
                  border: orderType === 'limit' ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.1)',
                  background: orderType === 'limit' ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.05)',
                  color: '#f8fafc',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                Limit
              </button>
            </div>
          </div>

          {/* Quantity */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', color: '#f8fafc', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
              Quantity (Shares)
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
              min="1"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: '#f8fafc',
                fontSize: '0.875rem'
              }}
            />
          </div>

          {/* Limit Price */}
          {orderType === 'limit' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: '#f8fafc', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                Limit Price ($)
              </label>
              <input
                type="number"
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
                placeholder="Enter limit price"
                min="0.01"
                step="0.01"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#f8fafc',
                  fontSize: '0.875rem'
                }}
              />
            </div>
          )}

          {/* Order Summary */}
          {quantity && selectedStock && (
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1.5rem'
            }}>
              <h4 style={{ color: '#f8fafc', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Order Summary
              </h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ color: '#94a3b8' }}>Quantity:</span>
                <span style={{ color: '#f8fafc' }}>{parseFloat(quantity) || 0} shares</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ color: '#94a3b8' }}>Price:</span>
                <span style={{ color: '#f8fafc' }}>{formatStockPrice(selectedStock.current_price)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600' }}>
                <span style={{ color: '#f8fafc' }}>Total:</span>
                <span style={{ color: tradeType === 'buy' ? '#10b981' : '#ef4444' }}>
                  {formatStockPrice((parseFloat(quantity) || 0) * selectedStock.current_price)}
                </span>
              </div>
            </div>
          )}

          {/* Trade Button */}
          <button
            onClick={handleTrade}
            disabled={!quantity || !selectedStock}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '8px',
              border: 'none',
              background: tradeType === 'buy'
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: '#ffffff',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: (!quantity || !selectedStock) ? 'not-allowed' : 'pointer',
              opacity: (!quantity || !selectedStock) ? 0.5 : 1
            }}
          >
            {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedStock?.symbol || 'Stock'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default StockTrading;
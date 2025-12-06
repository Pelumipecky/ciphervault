// Live Cryptocurrency Price Fetcher
// Uses Binance API as primary (more reliable from browser) and CoinGecko as fallback

export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  image: string;
  last_updated: string;
}

export interface CryptoPrices {
  BTC: number;
  ETH: number;
  USDT: number;
  BNB: number;
  XRP: number;
  SOL: number;
  DOGE: number;
  ADA: number;
  [key: string]: number;
}

export interface CryptoPriceDetails {
  [key: string]: CryptoPrice;
}

// Fetch prices using Binance API (primary - no CORS issues)
export async function fetchCryptoPrices(): Promise<CryptoPrices> {
  // Try Binance API first (more reliable from browser, no CORS issues)
  try {
    const binanceResponse = await fetch('https://api.binance.com/api/v3/ticker/price');
    if (binanceResponse.ok) {
      const binanceData = await binanceResponse.json();
      const prices: CryptoPrices = { BTC: 0, ETH: 0, USDT: 1, BNB: 0, XRP: 0, SOL: 0, DOGE: 0, ADA: 0 };
      
      binanceData.forEach((item: { symbol: string; price: string }) => {
        if (item.symbol === 'BTCUSDT') prices.BTC = parseFloat(item.price);
        if (item.symbol === 'ETHUSDT') prices.ETH = parseFloat(item.price);
        if (item.symbol === 'BNBUSDT') prices.BNB = parseFloat(item.price);
        if (item.symbol === 'XRPUSDT') prices.XRP = parseFloat(item.price);
        if (item.symbol === 'SOLUSDT') prices.SOL = parseFloat(item.price);
        if (item.symbol === 'DOGEUSDT') prices.DOGE = parseFloat(item.price);
        if (item.symbol === 'ADAUSDT') prices.ADA = parseFloat(item.price);
      });
      
      console.log('Binance prices fetched:', prices);
      return prices;
    }
  } catch (binanceError) {
    console.error('Binance API failed, trying CoinGecko:', binanceError);
  }

  // Fallback to CoinGecko API
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,binancecoin,ripple,solana,dogecoin,cardano&vs_currencies=usd'
    );
    
    if (response.ok) {
      const data = await response.json();
      console.log('CoinGecko prices fetched:', data);
      
      return {
        BTC: data.bitcoin?.usd || 0,
        ETH: data.ethereum?.usd || 0,
        USDT: data.tether?.usd || 1,
        BNB: data.binancecoin?.usd || 0,
        XRP: data.ripple?.usd || 0,
        SOL: data.solana?.usd || 0,
        DOGE: data.dogecoin?.usd || 0,
        ADA: data.cardano?.usd || 0,
      };
    }
  } catch (error) {
    console.error('CoinGecko API also failed:', error);
  }
    
  // Final fallback - return zeros to indicate no data
  console.error('All price APIs failed');
  return {
    BTC: 0,
    ETH: 0,
    USDT: 1,
    BNB: 0,
    XRP: 0,
    SOL: 0,
    DOGE: 0,
    ADA: 0,
  };
}

// Fetch detailed price data with 24h changes - Binance API primary (more reliable)
export async function fetchDetailedCryptoPrices(): Promise<CryptoPrice[]> {
  const symbolMap: { [key: string]: { id: string; name: string; image: string } } = {
    'BTCUSDT': { id: 'bitcoin', name: 'Bitcoin', image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
    'ETHUSDT': { id: 'ethereum', name: 'Ethereum', image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
    'USDTUSDC': { id: 'tether', name: 'Tether', image: 'https://assets.coingecko.com/coins/images/325/large/Tether.png' },
    'BNBUSDT': { id: 'binancecoin', name: 'BNB', image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png' },
    'XRPUSDT': { id: 'ripple', name: 'XRP', image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png' },
    'SOLUSDT': { id: 'solana', name: 'Solana', image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png' },
    'DOGEUSDT': { id: 'dogecoin', name: 'Dogecoin', image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png' },
    'ADAUSDT': { id: 'cardano', name: 'Cardano', image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png' },
    'DOTUSDT': { id: 'polkadot', name: 'Polkadot', image: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png' },
    'AVAXUSDT': { id: 'avalanche', name: 'Avalanche', image: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png' },
    'LINKUSDT': { id: 'chainlink', name: 'Chainlink', image: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png' },
    'MATICUSDT': { id: 'polygon', name: 'Polygon', image: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png' },
    'LTCUSDT': { id: 'litecoin', name: 'Litecoin', image: 'https://assets.coingecko.com/coins/images/2/large/litecoin.png' },
    'UNIUSDT': { id: 'uniswap', name: 'Uniswap', image: 'https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png' },
    'TRXUSDT': { id: 'tron', name: 'TRON', image: 'https://assets.coingecko.com/coins/images/1094/large/tron-logo.png' },
    'ATOMUSDT': { id: 'cosmos', name: 'Cosmos', image: 'https://assets.coingecko.com/coins/images/1481/large/cosmos_hub.png' },
  };

  // Try Binance API first (more reliable from browser, no CORS issues)
  try {
    const ticker24hResponse = await fetch('https://api.binance.com/api/v3/ticker/24hr');
    
    if (ticker24hResponse.ok) {
      const ticker24h = await ticker24hResponse.json();
      
      const prices: CryptoPrice[] = [];
      
      ticker24h.forEach((item: any) => {
        const info = symbolMap[item.symbol];
        if (info) {
          prices.push({
            id: info.id,
            symbol: item.symbol.replace('USDT', '').replace('USDC', '').toLowerCase(),
            name: info.name,
            current_price: parseFloat(item.lastPrice),
            price_change_24h: parseFloat(item.priceChange),
            price_change_percentage_24h: parseFloat(item.priceChangePercent),
            market_cap: parseFloat(item.quoteVolume) * 100, // Approximate
            total_volume: parseFloat(item.quoteVolume),
            high_24h: parseFloat(item.highPrice),
            low_24h: parseFloat(item.lowPrice),
            image: info.image,
            last_updated: new Date().toISOString()
          });
        }
      });
      
      // Sort by approximate market cap (volume-based)
      prices.sort((a, b) => b.market_cap - a.market_cap);
      console.log('Binance detailed prices fetched:', prices.length, 'coins');
      return prices;
    }
  } catch (binanceError) {
    console.error('Binance API failed, trying CoinGecko:', binanceError);
  }

  // Fallback to CoinGecko API
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,tether,binancecoin,ripple,solana,dogecoin,cardano,polkadot,avalanche-2,chainlink,matic-network,litecoin,uniswap&order=market_cap_desc&per_page=20&page=1&sparkline=false'
    );
    
    if (response.ok) {
      const data: CryptoPrice[] = await response.json();
      console.log('CoinGecko detailed prices fetched:', data.length, 'coins');
      return data;
    }
  } catch (error) {
    console.error('CoinGecko API also failed:', error);
  }
    
  // Final fallback - return empty array
  console.error('All price APIs failed');
  return [];
}

// Format price with appropriate decimal places
export function formatPrice(price: number): string {
  if (price >= 1000) {
    return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } else if (price >= 1) {
    return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  } else {
    return price.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 6 });
  }
}

// Format market cap
export function formatMarketCap(marketCap: number): string {
  if (marketCap >= 1e12) {
    return `$${(marketCap / 1e12).toFixed(2)}T`;
  } else if (marketCap >= 1e9) {
    return `$${(marketCap / 1e9).toFixed(2)}B`;
  } else if (marketCap >= 1e6) {
    return `$${(marketCap / 1e6).toFixed(2)}M`;
  }
  return `$${marketCap.toLocaleString()}`;
}

// Get symbol to id mapping for CoinGecko
export const cryptoIdMap: { [key: string]: string } = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  USDT: 'tether',
  BNB: 'binancecoin',
  XRP: 'ripple',
  SOL: 'solana',
  DOGE: 'dogecoin',
  ADA: 'cardano',
  DOT: 'polkadot',
  AVAX: 'avalanche-2',
  LINK: 'chainlink',
  MATIC: 'polygon',
  LTC: 'litecoin',
  UNI: 'uniswap'
};

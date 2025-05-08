from typing import List, Optional
from ..back_tester import StrategyType
from ..market_data import MarketData
from .base_strategy import Strategy

class RSIStrategy(Strategy):
    def __init__(self, period: int, rsi_threshold: float, position_type: str, stop_loss_pct: Optional[float] = None, take_profit_pct: Optional[float] = None, name: Optional[str] = None, type: Optional[str] = None):
        super().__init__()
        self.period = period
        self.rsi_threshold = rsi_threshold
        self.position_type = position_type
        self.stop_loss_pct = stop_loss_pct
        self.take_profit_pct = take_profit_pct
        self.entry_price: Optional[float] = None
        self.name = name
        self.type = type

    def calculate_rsi(self, market_data: MarketData, ticker: str, date: str) -> float:
        # Get historical prices
        dates = market_data.get_trading_dates_before(date, self.period + 1)
        if len(dates) < self.period + 1:
            return 50.0  # Default to neutral if not enough data

        # Get closing prices
        prices = [market_data.get_close_price(ticker, d) for d in dates]
        
        # Calculate price changes
        changes = [prices[i] - prices[i-1] for i in range(1, len(prices))]
        
        # Separate gains and losses
        gains = [change if change > 0 else 0 for change in changes]
        losses = [-change if change < 0 else 0 for change in changes]
        
        # Calculate average gain and loss
        avg_gain = sum(gains) / len(gains)
        avg_loss = sum(losses) / len(losses)
        
        # Avoid division by zero
        if avg_loss == 0:
            return 100.0
        
        # Calculate RS and RSI
        rs = avg_gain / avg_loss
        rsi = 100 - (100 / (1 + rs))
        
        return rsi

    def should_enter(self, date, ticker, market_data) -> bool:
        rsi = self.calculate_rsi(market_data, ticker, date)
        decision = None
        if self.position_type == "long":
            decision = rsi < self.rsi_threshold
        else:  # SHORT
            decision = rsi > (100 - self.rsi_threshold)
        print(f"[RSI DEBUG] {ticker} {date} RSI={rsi:.2f} threshold={self.rsi_threshold} type={self.position_type} -> enter={decision}")
        return decision

    def get_exposure(self) -> float:
        return 1.0  # Full exposure for RSI strategy

    def strategy_type(self) -> StrategyType:
        return StrategyType.LONG if self.position_type == "long" else StrategyType.SHORT

    # liquidate_below and liquidate_above are inherited from base class

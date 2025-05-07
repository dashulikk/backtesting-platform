<<<<<<< HEAD
from typing import List
from ..back_tester import StrategyType
from ..market_data import MarketData
from .base_strategy import Strategy

class RSIStrategy(Strategy):
    def __init__(self, period: int, rsi_threshold: float, position_type: str):
        self.period = period
        self.rsi_threshold = rsi_threshold
        self.position_type = StrategyType.LONG if position_type == "long" else StrategyType.SHORT

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
=======
import pandas as pd
import numpy as np
from typing import List
from datetime import date
from .base_strategy import Strategy, StrategyType
from backtester.market_data import MarketData

class RSIStrategy(Strategy):
    def __init__(self, period: int = 14):
        """
        Initialize RSI Strategy
        
        Args:
            period (int): Number of days for RSI calculation (default: 14)
        """
        self.period = period
        self.name = "RSI Strategy"
        self.entry_price = None
    
    def calculate_rsi(self, close_prices: List[float]) -> float:
        """
        Calculate Relative Strength Index
        
        Args:
            close_prices (List[float]): List of closing prices
            
        Returns:
            float: RSI value
        """
        # Convert to pandas Series for easier calculations
        series = pd.Series(close_prices)
        
        # Calculate price changes
        delta = series.diff()
        
        # Separate gains and losses
        gain = delta.where(delta > 0, 0)
        loss = -delta.where(delta < 0, 0)
        
        # Calculate average gain and loss
        avg_gain = gain.rolling(window=self.period).mean()
        avg_loss = loss.rolling(window=self.period).mean()
>>>>>>> 570b26107331c9dd9ec5b0fe173298c55abd8646
        
        # Calculate RS and RSI
        rs = avg_gain / avg_loss
        rsi = 100 - (100 / (1 + rs))
        
<<<<<<< HEAD
        return rsi

    def should_enter(self, market_data: MarketData, ticker: str, date: str) -> bool:
        rsi = self.calculate_rsi(market_data, ticker, date)
        
        if self.position_type == StrategyType.LONG:
            return rsi < self.rsi_threshold
        else:  # SHORT
            return rsi > (100 - self.rsi_threshold)

    def get_exposure(self) -> float:
        return 1.0  # Full exposure for RSI strategy

    def strategy_type(self) -> StrategyType:
        return self.position_type 
=======
        return rsi.iloc[-1]
    
    def should_enter(self, date: date, ticker: str, market_data: MarketData) -> bool:
        """
        Determine if we should enter a position based on RSI strategy
        
        Args:
            date (date): Current date
            ticker (str): Stock ticker
            market_data (MarketData): Market data object
            
        Returns:
            bool: True if we should enter, False otherwise
        """
        # Get close prices for RSI calculation
        close_prices = market_data.get_close_prices(ticker, date, self.period + 1)
        if len(close_prices) < self.period + 1:
            return False
            
        # Calculate RSI
        rsi = self.calculate_rsi(close_prices)
        
        # Check if RSI is below 30 (oversold condition)
        if rsi < 30:
            self.entry_price = close_prices[-1]
            return True
            
        return False
    
    def should_exit(self, current_price: float) -> bool:
        """
        Determine if we should exit a position based on take profit and stop loss
        
        Args:
            current_price (float): Current price of the stock
            
        Returns:
            bool: True if we should exit, False otherwise
        """
        if self.entry_price is None:
            return False
            
        # Take profit at 5% gain
        if current_price >= self.entry_price * 1.05:
            return True
            
        # Stop loss at 5% loss
        if current_price <= self.entry_price * 0.95:
            return True
            
        return False
    
    def get_exposure(self) -> float:
        """
        Get the exposure percentage for this strategy
        
        Returns:
            float: Exposure percentage (0.0 to 1.0)
        """
        return 1.0  # Use 100% of available cash
    
    def strategy_type(self) -> StrategyType:
        """
        Get the strategy type
        
        Returns:
            StrategyType: LONG for this strategy
        """
        return StrategyType.LONG 
>>>>>>> 570b26107331c9dd9ec5b0fe173298c55abd8646

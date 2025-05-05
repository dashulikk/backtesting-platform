import pandas as pd
from typing import List
from datetime import date
from .base_strategy import Strategy, StrategyType
from backtester.market_data import MarketData

class SMAStrategy(Strategy):
    def __init__(self, days: int):
        """
        Initialize SMA Strategy
        
        Args:
            days (int): Number of days for SMA calculation
        """
        self.days = days
        self.name = "SMA Strategy"
    
    def calculate_sma(self, close_prices: List[float]) -> float:
        """
        Calculate Simple Moving Average
        
        Args:
            close_prices (List[float]): List of closing prices
            
        Returns:
            float: Simple Moving Average value
        """
        series = pd.Series(close_prices)
        return series.rolling(window=self.days).mean().iloc[-1]
    
    def should_enter(self, date: date, ticker: str, market_data: MarketData) -> bool:
        """
        Determine if we should enter a position based on SMA strategy
        
        Args:
            date (date): Current date
            ticker (str): Stock ticker
            market_data (MarketData): Market data object
            
        Returns:
            bool: True if we should enter, False otherwise
        """
        close_prices = market_data.get_close_prices(ticker, date, self.days)
        if len(close_prices) < self.days:
            return False
            
        current_price = close_prices[-1]
        sma = self.calculate_sma(close_prices)
        
        return current_price > sma
    
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
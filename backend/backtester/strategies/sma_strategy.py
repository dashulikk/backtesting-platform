import pandas as pd
from typing import List
from datetime import date
from .base_strategy import Strategy, StrategyType
from backtester.market_data import MarketData

class SMAStrategy(Strategy):
    def __init__(self, days: int, sma: int):
        """
        Initialize SMA Strategy with two moving averages
        
        Args:
            days (int): Number of days for long-term SMA calculation
            sma (int): Number of days for short-term SMA calculation
        """
        self.days = days
        self.sma = sma
        self.name = "SMA Strategy"
    
    def calculate_sma(self, close_prices: List[float], period: int) -> float:
        """
        Calculate Simple Moving Average
        
        Args:
            close_prices (List[float]): List of closing prices
            period (int): Period for SMA calculation
            
        Returns:
            float: Simple Moving Average value
        """
        series = pd.Series(close_prices)
        return series.rolling(window=period).mean().iloc[-1]
    
    def should_enter(self, date: date, ticker: str, market_data: MarketData) -> bool:
        """
        Determine if we should enter a position based on SMA crossover strategy
        
        Args:
            date (date): Current date
            ticker (str): Stock ticker
            market_data (MarketData): Market data object
            
        Returns:
            bool: True if we should enter, False otherwise
        """
        # Get enough data for both SMAs
        max_period = max(self.days, self.sma)
        close_prices = market_data.get_close_prices(ticker, date, max_period)
        if len(close_prices) < max_period:
            return False
            
        # Calculate both SMAs
        long_sma = self.calculate_sma(close_prices, self.days)
        short_sma = self.calculate_sma(close_prices, self.sma)
        
        # Enter when short-term SMA crosses above long-term SMA
        return short_sma > long_sma
    
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
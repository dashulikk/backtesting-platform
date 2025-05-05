import pandas as pd
from typing import List
from datetime import date
from .base_strategy import Strategy, StrategyType
from backtester.market_data import MarketData

class VolumeMAStrategy(Strategy):
    def __init__(self, days: int):
        """
        Initialize Volume MA Strategy
        
        Args:
            days (int): Number of days for volume moving average calculation
        """
        self.days = days
        self.name = "Volume MA Strategy"
        self.entry_price = None
    
    def calculate_volume_ma(self, volumes: List[float]) -> float:
        """
        Calculate Volume Moving Average
        
        Args:
            volumes (List[float]): List of trading volumes
            
        Returns:
            float: Volume Moving Average value
        """
        series = pd.Series(volumes)
        return series.rolling(window=self.days).mean().iloc[-1]
    
    def should_enter(self, date: date, ticker: str, market_data: MarketData) -> bool:
        """
        Determine if we should enter a position based on Volume MA strategy
        
        Args:
            date (date): Current date
            ticker (str): Stock ticker
            market_data (MarketData): Market data object
            
        Returns:
            bool: True if we should enter, False otherwise
        """
        # Get volumes for MA calculation
        volumes = market_data.get_volumes(ticker, date, self.days)
        if len(volumes) < self.days:
            return False
            
        current_volume = volumes[-1]
        volume_ma = self.calculate_volume_ma(volumes)
        
        # Get current price for entry price tracking
        close_prices = market_data.get_close_prices(ticker, date, 1)
        if len(close_prices) < 1:
            return False
            
        # Check if current volume is above the moving average
        if current_volume > volume_ma:
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
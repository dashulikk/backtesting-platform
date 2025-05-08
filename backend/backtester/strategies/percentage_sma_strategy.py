from backtester.market_data import MarketData
from datetime import date
from backtester.strategies.base_strategy import Strategy, StrategyType
from typing import Literal, Optional
import statistics

class PercentageSMAStrategy(Strategy):
    def __init__(
        self, 
        days: int, 
        percentage_change: float,
        direction: Literal["drop", "rise"],
        position_type: Literal["long", "short"],
        stop_loss_pct: Optional[float] = None,
        take_profit_pct: Optional[float] = None,
        name: Optional[str] = None,
        type: Optional[str] = None
    ):
        """
        Initialize Percentage SMA Strategy
        
        Args:
            days (int): Number of days for SMA calculation
            percentage_change (float): Percentage difference from SMA to trigger trade
            direction (str): "drop" or "rise" - only trigger on drop or rise
            position_type (str): "long" or "short" - defines if strategy opens long or short
            stop_loss_pct (float, optional): Stop loss percentage
            take_profit_pct (float, optional): Take profit percentage
            name (str, optional): Strategy name
            type (str, optional): Strategy type
        """
        super().__init__()
        self.days = days
        self.percentage_change = percentage_change
        self.direction = direction
        self.position_type = position_type
        self.stop_loss_pct = stop_loss_pct
        self.take_profit_pct = take_profit_pct
        self.entry_price: Optional[float] = None
        self.name = name
        self.type = type
    
    def calculate_sma(self, market_data: MarketData, ticker: str, current_date: date) -> float:
        """
        Calculate Simple Moving Average using historical close prices
        
        Args:
            market_data (MarketData): Market data object
            ticker (str): Stock ticker
            current_date (date): Current date
            
        Returns:
            float: Simple Moving Average value
        """
        # Get list of previous trading days
        trading_dates = market_data.get_trading_dates_before(current_date, self.days)
        
        # Get close prices for each day
        close_prices = [
            market_data.get_close_price(ticker, d)
            for d in trading_dates
        ]
        
        # Calculate SMA as average of close prices
        return statistics.mean(close_prices)
    
    def should_enter(self, date: date, ticker: str, market_data: MarketData) -> bool:
        """
        Determine if we should enter a position based on price deviation from SMA
        
        Args:
            date (date): Current date
            ticker (str): Stock ticker
            market_data (MarketData): Market data object
            
        Returns:
            bool: True if we should enter, False otherwise
        """
        # Calculate SMA
        sma = self.calculate_sma(market_data, ticker, date)
        
        # Get current price
        current_price = market_data.get_close_price(ticker, date)
        
        # Calculate percentage difference
        percentage_diff = ((current_price - sma) / sma) * 100
        
        # Check if price movement matches our direction and threshold
        if self.direction == "drop":
            # For drop direction, we want price to be below SMA by the specified percentage
            price_condition = percentage_diff <= -self.percentage_change
        else:  # rise
            # For rise direction, we want price to be above SMA by the specified percentage
            price_condition = percentage_diff >= self.percentage_change
        
        # Only enter if price condition is met and position type matches
        return price_condition
    
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
            StrategyType: LONG or SHORT based on position_type
        """
        return StrategyType.LONG if self.position_type == "long" else StrategyType.SHORT 
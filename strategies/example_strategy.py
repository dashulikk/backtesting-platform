from market_data import MarketData
from datetime import date
from strategies.base_strategy import Strategy, StrategyType

from typing import Optional

class ExampleStrategy(Strategy):
    def __init__(self, days, exposure, liquidate_above, liquidate_below):
        self.days = days
        self.exposure = exposure
        self.liquidate_above_price = liquidate_above
        self.liquidate_below_price = liquidate_below

    def should_enter(self, date: date, ticker: str, market_data: MarketData) -> bool:
        price = market_data.get_close_price(ticker, date)
        if price > 140:
            return True
        else:
            return False
    
    def get_exposure(self) -> float:
        return self.exposure
    
    def strategy_type(self) -> StrategyType:
        return StrategyType.SHORT
    
    def liquidate_below(self) -> Optional[float]:
        return self.liquidate_below_price
    
    def liquidate_above(self) -> Optional[float]:
        return self.liquidate_above_price
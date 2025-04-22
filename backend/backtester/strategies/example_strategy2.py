from market_data import MarketData
from datetime import date
from strategies.base_strategy import Strategy, StrategyType

from typing import Optional


class ExampleStrategy2(Strategy):
    def __init__(self, a, b):
        self.days = a
        self.n = b

    def should_enter(self, date: date, ticker: str, market_data: MarketData) -> bool:
        return True

    def get_exposure(self) -> float:
        return 1.0

    def strategy_type(self) -> StrategyType:
        return StrategyType.LONG

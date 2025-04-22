from market_data import MarketData
from datetime import date
from strategies.base_strategy import Strategy, StrategyType

from typing import Optional


class ExampleStrategy1(Strategy):
    def __init__(self, days, n):
        self.days = days
        self.n = n

    def should_enter(self, date: date, ticker: str, market_data: MarketData) -> bool:
        return True

    def get_exposure(self) -> float:
        return 1.0

    def strategy_type(self) -> StrategyType:
        return StrategyType.LONG

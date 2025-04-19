from abc import ABC, abstractmethod
from datetime import date
from market_data import MarketData
from enum import Enum

from typing import Optional


class StrategyType(Enum):
    LONG = 1
    SHORT = 2


class Strategy(ABC):
    @abstractmethod
    def should_enter(self, date: date, ticker: str, market_data: MarketData) -> bool:
        pass

    @abstractmethod
    def get_exposure(self) -> float:
        """
        When receiving a buy signal - buy stock worth some percentage of cash that we have.
        For example, when receiving a buy signal for AAPL, buy AAPL using 10% of cash we have.
        """
        pass

    @abstractmethod
    def strategy_type(self) -> StrategyType:
        pass

    def liquidate_below(self) -> Optional[float]:
        return None

    def liquidate_above(self) -> Optional[float]:
        return None

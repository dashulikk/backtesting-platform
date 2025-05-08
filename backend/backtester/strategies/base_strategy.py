from abc import ABC, abstractmethod
from datetime import date
from backtester.market_data import MarketData
from enum import Enum
from typing import Optional


class StrategyType(Enum):
    LONG = 1
    SHORT = 2


class Strategy(ABC):
    def __init__(self):
        self.stop_loss_pct: Optional[float] = None
        self.take_profit_pct: Optional[float] = None
        self.entry_price: Optional[float] = None

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
        """
        Returns the price below which to exit based on stop_loss_pct if set.
        Returns None if stop_loss_pct is not set or entry_price is None.
        """
        if self.stop_loss_pct is None or self.entry_price is None:
            return None
        
        if self.strategy_type() == StrategyType.LONG:
            return self.entry_price * (1 - self.stop_loss_pct / 100)
        else:  # SHORT
            return self.entry_price * (1 + self.stop_loss_pct / 100)

    def liquidate_above(self) -> Optional[float]:
        """
        Returns the price above which to exit based on take_profit_pct if set.
        Returns None if take_profit_pct is not set or entry_price is None.
        """
        if self.take_profit_pct is None or self.entry_price is None:
            return None
        
        if self.strategy_type() == StrategyType.LONG:
            return self.entry_price * (1 + self.take_profit_pct / 100)
        else:  # SHORT
            return self.entry_price * (1 - self.take_profit_pct / 100)

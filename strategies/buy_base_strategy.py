from abc import ABC, abstractmethod
from datetime import date
from market_data import MarketData

class BuyStrategy(ABC):
    @abstractmethod
    def shouldBuy(self, date: date, ticker: str, market_data: MarketData) -> bool:
        pass

    @abstractmethod
    def get_exposure(self) -> float:
        """
        When receiving a buy signal - buy stock worth some percentage of cash that we have.
        For example, when receiving a buy signal for AAPL, buy AAPL using 10% of cash we have.
        """
        pass
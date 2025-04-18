from market_data import MarketData
from datetime import date
from strategies.buy_base_strategy import BuyStrategy

class SMABuyStrategy(BuyStrategy):
    def __init__(self, days):
        self.days = days

    def shouldBuy(self, date: date, ticker: str, market_data: MarketData) -> bool:
        return False
    
    def get_exposure(self) -> float:
        return 1.0
from market_data import MarketData
from datetime import date
from strategies.buy_base_strategy import BuyStrategy

class SMABuyStrategy(BuyStrategy):
    def __init__(self, days,exposure):
        self.days = days
        self.exposure=exposure

    def shouldBuy(self, date: date, ticker: str, market_data: MarketData) -> bool:
        price = market_data.get_close_price(ticker, date)
        if price > 140:
            return True
        else:
            return False
    
    def get_exposure(self) -> float:
        return self.exposure
import pandas as pd
from typing import List, Dict, Optional
from datetime import date, timedelta
from dataclasses import dataclass

from abc import ABC, abstractmethod

class BuyStrategy(ABC):
    @abstractmethod
    def shouldBuy(self, date: date, ticker: str, market_data: "MarketData") -> bool:
        pass

    @abstractmethod
    def get_exposure(self) -> float:
        """
        When receiving a buy signal - buy stock worth some percentage of cash that we have.
        For example, when receiving a buy signal for AAPL, buy AAPL using 10% of cash we have.
        """
        pass

class SMABuyStrategy(BuyStrategy):
    def shouldBuy(self, date: date, ticker: str, market_data: "MarketData") -> bool:
        return True
    
    def get_exposure(self) -> float:
        return 0.1

@dataclass
class Environment:
    tickers:  List[str]
    start_date: date
    end_date: date
    cash: int
    strategy: BuyStrategy

@dataclass
class Holdings:
    cash: int
    portfolio: Dict[str, float]
    returns: float

class MarketData:
    def __init__(self, all_data_df: pd.DataFrame, tickers: Optional[List[str]] = None):
        self.df = all_data_df.copy()
        self.df['date'] = pd.to_datetime(self.df['date']).dt.date
        if tickers:
            self.df = self.df[self.df['ticker'].isin(tickers)].reset_index(drop=True)

    def get_trading_dates_before(self, target_date: date, n: int) -> List[date]:
        dates = sorted(self.df['date'].unique())
        before = [d for d in dates if d < target_date]
        return before[-n:] if len(before) >= n else before

    def get_slice(self, upToDate: date) -> "MarketData":
        sliced_df = self.df[self.df['date'] <= upToDate].copy()
        return MarketData(sliced_df)

    def is_trading_date(self, check_date: date) -> bool:
        return check_date in self.df['date'].values

    def _get_price(self, ticker: str, day: date, column: str) -> float:
        row = self.df[(self.df['ticker'] == ticker) & (self.df['date'] == day)]
        if row.empty:
            raise ValueError(f"No data for {ticker} on {day}")
        return float(row.iloc[0][column])

    def get_open_price(self, ticker: str, day: date) -> float:
        return self._get_price(ticker, day, 'open')

    def get_close_price(self, ticker: str, day: date) -> float:
        return self._get_price(ticker, day, 'close')

    def get_high_price(self, ticker: str, day: date) -> float:
        return self._get_price(ticker, day, 'high')

    def get_low_price(self, ticker: str, day: date) -> float:
        return self._get_price(ticker, day, 'low')

    def get_volume(self, ticker: str, day: date) -> float:
        return self._get_price(ticker, day, 'volume')

class BackTester:
    def __init__(self, data_df: pd.DataFrame, env: Environment):
        self.all_market_data = MarketData(data_df, env.tickers)
        self.env = env

        self.holdings: Dict[date, Holdings] = {}
        
        self.current_cash = env.cash
        self.current_portfolio: Dict[str, float] = {}

    def _simulate_long_position(self, ticker: str, exposure: float, date: date):
        # TODO: direction swap

        available_cash_to_buy = self.current_cash * exposure

        # Need at least 1 cent to trade
        if self.current_cash - available_cash_to_buy <= 0.01:
            return
        
        if ticker not in self.current_portfolio:
            self.current_portfolio[ticker] = 0

        self.current_cash -= available_cash_to_buy
        self.current_portfolio[ticker] += available_cash_to_buy / self.all_market_data.get_close_price(ticker, date)
    
    def _get_portfolio_value(self, portfolio: Dict[str, float], date: date) -> float:
        value = 0
        for ticker in portfolio:
            value += self.all_market_data.get_close_price(ticker, date) * portfolio[ticker]
        
        return value

    def _snapshotHoldings(self, date: date) -> Holdings:
        returns = (self.current_cash + self._get_portfolio_value(self.current_portfolio, date) - self.env.cash) / self.env.cash
        return Holdings(
            cash=self.current_cash,
            portfolio=self.current_portfolio.copy(),
            returns=returns
        )
    
    def backtest(self):
        start_date = self.env.start_date
        end_date = self.env.end_date

        current_date = start_date

        while current_date <= end_date:
            if not self.all_market_data.is_trading_date(current_date):
                current_date += timedelta(days=1)
                continue

            market_data = self.all_market_data.get_slice(upToDate=current_date)

            for ticker in self.env.tickers:
                if self.env.strategy.shouldBuy(current_date, ticker, market_data):
                    self._simulate_long_position(ticker, self.env.strategy.get_exposure(), current_date)
            
            self.holdings[current_date] = self._snapshotHoldings(current_date)

            current_date += timedelta(days=1)

data_df = pd.read_csv('data.csv')

env = Environment(tickers=["JPM"], start_date=date(2022, 3, 8), end_date=date(2025, 4, 16), cash=1000, strategy=SMABuyStrategy())
tester = BackTester(data_df=data_df, env=env)
tester.backtest()


for d in tester.holdings:
    print(f"{d} {tester.holdings[d]}")

from dataclasses import dataclass
from typing import Dict
from environment import Environment
from market_data import MarketData
from datetime import date, timedelta
import pandas as pd
from typing import Optional, Set
from strategies.base_strategy import StrategyType

@dataclass(frozen=True)
class Position:
    ticker: str
    amount: float
    entered_price: float
    liquidate_below: Optional[float] = None
    liquidate_above: Optional[float] = None

@dataclass
class Holdings:
    cash: int
    portfolio: Dict[str, float]
    returns: float

class BackTester:
    def __init__(self, data_df: pd.DataFrame, env: Environment):
        self.all_market_data = MarketData(data_df, env.tickers)
        self.env = env

        self.holdings: Dict[date, Holdings] = {}
        
        self.current_cash = env.cash
        self.current_portfolio: Dict[str, Set[Position]] = {}

    def _simulate_long_position(self, ticker: str, exposure: float, date: date):
        available_cash_to_buy = self.current_cash * exposure

        # Need at least 1 cent to trade
        if available_cash_to_buy <= 0.01:
            return
        
        if ticker not in self.current_portfolio:
            self.current_portfolio[ticker] = set()

        self.current_cash -= available_cash_to_buy

        price = self.all_market_data.get_close_price(ticker, date)
        amount = available_cash_to_buy / price
        self.current_portfolio[ticker].add(Position(
            ticker=ticker,
            amount=amount,
            entered_price=price,
            # liquidate_above=price*1.05,
            # liquidate_below=price*0.95
            )
        )
    
    def _simulate_short_position(self, ticker: str, exposure: float, date: date):
        available_cash_to_short = self.current_cash * exposure

        # Need at least 1 cent to trade
        if available_cash_to_short <= 0.01:
            return
        
        if ticker not in self.current_portfolio:
            self.current_portfolio[ticker] = set()

        self.current_cash += available_cash_to_short

        price = self.all_market_data.get_close_price(ticker, date)
        amount = - (available_cash_to_short / price)
        self.current_portfolio[ticker].add(Position(
            ticker=ticker,
            amount=amount,
            entered_price=price,
            # liquidate_above=price*1.05,
            # liquidate_below=price*0.95
            )
        )
    
    def _shouldLiquidatePosition(self, position: Position, date: date):
        price = self.all_market_data.get_close_price(position.ticker, date)

        if position.liquidate_below and price < position.liquidate_below:
            return True
        
        if position.liquidate_above and price > position.liquidate_above:
            return True

        return False
    
    def _liquidatePosition(self, position: Position, date: date):
        price = self.all_market_data.get_close_price(position.ticker, date)
        self.current_cash += price * position.amount
        self.current_portfolio[position.ticker].remove(position)
    
    def _get_portfolio_value(self, portfolio: Dict[str, float], date: date) -> float:
        value = 0
        for ticker in portfolio:
            for position in portfolio[ticker]:
                value += self.all_market_data.get_close_price(ticker, date) * position.amount
        
        return value

    def _snapshotHoldings(self, date: date) -> Holdings:
        returns = (self.current_cash + self._get_portfolio_value(self.current_portfolio, date) - self.env.cash) / self.env.cash

        compressed_portfolio = {
            ticker: sum(position.amount for position in self.current_portfolio[ticker]) for ticker in self.current_portfolio
        }
        return Holdings(
            cash=self.current_cash,
            portfolio=compressed_portfolio,
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

            for ticker in self.env.tickers:
                if ticker in self.current_portfolio:
                    for position in list(self.current_portfolio[ticker]):
                        if self._shouldLiquidatePosition(position=position, date=current_date):
                            self._liquidatePosition(position, current_date)

                if self.env.strategy.should_enter(current_date, ticker, self.all_market_data):
                    if self.env.strategy.strategy_type() == StrategyType.LONG:
                        self._simulate_long_position(ticker, self.env.strategy.get_exposure(), current_date)
                    else:
                        self._simulate_short_position(ticker, self.env.strategy.get_exposure(), current_date)
            
            self.holdings[current_date] = self._snapshotHoldings(current_date)

            current_date += timedelta(days=1)
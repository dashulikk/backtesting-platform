import pandas as pd
from typing import List
from datetime import date, timedelta
from dataclasses import dataclass

from abc import ABC, abstractmethod


class BuyStrategy(ABC):
    @abstractmethod
    def shouldBuy(self, date: date, data_df: pd.DataFrame) -> bool:
        pass

class SMABuyStrategy(BuyStrategy):
    def shouldBuy(self, date: date, data_df: pd.DataFrame) -> bool:
        return False
        

class SMAStrategy:
    def __init__(self, days, data):
        self.days = days
        self.data = data

@dataclass
class Environment:
    tickers:  List[str]
    start_date: date
    end_date: date
    cash: int

@dataclass
class Simulation:
    env: Environment
    strategy: BuyStrategy


class BackTester:
    def __init__(self, data_df: pd.DataFrame, sim: Simulation):
        self.data_df = data_df
        self.sim = sim
        
        self.cash = sim.env.cash
        self.portfolio = {}
        self.stock_name = "BAML"
    
    def backtest(self):
        start_date = self.sim.env.start_date
        end_date = self.sim.env.end_date

        current_date = start_date

        while current_date <= end_date:
            if self.cash <= 0:
                break
            
            if self.sim.strategy.shouldBuy(current_date, self.data_df):
                result = self.data_df.query(f"ticker == 'GOOG' and date == '{current_date}'")

                price = result['close'].iloc[0] if not result.empty else None

                if price:
                    self.portfolio[self.stock_name] = self.cash / price
                    self.cash = 0
                    break
            
            current_date += timedelta(days=1)
    
    def get_return(self):
        cash = self.cash
        for stock in self.portfolio:
            shares = self.portfolio[stock]

            result = self.data_df.query(f"ticker == 'GOOG' and date == '{self.sim.env.end_date}'")
            price = result['close'].iloc[0] if not result.empty else None

            current_date = self.sim.env.end_date
            while not price:
                current_date -= timedelta(days=1)
                result = self.data_df.query(f"ticker == 'GOOG' and date == '{current_date}'")
                price = result['close'].iloc[0] if not result.empty else None
    
            cash += price * shares
        
        return ((cash - self.sim.env.cash) / self.sim.env.cash) * 100

data_df = pd.read_csv('data.csv')

env = Environment(tickers=["GOOG"], start_date=date(2025, 3, 8), end_date=date(2025, 4, 16), cash=1000)
sim = Simulation(env=env, strategy=SMABuyStrategy())

tester = BackTester(data_df=data_df, sim=sim)
tester.backtest()
print(tester.get_return())



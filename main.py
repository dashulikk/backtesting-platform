import pandas as pd
from environment import Environment
from back_tester import BackTester
from datetime import date
from strategies.sma_strategy import SMABuyStrategy

data_df = pd.read_csv('data.csv')

env = Environment(
    tickers=["AAPL"], 
    start_date=date(2024, 10, 16), 
    end_date=date(2025, 4, 16), 
    cash=1000, 
    strategy=SMABuyStrategy(days=20)
)

tester = BackTester(data_df=data_df, env=env)
tester.backtest()

for d in tester.holdings:
    print(f"{d} {tester.holdings[d]}")

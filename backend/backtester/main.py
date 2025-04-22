import pandas as pd
from environment import Environment
from back_tester import BackTester
from datetime import date
from strategies.example_strategy import ExampleStrategy

data_df = pd.read_csv("./backtester/data.csv")

env = Environment(
    tickers=["NVDA"],
    start_date=date(2024, 10, 16),
    end_date=date(2025, 4, 16),
    cash=1000,
    strategies=
    [ExampleStrategy(
        days=20, exposure=0.05, liquidate_above=1.05, liquidate_below=0.95
    )],
)

tester = BackTester(data_df=data_df, env=env)
tester.backtest()

for d in tester.holdings:
    print(f"{d} {tester.holdings[d]}")

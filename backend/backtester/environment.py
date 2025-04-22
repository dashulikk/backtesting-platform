from dataclasses import dataclass
from typing import List
from backtester.strategies.base_strategy import Strategy
from datetime import date


@dataclass
class Environment:
    tickers: List[str]
    start_date: date
    end_date: date
    cash: float
    strategies: List[Strategy]

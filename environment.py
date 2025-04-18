from dataclasses import dataclass
from typing import List
from strategies.buy_base_strategy import BuyStrategy
from datetime import date

@dataclass
class Environment:
    tickers:  List[str]
    start_date: date
    end_date: date
    cash: int
    strategy: BuyStrategy
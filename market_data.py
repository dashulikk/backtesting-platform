import pandas as pd
from datetime import date
from typing import Optional, List, Dict
from dataclasses import dataclass


@dataclass(frozen=True)
class TickerData:
    open: float
    close: float
    high: float
    low: float
    volume: int


class MarketData:
    def __init__(self, all_data_df: pd.DataFrame, tickers: Optional[List[str]] = None):
        self.data: Dict[date, Dict[str, TickerData]] = {}
        self.trading_dates: List[date] = []

        df = all_data_df.copy()
        df["date"] = pd.to_datetime(df["date"]).dt.date
        if tickers:
            df = df[df["ticker"].isin(tickers)]

        for row in df.itertuples(index=False):
            d = row.date
            t = row.ticker

            if d not in self.data:
                self.data[d] = {}
                self.trading_dates.append(d)

            self.data[d][t] = TickerData(
                open=row.open,
                close=row.close,
                high=row.high,
                low=row.low,
                volume=row.volume,
            )

        self.trading_dates.sort()

    def get_trading_dates_before(self, target_date: date, n: int) -> List[date]:
        before = [d for d in self.trading_dates if d < target_date]
        return before[-n:] if len(before) >= n else before

    def is_trading_date(self, check_date: date) -> bool:
        return check_date in self.data

    def _get_data(self, ticker: str, day: date) -> TickerData:
        try:
            return self.data[day][ticker]
        except KeyError:
            raise ValueError(f"No data for {ticker} on {day}")

    def get_open_price(self, ticker: str, day: date) -> float:
        return self._get_data(ticker, day).open

    def get_close_price(self, ticker: str, day: date) -> float:
        return self._get_data(ticker, day).close

    def get_high_price(self, ticker: str, day: date) -> float:
        return self._get_data(ticker, day).high

    def get_low_price(self, ticker: str, day: date) -> float:
        return self._get_data(ticker, day).low

    def get_volume(self, ticker: str, day: date) -> int:
        return self._get_data(ticker, day).volume

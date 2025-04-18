import pandas as pd
from datetime import date
from typing import Optional, List

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
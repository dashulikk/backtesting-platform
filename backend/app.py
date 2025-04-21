from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Union, Literal, Dict
from datetime import date, datetime, timedelta
from abc import ABC
import random

app = FastAPI()

# Base Strategy class
class Strategy(BaseModel):
    name: str
    type: str

# Example Strategy implementations
class ExampleStrategy(Strategy):
    type: Literal["ExampleStrategy"]
    days: int
    n: int

class ExampleStrategy2(Strategy):
    type: Literal["ExampleStrategy2"]
    a: float
    b: float

# Simulation model
class Simulation(BaseModel):
    name: str
    start_date: date
    end_date: date
    strategies: List[Union[ExampleStrategy, ExampleStrategy2]]

# Environment model
class Environment(BaseModel):
    name: str
    stocks: List[str]
    simulations: List[Simulation]

# New model for returns data
class ReturnsData(BaseModel):
    timestamp: date
    returns: float

# In-memory storage (replace with database in production)
environments = {}

# Dummy data
environments["user1"] = {
    "test1": Environment(
        name="test1",
        stocks=["AAPL", "GOOGL", "MSFT", "AMZN"],
        simulations=[
            Simulation(
                name="momentum_strategy",
                start_date=date(2023, 1, 1),
                end_date=date(2023, 12, 31),
                strategies=[
                    ExampleStrategy(name="momentum_1", type="ExampleStrategy", days=20, n=5),
                    ExampleStrategy2(name="mean_rev_2", type="ExampleStrategy2", a=0.3, b=1.5)
                ]
            ),
            Simulation(
                name="mean_reversion",
                start_date=date(2023, 6, 1),
                end_date=date(2023, 12, 31),
                strategies=[
                    ExampleStrategy2(name="mean_rev_1", type="ExampleStrategy2", a=0.5, b=2.0),
                    ExampleStrategy(name="momentum_2", type="ExampleStrategy", days=50, n=10)
                ]
            )
        ]
    )
}

@app.get("/{user_id}/envs")
async def get_environments(user_id: str):
    if user_id not in environments:
        return []
    return list(environments[user_id].values())

@app.get("/{user_id}/{env_name}/{simulation_name}", response_model=Simulation)
async def get_simulation(user_id: str, env_name: str, simulation_name: str):
    """
    Get a specific simulation with all its details including strategies.
    
    Returns:
        Simulation object containing:
        - name: str
        - start_date: date
        - end_date: date
        - strategies: List[Strategy] with all strategy fields
    """
    if user_id not in environments:
        raise HTTPException(status_code=404, detail="User not found")
    
    env = environments[user_id].get(env_name)
    if not env:
        raise HTTPException(status_code=404, detail="Environment not found")
    
    simulation = next((s for s in env.simulations if s.name == simulation_name), None)
    if not simulation:
        raise HTTPException(status_code=404, detail="Simulation not found")
    
    return simulation

@app.get("/{user_id}/{env_name}/{simulation_name}/returns", response_model=List[ReturnsData])
async def get_simulation_returns(user_id: str, env_name: str, simulation_name: str):
    """
    Get time series data of returns for a specific simulation.
    
    Returns:
        List of ReturnsData objects containing:
        - timestamp: date
        - returns: float (percentage returns, e.g., 20.5 means 20.5% return)
    """
    if user_id not in environments:
        raise HTTPException(status_code=404, detail="User not found")
    
    env = environments[user_id].get(env_name)
    if not env:
        raise HTTPException(status_code=404, detail="Environment not found")
    
    simulation = next((s for s in env.simulations if s.name == simulation_name), None)
    if not simulation:
        raise HTTPException(status_code=404, detail="Simulation not found")
    
    # Generate dummy returns data
    returns_data = []
    current_date = simulation.start_date
    end_date = simulation.end_date
    
    # Generate daily returns
    while current_date <= end_date:
        # Generate a random return between -2% and +2% for each day
        daily_return = random.uniform(-2.0, 2.0)
        returns_data.append(ReturnsData(
            timestamp=current_date,
            returns=daily_return
        ))
        current_date += timedelta(days=1)
    
    return returns_data
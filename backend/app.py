from fastapi import FastAPI, HTTPException, Response, status, Depends, BackgroundTasks
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Union, Literal, Dict
from datetime import date, datetime, timedelta
from abc import ABC
from enum import Enum
import random
import pandas as pd
from jose import jwt, JWTError
from pymongo import MongoClient
from bson import ObjectId

from backtester.back_tester import BackTester
from backtester.environment import Environment as BackTesterEnvironment
from backtester.strategies.example_strategy import ExampleStrategy1 as BackTesterExampleStrategy1
from backtester.strategies.example_strategy2 import ExampleStrategy2 as BackTesterExampleStrategy2

data_df = pd.read_csv("./backtester/data.csv")

# Initialize MongoDB client
client = MongoClient('mongodb://localhost:27017/')
db = client['backtesting']

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],  # Allow both default React ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Secret key for JWT token signing (in production, use a secure environment variable)
SECRET_KEY = "your-secret-key-keep-it-secret"
ALGORITHM = "HS256"

# Test token that gives access to user1's data
# Use this token for testing by passing it in Authorization header:
# Authorization: Bearer test-token-for-user1
TEST_TOKEN = "test-token-for-user1"

# OAuth2 scheme for token handling
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# User model for authentication
class User(BaseModel):
    username: str

# Token model for response
class Token(BaseModel):
    access_token: str
    token_type: str

# Dummy user database (replace with real database in production)
users_db = {
    "user1": {"username": "user1", "password": "password1"},
}

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

# Environment model (now includes what was previously in Simulation)
class Environment(BaseModel):
    name: str
    stocks: List[str]
    start_date: date
    end_date: date
    strategies: List[Union[ExampleStrategy, ExampleStrategy2]]

# New model for returns data
class ReturnsData(BaseModel):
    date: date
    returns: float

# New model for portfolio data
class PortfolioData(BaseModel):
    date: date
    positions: Dict[str, float]  # stock -> amount

# New model for trade data
class TradeType(str, Enum):
    LONG = "Long"
    SHORT = "Short"

class TradeData(BaseModel):
    date: date
    stock: str
    cash: float
    type: TradeType

# Response model for backtest
class BacktestResponse(BaseModel):
    status: str = "ok"

def _get_backtester_strategies(env: Environment):
    backtester_strategies = []
    for strategy in env['strategies']:
        print(strategy)
        if strategy['type'] == 'ExampleStrategy':
            backtester_strategies.append(
                BackTesterExampleStrategy1(
                    days=strategy['days'],
                    n=strategy['n']
                )
            )
        elif strategy['type'] == 'ExampleStrategy2':
            backtester_strategies.append(
                BackTesterExampleStrategy2(
                    a=strategy['a'],
                    b=strategy['b']
                )
            )
    
    return backtester_strategies

def _get_backtester_environment(env: Environment):
    start_date = datetime.strptime(env['start_date'], "%Y-%m-%d").date()
    end_date = datetime.strptime(env['end_date'], "%Y-%m-%d").date()

    strategies = _get_backtester_strategies(env)

    return BackTesterEnvironment(
        tickers=env['stocks'],
        start_date=start_date,
        end_date=end_date,
        strategies=strategies,
        cash=1000,  # TODO: Make this dynamic
    )

def _backtest(env: Environment, mongo_db):
    backtester_env = _get_backtester_environment(env)
    tester = BackTester(data_df=data_df, env=backtester_env)
    tester.backtest()

    # Get results from backtester
    trades = tester.get_trades()  # List[Trade]
    holdings_by_date = tester.get_holdings()  # Dict[date, Holdings]

    # Convert trades to our API format
    trades_data = []
    for trade in trades:
        trades_data.append({
            "date": trade.date.isoformat(),
            "stock": trade.ticker,
            "cash": abs(trade.amount),  # Use absolute value since we indicate direction in type
            "type": "Long" if trade.amount > 0 else "Short"
        })

    # Convert holdings to our API format
    portfolio_data = []
    returns_data = []
    
    # Sort dates to ensure chronological order
    dates = sorted(holdings_by_date.keys())
    for date in dates:
        holding = holdings_by_date[date]
        
        # Portfolio data
        portfolio_data.append({
            "date": date.isoformat(),
            "positions": holding.portfolio
        })
        
        # Returns data
        returns_data.append({
            "date": date.isoformat(),
            "returns": holding.returns
        })

    # Store results in MongoDB
    env_id = str(env['_id'])
    
    # Update or insert returns data
    mongo_db.returns.update_one(
        {"environment_id": env_id},
        {"$set": {"data": returns_data}},
        upsert=True
    )
    
    # Update or insert portfolio data
    mongo_db.portfolio.update_one(
        {"environment_id": env_id},
        {"$set": {"data": portfolio_data}},
        upsert=True
    )
    
    # Update or insert trades data
    mongo_db.trades.update_one(
        {"environment_id": env_id},
        {"$set": {"data": trades_data}},
        upsert=True
    )

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    # Special case for test token
    if token == TEST_TOKEN:
        return User(username="user1")

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    return User(username=username)

def verify_user_access(current_user: User, user_id: str):
    """Verify that the current user has access to the requested user_id's data"""
    if current_user.username != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this user's data"
        )

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = users_db.get(form_data.username)
    if not user or form_data.password != user["password"]:  # In production, use proper password hashing
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token = jwt.encode(
        {"sub": user["username"], "exp": datetime.utcnow() + timedelta(days=1)},
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    
    return Token(access_token=access_token, token_type="bearer")

# Helper function to convert MongoDB ObjectId to string
def convert_objectid(item):
    if isinstance(item, dict) and '_id' in item:
        item['_id'] = str(item['_id'])
    return item

@app.get("/envs", response_model=List[Environment])
async def get_environments(current_user: User = Depends(get_current_user)):
    """Get all environments for the authenticated user."""
    user_id = current_user.username
    envs = list(db.environments.find({"user_id": user_id}))
    return [convert_objectid(env) for env in envs]

@app.get("/{env_name}", response_model=Environment)
async def get_environment(
    env_name: str,
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific environment with all its details including strategies.
    
    Returns:
        Environment object containing:
        - name: str
        - stocks: List[str]
        - start_date: date
        - end_date: date
        - strategies: List[Strategy] with all strategy fields
    """
    user_id = current_user.username
    env = db.environments.find_one({"user_id": user_id, "name": env_name})
    if not env:
        raise HTTPException(status_code=404, detail="Environment not found")
    return convert_objectid(env)

@app.get("/{env_name}/returns", response_model=Optional[List[ReturnsData]])
async def get_environment_returns(
    env_name: str,
    current_user: User = Depends(get_current_user)
):
    """Get returns data for the specified environment."""
    user_id = current_user.username
    env = db.environments.find_one({"user_id": user_id, "name": env_name})
    if not env:
        raise HTTPException(status_code=404, detail="Environment not found")
    
    returns = db.returns.find_one({"environment_id": str(env['_id'])})
    if not returns:
        return None
    
    return returns.get('data', [])

@app.get("/{env_name}/portfolio", response_model=Optional[List[PortfolioData]])
async def get_environment_portfolio(
    env_name: str,
    current_user: User = Depends(get_current_user)
):
    """Get portfolio data for the specified environment."""
    user_id = current_user.username
    env = db.environments.find_one({"user_id": user_id, "name": env_name})
    if not env:
        raise HTTPException(status_code=404, detail="Environment not found")
    
    portfolio = db.portfolio.find_one({"environment_id": str(env['_id'])})
    if not portfolio:
        return None
    
    return portfolio.get('data', [])

@app.get("/{env_name}/trades", response_model=Optional[List[TradeData]])
async def get_environment_trades(
    env_name: str,
    current_user: User = Depends(get_current_user)
):
    """Get trades data for the specified environment."""
    user_id = current_user.username
    env = db.environments.find_one({"user_id": user_id, "name": env_name})
    if not env:
        raise HTTPException(status_code=404, detail="Environment not found")
    
    trades = db.trades.find_one({"environment_id": str(env['_id'])})
    if not trades:
        return None
    
    return trades.get('data', [])

@app.post("/{env_name}/backtest", status_code=status.HTTP_200_OK, response_class=Response)
async def run_backtest(
    background_tasks: BackgroundTasks,
    env_name: str,
    current_user: User = Depends(get_current_user)
):
    """Trigger a backtest for the specified environment and store results."""
    user_id = current_user.username
    env = db.environments.find_one({"user_id": user_id, "name": env_name})
    if not env:
        raise HTTPException(status_code=404, detail="Environment not found")
    
    background_tasks.add_task(_backtest, env, db)
    
    return Response(status_code=status.HTTP_200_OK)

# Request models for creating new items
class CreateEnvironmentRequest(BaseModel):
    name: str
    stocks: List[str]
    start_date: date
    end_date: date

class AddStrategyRequest(BaseModel):
    strategy: Union[ExampleStrategy, ExampleStrategy2]

@app.post("/environments", status_code=status.HTTP_200_OK, response_class=Response)
async def create_environment(
    request: CreateEnvironmentRequest,
    current_user: User = Depends(get_current_user)
):
    """Create a new environment for the current user."""
    user_id = current_user.username
    
    # Check if environment with this name already exists
    existing = db.environments.find_one({"user_id": user_id, "name": request.name})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Environment with this name already exists"
        )
    
    # Create new environment with dates converted to ISO format strings
    new_env = {
        "name": request.name,
        "user_id": user_id,
        "stocks": request.stocks,
        "start_date": request.start_date.isoformat(),
        "end_date": request.end_date.isoformat(),
        "strategies": []
    }
    
    # Insert into MongoDB
    db.environments.insert_one(new_env)
    
    return Response(status_code=status.HTTP_200_OK)

@app.post("/{env_name}/strategies", status_code=status.HTTP_200_OK, response_class=Response)
async def add_strategy(
    env_name: str,
    request: AddStrategyRequest,
    current_user: User = Depends(get_current_user)
):
    """Add a strategy to an environment."""
    user_id = current_user.username
    
    # Find the environment
    env = db.environments.find_one({"user_id": user_id, "name": env_name})
    if not env:
        raise HTTPException(status_code=404, detail="Environment not found")
    
    # Check if strategy with this name already exists
    if any(s["name"] == request.strategy.name for s in env["strategies"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Strategy with this name already exists in this environment"
        )
    
    # Add the strategy
    db.environments.update_one(
        {"_id": env["_id"]},
        {"$push": {"strategies": request.strategy.dict()}}
    )
    
    return Response(status_code=status.HTTP_200_OK)

@app.delete("/{env_name}/strategies/{strategy_name}", status_code=status.HTTP_200_OK, response_class=Response)
async def delete_strategy(
    env_name: str,
    strategy_name: str,
    current_user: User = Depends(get_current_user)
):
    """Delete a strategy from an environment."""
    user_id = current_user.username
    
    # Find and update the environment
    result = db.environments.update_one(
        {"user_id": user_id, "name": env_name},
        {"$pull": {"strategies": {"name": strategy_name}}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Environment not found")
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Strategy not found")
    
    return Response(status_code=status.HTTP_200_OK)

@app.delete("/environments/{env_name}", status_code=status.HTTP_200_OK, response_class=Response)
async def delete_environment(
    env_name: str,
    current_user: User = Depends(get_current_user)
):
    """Delete an environment and its associated data."""
    user_id = current_user.username
    
    # Find the environment first to get its ID
    env = db.environments.find_one({"user_id": user_id, "name": env_name})
    if not env:
        raise HTTPException(status_code=404, detail="Environment not found")
    
    env_id = str(env['_id'])
    
    # Delete all associated data
    db.returns.delete_one({"environment_id": env_id})
    db.portfolio.delete_one({"environment_id": env_id})
    db.trades.delete_one({"environment_id": env_id})
    
    # Delete the environment
    db.environments.delete_one({"_id": env['_id']})
    
    return Response(status_code=status.HTTP_200_OK)

@app.put("/environments/{env_name}", status_code=status.HTTP_200_OK, response_class=Response)
async def update_environment(
    env_name: str,
    request: CreateEnvironmentRequest,
    current_user: User = Depends(get_current_user)
):
    """Update an environment while preserving its strategies."""
    user_id = current_user.username
    
    # Find the existing environment
    existing = db.environments.find_one({"user_id": user_id, "name": env_name})
    if not existing:
        raise HTTPException(status_code=404, detail="Environment not found")
    
    # If name is being changed, check if new name already exists
    if env_name != request.name:
        name_exists = db.environments.find_one({"user_id": user_id, "name": request.name})
        if name_exists:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Environment with this name already exists"
            )
    
    # Preserve strategies from existing environment
    strategies = existing.get('strategies', [])
    
    # Update environment with new data while keeping strategies
    updated_env = {
        "name": request.name,
        "user_id": user_id,
        "stocks": request.stocks,
        "start_date": request.start_date.isoformat(),
        "end_date": request.end_date.isoformat(),
        "strategies": strategies
    }
    
    # Update in MongoDB
    db.environments.update_one(
        {"_id": existing["_id"]},
        {"$set": updated_env}
    )
    
    # Delete any existing backtest results since environment parameters changed
    env_id = str(existing['_id'])
    db.returns.delete_one({"environment_id": env_id})
    db.portfolio.delete_one({"environment_id": env_id})
    db.trades.delete_one({"environment_id": env_id})
    
    return Response(status_code=status.HTTP_200_OK)
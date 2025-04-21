from fastapi import FastAPI, HTTPException, Response, status, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Union, Literal, Dict
from datetime import date, datetime, timedelta
from abc import ABC
from enum import Enum
import random
from jose import jwt, JWTError

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

# In-memory storage (replace with database in production)
environments = {}

# Dummy data
environments["user1"] = {
    "test1": Environment(
        name="test1",
        stocks=["AAPL", "GOOGL", "MSFT", "AMZN"],
        start_date=date(2023, 1, 1),
        end_date=date(2023, 12, 31),
        strategies=[
            ExampleStrategy(name="momentum_1", type="ExampleStrategy", days=20, n=5),
            ExampleStrategy2(name="mean_rev_2", type="ExampleStrategy2", a=0.3, b=1.5)
        ]
    ),
    "test2": Environment(
        name="test2",
        stocks=["TSLA", "META", "NFLX", "NVDA"],
        start_date=date(2023, 1, 1),
        end_date=date(2023, 12, 31),
        strategies=[
            ExampleStrategy(name="momentum_3", type="ExampleStrategy", days=30, n=7),
            ExampleStrategy2(name="mean_rev_4", type="ExampleStrategy2", a=0.4, b=1.8)
        ]
    )
}

@app.get("/envs", response_model=List[Environment])
async def get_environments(current_user: User = Depends(get_current_user)):
    """Get all environments for the authenticated user."""
    user_id = current_user.username
    if user_id not in environments:
        return []
    return list(environments[user_id].values())

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
    if user_id not in environments:
        raise HTTPException(status_code=404, detail="User not found")
    
    env = environments[user_id].get(env_name)
    if not env:
        raise HTTPException(status_code=404, detail="Environment not found")
    
    return env

@app.get("/{env_name}/returns", response_model=Optional[List[ReturnsData]])
async def get_environment_returns(
    env_name: str,
    current_user: User = Depends(get_current_user)
):
    """Get returns data for the specified environment."""
    user_id = current_user.username
    if user_id not in environments:
        raise HTTPException(status_code=404, detail="No environments found")
    
    env = environments[user_id].get(env_name)
    if not env:
        raise HTTPException(status_code=404, detail="Environment not found")
    
    # Return None for test2
    if env_name == "test2":
        return None
    
    # Generate dummy returns data
    returns_data = []
    current_date = env.start_date
    end_date = env.end_date
    
    while current_date <= end_date:
        daily_return = random.uniform(-2.0, 2.0)
        returns_data.append(ReturnsData(
            date=current_date,
            returns=daily_return
        ))
        current_date += timedelta(days=1)
    
    return returns_data

@app.get("/{env_name}/portfolio", response_model=Optional[List[PortfolioData]])
async def get_environment_portfolio(
    env_name: str,
    current_user: User = Depends(get_current_user)
):
    """Get portfolio data for the specified environment."""
    user_id = current_user.username
    if user_id not in environments:
        raise HTTPException(status_code=404, detail="No environments found")
    
    env = environments[user_id].get(env_name)
    if not env:
        raise HTTPException(status_code=404, detail="Environment not found")
    
    # Return None for test2
    if env_name == "test2":
        return None
    
    portfolio_data = []
    current_date = env.start_date
    end_date = env.end_date
    
    positions = {stock: random.uniform(-100, 100) for stock in env.stocks}
    
    while current_date <= end_date:
        for stock in positions:
            change = random.uniform(-5, 5)
            positions[stock] += change
            positions[stock] = max(min(positions[stock], 200), -200)
        
        portfolio_data.append(PortfolioData(
            date=current_date,
            positions=positions.copy()
        ))
        current_date += timedelta(days=1)
    
    return portfolio_data

@app.get("/{env_name}/trades", response_model=Optional[List[TradeData]])
async def get_environment_trades(
    env_name: str,
    current_user: User = Depends(get_current_user)
):
    """Get trades data for the specified environment."""
    user_id = current_user.username
    if user_id not in environments:
        raise HTTPException(status_code=404, detail="No environments found")
    
    env = environments[user_id].get(env_name)
    if not env:
        raise HTTPException(status_code=404, detail="Environment not found")
    
    # Return None for test2
    if env_name == "test2":
        return None
    
    trades_data = []
    current_date = env.start_date
    end_date = env.end_date
    
    while current_date <= end_date:
        if random.random() < 0.2:
            num_trades = random.randint(1, 3)
            for _ in range(num_trades):
                stock = random.choice(env.stocks)
                cash = random.uniform(1000, 10000)
                trade_type = random.choice([TradeType.LONG, TradeType.SHORT])
                
                trades_data.append(TradeData(
                    date=current_date,
                    stock=stock,
                    cash=cash,
                    type=trade_type
                ))
        
        current_date += timedelta(days=1)
    
    trades_data.sort(key=lambda x: x.date)
    return trades_data

@app.post("/{env_name}/backtest", status_code=status.HTTP_200_OK, response_class=Response)
async def run_backtest(
    env_name: str,
    current_user: User = Depends(get_current_user)
):
    """Trigger a backtest for the specified environment."""
    user_id = current_user.username
    if user_id not in environments:
        raise HTTPException(status_code=404, detail="No environments found")
    
    env = environments[user_id].get(env_name)
    if not env:
        raise HTTPException(status_code=404, detail="Environment not found")
    
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
    
    # Initialize user's environments if not exists
    if user_id not in environments:
        environments[user_id] = {}
    
    # Check if environment with this name already exists
    if request.name in environments[user_id]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Environment with this name already exists"
        )
    
    # Create new environment without strategies
    new_env = Environment(
        name=request.name,
        stocks=request.stocks,
        start_date=request.start_date,
        end_date=request.end_date,
        strategies=[]
    )
    
    # Save it
    environments[user_id][request.name] = new_env
    
    return Response(status_code=status.HTTP_200_OK)

@app.post("/{env_name}/strategies", status_code=status.HTTP_200_OK, response_class=Response)
async def add_strategy(
    env_name: str,
    request: AddStrategyRequest,
    current_user: User = Depends(get_current_user)
):
    """Add a strategy to an environment."""
    user_id = current_user.username
    
    # Check if user and environment exist
    if user_id not in environments:
        raise HTTPException(status_code=404, detail="No environments found")
    
    if env_name not in environments[user_id]:
        raise HTTPException(status_code=404, detail="Environment not found")
    
    env = environments[user_id][env_name]
    
    # Check if strategy with this name already exists
    if any(s.name == request.strategy.name for s in env.strategies):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Strategy with this name already exists in this environment"
        )
    
    # Add the strategy
    env.strategies.append(request.strategy)
    
    return Response(status_code=status.HTTP_200_OK)

@app.delete("/{env_name}/strategies/{strategy_name}", status_code=status.HTTP_200_OK, response_class=Response)
async def delete_strategy(
    env_name: str,
    strategy_name: str,
    current_user: User = Depends(get_current_user)
):
    """Delete a strategy from an environment."""
    user_id = current_user.username
    
    # Check if user and environment exist
    if user_id not in environments:
        raise HTTPException(status_code=404, detail="No environments found")
    
    if env_name not in environments[user_id]:
        raise HTTPException(status_code=404, detail="Environment not found")
    
    env = environments[user_id][env_name]
    
    # Find and remove the strategy
    strategy_index = next(
        (i for i, strategy in enumerate(env.strategies) if strategy.name == strategy_name),
        None
    )
    
    if strategy_index is None:
        raise HTTPException(status_code=404, detail="Strategy not found")
    
    env.strategies.pop(strategy_index)
    
    return Response(status_code=status.HTTP_200_OK)

@app.delete("/environments/{env_name}", status_code=status.HTTP_200_OK, response_class=Response)
async def delete_environment(
    env_name: str,
    current_user: User = Depends(get_current_user)
):
    """Delete an environment."""
    user_id = current_user.username
    
    if user_id not in environments:
        raise HTTPException(status_code=404, detail="No environments found")
    
    if env_name not in environments[user_id]:
        raise HTTPException(status_code=404, detail="Environment not found")
    
    # Delete the environment
    del environments[user_id][env_name]
    
    return Response(status_code=status.HTTP_200_OK)
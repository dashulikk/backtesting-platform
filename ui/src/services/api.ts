// Types
export interface Environment {
    name: string;
    stocks: string[];
    simulations: Simulation[];
}

export interface Simulation {
    name: string;
    start_date: string;
    end_date: string;
    strategies: Strategy[];
}

export interface Strategy {
    name: string;
    type: string;
    days?: number;
    n?: number;
    a?: number;
    b?: number;
}

export interface ReturnsData {
    date: string;
    returns: number;
}

export interface PortfolioData {
    date: string;
    positions: Record<string, number>;
}

export interface TradeData {
    date: string;
    stock: string;
    cash: number;
    type: 'Long' | 'Short';
}

export interface AuthToken {
    access_token: string;
    token_type: string;
}

class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

// Using direct values for now to eliminate any environment variable issues
const API_BASE_URL = 'http://127.0.0.1:8000';
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMSIsImV4cCI6MTc0NTMzNDM2MX0.LyO--4YA7RV4NE55alMErbKMiGkWvpPSjTPZYjsqvVI';

class Api {
    private baseUrl: string;
    private token: string;

    constructor() {
        this.baseUrl = API_BASE_URL;
        this.token = TEST_TOKEN;
        
        console.log('API Service Initialized:', {
            baseUrl: this.baseUrl,
            token: this.token
        });
    }

    private getHeaders(): HeadersInit {
        return {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        const contentType = response.headers.get('content-type');
        const isJson = contentType && contentType.includes('application/json');
        
        const text = await response.text();
        console.log('Raw API Response:', {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
            body: text
        });

        if (!response.ok) {
            throw new ApiError(
                response.status,
                `API Error: ${response.status} ${response.statusText}\nBody: ${text}`
            );
        }

        if (!text) {
            console.log('Empty response, returning empty array');
            return [] as T;
        }

        try {
            const data = JSON.parse(text);
            console.log('Parsed API Response:', data);
            return data;
        } catch (e) {
            console.error('Failed to parse JSON response:', e);
            throw new ApiError(500, `Invalid JSON response: ${text}`);
        }
    }

    async getEnvironments(): Promise<Environment[]> {
        const url = `${this.baseUrl}/envs`;
        console.log('Fetching environments:', {
            url,
            headers: this.getHeaders()
        });

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
                credentials: 'include'
            });

            const data = await this.handleResponse<Environment[]>(response);
            
            if (!Array.isArray(data)) {
                console.error('Invalid response format:', data);
                throw new Error('Server returned invalid data format');
            }

            return data;
        } catch (error) {
            console.error('Failed to fetch environments:', error);
            throw error;
        }
    }

    async createEnvironment(data: { name: string; stocks: string[] }): Promise<void> {
        const url = `${this.baseUrl}/environments`;
        console.log('Creating environment:', {
            url,
            data
        });

        const response = await fetch(url, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(data),
            credentials: 'include'
        });

        await this.handleResponse<void>(response);
    }

    async deleteEnvironment(envName: string): Promise<void> {
        const url = `${this.baseUrl}/environments/${envName}`;
        console.log('Deleting environment:', {
            url,
            envName
        });

        const response = await fetch(url, {
            method: 'DELETE',
            headers: this.getHeaders(),
            credentials: 'include'
        });

        await this.handleResponse<void>(response);
    }

    async getSimulation(envName: string, simulationName: string): Promise<Simulation> {
        const response = await fetch(`${this.baseUrl}/${envName}/${simulationName}`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<Simulation>(response);
    }

    async createSimulation(envName: string, simulation: {
        name: string;
        start_date: string;
        end_date: string;
        strategies: Strategy[];
    }): Promise<void> {
        const response = await fetch(`${this.baseUrl}/${envName}/simulations`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(simulation),
        });
        await this.handleResponse<void>(response);
    }

    async deleteSimulation(envName: string, simulationName: string): Promise<void> {
        const response = await fetch(`${this.baseUrl}/${envName}/simulations/${simulationName}`, {
            method: 'DELETE',
            headers: this.getHeaders(),
        });
        await this.handleResponse<void>(response);
    }

    async getReturns(envName: string, simulationName: string): Promise<ReturnsData[] | null> {
        const response = await fetch(`${this.baseUrl}/${envName}/${simulationName}/returns`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<ReturnsData[] | null>(response);
    }

    async getPortfolio(envName: string, simulationName: string): Promise<PortfolioData[] | null> {
        const response = await fetch(`${this.baseUrl}/${envName}/${simulationName}/portfolio`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<PortfolioData[] | null>(response);
    }

    async getTrades(envName: string, simulationName: string): Promise<TradeData[] | null> {
        const response = await fetch(`${this.baseUrl}/${envName}/${simulationName}/trades`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<TradeData[] | null>(response);
    }

    async runBacktest(envName: string, simulationName: string): Promise<void> {
        const response = await fetch(`${this.baseUrl}/${envName}/${simulationName}/backtest`, {
            method: 'POST',
            headers: this.getHeaders(),
        });
        await this.handleResponse<void>(response);
    }
}

export const api = new Api(); 
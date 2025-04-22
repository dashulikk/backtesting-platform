// API Configuration
const API_BASE_URL = 'http://127.0.0.1:8000';
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMSIsImV4cCI6MTc0NTMzNDM2MX0.LyO--4YA7RV4NE55alMErbKMiGkWvpPSjTPZYjsqvVI';

class Api {
    constructor() {
        this.baseUrl = API_BASE_URL;
        this.token = 'test-token-for-user1';
        this.backtestedEnvironments = new Set();
        
        console.log('API Service Initialized:', {
            baseUrl: this.baseUrl,
            token: this.token
        });
    }

    getHeaders() {
        return {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    async handleResponse(response) {
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
            throw new Error(`API Error: ${response.status} ${response.statusText}\nBody: ${text}`);
        }

        if (!text) {
            console.log('Empty response, returning null');
            return null;
        }

        try {
            const data = JSON.parse(text);
            console.log('Parsed API Response:', data);
            return data;
        } catch (e) {
            console.error('Failed to parse JSON response:', e);
            throw new Error(`Invalid JSON response: ${text}`);
        }
    }

    async getEnvironments() {
        const url = `${this.baseUrl}/envs`;
        console.log('Fetching environments:', {
            url,
            headers: this.getHeaders()
        });

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders()
            });

            const data = await this.handleResponse(response);
            
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

    async getEnvironmentReturns(envName) {
        const url = `${this.baseUrl}/${envName}/returns`;
        console.log('Fetching returns for environment:', {
            url,
            envName
        });

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders()
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('Failed to fetch returns:', error);
            throw error;
        }
    }

    async getEnvironmentPortfolio(envName) {
        const url = `${this.baseUrl}/${envName}/portfolio`;
        console.log('Fetching portfolio for environment:', {
            url,
            envName
        });

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders()
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('Failed to fetch portfolio:', error);
            throw error;
        }
    }

    async getEnvironmentTrades(envName) {
        const url = `${this.baseUrl}/${envName}/trades`;
        console.log('Fetching trades for environment:', {
            url,
            envName
        });

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders()
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('Failed to fetch trades:', error);
            throw error;
        }
    }

    async createEnvironment(data) {
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

        await this.handleResponse(response);
    }

    async deleteEnvironment(envName) {
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

        await this.handleResponse(response);
    }

    async getSimulation(envName, simulationName) {
        const url = `${this.baseUrl}/${envName}/${simulationName}`;
        console.log('Fetching simulation:', { url });
        
        const response = await fetch(url, {
            headers: this.getHeaders(),
            credentials: 'include'
        });
        return this.handleResponse(response);
    }

    async createSimulation(envName, data) {
        const url = `${this.baseUrl}/${envName}/simulations`;
        console.log('Creating simulation:', {
            url,
            envName,
            data
        });

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(data),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Failed to create simulation:', {
                    status: response.status,
                    statusText: response.statusText,
                    error: errorText
                });
                throw new Error(`Failed to create simulation: ${errorText}`);
            }

            await this.handleResponse(response);
            console.log('Simulation created successfully');
        } catch (error) {
            console.error('Error in createSimulation:', error);
            throw error;
        }
    }

    async deleteSimulation(envName, simulationName) {
        const url = `${this.baseUrl}/${envName}/simulations/${simulationName}`;
        console.log('Deleting simulation:', {
            url,
            simulationName
        });

        const response = await fetch(url, {
            method: 'DELETE',
            headers: this.getHeaders(),
            credentials: 'include'
        });

        await this.handleResponse(response);
    }

    async runBacktest(envName) {
        const url = `${this.baseUrl}/${envName}/backtest`;
        console.log('Running backtest:', {
            url,
            envName
        });

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: this.getHeaders(),
                credentials: 'include'
            });

            if (response.ok) {
                this.backtestedEnvironments.add(envName);
                console.log('Backtest completed for environment:', envName);
            }

            return response.ok;
        } catch (error) {
            console.error('Error running backtest:', error);
            return false;
        }
    }

    async hasBeenBacktested(envName) {
        const url = `${this.baseUrl}/${envName}/backtest`;
        console.log('Checking if environment has been backtested:', {
            url,
            envName
        });

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: this.getHeaders()
            });

            // If we get a 200 response, it means the environment has been backtested
            return response.ok;
        } catch (error) {
            console.error('Error checking backtest status:', error);
            return false;
        }
    }

    async getBacktestedEnvironments() {
        const allEnvs = await this.getEnvironments();
        const backtestedEnvs = [];

        for (const env of allEnvs) {
            // const isBacktested = await this.hasBeenBacktested(env.name);
            // console.log(`Environment ${env.name} backtested:`, isBacktested);
            // if (isBacktested) {
            //     backtestedEnvs.push(env);
            // }
            backtestedEnvs.push(env);
        }

        console.log('Backtested environments:', backtestedEnvs);
        return backtestedEnvs;
    }
}

export const api = new Api(); 
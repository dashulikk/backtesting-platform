// API Configuration
const API_BASE_URL = 'http://127.0.0.1:8000';
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMSIsImV4cCI6MTc0NTMzNDM2MX0.LyO--4YA7RV4NE55alMErbKMiGkWvpPSjTPZYjsqvVI';

class Api {
    constructor() {
        this.baseUrl = API_BASE_URL;
        this.token = TEST_TOKEN;
        
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
            throw new Error(
                `API Error: ${response.status} ${response.statusText}\nBody: ${text}`
            );
        }

        if (!text) {
            console.log('Empty response, returning empty array');
            return [];
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
                headers: this.getHeaders(),
                credentials: 'include'
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

        return this.handleResponse(response);
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

        return this.handleResponse(response);
    }
}

export const api = new Api(); 
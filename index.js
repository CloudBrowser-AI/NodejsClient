const puppeteer = require('puppeteer');

class CloudBrowserConnector {
    constructor(apiToken, body = null) {
        this.apiToken = apiToken;
        this.serverUrl = 'https://production.cloudbrowser.ai/api/v1/Browser/OpenAdvanced';
        this.body = body;
    }

    async connect() {
        try {
            const fetchOptions = {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiToken}`,
                    'Content-Type': 'application/json',
                },
                body: this.body ? JSON.stringify(this.body) : null,
            };

            const response = await fetch(this.serverUrl, fetchOptions);
            if (!response.ok) {
                throw new Error(`Failed to fetch WebSocket URL: ${response.statusText}`);
            }

            // Parse the JSON response to get the WebSocketDebuggerUrl
            const jsonResponse = await response.json();
            const WebSocketDebuggerUrl = jsonResponse.address;  // Extract the actual WebSocket URL

            const browser = await puppeteer.connect({
                browserWSEndpoint: WebSocketDebuggerUrl,
            });

            console.log('Connected to remote browser');
            return browser;
        } catch (error) {
            console.error('Error connecting to remote browser:', error);
            throw error;
        }
    }
}

module.exports = CloudBrowserConnector;

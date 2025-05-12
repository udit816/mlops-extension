import { IChatService, ChatResponse, ChatContext } from './types';
import fetch from 'cross-fetch'; // Use cross-fetch for better compatibility

export class ChatService implements IChatService {
    private apiBaseUrl: string;

    constructor(apiBaseUrl: string) {
        this.apiBaseUrl = apiBaseUrl;
    }

    async processMessage(message: string, context?: ChatContext): Promise<ChatResponse> {
        try {
            const response = await fetch(`${this.apiBaseUrl}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message,
                    context
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.statusText}`);
            }

            return await response.json() as ChatResponse;
        } catch (error) {
            console.error('Chat service error:', error);
            throw error;
        }
    }
}
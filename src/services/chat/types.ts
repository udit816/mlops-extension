// src/services/chat/types.ts

// This interface is good for frontend message display
export interface ChatMessage {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
}

// Update ChatContext to match Flask API naming convention
export interface ChatContext {
    persona?: string;
    current_flow?: string;  // Changed from currentFlow to match Python snake_case
    flow_config?: Record<string, any>;  // Changed from flowConfig to match Python snake_case
}

// Expand ChatResponse to include more specific types and error handling
export interface ChatResponse {
    message: string;
    action?: string;
    context?: ChatContext;
    status?: 'success' | 'error';  // Added to handle API status
    error?: string;  // Added to handle error messages
}

// Add specific action types for better type safety
export enum ChatAction {
    CREATE_TRAINING_PIPELINE = 'CREATE_TRAINING_PIPELINE',
    CREATE_INFERENCE_PIPELINE = 'CREATE_INFERENCE_PIPELINE',
    VIEW_PIPELINES = 'VIEW_PIPELINES'
}

// Add flow types for better type safety
export enum ChatFlow {
    GREETING = 'GREETING',
    PERSONA_SELECTION = 'PERSONA_SELECTION',
    TASK_SELECTION = 'TASK_SELECTION',
    PIPELINE_CONFIG = 'PIPELINE_CONFIG'
}

// Add persona types for better type safety
export enum ChatPersona {
    MLOPS_ENGINEER = 'MLOps Engineer',
    DATA_SCIENTIST = 'Data Scientist',
    DEVELOPER = 'Developer'
}

// The service interface remains the same but with added type safety
export interface IChatService {
    processMessage(message: string, context?: ChatContext): Promise<ChatResponse>;
    // Add optional methods that might be useful
    clearContext?(): void;
    getHistory?(): ChatMessage[];
}
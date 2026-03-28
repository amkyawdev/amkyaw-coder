/**
 * OpenHands API Client
 * Handles communication with OpenHands Cloud API
 */

export interface OpenHandsConfig {
  baseUrl: string
  apiKey: string
}

export interface ConversationRequest {
  initial_user_msg: string
  repository: string
}

export interface ConversationResponse {
  conversation_id: string
  status: string
}

export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: string
}

export class OpenHandsClient {
  private baseUrl: string
  private apiKey: string

  constructor(config: OpenHandsConfig) {
    this.baseUrl = config.baseUrl
    this.apiKey = config.apiKey
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    }
  }

  async startConversation(
    message: string,
    repository: string
  ): Promise<ConversationResponse> {
    const response = await fetch(`${this.baseUrl}/api/conversations`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        initial_user_msg: message,
        repository,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to start conversation: ${response.status}`)
    }

    return response.json()
  }

  async getConversationStatus(conversationId: string) {
    const response = await fetch(
      `${this.baseUrl}/api/conversations?id=${conversationId}`,
      {
        headers: this.getHeaders(),
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to get status: ${response.status}`)
    }

    return response.json()
  }

  async streamStartConversation(
    message: string,
    repository: string,
    onMessage: (data: any) => void
  ) {
    const response = await fetch(
      `${this.baseUrl}/api/v1/app-conversations/stream-start`,
      {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          initial_message: {
            content: [{ type: 'text', text: message }],
          },
          selected_repository: repository,
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to start stream: ${response.status}`)
    }

    const reader = response.body?.getReader()
    if (!reader) return

    const decoder = new TextDecoder()
    
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      
      const chunk = decoder.decode(value)
      const lines = chunk.split('\n').filter(Boolean)
      
      for (const line of lines) {
        try {
          const data = JSON.parse(line)
          onMessage(data)
        } catch {
          // Skip non-JSON lines
        }
      }
    }
  }
}

// Default client instance
export const createOpenHandsClient = (apiKey?: string) => {
  return new OpenHandsClient({
    baseUrl: process.env.NEXT_PUBLIC_OPENHANDS_URL || 'https://app.all-hands.dev',
    apiKey: apiKey || process.env.OPENHANDS_API_KEY || '',
  })
}
import axios from 'axios'
import { config } from '../config'

export interface OpenHandsConversationRequest {
  initial_user_msg: string
  repository: string
}

export interface OpenHandsConversationResponse {
  conversation_id: string
  status: string
}

export interface OpenHandsStartTaskResponse {
  id: string
  status: string
  app_conversation_id?: string
  sandbox_id?: string
  created_at: string
}

class OpenHandsService {
  private baseUrl: string
  private apiKey: string

  constructor() {
    this.baseUrl = config.openhands.baseUrl
    this.apiKey = config.openhands.apiKey
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    }
  }

  /**
   * Start a new conversation with OpenHands
   */
  async startConversation(
    message: string,
    repository: string
  ): Promise<OpenHandsConversationResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/api/conversations`,
        {
          initial_user_msg: message,
          repository,
        },
        { headers: this.getHeaders() }
      )
      return response.data
    } catch (error) {
      console.error('OpenHands start conversation error:', error)
      throw new Error('Failed to start conversation with AI')
    }
  }

  /**
   * Start conversation with streaming (V1 API)
   */
  async startConversationStream(
    message: string,
    repository: string
  ): Promise<OpenHandsStartTaskResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/api/v1/app-conversations/stream-start`,
        {
          initial_message: {
            content: [{ type: 'text', text: message }],
          },
          selected_repository: repository,
        },
        { headers: this.getHeaders() }
      )
      return response.data
    } catch (error) {
      console.error('OpenHands stream start error:', error)
      throw new Error('Failed to start streaming conversation')
    }
  }

  /**
   * Get conversation status
   */
  async getConversationStatus(conversationId: string) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/api/conversations?id=${conversationId}`,
        { headers: this.getHeaders() }
      )
      return response.data
    } catch (error) {
      console.error('OpenHands get status error:', error)
      throw new Error('Failed to get conversation status')
    }
  }

  /**
   * Get start task status (V1 API)
   */
  async getStartTaskStatus(taskId: string) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/api/v1/app-conversations/start-tasks?ids=${taskId}`,
        { headers: this.getHeaders() }
      )
      return response.data
    } catch (error) {
      console.error('OpenHands get task status error:', error)
      throw new Error('Failed to get task status')
    }
  }

  /**
   * Poll conversation until completion
   */
  async pollUntilComplete(
    conversationId: string,
    onProgress?: (status: string) => void,
    maxAttempts: number = 120,
    interval: number = 30000
  ): Promise<any> {
    let attempts = 0

    while (attempts < maxAttempts) {
      const status = await this.getConversationStatus(conversationId)
      
      onProgress?.(status.execution_status || status.status)

      if (['finished', 'error', 'stuck'].includes(status.execution_status)) {
        return status
      }

      await new Promise(resolve => setTimeout(resolve, interval))
      attempts++
    }

    throw new Error('Conversation polling timeout')
  }
}

export const openHandsService = new OpenHandsService()
/**
 * OpenHands API Types
 */

export type ConversationStatus = 
  | 'WORKING'
  | 'WAITING_FOR_SANDBOX'
  | 'PREPARING_REPOSITORY'
  | 'SETTING_UP_SKILLS'
  | 'READY'
  | 'ERROR'

export type ExecutionStatus = 
  | 'RUNNING'
  | 'idle'
  | 'running'
  | 'paused'
  | 'waiting_for_confirmation'
  | 'finished'
  | 'error'
  | 'stuck'

export type SandboxStatus = 
  | 'STARTING'
  | 'RUNNING'
  | 'PAUSED'
  | 'ERROR'
  | 'MISSING'

export interface StartTask {
  id: string
  status: ConversationStatus
  app_conversation_id?: string
  sandbox_id?: string
  created_at: string
  error?: string
}

export interface AppConversation {
  id: string
  app_conversation_id?: string
  sandbox_status?: SandboxStatus
  execution_status?: ExecutionStatus
  selected_repository?: string
  title?: string
  created_at?: string
}

export interface StartConversationRequest {
  initial_message: {
    content: Array<{
      type: 'text' | 'image'
      text?: string
      image_url?: string
    }>
  }
  selected_repository: string
}

export interface StartConversationResponse {
  id: string
  status: string
  app_conversation_id?: string
  sandbox_id?: string
  created_at: string
}

export interface MessageContent {
  type: 'text' | 'image'
  text?: string
  image_url?: string
}

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: string
}

export interface FileTreeItem {
  name: string
  type: 'file' | 'directory'
  path: string
  children?: FileTreeItem[]
}

export interface EditorState {
  files: FileTreeItem[]
  activeFile: string | null
  content: string
}

export interface TerminalLine {
  type: 'input' | 'output' | 'error'
  content: string
  timestamp: Date
}
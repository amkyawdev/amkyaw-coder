import mongoose, { Schema, Document } from 'mongoose'

export interface ISession extends Document {
  projectId: mongoose.Types.ObjectId
  conversationId: string
  messages: Array<{
    role: 'user' | 'assistant' | 'system'
    content: string
    timestamp: Date
  }>
  status: 'active' | 'completed' | 'error'
  createdAt: Date
  updatedAt: Date
}

const SessionSchema = new Schema<ISession>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    conversationId: { type: String, required: true },
    messages: [
      {
        role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    status: { type: String, enum: ['active', 'completed', 'error'], default: 'active' },
  },
  { timestamps: true }
)

export const Session = mongoose.model<ISession>('Session', SessionSchema)
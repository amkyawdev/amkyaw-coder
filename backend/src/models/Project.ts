import mongoose, { Schema, Document } from 'mongoose'

export interface IProject extends Document {
  userId: mongoose.Types.ObjectId
  name: string
  description?: string
  githubRepo?: string
  files: Array<{
    name: string
    path: string
    content: string
    type: string
  }>
  createdAt: Date
  updatedAt: Date
}

const ProjectSchema = new Schema<IProject>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String },
    githubRepo: { type: String },
    files: [
      {
        name: { type: String, required: true },
        path: { type: String, required: true },
        content: { type: String, default: '' },
        type: { type: String, default: 'file' },
      },
    ],
  },
  { timestamps: true }
)

export const Project = mongoose.model<IProject>('Project', ProjectSchema)
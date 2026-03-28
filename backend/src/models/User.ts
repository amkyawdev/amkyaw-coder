import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  email: string
  password: string
  name: string
  githubToken?: string
  openHandsApiKey?: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    githubToken: { type: String },
    openHandsApiKey: { type: String },
  },
  { timestamps: true }
)

export const User = mongoose.model<IUser>('User', UserSchema)
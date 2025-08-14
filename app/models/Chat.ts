import mongoose, { Model } from 'mongoose';
import { IMessage, IConversation } from '../types/models';

const messageSchema = new mongoose.Schema<IMessage>({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  attachments: [{
    type: { type: String },
    url: { type: String },
    mimeType: { type: String }
  }],
  createdAt: { type: Date, default: Date.now }
});

const conversationSchema = new mongoose.Schema<IConversation>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  lastMessageAt: { type: Date, default: Date.now }
});

export const Message: Model<IMessage> = mongoose.models.Message || mongoose.model('Message', messageSchema);
export const Conversation: Model<IConversation> = mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);

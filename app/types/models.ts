import { Types } from 'mongoose';

export interface IMessage {
  conversationId: Types.ObjectId;
  role: 'user' | 'assistant';
  content: string;
  attachments?: Array<{
    type: string;
    url: string;
    mimeType: string;
  }>;
  createdAt: Date;
}

export interface IConversation {
  userId: Types.ObjectId;
  title: string;
  createdAt: Date;
  lastMessageAt: Date;
}

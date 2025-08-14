import { NextRequest } from 'next/server';
import { chatModel } from '@/app/env';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { Message, Conversation } from '../../../models/Chat';
import { connectToDatabase } from '@/app/lib/mongodb';
import { HydratedDocument } from 'mongoose';
import { IMessage, IConversation } from '../../../types/models';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    await connectToDatabase();
    const { prompt, conversationId } = await req.json();
    
    // Create a new conversation if none exists
    let conversation: HydratedDocument<IConversation>;
    
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return new Response('Conversation not found', { status: 404 });
      }
    } else {
      conversation = await Conversation.create({
        userId: session.user.id,
        title: prompt.slice(0, 30) + '...',
        lastMessageAt: new Date()
      });
    }

    // Save user message
    await Message.create({
      conversationId: conversation._id,
      role: 'user',
      content: prompt,
      createdAt: new Date()
    } as IMessage);

    // Stream response
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    // Start chat with AI
    const chat = await chatModel.startChat();
    const response = await chat.sendMessageStream(prompt);

    // Process the stream
    (async () => {
      try {
        let fullResponse = '';
        for await (const chunk of response.stream) {
          const text = chunk.text();
          fullResponse += text;
          await writer.write(encoder.encode(text));
        }
        
        // Save assistant message
        await Message.create({
          conversationId: conversation._id,
          role: 'assistant',
          content: fullResponse,
          createdAt: new Date()
        } as IMessage);
        
        writer.close();
      } catch (error) {
        console.error('Stream processing error:', error);
        writer.abort(error);
      }
    })();

    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

import { NextRequest } from 'next/server';
import { chatModel } from '../../../../app/env';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { Message, Conversation } from '../../../models/Chat';
import { connectToDatabase } from '../../../lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    await connectToDatabase();
    const { prompt, conversationId } = await req.json();
    
    // Create a new conversation if none exists
    let conversation = conversationId ? 
      await Conversation.findById(conversationId) :
      await Conversation.create({
        userId: session.user.id,
        title: prompt.slice(0, 30) + '...'
      });

    // Save user message
    await Message.create({
      conversationId: conversation._id,
      role: 'user',
      content: prompt
    });

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
        for await (const chunk of response.stream) {
          const text = chunk.text();
          await writer.write(encoder.encode(text));
        }
        
        // Save assistant message
        await Message.create({
          conversationId: conversation._id,
          role: 'assistant',
          content: await response.response.text()
        });
        
        writer.close();
      } catch (error) {
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

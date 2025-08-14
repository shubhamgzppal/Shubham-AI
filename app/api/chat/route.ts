import { NextResponse } from 'next/server'
import { chatModel, fallbackChatModel } from '../../env'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const { message } = body ?? {}

  if (!message) 
    return NextResponse.json({ error: 'Message is required' }, { status: 400 })

  const generate = async (msg: string) => {
    try {
      return await chatModel.generateContent(msg)
    } catch (err: any) {
      if (err.code === 429) return await fallbackChatModel.generateContent(msg)
      throw err
    }
  }

  try {
    const result = await generate(message)
    const response = await result.response
    return NextResponse.json({ text: response.text(), timestamp: new Date().toISOString() })
  } catch (error: any) {
    const isGeminiError = error.message?.includes('GoogleGenerativeAI') || error.message?.includes('API')
    return new Response(JSON.stringify({
      error: isGeminiError ? `AI service error: ${error.message}` : `Request failed: ${error.message}`
    }), {
      status: isGeminiError ? 503 : 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

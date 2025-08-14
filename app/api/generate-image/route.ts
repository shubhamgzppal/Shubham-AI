import { NextResponse } from 'next/server'
import { imageModel } from '../../env'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const prompt = formData.get('prompt')?.toString()
    if (!prompt) return NextResponse.json({ error: 'Prompt required' }, { status: 400 })

    const imageFile = formData.get('image') as File | null
    const parts = [
      ...(imageFile ? [{
        inlineData: {
          mimeType: imageFile.type || 'image/png',
          data: Buffer.from(await imageFile.arrayBuffer()).toString('base64'),
        }
      }] : []),
      { text: prompt }
    ]

    const res = await imageModel.generateContent({
      contents: [{ role: 'user', parts }],
      generationConfig: { responseModalities: ['IMAGE', 'TEXT'] },
    });

    const c = res.response.candidates?.[0]?.content?.parts || []
    const img = c.find((p: any) => p.inlineData)?.inlineData?.data
    if (!img) throw new Error('No image generated')

    return NextResponse.json({
      imageUrl: `data:image/png;base64,${img}`,
      text: c.find((p: any) => p.text)?.text || 'Image generated',
      timestamp: new Date().toISOString()
    })
  } catch (e: any) {
    return NextResponse.json({ error: 'Image generation failed: ' + (e.message || '') }, { status: 500 })
  }
}

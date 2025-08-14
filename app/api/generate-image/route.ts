import { NextResponse } from 'next/server';
import { imageModel } from '../../env';
import { Part } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const prompt = formData.get('prompt')?.toString();
    if (!prompt) return NextResponse.json({ error: 'Prompt required' }, { status: 400 });

    const imageFile = formData.get('image') as File | null;
    const contentParts: Part[] = [];
    
    if (imageFile) {
      const imageData = Buffer.from(await imageFile.arrayBuffer()).toString('base64');
      contentParts.push({
        inlineData: {
          data: imageData,
          mimeType: imageFile.type || 'image/png'
        }
      });
    }
    
    contentParts.push({ text: prompt });

    const res = await imageModel.generateContent(contentParts);

    const response = await res.response;
    const responseParts = response.candidates?.[0]?.content?.parts;
    
    if (!responseParts) {
      throw new Error('No content generated');
    }

    const imagePart = responseParts.find((p) => 'inlineData' in p && p.inlineData);
    const textPart = responseParts.find((p) => 'text' in p && p.text);

    if (!imagePart?.inlineData?.data) {
      throw new Error('No image generated');
    }

    return NextResponse.json({
      imageUrl: `data:image/png;base64,${imagePart.inlineData.data}`,
      text: textPart?.text || 'Image generated',
      timestamp: new Date().toISOString()
    });
  } catch (e: any) {
    console.error('Image generation error:', e);
    return NextResponse.json({ 
      error: 'Image generation failed: ' + (e.message || '') 
    }, { 
      status: 500 
    });
  }
}

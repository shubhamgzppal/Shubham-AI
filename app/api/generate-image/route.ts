import { NextResponse } from 'next/server';
import { imageModel } from '../../env';
import { Part, GenerateContentRequest } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const prompt = formData.get('prompt')?.toString();
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt required' }, { status: 400 });
    }

    const contentParts: Part[] = [];

    // If an image is uploaded, add it as input
    const imageFile = formData.get('image') as File | null;
    if (imageFile) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const base64Image = Buffer.from(arrayBuffer).toString('base64');
      contentParts.push({
        inlineData: {
          mimeType: imageFile.type || 'image/png',
          data: base64Image,
        },
      });
    }

    // Add the prompt last (order matters: image first, then prompt)
    contentParts.push({ text: prompt });

    // Generate content using the Gemini multimodal model
    const request: GenerateContentRequest = {
      contents: [
        {
          role: 'user',
          parts: contentParts,
        },
      ],
      generationConfig: {
        temperature: 0.4,
        responseModalities: ['IMAGE', 'TEXT'],
      },
    };

    const result = await imageModel.generateContentStream(request);

    const response = await result.response;
    let parts = response.candidates?.[0]?.content?.parts;

    // If the streamed response didn't include an image, try a non-stream request as a fallback
    if (!parts || parts.length === 0 || !parts.find((p) => 'inlineData' in p && p.inlineData?.data)) {
      console.warn('No image found in stream response — attempting non-stream generateContent fallback');
      try {
        const nonStream = await imageModel.generateContent(request as any);
        const nonResp = await nonStream.response;
        parts = nonResp.candidates?.[0]?.content?.parts;
      } catch (fallbackErr) {
        console.error('Fallback generateContent failed:', fallbackErr);
      }
    }

    if (!parts || parts.length === 0) {
      console.error('No content parts returned. Stream response:', response);
      throw new Error('No content generated');
    }

    const imagePart = parts.find((p) => 'inlineData' in p && p.inlineData?.data);
    const textPart = parts.find((p) => 'text' in p && p.text);

    if (!imagePart?.inlineData?.data) {
      throw new Error('No image generated');
    }

    return NextResponse.json({
      imageUrl: `data:image/png;base64,${imagePart.inlineData.data}`,
      text: textPart?.text || 'Image generated',
      timestamp: new Date().toISOString(),
    });

  } catch (e: any) {
    console.error('Image generation error:', e);
    return NextResponse.json(
      {
        error: 'Image generation failed: ' + (e.message || 'Unknown error'),
      },
      { status: 500 }
    );
  }
}

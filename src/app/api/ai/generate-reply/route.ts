import { mistralAI } from '@/lib/mistral'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()

    const response = await mistralAI.agents.complete({
      agentId: "ag:6b3eeca6:20250207:social-media-comment-reply-automation-assistant:0f3e8528",
      messages: [
        {
          role: 'user',
          content: prompt || 'Generate a short, engaging social media reply notifying the user that their requested details have been sent via direct message. Ensure the response is concise, friendly, and varied in phrasing while including a clear call to action and a relevant emoji. Avoid repetitive wording across different responses.'
        }
      ],
    })

    const generatedMessage = response.choices[0].message.content

    return NextResponse.json({ message: generatedMessage })
  } catch (error) {
    console.error('Error generating AI response:', error)
    return NextResponse.json(
      { error: 'Failed to generate AI response' },
      { status: 500 }
    )
  }
} 
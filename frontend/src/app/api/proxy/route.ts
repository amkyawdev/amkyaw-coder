import { NextRequest, NextResponse } from 'next/server'

const OPENHANDS_API_URL = process.env.NEXT_PUBLIC_OPENHANDS_URL || 'https://app.all-hands.dev'
const OPENHANDS_API_KEY = process.env.OPENHANDS_API_KEY || ''

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, projectId } = body

    // Call OpenHands API
    const response = await fetch(`${OPENHANDS_API_URL}/api/conversations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENHANDS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        initial_user_msg: message,
        repository: `project-${projectId}`,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenHands API error: ${response.status}`)
    }

    const data = await response.json()

    // Return conversation ID for polling
    return NextResponse.json({
      conversation_id: data.conversation_id,
      status: data.status,
    })
  } catch (error) {
    console.error('OpenHands proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to connect to AI service' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const conversationId = searchParams.get('conversation_id')

  if (!conversationId) {
    return NextResponse.json({ error: 'Missing conversation_id' }, { status: 400 })
  }

  try {
    const response = await fetch(
      `${OPENHANDS_API_URL}/api/conversations?id=${conversationId}`,
      {
        headers: {
          'Authorization': `Bearer ${OPENHANDS_API_KEY}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`OpenHands API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('OpenHands status error:', error)
    return NextResponse.json(
      { error: 'Failed to get conversation status' },
      { status: 500 }
    )
  }
}
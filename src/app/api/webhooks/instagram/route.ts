import { findAutomation } from '@/actions/automations/queries'
import {
  createChatHistory,
  getChatHistory,
  getKeywordAutomation,
  getKeywordPost,
  getRandomReplyMessage,
  matchKeyword,
  trackResponses,
} from '@/actions/webhook/queries'
import { sendDM, sendPrivateMessage, replyToComment } from '@/lib/fetch'
import { mistralAI } from '@/lib/mistral'
import { client } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { ACTION_TYPE } from '@prisma/client'

interface KeywordMatch {
  id: string;
  triggerId: string;
  word: string;
}

interface WebhookPayload {
  entry: Array<{
    id: string;
    messaging?: Array<{
      sender: { id: string };
      recipient: { id: string };
      message?: {
        text?: string;
        is_echo?: boolean;
      };
    }>;
    changes?: Array<{
      field: string;
      value: {
        id: string;
        text?: string;
        from: { id: string };
        media?: {
          id: string;
        };
      };
    }>;
  }>;
}

export async function GET(req: NextRequest) {
  const hub = req.nextUrl.searchParams.get('hub.challenge')
  return new NextResponse(hub)
}

export async function POST(req: NextRequest) {
  const webhook_payload = await req.json() as WebhookPayload
  let matcher: KeywordMatch | null = null
  
  try {
    // Handle direct messages
    if (webhook_payload.entry[0].messaging) {
      if (webhook_payload.entry[0].messaging[0]?.message?.is_echo) {
        return NextResponse.json({ message: 'Echo message skipped' }, { status: 200 })
      }

      if (!webhook_payload.entry[0].messaging[0]?.message?.text) {
        return NextResponse.json({ message: 'Empty message skipped' }, { status: 200 })
      }

      console.log('🔍 Processing messaging webhook:', {
        messageType: 'messaging',
        messageContent: webhook_payload.entry[0].messaging[0]?.message?.text,
        senderId: webhook_payload.entry[0].messaging[0]?.sender?.id,
        timestamp: new Date().toISOString()
      })
      
      matcher = await matchKeyword(
        webhook_payload.entry[0].messaging[0].message.text
      )
      console.log('Keyword matcher result:', matcher)
    }

    // Handle comment changes
    if (webhook_payload.entry[0].changes) {
      if (!webhook_payload.entry[0].changes[0]?.value?.text) {
        return NextResponse.json({ message: 'Empty change skipped' }, { status: 200 })
      }

      console.log('🔍 Processing changes webhook:', {
        changeType: 'changes',
        changeContent: webhook_payload.entry[0].changes[0]?.value?.text,
        timestamp: new Date().toISOString()
      })
      
      matcher = await matchKeyword(
        webhook_payload.entry[0].changes[0].value.text
      )

      if (matcher) {
        console.log('Matched keyword for automation:', matcher.triggerId)
        
        const automation = await getKeywordAutomation(
          matcher.triggerId,
          false // Set to false for comment handling
        )

        if (!automation) {
          console.log('No valid automation found for trigger ID:', matcher.triggerId)
          return NextResponse.json(
            {
              message: 'No valid automation found',
              triggerId: matcher.triggerId
            },
            { status: 200 }
          )
        }

        console.log('Found automation:', {
          id: automation.id,
          type: automation.listener?.type,
          subscription: automation.User?.subscription?.plan
        })

        if (automation?.trigger && automation.listener) {
          const commentId = webhook_payload.entry[0].changes[0].value.id
          const token = automation.User?.integrations[0].token

          // Handle both message action and comment reply
          if (automation.listener.type === ACTION_TYPE.MESSAGE) {
            console.log('Processing MESSAGE listener for comment')
            
            // 1. Send DM to the user
            if (automation.listener.message && token) {
              const direct_message = await sendDM(
                webhook_payload.entry[0].id,
                webhook_payload.entry[0].changes[0].value.from.id,
                automation.listener.message,
                token
              )

              if (direct_message.status === 200) {
                console.log('MESSAGE: DM sent successfully')
                await trackResponses(automation.id, 'DM')
              }
            }

            // 2. Reply to the comment with a random message
            const replyMessage = await getRandomReplyMessage(matcher.triggerId)
            if (replyMessage && token) {
              console.log('Attempting to reply to comment:', {
                commentId,
                messageLength: replyMessage.length,
                tokenAvailable: !!token
              })

              const comment_reply = await replyToComment(
                commentId,
                replyMessage,
                token
              )

              if (comment_reply.status === 200) {
                console.log('MESSAGE: Comment reply sent successfully')
                await trackResponses(automation.id, 'COMMENT')
                return NextResponse.json(
                  {
                    message: 'DM and comment reply sent successfully',
                  },
                  { status: 200 }
                )
              } else {
                console.error('Failed to reply to comment:', {
                  status: comment_reply.status,
                  error: comment_reply.data?.error,
                  commentId
                })
                // Continue execution to return success for DM sent
                return NextResponse.json(
                  {
                    message: 'DM sent successfully, but comment reply failed',
                    error: comment_reply.data?.error
                  },
                  { status: 200 }
                )
              }
            }
          }
        }
      }
    }

    // Log no match for direct messages
    if (!matcher && 
        webhook_payload.entry[0].messaging && 
        !webhook_payload.entry[0].messaging[0]?.message?.is_echo && 
        webhook_payload.entry[0].messaging[0]?.message?.text) {
      console.log('ℹ️ No keyword match for message:', {
        timestamp: new Date().toISOString(),
        messageContent: webhook_payload.entry[0].messaging[0].message.text
      })
    }

    // Handle matched keywords
    if (matcher) {
      console.log('Matched keyword for automation:', matcher.triggerId)
      
      // Handle direct messages
      if (webhook_payload.entry[0].messaging) {
        const automation = await getKeywordAutomation(
          matcher.triggerId,
          true
        )
        
        if (!automation) {
          console.log('No valid automation found for trigger ID:', matcher.triggerId)
          return NextResponse.json(
            {
              message: 'No valid automation found',
              triggerId: matcher.triggerId
            },
            { status: 200 }
          )
        }
        
        console.log('Found automation:', {
          id: automation.id,
          type: automation.listener?.type,
          subscription: automation.User?.subscription?.plan
        })

        if (automation?.trigger && automation.listener) {
          // Handle message action
          if (automation.listener.type === ACTION_TYPE.MESSAGE) {
            console.log('Processing MESSAGE listener')
            const direct_message = await sendDM(
              webhook_payload.entry[0].id,
              webhook_payload.entry[0].messaging[0].sender.id,
              automation.listener.message || '',
              automation.User?.integrations[0].token!
            )

            if (direct_message.status === 200) {
              console.log('MESSAGE: DM sent successfully')
              const tracked = await trackResponses(automation.id, 'DM')
              if (tracked) {
                return NextResponse.json(
                  {
                    message: 'Message sent',
                  },
                  { status: 200 }
                )
              }
            }
          }

          // Handle AI action
          if (
            automation.listener.type === ACTION_TYPE.OMNIAI &&
            automation.User?.subscription?.plan === 'PRO'
          ) {
            console.log('Starting Omni AI processing')
            try {
              const omni_ai_message = await mistralAI.chat.complete({
                model: 'mistral-large-latest',
                messages: [
                  {
                    role: 'system',
                    content: automation.listener.prompt || 'You are a helpful assistant'
                  },
                  {
                    role: 'user',
                    content: webhook_payload.entry[0]?.messaging?.[0]?.message?.text || ''
                  }
                ],
              })
              
              console.log('Omni AI response received:', omni_ai_message.choices[0].message.content)

              if (
                omni_ai_message.choices[0]?.message?.content && 
                webhook_payload.entry[0]?.messaging?.[0]?.message?.text &&
                webhook_payload.entry[0]?.messaging?.[0]?.sender?.id &&
                automation.User?.integrations?.[0]?.token
              ) {
                const senderId = webhook_payload.entry[0].messaging[0].sender.id
                const messageText = webhook_payload.entry[0].messaging[0].message.text
                const entryId = webhook_payload.entry[0].id
                const aiResponse = omni_ai_message.choices[0].message.content
                const token = automation.User.integrations[0].token as string

                console.log('Creating chat history')
                await client.$transaction(async (tx) => {
                  await createChatHistory(
                    automation.id,
                    entryId,
                    senderId,
                    messageText
                  )

                  await createChatHistory(
                    automation.id,
                    entryId,
                    senderId,
                    aiResponse
                  )
                })
                console.log('Chat history created')

                console.log('Sending DM with Omni AI response')
                const direct_message = await sendDM(
                  entryId,
                  senderId,
                  aiResponse,
                  token
                )

                if (direct_message.status === 200) {
                  console.log('DM sent successfully')
                  const tracked = await trackResponses(automation.id, 'DM')
                  if (tracked) {
                    return NextResponse.json(
                      {
                        message: 'Message sent',
                      },
                      { status: 200 }
                    )
                  }
                }
              }
            } catch (error) {
              console.error('Error in Omni AI processing:', error)
              return NextResponse.json(
                {
                  message: 'Error processing Omni AI request',
                  error: error instanceof Error ? error.message : 'Unknown error'
                },
                { status: 500 }
              )
            }
          }
        }
      }

      // Handle comment changes
      if (
        webhook_payload.entry[0].changes &&
        webhook_payload.entry[0].changes[0].field === 'comments'
      ) {
        const automation = await getKeywordAutomation(
          matcher.triggerId,
          false
        )

        if (!automation) {
          console.log('No valid automation found for trigger ID:', matcher.triggerId)
          return NextResponse.json(
            {
              message: 'No valid automation found',
              triggerId: matcher.triggerId
            },
            { status: 200 }
          )
        }

        console.log('Found automation:', {
          id: automation.id,
          type: automation.listener?.type,
          subscription: automation.User?.subscription?.plan
        })

        if (automation?.trigger && automation.listener && webhook_payload.entry[0].changes[0].value.media) {
          const automations_post = await getKeywordPost(
            webhook_payload.entry[0].changes[0].value.media.id,
            automation.id
          )

          console.log('Found keyword post:', automations_post)

          if (automations_post) {
            // Handle message action for comments
            if (automation.listener.type === ACTION_TYPE.MESSAGE) {
              console.log(
                'SENDING DM, WEBHOOK PAYLOAD:',
                webhook_payload,
                'changes:',
                webhook_payload.entry[0].changes[0].value.from
              )

              console.log(
                'COMMENT VERSION:',
                webhook_payload.entry[0].changes[0].value.from.id
              )

              const direct_message = await sendPrivateMessage(
                webhook_payload.entry[0].id,
                webhook_payload.entry[0].changes[0].value.id,
                automation.listener.message || '',
                automation.User?.integrations[0].token!
              )

              console.log('DM SENT:', direct_message.data)
              if (direct_message.status === 200) {
                const tracked = await trackResponses(automation.id, 'COMMENT')

                if (tracked) {
                  return NextResponse.json(
                    {
                      message: 'Message sent',
                    },
                    { status: 200 }
                  )
                }
              }
            }

            // Handle AI action for comments
            if (
              automation.listener.type === ACTION_TYPE.OMNIAI &&
              automation.User?.subscription?.plan === 'PRO'
            ) {
              const omni_ai_message = await mistralAI.chat.complete({
                model: 'mistral-large-latest',
                messages: [
                  {
                    role: 'assistant',
                    content: `${automation.listener.prompt || ''}: keep responses under 2 sentences`,
                  },
                ],
              })

              if (
                omni_ai_message.choices[0]?.message?.content && 
                webhook_payload.entry[0]?.changes?.[0]?.value?.text &&
                webhook_payload.entry[0]?.changes?.[0]?.value?.from?.id &&
                automation.User?.integrations?.[0]?.token
              ) {
                const fromId = webhook_payload.entry[0].changes[0].value.from.id
                const commentText = webhook_payload.entry[0].changes[0].value.text
                const entryId = webhook_payload.entry[0].id
                const aiResponse = omni_ai_message.choices[0].message.content
                const token = automation.User.integrations[0].token as string

                await client.$transaction(async (tx) => {
                  await createChatHistory(
                    automation.id,
                    entryId,
                    fromId,
                    commentText
                  )

                  await createChatHistory(
                    automation.id,
                    entryId,
                    fromId,
                    aiResponse
                  )
                })

                const direct_message = await sendPrivateMessage(
                  entryId,
                  fromId,
                  aiResponse,
                  token
                )

                if (direct_message.status === 200) {
                  const tracked = await trackResponses(automation.id, 'COMMENT')

                  if (tracked) {
                    return NextResponse.json(
                      {
                        message: 'Message sent',
                      },
                      { status: 200 }
                    )
                  }
                }
              }
            }
          }
        }
      }
    }

    // Handle continued conversations
    if (!matcher && webhook_payload.entry[0].messaging) {
      const customer_history = await getChatHistory(
        webhook_payload.entry[0].messaging[0].recipient.id,
        webhook_payload.entry[0].messaging[0].sender.id
      )

      if (customer_history.history.length > 0 && customer_history.automationId) {
        const automation = await findAutomation(customer_history.automationId)

        if (
          automation?.User?.subscription?.plan === 'PRO' &&
          automation.listener?.type === ACTION_TYPE.OMNIAI
        ) {
          const omni_ai_message = await mistralAI.chat.complete({
            model: 'mistral-large-latest',
            messages: [
              {
                role: 'assistant',
                content: `${automation.listener.prompt || ''}: keep responses under 2 sentences`,
              },
              ...customer_history.history,
              {
                role: 'user',
                content: webhook_payload.entry[0]?.messaging?.[0]?.message?.text || ''
              },
            ],
          })

          if (
            omni_ai_message.choices[0]?.message?.content && 
            webhook_payload.entry[0]?.messaging?.[0]?.message?.text &&
            webhook_payload.entry[0]?.messaging?.[0]?.sender?.id &&
            automation.User?.integrations?.[0]?.token
          ) {
            const senderId = webhook_payload.entry[0].messaging[0].sender.id
            const messageText = webhook_payload.entry[0].messaging[0].message.text
            const entryId = webhook_payload.entry[0].id
            const aiResponse = omni_ai_message.choices[0].message.content
            const token = automation.User.integrations[0].token as string

            console.log('Creating chat history')
            await client.$transaction(async (tx) => {
              await createChatHistory(
                automation.id,
                entryId,
                senderId,
                messageText
              )

              await createChatHistory(
                automation.id,
                entryId,
                senderId,
                aiResponse
              )
            })
            console.log('Chat history created')

            console.log('Sending DM with Omni AI response')
            const direct_message = await sendDM(
              entryId,
              senderId,
              aiResponse,
              token
            )

            if (direct_message.status === 200) {
              return NextResponse.json(
                {
                  message: 'Message sent',
                },
                { status: 200 }
              )
            }
          }
        }
      }
    }

    return NextResponse.json(
      {
        message: 'No automation set',
      },
      { status: 200 }
    )
  } catch (error) {
    // Improved error logging with safe stringification
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorDetails = {
      message: 'Error processing webhook',
      error: errorMessage,
      timestamp: new Date().toISOString(),
      payload: webhook_payload || null
    }
    
    console.error('Error processing webhook:', JSON.stringify(errorDetails, null, 2))
    
    return NextResponse.json(
      {
        message: 'Error processing webhook',
        error: errorMessage
      },
      { status: 500 }
    )
  }
}
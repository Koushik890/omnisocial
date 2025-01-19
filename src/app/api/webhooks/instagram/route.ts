import { findAutomation } from '@/actions/automations/queries'
import {
  createChatHistory,
  getChatHistory,
  getKeywordAutomation,
  getKeywordPost,
  matchKeyword,
  trackResponses,
} from '@/actions/webhook/queries'
import { sendDM, sendPrivateMessage } from '@/lib/fetch'
import { mistralAI } from '@/lib/mistral'
import { client } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const hub = req.nextUrl.searchParams.get('hub.challenge')
  return new NextResponse(hub)
}

export async function POST(req: NextRequest) {
  const webhook_payload = await req.json()
  let matcher
  try {
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
    }

    if (!matcher && 
        webhook_payload.entry[0].messaging && 
        !webhook_payload.entry[0].messaging[0]?.message?.is_echo && 
        webhook_payload.entry[0].messaging[0]?.message?.text) {
      console.log('ℹ️ No keyword match for message:', {
        timestamp: new Date().toISOString(),
        messageContent: webhook_payload.entry[0].messaging[0].message.text
      })
    }

    if (matcher && matcher.automationId) {
      console.log('Matched keyword for automation:', matcher.automationId)
      
      if (webhook_payload.entry[0].messaging) {
        const automation = await getKeywordAutomation(
          matcher.automationId,
          true
        )
        console.log('Found automation:', {
          id: automation?.id,
          listener: automation?.listener?.listener,
          subscription: automation?.User?.subscription?.plan
        })

        if (automation && automation.trigger) {
          if (
            automation.listener &&
            automation.listener.listener === 'MESSAGE'
          ) {
            console.log('Processing MESSAGE listener')
            const direct_message = await sendDM(
              webhook_payload.entry[0].id,
              webhook_payload.entry[0].messaging[0].sender.id,
              automation.listener?.prompt,
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

          if (
            automation.listener &&
            automation.listener.listener === 'OMNIAI' &&
            automation.User?.subscription?.plan === 'PRO'
          ) {
            console.log('Starting Omni AI processing')
            try {
              const omni_ai_message = await mistralAI.chat.complete({
                model: 'mistral-large-latest',
                messages: [
                  {
                    role: 'system',
                    content: automation.listener?.prompt || 'You are a helpful assistant'
                  },
                  {
                    role: 'user',
                    content: webhook_payload.entry[0].messaging[0].message.text
                  }
                ],
              })
              console.log('Omni AI response received:', omni_ai_message.choices[0].message.content)

              if (omni_ai_message.choices[0].message.content) {
                console.log('Creating chat history')
                const reciever = createChatHistory(
                  automation.id,
                  webhook_payload.entry[0].id,
                  webhook_payload.entry[0].messaging[0].sender.id,
                  webhook_payload.entry[0].messaging[0].message.text
                )

                const sender = createChatHistory(
                  automation.id,
                  webhook_payload.entry[0].id,
                  webhook_payload.entry[0].messaging[0].sender.id,
                  omni_ai_message.choices[0].message.content
                )

                await client.$transaction([reciever, sender])
                console.log('Chat history created')

                console.log('Sending DM with Omni AI response')
                const direct_message = await sendDM(
                  webhook_payload.entry[0].id,
                  webhook_payload.entry[0].messaging[0].sender.id,
                  omni_ai_message.choices[0].message.content,
                  automation.User?.integrations[0].token!
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

      if (
        webhook_payload.entry[0].changes &&
        webhook_payload.entry[0].changes[0].field === 'comments'
      ) {
        const automation = await getKeywordAutomation(
          matcher.automationId,
          false
        )

        console.log('geting the automations')

        const automations_post = await getKeywordPost(
          webhook_payload.entry[0].changes[0].value.media.id,
          automation?.id!
        )

        console.log('found keyword ', automations_post)

        if (automation && automations_post && automation.trigger) {
          console.log('first if')
          if (automation.listener) {
            console.log('first if')
            if (automation.listener.listener === 'MESSAGE') {
              console.log(
                'SENDING DM, WEB HOOK PAYLOAD',
                webhook_payload,
                'changes',
                webhook_payload.entry[0].changes[0].value.from
              )

              console.log(
                'COMMENT VERSION:',
                webhook_payload.entry[0].changes[0].value.from.id
              )

              const direct_message = await sendPrivateMessage(
                webhook_payload.entry[0].id,
                webhook_payload.entry[0].changes[0].value.id,
                automation.listener?.prompt,
                automation.User?.integrations[0].token!
              )

              console.log('DM SENT', direct_message.data)
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
            if (
              automation.listener.listener === 'OMNIAI' &&
              automation.User?.subscription?.plan === 'PRO'
            ) {
              const omni_ai_message = await mistralAI.chat.complete({
                model: 'mistral-large-latest',
                messages: [
                  {
                    role: 'assistant',
                    content: `${automation.listener?.prompt}: keep responses under 2 sentences`,
                  },
                ],
              })

              if (omni_ai_message.choices[0].message.content) {
                const reciever = createChatHistory(
                  automation.id,
                  webhook_payload.entry[0].id,
                  webhook_payload.entry[0].changes[0].value.from.id,
                  webhook_payload.entry[0].changes[0].value.text
                )

                const sender = createChatHistory(
                  automation.id,
                  webhook_payload.entry[0].id,
                  webhook_payload.entry[0].changes[0].value.from.id,
                  omni_ai_message.choices[0].message.content
                )

                await client.$transaction([reciever, sender])

                const direct_message = await sendPrivateMessage(
                  webhook_payload.entry[0].id,
                  webhook_payload.entry[0].changes[0].value.id,
                  omni_ai_message.choices[0].message.content,
                  automation.User?.integrations[0].token!
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

    if (!matcher) {
      const customer_history = await getChatHistory(
        webhook_payload.entry[0].messaging[0].recipient.id,
        webhook_payload.entry[0].messaging[0].sender.id
      )

      if (customer_history.history.length > 0) {
        const automation = await findAutomation(customer_history.automationId!)

        if (
          automation?.User?.subscription?.plan === 'PRO' &&
          automation.listener?.listener === 'OMNIAI'
        ) {
          const omni_ai_message = await mistralAI.chat.complete({
            model: 'mistral-large-latest',
            messages: [
              {
                role: 'assistant',
                content: `${automation.listener?.prompt}: keep responses under 2 sentences`,
              },
              ...customer_history.history,
              {
                role: 'user',
                content: webhook_payload.entry[0].messaging[0].message.text,
              },
            ],
          })

          if (omni_ai_message.choices[0].message.content) {
            const reciever = createChatHistory(
              automation.id,
              webhook_payload.entry[0].id,
              webhook_payload.entry[0].messaging[0].sender.id,
              webhook_payload.entry[0].messaging[0].message.text
            )

            const sender = createChatHistory(
              automation.id,
              webhook_payload.entry[0].id,
              webhook_payload.entry[0].messaging[0].sender.id,
              omni_ai_message.choices[0].message.content
            )
            await client.$transaction([reciever, sender])
            const direct_message = await sendDM(
              webhook_payload.entry[0].id,
              webhook_payload.entry[0].messaging[0].sender.id,
              omni_ai_message.choices[0].message.content,
              automation.User?.integrations[0].token!
            )

            if (direct_message.status === 200) {
              //if successfully send we return

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

      return NextResponse.json(
        {
          message: 'No automation set',
        },
        { status: 200 }
      )
    }
    return NextResponse.json(
      {
        message: 'No automation set',
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        message: 'No automation set',
      },
      { status: 200 }
    )
  }
}
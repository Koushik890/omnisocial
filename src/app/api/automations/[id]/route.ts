import { getAutomationInfo, updateAutomationName } from '@/actions/automations';
import { client } from '@/lib/prisma';

type Context = {
  params: Promise<{
    id: string | string[];
  }>;
};

export async function GET(_request: Request, { params }: Context) {
  try {
    const { id: paramId } = await params;
    const id = Array.isArray(paramId) ? paramId[0] : paramId;
    if (!id) {
      return new Response(JSON.stringify({ message: 'Automation ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = await getAutomationInfo(id);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in GET /api/automations/[id]:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function POST(request: Request, { params }: Context) {
  try {
    const { id: paramId } = await params;
    const id = Array.isArray(paramId) ? paramId[0] : paramId;
    if (!id) {
      return new Response(JSON.stringify({ message: 'Automation ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const result = await updateAutomationName(id, body);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in POST /api/automations/[id]:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function PATCH(request: Request, { params }: Context) {
  try {
    const { id: paramId } = await params;
    const id = Array.isArray(paramId) ? paramId[0] : paramId;
    if (!id) {
      return new Response(JSON.stringify({ message: 'Automation ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    
    // First, delete all existing triggers and their related records
    if (body.trigger !== undefined) {
      await client.$transaction([
        // Delete all related records first
        client.post.deleteMany({
          where: { trigger: { automationId: id } }
        }),
        client.keyword.deleteMany({
          where: { trigger: { automationId: id } }
        }),
        client.replyMessage.deleteMany({
          where: { trigger: { automationId: id } }
        }),
        // Then delete the triggers
        client.trigger.deleteMany({
          where: { automationId: id }
        })
      ]);
    }

    // Update the automation in the database
    const result = await client.automation.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.active !== undefined && { active: body.active }),
        ...(body.listener === undefined ? {} : 
          body.listener === null ? {
            listener: {
              delete: true
            }
          } : {
            listener: {
              upsert: {
                create: {
                  type: body.listener.type,
                  status: body.listener.message ? 'CONFIGURED' : 'UNCONFIGURED',
                  prompt: body.listener.prompt || null,
                  message: body.listener.message || null,
                  commentReply: body.listener.commentReply || null,
                  dmCount: body.listener.dmCount || 0,
                  commentCount: body.listener.commentCount || 0
                },
                update: {
                  type: body.listener.type,
                  status: body.listener.message ? 'CONFIGURED' : 'UNCONFIGURED',
                  prompt: body.listener.prompt || null,
                  message: body.listener.message || null,
                  commentReply: body.listener.commentReply || null,
                  dmCount: body.listener.dmCount || 0,
                  commentCount: body.listener.commentCount || 0
                }
              }
            }
          }
        ),
        ...(body.trigger && body.trigger.length > 0 && {
          trigger: {
            create: body.trigger.map((t: any) => ({
              type: t.type,
              status: t.config?.status || 'unconfigured',
              ...(t.config?.posts && {
                posts: {
                  create: t.config.posts.map((post: any) => ({
                    postId: post.postId,
                    mediaType: post.mediaType,
                    mediaUrl: post.mediaUrl,
                    caption: post.caption
                  }))
                }
              }),
              ...(t.config?.keywords && {
                keywords: {
                  create: t.config.keywords.include.map((word: string) => ({
                    word
                  }))
                }
              }),
              ...(t.config?.replyMessages && {
                replyMessages: {
                  create: t.config.replyMessages.map((message: string) => ({
                    message
                  }))
                }
              })
            }))
          }
        })
      },
      include: {
        trigger: {
          include: {
            posts: true,
            keywords: true,
            replyMessages: true
          }
        },
        listener: true
      }
    });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in PATCH /api/automations/[id]:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
} 
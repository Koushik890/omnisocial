import { getAutomationInfo, updateAutomationName } from '@/actions/automations';

type Context = {
  params: {
    id: string | string[];
  };
};

export async function GET(_request: Request, { params }: Context) {
  try {
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
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
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
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
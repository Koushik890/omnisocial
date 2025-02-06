import {
    MutationFunction,
    MutationKey,
    useMutation,
    useMutationState,
    useQueryClient,
  } from '@tanstack/react-query'
  import { toast } from 'sonner'


export const useMutationData = (
    mutationKey: MutationKey,
    mutationFn: MutationFunction<any, any>,
    queryKey?: string,
    onSuccess?: () => void
  ) => {
    const client = useQueryClient()
    const { mutate, isPending } = useMutation({
      mutationKey,
      mutationFn: async (variables: any) => {
        if (!variables || typeof variables !== 'object') {
          throw new Error('Invalid mutation variables');
        }
        const result = await mutationFn(variables);
        if (!result) {
          throw new Error('No response from server');
        }
        return result;
      },
      onSuccess: (data) => {
        if (data?.status === 200) {
          if (onSuccess) onSuccess();
          if (queryKey) {
            client.invalidateQueries({ queryKey: [queryKey] });
          }
        } else {
          toast.error(data?.data || 'An error occurred');
        }
      },
      onError: (error: Error) => {
        console.error('Mutation error:', error);
        toast.error(error.message || 'An error occurred');
      }
    })
  
    return { mutate, isPending }
  }
  
  export const useMutationDataState = (mutationKey: MutationKey) => {
    const data = useMutationState({
      filters: { mutationKey },
      select: (mutation) => {
        return {
          variables: mutation.state.variables as any,
          status: mutation.state.status,
        }
      },
    })
  
    const latestVariable = data[data.length - 1]
    return { latestVariable }
  }
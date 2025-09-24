import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { routesApi } from '../integrations/supabase/api'
import { Route } from '../integrations/supabase/types'

export const useRoutes = () => {
  return useQuery({
    queryKey: ['routes'],
    queryFn: routesApi.getAll,
  })
}

export const useRoute = (id: string) => {
  return useQuery({
    queryKey: ['route', id],
    queryFn: () => routesApi.getById(id),
    enabled: !!id,
  })
}

export const useCreateRoute = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: routesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] })
    },
  })
}

export const useUpdateRoute = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Route> }) =>
      routesApi.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] })
    },
  })
}

export const useDeleteRoute = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: routesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] })
    },
  })
}

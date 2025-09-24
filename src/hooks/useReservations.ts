import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reservationsApi } from '../integrations/supabase/api'
import { Reservation } from '../integrations/supabase/types'

export const useReservations = () => {
  return useQuery({
    queryKey: ['reservations'],
    queryFn: reservationsApi.getAll,
  })
}

export const useReservation = (id: string) => {
  return useQuery({
    queryKey: ['reservation', id],
    queryFn: () => reservationsApi.getById(id),
    enabled: !!id,
  })
}

export const useReservationByProtocol = (protocol: string) => {
  return useQuery({
    queryKey: ['reservation', 'protocol', protocol],
    queryFn: () => reservationsApi.getByProtocol(protocol),
    enabled: !!protocol,
  })
}

export const useCreateReservation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: reservationsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] })
    },
  })
}

export const useUpdateReservation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Reservation> }) =>
      reservationsApi.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] })
    },
  })
}

export const useDeleteReservation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: reservationsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] })
    },
  })
}

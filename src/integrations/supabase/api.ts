import { supabase } from './client'
import { Route, Reservation } from './types'

// Routes API
export const routesApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('routes')
      .select('*')
      .eq('is_active', true)
      .order('departure_time')
    
    if (error) throw error
    return data as Route[]
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('routes')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Route
  },

  async create(route: Omit<Route, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('routes')
      .insert(route)
      .select()
      .single()
    
    if (error) throw error
    return data as Route
  },

  async update(id: string, updates: Partial<Route>) {
    const { data, error } = await supabase
      .from('routes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Route
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('routes')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Reservations API
export const reservationsApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        *,
        route:route_id(origin, destination, departure_time, price),
        return_route:return_route_id(origin, destination, departure_time, price)
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Reservation[]
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        *,
        route:route_id(origin, destination, departure_time, price),
        return_route:return_route_id(origin, destination, departure_time, price)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Reservation
  },

  async create(reservation: Omit<Reservation, 'id' | 'protocol' | 'created_at'>) {
    const { data, error } = await supabase
      .from('reservations')
      .insert(reservation)
      .select()
      .single()
    
    if (error) throw error
    return data as Reservation
  },

  async update(id: string, updates: Partial<Reservation>) {
    const { data, error } = await supabase
      .from('reservations')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Reservation
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('reservations')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  async getByProtocol(protocol: string) {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        *,
        route:route_id(origin, destination, departure_time, price),
        return_route:return_route_id(origin, destination, departure_time, price)
      `)
      .eq('protocol', protocol)
      .single()
    
    if (error) throw error
    return data as Reservation
  }
}

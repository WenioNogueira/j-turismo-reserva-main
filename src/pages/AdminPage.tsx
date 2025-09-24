import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, Bus, Users, Calendar, DollarSign, MessageCircle } from 'lucide-react'
import { Button } from '../components/ui/button'
import { supabase } from '../integrations/supabase/client'
import { Route, Reservation } from '../integrations/supabase/types'

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<'reservations' | 'passengers'>('reservations')
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [passengers, setPassengers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReservations()
    fetchPassengers()
  }, [])

  const fetchReservations = async () => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setReservations(data || [])
    } catch (error) {
      console.error('Error fetching reservations:', error)
      // Dados mockados para demonstração
      const mockReservations: Reservation[] = [
        {
          id: '1',
          protocol: 'JT202501230001',
          customer_name: 'João Silva',
          customer_phone: '(87) 99999-9999',
          travel_date: '2025-01-25',
          trip_type: 'Ida',
          origin: 'Floresta',
          destination: 'Mirandiba',
          created_at: '2025-01-23T10:00:00Z',
          updated_at: '2025-01-23T10:00:00Z'
        },
        {
          id: '2',
          protocol: 'JT202501230002',
          customer_name: 'Maria Santos',
          customer_phone: '(87) 88888-8888',
          travel_date: '2025-01-26',
          trip_type: 'Ida e Volta',
          origin: 'Jaburu',
          destination: 'Mirandiba',
          return_origin: 'Mirandiba',
          return_destination: 'Jaburu',
          return_date: '2025-01-27',
          created_at: '2025-01-23T11:00:00Z',
          updated_at: '2025-01-23T11:00:00Z'
        }
      ]
      setReservations(mockReservations)
    }
  }

  const fetchPassengers = async () => {
    try {
      const { data, error } = await supabase
        .from('passengers')
        .select(`
          *,
          reservations!inner(protocol, customer_name, customer_phone, travel_date, trip_type, origin, destination, return_origin, return_destination, return_date)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPassengers(data || [])
    } catch (error) {
      console.error('Error fetching passengers:', error)
      // Dados mockados para demonstração
      const mockPassengers = [
        {
          id: '1',
          nome: 'João Silva',
          numero: '(87) 99999-9999',
          reserva_id: '1',
          tipo_viagem: 'Ida',
          created_at: '2025-01-23T10:00:00Z',
          reservations: {
            protocol: 'JT202501230001',
            customer_name: 'João Silva',
            customer_phone: '(87) 99999-9999',
            travel_date: '2025-01-25',
            trip_type: 'Ida',
            origin: 'Floresta',
            destination: 'Mirandiba'
          }
        },
        {
          id: '2',
          nome: 'Maria Santos',
          numero: '(87) 88888-8888',
          reserva_id: '2',
          tipo_viagem: 'Ida e Volta',
          created_at: '2025-01-23T11:00:00Z',
          reservations: {
            protocol: 'JT202501230002',
            customer_name: 'Maria Santos',
            customer_phone: '(87) 88888-8888',
            travel_date: '2025-01-26',
            trip_type: 'Ida e Volta',
            origin: 'Jaburu',
            destination: 'Mirandiba',
            return_origin: 'Mirandiba',
            return_destination: 'Jaburu',
            return_date: '2025-01-27'
          }
        }
      ]
      setPassengers(mockPassengers)
    } finally {
      setLoading(false)
    }
  }

  const sendPassengerWhatsApp = (passenger: any) => {
    const reservation = passenger.reservations
    let message = `Olá ${passenger.nome}! Sua reserva foi confirmada:\n\n`
    message += `Protocolo: ${reservation.protocol}\n`
    message += `Viagem: ${reservation.origin} → ${reservation.destination}\n`
    message += `Tipo: ${reservation.trip_type}\n`
    message += `Data: ${new Date(reservation.travel_date).toLocaleDateString('pt-BR')}\n`
    
    if (reservation.return_origin && reservation.return_destination) {
      message += `Volta: ${reservation.return_origin} → ${reservation.return_destination}\n`
      if (reservation.return_date) {
        message += `Data da Volta: ${new Date(reservation.return_date).toLocaleDateString('pt-BR')}\n`
      }
    }
    
    message += `\nObrigado por escolher J Turismo! 🚌`
    
    const phoneNumber = passenger.numero.replace(/\D/g, '')
    const whatsappUrl = `https://wa.me/55${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const deleteReservation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchReservations()
    } catch (error) {
      console.error('Error deleting reservation:', error)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando dados...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel Administrativo</h1>
        <p className="text-gray-600">Gerencie reservas e passageiros</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="transport-card">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reservas</p>
              <p className="text-2xl font-bold text-gray-900">{reservations.length}</p>
            </div>
          </div>
        </div>
        <div className="transport-card">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Hoje</p>
              <p className="text-2xl font-bold text-gray-900">
                {reservations.filter(r => r.travel_date === new Date().toISOString().split('T')[0]).length}
              </p>
            </div>
          </div>
        </div>
        <div className="transport-card">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Receita Total</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {reservations.reduce((sum, r) => sum + 30, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className="transport-card">
          <div className="flex items-center">
            <MessageCircle className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Passageiros</p>
              <p className="text-2xl font-bold text-gray-900">{passengers.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('reservations')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reservations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reservas
            </button>
            <button
              onClick={() => setActiveTab('passengers')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'passengers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Passageiros
            </button>
          </nav>
        </div>
      </div>

      {/* Reservations Tab */}
      {activeTab === 'reservations' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Reservas Realizadas</h2>
          </div>

          <div className="transport-card">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Protocolo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Viagem
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reservations.map((reservation) => (
                    <tr key={reservation.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono font-medium text-blue-600">
                          {reservation.protocol}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {reservation.customer_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {reservation.customer_phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {reservation.origin} → {reservation.destination}
                        </div>
                        <div className="text-sm text-gray-500">
                          {reservation.trip_type}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(reservation.travel_date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteReservation(reservation.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Passengers Tab */}
      {activeTab === 'passengers' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Passageiros</h2>
          </div>

          <div className="transport-card">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Telefone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Protocolo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Viagem
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {passengers.map((passenger) => (
                    <tr key={passenger.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {passenger.nome}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {passenger.numero}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono font-medium text-blue-600">
                          {passenger.reservations.protocol}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {passenger.reservations.origin} → {passenger.reservations.destination}
                        </div>
                        <div className="text-sm text-gray-500">
                          {passenger.reservations.trip_type}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button
                          onClick={() => sendPassengerWhatsApp(passenger)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          WhatsApp
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPage

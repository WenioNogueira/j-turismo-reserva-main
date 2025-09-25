import { useState, useEffect } from 'react'
import { MapPin, Clock, DollarSign, Bus, MessageCircle, History } from 'lucide-react'
import { Button } from '../components/ui/button'
import ReservationDialog from '../components/ReservationDialog'
import ReservationConfirmationDialog from '../components/ReservationConfirmationDialog'
import UserHistoryDialog from '../components/UserHistoryDialog'
import { supabase } from '../integrations/supabase/client'

interface Route {
  id: string
  origin: string
  destination: string
  departure_time: string
  price: number
  is_active: boolean
  capacity: number
  created_at: string
  updated_at: string
}

const ReservationsPage = () => {
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const [tripType, setTripType] = useState<'Ida' | 'Volta' | 'Ida e Volta'>('Ida')
  const [selectedOrigin, setSelectedOrigin] = useState('')
  const [selectedDestination, setSelectedDestination] = useState('')
  const [availableRoutes, setAvailableRoutes] = useState<Route[]>([])
  const [availableReturnRoutes, setAvailableReturnRoutes] = useState<Route[]>([])
  const [showReservationDialog, setShowReservationDialog] = useState(false)
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false)
  const [showHistoryDialog, setShowHistoryDialog] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null)
  const [selectedReturnRoute, setSelectedReturnRoute] = useState<Route | null>(null)
  const [reservationData, setReservationData] = useState<any>(null)
  const [customerPhone, setCustomerPhone] = useState('')

  const cities = ['Floresta', 'Jaburu', 'Carnaubeira', 'Juazeiro Grande', 'Mirandiba']

  useEffect(() => {
    fetchRoutes()
  }, [])

  useEffect(() => {
    if (routes.length > 0) {
      updateAvailableRoutes()
    }
  }, [tripType, selectedOrigin, selectedDestination, routes])

  const fetchRoutes = async () => {
    try {
      const { data, error } = await supabase
        .from('routes')
        .select('*')
        .order('departure_time')

      if (error) throw error
      setRoutes(data || [])
    } catch (error) {
      console.error('Error fetching routes:', error)
      // Dados mockados para demonstração
      const mockRoutes: Route[] = [
        { id: '1', origin: 'Floresta', destination: 'Mirandiba', departure_time: '05:40', price: 30, is_active: true, capacity: 50, created_at: '2025-01-23', updated_at: '2025-01-23' },
        { id: '2', origin: 'Jaburu', destination: 'Mirandiba', departure_time: '06:00', price: 25, is_active: true, capacity: 50, created_at: '2025-01-23', updated_at: '2025-01-23' },
        { id: '3', origin: 'Carnaubeira', destination: 'Mirandiba', departure_time: '06:15', price: 20, is_active: true, capacity: 50, created_at: '2025-01-23', updated_at: '2025-01-23' },
        { id: '4', origin: 'Juazeiro Grande', destination: 'Mirandiba', departure_time: '06:30', price: 15, is_active: true, capacity: 50, created_at: '2025-01-23', updated_at: '2025-01-23' },
        { id: '5', origin: 'Mirandiba', destination: 'Floresta', departure_time: '12:00', price: 30, is_active: true, capacity: 50, created_at: '2025-01-23', updated_at: '2025-01-23' },
        { id: '6', origin: 'Mirandiba', destination: 'Jaburu', departure_time: '12:00', price: 25, is_active: true, capacity: 50, created_at: '2025-01-23', updated_at: '2025-01-23' },
        { id: '7', origin: 'Mirandiba', destination: 'Carnaubeira', departure_time: '12:00', price: 20, is_active: true, capacity: 50, created_at: '2025-01-23', updated_at: '2025-01-23' },
        { id: '8', origin: 'Mirandiba', destination: 'Juazeiro Grande', departure_time: '12:00', price: 15, is_active: true, capacity: 50, created_at: '2025-01-23', updated_at: '2025-01-23' },
      ]
      setRoutes(mockRoutes)
    } finally {
      setLoading(false)
    }
  }

  const getAvailableCities = (type: 'origin' | 'destination') => {
    if (type === 'origin') {
      if (tripType === 'Ida') {
        return cities.filter(city => city !== 'Mirandiba')
      } else if (tripType === 'Volta') {
        return cities.filter(city => city === 'Mirandiba')
      } else {
        return cities.filter(city => city !== 'Mirandiba')
      }
    } else {
      if (tripType === 'Ida') {
        return cities.filter(city => city === 'Mirandiba')
      } else if (tripType === 'Volta') {
        return cities.filter(city => city !== 'Mirandiba')
      } else {
        return cities.filter(city => city === 'Mirandiba')
      }
    }
  }

  const getReturnCities = (type: 'origin' | 'destination') => {
    if (type === 'origin') {
      return cities.filter(city => city === 'Mirandiba')
    } else {
      return cities.filter(city => city !== 'Mirandiba')
    }
  }

  const filterRoutesByCities = (origin: string, destination: string, isReturnTrip = false) => {
    if (!origin || !destination) return []

    const timeFilter = isReturnTrip ? 
      (route: Route) => route.departure_time >= '12:00' :
      (route: Route) => route.departure_time < '12:00'

    return routes.filter(route => 
      route.origin === origin && 
      route.destination === destination &&
      timeFilter(route)
    )
  }

  const updateAvailableRoutes = () => {
    if (tripType === 'Ida e Volta') {
      // Ida
      const outboundRoutes = filterRoutesByCities(selectedOrigin, selectedDestination, false)
      setAvailableRoutes(outboundRoutes)

      // Volta
      const returnRoutes = filterRoutesByCities('Mirandiba', selectedOrigin, true)
      setAvailableReturnRoutes(returnRoutes)
    } else if (tripType === 'Volta') {
      const returnRoutes = filterRoutesByCities(selectedOrigin, selectedDestination, true)
      setAvailableRoutes(returnRoutes)
      setAvailableReturnRoutes([])
    } else {
      const outboundRoutes = filterRoutesByCities(selectedOrigin, selectedDestination, false)
      setAvailableRoutes(outboundRoutes)
      setAvailableReturnRoutes([])
    }
  }

  const handleOriginChange = (origin: string) => {
    setSelectedOrigin(origin)
    setSelectedDestination('')
  }

  const handleDestinationChange = (destination: string) => {
    setSelectedDestination(destination)
    if (tripType === 'Ida e Volta') {
      const returnRoutes = filterRoutesByCities('Mirandiba', selectedOrigin, true)
      setAvailableReturnRoutes(returnRoutes)
    }
  }

  const handleReserve = (route: Route) => {
    setSelectedRoute(route)
    setShowReservationDialog(true)
  }

  const handleReserveReturn = (route: Route) => {
    setSelectedReturnRoute(route)
  }

  const handleReservationSuccess = (data: any) => {
    setReservationData(data)
    setShowReservationDialog(false)
    setShowConfirmationDialog(true)
  }

  const handleViewHistory = () => {
    setShowConfirmationDialog(false)
    setShowHistoryDialog(true)
  }

  const handleCloseConfirmation = () => {
    setShowConfirmationDialog(false)
    setReservationData(null)
    setSelectedRoute(null)
    setSelectedReturnRoute(null)
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando rotas...</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        {/* Logo da empresa */}
        <div className="flex justify-center mb-4">
          <img 
            src="/logo-j-turismo.png" 
            alt="J Turismo Logo" 
            className="h-24 w-auto object-contain"
            onError={(e) => {
              // Fallback para o ícone SVG caso a imagem não carregue
              e.currentTarget.style.display = 'none';
              const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
              if (nextElement) {
                nextElement.style.display = 'block';
              }
            }}
          />
          <div style={{ display: 'none' }} className="flex items-center justify-center">
            <div className="bg-blue-600 rounded-full p-3 mr-3">
              <span className="text-2xl font-bold text-white">J</span>
              </div>
            <h1 className="text-4xl font-bold text-red-600">Turismo</h1>
              </div>
            </div>
        <p className="text-xl text-gray-600">Reserve sua passagem com conforto e segurança</p>
          </div>

      {/* Trip Type Selection */}
      <div className="transport-card mb-8">
        <h2 className="text-xl font-semibold mb-4">Tipo de Viagem</h2>
        <div className="grid grid-cols-3 gap-4">
          {(['Ida', 'Volta', 'Ida e Volta'] as const).map((type) => (
            <button
              key={type}
              onClick={() => {
                setTripType(type)
                setSelectedOrigin('')
                setSelectedDestination('')
              }}
              className={`p-4 rounded-lg border-2 transition-colors ${
                tripType === type
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {type}
            </button>
          ))}
              </div>
            </div>

      {/* City Selection */}
      <div className="transport-card mb-8">
        <h2 className="text-xl font-semibold mb-4">Selecione sua rota</h2>
        <div className="grid md:grid-cols-2 gap-4">
              <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Origem</label>
                <select
              value={selectedOrigin}
              onChange={(e) => handleOriginChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione a origem</option>
              {getAvailableCities('origin').map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Destino</label>
                <select
              value={selectedDestination}
              onChange={(e) => handleDestinationChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!selectedOrigin}
                >
                  <option value="">Selecione o destino</option>
              {getAvailableCities('destination').map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

      {/* Available Routes */}
      {selectedOrigin && selectedDestination && (
        <div className="space-y-6">
          {/* Outbound Routes */}
          {availableRoutes.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Bus className="h-5 w-5 mr-2" />
                {tripType === 'Ida e Volta' ? 'Ida' : 'Rotas Disponíveis'}
              </h3>
              <div className="grid gap-4">
                {availableRoutes.map((route) => (
                  <div key={route.id} className="route-item">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Bus className="h-6 w-6 text-blue-600" />
          <div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{route.origin} → {route.destination}</span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{route.departure_time}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-4 w-4" />
                              <span>R$ {route.price.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button onClick={() => handleReserve(route)}>
                        Reservar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
          </div>
          )}

          {/* Return Routes */}
          {tripType === 'Ida e Volta' && availableReturnRoutes.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Bus className="h-5 w-5 mr-2" />
                Volta
              </h3>
              <div className="grid gap-4">
                {availableReturnRoutes.map((route) => (
                  <div key={route.id} className="route-item">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Bus className="h-6 w-6 text-blue-600" />
                        <div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{route.origin} → {route.destination}</span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{route.departure_time}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-4 w-4" />
                              <span>R$ {route.price.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleReserveReturn(route)}
                        variant={selectedReturnRoute?.id === route.id ? "default" : "outline"}
                      >
                        {selectedReturnRoute?.id === route.id ? 'Selecionado' : 'Selecionar'}
                      </Button>
                    </div>
          </div>
                ))}
      </div>
            </div>
          )}

          {availableRoutes.length === 0 && (
            <div className="text-center py-8">
              <Bus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhuma rota disponível para esta seleção.</p>
            </div>
          )}
        </div>
      )}

      {/* WhatsApp Contact */}
      <div className="fixed bottom-4 right-4 z-40">
        <Button
          size="icon"
          className="rounded-full bg-green-600 hover:bg-green-700"
          title="Saber mais sobre o aplicativo"
          onClick={() => window.open('https://wa.me/5587991924285', '_blank')}
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
      </div>

      {/* Dialogs */}
      <ReservationDialog
        isOpen={showReservationDialog}
        onClose={() => setShowReservationDialog(false)}
        route={selectedRoute}
        returnRoute={selectedReturnRoute}
        tripType={tripType}
        travelDate={new Date()}
      />

      <ReservationConfirmationDialog
        isOpen={showConfirmationDialog}
        onClose={handleCloseConfirmation}
        onViewHistory={handleViewHistory}
        customerName={reservationData?.customer_name || ''}
        tripType={tripType}
        travelDate={new Date()}
        route={selectedRoute}
        returnRoute={selectedReturnRoute}
        reservation={reservationData}
      />

      <UserHistoryDialog
        isOpen={showHistoryDialog}
        onClose={() => setShowHistoryDialog(false)}
        customerPhone={customerPhone}
      />
    </div>
  )
}

export default ReservationsPage

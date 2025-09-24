import * as React from "react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, MessageCircle } from "lucide-react";
import ReservationDialog from "@/components/ReservationDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Route {
  id: string;
  origin: string;
  destination: string;
  departure_time: string;
  price: number;
  is_active: boolean;
  capacity: number;
}

type TripType = 'Ida' | 'Volta' | 'Ida e Volta';

export default function UserDashboard() {
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [selectedReturnRoute, setSelectedReturnRoute] = useState<Route | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [allRoutes, setAllRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tripType, setTripType] = useState<TripType>('Ida');
  
  // City selection states
  const [selectedOrigin, setSelectedOrigin] = useState<string>('');
  const [selectedDestination, setSelectedDestination] = useState<string>('');
  const [selectedReturnOrigin, setSelectedReturnOrigin] = useState<string>('');
  const [selectedReturnDestination, setSelectedReturnDestination] = useState<string>('');
  
  // Available routes based on city selection
  const [availableRoutes, setAvailableRoutes] = useState<Route[]>([]);
  const [availableReturnRoutes, setAvailableReturnRoutes] = useState<Route[]>([]);

  // Limpar seleções quando o tipo de viagem muda
  const handleTripTypeChange = (newTripType: TripType) => {
    setTripType(newTripType);
    setSelectedOrigin('');
    setSelectedDestination('');
    setSelectedReturnOrigin('');
    setSelectedReturnDestination('');
    setSelectedRoute(null);
    setSelectedReturnRoute(null);
    setAvailableRoutes([]);
    setAvailableReturnRoutes([]);
  };

  useEffect(() => {
    fetchRoutes();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('routes-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'routes' },
        () => fetchRoutes()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRoutes = async () => {
    console.log('🔄 Iniciando fetchRoutes...');
    try {
      console.log('📡 Fazendo consulta ao Supabase...');
      const { data, error } = await supabase
        .from('routes')
        .select('*')
        .eq('is_active', true)
        .order('departure_time');

      console.log('📊 Resposta do Supabase:', { data, error });

      if (error) {
        console.error('❌ Erro na consulta:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as rotas.",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Dados recebidos:', data);
      console.log('📈 Total de rotas:', data?.length || 0);
      console.log('🔍 Rotas ativas:', data?.filter(r => r.is_active).length || 0);
      
      
      setAllRoutes(data || []);
    } catch (error) {
      console.error('💥 Erro inesperado:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get available cities for origin and destination
  const getAvailableCities = (type: 'origin' | 'destination') => {
    const cities = new Set<string>();
    
    if (type === 'origin') {
      // For outbound routes - only routes that depart BEFORE 12:00
      allRoutes
        .filter(route => {
          const departureTime = route.departure_time;
          const [hours] = departureTime.split(':').map(Number);
          return ['Floresta', 'Jaburu', 'Carnaubeira', 'Juazeiro Grande'].includes(route.origin) && hours < 12;
        })
        .forEach(route => cities.add(route.origin));
    } else {
      // For destination, get all possible destinations
      allRoutes.forEach(route => cities.add(route.destination));
    }
    
    return Array.from(cities).sort();
  };

  const getReturnCities = (type: 'origin' | 'destination') => {
    const cities = new Set<string>();
    
    if (type === 'origin') {
      // For return routes - only routes that depart AT OR AFTER 12:00
      allRoutes
        .filter(route => {
          const departureTime = route.departure_time;
          const [hours] = departureTime.split(':').map(Number);
          return ['Mirandiba', 'Juazeiro Grande', 'Carnaubeira', 'Jaburu'].includes(route.origin) && hours >= 12;
        })
        .forEach(route => cities.add(route.origin));
    } else {
      // For destination, get all possible destinations (same as getAvailableCities)
      allRoutes.forEach(route => cities.add(route.destination));
    }
    
    return Array.from(cities).sort();
  };

  // Filter routes based on city selection and trip type
  const filterRoutesByCities = (origin: string, destination: string, isReturnTrip: boolean = false) => {
    return allRoutes.filter(route => {
      const departureTime = route.departure_time;
      const [hours] = departureTime.split(':').map(Number);
      
      return route.origin === origin && 
             route.destination === destination &&
             (isReturnTrip ? hours >= 12 : hours < 12);
    });
  };

  // Handle city selection changes
  const handleOriginChange = (origin: string) => {
    setSelectedOrigin(origin);
    setSelectedDestination('');
    setAvailableRoutes([]);
  };

  const handleDestinationChange = (destination: string) => {
    setSelectedDestination(destination);
    if (selectedOrigin) {
      const routes = filterRoutesByCities(selectedOrigin, destination, tripType === 'Volta'); // true for Volta, false for Ida
      setAvailableRoutes(routes);
    }
  };

  const handleReturnOriginChange = (origin: string) => {
    setSelectedReturnOrigin(origin);
    setSelectedReturnDestination('');
    setAvailableReturnRoutes([]);
  };

  const handleReturnDestinationChange = (destination: string) => {
    setSelectedReturnDestination(destination);
    if (selectedReturnOrigin) {
      const routes = filterRoutesByCities(selectedReturnOrigin, destination, true); // true = return trip
      setAvailableReturnRoutes(routes);
    }
  };

  const handleReserve = (route: Route) => {
    setSelectedRoute(route);
    setIsDialogOpen(true);
  };

  const handleSelectReturnRoute = (route: Route) => {
    setSelectedReturnRoute(route);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedRoute(null);
    setSelectedReturnRoute(null);
  };

  const handleRouteSelection = (routeId: string) => {
    const route = availableRoutes.find(r => r.id === routeId);
    if (route) {
      setSelectedRoute(route);
      setIsDialogOpen(true);
    }
  };

  const handleReturnRouteSelection = (routeId: string) => {
    const route = availableReturnRoutes.find(r => r.id === routeId);
    if (route) {
      setSelectedReturnRoute(route);
    }
  };

  const handleReserveFromSelection = () => {
    if (selectedOrigin && selectedDestination && availableRoutes.length > 0) {
      // If only one route available, select it automatically
      if (availableRoutes.length === 1) {
        setSelectedRoute(availableRoutes[0]);
        setIsDialogOpen(true);
      }
    }
  };

  const handleRoundTripReserve = () => {
    if (selectedOrigin && selectedDestination && selectedReturnOrigin && selectedReturnDestination) {
      const outboundRoute = availableRoutes[0]; // Take first available
      const returnRoute = availableReturnRoutes[0]; // Take first available
      if (outboundRoute && returnRoute) {
        setSelectedRoute(outboundRoute);
        setSelectedReturnRoute(returnRoute);
        setIsDialogOpen(true);
      }
    }
  };

  // Get available cities for the current trip type
  // For Volta, use the exact same logic as the return section in Ida e Volta
  const availableOrigins = tripType === 'Volta' ? getReturnCities('origin') : getAvailableCities('origin');
  const availableDestinations = getAvailableCities('destination'); // Always use all destinations
  const availableReturnOrigins = getReturnCities('origin');
  const availableReturnDestinations = getAvailableCities('destination'); // Always use all destinations




  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando rotas...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
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
            <svg 
              width="100" 
              height="100" 
              viewBox="0 0 24 24" 
              fill="none" 
              className="text-primary hidden"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M4 16C4 17.1 4.9 18 6 18H7C8.1 18 9 17.1 9 16V8C9 6.9 8.1 6 7 6H6C4.9 6 4 6.9 4 8V16ZM6 8H7V16H6V8Z" 
                fill="currentColor"
              />
              <path 
                d="M15 16C15 17.1 15.9 18 17 18H18C19.1 18 20 17.1 20 16V8C20 6.9 19.1 6 18 6H17C15.9 6 15 6.9 15 8V16ZM17 8H18V16H17V8Z" 
                fill="currentColor"
              />
              <path 
                d="M2 12H22V14H2V12Z" 
                fill="currentColor"
              />
              <path 
                d="M1 10H23V12H1V10Z" 
                fill="currentColor"
              />
              <circle 
                cx="6" 
                cy="19" 
                r="1.5" 
                fill="currentColor"
              />
              <circle 
                cx="18" 
                cy="19" 
                r="1.5" 
                fill="currentColor"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-primary mb-2">
            J Turismo
          </h1>
          <p className="text-lg text-muted-foreground">
            Reserve sua passagem com facilidade
          </p>
        </div>

        {/* Date and Trip Type Selection */}
        <div className="max-w-2xl mx-auto mb-8 p-6 bg-card rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Escolha a data da viagem</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      if (date) {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        if (date < today) {
                          toast({
                            title: "Data inválida",
                            description: "Não é possível selecionar datas passadas.",
                            variant: "destructive",
                          });
                          return;
                        }
                        setSelectedDate(date);
                      }
                    }}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de viagem</label>
              <div className="flex gap-2">
                <Button
                  variant={tripType === 'Ida' ? 'default' : 'outline'}
                  onClick={() => handleTripTypeChange('Ida')}
                  className="flex-1"
                >
                  Ida
                </Button>
                <Button
                  variant={tripType === 'Volta' ? 'default' : 'outline'}
                  onClick={() => handleTripTypeChange('Volta')}
                  className="flex-1"
                >
                  Volta
                </Button>
                <Button
                  variant={tripType === 'Ida e Volta' ? 'default' : 'outline'}
                  onClick={() => handleTripTypeChange('Ida e Volta')}
                  className="flex-1"
                >
                  Ida e Volta
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* City Selection Interface */}
        <div className="max-w-4xl mx-auto mb-8 p-6 bg-card rounded-lg border">
          <h3 className="text-lg font-semibold text-primary mb-4 text-center">
            Selecione sua viagem
          </h3>
          
          <div className="space-y-4">
            {/* Single Trip Selection */}
            {(tripType === 'Ida' || tripType === 'Volta') && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">De</label>
                    <Select value={selectedOrigin} onValueChange={handleOriginChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Escolha a origem" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableOrigins.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Para</label>
                    <Select 
                      value={selectedDestination} 
                      onValueChange={handleDestinationChange}
                      disabled={!selectedOrigin}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Escolha o destino" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDestinations.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Available Routes */}
                {availableRoutes.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Rotas disponíveis:</label>
                    <div className="space-y-2">
                      {availableRoutes.map((route) => (
                        <div key={route.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div>
                              <div className="font-medium">{route.origin} → {route.destination}</div>
                              <div className="text-sm text-muted-foreground">
                                Partida: {route.departure_time} | Preço: R$ {route.price.toFixed(2)}
                              </div>
                            </div>
                          </div>
                          <Button 
                            onClick={() => handleReserve(route)}
                            size="sm"
                          >
                            Reservar
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedOrigin && selectedDestination && availableRoutes.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    Nenhuma rota disponível para este trajeto.
                  </div>
                )}
              </div>
            )}

            {/* Round Trip Selection */}
            {tripType === 'Ida e Volta' && (
              <div className="space-y-6">
                {/* Ida */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-primary">Rota de Ida</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">De</label>
                      <Select value={selectedOrigin} onValueChange={handleOriginChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Escolha a origem" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableOrigins.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Para</label>
                      <Select 
                        value={selectedDestination} 
                        onValueChange={handleDestinationChange}
                        disabled={!selectedOrigin}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Escolha o destino" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableDestinations.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Available Outbound Routes */}
                  {availableRoutes.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Rotas de ida disponíveis:</label>
                      <div className="space-y-2">
                        {availableRoutes.map((route) => (
                          <div key={route.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div>
                                <div className="font-medium">{route.origin} → {route.destination}</div>
                                <div className="text-sm text-muted-foreground">
                                  Partida: {route.departure_time} | Preço: R$ {route.price.toFixed(2)}
                                </div>
                              </div>
                            </div>
                            <Button 
                              onClick={() => setSelectedRoute(route)}
                              size="sm"
                              variant={selectedRoute?.id === route.id ? "default" : "outline"}
                            >
                              {selectedRoute?.id === route.id ? "Selecionada" : "Selecionar"}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Volta */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-primary">Rota de Volta</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">De</label>
                      <Select value={selectedReturnOrigin} onValueChange={handleReturnOriginChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Escolha a origem" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableReturnOrigins.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Para</label>
                      <Select 
                        value={selectedReturnDestination} 
                        onValueChange={handleReturnDestinationChange}
                        disabled={!selectedReturnOrigin}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Escolha o destino" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableReturnDestinations.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Available Return Routes */}
                  {availableReturnRoutes.length > 0 ? (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Rotas de volta disponíveis:</label>
                      <div className="space-y-2">
                        {availableReturnRoutes.map((route) => (
                          <div key={route.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div>
                                <div className="font-medium">{route.origin} → {route.destination}</div>
                                <div className="text-sm text-muted-foreground">
                                  Partida: {route.departure_time} | Preço: R$ {route.price.toFixed(2)}
                                </div>
                              </div>
                            </div>
                            <Button 
                              onClick={() => setSelectedReturnRoute(route)}
                              size="sm"
                              variant={selectedReturnRoute?.id === route.id ? "default" : "outline"}
                            >
                              {selectedReturnRoute?.id === route.id ? "Selecionada" : "Selecionar"}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : selectedReturnOrigin && selectedReturnDestination ? (
                    <div className="text-center py-4 text-muted-foreground">
                      Nenhuma rota de volta disponível para este trajeto.
                      <br />
                      <span className="text-xs">Origem: {selectedReturnOrigin} | Destino: {selectedReturnDestination}</span>
                    </div>
                  ) : null}
                </div>

                {/* Reserve Button */}
                <div className="flex justify-center">
                  <Button 
                    onClick={handleRoundTripReserve}
                    disabled={!selectedRoute || !selectedReturnRoute}
                    className="px-8"
                  >
                    Reservar Ida e Volta
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>


        {/* No Routes Display - Only dropdowns are shown above */}



        <ReservationDialog
          isOpen={isDialogOpen}
          onClose={closeDialog}
          route={selectedRoute}
          returnRoute={selectedReturnRoute}
          tripType={tripType}
          travelDate={selectedDate}
        />

        {/* WhatsApp Contact Icon */}
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            size="sm"
            className="h-12 w-12 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg"
            onClick={() => window.open('https://wa.me/5587991924285', '_blank')}
            title="Saber mais sobre o aplicativo"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
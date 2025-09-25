import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Users, DollarSign, Clock, MapPin, LogOut, CalendarDays, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
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

interface Reservation {
  id: string;
  customer_name: string;
  customer_phone: string;
  reservation_date: string;
  travel_date: string;
  trip_type: string;
  protocol: string;
  observations: string;
  return_route_id: string;
  created_at: string;
  routes: {
    id: string;
    origin: string;
    destination: string;
    departure_time: string;
    price: number;
  };
}

export default function AdminDashboard() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const sendWhatsApp = (reservation: Reservation) => {
    const message = `Olá ${reservation.customer_name}! Sua reserva foi confirmada:\n\n` +
      `Protocolo: ${reservation.protocol}\n` +
      `Viagem: ${reservation.routes.origin} → ${reservation.routes.destination}\n` +
      `Horário: ${reservation.routes.departure_time}\n` +
      `Tipo: ${reservation.trip_type}\n` +
      `Data: ${format(new Date(reservation.travel_date + 'T00:00:00'), "dd/MM/yyyy")}\n` +
      `Valor: R$ ${Number(reservation.routes.price).toFixed(2)}\n\n` +
      `Obrigado por escolher J Turismo! 🚌`;
    
    const phoneNumber = reservation.customer_phone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/55${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    fetchData();
    
    // Subscribe to real-time updates
    const reservationsChannel = supabase
      .channel('admin-reservations')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'reservations' },
        () => fetchReservations()
      )
      .subscribe();

    const routesChannel = supabase
      .channel('admin-routes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'routes' },
        () => fetchRoutes()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(reservationsChannel);
      supabase.removeChannel(routesChannel);
    };
  }, [user, navigate, selectedDate]);

  const fetchData = async () => {
    await Promise.all([fetchReservations(), fetchRoutes()]);
    setLoading(false);
  };

  const fetchReservations = async () => {
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          routes!reservations_route_id_fkey (*)
        `)
        .eq('travel_date', dateStr)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reservations:', error);
        return;
      }

      setReservations((data as any) || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchRoutes = async () => {
    try {
      const { data, error } = await supabase
        .from('routes')
        .select('*')
        .order('departure_time');

      if (error) {
        console.error('Error fetching routes:', error);
        return;
      }

      setRoutes(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleRouteStatus = async (routeId: string, newStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('routes')
        .update({ is_active: newStatus })
        .eq('id', routeId);

      if (error) {
        toast({
          title: "Erro",
          description: "Não foi possível atualizar o status da rota.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: `Rota ${newStatus ? 'ativada' : 'desativada'} com sucesso.`,
      });
      
      fetchRoutes();
    } catch (error) {
      console.error('Error updating route:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const totalRevenue = reservations.reduce((sum, reservation) => sum + Number(reservation.routes.price), 0);
  const totalReservations = reservations.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-header py-6 px-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">
              J Turismo — Painel Administrativo
            </h1>
            <p className="text-white/90 mt-2">
              Gestão de reservas e rotas
            </p>
          </div>
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="text-white border-white hover:bg-white hover:text-primary"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reservas do Dia</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{totalReservations}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita do Dia</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">R$ {totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Filtrar por Data</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <section>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Users className="h-5 w-5" />
                  Reservas do Dia ({format(selectedDate, "dd/MM/yyyy")})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reservations.map((reservation) => (
                    <div key={reservation.id} className="group p-4 bg-gradient-to-r from-secondary/50 to-secondary/30 rounded-xl border border-border/50 hover:border-primary/30 transition-all duration-200 hover:shadow-md">
                      {/* Layout Desktop */}
                      <div className="hidden md:flex items-start justify-between">
                        {/* Informações do Cliente */}
                        <div className="flex-1 space-y-2">
                          <div>
                          <p className="font-semibold text-primary text-lg">{reservation.customer_name}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <span className="text-green-600">●</span>
                              {reservation.customer_phone}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Reservado {formatDistanceToNow(new Date(reservation.created_at), { addSuffix: true, locale: ptBR })}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs border-0 bg-primary/10 text-primary font-mono">
                              {reservation.protocol}
                            </Badge>
                            <Badge 
                              variant="secondary" 
                              className={`text-xs border-0 ${
                                reservation.trip_type === 'Ida' ? 'bg-blue-100 text-blue-700' :
                                reservation.trip_type === 'Volta' ? 'bg-orange-100 text-orange-700' :
                                'bg-purple-100 text-purple-700'
                              }`}
                            >
                              {reservation.trip_type}
                            </Badge>
                          </div>
                        </div>

                        {/* Informações da Viagem */}
                        <div className="flex-1 text-center space-y-2">
                          <div className="bg-background/50 rounded-lg p-3">
                            <p className="font-semibold text-lg text-primary">
                              {reservation.routes.origin} → {reservation.routes.destination}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                              <Clock className="h-4 w-4" />
                              Partida: {reservation.routes.departure_time}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Data da viagem: {format(new Date(reservation.travel_date + 'T00:00:00'), "dd/MM/yyyy")}
                            </p>
                          </div>
                        </div>

                        {/* Preço e Ações */}
                        <div className="flex flex-col items-end gap-3">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-accent">
                              R$ {Number(reservation.routes.price).toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-foreground">Valor da passagem</p>
                          </div>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700 text-white border-green-600"
                            onClick={() => sendWhatsApp(reservation)}
                            title="Enviar confirmação via WhatsApp"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Layout Mobile */}
                      <div className="md:hidden space-y-4">
                        {/* Header Mobile */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-primary">{reservation.customer_name}</p>
                            <p className="text-xs text-muted-foreground">{reservation.customer_phone}</p>
                            <p className="text-xs text-muted-foreground">
                              Reservado {formatDistanceToNow(new Date(reservation.created_at), { addSuffix: true, locale: ptBR })}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700 text-white border-green-600"
                            onClick={() => sendWhatsApp(reservation)}
                            title="Enviar confirmação via WhatsApp"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Badges Mobile */}
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs border-0 bg-primary/10 text-primary font-mono">
                            {reservation.protocol}
                          </Badge>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs border-0 ${
                              reservation.trip_type === 'Ida' ? 'bg-blue-100 text-blue-700' :
                              reservation.trip_type === 'Volta' ? 'bg-orange-100 text-orange-700' :
                              'bg-purple-100 text-purple-700'
                            }`}
                          >
                            {reservation.trip_type}
                          </Badge>
                      </div>
                      
                        {/* Viagem Mobile */}
                        <div className="bg-background/50 rounded-lg p-3">
                          <p className="font-semibold text-primary text-center">
                            {reservation.routes.origin} → {reservation.routes.destination}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                            <Clock className="h-3 w-3" />
                            {reservation.routes.departure_time}
                          </p>
                          <p className="text-xs text-muted-foreground text-center mt-1">
                            {format(new Date(reservation.travel_date + 'T00:00:00'), "dd/MM/yyyy")}
                          </p>
                        </div>

                        {/* Preço Mobile */}
                        <div className="text-center">
                          <p className="text-xl font-bold text-accent">
                            R$ {Number(reservation.routes.price).toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">Valor da passagem</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {reservations.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      Nenhuma reserva para esta data
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <MapPin className="h-5 w-5" />
                  Gestão de Rotas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {routes.map((route) => (
                    <div key={route.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold text-primary">
                          {route.origin} → {route.destination}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {route.departure_time} • R$ {Number(route.price).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={route.is_active ? "default" : "secondary"}>
                          {route.is_active ? "Ativa" : "Inativa"}
                        </Badge>
                        <Switch
                          checked={route.is_active}
                          onCheckedChange={(checked) => toggleRouteStatus(route.id, checked)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}
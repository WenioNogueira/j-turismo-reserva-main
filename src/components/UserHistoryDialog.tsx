import * as React from "react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Reservation {
  id: string;
  customer_name: string;
  customer_phone: string;
  reservation_date: string;
  travel_date: string;
  trip_type: string;
  protocol: string;
  observations: string;
  created_at: string;
  routes: {
    id: string;
    origin: string;
    destination: string;
    departure_time: string;
    price: number;
  };
}

interface UserHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  customerPhone: string;
}

export default function UserHistoryDialog({ isOpen, onClose, customerPhone }: UserHistoryDialogProps) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && customerPhone) {
      fetchUserReservations();
    }
  }, [isOpen, customerPhone]);

  const fetchUserReservations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          routes!reservations_route_id_fkey (*)
        `)
        .eq('customer_phone', customerPhone)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar o histórico.",
          variant: "destructive",
        });
        return;
      }

      setReservations((data as any) || []);
    } catch (error) {
      console.error('Error fetching user reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-primary flex items-center justify-center gap-2">
            <MapPin className="h-5 w-5" />
            Histórico de Reservas
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando histórico...</p>
            </div>
          ) : reservations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhuma reserva encontrada</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reservations.map((reservation) => (
                <div key={reservation.id} className="bg-secondary rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-primary">
                        {reservation.routes.origin} → {reservation.routes.destination}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {reservation.routes.departure_time}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-accent font-bold">
                      R$ {Number(reservation.routes.price).toFixed(2)}
                    </Badge>
                  </div>
                  
                  {reservation.protocol && (
                    <div className="text-xs text-muted-foreground mb-2">
                      <span className="font-mono bg-background px-2 py-1 rounded">
                        {reservation.protocol}
                      </span>
                    </div>
                  )}
                  
                  <div className="text-xs text-muted-foreground">
                    <p>Tipo: {reservation.trip_type}</p>
                    <p>Data da viagem: {formatDate(reservation.travel_date)}</p>
                    <p>Reservado em: {formatDate(reservation.created_at)}</p>
                    {reservation.observations && (
                      <p className="mt-1">Obs: {reservation.observations}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
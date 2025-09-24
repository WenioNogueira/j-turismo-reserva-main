import * as React from "react";
import { useState } from "react";
import InputMask from "react-input-mask";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ReservationConfirmationDialog from "./ReservationConfirmationDialog";
import UserHistoryDialog from "./UserHistoryDialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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

interface ReservationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  route: Route | null;
  returnRoute?: Route | null;
  tripType?: TripType;
  travelDate?: Date;
}

export default function ReservationDialog({ 
  isOpen, 
  onClose, 
  route, 
  returnRoute = null, 
  tripType = 'Ida', 
  travelDate = new Date() 
}: ReservationDialogProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [observations, setObservations] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [lastReservation, setLastReservation] = useState<any>(null);

  const validatePhone = (phoneNumber: string) => {
    // Remove all non-numeric characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    return cleaned.length === 11;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha o nome completo.",
        variant: "destructive",
      });
      return;
    }

    if (!validatePhone(phone)) {
      toast({
        title: "Erro",
        description: "Número inválido, digite um telefone válido com 11 dígitos",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Clean phone number for storage
      const cleanedPhone = phone.replace(/\D/g, '');

      // Create main reservation
      const { data: reservation, error: reservationError } = await supabase
        .from('reservations')
        .insert({
          route_id: route!.id,
          customer_name: name.trim(),
          customer_phone: cleanedPhone,
          travel_date: format(travelDate, 'yyyy-MM-dd'),
          trip_type: tripType,
          return_route_id: returnRoute?.id || null,
          observations: observations.trim() || null,
        })
        .select()
        .single();

      if (reservationError) {
        toast({
          title: "Erro",
          description: "Não foi possível confirmar a reserva. Tente novamente.",
          variant: "destructive",
        });
        return;
      }

      // If it's a round trip, create return reservation too
      if (tripType === 'Ida e Volta' && returnRoute) {
        const { error: returnError } = await supabase
          .from('reservations')
          .insert({
            route_id: returnRoute.id,
            customer_name: name.trim(),
            customer_phone: cleanedPhone,
            travel_date: format(travelDate, 'yyyy-MM-dd'),
            trip_type: 'Volta',
            observations: observations.trim() || null,
          });

        if (returnError) {
          console.error('Error creating return reservation:', returnError);
          // Continue anyway, main reservation was successful
        }
      }

      setLastReservation(reservation);
      setShowConfirmation(true);
    } catch (error) {
      console.error('Error creating reservation:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    setName("");
    setPhone("");
    setObservations("");
    onClose();
  };

  const handleViewHistory = () => {
    setShowConfirmation(false);
    setShowHistory(true);
  };

  const handleHistoryClose = () => {
    setShowHistory(false);
    setName("");
    setPhone("");
    setObservations("");
    onClose();
  };

  if (!route) return null;

  const totalPrice = tripType === 'Ida e Volta' && returnRoute 
    ? route.price + returnRoute.price 
    : route.price;

  return (
    <>
      <Dialog open={isOpen && !showConfirmation && !showHistory} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-primary">Confirmar Reserva</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Route Information */}
            <div className="bg-secondary rounded-lg p-4 space-y-3">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Data da viagem: {format(travelDate, "PPP", { locale: ptBR })}
                </p>
                <div className="space-y-2">
                  <div>
                    <p className="text-lg font-semibold text-primary">
                      {route.origin} → {route.destination}
                    </p>
                    <p className="text-muted-foreground">{route.departure_time}</p>
                    <p className="text-lg font-bold text-accent">R$ {route.price}</p>
                  </div>
                  
                  {tripType === 'Ida e Volta' && returnRoute && (
                    <div className="border-t pt-2">
                      <p className="text-lg font-semibold text-primary">
                        {returnRoute.origin} → {returnRoute.destination}
                      </p>
                      <p className="text-muted-foreground">{returnRoute.departure_time}</p>
                      <p className="text-lg font-bold text-accent">R$ {returnRoute.price}</p>
                    </div>
                  )}
                </div>
                
                {tripType === 'Ida e Volta' && (
                  <div className="border-t pt-2 mt-2">
                    <p className="text-xl font-bold text-accent">
                      Total: R$ {totalPrice}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Digite seu nome completo"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Número de telefone</Label>
                <InputMask
                  mask="(99) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isSubmitting}
                >
                  {(inputProps: any) => (
                    <Input
                      {...inputProps}
                      id="phone"
                      placeholder="(87) 99999-9999"
                    />
                  )}
                </InputMask>
                <p className="text-xs text-muted-foreground">
                  Digite um telefone válido com 11 dígitos
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observations">Observações adicionais</Label>
                <Textarea
                  id="observations"
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Alguma observação sobre sua viagem? (opcional)"
                  disabled={isSubmitting}
                  className="min-h-[80px]"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Confirmando..." : "Confirmar Reserva"}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <ReservationConfirmationDialog
        isOpen={showConfirmation}
        onClose={handleConfirmationClose}
        onViewHistory={handleViewHistory}
        route={route}
        returnRoute={returnRoute}
        tripType={tripType}
        customerName={name}
        reservation={lastReservation}
      />

      <UserHistoryDialog
        isOpen={showHistory}
        onClose={handleHistoryClose}
        customerPhone={phone.replace(/\D/g, '')}
      />
    </>
  );
}
import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Heart } from "lucide-react";

interface Route {
  id: string;
  origin: string;
  destination: string;
  departure_time: string;
  price: number;
  is_active: boolean;
}

type TripType = 'Ida' | 'Volta' | 'Ida e Volta';

interface ReservationConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onViewHistory: () => void;
  route: Route | null;
  returnRoute?: Route | null;
  tripType?: TripType;
  customerName: string;
  reservation?: any;
  travelDate?: Date;
}

export default function ReservationConfirmationDialog({ 
  isOpen, 
  onClose, 
  onViewHistory, 
  route, 
  returnRoute = null,
  tripType = 'Ida',
  customerName,
  reservation,
  travelDate = new Date()
}: ReservationConfirmationDialogProps) {
  if (!route) return null;


  const totalPrice = tripType === 'Ida e Volta' && returnRoute 
    ? route.price + returnRoute.price 
    : route.price;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-primary flex items-center justify-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Reserva Confirmada!
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="bg-secondary rounded-lg p-6 text-center">
            <div className="mb-4">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Heart className="h-6 w-6 text-red-500" />
                <h2 className="text-2xl font-bold text-primary">
                  J Turismo agradece sua reserva!
                </h2>
                <Heart className="h-6 w-6 text-red-500" />
              </div>
              <p className="text-lg text-muted-foreground">
                Olá, {customerName}!
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Sua reserva foi confirmada com sucesso
              </p>
            </div>
            
            {/* Protocol */}
            {reservation?.protocol && (
              <div className="bg-background rounded-lg p-3 mb-3">
                <p className="text-xs text-muted-foreground mb-1">Protocolo da reserva:</p>
                <div className="flex items-center justify-center">
                  <span className="font-mono text-sm font-bold text-primary">
                    {reservation.protocol}
                  </span>
                </div>
              </div>
            )}

            <div className="bg-background rounded-lg p-3 space-y-2">
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
              
              {tripType === 'Ida e Volta' && (
                <div className="border-t pt-2">
                  <p className="text-xl font-bold text-accent">
                    Total: R$ {totalPrice}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Voltar para Reserva
              </Button>
              <Button
                onClick={onViewHistory}
                className="flex-1"
              >
                Ver Histórico
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
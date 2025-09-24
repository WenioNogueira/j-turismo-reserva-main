import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, Users } from "lucide-react";
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

interface RouteCardProps {
  route: Route;
  onReserve: (route: Route) => void;
  isSelected?: boolean;
}

export default function RouteCard({ route, onReserve, isSelected = false }: RouteCardProps) {
  return (
    <Card className={cn(
      "shadow-card hover:shadow-hover transition-all duration-300 hover:scale-[1.02]",
      isSelected && "ring-2 ring-primary bg-primary/5"
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-primary">
            <MapPin className="h-5 w-5" />
            <span className="font-semibold text-lg">
              {route.origin} → {route.destination}
            </span>
          </div>
          {isSelected && (
            <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
              Selecionada
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-4 mb-4 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{route.departure_time}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{route.capacity} vagas</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-accent">
            R$ {route.price}
          </div>
          <Button 
            onClick={() => onReserve(route)}
            className="bg-transport-blue hover:bg-transport-blue/90"
            disabled={isSelected}
          >
            {isSelected ? "Selecionada" : "Reservar"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
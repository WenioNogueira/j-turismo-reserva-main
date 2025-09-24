import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-card">
        <CardContent className="p-8 text-center space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">J Turismo</h1>
            <p className="text-muted-foreground">Sistema de Reservas de Viagem</p>
          </div>
          
          <div className="space-y-4">
            <Button
              onClick={() => window.location.href = "/auth"}
              className="w-full text-lg py-6"
            >
              Painel Administrativo
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Acesso para administradores do sistema
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;

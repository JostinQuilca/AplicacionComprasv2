
"use client";

import { useState } from "react";
import withAuth from "@/components/layout/withAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

function ConfiguracionesPage() {
  // El valor del IVA se obtiene de una constante, pero se gestiona con estado para permitir la edición.
  // En el futuro, este valor se podría obtener y guardar en una base de datos o archivo de configuración.
  const [ivaRate, setIvaRate] = useState(15.00);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // La lógica de guardado permanente se implementará en el futuro.
    // Por ahora, solo muestra una notificación de éxito.
    toast({
      title: "Guardado Simulado",
      description: `La tasa de IVA se ha establecido en ${ivaRate}%. La funcionalidad de guardado real se implementará próximamente.`,
    });
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Configuraciones</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Impuestos</CardTitle>
          <CardDescription>
            Gestiona los parámetros de impuestos que se aplican en toda la aplicación, como el cálculo del IVA en las facturas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="iva-rate">Tasa de IVA (%)</Label>
              <Input 
                id="iva-rate" 
                type="number" 
                value={ivaRate}
                onChange={(e) => setIvaRate(Number(e.target.value))}
                step="0.01"
                min="0"
              />
              <p className="text-sm text-muted-foreground">
                Este valor se usará para calcular automáticamente el IVA en los detalles de las facturas.
              </p>
            </div>
             <Button type="submit">
              Guardar Cambios
            </Button>
          </form>
        </CardContent>
      </Card>
      
    </main>
  );
}

export default withAuth(ConfiguracionesPage);


"use client";

import withAuth from "@/components/layout/withAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function ConfiguracionesPage() {
  // El valor del IVA está actualmente hardcodeado.
  // En el futuro, este valor se podría obtener de una base de datos o archivo de configuración.
  const currentIvaRate = 15.00;

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
          <form className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="iva-rate">Tasa de IVA (%)</Label>
              <Input 
                id="iva-rate" 
                type="number" 
                value={currentIvaRate.toFixed(2)}
                disabled // Deshabilitado por ahora, se puede habilitar cuando se implemente la lógica de guardado.
                className="cursor-not-allowed"
              />
              <p className="text-sm text-muted-foreground">
                Este valor se usará para calcular automáticamente el IVA en los detalles de las facturas.
              </p>
            </div>
             <Button type="submit" disabled>
              Guardar Cambios
            </Button>
          </form>
        </CardContent>
      </Card>
      
    </main>
  );
}

export default withAuth(ConfiguracionesPage);

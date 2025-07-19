
"use client";

import { useState, useEffect } from "react";
import withAuth from "@/components/layout/withAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getIvaRate, setIvaRate as saveIvaRate } from "@/lib/config";

function ConfiguracionesPage() {
  const [ivaRate, setIvaRate] = useState<number>(15.00);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Carga el valor inicial del localStorage al montar el componente.
    setIvaRate(getIvaRate() * 100);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Guarda el nuevo valor en localStorage.
      saveIvaRate(ivaRate / 100);
      toast({
        title: "Guardado Exitoso",
        description: `La tasa de IVA se ha actualizado a ${ivaRate.toFixed(2)}%.`,
      });
    } catch (error) {
      toast({
        title: "Error al Guardar",
        description: "No se pudo guardar la configuración.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
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
             <Button type="submit" disabled={isSaving}>
              {isSaving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </form>
        </CardContent>
      </Card>
      
    </main>
  );
}

export default withAuth(ConfiguracionesPage);

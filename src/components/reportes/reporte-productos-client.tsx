
"use client";

import * as React from "react";
import { format } from "date-fns";
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, Download } from "lucide-react";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import type { FacturaCompra, Producto, FacturaDetalle } from "@/lib/types";

interface ReporteProductosClientProps {
  facturas: FacturaCompra[];
  productos: Producto[];
  detalles: FacturaDetalle[];
}

interface ReporteData {
  productoId: number;
  nombreProducto: string;
  cantidadTotal: number;
  precioPromedio: number;
  totalComprado: number;
}

export default function ReporteProductosClient({ facturas, productos, detalles }: ReporteProductosClientProps) {
  const { toast } = useToast();
  const [startDate, setStartDate] = React.useState<Date | undefined>();
  const [endDate, setEndDate] = React.useState<Date | undefined>();
  const [reportData, setReportData] = React.useState<ReporteData[]>([]);

  const productoMap = React.useMemo(() => new Map(productos.map(p => [p.id_producto, p.nombre])), [productos]);

  const handleGenerateReport = () => {
    if (!startDate || !endDate) {
      toast({
        title: "Fechas requeridas",
        description: "Por favor, seleccione una fecha de inicio y una fecha de fin.",
        variant: "destructive",
      });
      return;
    }
    
    if (startDate > endDate) {
      toast({
        title: "Error de fechas",
        description: "La fecha de inicio no puede ser posterior a la fecha de fin.",
        variant: "destructive",
      });
      return;
    }
    
    // 1. Filtrar facturas por el rango de fechas y que no esten canceladas
    const facturasEnRangoIds = new Set(
        facturas
            .filter(f => {
                const fechaEmision = new Date(f.fecha_emision);
                return fechaEmision >= startDate && fechaEmision <= endDate && f.estado !== 'Cancelada';
            })
            .map(f => f.id)
    );

    // 2. Filtrar detalles que correspondan a esas facturas
    const detallesEnRango = detalles.filter(d => facturasEnRangoIds.has(d.factura_id));

    if (detallesEnRango.length === 0) {
        toast({ title: "Sin resultados", description: "No se encontraron compras de productos en el rango de fechas seleccionado." });
        setReportData([]);
        return;
    }

    // 3. Agrupar detalles por producto
    const productosAgrupados = detallesEnRango.reduce((acc, detalle) => {
        if (!acc[detalle.producto_id]) {
            acc[detalle.producto_id] = {
                productoId: detalle.producto_id,
                nombreProducto: productoMap.get(detalle.producto_id) || 'Producto Desconocido',
                cantidadTotal: 0,
                totalComprado: 0,
                items: 0, // para calcular promedio de precios
            };
        }
        acc[detalle.producto_id].cantidadTotal += detalle.cantidad;
        acc[detalle.producto_id].totalComprado += detalle.total;
        acc[detalle.producto_id].items += detalle.cantidad * detalle.precio_unitario;

        return acc;
    }, {} as Record<number, any>);

    // 4. Calcular el precio promedio y formatear los datos finales
    const generatedData = Object.values(productosAgrupados).map(p => ({
        ...p,
        precioPromedio: p.items / p.cantidadTotal,
    }));
    
    setReportData(generatedData);
  };
  
  const totalGeneralComprado = React.useMemo(() => {
    return reportData.reduce((acc, item) => acc + item.totalComprado, 0);
  }, [reportData]);

  const handleDownloadPdf = () => {
    if (reportData.length === 0) {
      toast({ title: "Sin datos", description: "Genere un reporte antes de descargarlo.", variant: "destructive" });
      return;
    }
    const doc = new jsPDF();
    const formattedStartDate = startDate ? format(startDate, 'dd/MM/yyyy') : '';
    const formattedEndDate = endDate ? format(endDate, 'dd/MM/yyyy') : '';
    
    doc.text('Reporte de Compras por Producto', 14, 15);
    doc.setFontSize(10);
    doc.text(`Rango de fechas: ${formattedStartDate} - ${formattedEndDate}`, 14, 22);

    autoTable(doc, {
      startY: 28,
      head: [['Producto', 'Cantidad Total', 'Precio Promedio', 'Total Comprado']],
      body: reportData.map(item => [
          item.nombreProducto, 
          item.cantidadTotal,
          `$${item.precioPromedio.toFixed(2)}`,
          `$${item.totalComprado.toFixed(2)}`
      ]),
      foot: [['Total General', '', '', `$${totalGeneralComprado.toFixed(2)}`]],
      showFoot: 'lastPage',
      footStyles: {
        fontStyle: 'bold',
        fillColor: [230, 230, 230],
        textColor: 20
      }
    });
    
    doc.save(`reporte_productos_${formattedStartDate}_${formattedEndDate}.pdf`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Filtros del Reporte</CardTitle>
          <CardDescription>Seleccione un rango de fechas para generar el reporte de compras.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4 items-center">
            <Popover>
                <PopoverTrigger asChild>
                <Button variant={"outline"} className={cn("w-[240px] justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP", { locale: es }) : <span>Fecha de inicio</span>}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus locale={es}/>
                </PopoverContent>
            </Popover>
            <Popover>
                <PopoverTrigger asChild>
                <Button variant={"outline"} className={cn("w-[240px] justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP", { locale: es }) : <span>Fecha de fin</span>}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={endDate} onSelect={setEndDate} disabled={{ before: startDate }} initialFocus locale={es} />
                </PopoverContent>
            </Popover>
            <Button onClick={handleGenerateReport}>Generar Reporte</Button>
        </CardContent>
      </Card>

      {reportData.length > 0 && (
         <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Resultados del Reporte</CardTitle>
                <CardDescription>Análisis de productos comprados en el período seleccionado.</CardDescription>
            </div>
            <Button onClick={handleDownloadPdf} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Descargar PDF
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead className="text-right">Cantidad Total</TableHead>
                    <TableHead className="text-right">Precio Promedio</TableHead>
                    <TableHead className="text-right">Total Comprado</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {reportData.map((item) => (
                    <TableRow key={item.productoId}>
                    <TableCell className="font-medium">{item.nombreProducto}</TableCell>
                    <TableCell className="text-right">{item.cantidadTotal}</TableCell>
                    <TableCell className="text-right">${item.precioPromedio.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-semibold">${item.totalComprado.toFixed(2)}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="justify-end font-bold text-lg">
             Total General Comprado: ${totalGeneralComprado.toFixed(2)}
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

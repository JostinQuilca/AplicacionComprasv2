
"use client";

import * as React from "react";
import { format, parseISO } from "date-fns";
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, Download } from "lucide-react";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { FacturaCompra, Producto, FacturaDetalle, Proveedor } from "@/lib/types";
import { Combobox, ComboboxOption } from "../ui/combobox";

interface ReporteProductosClientProps {
  facturas: (FacturaCompra & { nombre_proveedor: string })[];
  productos: Producto[];
  detalles: FacturaDetalle[];
  proveedores: Proveedor[];
}

interface ReporteData {
  numeroFactura: string;
  fecha: string;
  proveedor: string;
  producto: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
}

export default function ReporteProductosClient({ facturas, productos, detalles, proveedores }: ReporteProductosClientProps) {
  const { toast } = useToast();
  const [startDate, setStartDate] = React.useState<Date | undefined>();
  const [endDate, setEndDate] = React.useState<Date | undefined>();
  const [selectedProveedor, setSelectedProveedor] = React.useState<string>("");
  const [selectedProducto, setSelectedProducto] = React.useState<string>("");

  const proveedorMap = React.useMemo(() => new Map(proveedores.map(p => [p.cedula_ruc, p.nombre])), [proveedores]);
  const productoMap = React.useMemo(() => new Map(productos.map(p => [String(p.id_producto), p.nombre])), [productos]);

  const proveedorOptions: ComboboxOption[] = React.useMemo(() => 
      proveedores.map(p => ({ value: p.cedula_ruc, label: p.nombre })),
      [proveedores]
  );

  const productoOptions: ComboboxOption[] = React.useMemo(() => 
      productos.map(p => ({ value: String(p.id_producto), label: p.nombre })),
      [productos]
  );

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
        description: "Las fechas no son válidas. Verifique el rango.",
        variant: "destructive",
      });
      return;
    }
    
    // 1. Filtrar facturas por fecha, proveedor y que no estén canceladas
    const facturasFiltradas = facturas.filter(f => {
        const fechaEmision = parseISO(f.fecha_emision);
        const enRango = fechaEmision >= startDate && fechaEmision <= endDate;
        const proveedorCoincide = !selectedProveedor || f.proveedor_cedula_ruc === selectedProveedor;
        return enRango && proveedorCoincide && f.estado !== 'Cancelada';
    });
    
    const facturasFiltradasIds = new Set(facturasFiltradas.map(f => f.id));

    // 2. Filtrar detalles que correspondan a esas facturas y al producto seleccionado (si aplica)
    const detallesFiltrados = detalles.filter(d => 
        facturasFiltradasIds.has(d.factura_id) &&
        (!selectedProducto || String(d.producto_id) === selectedProducto)
    );

    if (detallesFiltrados.length === 0) {
        toast({ title: "Sin resultados", description: "No se encontraron datos con los filtros aplicados." });
        return;
    }

    const facturaMap = new Map(facturasFiltradas.map(f => [f.id, f]));

    // 3. Construir los datos para el reporte
    const generatedData: ReporteData[] = detallesFiltrados.map(detalle => {
        const factura = facturaMap.get(detalle.factura_id);
        return {
            numeroFactura: factura?.numero_factura_proveedor || 'N/A',
            fecha: factura ? format(parseISO(factura.fecha_emision), 'dd/MM/yyyy') : 'N/A',
            proveedor: factura?.nombre_proveedor || 'Desconocido',
            producto: productoMap.get(String(detalle.producto_id)) || 'Desconocido',
            cantidad: detalle.cantidad,
            precioUnitario: detalle.precio_unitario,
            total: detalle.total
        };
    });
    
    handleDownloadPdf(generatedData);
  };
  
  const handleDownloadPdf = (data: ReporteData[]) => {
    const doc = new jsPDF();
    const formattedStartDate = startDate ? format(startDate, 'dd/MM/yyyy') : '';
    const formattedEndDate = endDate ? format(endDate, 'dd/MM/yyyy') : '';
    const totalGeneral = data.reduce((acc, item) => acc + item.total, 0);

    doc.text('Reporte Detallado de Facturas por Producto', 14, 15);
    doc.setFontSize(10);
    doc.text(`Periodo: ${formattedStartDate} - ${formattedEndDate}`, 14, 22);
    if(selectedProveedor) doc.text(`Proveedor: ${proveedorMap.get(selectedProveedor)}`, 14, 28);
    if(selectedProducto) doc.text(`Producto: ${productoMap.get(selectedProducto)}`, 14, 34);

    autoTable(doc, {
      startY: selectedProducto || selectedProveedor ? 40 : 28,
      head: [['# Factura', 'Fecha', 'Proveedor', 'Producto', 'Cant.', 'P. Unit.', 'Total']],
      body: data.map(item => [
          item.numeroFactura,
          item.fecha,
          item.proveedor,
          item.producto,
          item.cantidad,
          `$${item.precioUnitario.toFixed(2)}`,
          `$${item.total.toFixed(2)}`
      ]),
      foot: [['Total General', '', '', '', '', '', `$${totalGeneral.toFixed(2)}`]],
      showFoot: 'lastPage',
      footStyles: {
        fontStyle: 'bold',
        fillColor: [230, 230, 230],
        textColor: 20
      },
      didParseCell: function (data) {
        if (data.row.section === 'body') {
            // Limit supplier and product name length to avoid overflow
            if (data.column.index === 2 || data.column.index === 3) {
                if (Array.isArray(data.cell.text)) {
                    data.cell.text[0] = data.cell.text[0].substring(0, 20);
                }
            }
        }
      }
    });
    
    doc.save(`reporte_compras_productos_${formattedStartDate}_a_${formattedEndDate}.pdf`);
  };

  return (
    <Card>
        <CardHeader>
            <CardTitle>Reporte Detallado de Compras</CardTitle>
            <CardDescription>Filtre por fechas, proveedor y/o producto para generar un reporte detallado en PDF.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Popover>
                    <PopoverTrigger asChild>
                    <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
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
                    <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP", { locale: es }) : <span>Fecha de fin</span>}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} disabled={{ before: startDate }} initialFocus locale={es} />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Combobox
                    options={proveedorOptions}
                    value={selectedProveedor}
                    onChange={setSelectedProveedor}
                    placeholder="Filtrar por proveedor (opcional)"
                    searchPlaceholder="Buscar proveedor..."
                    emptyPlaceholder="No se encontró proveedor."
                />
                 <Combobox
                    options={productoOptions}
                    value={selectedProducto}
                    onChange={setSelectedProducto}
                    placeholder="Filtrar por producto (opcional)"
                    searchPlaceholder="Buscar producto..."
                    emptyPlaceholder="No se encontró producto."
                />
            </div>
            <div className="flex justify-end">
                <Button onClick={handleGenerateReport}>
                    <Download className="mr-2 h-4 w-4" />
                    Generar Reporte
                </Button>
            </div>
        </CardContent>
    </Card>
  );
}

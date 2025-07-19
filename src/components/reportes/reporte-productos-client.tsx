
"use client";

import * as React from "react";
import { format, parseISO } from "date-fns";
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, Download, ArrowUpDown } from "lucide-react";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

type SortKey = keyof ReporteData;

export default function ReporteProductosClient({ facturas, productos, detalles, proveedores }: ReporteProductosClientProps) {
  const { toast } = useToast();
  const [startDate, setStartDate] = React.useState<Date | undefined>();
  const [endDate, setEndDate] = React.useState<Date | undefined>();
  const [selectedProveedor, setSelectedProveedor] = React.useState<string>("");
  const [selectedProducto, setSelectedProducto] = React.useState<string>("");
  const [reportData, setReportData] = React.useState<ReporteData[]>([]);
  const [sortConfig, setSortConfig] = React.useState<{ key: SortKey; direction: "asc" | "desc" } | null>(null);

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
        setReportData([]);
        return;
    }

    const facturaMap = new Map(facturasFiltradas.map(f => [f.id, f]));

    // 3. Construir los datos para el reporte
    const generatedData: ReporteData[] = detallesFiltrados.map(detalle => {
        const factura = facturaMap.get(detalle.factura_id);
        return {
            numeroFactura: factura?.numero_factura_proveedor || 'N/A',
            fecha: factura ? format(parseISO(factura.fecha_emision), 'yyyy-MM-dd') : 'N/A',
            proveedor: factura?.nombre_proveedor || 'Desconocido',
            producto: productoMap.get(String(detalle.producto_id)) || 'Desconocido',
            cantidad: detalle.cantidad,
            precioUnitario: detalle.precio_unitario,
            total: detalle.total
        };
    });
    
    setReportData(generatedData);
  };
  
  const sortedData = React.useMemo(() => {
    let sortableData = [...reportData];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [reportData, sortConfig]);

  const handleSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const totalGeneral = React.useMemo(() => {
    return sortedData.reduce((acc, item) => acc + item.total, 0);
  }, [sortedData]);


  const handleDownloadPdf = () => {
    if (sortedData.length === 0) {
        toast({ title: "Sin datos", description: "No hay datos para generar el PDF."});
        return;
    }
    const doc = new jsPDF();
    const formattedStartDate = startDate ? format(startDate, 'dd/MM/yyyy') : '';
    const formattedEndDate = endDate ? format(endDate, 'dd/MM/yyyy') : '';

    doc.text('Reporte Detallado de Facturas por Producto', 14, 15);
    doc.setFontSize(10);
    doc.text(`Periodo: ${formattedStartDate} - ${formattedEndDate}`, 14, 22);
    if(selectedProveedor) doc.text(`Proveedor: ${proveedorMap.get(selectedProveedor)}`, 14, 28);
    if(selectedProducto) doc.text(`Producto: ${productoMap.get(selectedProducto)}`, 14, 34);

    autoTable(doc, {
      startY: selectedProducto || selectedProveedor ? 40 : 28,
      head: [['# Factura', 'Fecha', 'Proveedor', 'Producto', 'Cant.', 'P. Unit.', 'Total']],
      body: sortedData.map(item => [
          item.numeroFactura,
          format(parseISO(item.fecha), 'dd/MM/yyyy'),
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
    <div className="space-y-6">
      <Card>
          <CardHeader>
              <CardTitle>Reporte Detallado de Compras</CardTitle>
              <CardDescription>Filtre por fechas, proveedor y/o producto para generar un reporte detallado.</CardDescription>
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
                      <Calendar mode="single" selected={endDate} onSelect={setEndDate} disabled={startDate ? { before: startDate } : undefined} initialFocus locale={es} />
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
                      Generar Reporte
                  </Button>
              </div>
          </CardContent>
      </Card>
      
      {reportData.length > 0 && (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                  <CardTitle>Resultados del Reporte</CardTitle>
                  <CardDescription>Previsualización de los datos filtrados. Puede ordenar la tabla haciendo clic en los encabezados.</CardDescription>
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
                      <TableHead className="cursor-pointer" onClick={() => handleSort('numeroFactura')}>
                        <span className="flex items-center gap-2"># Factura<ArrowUpDown className="h-4 w-4" /></span>
                      </TableHead>
                       <TableHead className="cursor-pointer" onClick={() => handleSort('fecha')}>
                        <span className="flex items-center gap-2">Fecha<ArrowUpDown className="h-4 w-4" /></span>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('proveedor')}>
                        <span className="flex items-center gap-2">Proveedor<ArrowUpDown className="h-4 w-4" /></span>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('producto')}>
                        <span className="flex items-center gap-2">Producto<ArrowUpDown className="h-4 w-4" /></span>
                      </TableHead>
                      <TableHead className="text-right cursor-pointer" onClick={() => handleSort('cantidad')}>
                        <span className="flex items-center justify-end gap-2">Cantidad<ArrowUpDown className="h-4 w-4" /></span>
                      </TableHead>
                       <TableHead className="text-right cursor-pointer" onClick={() => handleSort('precioUnitario')}>
                        <span className="flex items-center justify-end gap-2">P. Unit.<ArrowUpDown className="h-4 w-4" /></span>
                      </TableHead>
                      <TableHead className="text-right cursor-pointer" onClick={() => handleSort('total')}>
                        <span className="flex items-center justify-end gap-2">Total<ArrowUpDown className="h-4 w-4" /></span>
                      </TableHead>
                  </TableRow>
                  </TableHeader>
                  <TableBody>
                  {sortedData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.numeroFactura}</TableCell>
                        <TableCell>{format(parseISO(item.fecha), 'dd/MM/yyyy')}</TableCell>
                        <TableCell>{item.proveedor}</TableCell>
                        <TableCell>{item.producto}</TableCell>
                        <TableCell className="text-right">{item.cantidad}</TableCell>
                        <TableCell className="text-right">${item.precioUnitario.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-medium">${item.total.toFixed(2)}</TableCell>
                      </TableRow>
                  ))}
                  </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="justify-end font-bold text-lg border-t pt-4">
                Total General: ${totalGeneral.toFixed(2)}
            </CardFooter>
        </Card>
      )}
    </div>
  );
}

    
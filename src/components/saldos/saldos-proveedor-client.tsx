<<<<<<< HEAD

"use client";

import * as React from "react";
import { format, parseISO } from "date-fns";
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, ArrowUpDown, Download } from "lucide-react";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
=======
"use client";

import * as React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, ArrowUpDown, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
>>>>>>> 6848165a999a2d46fa6bf0e01334dd64a07deef0

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
<<<<<<< HEAD
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
=======
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
>>>>>>> 6848165a999a2d46fa6bf0e01334dd64a07deef0
import { useToast } from "@/hooks/use-toast";
import type { Proveedor, FacturaCompra } from "@/lib/types";

interface SaldosProveedorClientProps {
  proveedores: Proveedor[];
  facturas: FacturaCompra[];
}

interface ReporteData {
  cedula_ruc: string;
  nombre: string;
  saldo: number;
}

type SortKey = keyof ReporteData;

<<<<<<< HEAD
export default function SaldosProveedorClient({ proveedores, facturas }: SaldosProveedorClientProps) {
=======
export default function SaldosProveedorClient({
  proveedores,
  facturas,
}: SaldosProveedorClientProps) {
>>>>>>> 6848165a999a2d46fa6bf0e01334dd64a07deef0
  const { toast } = useToast();
  const [startDate, setStartDate] = React.useState<Date | undefined>();
  const [endDate, setEndDate] = React.useState<Date | undefined>();
  const [reportData, setReportData] = React.useState<ReporteData[]>([]);
<<<<<<< HEAD
  const [sortConfig, setSortConfig] = React.useState<{ key: SortKey; direction: "asc" | "desc" } | null>(null);
=======
  const [sortConfig, setSortConfig] = React.useState<{
    key: SortKey;
    direction: "asc" | "desc";
  } | null>(null);
>>>>>>> 6848165a999a2d46fa6bf0e01334dd64a07deef0

  const handleGenerateReport = () => {
    if (!startDate || !endDate) {
      toast({
        title: "Fechas requeridas",
<<<<<<< HEAD
        description: "Por favor, seleccione una fecha de inicio y una fecha de fin.",
=======
        description:
          "Por favor, seleccione una fecha de inicio y una fecha de fin.",
>>>>>>> 6848165a999a2d46fa6bf0e01334dd64a07deef0
        variant: "destructive",
      });
      return;
    }

    if (startDate > endDate) {
      toast({
        title: "Error de validación",
<<<<<<< HEAD
        description: "Las fechas seleccionadas no son válidas. Verifique el rango.",
=======
        description:
          "Las fechas seleccionadas no son válidas. Verifique el rango.",
>>>>>>> 6848165a999a2d46fa6bf0e01334dd64a07deef0
        variant: "destructive",
      });
      return;
    }

<<<<<<< HEAD
    const facturasCredito = facturas.filter(f => {
        const fechaEmision = parseISO(f.fecha_emision);
        return (
            f.tipo_pago === 'Crédito' &&
            f.estado !== 'Cancelada' &&
            fechaEmision >= startDate &&
            fechaEmision <= endDate
        );
    });

    if (facturasCredito.length === 0) {
        toast({
            title: "Sin resultados",
            description: "No se encontraron proveedores con facturas a crédito para el rango de fechas seleccionado."
        });
        setReportData([]);
        return;
=======
    const facturasCredito = facturas.filter((f) => {
      const fechaEmision = new Date(f.fecha_emision);
      return (
        f.tipo_pago === "Crédito" &&
        f.estado !== "Cancelada" &&
        fechaEmision >= startDate &&
        fechaEmision <= endDate
      );
    });

    if (facturasCredito.length === 0) {
      toast({
        title: "Sin resultados",
        description:
          "No se encontraron proveedores o créditos para el rango de fechas seleccionado.",
      });
      setReportData([]);
      return;
>>>>>>> 6848165a999a2d46fa6bf0e01334dd64a07deef0
    }

    const saldosPorProveedor: { [key: string]: number } = {};

<<<<<<< HEAD
    facturasCredito.forEach(f => {
      saldosPorProveedor[f.proveedor_cedula_ruc] = (saldosPorProveedor[f.proveedor_cedula_ruc] || 0) + f.total;
    });
    
    const proveedorMap = new Map(proveedores.map(p => [p.cedula_ruc, p.nombre]));
=======
    facturasCredito.forEach((f) => {
      saldosPorProveedor[f.proveedor_cedula_ruc] =
        (saldosPorProveedor[f.proveedor_cedula_ruc] || 0) + f.total;
    });

    const proveedorMap = new Map(
      proveedores.map((p) => [p.cedula_ruc, p.nombre])
    );
>>>>>>> 6848165a999a2d46fa6bf0e01334dd64a07deef0

    const generatedData: ReporteData[] = Object.entries(saldosPorProveedor)
      .map(([cedula_ruc, saldo]) => ({
        cedula_ruc,
<<<<<<< HEAD
        nombre: proveedorMap.get(cedula_ruc) || 'Proveedor Desconocido',
        saldo,
      }))
      .filter(item => item.saldo > 0);

    setReportData(generatedData);
    if(generatedData.length === 0) {
        toast({
            title: "Sin saldos pendientes",
            description: "No se encontraron saldos pendientes para el rango de fechas seleccionado."
        });
=======
        nombre: proveedorMap.get(cedula_ruc) || "Proveedor Desconocido",
        saldo,
      }))
      .filter((item) => item.saldo > 0);

    setReportData(generatedData);
    if (generatedData.length === 0) {
      toast({
        title: "Sin resultados",
        description:
          "No se encontraron saldos pendientes para el rango de fechas seleccionado.",
      });
>>>>>>> 6848165a999a2d46fa6bf0e01334dd64a07deef0
    }
  };

  const sortedData = React.useMemo(() => {
    let sortableData = [...reportData];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
<<<<<<< HEAD
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === 'asc' ? 1 : -1;
=======
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
>>>>>>> 6848165a999a2d46fa6bf0e01334dd64a07deef0
        }
        return 0;
      });
    }
    return sortableData;
  }, [reportData, sortConfig]);

  const handleSort = (key: SortKey) => {
<<<<<<< HEAD
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
=======
    if (reportData.length < 2) {
      toast({
        title: "No se puede ordenar",
        description: "No hay suficientes datos para ordenar.",
      });
      return;
    }
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

>>>>>>> 6848165a999a2d46fa6bf0e01334dd64a07deef0
  const totalSaldo = React.useMemo(() => {
    return sortedData.reduce((acc, item) => acc + item.saldo, 0);
  }, [sortedData]);

<<<<<<< HEAD

  const handleDownloadPdf = () => {
    if (reportData.length === 0) {
        toast({ title: "Sin datos", description: "No hay datos para generar el PDF."});
        return;
    }
    const doc = new jsPDF();
    const formattedStartDate = startDate ? format(startDate, 'dd/MM/yyyy') : '';
    const formattedEndDate = endDate ? format(endDate, 'dd/MM/yyyy') : '';
    
    doc.text('Reporte de Saldos de Proveedor', 14, 15);
    doc.setFontSize(10);
    doc.text(`Rango de fechas: ${formattedStartDate} - ${formattedEndDate}`, 14, 22);

    autoTable(doc, {
      startY: 28,
      head: [['Proveedor', 'Saldo Pendiente']],
      body: sortedData.map(item => [item.nombre, `$${item.saldo.toFixed(2)}`]),
      foot: [['Total General', `$${totalSaldo.toFixed(2)}`]],
      showFoot: 'lastPage',
      footStyles: {
        fontStyle: 'bold',
        fillColor: [230, 230, 230],
        textColor: 20
      }
    });
    
    doc.save(`reporte_saldos_proveedores_${formattedStartDate}_a_${formattedEndDate}.pdf`);
=======
  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    const formattedStartDate = startDate ? format(startDate, "dd/MM/yyyy") : "";
    const formattedEndDate = endDate ? format(endDate, "dd/MM/yyyy") : "";

    doc.text("Reporte de Saldos de Proveedor", 14, 15);
    doc.setFontSize(10);
    doc.text(
      `Rango de fechas: ${formattedStartDate} - ${formattedEndDate}`,
      14,
      22
    );

    autoTable(doc, {
      startY: 28,
      head: [["Proveedor", "Saldo Pendiente"]],
      body: sortedData.map((item) => [
        item.nombre,
        `$${item.saldo.toFixed(2)}`,
      ]),
      foot: [["Total General", `$${totalSaldo.toFixed(2)}`]],
      showFoot: "lastPage",
      footStyles: {
        fontStyle: "bold",
        fillColor: [230, 230, 230],
        textColor: 20,
      },
    });

    doc.save("reporte_saldos_proveedores.pdf");
>>>>>>> 6848165a999a2d46fa6bf0e01334dd64a07deef0
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Filtros del Reporte</CardTitle>
<<<<<<< HEAD
          <CardDescription>Seleccione un rango de fechas para generar el reporte de saldos de proveedores con facturas a crédito.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        id="date-start"
                        variant={"outline"}
                        className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP", { locale: es }) : <span>Fecha de inicio</span>}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                        locale={es}
                    />
                    </PopoverContent>
                </Popover>
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        id="date-end"
                        variant={"outline"}
                        className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP", { locale: es }) : <span>Fecha de fin</span>}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={{ before: startDate }}
                        initialFocus
                        locale={es}
                    />
                    </PopoverContent>
                </Popover>
              <Button onClick={handleGenerateReport} className="w-full lg:w-auto">Generar Reporte</Button>
            </div>
=======
          <CardDescription>
            Seleccione un rango de fechas para generar el reporte de saldos.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4 items-center">
          <div className="grid gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? (
                    format(startDate, "PPP", { locale: es })
                  ) : (
                    <span>Fecha de inicio</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? (
                    format(endDate, "PPP", { locale: es })
                  ) : (
                    <span>Fecha de fin</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  disabled={startDate ? { before: startDate } : undefined}
                  initialFocus
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button onClick={handleGenerateReport}>Generar Reporte</Button>
>>>>>>> 6848165a999a2d46fa6bf0e01334dd64a07deef0
        </CardContent>
      </Card>

      {reportData.length > 0 && (
<<<<<<< HEAD
         <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Resultados del Reporte</CardTitle>
                <CardDescription>Proveedores con saldos de crédito en el período seleccionado.</CardDescription>
            </div>
            <Button onClick={handleDownloadPdf} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Descargar PDF
=======
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Resultados del Reporte</CardTitle>
              <CardDescription>
                Proveedores con saldos de crédito en el período seleccionado.
              </CardDescription>
            </div>
            <Button onClick={handleDownloadPdf} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Descargar PDF
>>>>>>> 6848165a999a2d46fa6bf0e01334dd64a07deef0
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
<<<<<<< HEAD
                <TableHeader>
                <TableRow>
                    <TableHead>Proveedor</TableHead>
                    <TableHead className="text-right cursor-pointer" onClick={() => handleSort('saldo')}>
                        <span className="flex items-center justify-end gap-2">Saldo Pendiente <ArrowUpDown className="h-4 w-4" /></span>
                    </TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {sortedData.map((item) => (
                    <TableRow key={item.cedula_ruc}>
                    <TableCell className="font-medium">{item.nombre}</TableCell>
                    <TableCell className="text-right">${item.saldo.toFixed(2)}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="justify-end font-bold text-lg border-t pt-4">
             Total General: ${totalSaldo.toFixed(2)}
=======
              <TableHeader>
                <TableRow>
                  <TableHead>Proveedor</TableHead>
                  <TableHead
                    className="text-right cursor-pointer"
                    onClick={() => handleSort("saldo")}
                  >
                    <span className="flex items-center justify-end gap-2">
                      Saldo Pendiente <ArrowUpDown className="h-4 w-4" />
                    </span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((item) => (
                  <TableRow key={item.cedula_ruc}>
                    <TableCell className="font-medium">{item.nombre}</TableCell>
                    <TableCell className="text-right">
                      ${item.saldo.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="justify-end font-bold text-lg">
            Total: ${totalSaldo.toFixed(2)}
>>>>>>> 6848165a999a2d46fa6bf0e01334dd64a07deef0
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
<<<<<<< HEAD

    
=======
>>>>>>> 6848165a999a2d46fa6bf0e01334dd64a07deef0

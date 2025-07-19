
"use client";

import * as React from "react";
import { format, parseISO } from "date-fns";
import { es } from 'date-fns/locale';
import { useRouter } from "next/navigation";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Proveedor, FacturaCompra } from "@/lib/types";

interface PagosClientProps {
  proveedores: Proveedor[];
  facturas: FacturaCompra[];
}

interface SaldosPorProveedor {
  proveedor: Proveedor;
  saldoTotal: number;
  facturas: FacturaCompra[];
}

interface UserData {
  usuario: string;
}

export default function PagosClient({ proveedores, facturas }: PagosClientProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = React.useState(false);

  React.useEffect(() => {
    try {
      const storedData = localStorage.getItem('userData');
      if (storedData) {
        const userData: UserData = JSON.parse(storedData);
        if (userData.usuario === 'Administrador') {
          setIsAuthorized(true);
        } else {
          router.replace('/');
        }
      } else {
        router.replace('/login');
      }
    } catch (error) {
      console.error("Authentication check failed", error);
      router.replace('/login');
    }
  }, [router]);

  const saldosPorProveedor = React.useMemo(() => {
    const proveedorMap = new Map(proveedores.map(p => [p.cedula_ruc, p]));
    const saldos: Record<string, SaldosPorProveedor> = {};

    facturas.forEach(factura => {
      if (!saldos[factura.proveedor_cedula_ruc]) {
        const proveedor = proveedorMap.get(factura.proveedor_cedula_ruc);
        if (proveedor) {
          saldos[factura.proveedor_cedula_ruc] = {
            proveedor,
            saldoTotal: 0,
            facturas: [],
          };
        }
      }
      if (saldos[factura.proveedor_cedula_ruc]) {
        saldos[factura.proveedor_cedula_ruc].saldoTotal += factura.total;
        saldos[factura.proveedor_cedula_ruc].facturas.push(factura);
      }
    });

    return Object.values(saldos).sort((a, b) => b.saldoTotal - a.saldoTotal);
  }, [proveedores, facturas]);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(amount);
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return format(parseISO(dateString), 'dd MMM, yyyy', { locale: es });
  };
  
  const getBadgeVariant = (estado: FacturaCompra['estado']) => {
    switch (estado) {
        case 'Impresa': return 'default';
        case 'Registrada': return 'secondary';
        case 'Cancelada': return 'destructive';
        default: return 'outline';
    }
  };

  if (!isAuthorized) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-lg font-semibold">Verificando acceso...</div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saldos Pendientes de Pago</CardTitle>
        <CardDescription>
          Aquí se listan los proveedores con facturas a crédito pendientes de pago.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {saldosPorProveedor.length > 0 ? (
          <Accordion type="multiple" className="w-full space-y-2">
            {saldosPorProveedor.map(({ proveedor, saldoTotal, facturas }) => (
              <AccordionItem value={proveedor.cedula_ruc} key={proveedor.cedula_ruc} className="border rounded-lg px-4 bg-muted/20">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex justify-between w-full items-center">
                    <div className="text-left">
                      <p className="font-semibold text-base">{proveedor.nombre}</p>
                      <p className="text-sm text-muted-foreground">{facturas.length} factura(s) pendiente(s)</p>
                    </div>
                    <div className="text-right">
                       <p className="text-lg font-bold">{formatCurrency(saldoTotal)}</p>
                       <p className="text-xs text-muted-foreground">Saldo Total</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead># Factura</TableHead>
                        <TableHead>F. Emisión</TableHead>
                        <TableHead>F. Vencimiento</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Monto</TableHead>
                        <TableHead className="text-right">Acción</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {facturas.map(factura => (
                        <TableRow key={factura.id}>
                          <TableCell className="font-medium">{factura.numero_factura_proveedor}</TableCell>
                          <TableCell>{formatDate(factura.fecha_emision)}</TableCell>
                          <TableCell>{formatDate(factura.fecha_vencimiento)}</TableCell>
                          <TableCell>
                            <Badge variant={getBadgeVariant(factura.estado)}>{factura.estado}</Badge>
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(factura.total)}</TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="outline" disabled>
                              Registrar Pago
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-48">
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                ¡Todo al día!
              </h3>
              <p className="text-sm text-muted-foreground">
                No se encontraron proveedores con saldos pendientes.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, DollarSign, Activity, FileWarning } from 'lucide-react';
import { getProveedores, getFacturas } from "@/lib/data";
import DashboardChart from '@/components/dashboard/dashboard-chart';
import { Skeleton } from '@/components/ui/skeleton';
import { subDays, isWithinInterval } from 'date-fns';

export const dynamic = 'force-dynamic';

async function DashboardData() {
  const [proveedores, facturas] = await Promise.all([
    getProveedores(),
    getFacturas()
  ]);

  const now = new Date();
  const thirtyDaysAgo = subDays(now, 30);

  const totalProveedoresActivos = proveedores.filter(p => p.estado).length;
  const facturasCreditoPendientes = facturas.filter(f => f.tipo_pago === 'Crédito' && f.estado === 'Registrada').length;
  
  const facturasUltimos30Dias = facturas.filter(f => {
    try {
      const fechaEmision = new Date(f.fecha_emision);
      return isWithinInterval(fechaEmision, { start: thirtyDaysAgo, end: now });
    } catch {
      return false;
    }
  });

  const totalCompradoUltimos30Dias = facturasUltimos30Dias.reduce((acc, f) => acc + f.total, 0);
  
  const nuevosProveedoresUltimos30Dias = proveedores.filter(p => {
     try {
      const fechaCreacion = new Date(p.fecha_creacion!);
      return isWithinInterval(fechaCreacion, { start: thirtyDaysAgo, end: now });
    } catch {
      return false;
    }
  }).length;
  

  const recentProveedores = proveedores
    .sort((a, b) => new Date(b.fecha_creacion!).getTime() - new Date(a.fecha_creacion!).getTime())
    .slice(0, 5);

  const proveedorMap = new Map(proveedores.map(p => [p.cedula_ruc, p.nombre]));
  const comprasPorProveedor = facturas.reduce((acc, factura) => {
    const nombreProveedor = proveedorMap.get(factura.proveedor_cedula_ruc) || 'Desconocido';
    if (nombreProveedor !== 'Desconocido' && factura.estado !== 'Cancelada') {
      acc[nombreProveedor] = (acc[nombreProveedor] || 0) + factura.total;
    }
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(comprasPorProveedor)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 6);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Proveedores Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProveedoresActivos}</div>
            <p className="text-xs text-muted-foreground">De {proveedores.length} proveedores totales</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Facturas Crédito Pendientes</CardTitle>
            <FileWarning className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{facturasCreditoPendientes}</div>
            <p className="text-xs text-muted-foreground">Facturas en estado 'Registrada'</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Comprado (30 días)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCompradoUltimos30Dias.toLocaleString('es-EC', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            <p className="text-xs text-muted-foreground">En el último mes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nuevos Proveedores (30 días)</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{nuevosProveedoresUltimos30Dias}</div>
            <p className="text-xs text-muted-foreground">Registrados en el último mes</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Top 6 Proveedores por Monto de Compra</CardTitle>
            <CardDescription>Total comprado a los principales proveedores (excluye facturas canceladas).</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
             <DashboardChart data={chartData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Proveedores Recientes</CardTitle>
            <CardDescription>
              Los últimos 5 proveedores añadidos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="text-right">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentProveedores.length > 0 ? (
                  recentProveedores.map((proveedor) => (
                    <TableRow key={proveedor.cedula_ruc}>
                      <TableCell>
                        <div className="font-medium">{proveedor.nombre}</div>
                        <div className="hidden text-sm text-muted-foreground md:inline">
                          {proveedor.email}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                         <Badge variant={proveedor.estado ? "default" : "secondary"} className={proveedor.estado ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"}>
                          {proveedor.estado ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                   <TableRow>
                     <TableCell colSpan={2} className="text-center">No hay proveedores recientes.</TableCell>
                   </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  )
}


function DashboardSkeleton() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-1/3 mb-2" />
              <Skeleton className="h-3 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="pl-2">
            <Skeleton className="h-[350px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[120px]" />
                    <Skeleton className="h-3 w-[180px]" />
                  </div>
                  <Skeleton className="h-6 w-[70px] rounded-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}


export default function DashboardPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardData />
      </Suspense>
    </main>
  );
}

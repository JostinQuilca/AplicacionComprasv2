import SaldosProveedorClient from '@/components/saldos/saldos-proveedor-client';
import { getProveedores, getFacturas } from '@/lib/data';
import { Suspense } from 'react';

function SaldosSkeleton() {
  // Puedes crear un skeleton más detallado si lo deseas
  return <div>Cargando...</div>;
}

export default async function SaldosPage() {
  const proveedores = await getProveedores();
  const facturas = await getFacturas();

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
       <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Reporte de Saldos de Proveedores</h1>
      </div>
      <Suspense fallback={<SaldosSkeleton />}>
        <SaldosProveedorClient proveedores={proveedores} facturas={facturas} />
      </Suspense>
    </main>
  );
}

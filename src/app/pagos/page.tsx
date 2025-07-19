
import { getFacturas, getProveedores } from '@/lib/data';
import PagosClient from '@/components/pagos/pagos-client';

export default async function PagosPage() {
  const [proveedores, facturas] = await Promise.all([
    getProveedores(),
    getFacturas(),
  ]);

  const facturasCredito = facturas.filter(f => f.tipo_pago === 'Crédito' && f.estado !== 'Cancelada');

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Pagos a Proveedores</h1>
      </div>
      <PagosClient 
        proveedores={proveedores} 
        facturas={facturasCredito} 
      />
    </main>
  );
}

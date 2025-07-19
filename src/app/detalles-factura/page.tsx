
import DetallesFacturaClient from '@/components/detalles-factura/detalles-factura-client';
import { getFactura, getDetallesByFacturaId, getProductos, getProveedores } from '@/lib/data';
import { notFound } from 'next/navigation';

export default async function DetallesFacturaPage({
  searchParams,
}: {
  searchParams: { factura_id?: string };
}) {
  const facturaId = searchParams.factura_id
    ? parseInt(searchParams.factura_id, 10)
    : null;

  if (!facturaId || isNaN(facturaId)) {
    return notFound();
  }

  const [factura, detalles, productos, proveedores] = await Promise.all([
    getFactura(facturaId),
    getDetallesByFacturaId(facturaId),
    getProductos(),
    getProveedores()
  ]);

  if (!factura) {
    return notFound();
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <DetallesFacturaClient
        factura={factura}
        initialDetalles={detalles}
        productos={productos}
        proveedores={proveedores}
      />
    </main>
  );
}

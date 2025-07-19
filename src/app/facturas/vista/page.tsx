<<<<<<< HEAD

import { getFactura, getDetallesByFacturaId, getProductos } from '@/lib/data';
import { notFound } from 'next/navigation';
import FacturaVistaClient from '@/components/facturas/factura-vista-client';

export default async function FacturaVistaPage({ searchParams }: { searchParams: { factura_id?: string } }) {
  const facturaId = searchParams.factura_id ? parseInt(searchParams.factura_id, 10) : null;
=======
import { getFactura, getDetallesByFacturaId, getProductos } from "@/lib/data";
import { notFound } from "next/navigation";
import FacturaVistaClient from "@/components/facturas/facturas-vista-client";

export default async function FacturaVistaPage({
  searchParams,
}: {
  searchParams: { factura_id?: string };
}) {
  const facturaId = searchParams.factura_id
    ? parseInt(searchParams.factura_id, 10)
    : null;
>>>>>>> 6848165a999a2d46fa6bf0e01334dd64a07deef0

  if (!facturaId || isNaN(facturaId)) {
    return notFound();
  }
<<<<<<< HEAD
  
=======

>>>>>>> 6848165a999a2d46fa6bf0e01334dd64a07deef0
  const [factura, detalles, productos] = await Promise.all([
    getFactura(facturaId),
    getDetallesByFacturaId(facturaId),
    getProductos(),
  ]);

  if (!factura) {
    return notFound();
  }

<<<<<<< HEAD
  return <FacturaVistaClient factura={factura} detalles={detalles} productos={productos} />;
=======
  return (
    <FacturaVistaClient
      factura={factura}
      detalles={detalles}
      productos={productos}
    />
  );
>>>>>>> 6848165a999a2d46fa6bf0e01334dd64a07deef0
}

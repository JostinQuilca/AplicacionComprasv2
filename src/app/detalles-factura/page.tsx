<<<<<<< HEAD
import DetallesFacturaClient from '@/components/detalles-factura/detalles-factura-client';
import { getFactura, getDetalles, getProductos, getProveedores } from '@/lib/data';
import { notFound } from 'next/navigation';
=======
import DetallesFacturaClient from "@/components/detalles-factura/detalles-factura-client";
import {
  getFactura,
  getDetalles,
  getProductos,
  getProveedores,
} from "@/lib/data";
import { notFound } from "next/navigation";
>>>>>>> 6848165a999a2d46fa6bf0e01334dd64a07deef0

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

<<<<<<< HEAD
  const [factura, todosLosDetalles, productos, proveedores] = await Promise.all([
    getFactura(facturaId),
    getDetalles(),
    getProductos(),
    getProveedores()
  ]);
=======
  const [factura, todosLosDetalles, productos, proveedores] = await Promise.all(
    [getFactura(facturaId), getDetalles(), getProductos(), getProveedores()]
  );
>>>>>>> 6848165a999a2d46fa6bf0e01334dd64a07deef0

  if (!factura) {
    return notFound();
  }

  const detallesDeEstaFactura = todosLosDetalles.filter(
    (d) => d.factura_id === facturaId
  );
  const productoMap = new Map(productos.map((p) => [p.id_producto, p.nombre]));

  const detallesConNombres = detallesDeEstaFactura.map((detalle) => ({
    ...detalle,
    nombre_producto:
      productoMap.get(detalle.producto_id) || "Producto no encontrado",
  }));

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <DetallesFacturaClient
        factura={factura}
        initialDetalles={detallesConNombres}
        productos={productos}
        proveedores={proveedores}
      />
    </main>
  );
}

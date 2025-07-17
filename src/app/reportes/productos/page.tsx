
import { getFacturas, getProductos, getDetalles, getProveedores } from '@/lib/data';
import ReporteProductosClient from '@/components/reportes/reporte-productos-client';

export default async function ReportesProductosPage() {
  const [facturasData, productos, detalles, proveedores] = await Promise.all([
    getFacturas(),
    getProductos(),
    getDetalles(),
    getProveedores(),
  ]);

  const proveedorMap = new Map(proveedores.map(p => [p.cedula_ruc, p.nombre]));
  const facturas = facturasData.map(factura => ({
    ...factura,
    nombre_proveedor: proveedorMap.get(factura.proveedor_cedula_ruc) || 'Desconocido',
  }));

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <ReporteProductosClient 
        facturas={facturas} 
        productos={productos} 
        detalles={detalles}
        proveedores={proveedores}
      />
    </main>
  );
}

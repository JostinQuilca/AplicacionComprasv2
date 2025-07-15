
import { getFacturas, getProductos, getDetalles } from '@/lib/data';
import ReporteProductosClient from '@/components/reportes/reporte-productos-client';

export default async function ReportesProductosPage() {
  const [facturas, productos, detalles] = await Promise.all([
    getFacturas(),
    getProductos(),
    getDetalles(),
  ]);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Reporte de Compras por Producto</h1>
      </div>
      <ReporteProductosClient 
        facturas={facturas} 
        productos={productos} 
        detalles={detalles}
      />
    </main>
  );
}

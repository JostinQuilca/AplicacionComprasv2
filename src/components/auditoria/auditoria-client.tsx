
"use client";

import * as React from "react";
import { format, parseISO } from "date-fns";
import { es } from 'date-fns/locale';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Filter } from "lucide-react";
import { AuditoriaLog } from "@/lib/types";
import { Card } from "../ui/card";

type SortKey = keyof AuditoriaLog | 'details_string';

interface AuditoriaClientProps {
  initialData: AuditoriaLog[];
}

const formatUTCDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
        const date = parseISO(dateString);
        return format(date, 'dd MMM yyyy, HH:mm:ss', { locale: es });
    } catch (error) {
        console.error("Invalid date string:", dateString, error);
        return 'Fecha inválida';
    }
};

const getBadgeVariant = (accion: string) => {
    switch (accion.toUpperCase()) {
        case 'CREACIÓN':
        case 'INSERT':
            return 'default';
        case 'CONSULTA':
        case 'SELECT':
            return 'secondary';
        case 'ELIMINACIÓN':
        case 'DELETE':
            return 'destructive';
        case 'ACTUALIZACIÓN':
        case 'UPDATE':
            return 'outline';
        default:
            return 'secondary';
    }
};

const getBadgeClassName = (accion: string) => {
    switch (accion.toUpperCase()) {
        case 'CREACIÓN':
        case 'INSERT':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'CONSULTA':
        case 'SELECT':
            return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'ELIMINACIÓN':
        case 'DELETE':
            return 'bg-red-100 text-red-800 border-red-200';
        case 'ACTUALIZACIÓN':
        case 'UPDATE':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

const formatDetails = (details: Record<string, any>): string => {
    if (!details) return 'N/A';

    if (details.tipo) {
        return details.tipo;
    }

    if (details.antes && details.despues) {
        const changes = Object.keys(details.despues).map(key => {
            if (details.antes[key] !== details.despues[key]) {
                return `${key}: '${details.antes[key]}' -> '${details.despues[key]}'`;
            }
            return null;
        }).filter(Boolean).join(', ');
        return `Cambios: ${changes || 'Sin cambios detectados.'}`;
    }

    if (details.nuevo) {
        return `Nuevo registro: ${JSON.stringify(details.nuevo)}`;
    }
    
    if (details.eliminado) {
        return `Registro eliminado: ${JSON.stringify(details.eliminado)}`;
    }

    return JSON.stringify(details);
};


export default function AuditoriaClient({ initialData }: AuditoriaClientProps) {
  const [data] = React.useState<AuditoriaLog[]>(initialData.map(log => ({
      ...log,
      details_string: formatDetails(log.details)
  })));
  const [filter, setFilter] = React.useState("");
  const [sortConfig, setSortConfig] = React.useState<{ key: SortKey; direction: "asc" | "desc" } | null>({ key: 'timestamp', direction: 'desc' });
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 15;

  const sortedData = React.useMemo(() => {
    let sortableData = [...data];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof AuditoriaLog];
        const bValue = b[sortConfig.key as keyof AuditoriaLog];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  const filteredData = React.useMemo(() =>
    sortedData.filter(
      (item) =>
        item.accion.toLowerCase().includes(filter.toLowerCase()) ||
        item.modulo.toLowerCase().includes(filter.toLowerCase()) ||
        item.tabla.toLowerCase().includes(filter.toLowerCase()) ||
        item.nombre_rol.toLowerCase().includes(filter.toLowerCase()) ||
        (item as any).details_string.toLowerCase().includes(filter.toLowerCase())
    ),
    [sortedData, filter]
  );
  
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);
  
  const handleSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1">
             <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filtrar por acción, módulo, tabla, etc..."
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
        </div>
        <Card className="border shadow-sm rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSort("timestamp")}>
                  <span className="flex items-center gap-2">Fecha y Hora <ArrowUpDown className="h-4 w-4" /></span>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("accion")}>
                  <span className="flex items-center gap-2">Acción <ArrowUpDown className="h-4 w-4" /></span>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("modulo")}>
                   <span className="flex items-center gap-2">Módulo <ArrowUpDown className="h-4 w-4" /></span>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("tabla")}>
                   <span className="flex items-center gap-2">Tabla <ArrowUpDown className="h-4 w-4" /></span>
                </TableHead>
                <TableHead>Detalles</TableHead>
                <TableHead>Usuario/Rol</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{formatUTCDate(item.timestamp)}</TableCell>
                      <TableCell>
                        <Badge variant={getBadgeVariant(item.accion)} 
                               className={getBadgeClassName(item.accion)}>
                          {item.accion}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{item.modulo}</TableCell>
                      <TableCell>{item.tabla}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-sm">{formatDetails(item.details)}</TableCell>
                      <TableCell>{item.nombre_rol || 'N/A'}</TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    No se encontraron registros de auditoría.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </div>
  );
}

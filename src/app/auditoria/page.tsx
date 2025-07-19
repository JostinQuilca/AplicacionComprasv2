
"use client";

import AuditoriaClient from '@/components/auditoria/auditoria-client';
import { getAuditoriaLogs } from '@/lib/data';
import withAuth from '@/components/layout/withAuth';
import { useEffect, useState } from 'react';
import type { AuditoriaLog } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

function AuditoriaPage() {
  const [logs, setLogs] = useState<AuditoriaLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      try {
        const fetchedLogs = await getAuditoriaLogs();
        setLogs(fetchedLogs);
      } catch (error) {
        console.error("Failed to fetch audit logs", error);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  if (loading) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Registros de Auditoría</h1>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="border rounded-lg p-4 space-y-2">
            {[...Array(10)].map((_, i) => (
               <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
           <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-1/4" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Registros de Auditoría</h1>
      </div>
      <AuditoriaClient initialData={logs} />
    </main>
  );
}

export default withAuth(AuditoriaPage);

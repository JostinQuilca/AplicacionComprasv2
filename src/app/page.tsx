
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

function HomePageRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  // Muestra un esqueleto de carga mientras se redirige para evitar un parpadeo de contenido vacío.
  return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
           <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
           <span className="text-lg font-semibold text-foreground">Redirigiendo...</span>
        </div>
      </div>
  );
}

export default HomePageRedirect;

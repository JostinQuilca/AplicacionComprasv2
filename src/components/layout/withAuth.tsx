
"use client";

import React, { useEffect, useState, ComponentType } from 'react';
import { useRouter } from 'next/navigation';

interface UserData {
  id_usuario: number;
  usuario: string;
  nombre: string;
  nombre_rol: string;
}

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const AuthComponent = (props: P) => {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
      let userData: UserData | null = null;
      try {
        const storedData = sessionStorage.getItem('userData');
        if (storedData) {
          userData = JSON.parse(storedData);
        }
      } catch (error) {
        console.error("Authentication check failed while parsing sessionStorage", error);
        router.replace('/login');
        return;
      }
      
      if (userData && userData.usuario?.toLowerCase() === 'administrador') {
        setIsAuthorized(true);
      } else {
        router.replace(userData ? '/dashboard' : '/login');
      }

    }, [router]);

    if (!isAuthorized) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-4">
             <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
             <span className="text-lg font-semibold">Verificando acceso...</span>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  AuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AuthComponent;
};

export default withAuth;

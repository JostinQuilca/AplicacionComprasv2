
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
        const storedData = localStorage.getItem('userData');
        if (storedData) {
          userData = JSON.parse(storedData);
        }
      } catch (error) {
        console.error("Authentication check failed while parsing localStorage", error);
        router.replace('/login');
        return;
      }
      
      if (userData && userData.usuario === 'Administrador') {
        setIsAuthorized(true);
      } else {
        router.replace(userData ? '/' : '/login');
      }

    }, [router]);

    if (!isAuthorized) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="text-lg font-semibold">Verificando acceso...</div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  AuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AuthComponent;
};

export default withAuth;

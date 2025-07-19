
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
      try {
        const storedData = localStorage.getItem('userData');
        if (storedData) {
          const userData: UserData = JSON.parse(storedData);
          // Check if user role is 'Administrador'
          if (userData.nombre_rol === 'Administrador de Compras') {
            setIsAuthorized(true);
          } else {
            // If not admin, redirect to home
            router.replace('/');
          }
        } else {
          // If no user data, redirect to login
          router.replace('/login');
        }
      } catch (error) {
        console.error("Authentication check failed", error);
        router.replace('/login');
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

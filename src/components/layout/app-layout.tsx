<<<<<<< HEAD

'use client'

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
=======
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
>>>>>>> 6848165a999a2d46fa6bf0e01334dd64a07deef0
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
<<<<<<< HEAD
} from '@/components/ui/sidebar';
import { Settings, FileText, DollarSign, ShieldCheck, Scale, KeyRound, Users, Home, LogOut, ShoppingCart, ClipboardList } from 'lucide-react';
=======
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Settings,
  FileText,
  DollarSign,
  ShieldCheck,
  Scale,
  KeyRound,
  Users,
  Home,
  LogOut,
  ShoppingCart,
} from "lucide-react";
>>>>>>> 6848165a999a2d46fa6bf0e01334dd64a07deef0
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
<<<<<<< HEAD
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ThemeToggle } from './theme-toggle';

interface UserData {
  id_usuario: number;
  usuario: string;
  nombre: string;
  nombre_rol: string;
=======
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface UserData {
  nombre: string;
  rol_nombre: string;
>>>>>>> 6848165a999a2d46fa6bf0e01334dd64a07deef0
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [userData, setUserData] = React.useState<UserData | null>(null);
<<<<<<< HEAD
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    try {
      const storedData = localStorage.getItem('userData');
      if (storedData) {
        setUserData(JSON.parse(storedData));
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error("Failed to parse user data from localStorage", error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);
  
  const handleLogout = () => {
    localStorage.removeItem('userData');
    setUserData(null);
    router.push('/login');
  };
  
  const getInitials = (name: string) => {
    if (!name) return "";
    const names = name.split(' ');
    const firstNameInitial = names[0] ? names[0][0] : '';
    const lastNameInitial = names.length > 2 ? names[2][0] : (names.length > 1 ? names[1][0] : '');
    return `${firstNameInitial}${lastNameInitial}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          <span className="text-lg font-semibold text-foreground">Cargando...</span>
        </div>
      </div>
    );
  }
  
  const isAdministrador = userData?.usuario === 'Administrador';
=======

  React.useEffect(() => {
    // This function runs only on the client
    const loadUserData = () => {
      try {
        const storedData = localStorage.getItem("userData");
        setUserData(storedData ? JSON.parse(storedData) : null);
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
        localStorage.removeItem("userData"); // Clean up corrupted data
        setUserData(null);
      }
    };

    // Load data on initial client render
    loadUserData();

    // Listen for changes from other tabs/windows
    window.addEventListener("storage", loadUserData);

    return () => {
      window.removeEventListener("storage", loadUserData);
    };
  }, []);

  const getInitials = (name: string) => {
    if (!name) return "";
    const names = name.split(" ");
    const firstNameInitial = names[0] ? names[0][0] : "";
    const lastNameInitial =
      names.length > 2 ? names[2][0] : names.length > 1 ? names[1][0] : "";
    return `${firstNameInitial}${lastNameInitial}`.toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    window.dispatchEvent(new Event("storage")); // Trigger update in the same tab
    router.push("/login");
  };
>>>>>>> 6848165a999a2d46fa6bf0e01334dd64a07deef0

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <ShoppingCart className="h-6 w-6 text-primary" />
<<<<<<< HEAD
            <span className="font-semibold text-xl group-data-[collapsible=icon]:hidden">Módulo Compras</span>
=======
            <span className="font-semibold text-xl group-data-[collapsible=icon]:hidden">
              Módulo Compras
            </span>
>>>>>>> 6848165a999a2d46fa6bf0e01334dd64a07deef0
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard">
                <Link href="/">
                  <Home />
                  Dashboard
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
<<<<<<< HEAD
           
=======
>>>>>>> 6848165a999a2d46fa6bf0e01334dd64a07deef0
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Proveedores">
                <Link href="/proveedores">
                  <Users />
                  Proveedores
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Facturas">
                <Link href="/facturas">
                  <FileText />
                  Facturas
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
<<<<<<< HEAD
              <SidebarMenuButton asChild tooltip="Reportes">
                <Link href="/reportes/productos">
                  <ClipboardList />
                  Reportes
=======
              <SidebarMenuButton asChild tooltip="Configuraciones">
                <Link href="/configuraciones">
                  <Settings />
                  Configuraciones
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Pagos a Proveedores">
                <Link href="/pagos">
                  <DollarSign />
                  Pagos a Proveedores
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Auditoría">
                <Link href="/auditoria">
                  <ShieldCheck />
                  Auditoría
>>>>>>> 6848165a999a2d46fa6bf0e01334dd64a07deef0
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Saldos de Proveedor">
                <Link href="/saldos">
                  <Scale />
                  Saldos de Proveedor
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
<<<<<<< HEAD
              
            {isAdministrador && (
              <>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Configuraciones">
                    <Link href="/configuraciones">
                      <Settings />
                      Configuraciones
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Auditoría">
                    <Link href="/auditoria">
                      <ShieldCheck />
                      Auditoría
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </>
            )}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
            <SidebarTrigger />
            <div className="flex items-center gap-4">
              <ThemeToggle />
              {userData ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10">
                           <AvatarFallback>{getInitials(userData.nombre)}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{userData.nombre}</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {isAdministrador ? 'Administrador' : userData.nombre_rol}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Cerrar Sesión</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
              ) : (
                  <Skeleton className="h-10 w-10 rounded-full" />
              )}
            </div>
          </header>
        <div className="min-h-[calc(100vh-4rem)] w-full">
          {children}
        </div>
=======
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Tokens API">
                <Link href="/tokens">
                  <KeyRound />
                  Tokens API
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} tooltip="Cerrar Sesión">
                <LogOut />
                Cerrar Sesión
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
          <SidebarTrigger />
          {userData && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {getInitials(userData.nombre)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {userData.nombre}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userData.rol_nombre}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </header>
        <div className="min-h-[calc(100vh-4rem)] w-full">{children}</div>
>>>>>>> 6848165a999a2d46fa6bf0e01334dd64a07deef0
      </SidebarInset>
    </>
  );
}

<<<<<<< HEAD
=======
function AppLayout({ children }: { children: React.ReactNode }) {
  const isLoginPage = usePathname() === "/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}

>>>>>>> 6848165a999a2d46fa6bf0e01334dd64a07deef0
export default function AppLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
<<<<<<< HEAD
  const isLoginPage = pathname === '/login';

  return (
    <SidebarProvider>
      {isLoginPage ? <>{children}</> : <LayoutContent>{children}</LayoutContent>}
    </SidebarProvider>
  );
=======
  const isLoginPage = pathname === "/login";

  return isLoginPage ? <>{children}</> : <AppLayout>{children}</AppLayout>;
>>>>>>> 6848165a999a2d46fa6bf0e01334dd64a07deef0
}

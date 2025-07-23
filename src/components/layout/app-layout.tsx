
'use client'

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
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
} from '@/components/ui/sidebar';
import { Settings, FileText, Scale, ShieldCheck, Users, Home, LogOut, ShoppingCart, ClipboardList } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './theme-toggle';
import { useToast } from '@/hooks/use-toast';

interface UserData {
  id_usuario: number;
  usuario: string;
  nombre: string;
  nombre_rol: string;
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { toast } = useToast();
  const [userData, setUserData] = React.useState<UserData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    try {
      const storedData = sessionStorage.getItem('userData');
      if (storedData) {
        setUserData(JSON.parse(storedData));
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error("Failed to parse user data from sessionStorage", error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);
  
  const handleLogout = () => {
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('authToken');
    setUserData(null);
    toast({
        title: "Sesión Cerrada",
        description: "Has cerrado sesión correctamente.",
    });
    router.push('/login');
  };
  
  const getInitials = (name: string) => {
    if (!name) return "";
    const names = name.split(' ');
    const firstNameInitial = names[0] ? names[0][0] : '';
    const lastNameInitial = names.length > 2 ? names[2][0] : (names.length > 1 ? names[1][0] : '');
    return `${firstNameInitial}${lastNameInitial}`.toUpperCase();
  };

  if (loading || !userData) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          <span className="text-lg font-semibold text-foreground">Cargando...</span>
        </div>
      </div>
    );
  }
  
  const isAdministrador = userData?.usuario?.toLowerCase() === 'administrador';

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <ShoppingCart className="h-6 w-6 text-primary" />
            <span className="font-semibold text-xl group-data-[collapsible=icon]:hidden">Módulo Compras</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard">
                <Link href="/dashboard">
                  <Home />
                  Dashboard
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
           
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
              <SidebarMenuButton asChild tooltip="Reportes">
                <Link href="/reportes/productos">
                  <ClipboardList />
                  Reportes
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
            </div>
          </header>
        <div className="min-h-[calc(100vh-4rem)] w-full">
          {children}
        </div>
      </SidebarInset>
    </>
  );
}

export default function AppLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <SidebarProvider>
      {isLoginPage ? <>{children}</> : <LayoutContent>{children}</LayoutContent>}
    </SidebarProvider>
  );
}

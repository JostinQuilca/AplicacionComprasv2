
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
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Settings, FileText, DollarSign, ShieldCheck, Scale, KeyRound, Users, Home, LogOut, ShoppingCart } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';


interface UserData {
  nombre: string;
  rol_nombre: string;
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [userData, setUserData] = React.useState<UserData | null>(null);

  React.useEffect(() => {
    try {
      const storedData = localStorage.getItem('userData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        // Usamos los datos que nos proporcionaste
        setUserData({
            nombre: "Jostin Damian Quilca Portilla",
            rol_nombre: "Administrador"
        });
      }
    } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
        localStorage.removeItem('userData');
    }
  }, []);

  const getInitials = (name: string) => {
    if (!name) return "";
    const nameParts = name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 2 ? nameParts[2] : '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    router.push('/login');
  };

  return (
    <SidebarProvider>
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
                <Link href="/">
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
      </Sidebar>
      <SidebarInset>
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
            <SidebarTrigger />
             {userData && (
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
        <div className="min-h-[calc(100vh-4rem)] w-full">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default function AppLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return isLoginPage ? <>{children}</> : <AppLayout>{children}</AppLayout>;
}

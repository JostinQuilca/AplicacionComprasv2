
'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
import { Logo } from '@/components/icons/logo';
import { Settings, FileText, DollarSign, ShieldCheck, Scale, KeyRound, Users, Home } from 'lucide-react';
import { Toaster } from "@/components/ui/toaster"

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <Logo className="h-6 w-6 text-primary" />
            <span className="font-semibold text-xl group-data-[collapsible=icon]:hidden">Procuria</span>
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
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
            <SidebarTrigger />
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

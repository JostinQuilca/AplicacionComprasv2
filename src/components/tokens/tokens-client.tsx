
"use client";

import * as React from "react";
import { Copy, PlusCircle, Trash2, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { es } from 'date-fns/locale';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface ApiToken {
  id: string;
  token: string;
  createdAt: string;
  description: string;
}

const TOKEN_STORAGE_KEY = 'api_tokens';

// Generates a cryptographically secure random string
const generateSecureToken = (length = 40): string => {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export default function TokensClient() {
  const [tokens, setTokens] = React.useState<ApiToken[]>([]);
  const [description, setDescription] = React.useState("");
  const [newToken, setNewToken] = React.useState<string | null>(null);
  const [isCopied, setIsCopied] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    try {
      const storedTokens = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (storedTokens) {
        setTokens(JSON.parse(storedTokens));
      }
    } catch (error) {
      console.error("Failed to load tokens from localStorage", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los tokens guardados.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const saveTokens = (updatedTokens: ApiToken[]) => {
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(updatedTokens));
      setTokens(updatedTokens);
    } catch (error) {
      console.error("Failed to save tokens to localStorage", error);
      toast({
        title: "Error de Guardado",
        description: "No se pudo guardar la lista de tokens actualizada.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateToken = () => {
    if (!description.trim()) {
      toast({
        title: "Descripción requerida",
        description: "Por favor, ingrese una descripción para el token.",
        variant: "destructive",
      });
      return;
    }

    const tokenValue = `compras_sk_${generateSecureToken()}`;
    const newApiToken: ApiToken = {
      id: `token_${new Date().getTime()}`,
      token: tokenValue,
      createdAt: new Date().toISOString(),
      description,
    };

    saveTokens([...tokens, newApiToken]);
    setNewToken(tokenValue);
    setDescription(""); // Reset description field
  };

  const handleRevokeToken = (tokenId: string) => {
    const updatedTokens = tokens.filter(t => t.id !== tokenId);
    saveTokens(updatedTokens);
    toast({
      title: "Token Revocado",
      description: "El token de API ha sido eliminado exitosamente.",
    });
  };

  const copyToClipboard = () => {
    if (newToken) {
      navigator.clipboard.writeText(newToken).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2s
      });
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
        return format(new Date(dateString), "dd MMM, yyyy 'a las' HH:mm", { locale: es });
    } catch {
        return "Fecha inválida";
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Generar Nuevo Token</CardTitle>
          <CardDescription>
            Cree un nuevo token de API para autenticar solicitudes de servicios externos. Guarde el token en un lugar seguro, ya que no podrá volver a verlo.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Descripción (ej. 'Integración Contabilidad')"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex-grow"
          />
          <AlertDialog onOpenChange={(open) => { if(!open) setNewToken(null) }}>
            <AlertDialogTrigger asChild>
              <Button disabled={!description.trim()}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Generar Token
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              {newToken ? (
                <>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Token Generado Exitosamente</AlertDialogTitle>
                    <AlertDialogDescription>
                      Copie este token ahora. No podrá volver a verlo por razones de seguridad.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="relative">
                    <Input readOnly value={newToken} className="pr-12 font-mono text-sm" />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                      onClick={copyToClipboard}
                    >
                      {isCopied ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                    </Button>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogAction>Entendido</AlertDialogAction>
                  </AlertDialogFooter>
                </>
              ) : (
                 <>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar Generación de Token</AlertDialogTitle>
                    <AlertDialogDescription>
                      ¿Está seguro de que desea generar un nuevo token con la descripción: "{description}"?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleGenerateToken}>Generar</AlertDialogAction>
                  </AlertDialogFooter>
                </>
              )}
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tokens Existentes</CardTitle>
          <CardDescription>
            Aquí están todos los tokens que ha generado. Puede revocarlos si ya no los necesita.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descripción</TableHead>
                <TableHead>Prefijo del Token</TableHead>
                <TableHead>Fecha de Creación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tokens.length > 0 ? (
                tokens.map(token => (
                  <TableRow key={token.id}>
                    <TableCell className="font-medium">{token.description}</TableCell>
                    <TableCell className="font-mono text-xs">{`${token.token.substring(0, 12)}...`}</TableCell>
                    <TableCell>{formatDate(token.createdAt)}</TableCell>
                    <TableCell className="text-right">
                       <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Revocar
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>¿Está seguro de revocar este token?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta acción no se puede deshacer. Cualquier aplicación que use este token dejará de funcionar.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleRevokeToken(token.id)} className="bg-destructive hover:bg-destructive/90">
                                        Sí, revocar token
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                          </AlertDialogContent>
                       </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No se han generado tokens de API.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

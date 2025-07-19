
'use server';

import { z } from 'zod';
import { handleApiError, type ActionResponse } from '@/lib/actions-utils';
import { redirect } from 'next/navigation';

const loginSchema = z.object({
  usuario: z.string().min(1, 'El nombre de usuario es requerido.'),
  contrasena: z.string().min(1, 'La contraseña es requerida.'),
});

type LoginUserData = {
    id_usuario: number;
    usuario: string;
    nombre: string;
    nombre_rol: string;
}

type LoginResponse = {
    token: string;
    usuario: LoginUserData;
    permisos: any[];
}

export async function loginAction(
  formData: FormData
): Promise<ActionResponse<LoginUserData>> {
  const rawData = Object.fromEntries(formData);
  const validatedFields = loginSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Datos de formulario no válidos.',
    };
  }

  const { usuario, contrasena } = validatedFields.data;
  const id_modulo = 'compras';

  try {
    const response = await fetch(
      'https://aplicacion-de-seguridad-v2.onrender.com/api/usuarios/login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, contrasena, id_modulo }),
      }
    );

    if (!response.ok) {
        const errorData = await response.json();
        return { success: false, message: errorData.message || "Credenciales incorrectas o usuario no autorizado." };
    }
    
    const loginData: LoginResponse = await response.json();
    
    return {
      success: true,
      message: 'Inicio de sesión exitoso.',
      data: loginData.usuario,
    };
  } catch (error) {
    console.error('Login action error:', error);
    if (error instanceof Error) {
        return { success: false, message: error.message };
    }
    return { success: false, message: 'Un error inesperado ocurrió en el servidor.' };
  }
}

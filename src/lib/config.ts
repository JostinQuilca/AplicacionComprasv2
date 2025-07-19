
// Este archivo es solo para cliente, ya que usa localStorage.
// ¡No lo uses en Server Actions o componentes de servidor!
"use client";

const IVA_STORAGE_KEY = 'app_iva_rate';
const DEFAULT_IVA_RATE = 0.15; // 15% por defecto

/**
 * Obtiene la tasa de IVA desde el localStorage.
 * Si no hay valor guardado, devuelve el valor por defecto.
 * @returns {number} La tasa de IVA (ej: 0.15 para 15%).
 */
export function getIvaRate(): number {
  if (typeof window === 'undefined') {
    return DEFAULT_IVA_RATE;
  }
  
  const storedValue = localStorage.getItem(IVA_STORAGE_KEY);
  if (storedValue) {
    const parsedValue = parseFloat(storedValue);
    if (!isNaN(parsedValue)) {
      return parsedValue;
    }
  }
  return DEFAULT_IVA_RATE;
}

/**
 * Guarda la tasa de IVA en el localStorage.
 * @param {number} newRate La nueva tasa de IVA (ej: 0.15 para 15%).
 */
export function setIvaRate(newRate: number): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  if (typeof newRate === 'number' && !isNaN(newRate)) {
    localStorage.setItem(IVA_STORAGE_KEY, String(newRate));
  }
}

// Para uso en el servidor (Server Actions), exportamos una constante.
// El cliente usará la función dinámica getIvaRate.
export const IVA_RATE = 0.15;

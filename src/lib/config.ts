"use client";

const IVA_STORAGE_KEY = 'app_iva_rate';
const DEFAULT_IVA_RATE = 0.15; // 15% por defecto

/**
 * Obtiene la tasa de IVA desde el localStorage o devuelve el valor por defecto.
 * Funciona tanto en el cliente como en el servidor (donde devuelve el valor por defecto).
 * @returns {number} La tasa de IVA (ej: 0.15 para 15%).
 */
export function getIvaRate(): number {
  if (typeof window === 'undefined') {
    return DEFAULT_IVA_RATE;
  }
  
  const storedValue = localStorage.getItem(IVA_STORAGE_KEY);
  if (storedValue) {
    const parsedValue = parseFloat(storedValue);
    // Devuelve el valor guardado si es un número válido.
    if (!isNaN(parsedValue)) {
      return parsedValue;
    }
  }
  // Si no hay valor guardado o no es válido, devuelve el valor por defecto.
  return DEFAULT_IVA_RATE;
}

/**
 * Guarda la tasa de IVA en el localStorage.
 * Esta función solo debe llamarse desde el lado del cliente.
 * @param {number} newRate La nueva tasa de IVA (ej: 0.15 para 15%).
 */
export function setIvaRate(newRate: number): void {
  if (typeof window === 'undefined') {
    console.warn("setIvaRate fue llamado en el servidor. La configuración no se guardará.");
    return;
  }
  
  if (typeof newRate === 'number' && !isNaN(newRate)) {
    localStorage.setItem(IVA_STORAGE_KEY, String(newRate));
  }
}

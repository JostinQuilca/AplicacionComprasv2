"use client";

const IVA_STORAGE_KEY = 'app_iva_rate';
const DEFAULT_IVA_RATE = 0.15; // 15% por defecto

/**
 * Obtiene la tasa de IVA desde el localStorage o devuelve el valor por defecto.
 * Esta es una función del lado del cliente.
 * @returns {number} La tasa de IVA (ej: 0.15 para 15%).
 */
export function getIvaRate(): number {
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
 * Esta función solo debe llamarse desde el lado del cliente.
 * @param {number} newRate La nueva tasa de IVA (ej: 0.15 para 15%).
 */
export function setIvaRate(newRate: number): void {
  if (typeof newRate === 'number' && !isNaN(newRate)) {
    localStorage.setItem(IVA_STORAGE_KEY, String(newRate));
  }
}

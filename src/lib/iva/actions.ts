"use server";

const DEFAULT_IVA_RATE = 0.15;

/**
 * Server action to get the IVA rate.
 * In a real-world scenario, this might fetch the value from a database
 * or a server-side configuration service. For now, it returns a default value.
 * @returns {Promise<number>} The current IVA rate.
 */
export async function getIvaRateAction(): Promise<number> {
  // Currently returns a static default value.
  // This could be extended to read from a database or another server-side source.
  return Promise.resolve(DEFAULT_IVA_RATE);
}

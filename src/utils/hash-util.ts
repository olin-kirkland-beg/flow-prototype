import { v5 as uuidv5 } from 'uuid';

/**
 * Returns a deterministic hash of the given string.
 * This is useful for generating unique identifiers for objects.
 * @param str The string to hash.
 * @returns A string representing the hash of the input string.
 */
export function hashString(str: string): string {
    return uuidv5(str, 'f0c4b2a8-1d3e-4f7b-9c6d-0a2e1f3b5c8d'); // Use a fixed namespace for consistency
}

import { v5 as uuidv5 } from 'uuid';

/**
 * Returns a deterministic hash of the given string.
 * This is useful for generating unique identifiers for objects.
 * @param str The string to hash.
 * @returns A string representing the hash of the input string.
 */
export function hashString(str: string): string {
    console.log('Hashing string:', str);
    return uuidv5(str, 'flow-prototype');
}

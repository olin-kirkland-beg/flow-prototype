/**
 * This function takes an array of names and a new name as input.
 * It checks if the new name already exists in the array.
 * If it does, it appends a number to the new name to make it unique.
 * The number is incremented based on the existing names in the array.
 * If the new name does not exist, it returns the new name as is.
 * @param names - An array of existing names.
 * @param newName - The new name to be checked and potentially modified.
 * @returns - A unique name based on the new name and existing names in the array.
 */
export function getUniqueName(names: string[], newName: string) {
    if (!names.includes(newName)) return newName;

    // Escape special characters in newName for use in the regex
    const escapedNewName = newName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`^${escapedNewName} (\\d+)$`);

    const existingNumbers = names
        .map((name) => {
            const match = name.match(regex);
            return match ? parseInt(match[1], 10) : null;
        })
        .filter((num) => num !== null) as number[]; // Filter out null values and cast to number[]
    if (existingNumbers.length === 0) return `${newName} 1`;
    const maxNumber = Math.max(...existingNumbers);
    return `${newName} ${maxNumber + 1}`;
}

/**
 *
 * @param name - The name to be converted to a file name.
 * This function replaces all non-alphanumeric characters in the name with hyphens and converts it to lowercase.
 * This is useful for creating a valid file name from a string.
 * For example, "My File Name" would become "my-file-name".
 * @returns - The converted file name.
 */
export function toFileName(name: string) {
    return name.replace(/[^a-z0-9]/gi, '-').toLowerCase();
}

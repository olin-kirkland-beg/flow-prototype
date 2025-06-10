import { Address, AddressType, ParsedDALICommand } from '@/types';
import { DATA_TYPE, ENDPOINT } from './definitions';

export function parseDALIBytesToJSON(
    bytesRaw: number[],
    channel: string
): { channel: string; data: ParsedDALICommand; bytes: string[] } {
    // bytes: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] } Always 10 bytes
    const bytes: string[] = bytesRaw.map((n: number) => n.toString(16).padStart(2, '0').toUpperCase());

    // Parse the endpoint, data type, and length.
    // These values will always be found in the first two bytes.
    const endpointByte = bytes[0]; // First byte
    const endpoint = ENDPOINT[endpointByte];
    const dataTypeByte = bytes[1].charAt(0); // Second byte, first character
    const dataType = DATA_TYPE[dataTypeByte];
    const length = parseInt(bytes[1].charAt(1), 16); // Second byte, second character

    // Get the address byte, which is the third byte in the array.
    const addressByte = bytes[2];
    const address = byteToAddress(addressByte, channel);

    // Only pass the remaining bytes to the endpoint handler.
    // The first two bytes are the endpoint and data type, so we skip them.
    // Only pass the number of bytes specified by the length.
    const remainingBytes = bytes.slice(2).filter((byte, index) => index < length);

    // Determine the command.

    const data: ParsedDALICommand = {
        endpointByte,
        endpoint,
        dataTypeByte,
        dataType,
        length,
        remainingBytes,
        addressByte,
        address
    };

    return { channel, data, bytes };
}

function byteToAddress(byte: string, channel: string): Address {
    const b = parseInt(byte, 16);
    let type: AddressType;
    let index = (b & 0x7f) >> 1;

    if (b === 0xff) {
        // Bit 7 = 1, bit 0 = 1: broadcast addressed
        type = 'broadcast';
    } else if (b === 0xfe) {
        // Bit 7 = 1, bit 0 = 0: broadcast unaddressed
        type = 'broadcast-unaddressed';
    } else if ((b & 0b10000000) === 0) {
        // Bit 7 = 0: short address (0-63)
        type = 'device';
    } else if ((b & 0b10000001) === 0b10000001) {
        // Bit 7 = 1, bit 0 = 1: group address (0-15)
        type = 'group';
    } else if (b >= 0xa0 && b <= 0xcb) {
        // Bit 7 = 1, bit 0 = 0: special address (0xA0-0xCB)
        type = 'special';
    } else if (b >= 0xcc && b <= 0xfb) {
        // Bit 7 = 1, bit 0 = 0: reserved address (0xCC-0xFB)
        type = 'reserved';
    } else {
        // If none of the above conditions match, we assume it's a special address.
        type = 'special'; // fallback for undefined cases
    }

    return {
        channel,
        index,
        type
    };
}

// function parseCommandFromByte(byte: string, commands: Record<string, string>): string {
//     const command = Object.keys(commands).find((id) => COMMANDS[id as keyof typeof COMMANDS] === byte);
//     return command || `Unknown (${byte})`;
// }

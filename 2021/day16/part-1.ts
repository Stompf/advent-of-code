import { promises as fs } from 'fs';
import * as path from 'path';

const hexMap: Record<string, string> = {
    '0': '0000',
    '1': '0001',
    '2': '0010',
    '3': '0011',
    '4': '0100',
    '5': '0101',
    '6': '0110',
    '7': '0111',
    '8': '1000',
    '9': '1001',
    A: '1010',
    B: '1011',
    C: '1100',
    D: '1101',
    E: '1110',
    F: '1111',
};

const headerMap: Record<string, string> = {
    '000': '0',
    '001': '1',
    '010': '2',
    '011': '3',
    '100': '4',
    '101': '5',
    '110': '6',
    '111': '7',
};

async function main() {
    const file = await fs.readFile(path.join(__dirname, 'input-test.txt'), 'utf-8');
    const rawRows = file.split('\n').filter((r) => r.trim());

    rawRows.forEach((row) => {
        console.log(`row: ${row}`);

        let binary = '';
        row.split('').forEach((c) => {
            binary += hexMap[c];
        });
        console.log(`binary: ${binary}`);

        console.log(`Total: ${JSON.stringify(read(binary))}`);
        console.log(`=========================================`);
    });
}

function read(binary: string) {
    console.log(`read: ${binary}`);

    const packetVersion = headerMap[binary.substring(0, 3)];
    console.log(`version: ${packetVersion}`);

    binary = binary.substring(3);

    const packetType = headerMap[binary.substring(0, 3)];
    console.log(`packetType: ${packetType}`);

    binary = binary.substring(3);

    if (packetType === '4') {
        let value = '';
        while (binary) {
            const bits = binary.substring(0, 5);

            const lastGroup = bits[0] === '0';

            value += bits.substring(1);
            binary = binary.substring(5);

            if (lastGroup) {
                break;
            }
        }
        console.log(`value: ${value} - decimal ${parseInt(value, 2)}`);
        return { value: parseInt(value, 2), binary, packetVersion: Number(packetVersion) };
    } else {
        const lengthTypeId = binary.substring(0, 1);
        binary = binary.substring(1);
        console.log(`lengthTypeId: ${lengthTypeId}`);
        const sub = lengthTypeId === '1' ? 11 : 15;

        let length = parseInt(binary.substring(0, sub), 2);
        binary = binary.substring(sub);
        console.log(`length: ${length}`);
        if (isNaN(length)) {
            throw Error('dd');
        }

        let value = 0;
        let packetVersions = Number(packetVersion);

        if (lengthTypeId === '1') {
            for (let step = 0; step < length; step++) {
                const res = read(binary);

                value += res.value;
                packetVersions += res.packetVersion;
                binary = res.binary;
            }
        } else {
            while (length > 0) {
                const res = read(binary);

                length -= binary.length - res.binary.length;

                value += res.value;
                packetVersions += res.packetVersion;
                binary = res.binary;
            }
        }
        console.log(`operator packetVersions: ${packetVersions}`);

        return { value, binary, packetVersion: packetVersions };
    }
}

main();

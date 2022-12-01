import { promises as fs } from 'fs';
import * as path from 'path';

async function main() {
    const file = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf-8');
    const lines = file.split('\n');

    const co2 = getRating(lines, 'co2');
    const oxygen = getRating(lines, 'oxygen');

    console.log(`Rating is ${co2 * oxygen}`);
}

function getRating(lines: string[], type: 'oxygen' | 'co2') {
    let arr = lines.slice();
    let index = 0;

    while (arr.length > 1) {
        let count = 0;
        const ones: string[] = [];
        const zeros: string[] = [];

        arr.forEach((a) => {
            const c = Number(a.charAt(index));
            if (c === 1) {
                count++;
                ones.push(a);
            } else {
                count--;
                zeros.push(a);
            }
        });

        if (count > 0) {
            arr = type === 'co2' ? zeros : ones;
        } else if (count === 0) {
            arr = type === 'co2' ? zeros : ones;
        } else {
            arr = type === 'co2' ? ones : zeros;
        }

        index++;
        console.log(`index: ${index}`);
    }

    console.log(`${type} is ${arr[0]}`);
    return parseInt(arr[0], 2);
}

main();

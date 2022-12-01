export function solve(map: number[][]): number {
    const dist: number[][] = [];
    const done: number[][] = [];
    for (let y = 0; y < map.length; y++) {
        const done_row: number[] = [];
        const dist_row: number[] = [];

        for (let x = 0; x < map.length; x++) {
            done_row[x] = 1;
            dist_row[x] = Number.MAX_SAFE_INTEGER;
        }
        done.push(done_row);
        dist.push(dist_row);
    }
    dist[0][0] = 0;
    done[0][0] = 2;

    const queue = [[0, 0]];

    while (queue.length > 0) {
        let min_dist = Number.MAX_SAFE_INTEGER;
        let min_dist_idx = 0;

        for (let i = 0; i < queue.length; i++) {
            const [yy, xx] = queue[i];
            if (dist[yy][xx] < min_dist) {
                min_dist = dist[yy][xx];
                min_dist_idx = i;
            }
        }

        const [y, x] = queue[min_dist_idx];
        queue[min_dist_idx] = queue[queue.length - 1];
        queue.length--;
        done[y][x] = 3;

        for (const [yy, xx] of getPos(map, y, x)) {
            if (done[yy][xx] == 3) {
                continue;
            }
            dist[yy][xx] = Math.min(dist[yy][xx], dist[y][x] + map[yy][xx]);
            if (done[yy][xx] == 1) {
                done[yy][xx] = 2;
                queue.push([yy, xx]);
            }
        }
    }
    return dist[map.length - 1][map.length - 1];
}

function* getPos(map: number[][], y: number, x: number) {
    if (y > 0) {
        yield [y - 1, x];
    }
    if (y < map.length - 1) {
        yield [y + 1, x];
    }
    if (x > 0) {
        yield [y, x - 1];
    }
    if (x < map.length - 1) {
        yield [y, x + 1];
    }
}

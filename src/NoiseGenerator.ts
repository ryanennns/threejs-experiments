import * as THREE from 'three';

export class NoiseGenerator {
    private readonly seed: number;

    constructor(seed: number = Math.random()) {
        this.seed = seed;
    }

    private random(x: number, y: number): number {
        const s = Math.sin(x * 12.9898 + y * 78.233 + this.seed) * 43758.5453;
        return s - Math.floor(s);
    }

    private lerp(a: number, b: number, t: number): number {
        return a + t * (b - a);
    }

    private smoothNoise(x: number, y: number): number {
        const intX = Math.floor(x);
        const intY = Math.floor(y);
        const fracX = x - intX;
        const fracY = y - intY;

        const v1 = this.random(intX, intY);
        const v2 = this.random(intX + 1, intY);
        const v3 = this.random(intX, intY + 1);
        const v4 = this.random(intX + 1, intY + 1);

        const i1 = this.lerp(v1, v2, fracX);
        const i2 = this.lerp(v3, v4, fracX);

        return this.lerp(i1, i2, fracY);
    }

    public perlinNoise(x: number, y: number, octaves: number = 4, persistence: number = 0.5): number {
        let total = 0;
        let frequency = 1;
        let amplitude = 1;
        let maxValue = 0;

        for (let i = 0; i < octaves; i++) {
            total += this.smoothNoise(x * frequency, y * frequency) * amplitude;

            maxValue += amplitude;
            amplitude *= persistence;
            frequency *= 2;
        }

        return total / maxValue; // Normalize
    }

    public generateNoise(width: number = 64, height: number = 64): Uint8Array {
        const size = width * height;
        const data = new Uint8Array(size * 4); // RGBA format

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const value = this.perlinNoise(x / width, y / height) * 255; // Scale to [0, 255]
                const index = (y * width + x) * 4;

                data[index] = value;
                data[index + 1] = value;
                data[index + 2] = value;
                data[index + 3] = 255;
            }
        }

        return data;
    }

    public clampNoise(data: Uint8Array): Uint8Array {
        let min = Math.min(...data);
        return data.map((thing: number) => thing - min);
    }

    public noiseToTexture(width: number, height: number, data: Uint8Array): THREE.DataTexture {
        data = this.clampNoise(data)
        const texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
        texture.needsUpdate = true;

        return texture;
    }

    public generateTexture(width: number = 64, height: number = 64): THREE.DataTexture {
        return this.noiseToTexture(64, 64, this.generateNoise());
    }
}
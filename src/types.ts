import * as three from 'three'

export class Block {
    geometry: three.BoxGeometry;
    material: three.MeshStandardMaterial;

    constructor(
        material?: three.MeshStandardMaterial,
    ) {
        this.geometry = new three.BoxGeometry(1, 1, 1);

        if (!!!material) {
            material = new three.MeshStandardMaterial({
                color: 0xfff000
            })
        }

        this.material = material;
    }

    getInstance(): three.Mesh {
        return new three.Mesh(this.geometry, this.material)
    }
}

export class Dirt extends Block {
    constructor() {
        super();

        this.material = new three.MeshStandardMaterial({
            map: new three.TextureLoader().load('../assets/dirt.jpg'),
        })
    }
}
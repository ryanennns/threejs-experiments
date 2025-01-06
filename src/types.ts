import * as three from 'three'

export class Block {
    geometry: three.BoxGeometry;
    material: three.MeshStandardMaterial;

    constructor(
        material?: three.MeshStandardMaterial,
    ) {
        this.geometry = new three.BoxGeometry(1, 1, 1);

        if (!!!material) {
            console.log('bad material')
            material = new three.MeshStandardMaterial({
                color: 0xfff000
            })
        }

        console.log('this.geometry', this.geometry)
        console.log('this.material', this.material)

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
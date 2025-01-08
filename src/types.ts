import * as three from 'three'
import {Vector2} from 'three'

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
    getInstance(): three.Mesh {
        let texture = new three.TextureLoader().load('../assets/dirt.jpg');
        texture.center = new Vector2(0.5, 0.5)
        texture.rotation = Math.PI * (Math.round(Math.random() % 4) / 2)
        this.material = new three.MeshStandardMaterial({
            map: texture,
        })

        return new three.Mesh(this.geometry, this.material)
    }
}
import * as THREE from 'three'
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Experience from './Experience'

export default class World {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.camera = this.experience.camera
    this.controls = this.experience.camera.controls
    this.loader = new GLTFLoader()

    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath( 'draco/' )
    this.loader.setDRACOLoader( dracoLoader )

    // this.loadModel('models/butterfliesReal.glb', 'Butterflies')
    this.loadModel('models/Polar_bear1.glb', 'Polarbear')
    // this.loadModel('models/tortoise.glb', 'Tortoise')
    // this.loadModel('models/Tulip.glb', 'Tulip')
  }
  loadModel = (url, name) => {
    this.loader.load(url, gltf => {
      gltf.scene.add( new THREE.AxesHelper())
      gltf.scene.name = name
      gltf.scene.position.set(0, 0, -2.5)
      this.scene.add( gltf.scene )

      const box = new THREE.BoxHelper( gltf.scene, 0xffff00 );
      this.scene.add( box );

      this.rescale( gltf.scene )
      // this.fitCameraToObject(gltf.scene)
      // this.fitCameraToCenteredObject( gltf.scene )
    })
  }
  fitCameraToCenteredObject = (object, offset) => {
    const boundingBox = new THREE.Box3();
    boundingBox.setFromObject( object );

    const size = new THREE.Vector3();
    boundingBox.getSize(size);

    const fov = this.camera.instance.fov * ( Math.PI / 180 );
    const fovh = 2*Math.atan(Math.tan(fov/2) * this.camera.instance.aspect);
    let dx = size.z / 2 + Math.abs( size.x / 2 / Math.tan( fovh / 2 ) );
    let dy = size.z / 2 + Math.abs( size.y / 2 / Math.tan( fov / 2 ) );
    let cameraZ = Math.max(dx, dy);

    // offset the camera, if desired (to avoid filling the whole canvas)
    if( offset !== undefined && offset !== 0 ) cameraZ *= offset;

    this.camera.instance.position.set( 0, 0, cameraZ );

    // set the far plane of the camera so that it easily encompasses the whole object
    const minZ = boundingBox.min.z;
    const cameraToFarEdge = ( minZ < 0 ) ? -minZ + cameraZ : cameraZ - minZ;

    this.camera.instance.far = cameraToFarEdge * 3;
    this.camera.instance.updateProjectionMatrix();

    if ( this.controls !== undefined ) {
      // set camera to rotate around the center
      this.controls.target = new THREE.Vector3(0, 0, 0);

      // prevent camera from zooming out far enough to create far plane cutoff
      this.controls.maxDistance = cameraToFarEdge * 2;
    }
  }
  fitCameraToObject = (obj) => {
    this.controls.reset();

    const box = new THREE.Box3().setFromObject(obj);
    const size = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());

    obj.position.x += (obj.position.x - center.x);
    obj.position.y += (obj.position.y - center.y);
    obj.position.z += (obj.position.z - center.z);

    this.camera.instance.near = size / 100;
    this.camera.instance.far = size * 100;
    this.camera.instance.updateProjectionMatrix();

    this.camera.instance.position.copy(center);
    this.camera.instance.position.x += size / 2.0;
    this.camera.instance.position.y += size / 5.0;
    this.camera.instance.position.z += size / 2.0;
    this.camera.instance.lookAt(center);

    this.controls.maxDistance = size * 10;
    this.controls.update();
  }
  rescale = ( obj ) => {
    const bbox = new THREE.Box3().setFromObject( obj );
    const center = bbox.getCenter(new THREE.Vector3());
    const size = bbox.getSize(new THREE.Vector3());

    // Rescale the object to normalized space
    // const maxAxis = Math.max(size.x, size.y, size.z);
    // obj.scale.multiplyScalar(1.0 / maxAxis);
    // console.log(obj.scale)
    bbox.setFromObject(obj);
    bbox.getCenter(center);
    bbox.getSize(size);

    // Reposition to 0,halfY,sizeZ
    // obj.position.copy(center).multiplyScalar(-1);
    // obj.position.y-= (size.y * 0.5);
    obj.position.z -= size.z;
    console.log(obj.position.z, size.z)
  }
  /*fitObjectToCamera = (object, offset = 1.25) => {
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    const bbox = new THREE.Box3()

    bbox.makeEmpty()
    bbox.expandByObject(object)
    bbox.getSize(size)
    bbox.getCenter(center )

    /!*const maxSize = Math.max(size.x, size.y, size.z);
    console.log(object.name, maxSize)
    if (maxSize < .1 ) {
      //
    }
    else if (maxSize > 200) {
      console.log(`Model is very large. Scale to 2 meters? ${object.name} ${maxSize}`)
    }*!/

    // get the max side of the bounding box (fits to width OR height as needed )
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = this.camera.instance.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 4 * Math.tan(fov * 2));

    cameraZ *= offset; // zoom out a little so that objects don't fill the screen

    this.camera.instance.position.z = cameraZ;

    const minZ = bbox.min.z;
    const cameraToFarEdge = minZ < 0 ? -minZ + cameraZ : cameraZ - minZ;

    this.camera.instance.far = cameraToFarEdge * 3;
    this.camera.resize()

    if (this.controls) {
      // set camera to rotate around center of loaded object
      this.controls.target = center;

      // prevent camera from zooming out far enough to create far plane cutoff
      this.controls.maxDistance = cameraToFarEdge * 2;

      this.controls.saveState();
    } else {
      this.camera.instance.lookAt(center);
    }
  }*/
  update = () => {
    // if (this.map) this.map.update()
  }
}

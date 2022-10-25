
/*import * as THREE from 'https://unpkg.com/three@0.124.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.124.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://unpkg.com/three@0.124.0/examples/jsm/controls/OrbitControls.js';*/

let toystory,
    mesh,
    mixer,
    controls;

// Ray
let mouse = new THREE.Vector2();
let INTERSECTED,
    raycaster,
    beforeX,
    beforeY;
// Global vars to cache event state
let evCache = new Array();
let prevDiff = -1;

let mainURL = 'https://intra.letsee.io/3D-model/gltf/';
let clock = new THREE.Clock();

const loadingManager = new THREE.LoadingManager();
loadingManager.onProgress = (item, loaded, total) => console.log(item, loaded, total);

/**
 * Initialize 3D world
 */
function initWorld() {

  initScene();
  proceedModel();
}

/**
 * Initialize Scene
 */
function initScene() {

  // 1. Add lights
  let ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  ambientLight.position.set(0, 0, 0);
  scene.add(ambientLight);

  let dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
  dirLight.position.set(-0.5, 0.5, 0.866);
  dirLight.castShadow = false;
  dirLight.shadow.mapSize = new THREE.Vector2(512, 512);
  scene.add(dirLight);

  let pmremGenerator = new THREE.PMREMGenerator( renderer );
  pmremGenerator.compileEquirectangularShader();

  // 2. Set background for scene as image
  new THREE.RGBELoader()
  .setDataType( THREE.UnsignedByteType )
  .setPath( './assets/textures/' )
  .load( 'royal_esplanade_1k.hdr', function ( texture ) {

    let envMap = pmremGenerator.fromEquirectangular( texture ).texture;

    // scene.background = envMap;
    scene.environment = envMap;

    texture.dispose();
    pmremGenerator.dispose();

  });

  // 3. Set light effects for renderer
  renderer.outputEncoding          = THREE.sRGBEncoding;
  renderer.physicallyCorrectLights = true;

  // 4. Controls
  /*controls = new THREE.OrbitControls( camera, renderer.domElement );
  // controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.05;

  controls.screenSpacePanning = false;

  controls.minDistance = 10;
  controls.maxDistance = 500;

  controls.maxPolarAngle = Math.PI / 2;*/

  // 4. Raycaster
  raycaster = new THREE.Raycaster();
  document.addEventListener("touchstart", handleStart, false);
  document.addEventListener("touchend", handleEnd, false);
  document.addEventListener("touchcancel", handleCancel, false);
  document.addEventListener("touchmove", handleMove, false);

  // document.addEventListener('pointerdown', (event) => {
  //   console.warn('Pointer down event');
  // });

}

/**
 * Proceed model.
 */
function proceedModel() {
  letsee.addTarget('toystory.json').then(entity => {
    toystory = entity;

    // 1. Load model
    loadModel()
    .then(model => {
      console.warn(`Model loaded completed!`);
      mesh = model;

      // 2.Add mesh into entity
      toystory.add(mesh);

      // 3. Add entity to scene
      scene.add(toystory);

      if (mesh) {
        //  Do something
      }
    });

    // Render all
    const renderAll = async function() {
      requestAnimationFrame(renderAll);

      let d = clock.getDelta();
      if (mixer) mixer.update(d);

      camera = letsee.threeRenderer().getDeviceCamera();
      await letsee.threeRenderer().update();

      // controls.update();

      renderer.render(scene, camera);
    };

    renderAll();
  });
}

/**
 * Show the progress of loading model
 * @param xhr
 */
function onProgress(xhr) {
  if (xhr.lengthComputable) {
    const percentComplete = xhr.loaded / xhr.total * 100;
    console.warn(Math.round(percentComplete) + '%');
  }
}

/**
 * Show error if loading error.
 * @param e
 */
function onError(e) {
  console.error(e);
}

/**
 * Load glTF model.
 */
function loadModel() {
  return new Promise((resolve) => {

    let gltfLoader = new THREE.GLTFLoader();
    gltfLoader.load(  mainURL + 'woody/scene.gltf', function(gltf) {

      if (gltf.animations.length) {
        mixer = new THREE.AnimationMixer( gltf.scene );
        let action = mixer.clipAction( gltf.animations[ 0 ] );
        action.play();
      }
      gltf.scene.traverse( function ( child ) {
        if ( child.isMesh ) {
          // child.castShadow = true;
          // child.receiveShadow = true;
        }
      });

      gltf.scene.scale.setScalar(3.5);
      gltf.scene.rotation.y = -120;
      gltf.scene.position.set(0, -100, -100);

      // Make bouding box for raycast
      const geometry = new THREE.BoxGeometry( 30, 60, 30 );
      /*const object = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( 0xff0000 ) );
      object.name = 'MESH';
      const box = new THREE.BoxHelper( object, 0x00ff00 );
      gltf.scene.add( box );*/

      /*const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
      const wireframe = new THREE.WireframeGeometry( geometry, material );
      const line = new THREE.LineSegments( wireframe );
      line.material.depthTest = false;
      line.material.opacity = 1; //0.25;
      line.material.transparent = false; //true;
      line.name = 'LINE';
      line.position.set(0, 50, 0);
      gltf.scene.add( line );*/

      const material = new THREE.MeshBasicMaterial( {color: 0x00ff00, opacity: 0.5, transparent: true} );
      const cube = new THREE.Mesh( geometry, material );
      cube.position.set(0, 30,0);
      cube.name = 'WoodyBoundary';
      gltf.scene.add( cube );

      resolve(gltf.scene);

    }, onProgress, onError);
  })
}

/**
 * Get touch coordinates when user touch on screen.
 * @param event
 */
function handleStart(event) {
  const scaled = letsee.threeRenderer().getEffectiveSize();
  mouse.x = +(event.changedTouches[0].pageX / scaled.effectiveWidth) * 2 - 1;
  mouse.y = -(event.changedTouches[0].pageY / scaled.effectiveHeight) * 2 + 1;

  evCache.push(event);

  findIntersection();
}

function handleEnd(event) {

  // Do something here...

}

function handleCancel(event) {

  // Do something here...
}

/**
 * Handle action when moving gesture.
 * @param event
 */
function handleMove(event) {

  // event.preventDefault();
  // console.warn('handleMove', event);

  let touches = event.changedTouches;

  // Find this event in the cache and update its record with this event
  for (let i = 0; i < evCache.length; i++) {
    if (event.pointerId === evCache[i].pointerId) {
      evCache[i] = event;
      break;
    }
  }

  switch (touches.length) {
    case 1: rotateModel(touches); break;
    case 2: scaleModel(event); break;
  }

}

/**
 * Scale model with 2 fingers
 * @param evt
 */
function scaleModel(evt){

  console.warn(`SCALE!!!`);
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0 ) {
    INTERSECTED = intersects[0].object;

    // console.warn(INTERSECTED);
    console.warn(evt);

    switch (INTERSECTED.name) {
      case 'WoodyBoundary':
        // console.error(mesh.scale);

        // Calculate the distance between the two pointers
        // let curDiff = Math.abs(evCache[0].clientX - evCache[1].clientX);
        let curDiff = Math.abs(evt.changedTouches[0].clientX - evt.changedTouches[1].clientX);
        let ratio = Math.round(evt.changedTouches[0].clientX/evt.changedTouches[1].clientX);
        console.error(curDiff, ratio);

        if (prevDiff > 0) {
          if (curDiff > prevDiff) {
            // The distance between the two pointers has increased
            console.error("Pinch moving OUT -> Zoom in (Bigger)", evt);

            mesh.scale.setScalar(ratio);

          }
          if (curDiff < prevDiff) {
            // The distance between the two pointers has decreased
            console.error("Pinch moving IN -> Zoom out (Smaller)",evt);

            mesh.scale.setScalar(ratio);
          }
        }

        // Cache the distance for the next move event
        prevDiff = curDiff;

        break;
    }


  }

}

/**
 * Rotate model with 1 finger.
 * @param touches
 */
function rotateModel(touches) {
  console.warn(`ROTATE!!!`);
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);
  // console.error(intersects);

  if (intersects.length > 0 ) {
    INTERSECTED = intersects[0].object;

    // console.warn(INTERSECTED);
    // console.warn(touches);

    switch (INTERSECTED.name) {
      case 'WoodyBoundary':

        // touches[0].rotationAngle; // degeree
        // mesh.rotation.x = touches[0].rotationAngle * Math.PI/180 * 2; // to radian

        if (touches[0].clientX < touches[0].clientY) {

          if (!beforeX) beforeX = touches[0].clientX;
          if (!beforeY) beforeY = touches[0].clientY;

          const diffX = (touches[0].clientX - beforeX);
          const diffY = (touches[0].clientY - beforeY);

          mesh.rotation.y += Math.round(diffX) * Math.PI/180; // to radian
          mesh.rotation.x += Math.round(diffY) * Math.PI/180; // to radian

          beforeX = touches[0].clientX;
          beforeY = touches[0].clientY;
        }

        /*if (touches[0].clientX < touches[0].clientY) {
          if(!beforeY){
            beforeY= touches[0].clientY;
          }

          const diffY = (touches[0].clientY - beforeY);
          console.error(diffY);

          mesh.rotation.x = mesh.rotation.x + Math.round(diffY) * Math.PI/180; // to radian
          console.error(mesh.rotation.x);

          beforeY = touches[0].clientY;
        }*/

        break;
    }


  }

}

/**
 * Find intersection for click event.
 */
function findIntersection() {

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0 ) {
    INTERSECTED = intersects[0].object;

    // console.warn(INTERSECTED);
  }

}

/**
 * Export variables.
 * @returns {{renderer: *, toystory: *, camera: *, scene: *}}
 */
/*export const getVariable = () => {
  window.toystory = toystory;
  window.scene = scene;
  window.renderer = renderer;
  window.camera = camera;

  return {
    toystory,
    scene,
    renderer,
    camera,
  }
};*/

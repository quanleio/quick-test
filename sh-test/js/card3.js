
let toystory,
    mesh,
    mixer;

const clock = new THREE.Clock();
let mainURL = 'https://intra.letsee.io/3D-model/gltf/EMC/man2/';
const loadingManager = new THREE.LoadingManager();
loadingManager.onProgress = (item, loaded, total) => console.log(item, loaded, total);

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
 * Initialize 3D world.
 */
function initWorld() {

  console.warn(`THREE.REVISION: ${THREE.REVISION}`);

  // Scene
  initScene();

  letsee.addTarget('card3_front.json').then(entity => {
    toystory = entity;

    // 1. load model
    loadModel()
    .then(model => {
      console.warn(`Model loaded completed!`);
      mesh = model;

      // 2.Add mesh into entity
      toystory.add(mesh);

      // 3. Add entity to scene
      scene.add(toystory);

    });

    // Render all
    const renderAll = async function() {
      requestAnimationFrame(renderAll);

      if (mixer) {
        let delta = clock.getDelta();
        mixer.update(delta);
      }

      camera = letsee.threeRenderer().getDeviceCamera();
      await letsee.threeRenderer().update();

      renderer.render(scene, camera);
    };

    renderAll();
  });

}

/**
 * Initialize Scene.
 */
function initScene() {

  let ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  ambientLight.position.set(0, 0, 0);

  let dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
  dirLight.position.set(-0.5, 0.5, 0.866);
  dirLight.castShadow = false;
  dirLight.shadow.mapSize = new THREE.Vector2(512, 512);

  let spotLight = new THREE.SpotLight(0xeeeeee, 5);
  spotLight.position.set(2, -5, 10);
  spotLight.castShadow = true;

  scene.add(ambientLight);
  scene.add(dirLight);

  // ???
  renderer.toneMappingExposure = 1;
  renderer.outputEncoding = THREE.sRGBEncoding;

}

/**
 * Load model.
 */
function loadModel(){

  return new Promise((resolve, reject) => {
    let loader = new THREE.GLTFLoader();
    loader.load( mainURL + '/test_ch01.gltf', function(gltf) {

      gltf.scene.position.set(0, 0, 0);
      gltf.scene.rotation.set(70, 45, 0);
      gltf.scene.visible = true;
      gltf.scene.tag = 'Man';
      gltf.scene.name = 'test_ch01.gltf';
      gltf.scene.scale.setScalar(1);

      // Play model's animation
      if (gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(gltf.scene);
        let action = mixer.clipAction( gltf.animations[ 0 ] );
        action.play();
      }
      else console.error(`Model ${gltf.scene.name} has no animation`);

      let axesHelper = new THREE.AxesHelper(300);
      gltf.scene.add(axesHelper);

      // Get center point of the model
      /*gltf.scene.children.forEach(child => {
        child.traverse(function(obj) {
          if (obj.type === 'Mesh') {
            obj.geometry.center();
          }
        })
      })*/

      resolve(gltf.scene);

    }, onProgress, onError);
  })



}
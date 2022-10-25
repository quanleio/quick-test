
let scene, camera, renderer, update, mixer, toystory;
let mainURL = 'https://intra.letsee.io/3D-model/gltf/';
// DRACO
let dracoLoader = new THREE.DRACOLoader();
dracoLoader.setDecoderPath('draco/');
dracoLoader.preload();

const clock = new THREE.Clock();
const stats = new Stats();

/**
 * Initialize Scene.
 */
function initScene() {

  // Add lights
  // let ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  // ambientLight.position.set(0, 0, 0);
  // scene.add(ambientLight);

  let dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
  dirLight.position.set(-0.5, 0.5, 0.866);
  dirLight.castShadow = false;
  dirLight.shadow.mapSize = new THREE.Vector2(512, 512);
  scene.add(dirLight);

  let pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  // 2. Set background for scene as image
  new THREE.RGBELoader().setDataType(THREE.UnsignedByteType).
      setPath('textures/').
      load('royal_esplanade_1k.hdr', function(texture) {

        let envMap = pmremGenerator.fromEquirectangular(texture).texture;

        scene.environment = envMap;

        texture.dispose();
        pmremGenerator.dispose();

      });

  renderer.toneMappingExposure = 1;
  renderer.toneMapping = 0;
  renderer.gammaFactor = 2;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.physicallyCorrectLights = true;
  renderer.setPixelRatio( window.devicePixelRatio );
}

/**
 * Add model into Entity
 */
function proceedModel() {
  letsee.addTarget('toystory.json').then(entity => {
    toystory = entity;

    loadModel().then(model => {
      console.warn(`Model ${model.name} loaded completed!`);

      // 2.Add mesh into entity
      toystory.add(model);

      // 3. Add entity to scene
      scene.add(toystory);

      if (model) {
        //
      }
    });

    // Render all
    renderAll().then(() => {
    });
  });
}

/**
 * Render all.
 * @returns {Promise<void>}
 */
const renderAll = async function() {
  requestAnimationFrame(renderAll);

  camera = letsee.threeRenderer().getDeviceCamera();

  let d = clock.getDelta();
  if (mixer) mixer.update(d);

  renderer.render(scene, camera);
  await letsee.threeRenderer().update();
  stats.update();
};

/**
 * Load model.
 * @returns {Promise<unknown>}
 */
function loadModel() {
  return new Promise(resolve => {

    // Instantiate a gltfLoader
    let gltfLoader = new THREE.GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    // gltfLoader.load( mainURL + 'woody/scene.gltf', function(gltf) {
    gltfLoader.load( mainURL + 'biplane/free_wing/scene.gltf', function(gltf) {
    // gltfLoader.load( mainURL + 'lgDIOS/20201214/lg_dios_all.glb', function(gltf) {
    // gltfLoader.load( mainURL + 'airplane/type1/scene.gltf', function(gltf) {
    // gltfLoader.load( mainURL + 'shoes/converse-yellow/scene.gltf', function(gltf) {
    // gltfLoader.load( mainURL + 'shoes/highneck/scene.gltf', function(gltf) {

      gltf.scene.rotation.y = -120;
      // gltf.scene.position.set(30, -100, -100);
      gltf.scene.position.set(0, 0 ,0);
      gltf.scene.scale.setScalar(2);
      gltf.scene.name = '3dModel';
      gltf.scene.visible = false;

      if (gltf.animations.length > 0) {
        gltf.scene.animations = gltf.animations;

        mixer = new THREE.AnimationMixer(gltf.scene);
        let action = mixer.clipAction(gltf.animations[0]);
        action.play();

      } else console.error(`Model [${gltf.scene.name}] does not have animation.`);

      resolve(gltf.scene);
    });
  });
}
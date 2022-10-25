
// 3D
let scene,
    camera,
    renderer;
let toystory,
    mesh;
let mainURL = 'https://intra.letsee.io/3D-model/gltf/';
let circle, circumference;

// Sound
let soundListener = new THREE.AudioListener();
let audioLoader = new THREE.AudioLoader();
// create a global audio source
let clickSound = new THREE.PositionalAudio(soundListener);

// Animations
let mixer;

const clock = new THREE.Clock();
const loadingManager = new THREE.LoadingManager();
loadingManager.onProgress = (item, loaded, total) => console.log(item, loaded, total);

/**
 * Show the progress of loading model
 * @param xhr
 */
function onProgress(xhr) {
  if (xhr.lengthComputable) {
    const percentComplete = xhr.loaded / xhr.total * 100;
    document.getElementById('percent').innerText = Math.round(percentComplete) + '%';
  
    setProgress(Math.round(percentComplete));
    
    if (Math.round(percentComplete) === 100) {
      setTimeout(() => {
        document.getElementById('hint').style.display = 'none';
      }, 1000);
    }
  }
}

const onError = e => console.error(e);

/**
 * Initialize world.
 */
function initWorld() {
  loadModel();
}

/**
 * Load whole model
 */
function loadModel() {
  
  // 1. Add lights
  let ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  ambientLight.position.set(0, 0, 0);
  scene.add(ambientLight);
  
  let dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
  dirLight.position.set(-0.5, 0.5, 0.866);
  dirLight.castShadow = false;
  dirLight.shadow.mapSize = new THREE.Vector2(512, 512);
  scene.add(dirLight);
  
  let spotLight = new THREE.SpotLight(0xeeeeee, 5);
  spotLight.position.set(2, -5, 10);
  spotLight.castShadow = true;
  
  // 2. Set light effects for renderer
  renderer.toneMappingExposure = 1;
  renderer.outputEncoding = THREE.sRGBEncoding;
  
  // 3. Load model and add to entity
  letsee.addTarget('green.json').then(entity => {
    toystory = entity;
    
    // load model
    let loader = new THREE.GLTFLoader();
    loader.load( mainURL + 'EMC/take_05/A_take_05.gltf', function(gltf) {
          
          gltf.scene.position.set(200, 0, 0);
          gltf.scene.visible = true;
          gltf.scene.tag = 'EMC';
          gltf.scene.name = 'A_take_05';
          gltf.scene.scale.setScalar(2);
          gltf.scene.animations = [];
          
          // Create custom animation clips
          if (gltf.animations.length > 0) {
            gltf.scene.animations = gltf.animations;
            console.warn(gltf.animations);
            
            mixer = new THREE.AnimationMixer(gltf.scene);
            let action = mixer.clipAction( gltf.animations[ 0 ] );
            action.play();
            
          } else console.error(`Model [${gltf.scene.name}] does not have animation.`);
  
          mesh = gltf.scene;
          mesh.rotateY(Math.PI/180 *90);
          addAxesHelper(mesh);
          
          // Add mesh into entity
          toystory.add(mesh);
      
          // Add entity to scene
          scene.add(toystory);
      
        }, onProgress, onError);
    
    // Render all
    const renderAll = async function() {
      requestAnimationFrame(renderAll);
      
      if (mixer) {
        let delta = clock.getDelta();
        mixer.update(delta);
      }
  
      window.camera = letsee.threeRenderer().getDeviceCamera();
      await letsee.threeRenderer().update();
  
      renderer.render(scene, window.camera);
    };
    
    renderAll();
  });
}

window.onload = () => {
  
  // Loading layout
  circle = document.querySelector('circle');
  let radius = circle.r.baseVal.value;
  circumference = radius * 2 * Math.PI;
  
  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  circle.style.strokeDashoffset = `${circumference}`;
};

/**
 * Loading layout.
 * @param percent
 */
function setProgress(percent) {
  const offset = circumference - percent / 100 * circumference;
  circle.style.strokeDashoffset = offset;
}

/**
 * Add axes helper into object.
 * @param obj
 */
function addAxesHelper(obj){
  let axesHelper = new THREE.AxesHelper(300);
  obj.add(axesHelper);
}


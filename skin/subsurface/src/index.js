
let renderer, scene, camera, stats, mesh, composer, effectFXAA, spotLight;
const textureLoader = new THREE.TextureLoader();
const sss_shader = THREE.SubsurfaceScatteringShader;

init().then();
window.addEventListener("resize", onWindowResize);

async function init() {
  const container = document.createElement("div");
  document.body.appendChild(container);

  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.physicallyCorrectLights = true;
  renderer.logarithmicDepthBuffer = true
  renderer.toneMapping = THREE.LinearToneMapping
  container.appendChild(renderer.domElement);
  renderer.outputEncoding = THREE.sRGBEncoding;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x222222);
  new THREE.RGBELoader().load('src/model/pillars_1k.hdr',
      function(hdrEquirect) {
        hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = hdrEquirect;
        animate();
      });

  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.set(0, 0, 100);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);

  // LIGHTS
  scene.add(new THREE.AmbientLight(0x888888));
  scene.add(new THREE.HemisphereLight(0xffffff, 0x443333, 0.7));

  spotLight = new THREE.SpotLight(0xffffff, 1);
  spotLight.position.set(0.5, 0, 1);
  spotLight.position.multiplyScalar(700);
  scene.add(spotLight);

  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 2048;
  spotLight.shadow.mapSize.height = 2048;
  spotLight.shadow.camera.near = 200;
  spotLight.shadow.camera.far = 1500;
  spotLight.shadow.camera.fov = 40;
  spotLight.shadow.bias = -0.01;

  loadModel().then(model => {
    const Eye_Left = model.getObjectByName('Eye_Left')
    const Eye_Right = model.getObjectByName('Eye_Right')
    const Face_Skin = model.getObjectByName('Face_Skin')
    const Teeth = model.getObjectByName('Teeth')

    makeUniforms(Eye_Left)
    makeUniforms(Eye_Right)
    makeUniforms(Face_Skin)
    makeUniforms(Teeth)
  })

  createComposer();
  animate();
}

function makeUniforms(object) {

  // eye
  const eye_baseColor = textureLoader.load("src/model/son/eye_baseColor.png");
  eye_baseColor.encoding = THREE.sRGBEncoding;
  const normalMap = textureLoader.load("src/model/son/eye_normal.png");
  normalMap.encoding = THREE.sRGBEncoding;

  // face
  const face_baseColor = textureLoader.load('src/model/son/face_baseColor.png')
  face_baseColor.encoding = THREE.sRGBEncoding;
  face_baseColor.flipY = false
  const face_NormalMap = textureLoader.load('src/model/son/face_normal.png')
  face_NormalMap.encoding = THREE.sRGBEncoding;
  const face_RoughnessMap = textureLoader.load('src/model/son/face_metalnessRough.png')
  face_RoughnessMap.encoding = THREE.sRGBEncoding;
  const face_MetalnessMap = textureLoader.load('src/model/son/face_metalnessRough.png')
  face_MetalnessMap.encoding = THREE.sRGBEncoding;
  const face_AOMap = textureLoader.load('src/model/son/face_ao.png')
  face_AOMap.encoding = THREE.sRGBEncoding;

  // teeth
  const teeth_Map = textureLoader.load('src/model/son/teeth_baseColor.png')
  teeth_Map.encoding = THREE.sRGBEncoding;
  const teeth_NormalMap = textureLoader.load('src/model/son/teeth_normal.png')
  teeth_NormalMap.encoding = THREE.sRGBEncoding;
  const teeth_AOMap = textureLoader.load('src/model/son/teeth_ao.png')
  teeth_AOMap.encoding = THREE.sRGBEncoding;

  // eye
  if (object.name === 'Eye_Left' || object.name === 'Eye_Right') {
    const uniforms_eye = THREE.UniformsUtils.clone(sss_shader.uniforms);
    uniforms_eye["map"].value = eye_baseColor;
    uniforms_eye["normalMap"].value = normalMap;
    uniforms_eye["normalScale"].value = new THREE.Vector2(0.8, 0.8);

    // uniforms_eye["thicknessColor"].value = new THREE.Color(0xdca998);
    // uniforms_eye["thicknessDistortion"].value = 0.1;
    // uniforms_eye["thicknessAmbient"].value = 0.1;
    // uniforms_eye["thicknessAttenuation"].value = 0.1;
    // uniforms_eye["thicknessPower"].value = 1.0;
    // uniforms_eye["thicknessScale"].value = 1.0;

    convertMaterial(uniforms_eye, eye_baseColor, object)
  }

  // face
  if (object.name === 'Face_Skin') {
    const uniforms_face = THREE.UniformsUtils.clone(sss_shader.uniforms);
    uniforms_face["map"].value = face_baseColor;
    uniforms_face["normalMap"].value = face_NormalMap;
    uniforms_face["aoMap"].value = face_AOMap;
    uniforms_face["normalScale"].value = new THREE.Vector2(0.8, 0.8);

    convertMaterial(uniforms_face, face_baseColor, object)
  }

  // teeth
  if (object.name === 'Teeth') {
    const uniforms_teeth = THREE.UniformsUtils.clone(sss_shader.uniforms);
    uniforms_teeth["map"].value = teeth_Map;
    uniforms_teeth["normalMap"].value = teeth_NormalMap;
    uniforms_teeth["aoMap"].value = teeth_AOMap;
    uniforms_teeth["normalScale"].value = new THREE.Vector2(0.8, 0.8);

    convertMaterial(uniforms_teeth, teeth_Map, object)
  }
}

function convertMaterial( uniform, map, object ) {
  const material = new THREE.ShaderMaterial({
    uniforms: uniform,
    vertexShader: sss_shader.vertexShader,
    fragmentShader: sss_shader.fragmentShader,
    lights: true
  });
  material.extensions.derivatives = true;
  material.map = map;

  object.material = material
  object.material.needsUpdate = true
}

function loadModel() {

  return new Promise(resolve => {
    const loader = new THREE.GLTFLoader();

    const dracoLoader = new THREE.DRACOLoader();
    dracoLoader.setDecoderPath( '../draco/' );
    loader.setDRACOLoader( dracoLoader );

    // son
    loader.load("src/model/son_102_1k0-v1.glb", function (gltf) {
      mesh = gltf.scene
      mesh.position.set(150, -50, 0);
      mesh.scale.setScalar(120);
      mesh.add( new THREE.AxesHelper(10))

      mesh.traverse( e => e.isMesh && (e.frustumCulled = false) )
      scene.add(mesh);
      resolve(mesh)
    });
  })

}

function createComposer() {
  renderer.autoClear = false;

  const renderModel = new THREE.RenderPass(scene, camera);
  const effectBleach = new THREE.ShaderPass(THREE.BleachBypassShader);
  const effectColor = new THREE.ShaderPass(THREE.ColorCorrectionShader);
  effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
  const gammaCorrection = new THREE.ShaderPass(THREE.GammaCorrectionShader);

  effectFXAA.uniforms["resolution"].value.set(
      1 / window.innerWidth,
      1 / window.innerHeight
  );

  effectBleach.uniforms["opacity"].value = 0.2;
  effectColor.uniforms["powRGB"].value.set(1.4, 1.45, 1.45);
  effectColor.uniforms["mulRGB"].value.set(1.1, 1.1, 1.1);

  composer = new THREE.EffectComposer(renderer);

  composer.addPass(renderModel);
  composer.addPass(effectFXAA);
  composer.addPass(effectBleach);
  composer.addPass(effectColor);
  composer.addPass(gammaCorrection);
}

function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  composer.setSize(width, height);

  effectFXAA.uniforms["resolution"].value.set(1 / width, 1 / height);
}

function animate() {
  requestAnimationFrame(animate);

  // composer.render();
  renderer.render(scene, camera); // don't use this if using composer
}

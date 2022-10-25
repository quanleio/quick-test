
let toystory,
    mesh,
    mixer;

let clock = new THREE.Clock();
let mainURL = 'https://intra.letsee.io/3D-model/gltf/';

const loadingManager = new THREE.LoadingManager();
loadingManager.onProgress = (item, loaded, total) => console.log(item, loaded, total);

let geometry;
const particleCount = 1000;

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
  let dirLight = new THREE.DirectionalLight(0x11e8bb, 1);
  dirLight.position.set(.75, 1, .5);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize = new THREE.Vector2(512, 512);
  scene.add(dirLight);

  let dirLight2 = new THREE.DirectionalLight(0x8200c9, 1);
  dirLight2.position.set(-.75, -1, .5);
  dirLight2.castShadow = true;
  dirLight2.shadow.mapSize = new THREE.Vector2(512, 512);
  scene.add(dirLight2);

  let pointLight = new THREE.PointLight(0xffffff, .8);
  pointLight.position.set(0, 0, 1);
  scene.add(pointLight);

  let ambientLight = new THREE.AmbientLight(new THREE.Color("rgb(1, .93, .924)"), .8);
  ambientLight.position.set(0, 0, 0);
  scene.add(ambientLight);

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
  renderer.setPixelRatio( window.devicePixelRatio );
}

/**
 * Proceed model.
 */
function proceedModel() {
  letsee.addTarget('https://d-developer.letsee.io/api-tm/target-manager/target-uid/6077f2922b256dfa2f0dfca6').then(entity => {
    toystory = entity;

    const particles = createParticles();
    toystory.add(particles);

    // test
    // const geometry = new THREE.BoxBufferGeometry( 300, 300, 1 );
    // const material = new THREE.MeshPhongMaterial( {color: 'black'} );
    // const cube = new THREE.Mesh( geometry, material );
    // toystory.add(cube);

    scene.add(toystory);

    // Render all
    renderAll().then(() => {});
  });
}

/**
 * Create particles and make lines
 * @returns {*}
 */
function createParticles() {

  const positions = [];
  const colors = [];
  const sizes = [];
  let uniforms = {
    pointTexture: {
      value: new THREE.TextureLoader().load("assets/white.png"),
    },
    opacity: { value: .5 }
  };

  const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: document.getElementById("vertexshader").textContent,
    fragmentShader: document.getElementById("fragmentshader").textContent,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthTest: false,
    transparent: true,
    vertexColors: true,
  });

  geometry = new THREE.BufferGeometry();
  for (let i = 0; i < particleCount; i++) {

    const randomX = (Math.random() * 6 - 3) * 100;
    const randomY = (Math.random() * 6 - 3) * 100;
    const randomZ = (Math.random() * 6 - 3) * 100;
    positions.push(randomX);
    positions.push(randomY);
    positions.push(randomZ);

    let color = new THREE.Color().setHex(getRandomColor())
    // let color = new THREE.Color("rgb(255,255,255)");
    colors.push(color.r, color.g, color.b);

    sizes.push(100);
  }

  geometry.setAttribute( "position", new THREE.Float32BufferAttribute(positions, 3) );
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setAttribute( "size", new THREE.Float32BufferAttribute(sizes, 1).setUsage( THREE.DynamicDrawUsage ) );
  let particleSystem = new THREE.Points(geometry, shaderMaterial);
  particleSystem.sortParticles = true;

  // Dont apply bloom for particles
  particleSystem.layers.enable(0);

  return particleSystem;
}

function getRandomNumberBetween(min,max){
  return Math.floor(Math.random()*(max-min+1)+min);
}

function getRandomColor() {
  // const randomColors = {
  //   green: new THREE.Color("rgb(0,168,105)"),     // 1
  //   red: new THREE.Color("rgb(149,0,92)"),        // 2
  //   pink: new THREE.Color("rgb(255,187,232)"),    // 3
  //   brown: new THREE.Color("rgb(159,53,1)"),      // 4
  //   lightblue: new THREE.Color("rgb(0,152,225)"), // 5
  //   blue: new THREE.Color("rgb(0,101,173)"),      // 6
  //   yellow: new THREE.Color("rgb(246,172,0)"),    // 7
  //   white: new THREE.Color("rgb(255,255,255)"),   // 8
  // };

  const randomColors = {
    green: 0x00A869,      // 1
    red : 0x95005C,       // 2
    pink: 0xFFBBE8,       // 3
    brown: 0x9F3501,      // 4
    lightblue: 0x0098E1,  // 5
    blue: 0x0065AD,       // 6
    yellow: 0xF6AC00,     // 7
    white: 0xffffff       // 8
  };
  let colorsLength = Object.keys( randomColors ).length;

  var colIndx = Math.floor(Math.random()* colorsLength);
  var colorStr = Object.keys(randomColors)[colIndx];
  return randomColors[colorStr];
}

/**
 * Render the whole thing.
 * @returns {Promise<void>}
 */
const renderAll = async function() {
  requestAnimationFrame(renderAll);

  let d = clock.getDelta();

  // animate particles
  const time = Date.now() * 0.0025;
  const sizes = geometry.attributes.size.array;
  for (let i = 0; i < particleCount; i++) {
    sizes[i] = 50 * (1 + Math.sin(.1 * i + time));
  }
  geometry.attributes.size.needsUpdate = true;
  //

  camera = letsee.threeRenderer().getDeviceCamera();
  await letsee.threeRenderer().update();

  renderer.render(scene, camera);
};

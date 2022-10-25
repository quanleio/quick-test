let container;
let camera;
let controls;
let renderer;
let scene;
let mouse;

var ground;
var raycaster;
var threshold = 0.1;

var worldWidth = 256,
  worldDepth = 256,
  worldHalfWidth = worldWidth / 2,
  worldHalfDepth = worldDepth / 2;

var circleMesh = null;

const mixers = [];
const clock = new THREE.Clock();

javascript: (function () {
  var script = document.createElement("script");
  script.onload = function () {
    var stats = new Stats();
    document.body.appendChild(stats.dom);
    requestAnimationFrame(function loop() {
      stats.update();
      requestAnimationFrame(loop);
    });
  };
  script.src = "//mrdoob.github.io/stats.js/build/stats.min.js";
  document.head.appendChild(script);
})();

function init() {

  console.warn('THREE.REVISION: ', THREE.REVISION)
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  createCamera();
  createControls();
  createLights();
  // loadModels();
  createRenderer();
  createGround();

  mouse = new THREE.Vector2(0, 0);
  raycaster = new THREE.Raycaster();
  raycaster.params.Points.threshold = threshold;

  window.addEventListener("resize", onWindowResize);
}

function createCamera() {
  camera = new THREE.PerspectiveCamera(
    35,
    container.clientWidth / container.clientHeight,
    1,
    1000
  );
  camera.position.set(-200, 0, 0);
}

function createControls() {
  controls = new THREE.OrbitControls(camera, container);
  controls.maxPolarAngle = toRadians(90);
}

function createLights(array, offset) {
  let mainLight = new THREE.PointLight(0xffffff, 350);
  const ambientLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 0.9);

  mainLight.position.set(-20, 50, -20);
  mainLight.castShadow = true;

  mainLight.shadow.mapSize.width = 512;
  mainLight.shadow.mapSize.height = 512;
  mainLight.shadow.camera.near = 0.5;
  mainLight.shadow.camera.far = 1000;

  mainLight.name = "mainLight";
  ambientLight.name = "ambientLight";

  scene.add(mainLight, ambientLight);
}

/*function loadModels() {
  const loader = new THREE.GLTFLoader();

  const onLoad = (gltf, position) => {
    const model = gltf.scene.children[0];
    model.position.copy(position);

    scene.add(model);
  };
  const onProgress = () => {};

  const onError = (errorMessage) => {
    console.log(errorMessage);
  };
}*/

function createGround() {
  let grassTexture = new THREE.TextureLoader().load("images/grass.jpeg");

  grassTexture.wrapS = THREE.RepeatWrapping;
  grassTexture.wrapT = THREE.RepeatWrapping;

  grassTexture.repeat.x = 16;
  grassTexture.repeat.y = 16;

  let groundMaterial = new THREE.MeshPhongMaterial({ map: grassTexture });

  groundMaterial.receiveShadow = true;

  let groundGeometry = new THREE.BoxBufferGeometry(1000, 1000, 0.01);

  groundGeometry.receiveShadow = true;

  ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.name = 'Ground';

  ground.position.y = -45;
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;

  ground.doubleSided = true;
  scene.add(ground);
}

function branchInsert( totalGeometry, branchLength, branchRadius, topTargetPoint, theta, rho, phi ) {

  if (branchLength < 0 || branchRadius < 0)
    return topTargetPoint;

  let branch = new THREE.CylinderBufferGeometry(branchRadius * (1 - radiusReductionFactor), branchRadius, branchLength, 9);

  // Calcolo il top e il bottom point del cilindro e guardo dove sono dopo la rotazione
  var newTopPoint = new THREE.Vector3(0, branchLength / 2, 0);
  var bottomPoint = new THREE.Vector3(0, - branchLength / 2, 0);

  // var branchMesh = new THREE.Mesh(branch);
  let branchMesh = createTrunk(branch);
  branchMesh.name = 'branch';
  branchMesh.autoUpdate = false;

  // Eseguo la rotazione
  branchMesh.rotateX(toRadians(theta));
  branchMesh.rotateY(toRadians(rho));
  branchMesh.rotateZ(toRadians(phi));

  branchMesh.updateMatrix();

  // Calcolo i nuovi punti ruotati
  newTopPoint.applyEuler(branchMesh.rotation);
  bottomPoint.applyEuler(branchMesh.rotation);

  // Eseguo una traslazione per allineare il bottom al top target in entrata, salvo il nuovo topPoint
  newTopPoint.x = newTopPoint.x + topTargetPoint.x - bottomPoint.x;
  newTopPoint.y = newTopPoint.y + topTargetPoint.y - bottomPoint.y;
  newTopPoint.z = newTopPoint.z + topTargetPoint.z - bottomPoint.z;

  branchMesh.position.set(topTargetPoint.x - bottomPoint.x, topTargetPoint.y - bottomPoint.y, topTargetPoint.z - bottomPoint.z);
  branchMesh.updateMatrix();

  if ((branchRadius / initialBranchRadius) < 0.6) {
    let position = [newTopPoint.x, newTopPoint.y, newTopPoint.z, theta + angle, rho + angle, phi + angle];
    leafsPositions.push(position);
    position = [newTopPoint.x, newTopPoint.y, newTopPoint.z, theta - angle, rho - angle, phi - angle];
    leafsPositions.push(position);
  }

  branchMesh.castShadow = true;
  branchMesh.receiveShadow = true;

  // totalGeometry.merge(branchMesh.geometry, branchMesh.matrix);
  // console.error(branchMesh.matrix)
  // totalGeometry = branchMesh.geometry.clone();
  // totalGeometry.applyMatrix4(branchMesh.matrix)
  // totalGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries([stemMesh.geometry, leaf]);

  // totalGeometry.castShadow = true;
  // totalGeometry.receiveShadow = true;

  scene.add(branchMesh);
  // console.warn(scene.children)

  return newTopPoint;
}

function createTrunk(branchGeo) {

  /*var barkTexture = 1;
  let texture = new THREE.TextureLoader().load("images/bark-2.jpg");
  barkTexture = document.getElementById("bark").value;
  switch (barkTexture) {
    case "1":
      texture = new THREE.TextureLoader().load("images/bark-1.jpg");
      break;

    case "2":
      texture = new THREE.TextureLoader().load("images/bark-2.jpg");
      break;

    case "3":
      texture = new THREE.TextureLoader().load("images/bark-3.jpg");
      break;
  }

  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  const timesToRepeatHorizontally = 1;
  const timesToRepeatVertically = 4;
  texture.repeat.set(timesToRepeatHorizontally, timesToRepeatVertically);

  texture.center.set(0.5, 0.5);
  texture.rotation = toRadians(15);

  var material = new THREE.MeshPhongMaterial({
    map: texture,
  });*/

  let randomColor = new THREE.Color( 0xffffff );
  randomColor.setHex( Math.random() * 0xffffff );
  const treeMaterial = new THREE.MeshStandardMaterial({
    color: randomColor,
    transparent: true,
    opacity: 1,
  });

  return new THREE.Mesh(branchGeo, treeMaterial);

}

function ruleOne(
  totalGeometry,
  topPoint,
  iterations,
  preXAngle,
  preYAngle,
  preZAngle,
  rightX,
  rightY,
  rightZ,
  j
) {
  if (iterations === 0) return;

  for (let i = 0; i < rule1.length; i++) {
    if (rule1.charAt(i) === "+") {
      rightX += 1;
      continue;
    }

    if (rule1.charAt(i) === "-") {
      rightX -= 1;
      continue;
    }

    if (rule1.charAt(i) === "^") {
      rightY += 1;
      continue;
    }

    if (rule1.charAt(i) === "v") {
      rightY -= 1;
      continue;
    }

    if (rule1.charAt(i) === ">") {
      rightZ += 1;
      continue;
    }

    if (rule1.charAt(i) === "<") {
      rightZ -= 1;
      continue;
    }

    if (rule1.charAt(i) === "f") {
      topPoint = branchInsert(
        totalGeometry,
        branchLength * (1 - j * lengthReductionFactor),
        branchRadius * (1 - j * radiusReductionFactor),
        topPoint,
        angle * rightX + preXAngle,
        angle * rightY + preYAngle,
        angle * rightZ + preZAngle
      );
      j += 1;

      preXAngle += angle * rightX;
      preYAngle += angle * rightY;
      preZAngle += angle * rightZ;
      rightX = 0;
      rightY = 0;
      rightZ = 0;
    }

    if (rule1.charAt(i) === "A") {
      ruleOne(
        totalGeometry,
        topPoint,
        iterations - 1,
        preXAngle,
        preYAngle,
        preZAngle,
        rightX,
        rightY,
        rightZ,
        j
      );
      continue;
    }

    if (rule1.charAt(i) === "B") {
      ruleTwo(
        totalGeometry,
        topPoint,
        iterations - 1,
        preXAngle,
        preYAngle,
        preZAngle,
        rightX,
        rightY,
        rightZ,
        j
      );
      continue;
    }
  }
}

function ruleTwo(
  totalGeometry,
  topPoint,
  iterations,
  preXAngle,
  preYAngle,
  preZAngle,
  rightX,
  rightY,
  rightZ,
  j
) {
  if (iterations === 0) return;

  for (let i = 0; i < rule2.length; i++) {
    if (rule2.charAt(i) === "+") {
      rightX += 1;
      continue;
    }

    if (rule2.charAt(i) === "-") {
      rightX -= 1;
      continue;
    }

    if (rule2.charAt(i) === "^") {
      rightY += 1;
      continue;
    }

    if (rule2.charAt(i) === "v") {
      rightY -= 1;
      continue;
    }

    if (rule2.charAt(i) === ">") {
      rightZ += 1;
      continue;
    }

    if (rule2.charAt(i) === "<") {
      rightZ -= 1;
      continue;
    }

    if (rule2.charAt(i) === "f") {
      topPoint = branchInsert(
        totalGeometry,
        branchLength * (1 - j * lengthReductionFactor),
        branchRadius * (1 - j * radiusReductionFactor),
        topPoint,
        angle * rightX + preXAngle,
        angle * rightY + preYAngle,
        angle * rightZ + preZAngle
      );
      j += 1;

      preXAngle += angle * rightX;
      preYAngle += angle * rightY;
      preZAngle += angle * rightZ;
      rightX = 0;
      rightY = 0;
      rightZ = 0;
    }

    if (rule2.charAt(i) === "A") {
      ruleOne(
        totalGeometry,
        topPoint,
        iterations - 1,
        preXAngle,
        preYAngle,
        preZAngle,
        rightX,
        rightY,
        rightZ,
        j
      );
      continue;
    }

    if (rule2.charAt(i) === "B") {
      ruleTwo(
        totalGeometry,
        topPoint,
        iterations - 1,
        preXAngle,
        preYAngle,
        preZAngle,
        rightX,
        rightY,
        rightZ,
        j
      );
      continue;
    }
  }
}

function createRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);

  renderer.setPixelRatio(window.devicePixelRatio);

  renderer.gammaFactor = 2.2;
  renderer.outputEncoding = THREE.sRGBEncoding;

  renderer.physicallyCorrectLights = true;

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  container.appendChild(renderer.domElement);
}

function animate() {
  requestAnimationFrame( animate );
  const delta = clock.getDelta();

  for (const mixer of mixers) {
    mixer.update(delta);
  }
  renderer.render( scene, camera );
}

// function render() {
//   renderer.render(scene, camera);
// }

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
}

function onMouseDown(e) {
  event.preventDefault();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  var intersections = raycaster.intersectObject(ground);
  intersection = intersections.length > 0 ? intersections[0] : null;

  if (intersection != null && circleMesh === null) {
    var circle = new THREE.CircleGeometry(branchRadius * 8, 32);
    var material = new THREE.MeshBasicMaterial({ color: 0x000000 });
    circleMesh = new THREE.Mesh(circle, material);

    circleMesh.rotateX(toRadians(270));
    circleMesh.position.copy(intersection.point);

    circleMesh.name = "marker";

    scene.add(circleMesh);
  } else if (intersection != null) {
    circleMesh.position.copy(intersection.point);
  }
}

window.onload = () => {

  container = document.querySelector("#scene-container");
  container.addEventListener("mousedown", onMouseDown, false)

  init();
  animate();
}

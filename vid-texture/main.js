let toystory, mesh, mixer;
let clock = new THREE.Clock();

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

  // 3. Set light effects for renderer
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.physicallyCorrectLights = true;
  renderer.setPixelRatio(window.devicePixelRatio);
}

/**
 * Proceed model.
 */
function proceedModel() {
  letsee.addTarget("toystory.json").then((entity) => {
    toystory = entity;

    let video = document.createElement("video");
    video.autoplay = true;
    video.loop = true;
    video.setAttribute("muted", "");
    video.muted = true;
    video.setAttribute("webkit-playsinline", "");
    video.setAttribute("playsinline", "");
    video.src = "mov_bbb.mp4";
    video.load();

    video.addEventListener("canplay", () => {
      video.play().then(() => {
        console.error(`Video is playing...`);

        // Create a plane geometry for video
        // var texture = THREE.ImageUtils.loadTexture('toystory.jpg', {});
        // var planeMat = new THREE.MeshPhongMaterial( { map: texture } );
        let planeMat = new THREE.MeshBasicMaterial();
        let videoTexture = new THREE.VideoTexture(video);
        planeMat.map = videoTexture;

        let planeGeo = new THREE.PlaneGeometry(100, 80, 32);
        let planeMesh = new THREE.Mesh(planeGeo, planeMat);
        planeMesh.visible = true;
        planeMesh.position.set(0, 0, 0);
        planeMesh.add(new THREE.AxesHelper(300));

        // 2.Add mesh into entity
        toystory.add(planeMesh);
      });
    });

    // 3. Add entity to scene
    scene.add(toystory);

    // Render all
    renderAll().then(() => {});
  });
}

/**
 * Render the whole thing.
 * @returns {Promise<void>}
 */
const renderAll = async function () {
  requestAnimationFrame(renderAll);

  let d = clock.getDelta();
  if (mixer) mixer.update(d);

  camera = letsee.threeRenderer().getDeviceCamera();
  await letsee.threeRenderer().update();

  renderer.render(scene, camera);
};

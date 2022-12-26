let camera, scene, renderer;

init();
animate();

function init() {

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.01, 1000 );
  camera.position.z = 2;

  scene = new THREE.Scene();

  const loader = new THREE.TextureLoader();
  // const texture = loader.load( 'https://i.imgur.com/tP7bbkQ.png' );
  const texture = loader.load( 'sample-01.png' );

  const geometry = new THREE.PlaneBufferGeometry( 3, 3);
  const material = new THREE.ShaderMaterial( {
    uniforms: {
      tDiffuse: {
        value: texture
      }
    },
    vertexShader: document.getElementById( 'vertexShader' ).textContent,
    fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
    transparent: true,
    side: THREE.DoubleSide
  } );

  const mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  const controls = new THREE.OrbitControls( camera, renderer.domElement );

}

function animate() {

  requestAnimationFrame( animate );
  renderer.render( scene, camera );

}

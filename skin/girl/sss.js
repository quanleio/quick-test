function initMaterial() {

  const loader = new THREE.TextureLoader();
  const imgTexture = loader.load( 'https://threejs.org/examples/models/fbx/white.jpg' );
  const thicknessTexture = loader.load( 'https://threejs.org/examples/models/fbx/bunny_thickness.jpg' );
  imgTexture.wrapS = imgTexture.wrapT = THREE.RepeatWrapping;

  const shader = THREE.SubsurfaceScatteringShader;
  const uniforms = THREE.UniformsUtils.clone( shader.uniforms );

  uniforms[ 'map' ].value = imgTexture;

  uniforms[ 'diffuse' ].value = new THREE.Vector3( 1.0, 0.2, 0.2 );
  uniforms[ 'shininess' ].value = 500;

  uniforms[ 'thicknessMap' ].value = thicknessTexture;
  uniforms[ 'thicknessColor' ].value = new THREE.Vector3( 0.5, 0.3, 0.0 );
  uniforms[ 'thicknessDistortion' ].value = 0.1;
  uniforms[ 'thicknessAmbient' ].value = 0.4;
  uniforms[ 'thicknessAttenuation' ].value = 0.8;
  uniforms[ 'thicknessPower' ].value = 2.0;
  uniforms[ 'thicknessScale' ].value = 16.0;
  console.warn(uniforms)

  const material = new THREE.ShaderMaterial( {
    uniforms: uniforms,
    vertexShader: shader.vertexShader,
    fragmentShader: shader.fragmentShader,
    lights: true,
  } );
  material.extensions.derivatives = true;

  // LOADER

  const loaderGLB = new THREE.GLTFLoader();
  const dracoLoader = new THREE.DRACOLoader();
  dracoLoader.setDecoderPath( '../draco/' );
  loaderGLB.setDRACOLoader( dracoLoader );

  // Son
 /* loaderGLB.load( '../son/son_lod2_face_rendering_quality_test_20221018.glb', function ( gltf ) {
    model= gltf.scene
    model.position.set( 220, -70, 0 );
    model.scale.setScalar( 180 );
    model.material = material;
    scene.add( model );

    model.traverse(child => {
      child.frustumCulled = false
    })
  } );*/

  // Girl
  loaderGLB.load( 'scifi_girl_v01-v1.glb', function ( gltf ) {
    model= gltf.scene

    model.position.set( 0, -120, 0 );
    model.scale.setScalar( 80 );
    model.rotation.y = Math.PI/180 * -90
    model.material = material;
    scene.add( model );

    model.traverse(child => {
      child.frustumCulled = false
    })
  } );

}

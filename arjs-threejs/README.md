# README #

AR.js is a lightweight library for Augmented Reality on the Web, coming with features like Marker based and Location based AR.

**threex.artookit** is the three.js extension to easily handle artoolkit.

### Creating webapp ###

In order to create a webapp using AR.js and Three.js, user needs to do a bunch of steps to setup the environment.

#### Basic setup ####

Firstly, user needs to provide THREE.js and ar.js libraries.

Next, user initializes a basic Three.js environment including `scene`, `camera` and `renderer` as below. The camera is added into the scene, and renderer is a webgl renderer which has basic properties like position, color and render size.

Note that, the renderer does not contains any canvas when it is initialized. The canvas is actually is created by AR.js library.

#### Initialize threex.artoolkit components ####

Next step, user needs to initialize and handle 3 basic components of **threex.artoolkit**.

**threex.artoolkit** is composed of 3 classes:

- `THREEx.ArToolkitSource` : It is the image which is analyzed to do the position tracking. It can be the webcam, a video or even an image.
- `THREEx.ArToolkitContext`: It is the main engine. It will actually find the marker position in the image source.
- `THREEx.ArMarkerControls`: it controls the position of the marker It use the classical three.js controls API. It will make sure to position your content right on top of the marker.

**THREEx.ArToolkitSource**

It is the image which is analyzed to do the position tracking. It can be the webcam, a video or even an image. So in this example, we'll read the image from webcam, so the `sourceType` is set by '`webcam`'.

THREEx.ArToolkitSource creates and attaches the video element (id="arjs-video") into its domElement properties and initializes some default parameters:

**THREEx.ArToolkitContext**

It is the main engine. It will actually find the marker position in the image source.

Same as THREEx.ArToolkitSource, the THREEx.ArToolkitContext also has its own default parameters.

When THREEx.ArToolkitContext is initialized, these default values are set. However if user wants to change some values, all they need to do is provide the parameters when initializes the THREEx.ArToolkitContext. 

For example, user wants to provide their own file of camera calibration, the cameraParametersUrl value should be changed to the path (or URL) or the camera calibration file.

Based on the camera calibration file,  THREEx.ArToolkitContext will calculate the projection matrix and this projection matrix will be updated into the [Three.camera](http://three.camera).

Plus, in this step, a canvas is also created and added into the HTML DOM and ready for rendering.

And note that, this is called once when the camera feed begins (same as 8thwall).

**THREEx.ArMarkerControls**

it controls the position of the marker It use the classical three.js controls API. It will make sure to position your content right on top of the marker.

The THREEx.ArMarkerControls also has its own default parameters, and of course users are able to change its values if needed.

When initializing THREEx.ArMarkerControls, it needs arToolkitContext, camera and some configuration as parameters.

User needs to provide their desired marker controls such as type of marker (pattern | barcode), patternURL (the pattern file's location) and changeMatrixMode (cameraTransformMatrix | modelViewMatrix).

#### Adding 3D object into the scene ####

Creating basic 3D object with THREE.js library.

Here we are gonna create a Torus knot and a Cube, then add them into the scene.

#### Render the scene ####
Render the whole thing by calling requestAnimationFrame to keep the rendering loop every frame.

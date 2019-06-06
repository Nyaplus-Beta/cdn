			var container, stats;

			var mesh, camera, scene, renderer, effect;
			var helper, ikHelper, physicsHelper;

			var clock = new THREE.Clock();

			Ammo().then( function( AmmoLib ) {

				Ammo = AmmoLib;

				init();
				animate();

			} );


			function init() {

				container = document.createElement( 'div' );
				document.body.appendChild( container );

				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
				camera.position.z = 35;

				// scene
				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0xffffff );

				var gridHelper = new THREE.PolarGridHelper( 30, 10 );
				gridHelper.position.y = - 10;
				scene.add( gridHelper );

				var ambient = new THREE.AmbientLight( 0x666666 );
				scene.add( ambient );

				var directionalLight = new THREE.DirectionalLight( 0x887766 );
				directionalLight.position.set( - 1, 1, 1 ).normalize();
				scene.add( directionalLight );

				//

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight-4);
				container.appendChild( renderer.domElement );

				effect = new THREE.OutlineEffect( renderer );

				// STATS 数据统计
				//stats = new Stats();
				//container.appendChild( stats.dom );

				// model
				function onProgress( xhr ) {
					if ( xhr.lengthComputable ) {
						var percentComplete = xhr.loaded / xhr.total * 100;
						console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
					}
				}

				//var modelFile = './models/al-liliya/al-liliyaX.pmx';
				var modelFile = 'https://cdn.jsdelivr.net/gh/Nyaplus-Beta/cdn@3.2/3D/models/fbk/fbk.pmx';
				//var modelFile = 'https://www.seaplay.vip/model/001miku_v2.pmd';
				var vmdFiles = [ 'https://cdn.jsdelivr.net/gh/Nyaplus-Beta/cdn@3.1/3D/models/vmds/girls_v.vmd'];
				//var vmdFiles = [ './actions/wavefile_v2.vmd'];
				//var vmdFiles = ['https://www.seaplay.vip/model/001wavefile_v2.vmd'];
				helper = new THREE.MMDAnimationHelper( {
					afterglow: 2.0
				} );

				var loader = new THREE.MMDLoader();

				loader.loadWithAnimation( modelFile, vmdFiles, function ( mmd ) {

					mesh = mmd.mesh;
					mesh.position.y = - 10;
					scene.add( mesh );

					helper.add( mesh, {
						animation: mmd.animation,
						physics: true
					} );

					// ikHelper = helper.objects.get( mesh ).ikSolver.createHelper();
					// ikHelper.visible = false;
					// scene.add( ikHelper );

					// physicsHelper = helper.objects.get( mesh ).physics.createHelper();
					// physicsHelper.visible = false;
					// scene.add( physicsHelper );

					initGui();

				}, onProgress, null );

				var controls = new THREE.OrbitControls( camera, renderer.domElement );

				window.addEventListener( 'resize', onWindowResize, false );

				var phongMaterials;
				var originalMaterials;

				function makePhongMaterials( materials ) {
					var array = [];
					for ( var i = 0, il = materials.length; i < il; i ++ ) {
						var m = new THREE.MeshPhongMaterial();
						m.copy( materials[ i ] );
						m.needsUpdate = true;
						array.push( m );
					}
					phongMaterials = array;
				}

				function initGui() {

					var api = {
						'animation': true,
						'gradient mapping': true,
						'ik': true,
						'outline': true,
						'physics': true,
						'show IK bones': false,
						'show rigid bodies': false
					};

					var gui = new dat.GUI();

					gui.add( api, 'animation' ).onChange( function () {

						helper.enable( 'animation', api[ 'animation' ] );

					} );

					gui.add( api, 'gradient mapping' ).onChange( function () {

						if ( originalMaterials === undefined ) originalMaterials = mesh.material;
						if ( phongMaterials === undefined ) makePhongMaterials( mesh.material );

						if ( api[ 'gradient mapping' ] ) {

							mesh.material = originalMaterials;

						} else {

							mesh.material = phongMaterials;

						}

					} );
/*
					gui.add( api, 'physics' ).onChange( function () {

						helper.enable( 'physics', api[ 'physics' ] );

					} );

					gui.add( api, 'ik' ).onChange( function () {

						helper.enable( 'ik', api[ 'ik' ] );

					} );

					gui.add( api, 'outline' ).onChange( function () {

						effect.enabled = api[ 'outline' ];

					} );



					gui.add( api, 'show IK bones' ).onChange( function () {

						ikHelper.visible = api[ 'show IK bones' ];

					} );

					gui.add( api, 'show rigid bodies' ).onChange( function () {

						if ( physicsHelper !== undefined ) physicsHelper.visible = api[ 'show rigid bodies' ];

					} );
*/

				}

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				effect.setSize( window.innerWidth, window.innerHeight-4 );

			}

			//
			function animate() {
				requestAnimationFrame( animate );
				//stats.begin();
				render();
				//stats.end();
			}

			function render() {
				helper.update( clock.getDelta() );
				effect.render( scene, camera );

			}
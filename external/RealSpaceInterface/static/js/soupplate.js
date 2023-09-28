/**
 * @author Sophia Schubert
 */

var soupbowl = soupbowl || {}; //Create namespace for soup application

      /*Shows 3D bowl in initial state. Executed when window opened.*/
      window.onload = function() {

          //array to store lines simulating old waves leaving soupbowl
          let lineList = [];
          //array to store lines simulating new waves coming into soupbowl scale invariant
          let newlineList = [];
          //get canvas
          var canvas = document.getElementById('soupcanvas');
          // Scene
          const scene = new THREE.Scene();
          //set background color scene (white)
          scene.background = new THREE.Color( 0xffffff);
          //create soupbowl
          const mesh = soupbowl.createBowl();

          //repeat for all parts of soupbowl
          for(let i = 0; i < mesh.length; i++){
            //scale
            mesh[i].scale.set(0.25, 0.25, 0.25);
            //move downwards
            mesh[i].position.y = mesh[i].position.y - 1;
            //add to scene
            scene.add(mesh[i]);
          }

          // Set up lights
          const ambientLight =  soupbowl.createambientLight();
          const directionalLight =  soupbowl.createdirectionalLight();
          scene.add(ambientLight);
          scene.add(directionalLight);
          // Camera
          const camera = soupbowl.createCamera();
          // Renderer
          const renderer = soupbowl.createRenderer();
          // Add renderer to HTML
          soupcanvas.appendChild(renderer.domElement);
          //Controls to rotate / zoom on object with mouse
          const controls = new THREE.OrbitControls(camera, renderer.domElement);

          //Gui to set parameters / control simulation
          const gui = new dat.GUI({ width: 200 })
          gui.autoPlace = false;
          //add gui to HTML
          soupgui.appendChild( gui.domElement );
          //parameters gui
          const props = {
            size: 0.25, //default size singular tofu block
            number: 5, //default number tofu blocks
            ingredient1: 0.2, //default concentration ingredient 1 (miso paste)
            ingredient2: 0.5, //default concentration ingredient 2 (broth)
            ingredient3: 0.3, //default concentration ingredient 3 (spring onion)
          }

          //default size tofu
          var sizeTofu = 0.25;
          //create Tofu for Gaussian simulation
          const tofu = soupbowl.createTofu();
          //default number of tofus
          var numberTofu = 5;
          //array to store multiple tofu (Scale invariant
          let tofuList = [];
          //array to store size multiple tofus (Scale invariant)
          let tofuSizeList = [];
          //variable to determine if not called yet (0) / Gaussian (1) / Scale invariant (2)
          var state = 0;

          //default concentrations of ingredients
          var i1 = 0.2; //miso paste
          //var i2 = 0.6; //broth
          var i2 = 0.5; //broth
          //var i3 = 0.4; //spring onion
          var i3 = 0.3; //spring onion


          //create initial amount of spring onions
          //array storing all onions
          let onions = [];

          for (let i = 0; i < (i3*20); i++) {

            //determines if random size spring onion within desired range
            var onionflag = false;
            //random size onions
            var onionsize;

            while (onionflag == false) {
              onionsize = Math.random();

              if(onionsize > 0.08 && onionsize < 0.23) {
                onionflag = true;
              }
            }

            //create new spring onion with given size
            var newonion = soupbowl.springonion(onionsize);
            newonion.position.y = -0.525;

            //give spring onion random x and z position
            var onionrandomx = Math.random() * 4;
            var onionrandomz = Math.random() * 4;

            //minus to allow negative values for positions
            let onionpositionx = 2 - onionrandomx;
            let onionpositionz = 2 - onionrandomz;

            newonion.position.x = onionpositionx;
            newonion.position.z = onionpositionz;

            //add new spring onion to array spring onions
            onions.push(newonion);
            //add new spring onion to scene
            scene.add(newonion);
          }

          //functions determining actions when buttons gui pressed

          //initialisation Gaussian simulation (for singular tofu)
          props.initialGaussian =
                      function() {
                          //remove tofu from previous initialisations
                          if(state = 1) {
                            scene.remove(tofu);
                          }
                          tofu.position.y = 1.5;
                          //scale tofu to size specified in gui
                          tofu.scale.set(sizeTofu, sizeTofu, sizeTofu);
                          //add tofu to scene
                          scene.add(tofu);
                          //set state to Guassian
                          state = 1;
                      }
          //initialisation Scale invariant simulation (for multiple tofus)
          props.initialScale =
                      function() {
                          //remove tofus from previous initialisations
                          if(state == 2) {
                            for(let i = 0; i < tofuList.length; i++) {
                              scene.remove(tofuList[i]);
                            }
                            tofuList = [];
                          }

                          //create specified number of tofus with random sizes / positions
                          for (let i = 0; i < numberTofu; i++) {
                            //create tofu
                            const t = soupbowl.createTofu();

                            //give tofu random size between 0.1 and 0.4
                            let randomsize = 0;

                            while ((randomsize < 0.1) || (randomsize > 0.4)) {
                              randomsize = Math.random();
                            }
                            tofuSizeList.push(randomsize);
                            //scale tofu to random size
                            t.scale.set(randomsize, randomsize, randomsize);

                            //attempt to eliminate overlap (redo this)
                            let overlap = true;

                            //give tofu random x and z position
                            var randomx;
                            var randomz;

                            //(try to) avoid overlap tofus
                            do {
                              overlap = false;

                              randomx = Math.random() * 4;
                              randomz = Math.random() * 4;


                              let positionx = 2 - randomx;
                              let positionz = 2 - randomz;

                              for (let j = 0; j < tofuList.length; j++) {

                                if((Math.abs(positionx - (randomsize / 2)) < Math.abs(tofuList[j].position.x + (tofuSizeList[j] / 2) + 0.2) && Math.abs(positionx + (randomsize / 2)) > Math.abs(tofuList[j].position.x - (tofuSizeList[j] / 2) - 0.2))){
                                  overlap = true;
                                }

                                if((Math.abs(positionz - (randomsize / 2)) < Math.abs(tofuList[j].position.z + (tofuSizeList[j] / 2) + 0.2) && Math.abs(positionz + (randomsize / 2)) > Math.abs(tofuList[j].position.z - (tofuSizeList[j] / 2) - 0.2))){
                                  overlap = true;
                                }
                              }

                            } while (overlap == true);

                            //give tofu random x and z position
                            //minus to allow negative values
                            t.position.x = 2.2 - randomx;
                            t.position.z = 2.2 - randomz;
                            t.position.y = 1.5;
                            //add current tofu to list of tofus
                            tofuList.push(t);
                            //add tofu to scene
                            scene.add(t);
                          }
                          //set state to scale invariant
                          state = 2;
                      }

          //animation Gaussian simulation
          props.startAnimationGaussian =
                        function() {
                            //drop the tofu piece
                            dropTofu();
                            //create waves in soup
                            waveanimation(0, 0, sizeTofu);
                        }
          //animation Scale invariant simulation
          props.startAnimationScale =
                        function() {
                          //drop tofus
                          dropTofuList();
                          //start waveanimation
                          for(let i = 0; i < tofuList.length; i++) {
                            positionx = tofuList[i].position.x;
                            positiony = tofuList[i].position.y;
                            positionz = tofuList[i].position.z;
                            tofusize = tofuSizeList[i];
                            waveanimation(positionx, positionz, tofusize);
                          }
                        }

          //folder gui for Gaussian simulation
          const guiGaussian = gui.addFolder("Singular tofu (Gaussian)");
          guisize = guiGaussian.add(props, "size", 0.1, 0.4, 0.01) //set size tofu
              .name("Size")
              .listen();
          guisize.onChange(
                  function(newValue) {
                    sizeTofu = newValue; //set size tofu to new value gui
                  }
          )
          guiGaussian.add(props, "initialGaussian") //set initial conditions (Gaussian)
                      .name("Set condition");
          guiGaussian.add(props, "startAnimationGaussian") //start animation (Gaussian)
                      .name("Animation");
          guiGaussian.open();

          //folder gui for Scale invariant simulation
          const guiScale = gui.addFolder("Multiple tofus (Scale Invariant)");
          guinumber = guiScale.add(props, "number", 2, 10, 1) //set number tofus
              .name("Number")
              .listen();
          guinumber.onChange(
                    function(newValue) {
                      numberTofu = newValue; //set number tofus to new value gui
                    }
          )
          guiScale.add(props, "initialScale") //set initial conditions (Scale invariant)
              .name("Set condition");
          guiScale.add(props, "startAnimationScale") //start animation (Scale invariant)
                    .name("Animation");
          guiScale.open();

          //folder for adding ingredients to soup
          const guiIngredients = gui.addFolder("Add Ingredients");
          guiingredient1 = guiIngredients.add(props, "ingredient1", 0, 1, 0.1) //miso paste
              .name("Miso paste")
              .listen();
          guiingredient1.onChange(
                  function(newValue) {
                    i1 = newValue; //set new concentration miso paste

                    //create new material for soup with new colour
                    const newwatermaterial = new THREE.MeshPhysicalMaterial({
                      metalness: 0.5,
                      color: "orange",
                      opacity: (0.5 + 0.5*i1 - 0.5*i2),
                      transparent: true
                    });
                    //remove old soup object
                    scene.remove(mesh[4]);
                    newwatermaterial.side = THREE.DoubleSide;
                    //geometry for new soup object
                    const newwatergeometry = new THREE.CircleGeometry( 14.9, 32 );
                    //create new soup object with new colour
                    const newwatersurface = new THREE.Mesh( newwatergeometry, newwatermaterial );
                    //rotate, reposition and scale new soup object
                    newwatersurface.rotation.x = 1.57;
                    newwatersurface.position.y = -0.5;
                    newwatersurface.scale.set(0.25, 0.25, 0.25);
                    //remove old soup object from array containing components soup
                    mesh.splice(4, 1);
                    //add new soup object to array
                    mesh.push(newwatersurface);
                    //add new soup object to scene
                    scene.add(newwatersurface);
                    renderer.render(scene, camera);


                  }
          )
          guiingredient2 = guiIngredients.add(props, "ingredient2", 0, 1, 0.1) //broth
              .name("Broth")
              .listen();
          guiingredient2.onChange(
                  function(newValue) {
                    i2 = newValue; //set new concentration  broth


                    //create new material new soup
                    const newwatermaterial = new THREE.MeshPhysicalMaterial({
                      metalness: 0.5,
                      color: "orange",
                      opacity: (0.5 + 0.5*i1 - 0.2*i2),
                      transparent: true
                    });
                    //remove old object soup from scene
                    scene.remove(mesh[4]);
                    newwatermaterial.side = THREE.DoubleSide;
                    //new geometry soup
                    const newwatergeometry = new THREE.CircleGeometry( 14.9, 32 );
                    //create new soup object with new colour
                    const newwatersurface = new THREE.Mesh( newwatergeometry, newwatermaterial );
                    //rotate, reposition and scale new soup object
                    newwatersurface.rotation.x = 1.57;
                    newwatersurface.position.y = -0.5;
                    newwatersurface.scale.set(0.25, 0.25, 0.25);
                    //remove old soup object from array containing components soup
                    mesh.splice(4, 1);
                    //add new soup object to array
                    mesh.push(newwatersurface);
                    //add new soup object to scene
                    scene.add(newwatersurface);
                    renderer.render(scene, camera);
                  }
          )
          guiingredient3 = guiIngredients.add(props, "ingredient3", 0, 1, 0.1) //spring onions
              .name("Spring onion")
              .listen();
          guiingredient3.onChange(
                  function(newValue) {
                    i3 = newValue; //set new concentration spring onions

                    //remove previous spring onions from scene
                    for(let i = 0; i < onions.length; i++) {
                      scene.remove(onions[i]);
                    }

                    onions = [];

                    //create new spring onions (amount dependent on selected value)
                    for (let i = 0; i < (i3*20); i++) {

                      //used to ensure size spring onion within desired range
                      var onionflag = false;
                      //random size spring onions
                      var onionsize;

                      while (onionflag == false) {
                        onionsize = Math.random();

                        if(onionsize > 0.08 && onionsize < 0.23) {
                          onionflag = true;
                        }
                      }
                      //create new spring onion
                      var newonion = soupbowl.springonion(onionsize);
                      newonion.position.y = -0.525;

                      //give spring onions random x and z position
                      var onionrandomx = Math.random() * 4;
                      var onionrandomz = Math.random() * 4;
                      //minus to allow negative position values
                      let onionpositionx = 2 - onionrandomx;
                      let onionpositionz = 2 - onionrandomz;

                      newonion.position.x = onionpositionx;
                      newonion.position.z = onionpositionz;
                      //add new spring onion to array containing spring onions
                      onions.push(newonion);
                      //add new spring onion to scene
                      scene.add(newonion);
                      renderer.render(scene, camera);
                    }

                  }
          )

          //reset ingredient parameters
          props.resetParameters =
              function() {
                //reset parameters to default values
                for (const f in gui.__folders) {gui.__folders[f].__controllers.forEach(c => c.setValue(c.initialValue))}

                //remove previous soupsurface
                scene.remove(mesh[4]);
                mesh.splice(4, 1);
                //add new soupsurface
                const newwatergeometry = new THREE.CircleGeometry( 14.9, 32 );
                const newwatermaterial = new THREE.MeshPhysicalMaterial({
                  metalness: 0.5,
                  color: "rgba(255, 165, 0, 1)",
                  opacity: 0.95,
                  transparent: true
                });
                //make surface material double-sided
                newwatermaterial.side = THREE.DoubleSide;
                const newwatersurface = new THREE.Mesh( newwatergeometry, newwatermaterial );
                //rotate, position and scale surface
                newwatersurface.rotation.x = 1.57;
                newwatersurface.position.y = -0.5;
                newwatersurface.scale.set(0.25, 0.25, 0.25);
                //add surface to scene
                scene.add(newwatersurface);
                mesh.push(newwatersurface);
                renderer.render(scene, camera);
              }

          gui.add(props, "resetParameters") //button to reset parameters to default settings
                  .name("Default settings");

          //open folder gui for ingredients
          guiIngredients.open();

          //reset to empty bowl
          props.resetAnimation =
              function() {

                //reset parameters to default values
                scene.remove.apply(scene, scene.children); //remove all elements from scene

                //remove transparent watersurface
                mesh.splice(4, 1);
                //add new soupsurface
                const newwatergeometry = new THREE.CircleGeometry( 14.9, 32 );
                const newwatermaterial = new THREE.MeshPhysicalMaterial({
                  metalness: 0.5,
                  color: "rgba(255, 165, 0, 1)",
                  opacity: 0.95,
                  transparent: true
                });
                //make surface material double-sided
                newwatermaterial.side = THREE.DoubleSide;
                const newwatersurface = new THREE.Mesh( newwatergeometry, newwatermaterial );
                //rotate, position and scale surface
                newwatersurface.rotation.x = 1.57;
                newwatersurface.position.y = -0.5;
                newwatersurface.scale.set(0.25, 0.25, 0.25);
                mesh.push(newwatersurface);

                //add soupbowl back to scene
                for(let i = 0; i < mesh.length; i++){
                  mesh[i].scale.set(0.25, 0.25, 0.25);
                  scene.add(mesh[i]);
                }

                // Set up lights
                const ambientLight =  soupbowl.createambientLight();
                const directionalLight =  soupbowl.createdirectionalLight();
                scene.add(ambientLight);
                scene.add(directionalLight);

                //recreate initial amount of spring onions
                for (let i = 0; i < (i3*20); i++) {

                  //ensures that size spring onions within desired range
                  var onionflag = false;
                  //random size spring onions
                  var onionsize;

                  while (onionflag == false) {
                    onionsize = Math.random();

                    if(onionsize > 0.08 && onionsize < 0.23) {
                      onionflag = true;
                    }
                  }
                  var newonion = soupbowl.springonion(onionsize);
                  newonion.position.y = -0.525;

                  //give spring onions random x and z position
                  var onionrandomx = Math.random() * 4;
                  var onionrandomz = Math.random() * 4;

                  let onionpositionx = 2 - onionrandomx;
                  let onionpositionz = 2 - onionrandomz;

                  newonion.position.x = onionpositionx;
                  newonion.position.z = onionpositionz;

                  //add new springonions to array and scene
                  onions.push(newonion);
                  scene.add(newonion);
                }

              };

              gui.add(props,'resetAnimation') //button to reset animation
                  .name('Reset Animation');

          /*allows rotation / zoom objects with mouse*/
          function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
          }

          animate();

          /*animation of singular tofu falling into soup - used for Gaussian
           initial conditions */
          function dropTofu() {
            tofu.position.y -= 0.03; //move tofu slightly downwards
            renderer.render(scene, camera);

            //stop animation when tofu reached close below soup surface
            if(tofu.position.y >= -0.52) {
              requestAnimationFrame(dropTofu);
            }

          }

          /*animation of multiple tofus falling into soup - used for scale
          invariant initial conditions*/
          function dropTofuList() {
            //move all tofus slightly downwards
            for (let i=0; i < tofuList.length; i++) {
              tofuList[i].position.y -= 0.03;
            }

            renderer.render(scene, camera);
            //stop when tofus reach close below soup surface
            if(tofuList[0].position.y >= -0.52) {
              requestAnimationFrame(dropTofuList);
            }
          }

          /*make soup transparent after simulation ended*/
          function soupTransparent() {
            //remove previous soupsurface
            scene.remove(mesh[4]);
            mesh.splice(4, 1);
            //add new transparent soupsurface
            const newwatergeometry = new THREE.CircleGeometry( 14.9, 32 );
            const newwatermaterial = new THREE.MeshPhysicalMaterial({
              metalness: 0,
              color: "orange",
              opacity: 0.01, //determines how transparent surface
              transparent: true
            });
            //make surface material double-sided
            newwatermaterial.side = THREE.DoubleSide;
            const newwatersurface = new THREE.Mesh( newwatergeometry, newwatermaterial );
            //rotate, position and scale surface
            newwatersurface.rotation.x = 1.57;
            newwatersurface.position.y = -0.5;
            newwatersurface.scale.set(0.25, 0.25, 0.25);
            //add surface to scene
            scene.add(newwatersurface);
            mesh.push(newwatersurface);
            //console.log(mesh.length);
            renderer.render(scene, camera);
          }



          /*draw outgoing waves as lines (scale invariant)*/
          function drawWavesold(radius, positionx, positionz, minus, radialDistance) {
            //material used for drawing waves
            const linematerial = new THREE.LineBasicMaterial( { color: "orange"} );
            linematerial.linewidth = 2;
            //array for saving points that determine wave shape
            const points = [];
            //x and z coordinates points
            var x;
            var z;

            //angle by which want wave ring to rotate (opening)
            var angle;
            if((positionx > 0) && (positionz > 0)) {
              angle = Math.asin(positionz/radialDistance);
            } else if ((positionx > 0) && (positionz < 0)) {
              angle = Math.asin(positionz/radialDistance);
            } else if ((positionx < 0) && (positionz > 0)) {
              angle = 3.14 - Math.asin(positionz/radialDistance);
            } else {
              angle = 3.14 - Math.asin(positionz/radialDistance);
            }

            //add points determining wave shape (part of circle)
            for (let i = (angle*100)+minus; i < (628+ (angle*100)-minus); i++) {
              x = radius*Math.cos(i*0.01) + positionx;
              z = radius*Math.sin(i*0.01) + positionz;
              points.push( new THREE.Vector3( x, -0.5, z ) );
            }

            //create line
            const linegeometry = new THREE.BufferGeometry().setFromPoints( points );
            const line = new THREE.Line( linegeometry, linematerial );
            //add line to array saving current new lines
            lineList.push(line);
            //add line to scene
            scene.add(line);
            renderer.render(scene, camera);
          }

          /*draws new waves at opposite side bowl (scale invariant)*/
          function drawNewWaves(radius, positionx, positionz, plus, radialDistance, positionxnew, positionznew, opacity) {

            //material used for drawing waves
              const linematerial = new THREE.MeshPhysicalMaterial({
                metalness: 0,
                color: "orange",
                transparent: true
              });
              linematerial.linewidth = 2;
              linematerial.opacity = opacity;

              //array for saving points that determine wave shape
              const points = [];
              //x and z coordinates points
              var x;
              var z;

              //angle by which want wave to rotate (opening)
              var angle;
            if((positionx > 0) && (positionz > 0)) {
                angle = Math.asin(positionz/radialDistance);
            } else if ((positionx > 0) && (positionz < 0)) {
                angle = Math.asin(positionz/radialDistance);
            } else if ((positionx < 0) && (positionz > 0)) {
              angle = 3.14 - Math.asin(positionz/radialDistance);
            } else {
              angle = 3.14 - Math.asin(positionz/radialDistance);
            }

            //add points determining wave shape (part of circle)
            for (let i = (angle*100)-plus; i < ((angle*100)+plus); i++) {
              x = radius*Math.cos(i*0.01) + positionxnew;
              z = radius*Math.sin(i*0.01) + positionznew;
              points.push( new THREE.Vector3( x, -0.5, z ) );
            }

            //create line
            const linegeometry = new THREE.BufferGeometry().setFromPoints( points );
            const newline = new THREE.Line( linegeometry, linematerial );
            //add line to array saving current new waves
            newlineList.push(newline);
            //add line to scene
            scene.add(newline);
            renderer.render(scene, camera);


        }


          /*main function for animation waves*/
          function waveanimation(positionx, positionz, tofusize) {

            //number wavefronts produced (depending on tofu size)
            if(tofusize <= 0.15) {
              numberwaves = 1;
            } else if(tofusize <= 0.2) {
              numberwaves = 2;
            } else {
              numberwaves = 3;
            }

            //keeps track of how often function called
            var counter = 1;
            //clock to keep time for animation
            clock = new THREE.Clock;

            //arrays used to store information about waves
            let waveList = []; //stores waves for a single tofu
            let newwaveList = []; //stores reflected waves (scale invariant)
            let counterList = []; //stores counter for individual wavefronts
            var minus; //determines how quickly outgoing waves disappear
            let plusList = []; //determines how quickly new waves come in

            let positionxlist = []; //list to store x-coordinates positions
            let positionzlist = []; //list to store z-coordinates positions


            //list that shows if wave has reached edge gaussian
            let flagList = [];
            //list saving opacities
            let opacityList = [];

            //determine end time simulation (when decoupling) -> more tofus later end time; more miso (i1) later end time
            var tend = 10 + 2*i1;

            var tfrac; //t/tend


            //viscosity (miso paste (i1) and spring onions (i3) increase, broth (i2) descreases viscosity)
            var visc = 1 + 1*i1 - 0.8*i2 + 0.5*i3;
            //damping coefficient (contribution viscosity experimental value)
            var damping = 0.00015 + 0.0001*visc;

            //geometry and material used for the waves
            const geometry = new THREE.TorusGeometry( (0.2+tofusize), 0.003, 16, 100);
            const material = new THREE.MeshPhysicalMaterial({
              metalness: 0,
              color: "orange",
              opacity: 1,
              transparent: true
            });

            drawWaves();

            /*function responsible for drawing waves / animation*/
            function drawWaves() {
              //get elapsed time
              var t = clock.getElapsedTime();
              var positionxnew;
              var positionznew;

              //only create waves once tofu in soup (time value experimental)
              if (t > 0.85){

              //add new wavefronts in predefined periods
              if ((waveList.length < numberwaves) && (counter%50 == 0)) {
                //new wavefront
                const torus = new THREE.Mesh( geometry, material );
                torus.rotation.x = 1.57;
                torus.position.y = -0.5;
                torus.scale.z = 1.5;
                torus.position.x = positionx;
                torus.position.z = positionz;
                scene.add(torus);
                //add new wavefront to list for waves
                waveList.push(torus);
                counterList.push(0);
                flagList.push(false);
                opacityList.push(1);
              }

              //IMPORTANT: ROTATION TORUS MEANS Y BECOMES Z
              //propagate waves by rescaling individual objects
              for (let i=0; i < waveList.length; i++) {

                //distance tofu from centre bowl
                let radialDistance = Math.sqrt((Math.pow(positionx, 2)) + (Math.pow(positionz, 2)));
                //distance between tofu and edge soupbowl
                let help = radialDistance + ((0.2+tofusize)*(waveList[i].scale.x));
                //if wavefront hasn't reached soupbowl yet
                if(help < 3.58 && flagList[i]==false){
                  //rescale waves (make them bigger)
                  waveList[i].scale.x = waveList[i].scale.x+(t/460)-((visc*t)/1350);
                  waveList[i].scale.y = waveList[i].scale.y+(t/460)-((visc*t)/1350);

                  //reduce opacity over time to simulate damping
                  if(material.opacity > 0) {
                    material.opacity = material.opacity * Math.pow(Math.E, (-damping*t)); //exponential damping
                  }

                } else {

                  //Gaussian initial state
                  if(state == 1) {
                    flagList[i] = true; //flag that waves has reached soupbowl
                    //rescale waves (make smaller)
                    waveList[i].scale.x = waveList[i].scale.x-(t/460)+((visc*t)/1350);
                    waveList[i].scale.y = waveList[i].scale.y-(t/460)+((visc*t)/1350);

                    //fraction of end time that has passed
                    tfrac = t/tend;

                    if(waveList[i].scale.z > 0) {
                      waveList[i].scale.z = waveList[i].scale.z - (tfrac/80) + ((visc*t)/300);
                    }

                    //reduce opacity over time to simulate damping
                    if(material.opacity > 0) {
                      material.opacity = material.opacity * Math.pow(Math.E, (-0.1*damping*t));


                    }

                  } else if (state==2) { //scale invariant initial conditions
                    if(counterList[i] == 0) { //first instance after wave reached wall
                      //get time when this called
                      var tnew = clock.getElapsedTime();
                      //remove old wave from scene
                      scene.remove(waveList[i]);
                      //create new wave (line)
                      newwaveList.push(1);
                      plusList.push(0);

                        //get position where wave touches wall
                        //get angle
                        sina = Math.abs(positionz)/radialDistance;
                        cosa = Math.abs(positionx)/radialDistance;

                        //get absolute position where wave touches wall
                        positionxnew = Math.abs(positionx) + cosa*(0.2+tofusize)*(waveList[i].scale.x);
                        positionznew = Math.abs(positionz) + sina*(0.2+tofusize)*(waveList[i].scale.y);

                        //get new position
                        if(positionx > 0) {
                          positionxnew = (-positionxnew) - cosa*(0.2+tofusize)*(waveList[i].scale.x);
                        } else {
                          positionxnew = positionxnew + cosa*(0.2+tofusize)*(waveList[i].scale.x);
                        }
                        if(positionz > 0) {
                          positionznew = (-positionznew)- sina*(0.2+tofusize)*(waveList[i].scale.y);
                        } else {
                          positionznew = positionznew + sina*(0.2+tofusize)*(waveList[i].scale.y);
                        }

                      positionxlist.push(positionxnew);
                      positionzlist.push(positionznew);


                    } else {
                      //remove old wave from scene and array
                      scene.remove(lineList[i]);
                      lineList.splice(i, 1);
                      scene.remove(newlineList[i]);
                      newlineList.splice(i, 1);

                    }
                    //radius wave
                    let newradius = (0.2+tofusize)*(waveList[i].scale.x);
                    //amount by which wave reduced
                    minus = counterList[i]*24 + 2*radialDistance - Math.pow(0.15, counterList[i]);

                    //amount by which added to new wave (experimental values)
                    if(plusList[i] == 0) {
                      plusList[i] =  0.2*radialDistance + 2 - visc*0.7;
                    } else if((newradius) < (4.3 - radialDistance)) {
                        plusList[i] = plusList[i] + 0.68 - Math.pow(0.73, counterList[i]) - 0.31*visc;
                    } else if ((newradius) < (4.4 - radialDistance)) {
                        plusList[i] = plusList[i] + Math.pow(0.9973, counterList[i]) - 0.08*visc ;
                    } else {
                      plusList[i] = plusList[i] + 0.21 - Math.pow(0.99125, counterList[i]) - 0.1*visc;
                    }

                    //reduce opacity to simulate damping
                    if(opacityList[i] > 0) {
                      opacityList[i] = opacityList[i] * Math.pow(Math.E, (-damping*t));

                    }

                    //draw outgoing waves
                    drawWavesold(newradius, positionx, positionz, minus, radialDistance);
                    //draw incoming waves
                    drawNewWaves(newradius, positionx, positionz, plusList[i], radialDistance, positionxlist[i], positionzlist[i], opacityList[i]);
                    counterList[i] = counterList[i] + 1; //increase counter
                    waveList[i].scale.x = waveList[i].scale.x+(t/460) - ((visc*t)/1350); //rescale old waves
                    newwaveList[i] = newwaveList[i] + ((t - tnew)/80); //rescale new waves
                  }
                }

              }
                renderer.render(scene, camera);
                counter += 1;
              }

              //stop animation once certain time has elapsed
              if(t < tend) {
                requestAnimationFrame(drawWaves);
              } else {
                soupTransparent();//make soup transparent once time has ended
              }
            }
          }
        }

        /*Create tofu piece*/
        soupbowl.createTofu = function() {
          //geometry and material tofu object
          const geometry = new THREE.CubeGeometry(2, 1, 2);
          const material = new THREE.MeshLambertMaterial({ color: "rgba(255, 220, 162, 1)" });
          //create tofu object
          const tofu = new THREE.Mesh(geometry, material);
          //position tofu above soup bowl
          tofu.position.y = 2.0;
          return tofu;
        }

        /*Create 3D soupbowl*/
        soupbowl.createBowl = function() {
          let bowl = [];
          //body of the bowl
          const points = [];
          for ( let i = 0; i < 10; i ++ ) {
	           points.push( new THREE.Vector2( Math.sin( i * 0.21 ) * 10 + 4.4, ( i - 5.4 ) * 1 ) );
          }
          //inner body bowl (make thicker)
          const points2 = [];
          for ( let i = 0; i < 10; i ++ ) {
	           points2.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 10 + 4.4, ( i - 5.4 ) * 1 ) );
          }

          //inner body bowl 2 (make thicker)
          const points3 = [];
          for ( let i = 0; i < 10; i ++ ) {
	           points3.push( new THREE.Vector2( Math.sin( i * 0.23 ) * 10 + 5.2, ( i - 5.4 ) * 1 ) );
          }

          var segments = 60;
          //geometry and material bowl body
          const bodygeometry = new THREE.LatheGeometry( points, segments);
          const bodygeometry2 = new THREE.LatheGeometry( points2, segments);
          const bodygeometry3 = new THREE.LatheGeometry( points3, segments);
          const material = new THREE.MeshPhysicalMaterial( { color: "saddlebrown" } );
          material.reflectivity = 0.3;
          material.thickness = 10;
          //make material double-sided
          material.side = THREE.DoubleSide;
          //create objects for bowl
          const bowlbody = new THREE.Mesh( bodygeometry, material );
          const bowlbody2 = new THREE.Mesh( bodygeometry2, material );
          const bowlbody3 = new THREE.Mesh( bodygeometry3, material );

          //bottom part of bowl
          const bottomgeometry = new THREE.CircleGeometry( 5.18, 32 );
          const bowlbottom = new THREE.Mesh( bottomgeometry, material );
          bowlbottom.rotation.x = 1.57;
          bowlbottom.position.y = -1.35;

          //water part bowl
          const watergeometry = new THREE.CircleGeometry( 14.9, 32 );

          const watermaterial = new THREE.MeshPhysicalMaterial({
            metalness: 0.5,
            color: "rgba(255, 165, 0, 1)",
            opacity: 0.95,
            transparent: true
          });

          watermaterial.side = THREE.DoubleSide;
          //create object soupsurface
          const watersurface = new THREE.Mesh( watergeometry, watermaterial );
          watersurface.rotation.x = 1.57;
          watersurface.position.y = 0.5;
          //add individual parts to list for bowl pieces
          bowl.push(bowlbody);
          bowl.push(bowlbody2);
          bowl.push(bowlbody3);
          bowl.push(bowlbottom);
          bowl.push(watersurface);

          return bowl;
        }

        /*Create ambient light*/
        soupbowl.createambientLight = function() {
          const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
          return ambientLight;

        }

        /*Create directional Light*/
        soupbowl.createdirectionalLight = function() {
          const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
          directionalLight.position.set(-5, 7, 5); // x, y, z
          return directionalLight;

        }

        /*Create camera*/
        soupbowl.createCamera = function() {
          const width = 10;
          const height = width * (window.innerHeight / window.innerWidth);
          const camera = new THREE.OrthographicCamera(
            width / -2, // left
            width / 2, // right
            height / 2, // top
            height / -2, // bottom
            1, // near
            100 // far
          );

          camera.position.set(40, 30, 75);
          camera.lookAt(0, 0, 0);

          return camera;

        }

        /*Create renderer*/
        soupbowl.createRenderer = function() {
          const renderer = new THREE.WebGLRenderer({ antialias: true });
          renderer.setSize(700, 600);
          return renderer;
        }

        /*create spring onion of given size*/
        soupbowl.springonion = function(size) {
          //geometry spring onion
          const oniongeometry = new THREE.CylinderGeometry( size, size, 0.1, 32, 4, true, 0, 6.28);
          //material spring onion
          const onionmaterial = new THREE.MeshPhysicalMaterial({
            color: "green",
          });
          //make material double-sided
          onionmaterial.side = THREE.DoubleSide;
          //create new spring onion object
          const onion = new THREE.Mesh( oniongeometry, onionmaterial );
          return onion;
        }

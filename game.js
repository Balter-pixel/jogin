import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js';

import { PointerLockControls } from 'https://cdn.jsdelivr.net/npm/three@0.160/examples/jsm/controls/PointerLockControls.js';

// LOADING

let progress = 0;

const loading = setInterval(()=>{

  progress += 5;

  document.getElementById(
    "loadingProgress"
  ).style.width = progress + "%";

  if(progress >= 100){

    clearInterval(loading);

    document.getElementById(
      "loadingScreen"
    ).style.display = "none";

    document.getElementById(
      "menu"
    ).style.display = "block";
  }

},100);

// SCENE

const scene = new THREE.Scene();

scene.background =
new THREE.Color(0x87ceeb);

// CAMERA

const camera =
new THREE.PerspectiveCamera(
  75,
  window.innerWidth/window.innerHeight,
  0.1,
  5000
);

// RENDERER

const renderer =
new THREE.WebGLRenderer({
  antialias:true
});

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

renderer.shadowMap.enabled = true;

document.body.appendChild(
  renderer.domElement
);

// LIGHT

const sun =
new THREE.DirectionalLight(
  0xffffff,
  2
);

sun.position.set(
  300,
  500,
  100
);

scene.add(sun);

// CONTROLS

const controls =
new PointerLockControls(
  camera,
  document.body
);

scene.add(
  controls.getObject()
);

document.getElementById(
  "startBtn"
).onclick = ()=>{
  controls.lock();
};

// PLAYER

camera.position.set(
  0,
  10,
  40
);

const velocity =
new THREE.Vector3();

const direction =
new THREE.Vector3();

const keys = {};

let stamina = 100;
let life = 100;
let xp = 0;
let level = 1;
let score = 0;

// KEYBOARD

document.addEventListener(
  "keydown",
  e=>{

    keys[e.key.toLowerCase()] = true;
  }
);

document.addEventListener(
  "keyup",
  e=>{

    keys[e.key.toLowerCase()] = false;
  }
);

// GROUND

const ground =
new THREE.Mesh(

  new THREE.PlaneGeometry(
    4000,
    4000
  ),

  new THREE.MeshStandardMaterial({
    color:0x228822
  })
);

ground.rotation.x =
-Math.PI/2;

scene.add(ground);

// CRYSTALS

const crystals = [];

for(let i=0;i<100;i++){

  const crystal =
  new THREE.Mesh(

    new THREE.OctahedronGeometry(3),

    new THREE.MeshStandardMaterial({
      color:0x00ffff,
      emissive:0x00ffff
    })
  );

  crystal.position.set(

    (Math.random()-0.5)*3000,

    8,

    (Math.random()-0.5)*3000
  );

  scene.add(crystal);

  crystals.push(crystal);
}

// MOVE

function move(delta){

  const speed =
  keys["shift"] ? 180 : 80;

  direction.z =
  Number(keys["w"]) -
  Number(keys["s"]);

  direction.x =
  Number(keys["d"]) -
  Number(keys["a"]);

  direction.normalize();

  velocity.x -=
  velocity.x*8*delta;

  velocity.z -=
  velocity.z*8*delta;

  if(keys["w"]||keys["s"]){

    velocity.z -=
    direction.z *
    speed *
    delta;
  }

  if(keys["a"]||keys["d"]){

    velocity.x -=
    direction.x *
    speed *
    delta;
  }

  controls.moveRight(
    -velocity.x*delta
  );

  controls.moveForward(
    -velocity.z*delta
  );
}

// CLOCK

const clock =
new THREE.Clock();

// ANIMATE

function animate(){

  requestAnimationFrame(
    animate
  );

  const delta =
  clock.getDelta();

  move(delta);

  crystals.forEach(
    (c,index)=>{

      c.rotation.y += 0.03;

      if(

        camera.position.distanceTo(
          c.position
        ) < 10
      ){

        scene.remove(c);

        crystals.splice(index,1);

        score++;

        document.getElementById(
          "score"
        ).innerText = score;
      }
    }
  );

  renderer.render(
    scene,
    camera
  );
}

animate();

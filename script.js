let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth/window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("scene").appendChild(renderer.domElement);

let light = new THREE.PointLight(0x00f7ff, 1.5);
light.position.set(10, 10, 10);
scene.add(light);

let starGeometry = new THREE.BufferGeometry();
let positions = [];

for (let i = 0; i < 2000; i++) {
  positions.push((Math.random() - 0.5) * 200);
  positions.push((Math.random() - 0.5) * 200);
  positions.push((Math.random() - 0.5) * 200);
}

starGeometry.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(positions, 3)
);

let starMaterial = new THREE.PointsMaterial({ color: 0xffffff });
let stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

let scrollY = 0;

window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
});

function animate() {
  requestAnimationFrame(animate);

  camera.position.z = 5 + scrollY * 0.01;
  camera.position.y = -scrollY * 0.002;

  renderer.render(scene, camera);
}

animate();

/* WINSTON COMMAND — panoramic Three.js architecture, purely decorative. */
(async()=>{
 const stage=document.getElementById('networkStage'),shell=stage?.querySelector('.winston-room-shell');
 if(!stage||!shell||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 let THREE;
 try{THREE=await import('https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js');}
 catch(err){console.warn('WINSTON room: CSS fallback',err);return;}
 let renderer;
 try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}
 catch(err){console.warn('WINSTON room: WebGL unavailable',err);return;}
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
 renderer.setClearColor(0,0);
 renderer.domElement.setAttribute('aria-hidden','true');
 renderer.domElement.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0';
 shell.prepend(renderer.domElement);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(48,1,.1,100);
 camera.position.set(0,2.2,12.8);camera.lookAt(0,0,0);
 const solid=(color,opacity=1)=>new THREE.MeshBasicMaterial({color,transparent:opacity<1,opacity,side:THREE.DoubleSide,depthWrite:opacity===1});
 const line=(pts,color,opacity=.9)=>{const geometry=new THREE.BufferGeometry().setFromPoints(pts.map(p=>new THREE.Vector3(...p)));const obj=new THREE.Line(geometry,new THREE.LineBasicMaterial({color,transparent:true,opacity}));scene.add(obj);return obj;};
 const wall=new THREE.Mesh(new THREE.CylinderGeometry(11,11,6,96,1,true,Math.PI*.11,Math.PI*.78),solid(0x05142e,.82));
 wall.rotation.y=Math.PI;wall.position.set(0,.35,-3);scene.add(wall);
 const arch=new THREE.Group();scene.add(arch);
 for(let h of [-2.4,-1.15,.15,1.5,2.65]){
  const pts=[];for(let i=0;i<=100;i++){const a=Math.PI*.11+Math.PI*.78*i/100;pts.push([11*Math.cos(a),h+.35,-3-11*Math.sin(a)]);}
  const geometry=new THREE.BufferGeometry().setFromPoints(pts.map(p=>new THREE.Vector3(...p)));
  const strip=new THREE.Line(geometry,new THREE.LineBasicMaterial({color:h===1.5?0xff35ca:0x12dfff,transparent:true,opacity:h===-2.4?.95:.48}));arch.add(strip);
 }
 for(let i=0;i<=16;i++){
  const a=Math.PI*.11+Math.PI*.78*i/16;
  line([[11*Math.cos(a),-2.05,-3-11*Math.sin(a)],[11*Math.cos(a),3,-3-11*Math.sin(a)]],i%4===0?0xff35ca:0x067fa6,i%4===0?.45:.16);
 }
 const ceiling=new THREE.Mesh(new THREE.PlaneGeometry(28,9),solid(0x030b20,.75));
 ceiling.rotation.x=Math.PI/2;ceiling.position.y=3.25;scene.add(ceiling);
 for(let i=0;i<13;i++){
  const z=-12+i*.85;
  line([[-10,3.21,z],[10,3.21,z]],i%3===0?0xff35ca:0x12dfff,i%3===0?.48:.24);
 }
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(32,30),solid(0x020817,.91));
 floor.rotation.x=-Math.PI/2;floor.position.y=-2.6;scene.add(floor);
 for(let i=-12;i<=12;i+=2){line([[i,-2.58,-15],[i,-2.58,10]],0x0b7f9c,.24);}
 for(let z=-14;z<=10;z+=2){line([[-15,-2.58,z],[15,-2.58,z]],0x0b7f9c,.2);}
 const reflection=new THREE.Mesh(new THREE.CircleGeometry(4.1,96),new THREE.MeshBasicMaterial({color:0x00bfff,transparent:true,opacity:.075,depthWrite:false}));
 reflection.rotation.x=-Math.PI/2;reflection.position.set(0,-2.57,-1);scene.add(reflection);
 for(let side of [-1,1]){
  const panel=new THREE.Mesh(new THREE.PlaneGeometry(3.8,4.1),solid(0x072749,.45));
  panel.position.set(side*5.6,.2,-4.2);panel.rotation.y=-side*.34;scene.add(panel);
  for(let i=0;i<7;i++){
   const x=side*5.6, y=-1.25+i*.47;
   line([[x-1.6,y,-4.1],[x+1.6,y,-4.1]],i%3===0?0xff35ca:0x12dfff,.3);
  }
 }
 let frame=0,last=0,visible=true;
 const resize=()=>{const w=shell.clientWidth||1200,h=shell.clientHeight||640;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};
 resize();const observer=new ResizeObserver(resize);observer.observe(shell);
 const io=new IntersectionObserver(entries=>visible=!!entries[0]?.isIntersecting);io.observe(shell);
 const tick=t=>{frame=requestAnimationFrame(tick);if(!visible||document.hidden||t-last<50)return;last=t;reflection.material.opacity=.07+.012*Math.sin(t*.0007);renderer.render(scene,camera);};
 try{renderer.render(scene,camera);shell.classList.add('winston-room-webgl-active');}catch(err){console.warn('WINSTON room: fallback',err);renderer.domElement.remove();renderer.dispose();return;}
 frame=requestAnimationFrame(tick);
 addEventListener('pagehide',()=>{cancelAnimationFrame(frame);observer.disconnect();io.disconnect();renderer.dispose();},{once:true});
})();
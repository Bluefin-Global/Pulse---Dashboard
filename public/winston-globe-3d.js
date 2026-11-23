/* WINSTON COMMAND — progressive WebGL holographic globe. No Firebase writes. */
(async()=>{
 const host=document.getElementById('winston3dGlobe');
 if(!host||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 let THREE;
 try{THREE=await import('https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js');}
 catch(err){console.warn('WINSTON: CSS globe fallback (module unavailable)',err);return;}
 let renderer;
 try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}
 catch(err){console.warn('WINSTON: CSS globe fallback (WebGL unavailable)',err);return;}
 if(!host.isConnected){renderer.dispose();return;}
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(39,1,.1,50);
 camera.position.z=6.5;
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
 renderer.setClearColor(0,0);host.appendChild(renderer.domElement);
 const map=document.createElement('canvas');map.width=1024;map.height=512;
 const ctx=map.getContext('2d'),gradient=ctx.createLinearGradient(0,0,0,512);
 gradient.addColorStop(0,'#06457a');gradient.addColorStop(.5,'#052447');gradient.addColorStop(1,'#010a26');
 ctx.fillStyle=gradient;ctx.fillRect(0,0,1024,512);
 ctx.lineWidth=1;ctx.strokeStyle='rgba(0,234,255,.23)';
 for(let x=0;x<1024;x+=64){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,512);ctx.stroke();}
 for(let y=0;y<512;y+=64){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(1024,y);ctx.stroke();}
 const shapes=[
 [[90,125],[119,82],[174,67],[224,85],[256,119],[230,158],[196,177],[176,225],[144,245],[126,198],[96,179]],
 [[211,246],[248,257],[281,298],[271,341],[255,377],[232,432],[202,470],[184,435],[193,386],[174,344],[178,289]],
 [[455,106],[502,79],[562,88],[604,69],[681,82],[751,111],[831,114],[892,146],[853,182],[786,178],[744,218],[684,207],[631,243],[583,210],[524,182],[477,184]],
 [[500,235],[568,218],[624,246],[657,293],[625,357],[583,419],[548,447],[504,399],[479,332]],
 [[776,355],[840,335],[896,361],[880,407],[822,427],[781,393]]];
 ctx.shadowColor='#00eaff';ctx.shadowBlur=12;ctx.lineWidth=3;
 for(const points of shapes){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle='rgba(0,224,245,.52)';ctx.strokeStyle='#7cfaff';ctx.fill();ctx.stroke();}
 const texture=new THREE.CanvasTexture(map);texture.colorSpace=THREE.SRGBColorSpace;
 const earth=new THREE.Mesh(new THREE.SphereGeometry(1.6,64,48),new THREE.MeshPhongMaterial({map:texture,emissive:0x053954,emissiveIntensity:.42,shininess:85}));
 scene.add(earth);scene.add(new THREE.AmbientLight(0x8acfff,1.7));
 const key=new THREE.PointLight(0x58eaff,90);key.position.set(-3,3,5);scene.add(key);
 const rim=new THREE.PointLight(0xff2dd4,48);rim.position.set(3,-2,3);scene.add(rim);
 const rings=[[0x00eaff,-.35],[0xff2dd4,.4]].map(([color,tilt])=>{
  const mesh=new THREE.Mesh(new THREE.TorusGeometry(1.99,.013,8,160),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.9,depthWrite:false}));
  mesh.rotation.x=1.1;mesh.rotation.y=tilt;scene.add(mesh);return mesh;
 });
 const resize=()=>{const width=host.clientWidth||300,height=host.clientHeight||300;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();};
 resize();
 const observer=new ResizeObserver(resize);observer.observe(host);
 const fallback=host.parentElement.querySelector('.winston-globe__sphere');
 const oldRings=host.parentElement.querySelectorAll('.winston-globe__orbit');
 if(fallback)fallback.style.visibility='hidden';oldRings.forEach(el=>el.style.visibility='hidden');
 let visible=true,frame=0,last=0;
 const visibility=new IntersectionObserver(entries=>{visible=!!entries[0]?.isIntersecting;});visibility.observe(host);
 const animate=t=>{frame=requestAnimationFrame(animate);if(!visible||document.hidden||t-last<32)return;last=t;earth.rotation.y+=.003;rings[0].rotation.z+=.001;rings[1].rotation.z-=.001;renderer.render(scene,camera);};
 frame=requestAnimationFrame(animate);
 addEventListener('pagehide',()=>{cancelAnimationFrame(frame);observer.disconnect();visibility.disconnect();texture.dispose();renderer.dispose();},{once:true});
})();
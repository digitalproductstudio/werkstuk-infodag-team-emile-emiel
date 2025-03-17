import{FilesetResolver as Se,GestureRecognizer as qe,DrawingUtils as Fe}from"https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))t(l);new MutationObserver(l=>{for(const i of l)if(i.type==="childList")for(const f of i.addedNodes)f.tagName==="LINK"&&f.rel==="modulepreload"&&t(f)}).observe(document,{childList:!0,subtree:!0});function r(l){const i={};return l.integrity&&(i.integrity=l.integrity),l.referrerPolicy&&(i.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?i.credentials="include":l.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function t(l){if(l.ep)return;l.ep=!0;const i=r(l);fetch(l.href,i)}})();function we(e,o){return Array(e).fill(null).map(()=>Array(o).fill(0))}function Me(e,o,r,t){const l=[[0,1],[1,0],[1,1],[1,-1]],i=e.length,f=e[0].length;for(const[g,c]of l){let u=1,n=[{row:o,col:r}];for(let s=1;s<=3;s++){const A=o+s*g,d=r+s*c;if(A<0||A>=i||d<0||d>=f||e[A][d]!==t)break;u++,n.push({row:A,col:d})}for(let s=1;s<=3;s++){const A=o-s*g,d=r-s*c;if(A<0||A>=i||d<0||d>=f||e[A][d]!==t)break;u++,n.push({row:A,col:d})}if(u>=4)return n}return null}function $(e,o,r){return(e-o*r)/2}function te(e,o,r){return e-o*r-o/2}function ye(e,o,r,t,l){const{rows:i,cols:f,cellSize:g}=r;if(o<0||o>=f)return null;for(let c=i-1;c>=0;c--)if(e[c][o]===0){const u=$(t,g,f),n=te(l,g,i),s=u+o*g+g/2,A=n+c*g+g/2;return{row:c,col:o,x:s,y:A}}return null}function Te(e,o,r,t){const l=.05+Math.random()*.15,i=Math.random()*Math.PI*2;return{x:e.x,y:e.y,targetX:o.x,targetY:o.y,radius:r,color:e.color,speed:0,acceleration:.5,row:o.row,col:o.col,player:t,rotation:0,rotationSpeed:l,finalRotation:i,type:e.type}}function Re(e){e.speed+=e.acceleration,e.y+=e.speed;const o=e.targetX-e.x;if(e.x+=o*.2,e.rotation+=e.rotationSpeed,e.targetY-e.y<e.radius*4){const t=e.finalRotation-e.rotation;e.rotation+=t*.1,e.rotationSpeed*=.9}return e.y>=e.targetY}function Be(e){e.visible=!1}function Ge(e,o,r,t,l,i,f){const g=ye(r,t,l,i,f);g&&t>=0&&t<l.cols?(e.x=g.x,e.y=g.y,e.row=g.row,e.col=g.col,e.visible=!0,e.type=o.type,o.type==="bomb"?e.color=o.color==="#ef7d00"?"rgba(239, 125, 0, 0.5)":"rgba(0, 154, 212, 0.5)":e.color=o.color==="#ef7d00"?"rgba(239, 125, 0, 0.3)":"rgba(0, 154, 212, 0.3)"):e.visible=!1}function Ye(e,o,r,t,l,i){if(e<0||e>=r.cols)return null;const f=ye(o,e,r,t.canvasWidth,t.canvasHeight);return f?Te(l,f,r.discRadius,i):null}function Pe(e,o,r){const t=e.length,l=e[0].length,i=[],f=[[-1,-1],[-1,0],[-1,1],[0,-1],[0,0],[0,1],[1,-1],[1,0],[1,1]];for(const[g,c]of f){const u=o+g,n=r+c;u>=0&&u<t&&n>=0&&n<l&&e[u][n]!==0&&(i.push({row:u,col:n}),e[u][n]=0)}return i}function ke(e,o,r,t,l,i){const f=[],g=e.length,c=e[0].length;for(let u=0;u<c;u++){let n=-1;for(let s=g-1;s>=0;s--)if(e[s][u]===0&&n===-1)n=s;else if(e[s][u]!==0&&n!==-1){e[n][u]=e[s][u],r[n][u]=r[s][u],t[n][u]=t[s][u],e[s][u]=0,r[s][u]=null,t[s][u]=null;const A=l+u*o.cellSize+o.cellSize/2,d=i+n*o.cellSize+o.cellSize/2;f.push({from:{row:s,col:u},to:{row:n,col:u,x:A,y:d}}),n--}}return f}const Oe="/assets/bomb-Bwc9CxYB.png";let v="landing",j=0;const be=2e3;let le=0,T=!1,ee=null,Ae=0;const fe=15e3;let K={1:1,2:1},R=!1,P=[];function Qe(e){v=e}function ze(e){T=e}function We(e){ee=e}function De(e){return Ae+=e,Ae}function He(){Ae=0}let E=1,M,U,X,Z=[],h,_,b=null;function Ke(e,o){M=we(e.rows,e.cols),U=Array(e.rows).fill(null).map(()=>Array(e.cols).fill(null)),X=Array(e.rows).fill(null).map(()=>Array(e.cols).fill(null)),h={x:E===1?o*.75:o*.25,y:e.cellSize/2,radius:e.discRadius,isGrabbed:!1,color:"#ef7d00",type:"normal"},_={x:0,y:0,row:-1,col:-1,radius:e.discRadius,visible:!1,color:"rgba(0, 0, 0, 0)",type:"normal"},K={1:1,2:1},R=!1,P=[],Ue()}function Ue(){b=new Image,b.src=Oe,b.onerror=()=>{console.error("Error loading bomb image"),b=null}}function ue(e,o){M=we(e.rows,e.cols),U=Array(e.rows).fill(null).map(()=>Array(e.cols).fill(null)),X=Array(e.rows).fill(null).map(()=>Array(e.cols).fill(null)),T=!1,E=1,Z=[],ee=null,He(),K={1:1,2:1},R=!1,P=[],h={x:o*.75,y:e.cellSize/2,radius:e.discRadius,isGrabbed:!1,color:"#ef7d00",type:"normal"}}function Xe(){v="game",j=0,le=0}function Le(e){E=E===1?2:1;const o=E===1?e*.75:e*.25;h.color=E===1?"#ef7d00":"#009ad4",h.x=o,h.y=h.radius+5,R=!1,h.type="normal"}function Ve(){return K[E]>0?(R=!R,h.type=R?"bomb":"normal",_.type=h.type,!0):!1}function Je(){K[E]>0&&(K[E]--,R=!1)}function Ne(e,o,r){const t=r===1?"#ff7700":"#00a2ff";P.push({x:e,y:o,radius:0,maxRadius:80,alpha:1,color:t,player:r})}function je(e){for(let o=P.length-1;o>=0;o--){const r=P[o];r.radius+=e*.2,r.alpha=Math.max(0,1-r.radius/r.maxRadius),r.radius>=r.maxRadius&&P.splice(o,1)}}function Ze(e){Z.push(e)}function $e(e){Z.splice(e,1)}function _e(e){j+=e,le=Math.min(j/be,1)}function me(){j=0,le=0}function xe(){return j>=be}let oe,de="IMAGE",ce=-1,se=0,x,pe=0;async function Ce(e){if(!document.getElementById(e))throw console.error(`Element with ID "${e}" not found`),new Error(`Element with ID "${e}" not found`);console.log("Loading vision models...");try{const r=await Se.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm");return console.log("Creating gesture recognizer..."),oe=await qe.createFromOptions(r,{baseOptions:{modelAssetPath:"https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",delegate:"GPU"},runningMode:de}),console.log("Gesture recognizer initialized successfully"),Promise.resolve()}catch(r){throw console.error("Error initializing gesture recognizer:",r),r}}async function ve(e,o){if(de==="IMAGE"&&(de="VIDEO",await oe.setOptions({runningMode:"VIDEO"})),e.currentTime!==ce){ce=e.currentTime;try{const r=await oe.recognizeForVideo(e,o);if(r&&r.landmarks&&r.landmarks.length>0)return r.timestamp=Date.now(),x=r,r}catch(r){console.error("Error recognizing gestures:",r)}}return x&&Date.now()-x.timestamp<200?x:null}function eo(e,o,r){if(!o)return;const t=new Fe(e);let l,i;r===1?(l="#EF7D00",i="#E7B481"):(l="#009AD4",i="#A4CED7"),e.save(),e.scale(-1,1),e.translate(-e.canvas.width,0),t.drawConnectors(o,qe.HAND_CONNECTIONS,{color:i,lineWidth:5}),t.drawLandmarks(o,{color:l,lineWidth:2}),e.restore()}function oo(e,o){return oe?navigator.mediaDevices.getUserMedia({video:{width:{ideal:window.innerWidth},height:{ideal:window.innerHeight}}}).then(function(r){return e.srcObject=r,e.addEventListener("loadeddata",o),Promise.resolve()}).catch(function(r){return Promise.reject(r)}):Promise.reject("Gesture recognizer not initialized")}function ro(){const e=Date.now(),o=se?e-se:0;return se=e,o}function to(e,o,r){const t=e[0],l=e[9],i=(t.x+l.x)/2*o;return{x:o-i,y:(t.y+l.y)/2*r}}function lo(e,o,r,t,l,i,f,g,c,u,n,s){if(!e||!e.landmarks||!e.landmarks.length){o.isGrabbed&&(o.isGrabbed=!1,g(-1));return}const d=Date.now()-e.timestamp;if(e.timestamp&&d>500){o.isGrabbed&&(o.isGrabbed=!1,g(-1));return}for(const a of e.landmarks){eo(n,a,s);const q=to(a,l,i),I=q.x,B=q.y;if(e.gestures&&e.gestures.length>0){const S=e.gestures[0][0].categoryName;if(S==="Closed_Fist")f(I,B);else if(S==="Open_Palm"){const w=he(I,t,l);g(w)}else if(S==="Victory"||S==="Peace"){const w=Date.now();w-pe>1e3&&(u(),pe=w)}}if(o.isGrabbed){const S=he(I,t,l);c(I,B,S)}}}function he(e,o,r){const t=$(r,o.cellSize,o.cols);return Math.floor((e-t)/o.cellSize)}const io="/assets/place-DKHhWhIU.mp3",no="/assets/win-osIxq_bZ.mp3",so="/assets/start-DOCE8CSX.mp3",Ao="data:audio/mpeg;base64,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",go="/assets/bomb-DSOoyDEl.mp3";let O=null,Q=null,z=null,W=null,D=null;function uo(){O=new Audio,O.src=io,O.volume=.5,Q=new Audio,Q.src=no,Q.volume=.7,z=new Audio,z.src=so,z.volume=.6,W=new Audio,W.src=Ao,W.volume=.4,D=new Audio,D.src=go,D.volume=.7}function fo(){O&&(O.currentTime=0,O.play().catch(e=>{console.error("Error playing place sound:",e)}))}function mo(){Q&&(Q.currentTime=0,Q.play().catch(e=>{console.error("Error playing win sound:",e)}))}function co(){z&&(z.currentTime=0,z.play().catch(e=>{console.error("Error playing start sound:",e)}))}function Ee(){W&&(W.currentTime=0,W.play().catch(e=>{console.error("Error playing grab sound:",e)}))}function po(){D&&(D.currentTime=0,D.play().catch(e=>{console.error("Error playing explosion sound:",e)}))}const ho="/assets/qr-code-TwfqPAKP.png",ao="data:image/png;base64,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",qo="/assets/closed-hand-BylWpQKF.jpg",wo="/assets/open-hand-BltyNSIo.jpg",yo="/assets/peace-hand-BSgJ4Ouf.png";let G=null,Y=null,L=null,V=null,J=null;const p={rows:6,cols:7,cellSize:0,discRadius:0},m={videoWidth:0,videoHeight:0,canvasWidth:0,canvasHeight:0};async function bo(e,o){await Ce("demos"),Ie(e,o),Ke(p,m.canvasWidth),uo(),Eo(),Io(),So()}function Eo(){G=new Image,G.src=ho,G.onerror=()=>{console.error("Error loading QR code image"),G=null}}function Io(){Y=new Image,Y.src=ao,Y.onerror=()=>{console.error("Error loading Arte logo image"),Y=null}}function So(){L=new Image,L.src=qo,L.onerror=()=>{console.error("Error loading closed hand image"),L=null},V=new Image,V.src=wo,V.onerror=()=>{console.error("Error loading open hand image"),V=null},J=new Image,J.src=yo,J.onerror=()=>{console.error("Error loading peace hand image"),J=null}}function Ie(e,o){m.videoWidth=window.innerWidth,m.videoHeight=window.innerHeight,e.style.width=m.videoWidth+"px",e.style.height=m.videoHeight+"px",m.canvasWidth=window.innerWidth,m.canvasHeight=window.innerHeight,p.cellSize=Math.min(m.canvasWidth/p.cols,m.canvasHeight/(p.rows+2)),p.discRadius=p.cellSize*.4,o.width=m.canvasWidth,o.height=m.canvasHeight}function Fo(e,o){return ee?ee.some(r=>r.row===e&&r.col===o):!1}function Mo(e,o,r,t){e.clearRect(0,0,o,r),e.fillStyle="rgba(0, 0, 0, 0.5)",e.fillRect(0,0,o,r),e.textAlign="center",e.font="bold 48px 'Montserrat', sans-serif",e.strokeStyle="#000000",e.lineWidth=3,e.strokeText("4 THE WIN",o/2,r/3),e.fillStyle="#FFFFFF",e.fillText("4 THE WIN",o/2,r/3),e.font="28px 'Montserrat', sans-serif",e.lineWidth=2,e.strokeText("Houd je duim 👍 omhoog voor 2 seconden om te beginnen",o/2,r/2-50),e.fillText("Houd je duim 👍 omhoog voor 2 seconden om te beginnen",o/2,r/2-50);const l=o*.6,i=30,f=(o-l)/2,g=r/2;e.fillStyle="#444444",e.fillRect(f,g,l,i),e.fillStyle="#00FF00",e.fillRect(f,g,t*l,i),e.fillStyle="#000000",e.font="16px 'Montserrat', sans-serif",e.fillText(`${Math.floor(t*100)}%`,f+l/2,g+i/2+5),e.font="bold 22px 'Montserrat', sans-serif";const c="LET OP: Dit spel heeft 2 spelers nodig!",u=g+i+50;e.lineWidth=2,e.strokeStyle="#000000",e.strokeText(c,o/2,u),e.fillStyle="#FFFFFF",e.fillText(c,o/2,u),e.font="bold 16px 'Montserrat', sans-serif",e.textAlign="center";const n=150,s=30,A=o-n-s,d=r-n-s;e.lineWidth=1.5,e.strokeText("Meer info over IMD",A+n/2,d-10),e.fillStyle="#FFFFFF",e.fillText("Meer info over IMD",A+n/2,d-10),Po(e,A,d,n),e.font="16px 'Montserrat', sans-serif",e.strokeText("- Gemaakt door Emile Bergers en Emiel Clopterop IMD2 -",o/2,r-20),e.fillText("- Gemaakt door Emile Bergers en Emiel Clopterop IMD2 -",o/2,r-20)}function To(e,o,r,t,l,i){const n=r-160-15,s=10;e.fillStyle="rgba(0, 0, 0, 0.6)",e.beginPath(),e.moveTo(15+s,n),e.lineTo(435-s,n),e.arcTo(435,n,435,n+s,s),e.lineTo(435,n+160-s),e.arcTo(435,n+160,435-s,n+160,s),e.lineTo(15+s,n+160),e.arcTo(15,n+160,15,n+160-s,s),e.lineTo(15,n+s),e.arcTo(15,n,15+s,n,s),e.closePath(),e.fill(),e.font="14px 'Montserrat', sans-serif",e.textAlign="left",e.lineWidth=1.5,e.strokeStyle="#000000",e.fillStyle="#FFFFFF";const A=40,d=A/2,a=15+A+15,q=50;if(t&&t.complete){const w=25+d,F=n+10+d;e.save(),e.beginPath(),e.arc(w,F,d,0,2*Math.PI),e.clip(),e.drawImage(t,w-d,F-d,A,A),e.restore(),e.beginPath(),e.arc(w,F,d,0,2*Math.PI),e.strokeStyle="#FFFFFF",e.lineWidth=1,e.stroke()}const I="Maak een vuist om een disk vast te nemen";if(e.strokeStyle="#000000",e.lineWidth=1.5,e.strokeText(I,a,n+35),e.fillText(I,a,n+35),l&&l.complete){const w=25+d,F=n+10+q+d;e.save(),e.beginPath(),e.arc(w,F,d,0,2*Math.PI),e.clip(),e.drawImage(l,w-d,F-d,A,A),e.restore(),e.beginPath(),e.arc(w,F,d,0,2*Math.PI),e.strokeStyle="#FFFFFF",e.lineWidth=1,e.stroke()}const B="Open je handpalm om een disk te laten vallen";if(e.strokeStyle="#000000",e.lineWidth=1.5,e.strokeText(B,a,n+35+q),e.fillText(B,a,n+35+q),i&&i.complete){const w=25+d,F=n+10+q*2+d;e.save(),e.beginPath(),e.arc(w,F,d,0,2*Math.PI),e.clip(),e.drawImage(i,w-d,F-d,A,A),e.restore(),e.beginPath(),e.arc(w,F,d,0,2*Math.PI),e.strokeStyle="#FFFFFF",e.lineWidth=1,e.stroke()}const S="Peace teken voor je bomb power-up (1 per speler)";e.strokeStyle="#000000",e.lineWidth=1.5,e.strokeText(S,a,n+35+q*2),e.fillText(S,a,n+35+q*2)}function Ro(e,o,r,t,l){const{rows:i,cols:f,cellSize:g,discRadius:c}=r,u=$(t,g,f),n=te(l,g,i);e.save(),e.globalAlpha=.7,e.fillStyle="#5ab946",e.fillRect(u,n,g*f,g*i),e.strokeStyle="#000",e.lineWidth=1;const s=Math.sin(Date.now()/200)*.3+.7;for(let A=0;A<i;A++)for(let d=0;d<f;d++){const a=u+d*g+g/2,q=n+A*g+g/2;if(o[A][d]===0)e.save(),e.globalCompositeOperation="destination-out",e.beginPath(),e.arc(a,q,c,0,2*Math.PI),e.fill(),e.restore(),e.beginPath(),e.arc(a,q,c,0,2*Math.PI),e.strokeStyle="rgba(0, 0, 0, 0.3)",e.stroke();else{const I=Fo(A,d),B=U[A][d]||0,S=X[A][d]==="bomb";if(e.save(),e.translate(a,q),e.rotate(B),e.translate(-a,-q),e.beginPath(),e.arc(a,q,c,0,2*Math.PI),o[A][d]===1?e.fillStyle=I?"#ff9e4d":"#ef7d00":e.fillStyle=I?"#4dbfe8":"#009ad4",e.fill(),e.strokeStyle="black",e.stroke(),S&&b&&b.complete){const w=c*1.6;e.save(),e.beginPath(),e.arc(a,q,c,0,2*Math.PI),e.clip(),e.drawImage(b,a-w/2,q-w/2,w,w),e.restore()}else ie(e,a,q,c*.8);I&&(e.save(),e.beginPath(),e.arc(a,q,c*1.2,0,2*Math.PI),o[A][d]===1?e.strokeStyle="#FFD700":e.strokeStyle="#00FFFF",e.lineWidth=3,e.stroke(),e.beginPath(),e.arc(a,q,c*(1+s*.3),0,2*Math.PI),o[A][d]===1?e.strokeStyle=`rgba(255, 215, 0, ${s*.6})`:e.strokeStyle=`rgba(0, 255, 255, ${s*.6})`,e.lineWidth=2,e.stroke(),e.beginPath(),e.arc(a,q,c*.6,0,2*Math.PI),o[A][d]===1?e.fillStyle=`rgba(255, 225, 180, ${s*.8})`:e.fillStyle=`rgba(180, 230, 255, ${s*.8})`,e.fill(),e.restore()),e.restore()}}for(const A of P)e.beginPath(),e.arc(A.x,A.y,A.radius,0,2*Math.PI),e.fillStyle=`rgba(255, 200, 0, ${A.alpha*.5})`,e.fill(),e.beginPath(),e.arc(A.x,A.y,A.radius*.8,0,2*Math.PI),e.strokeStyle=`rgba(255, 100, 0, ${A.alpha*.8})`,e.lineWidth=3,e.stroke();e.restore()}function Bo(e,o){if(e.beginPath(),e.arc(o.x,o.y,o.radius,0,2*Math.PI),e.fillStyle=o.color,e.fill(),e.strokeStyle="black",e.stroke(),o.type==="bomb"&&b&&b.complete){const r=o.radius*1.6;e.save(),e.beginPath(),e.arc(o.x,o.y,o.radius,0,2*Math.PI),e.clip(),e.drawImage(b,o.x-r/2,o.y-r/2,r,r),e.restore()}else ie(e,o.x,o.y,o.radius*.8)}function Go(e,o){if(o.visible){if(e.beginPath(),e.arc(o.x,o.y,o.radius,0,2*Math.PI),e.fillStyle=o.color,e.fill(),e.strokeStyle="rgba(0, 0, 0, 0.3)",e.stroke(),e.globalAlpha=.3,o.type==="bomb"&&b&&b.complete){const r=o.radius*1.6;e.save(),e.beginPath(),e.arc(o.x,o.y,o.radius,0,2*Math.PI),e.clip(),e.drawImage(b,o.x-r/2,o.y-r/2,r,r),e.restore()}else ie(e,o.x,o.y,o.radius*.8);e.globalAlpha=1}}function Yo(e,o){if(e.save(),e.translate(o.x,o.y),e.rotate(o.rotation),e.translate(-o.x,-o.y),e.beginPath(),e.arc(o.x,o.y,o.radius,0,2*Math.PI),e.fillStyle=o.color,e.fill(),e.stroke(),o.type==="bomb"&&b&&b.complete){const r=o.radius*1.6;e.save(),e.beginPath(),e.arc(o.x,o.y,o.radius,0,2*Math.PI),e.clip(),e.drawImage(b,o.x-r/2,o.y-r/2,r,r),e.restore()}else ie(e,o.x,o.y,o.radius*.8);e.restore()}function ae(e,o,r,t,l){if(e.font="30px 'Montserrat', sans-serif",e.textAlign="center",o){const i=r===1?2:1;e.font="bold 50px 'Montserrat', sans-serif",e.strokeStyle="#000000",e.lineWidth=3,e.strokeText(`Speler ${i===1?"Oranje":"Blauw"} wint!${l?` Terug naar startscherm in ${l}s`:""}`,t/2,60),e.fillStyle="#FFFFFF",e.fillText(`Speler ${i===1?"Oranje":"Blauw"} wint!${l?` Terug naar startscherm in ${l}s`:""}`,t/2,60)}else e.strokeStyle="#000000",e.lineWidth=2,e.strokeText(`Huidige speler: ${r===1?"Oranje":"Blauw"}`,t/2,30),e.fillStyle="#FFFFFF",e.fillText(`Huidige speler: ${r===1?"Oranje":"Blauw"}`,t/2,30),K[r]>0&&(e.font="16px 'Montserrat', sans-serif",e.lineWidth=1.5,e.strokeText(R?"Bom actief! ✌️ om terug te wisselen":"✌️ om bom te activeren",t/2,60),e.fillText(R?"Bom actief! ✌️ om terug te wisselen":"✌️ om bom te activeren",t/2,60))}function Po(e,o,r,t){G&&G.complete?e.drawImage(G,o,r,t,t):(e.fillStyle="#FFFFFF",e.fillRect(o,r,t,t),e.font="12px Arial",e.fillStyle="#000000",e.textAlign="center",e.fillText("QR-code",o+t/2,r+t/2))}function ie(e,o,r,t){if(Y&&Y.complete){const l=t*1.5;e.save(),e.beginPath(),e.arc(o,r,t,0,2*Math.PI),e.clip(),e.drawImage(Y,o-l/2,r-l/2,l,l),e.restore()}}window.addEventListener("resize",ko);document.getElementById("demos");const ne=document.getElementById("webcam"),H=document.getElementById("output_canvas"),y=H.getContext("2d");let re=!1,k=!1,C=!1,N=0;window.addEventListener("load",()=>{console.log("Window loaded, initializing game..."),bo(ne,H).then(()=>{console.log("Game initialized, enabling webcam..."),Oo()}).catch(e=>{console.error("Error initializing game:",e),y&&(y.fillStyle="white",y.font="20px Arial",y.fillText(`Initialization error: ${e.message}`,20,40))})});function ko(){Ie(ne,H),ue(p,m.canvasWidth)}function Oo(){re||(re=!0),oo(ne,ge)}async function ge(){try{const e=ro(),o=await ve(ne,Date.now());v==="landing"?Qo(o,e):v==="game"&&zo(o,e),re&&window.requestAnimationFrame(ge)}catch(e){console.error("Error in game loop:",e),y&&(y.fillStyle="white",y.font="20px Arial",y.fillText(`Game error: ${e.message}`,20,70),re&&window.requestAnimationFrame(ge))}}function Qo(e,o){Mo(y,m.canvasWidth,m.canvasHeight,le),e&&e.gestures&&e.gestures.length>0&&e.gestures[0][0].categoryName==="Thumb_Up"?(_e(o),xe()&&(co(),Xe(),ue(p,m.canvasWidth))):me()}function zo(e,o){if(y.clearRect(0,0,H.width,H.height),je(o),Ro(y,M,p,m.canvasWidth,m.canvasHeight),k&&(N+=o,N>1e3&&!C&&(ke(M,p,U,X,$(m.canvasWidth,p.cellSize,p.cols),te(m.canvasHeight,p.cellSize,p.rows)),C=!0),N>2e3&&(k=!1,N=0,C=!1)),Do(),!T&&!k&&lo(e,h,M,p,m.canvasWidth,m.canvasHeight,Ko,Uo,Xo,Wo,y,E),!T&&!k&&(Go(y,_),Bo(y,h)),T){const r=De(o),t=Math.max(0,Math.ceil((fe-r)/1e3));ae(y,T,E,m.canvasWidth,t),r>=fe&&(Qe("landing"),ue(p,m.canvasWidth))}else ae(y,T,E,m.canvasWidth);To(y,m.canvasWidth,m.canvasHeight,L,V,J),H.onclick=null}function Wo(){!T&&!k&&!h.isGrabbed&&Ve()&&Ee()}function Do(){for(let e=Z.length-1;e>=0;e--){const o=Z[e];if(Re(o)){if(o.x=o.targetX,o.y=o.targetY,U[o.row][o.col]=o.rotation,X[o.row][o.col]=o.type,M[o.row][o.col]=o.player,o.type==="bomb")Ho(o);else{const t=Me(M,o.row,o.col,o.player);t&&(We(t),ze(!0),mo())}$e(e)}Yo(y,o)}}function Ho(e){k=!0,N=0,C=!1,po(),Pe(M,e.row,e.col).forEach(f=>{U[f.row][f.col]=null,X[f.row][f.col]=null});const r=$(m.canvasWidth,p.cellSize,p.cols),t=te(m.canvasHeight,p.cellSize,p.rows),l=r+e.col*p.cellSize+p.cellSize/2,i=t+e.row*p.cellSize+p.cellSize/2;Ne(l,i,e.player)}function Ko(e,o){if(!h.isGrabbed){const r=e-h.x,t=o-h.y;Math.sqrt(r*r+t*t)<h.radius*2&&(h.isGrabbed=!0,Ee())}}function Uo(e){if(h.isGrabbed&&!T&&e>=0&&e<p.cols){const o=Ye(e,M,p,m,h,E);o&&(h.type==="bomb"&&Je(),Ze(o),fo(),Le(m.canvasWidth))}h.isGrabbed=!1,Be(_)}function Xo(e,o,r){h.x=e,h.y=Math.min(p.cellSize,o),Ge(_,h,M,r,p,m.canvasWidth,m.canvasHeight)}

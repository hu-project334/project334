import{N as c}from"./NavBarTop.d4a026de.js";import{_ as p,r as g,o as v,c as _,b as B,d as e,F as b,p as y,f as I,a as T}from"./index.1496f8ab.js";import"./firebaseAuth.352d3f5d.js";import"./fdb.58f18549.js";var n="idle",o=0,s=0,i=0,d;const E={name:"Select Sensor",components:{NavBarTop:c},methods:{saveMeasurement(){},deleteMeasurement(){},goBackToSelect(){clearInterval(d),this.$router.push({name:"selectSensor"})},updateTimer(){(o+=10)==1e3&&(o=0,s++),s==60&&(s=0,i++),document.getElementById("minutes").innerHTML=i+":",document.getElementById("seconds").innerHTML=s+":",document.getElementById("milliseconds").innerHTML=o},measure(){n=="idle"?(document.getElementById("button1").classList.toggle("measureButtonBlue"),document.getElementById("button1").classList.toggle("measureButtonRed"),document.getElementById("button1Text").innerHTML="Stop meting",clearInterval(d),d=setInterval(()=>{this.updateTimer()},10),n="measuring"):n=="measuring"?(document.getElementById("button1").classList.toggle("measureButtonBlue"),document.getElementById("button1").classList.toggle("measureButtonRed"),document.getElementById("button1Text").innerHTML="Begin opnieuw",document.getElementById("button2").style="margin-top: 0.5rem; display: inline",document.getElementById("button3").style="margin-top: 0.5rem; display: inline",clearInterval(d),n="results"):n=="results"&&(document.getElementById("button1Text").innerHTML="Start meting",document.getElementById("button2").style="margin-top: 0.5rem; display: none",document.getElementById("button3").style="margin-top: 0.5rem; display: none",o=0,s=0,i=0,clearInterval(d),document.getElementById("minutes").innerHTML=i+":",document.getElementById("seconds").innerHTML=s+":",document.getElementById("milliseconds").innerHTML=o,n="idle")}}},a=l=>(y("data-v-713012e6"),l=l(),I(),l),M=a(()=>e("h1",{class:"title"},"Meet",-1)),h={class:"container"},f=T('<b data-v-713012e6>Meet resultaten</b><table data-v-713012e6><tr data-v-713012e6><td class="header_name" data-v-713012e6><b class="table_content" data-v-713012e6>Tijd (m:s:ms) </b></td><td data-v-713012e6><span id="minutes" data-v-713012e6>00:</span><span id="seconds" data-v-713012e6>00:</span><span id="milliseconds" data-v-713012e6>00</span></td></tr><tr data-v-713012e6><td class="header_name" data-v-713012e6><b data-v-713012e6>Beweging (graden) </b></td><td data-v-713012e6>-</td></tr><tr data-v-713012e6><td class="header_name" data-v-713012e6><b data-v-713012e6>Procent van de norm </b></td><td data-v-713012e6>-</td></tr></table>',2),S=a(()=>e("b",{id:"button1Text"},"Start meting",-1)),L=[S],k=a(()=>e("b",null,"Sla meting op",-1)),x=[k],H=a(()=>e("b",null,"Verwijder meting",-1)),N=[H],C=a(()=>e("div",{style:{"margin-top":"80px"}},null,-1)),$=a(()=>e("b",null,"Terug",-1)),w=[$];function V(l,t,R,j,F,r){const u=g("NavBarTop");return v(),_(b,null,[B(u),M,e("div",h,[f,e("button",{class:"measureButtonBlue",onClick:t[0]||(t[0]=m=>r.measure()),id:"button1"},L),e("button",{class:"measureButtonBlue",onClick:t[1]||(t[1]=m=>r.saveMeasurement()),style:{"margin-top":"0.5rem",display:"none"},id:"button2"},x),e("button",{class:"measureButtonRed",onClick:t[2]||(t[2]=m=>r.deleteMeasurement()),style:{"margin-top":"0.5rem",display:"none"},id:"button3"},N)]),C,e("footer",null,[e("button",{class:"backBtn",onClick:t[3]||(t[3]=m=>r.goBackToSelect())},w)])],64)}var D=p(E,[["render",V],["__scopeId","data-v-713012e6"]]);export{D as default};
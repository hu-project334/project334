import{N as m}from"./NavBarTop.27716967.js";import{L as g,p as v,_ as d}from"./patients.5d14e1a2.js";import{_ as f,r as b,o as r,c,b as k,d as e,t as i,F as h,ac as I,p as B,g as P}from"./index.382de0b0.js";import"./firebaseAuth.67b65632.js";var D=[{category:"Linker voet",lastMeasure:"04-04-2022"},{category:"Rechter voet",lastMeasure:"04-04-2022"},{category:"linker onder arm",lastMeasure:"04-04-2022"},{category:"Rechter onder arm",lastMeasure:"04-04-2022"}];function N(s){let t=s.split("-"),u=new Date(t[2],t[1]-1,t[0]),n=new Date-u;return Math.floor(n/315576e5)}const x={name:"patients",components:{NavBarTop:m,LinkButton:g},data(){return{patientID:null,name:"",surName:"",weight:null,age:"",heightInM:null,patients:null,categories:null}},mounted(){this.categories=D,this.patients=v,this.patientID=this.$route.params.id,this.getPatientData()},methods:{getPatientData(){let s=parseInt(this.patientID),t=d.find(this.patients,{id:s});console.log(t),this.name=t.name,this.surName=t.surName,this.weight=t.weight,this.age=N(t.dateOfBirth),this.heightInM=t.heightInM},deletePatient(s){let t=d.findIndex(this.patients,{id:s});this.patients.splice(t,1),this.$router.push({name:"patients"})},goBackToPatientList(){this.$router.push({name:"patients"})},goToExerciseResults(s){//! fix params
console.log(s),this.$router.push({name:"exerciseResults"})}}},a=s=>(B("data-v-27520c74"),s=s(),P(),s),M=a(()=>e("h1",{class:"title"},"Patient",-1)),T={class:"container"},w=a(()=>e("b",null,"Patient gegevens",-1)),y=a(()=>e("td",{class:"header_name"},[e("b",null,"Naam ")],-1)),L=a(()=>e("td",{class:"header_name"},[e("b",null,"Gewicht ")],-1)),C=a(()=>e("td",{class:"header_name"},[e("b",null,"Lengte ")],-1)),R={class:"header_name"},S=a(()=>e("td",{class:"header_name"},[e("b",null,"leeftijd ")],-1)),j=a(()=>e("td",{class:"header_name"},[e("b",null,"Patientnummer")],-1)),A={class:"text-holder"},E=["onClick"],V=a(()=>e("b",null,"Verwijder patient",-1)),F=[V],G=a(()=>e("b",null,"Terug",-1)),O=[G],q=a(()=>e("button",{class:"addCategory"},[e("b",null,"Categorie toevoegen")],-1));function z(s,t,u,_,n,l){const p=b("NavBarTop");return r(),c(h,null,[k(p),M,e("div",T,[w,e("table",null,[e("tr",null,[y,e("td",null,i(n.name)+" "+i(n.surName),1)]),e("tr",null,[L,e("td",null,i(n.weight),1)]),e("tr",null,[C,e("td",R,i(n.heightInM),1)]),e("tr",null,[S,e("td",null,i(n.age),1)]),e("tr",null,[j,e("td",null,i(n.patientID),1)])])]),(r(!0),c(h,null,I(n.categories,o=>(r(),c("div",{key:o,class:"category"},[e("div",A,[e("p",null,[e("b",null,i(o.category),1)]),e("p",null,"Laatste meting: "+i(o.lastMeasure),1)]),e("button",{class:"see-results",onClick:H=>l.goToExerciseResults(o.category)}," Bekijk ",8,E)]))),128)),e("button",{class:"deletePatientBtn",onClick:t[0]||(t[0]=o=>l.deletePatient(n.patientID))},F),e("footer",null,[e("button",{class:"backBtn",onClick:t[1]||(t[1]=o=>l.goBackToPatientList())},O),q])],64)}var W=f(x,[["render",z],["__scopeId","data-v-27520c74"]]);export{W as default};
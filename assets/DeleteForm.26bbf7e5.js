import{F as u,a as m,E as p}from"./vee-validate.esm.75a23db2.js";import{_ as f,o as r,c as a,d as e,t as i,e as d,n as g,p as h,f as v}from"./index.1496f8ab.js";const b={name:"Register",props:{firebaseError:String},components:{Form:u,Field:m,ErrorMessage:p},data(){return{successful:!1,loading:!1,message:""}},mounted(){},methods:{goBack(){this.$emit("close")},deleteThing(){this.$emit("delete")}}},n=s=>(h("data-v-76c516bc"),s=s(),v(),s),k={class:"form"},B=n(()=>e("h3",null,[e("b",null,"Verwijderen?")],-1)),E=n(()=>e("b",null,"verwijder",-1)),x=[E],y=n(()=>e("b",null,"Terug",-1)),F=[y],S={key:0,id:"errorText"};function C(s,t,c,D,o,l){return r(),a("form",k,[B,e("button",{class:"deleteButton",onClick:t[0]||(t[0]=_=>l.deleteThing())},x),e("button",{class:"returnButton",onClick:t[1]||(t[1]=_=>l.goBack())},F),c.firebaseError!==""?(r(),a("div",S,i(c.firebaseError),1)):d("",!0),o.message?(r(),a("div",{key:1,class:g(["alert",o.successful?"alert-success":"alert-danger"])},i(o.message),3)):d("",!0)])}var w=f(b,[["render",C],["__scopeId","data-v-76c516bc"]]);export{w as D};

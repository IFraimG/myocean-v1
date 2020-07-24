(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["audio"],{"20f6":function(t,e,a){},"2fa4":function(t,e,a){"use strict";a("20f6");var i=a("80d2");e["a"]=Object(i["h"])("spacer","div","v-spacer")},"36a3":function(t,e,a){"use strict";var i=a("ffc6"),r=a.n(i);r.a},"5fd6":function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("NotAuth",{scopedSlots:t._u([{key:"error",fn:function(){},proxy:!0},{key:"loading",fn:function(){},proxy:!0},{key:"default",fn:function(){return[a("div",{staticClass:"audio__wrapper d-flex flex-row"},[a("div",[a("Panel")],1),a("v-card",{staticClass:"audio"},[a("v-toolbar",[a("v-card-title",[t._v("Моя музыка")]),a("v-spacer"),a("v-btn",{staticStyle:{color:"#fff"},attrs:{color:"myPurple"}},[a("label",{attrs:{for:"audioLoad"}},[t._v(" Добавить аудиозапись "),a("input",{staticClass:"hide",attrs:{type:"file",id:"audioLoad"},on:{input:t.getAudio}})])])],1),a("AudioList")],1)],1)]},proxy:!0}])})],1)},r=[],s=(a("b0c0"),a("96cf"),a("1da1")),n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[t.audios!=[]?i("div",{staticClass:"audio__list d-flex flex-column align-center"},t._l(t.audios,(function(e,a){return i("div",{key:a},[i("div",{staticClass:"audio__item d-flex flex-row align-center justify-space-between"},[i("div",{staticClass:"d-flex"},[i("div",{staticClass:"d-flex align-center"},[t.music!=e.source?i("v-icon",{attrs:{size:"64"},on:{click:function(a){return t.musicPlay(e)}}},[t._v(" play_arrow ")]):t._e(),t.music==e.source?i("v-icon",{attrs:{size:"64"},on:{click:function(a){return t.musicPause(e)}}},[t._v(" pause ")]):t._e()],1),t.isEdit&&t.isEdit==e.source?t._e():i("div",{staticClass:"audio__list__title"},[i("h2",[t._v(t._s(e.title))]),i("p",[t._v(t._s(e.author))])]),t.isEdit==e.source?i("div",{staticClass:"d-flex align-center"},[i("v-text-field",{staticClass:"audio__list__input",attrs:{solo:""},model:{value:t.sound.title,callback:function(e){t.$set(t.sound,"title",e)},expression:"sound.title"}}),i("v-text-field",{staticClass:"audio__list__input",attrs:{solo:""},model:{value:t.sound.author,callback:function(e){t.$set(t.sound,"author",e)},expression:"sound.author"}}),i("v-btn",{staticStyle:{"margin-left":"30px"},attrs:{color:"success"},on:{click:function(a){return t.soundSave(e)}}},[i("v-icon",[t._v("save")])],1),i("v-btn",{staticStyle:{"margin-left":"20px"},attrs:{color:"error"},on:{click:function(e){t.isEdit=!1}}},[i("v-icon",[t._v("cancel")])],1)],1):t._e()]),t.isUser&&!t.isEdit||t.isEdit!=e.source?i("div",{staticClass:"audio__list__edit d-flex flex-column"},[i("v-icon",{staticStyle:{"margin-bottom":"30px",cursor:"pointer"},on:{click:function(a){return t.musicDelete(e)}}},[t._v(" cancel ")]),i("v-icon",{staticStyle:{cursor:"pointer"},on:{click:function(a){return t.musicEdit(e)}}},[t._v("create")])],1):t._e()])])})),0):t._e(),0===t.audios.length?i("div",{staticClass:"d-flex flex-row align-center",staticStyle:{padding:"50px"}},[i("h2",{staticClass:"display-1"},[t._v("Вы еще не добавили ни одной аудиозаписи")]),i("v-img",{attrs:{src:a("f6de"),width:"300"}})],1):t._e()])},o=[],u=a("bc3a"),c=a.n(u),d={name:"AudioList",data:function(){return{audios:[],music:!1,audioPlay:"",isUser:!1,user:"",isAudio:!1,isEdit:!1,sound:{title:"",author:"",source:""}}},created:function(){var t=this;return Object(s["a"])(regeneratorRuntime.mark((function e(){var a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,c.a.get("/api/users/get_audios/"+t.$route.params.id);case 2:a=e.sent,t.user=JSON.parse(localStorage.getItem("user")),t.user.id==t.$route.params.id&&(t.isUser=!0),t.audios=a.data;case 6:case"end":return e.stop()}}),e)})))()},methods:{musicPlay:function(t){this.audioPlay&&this.audioPlay.pause(),this.isAudio==t.source?(this.music=t.source,this.audioPlay.play()):(this.music=t.source,this.audioPlay=new Audio("/"+t.source),this.audioPlay.play())},musicPause:function(t){this.music=!1,this.isAudio=t.source,this.audioPlay.pause()},musicDelete:function(t){var e=this;return Object(s["a"])(regeneratorRuntime.mark((function a(){var i;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return a.next=2,c.a.delete("/api/users/audio-delete/"+e.user.id,{params:{audio:t.source}});case 2:i=a.sent,localStorage.setItem("user",JSON.stringify(i.data));case 4:case"end":return a.stop()}}),a)})))()},musicEdit:function(t){this.isEdit=t.source,this.sound.title=t.title,this.sound.author=t.author,this.sound.source=""},soundSave:function(t){var e=this;return Object(s["a"])(regeneratorRuntime.mark((function a(){var i;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return e.sound.source=t.source,a.next=3,c.a.put("/api/users/sound-replace/"+e.$route.params.id,e.sound);case 3:i=a.sent,localStorage.setItem("user",JSON.stringify(i.data)),e.isEdit=!1;case 6:case"end":return a.stop()}}),a)})))()}}},l=d,f=(a("36a3"),a("2877")),p=a("6544"),v=a.n(p),m=a("8336"),_=a("132d"),h=a("adda"),g=a("8654"),x=Object(f["a"])(l,n,o,!1,null,"2632ada2",null),b=x.exports;v()(x,{VBtn:m["a"],VIcon:_["a"],VImg:h["a"],VTextField:g["a"]});var y=a("bdb8"),w=a("9c97"),k={name:"Audio",metaInfo:{title:"MyOcean - Мои аудиозаписи"},components:{AudioList:b,NotAuth:y["a"],Panel:w["a"]},data:function(){return{user:""}},created:function(){this.user=JSON.parse(localStorage.getItem("user"))},methods:{getAudio:function(t){var e=this;return Object(s["a"])(regeneratorRuntime.mark((function a(){var i,r,s;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return i=t.target.files[0],r=new FormData,r.set("audio",i,i.name),a.next=5,c.a.put("/api/users/audio_save/"+e.user.id,r,{headers:{"Content-Type":void 0}});case 5:s=a.sent,localStorage.setItem("user",JSON.stringify(s.data));case 7:case"end":return a.stop()}}),a)})))()}}},S=k,C=(a("eb29"),a("b0af")),O=a("99d9"),A=a("2fa4"),E=a("71d9"),P=Object(f["a"])(S,i,r,!1,null,"59c9c0d8",null);e["default"]=P.exports;v()(P,{VBtn:m["a"],VCard:C["a"],VCardTitle:O["d"],VSpacer:A["a"],VToolbar:E["a"]})},"680b":function(t,e,a){t.exports=a.p+"img/covid.f87ea035.png"},"7f25":function(t,e,a){},"8be6":function(t,e,a){"use strict";var i=a("9bf6"),r=a.n(i);r.a},"9bf6":function(t,e,a){},bdb8:function(t,e,a){"use strict";var i=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[t.err?t._t("error",[i("div",{staticClass:"auth__error d-flex flex-row align-center"},[i("div",[i("h2",[t._v("Вы не можете просматривать данную страницу ( 401 )")]),i("p",[t._v(" Для просмотра вы должны "),i("router-link",{staticClass:"auth__error__link",attrs:{to:"/"}},[t._v(" зарегистрироваться ")])],1)]),i("v-img",{attrs:{"max-width":"256",height:"256",src:a("680b")}})],1)]):t.loading?t._t("loading",[i("Loader")]):t._t("default",[t._v("profit")])],2)},r=[],s=(a("96cf"),a("1da1")),n=a("555f"),o=a("bc3a"),u=a.n(o),c={name:"NotAuth",components:{Loader:n["a"]},data:function(){return{err:!1,loading:!0}},beforeCreate:function(){var t=this;return Object(s["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,u.a.get("/api/auth/test",{headers:{Authorization:localStorage.getItem("jwt")}});case 3:t.loading=!1,e.next=10;break;case 6:e.prev=6,e.t0=e["catch"](0),t.err=!0,t.loading=!1;case 10:case"end":return e.stop()}}),e,null,[[0,6]])})))()}},d=c,l=(a("8be6"),a("2877")),f=a("6544"),p=a.n(f),v=a("adda"),m=Object(l["a"])(d,i,r,!1,null,"2a82bc1c",null);e["a"]=m.exports;p()(m,{VImg:v["a"]})},eb29:function(t,e,a){"use strict";var i=a("7f25"),r=a.n(i);r.a},f6de:function(t,e,a){t.exports=a.p+"img/error.1212787b.jpg"},ffc6:function(t,e,a){}}]);
//# sourceMappingURL=audio.c9b9e220.js.map
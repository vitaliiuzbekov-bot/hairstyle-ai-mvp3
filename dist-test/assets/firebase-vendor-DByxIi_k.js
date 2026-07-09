const Sp=()=>{};var Bu={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rp={SDK_VERSION:"${JSCORE_VERSION}"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ww=function(r,e){if(!r)throw bp(e)},bp=function(r){return new Error("Firebase Database ("+Rp.SDK_VERSION+") INTERNAL ASSERT FAILED: "+r)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kh=function(r){const e=[];let t=0;for(let n=0;n<r.length;n++){let s=r.charCodeAt(n);s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&n+1<r.length&&(r.charCodeAt(n+1)&64512)===56320?(s=65536+((s&1023)<<10)+(r.charCodeAt(++n)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},Pp=function(r){const e=[];let t=0,n=0;for(;t<r.length;){const s=r[t++];if(s<128)e[n++]=String.fromCharCode(s);else if(s>191&&s<224){const i=r[t++];e[n++]=String.fromCharCode((s&31)<<6|i&63)}else if(s>239&&s<365){const i=r[t++],o=r[t++],c=r[t++],u=((s&7)<<18|(i&63)<<12|(o&63)<<6|c&63)-65536;e[n++]=String.fromCharCode(55296+(u>>10)),e[n++]=String.fromCharCode(56320+(u&1023))}else{const i=r[t++],o=r[t++];e[n++]=String.fromCharCode((s&15)<<12|(i&63)<<6|o&63)}}return e.join("")},Nh={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(r,e){if(!Array.isArray(r))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,n=[];for(let s=0;s<r.length;s+=3){const i=r[s],o=s+1<r.length,c=o?r[s+1]:0,u=s+2<r.length,h=u?r[s+2]:0,f=i>>2,p=(i&3)<<4|c>>4;let E=(c&15)<<2|h>>6,b=h&63;u||(b=64,o||(E=64)),n.push(t[f],t[p],t[E],t[b])}return n.join("")},encodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(r):this.encodeByteArray(kh(r),e)},decodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(r):Pp(this.decodeStringToByteArray(r,e))},decodeStringToByteArray(r,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,n=[];for(let s=0;s<r.length;){const i=t[r.charAt(s++)],c=s<r.length?t[r.charAt(s)]:0;++s;const h=s<r.length?t[r.charAt(s)]:64;++s;const p=s<r.length?t[r.charAt(s)]:64;if(++s,i==null||c==null||h==null||p==null)throw new Cp;const E=i<<2|c>>4;if(n.push(E),h!==64){const b=c<<4&240|h>>2;if(n.push(b),p!==64){const V=h<<6&192|p;n.push(V)}}}return n},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let r=0;r<this.ENCODED_VALS.length;r++)this.byteToCharMap_[r]=this.ENCODED_VALS.charAt(r),this.charToByteMap_[this.byteToCharMap_[r]]=r,this.byteToCharMapWebSafe_[r]=this.ENCODED_VALS_WEBSAFE.charAt(r),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[r]]=r,r>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(r)]=r,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(r)]=r)}}};class Cp extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Vp=function(r){const e=kh(r);return Nh.encodeByteArray(e,!0)},fi=function(r){return Vp(r).replace(/\./g,"")},xh=function(r){try{return Nh.decodeString(r,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Oh(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dp=()=>Oh().__FIREBASE_DEFAULTS__,kp=()=>{if(typeof process>"u"||typeof Bu>"u")return;const r=Bu.__FIREBASE_DEFAULTS__;if(r)return JSON.parse(r)},Np=()=>{if(typeof document>"u")return;let r;try{r=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=r&&xh(r[1]);return e&&JSON.parse(e)},Bi=()=>{try{return Sp()||Dp()||kp()||Np()}catch(r){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${r}`);return}},Mh=r=>{var e,t;return(t=(e=Bi())==null?void 0:e.emulatorHosts)==null?void 0:t[r]},Qw=r=>{const e=Mh(r);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const n=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),n]:[e.substring(0,t),n]},Lh=()=>{var r;return(r=Bi())==null?void 0:r.config},Fh=r=>{var e;return(e=Bi())==null?void 0:e[`_${r}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xp{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,n)=>{t?this.reject(t):this.resolve(n),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,n))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jw(r,e){if(r.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},n=e||"demo-project",s=r.iat||0,i=r.sub||r.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o={iss:`https://securetoken.google.com/${n}`,aud:n,iat:s,exp:s+3600,auth_time:s,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}},...r};return[fi(JSON.stringify(t)),fi(JSON.stringify(o)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ge(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Op(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(ge())}function Uh(){var e;const r=(e=Bi())==null?void 0:e.forceEnvironment;if(r==="node")return!0;if(r==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Mp(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Lp(){const r=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof r=="object"&&r.id!==void 0}function Fp(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Up(){const r=ge();return r.indexOf("MSIE ")>=0||r.indexOf("Trident/")>=0}function Bh(){return!Uh()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function jh(){return!Uh()&&!!navigator.userAgent&&(navigator.userAgent.includes("Safari")||navigator.userAgent.includes("WebKit"))&&!navigator.userAgent.includes("Chrome")}function qh(){try{return typeof indexedDB=="object"}catch{return!1}}function Bp(){return new Promise((r,e)=>{try{let t=!0;const n="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(n);s.onsuccess=()=>{s.result.close(),t||self.indexedDB.deleteDatabase(n),r(!0)},s.onupgradeneeded=()=>{t=!1},s.onerror=()=>{var i;e(((i=s.error)==null?void 0:i.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jp="FirebaseError";class dt extends Error{constructor(e,t,n){super(t),this.code=e,this.customData=n,this.name=jp,Object.setPrototypeOf(this,dt.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,ps.prototype.create)}}class ps{constructor(e,t,n){this.service=e,this.serviceName=t,this.errors=n}create(e,...t){const n=t[0]||{},s=`${this.service}/${e}`,i=this.errors[e],o=i?qp(i,n):"Error",c=`${this.serviceName}: ${o} (${s}).`;return new dt(s,c,n)}}function qp(r,e){return r.replace(zp,(t,n)=>{const s=e[n];return s!=null?String(s):`<${n}?>`})}const zp=/\{\$([^}]+)}/g;function $p(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}function fn(r,e){if(r===e)return!0;const t=Object.keys(r),n=Object.keys(e);for(const s of t){if(!n.includes(s))return!1;const i=r[s],o=e[s];if(ju(i)&&ju(o)){if(!fn(i,o))return!1}else if(i!==o)return!1}for(const s of n)if(!t.includes(s))return!1;return!0}function ju(r){return r!==null&&typeof r=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gs(r){const e=[];for(const[t,n]of Object.entries(r))Array.isArray(n)?n.forEach(s=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(n));return e.length?"&"+e.join("&"):""}function Kp(r,e){const t=new Gp(r,e);return t.subscribe.bind(t)}class Gp{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(n=>{this.error(n)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,n){let s;if(e===void 0&&t===void 0&&n===void 0)throw new Error("Missing Observer.");Hp(e,["next","error","complete"])?s=e:s={next:e,error:t,complete:n},s.next===void 0&&(s.next=Fo),s.error===void 0&&(s.error=Fo),s.complete===void 0&&(s.complete=Fo);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(n){typeof console<"u"&&console.error&&console.error(n)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Hp(r,e){if(typeof r!="object"||r===null)return!1;for(const t of e)if(t in r&&typeof r[t]=="function")return!0;return!1}function Fo(){}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wp=1e3,Qp=2,Jp=14400*1e3,Yp=.5;function Yw(r,e=Wp,t=Qp){const n=e*Math.pow(t,r),s=Math.round(Yp*n*(Math.random()-.5)*2);return Math.min(Jp,n+s)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fe(r){return r&&r._delegate?r._delegate:r}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _s(r){try{return(r.startsWith("http://")||r.startsWith("https://")?new URL(r).hostname:r).endsWith(".cloudworkstations.dev")}catch{return!1}}async function zh(r){return(await fetch(r,{credentials:"include"})).ok}class mn{constructor(e,t,n){this.name=e,this.instanceFactory=t,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const en="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xp{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const n=new xp;if(this.instancesDeferred.set(t,n),this.isInitialized(t)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:t});s&&n.resolve(s)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){const t=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),n=(e==null?void 0:e.optional)??!1;if(this.isInitialized(t)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:t})}catch(s){if(n)return null;throw s}else{if(n)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(eg(e))try{this.getOrInitializeService({instanceIdentifier:en})}catch{}for(const[t,n]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(t);try{const i=this.getOrInitializeService({instanceIdentifier:s});n.resolve(i)}catch{}}}}clearInstance(e=en){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=en){return this.instances.has(e)}getOptions(e=en){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,n=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(n))throw Error(`${this.name}(${n}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:n,options:t});for(const[i,o]of this.instancesDeferred.entries()){const c=this.normalizeInstanceIdentifier(i);n===c&&o.resolve(s)}return s}onInit(e,t){const n=this.normalizeInstanceIdentifier(t),s=this.onInitCallbacks.get(n)??new Set;s.add(e),this.onInitCallbacks.set(n,s);const i=this.instances.get(n);return i&&e(i,n),()=>{s.delete(e)}}invokeOnInitCallbacks(e,t){const n=this.onInitCallbacks.get(t);if(n)for(const s of n)try{s(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let n=this.instances.get(e);if(!n&&this.component&&(n=this.component.instanceFactory(this.container,{instanceIdentifier:Zp(e),options:t}),this.instances.set(e,n),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(n,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,n)}catch{}return n||null}normalizeInstanceIdentifier(e=en){return this.component?this.component.multipleInstances?e:en:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Zp(r){return r===en?void 0:r}function eg(r){return r.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tg{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new Xp(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var H;(function(r){r[r.DEBUG=0]="DEBUG",r[r.VERBOSE=1]="VERBOSE",r[r.INFO=2]="INFO",r[r.WARN=3]="WARN",r[r.ERROR=4]="ERROR",r[r.SILENT=5]="SILENT"})(H||(H={}));const ng={debug:H.DEBUG,verbose:H.VERBOSE,info:H.INFO,warn:H.WARN,error:H.ERROR,silent:H.SILENT},rg=H.INFO,sg={[H.DEBUG]:"log",[H.VERBOSE]:"log",[H.INFO]:"info",[H.WARN]:"warn",[H.ERROR]:"error"},ig=(r,e,...t)=>{if(e<r.logLevel)return;const n=new Date().toISOString(),s=sg[e];if(s)console[s](`[${n}]  ${r.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Oa{constructor(e){this.name=e,this._logLevel=rg,this._logHandler=ig,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in H))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?ng[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,H.DEBUG,...e),this._logHandler(this,H.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,H.VERBOSE,...e),this._logHandler(this,H.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,H.INFO,...e),this._logHandler(this,H.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,H.WARN,...e),this._logHandler(this,H.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,H.ERROR,...e),this._logHandler(this,H.ERROR,...e)}}const og=(r,e)=>e.some(t=>r instanceof t);let qu,zu;function ag(){return qu||(qu=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function cg(){return zu||(zu=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const $h=new WeakMap,ea=new WeakMap,Kh=new WeakMap,Uo=new WeakMap,Ma=new WeakMap;function ug(r){const e=new Promise((t,n)=>{const s=()=>{r.removeEventListener("success",i),r.removeEventListener("error",o)},i=()=>{t(Dt(r.result)),s()},o=()=>{n(r.error),s()};r.addEventListener("success",i),r.addEventListener("error",o)});return e.then(t=>{t instanceof IDBCursor&&$h.set(t,r)}).catch(()=>{}),Ma.set(e,r),e}function lg(r){if(ea.has(r))return;const e=new Promise((t,n)=>{const s=()=>{r.removeEventListener("complete",i),r.removeEventListener("error",o),r.removeEventListener("abort",o)},i=()=>{t(),s()},o=()=>{n(r.error||new DOMException("AbortError","AbortError")),s()};r.addEventListener("complete",i),r.addEventListener("error",o),r.addEventListener("abort",o)});ea.set(r,e)}let ta={get(r,e,t){if(r instanceof IDBTransaction){if(e==="done")return ea.get(r);if(e==="objectStoreNames")return r.objectStoreNames||Kh.get(r);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return Dt(r[e])},set(r,e,t){return r[e]=t,!0},has(r,e){return r instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in r}};function hg(r){ta=r(ta)}function dg(r){return r===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const n=r.call(Bo(this),e,...t);return Kh.set(n,e.sort?e.sort():[e]),Dt(n)}:cg().includes(r)?function(...e){return r.apply(Bo(this),e),Dt($h.get(this))}:function(...e){return Dt(r.apply(Bo(this),e))}}function fg(r){return typeof r=="function"?dg(r):(r instanceof IDBTransaction&&lg(r),og(r,ag())?new Proxy(r,ta):r)}function Dt(r){if(r instanceof IDBRequest)return ug(r);if(Uo.has(r))return Uo.get(r);const e=fg(r);return e!==r&&(Uo.set(r,e),Ma.set(e,r)),e}const Bo=r=>Ma.get(r);function mg(r,e,{blocked:t,upgrade:n,blocking:s,terminated:i}={}){const o=indexedDB.open(r,e),c=Dt(o);return n&&o.addEventListener("upgradeneeded",u=>{n(Dt(o.result),u.oldVersion,u.newVersion,Dt(o.transaction),u)}),t&&o.addEventListener("blocked",u=>t(u.oldVersion,u.newVersion,u)),c.then(u=>{i&&u.addEventListener("close",()=>i()),s&&u.addEventListener("versionchange",h=>s(h.oldVersion,h.newVersion,h))}).catch(()=>{}),c}const pg=["get","getKey","getAll","getAllKeys","count"],gg=["put","add","delete","clear"],jo=new Map;function $u(r,e){if(!(r instanceof IDBDatabase&&!(e in r)&&typeof e=="string"))return;if(jo.get(e))return jo.get(e);const t=e.replace(/FromIndex$/,""),n=e!==t,s=gg.includes(t);if(!(t in(n?IDBIndex:IDBObjectStore).prototype)||!(s||pg.includes(t)))return;const i=async function(o,...c){const u=this.transaction(o,s?"readwrite":"readonly");let h=u.store;return n&&(h=h.index(c.shift())),(await Promise.all([h[t](...c),s&&u.done]))[0]};return jo.set(e,i),i}hg(r=>({...r,get:(e,t,n)=>$u(e,t)||r.get(e,t,n),has:(e,t)=>!!$u(e,t)||r.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _g{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(yg(t)){const n=t.getImmediate();return`${n.library}/${n.version}`}else return null}).filter(t=>t).join(" ")}}function yg(r){const e=r.getComponent();return(e==null?void 0:e.type)==="VERSION"}const na="@firebase/app",Ku="0.14.12";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ot=new Oa("@firebase/app"),Ig="@firebase/app-compat",Tg="@firebase/analytics-compat",Eg="@firebase/analytics",wg="@firebase/app-check-compat",vg="@firebase/app-check",Ag="@firebase/auth",Sg="@firebase/auth-compat",Rg="@firebase/database",bg="@firebase/data-connect",Pg="@firebase/database-compat",Cg="@firebase/functions",Vg="@firebase/functions-compat",Dg="@firebase/installations",kg="@firebase/installations-compat",Ng="@firebase/messaging",xg="@firebase/messaging-compat",Og="@firebase/performance",Mg="@firebase/performance-compat",Lg="@firebase/remote-config",Fg="@firebase/remote-config-compat",Ug="@firebase/storage",Bg="@firebase/storage-compat",jg="@firebase/firestore",qg="@firebase/ai",zg="@firebase/firestore-compat",$g="firebase",Kg="12.13.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ra="[DEFAULT]",Gg={[na]:"fire-core",[Ig]:"fire-core-compat",[Eg]:"fire-analytics",[Tg]:"fire-analytics-compat",[vg]:"fire-app-check",[wg]:"fire-app-check-compat",[Ag]:"fire-auth",[Sg]:"fire-auth-compat",[Rg]:"fire-rtdb",[bg]:"fire-data-connect",[Pg]:"fire-rtdb-compat",[Cg]:"fire-fn",[Vg]:"fire-fn-compat",[Dg]:"fire-iid",[kg]:"fire-iid-compat",[Ng]:"fire-fcm",[xg]:"fire-fcm-compat",[Og]:"fire-perf",[Mg]:"fire-perf-compat",[Lg]:"fire-rc",[Fg]:"fire-rc-compat",[Ug]:"fire-gcs",[Bg]:"fire-gcs-compat",[jg]:"fire-fst",[zg]:"fire-fst-compat",[qg]:"fire-vertex","fire-js":"fire-js",[$g]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mi=new Map,Hg=new Map,sa=new Map;function Gu(r,e){try{r.container.addComponent(e)}catch(t){ot.debug(`Component ${e.name} failed to register with FirebaseApp ${r.name}`,t)}}function jn(r){const e=r.name;if(sa.has(e))return ot.debug(`There were multiple attempts to register component ${e}.`),!1;sa.set(e,r);for(const t of mi.values())Gu(t,r);for(const t of Hg.values())Gu(t,r);return!0}function La(r,e){const t=r.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),r.container.getProvider(e)}function qe(r){return r==null?!1:r.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wg={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},kt=new ps("app","Firebase",Wg);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qg{constructor(e,t,n){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=n,this.container.addComponent(new mn("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw kt.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ur=Kg;function Jg(r,e={}){let t=r;typeof e!="object"&&(e={name:e});const n={name:ra,automaticDataCollectionEnabled:!0,...e},s=n.name;if(typeof s!="string"||!s)throw kt.create("bad-app-name",{appName:String(s)});if(t||(t=Lh()),!t)throw kt.create("no-options");const i=mi.get(s);if(i){if(fn(t,i.options)&&fn(n,i.config))return i;throw kt.create("duplicate-app",{appName:s})}const o=new tg(s);for(const u of sa.values())o.addComponent(u);const c=new Qg(t,n,o);return mi.set(s,c),c}function Yg(r=ra){const e=mi.get(r);if(!e&&r===ra&&Lh())return Jg();if(!e)throw kt.create("no-app",{appName:r});return e}function Nt(r,e,t){let n=Gg[r]??r;t&&(n+=`-${t}`);const s=n.match(/\s|\//),i=e.match(/\s|\//);if(s||i){const o=[`Unable to register library "${n}" with version "${e}":`];s&&o.push(`library name "${n}" contains illegal characters (whitespace or "/")`),s&&i&&o.push("and"),i&&o.push(`version name "${e}" contains illegal characters (whitespace or "/")`),ot.warn(o.join(" "));return}jn(new mn(`${n}-version`,()=>({library:n,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xg="firebase-heartbeat-database",Zg=1,ts="firebase-heartbeat-store";let qo=null;function Gh(){return qo||(qo=mg(Xg,Zg,{upgrade:(r,e)=>{switch(e){case 0:try{r.createObjectStore(ts)}catch(t){console.warn(t)}}}}).catch(r=>{throw kt.create("idb-open",{originalErrorMessage:r.message})})),qo}async function e_(r){try{const t=(await Gh()).transaction(ts),n=await t.objectStore(ts).get(Hh(r));return await t.done,n}catch(e){if(e instanceof dt)ot.warn(e.message);else{const t=kt.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});ot.warn(t.message)}}}async function Hu(r,e){try{const n=(await Gh()).transaction(ts,"readwrite");await n.objectStore(ts).put(e,Hh(r)),await n.done}catch(t){if(t instanceof dt)ot.warn(t.message);else{const n=kt.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});ot.warn(n.message)}}}function Hh(r){return`${r.name}!${r.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const t_=1024,n_=30;class r_{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new i_(t),this._heartbeatsCachePromise=this._storage.read().then(n=>(this._heartbeatsCache=n,n))}async triggerHeartbeat(){var e,t;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=Wu();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(o=>o.date===i))return;if(this._heartbeatsCache.heartbeats.push({date:i,agent:s}),this._heartbeatsCache.heartbeats.length>n_){const o=o_(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(o,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(n){ot.warn(n)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=Wu(),{heartbeatsToSend:n,unsentEntries:s}=s_(this._heartbeatsCache.heartbeats),i=fi(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=t,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(t){return ot.warn(t),""}}}function Wu(){return new Date().toISOString().substring(0,10)}function s_(r,e=t_){const t=[];let n=r.slice();for(const s of r){const i=t.find(o=>o.agent===s.agent);if(i){if(i.dates.push(s.date),Qu(t)>e){i.dates.pop();break}}else if(t.push({agent:s.agent,dates:[s.date]}),Qu(t)>e){t.pop();break}n=n.slice(1)}return{heartbeatsToSend:t,unsentEntries:n}}class i_{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return qh()?Bp().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await e_(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const n=await this.read();return Hu(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??n.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const n=await this.read();return Hu(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??n.lastSentHeartbeatDate,heartbeats:[...n.heartbeats,...e.heartbeats]})}else return}}function Qu(r){return fi(JSON.stringify({version:2,heartbeats:r})).length}function o_(r){if(r.length===0)return-1;let e=0,t=r[0].date;for(let n=1;n<r.length;n++)r[n].date<t&&(t=r[n].date,e=n);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function a_(r){jn(new mn("platform-logger",e=>new _g(e),"PRIVATE")),jn(new mn("heartbeat",e=>new r_(e),"PRIVATE")),Nt(na,Ku,r),Nt(na,Ku,"esm2020"),Nt("fire-js","")}a_("");function Wh(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const c_=Wh,Qh=new ps("auth","Firebase",Wh());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pi=new Oa("@firebase/auth");function u_(r,...e){pi.logLevel<=H.WARN&&pi.warn(`Auth (${ur}): ${r}`,...e)}function Ys(r,...e){pi.logLevel<=H.ERROR&&pi.error(`Auth (${ur}): ${r}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function at(r,...e){throw Fa(r,...e)}function Xe(r,...e){return Fa(r,...e)}function Jh(r,e,t){const n={...c_(),[e]:t};return new ps("auth","Firebase",n).create(e,{appName:r.name})}function xt(r){return Jh(r,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Fa(r,...e){if(typeof r!="string"){const t=e[0],n=[...e.slice(1)];return n[0]&&(n[0].appName=r.name),r._errorFactory.create(t,...n)}return Qh.create(r,...e)}function B(r,e,...t){if(!r)throw Fa(e,...t)}function rt(r){const e="INTERNAL ASSERTION FAILED: "+r;throw Ys(e),new Error(e)}function ct(r,e){r||rt(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ia(){var r;return typeof self<"u"&&((r=self.location)==null?void 0:r.href)||""}function l_(){return Ju()==="http:"||Ju()==="https:"}function Ju(){var r;return typeof self<"u"&&((r=self.location)==null?void 0:r.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function h_(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(l_()||Lp()||"connection"in navigator)?navigator.onLine:!0}function d_(){if(typeof navigator>"u")return null;const r=navigator;return r.languages&&r.languages[0]||r.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ys{constructor(e,t){this.shortDelay=e,this.longDelay=t,ct(t>e,"Short delay should be less than long delay!"),this.isMobile=Op()||Fp()}get(){return h_()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ua(r,e){ct(r.emulator,"Emulator should always be set here");const{url:t}=r.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yh{static initialize(e,t,n){this.fetchImpl=e,t&&(this.headersImpl=t),n&&(this.responseImpl=n)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;rt("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;rt("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;rt("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const f_={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const m_=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],p_=new ys(3e4,6e4);function ji(r,e){return r.tenantId&&!e.tenantId?{...e,tenantId:r.tenantId}:e}async function lr(r,e,t,n,s={}){return Xh(r,s,async()=>{let i={},o={};n&&(e==="GET"?o=n:i={body:JSON.stringify(n)});const c=gs({key:r.config.apiKey,...o}).slice(1),u=await r._getAdditionalHeaders();u["Content-Type"]="application/json",r.languageCode&&(u["X-Firebase-Locale"]=r.languageCode);const h={method:e,headers:u,...i};return Mp()||(h.referrerPolicy="no-referrer"),r.emulatorConfig&&_s(r.emulatorConfig.host)&&(h.credentials="include"),Yh.fetch()(await ed(r,r.config.apiHost,t,c),h)})}async function Xh(r,e,t){r._canInitEmulator=!1;const n={...f_,...e};try{const s=new g_(r),i=await Promise.race([t(),s.promise]);s.clearNetworkTimeout();const o=await i.json();if("needConfirmation"in o)throw zs(r,"account-exists-with-different-credential",o);if(i.ok&&!("errorMessage"in o))return o;{const c=i.ok?o.errorMessage:o.error.message,[u,h]=c.split(" : ");if(u==="FEDERATED_USER_ID_ALREADY_LINKED")throw zs(r,"credential-already-in-use",o);if(u==="EMAIL_EXISTS")throw zs(r,"email-already-in-use",o);if(u==="USER_DISABLED")throw zs(r,"user-disabled",o);const f=n[u]||u.toLowerCase().replace(/[_\s]+/g,"-");if(h)throw Jh(r,f,h);at(r,f)}}catch(s){if(s instanceof dt)throw s;at(r,"network-request-failed",{message:String(s)})}}async function Zh(r,e,t,n,s={}){const i=await lr(r,e,t,n,s);return"mfaPendingCredential"in i&&at(r,"multi-factor-auth-required",{_serverResponse:i}),i}async function ed(r,e,t,n){const s=`${e}${t}?${n}`,i=r,o=i.config.emulator?Ua(r.config,s):`${r.config.apiScheme}://${s}`;return m_.includes(t)&&(await i._persistenceManagerAvailable,i._getPersistenceType()==="COOKIE")?i._getPersistence()._getFinalTarget(o).toString():o}class g_{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,n)=>{this.timer=setTimeout(()=>n(Xe(this.auth,"network-request-failed")),p_.get())})}}function zs(r,e,t){const n={appName:r.name};t.email&&(n.email=t.email),t.phoneNumber&&(n.phoneNumber=t.phoneNumber);const s=Xe(r,e,n);return s.customData._tokenResponse=t,s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function __(r,e){return lr(r,"POST","/v1/accounts:delete",e)}async function gi(r,e){return lr(r,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $r(r){if(r)try{const e=new Date(Number(r));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function y_(r,e=!1){const t=Fe(r),n=await t.getIdToken(e),s=Ba(n);B(s&&s.exp&&s.auth_time&&s.iat,t.auth,"internal-error");const i=typeof s.firebase=="object"?s.firebase:void 0,o=i==null?void 0:i.sign_in_provider;return{claims:s,token:n,authTime:$r(zo(s.auth_time)),issuedAtTime:$r(zo(s.iat)),expirationTime:$r(zo(s.exp)),signInProvider:o||null,signInSecondFactor:(i==null?void 0:i.sign_in_second_factor)||null}}function zo(r){return Number(r)*1e3}function Ba(r){const[e,t,n]=r.split(".");if(e===void 0||t===void 0||n===void 0)return Ys("JWT malformed, contained fewer than 3 sections"),null;try{const s=xh(t);return s?JSON.parse(s):(Ys("Failed to decode base64 JWT payload"),null)}catch(s){return Ys("Caught error parsing JWT payload as JSON",s==null?void 0:s.toString()),null}}function Yu(r){const e=Ba(r);return B(e,"internal-error"),B(typeof e.exp<"u","internal-error"),B(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ns(r,e,t=!1){if(t)return e;try{return await e}catch(n){throw n instanceof dt&&I_(n)&&r.auth.currentUser===r&&await r.auth.signOut(),n}}function I_({code:r}){return r==="auth/user-disabled"||r==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class T_{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const t=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),t}else{this.errorBackoff=3e4;const n=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,n)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oa{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=$r(this.lastLoginAt),this.creationTime=$r(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _i(r){var p;const e=r.auth,t=await r.getIdToken(),n=await ns(r,gi(e,{idToken:t}));B(n==null?void 0:n.users.length,e,"internal-error");const s=n.users[0];r._notifyReloadListener(s);const i=(p=s.providerUserInfo)!=null&&p.length?td(s.providerUserInfo):[],o=w_(r.providerData,i),c=r.isAnonymous,u=!(r.email&&s.passwordHash)&&!(o!=null&&o.length),h=c?u:!1,f={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:o,metadata:new oa(s.createdAt,s.lastLoginAt),isAnonymous:h};Object.assign(r,f)}async function E_(r){const e=Fe(r);await _i(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function w_(r,e){return[...r.filter(n=>!e.some(s=>s.providerId===n.providerId)),...e]}function td(r){return r.map(({providerId:e,...t})=>({providerId:e,uid:t.rawId||"",displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function v_(r,e){const t=await Xh(r,{},async()=>{const n=gs({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:i}=r.config,o=await ed(r,s,"/v1/token",`key=${i}`),c=await r._getAdditionalHeaders();c["Content-Type"]="application/x-www-form-urlencoded";const u={method:"POST",headers:c,body:n};return r.emulatorConfig&&_s(r.emulatorConfig.host)&&(u.credentials="include"),Yh.fetch()(o,u)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function A_(r,e){return lr(r,"POST","/v2/accounts:revokeToken",ji(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mn{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){B(e.idToken,"internal-error"),B(typeof e.idToken<"u","internal-error"),B(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Yu(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){B(e.length!==0,"internal-error");const t=Yu(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(B(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:n,refreshToken:s,expiresIn:i}=await v_(e,t);this.updateTokensAndExpiration(n,s,Number(i))}updateTokensAndExpiration(e,t,n){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+n*1e3}static fromJSON(e,t){const{refreshToken:n,accessToken:s,expirationTime:i}=t,o=new Mn;return n&&(B(typeof n=="string","internal-error",{appName:e}),o.refreshToken=n),s&&(B(typeof s=="string","internal-error",{appName:e}),o.accessToken=s),i&&(B(typeof i=="number","internal-error",{appName:e}),o.expirationTime=i),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Mn,this.toJSON())}_performRefresh(){return rt("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Et(r,e){B(typeof r=="string"||typeof r>"u","internal-error",{appName:e})}class ze{constructor({uid:e,auth:t,stsTokenManager:n,...s}){this.providerId="firebase",this.proactiveRefresh=new T_(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=n,this.accessToken=n.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new oa(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const t=await ns(this,this.stsTokenManager.getToken(this.auth,e));return B(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return y_(this,e)}reload(){return E_(this)}_assign(e){this!==e&&(B(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>({...t})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new ze({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return t.metadata._copy(this.metadata),t}_onReload(e){B(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let n=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),n=!0),t&&await _i(this),await this.auth._persistUserIfCurrent(this),n&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(qe(this.auth.app))return Promise.reject(xt(this.auth));const e=await this.getIdToken();return await ns(this,__(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){const n=t.displayName??void 0,s=t.email??void 0,i=t.phoneNumber??void 0,o=t.photoURL??void 0,c=t.tenantId??void 0,u=t._redirectEventId??void 0,h=t.createdAt??void 0,f=t.lastLoginAt??void 0,{uid:p,emailVerified:E,isAnonymous:b,providerData:V,stsTokenManager:N}=t;B(p&&N,e,"internal-error");const D=Mn.fromJSON(this.name,N);B(typeof p=="string",e,"internal-error"),Et(n,e.name),Et(s,e.name),B(typeof E=="boolean",e,"internal-error"),B(typeof b=="boolean",e,"internal-error"),Et(i,e.name),Et(o,e.name),Et(c,e.name),Et(u,e.name),Et(h,e.name),Et(f,e.name);const G=new ze({uid:p,auth:e,email:s,emailVerified:E,displayName:n,isAnonymous:b,photoURL:o,phoneNumber:i,tenantId:c,stsTokenManager:D,createdAt:h,lastLoginAt:f});return V&&Array.isArray(V)&&(G.providerData=V.map(z=>({...z}))),u&&(G._redirectEventId=u),G}static async _fromIdTokenResponse(e,t,n=!1){const s=new Mn;s.updateFromServerResponse(t);const i=new ze({uid:t.localId,auth:e,stsTokenManager:s,isAnonymous:n});return await _i(i),i}static async _fromGetAccountInfoResponse(e,t,n){const s=t.users[0];B(s.localId!==void 0,"internal-error");const i=s.providerUserInfo!==void 0?td(s.providerUserInfo):[],o=!(s.email&&s.passwordHash)&&!(i!=null&&i.length),c=new Mn;c.updateFromIdToken(n);const u=new ze({uid:s.localId,auth:e,stsTokenManager:c,isAnonymous:o}),h={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:i,metadata:new oa(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!(i!=null&&i.length)};return Object.assign(u,h),u}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xu=new Map;function st(r){ct(r instanceof Function,"Expected a class definition");let e=Xu.get(r);return e?(ct(e instanceof r,"Instance stored in cache mismatched with class"),e):(e=new r,Xu.set(r,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nd{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}nd.type="NONE";const Zu=nd;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xs(r,e,t){return`firebase:${r}:${e}:${t}`}class Ln{constructor(e,t,n){this.persistence=e,this.auth=t,this.userKey=n;const{config:s,name:i}=this.auth;this.fullUserKey=Xs(this.userKey,s.apiKey,i),this.fullPersistenceKey=Xs("persistence",s.apiKey,i),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await gi(this.auth,{idToken:e}).catch(()=>{});return t?ze._fromGetAccountInfoResponse(this.auth,t,e):null}return ze._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,n="authUser"){if(!t.length)return new Ln(st(Zu),e,n);const s=(await Promise.all(t.map(async h=>{if(await h._isAvailable())return h}))).filter(h=>h);let i=s[0]||st(Zu);const o=Xs(n,e.config.apiKey,e.name);let c=null;for(const h of t)try{const f=await h._get(o);if(f){let p;if(typeof f=="string"){const E=await gi(e,{idToken:f}).catch(()=>{});if(!E)break;p=await ze._fromGetAccountInfoResponse(e,E,f)}else p=ze._fromJSON(e,f);h!==i&&(c=p),i=h;break}}catch{}const u=s.filter(h=>h._shouldAllowMigration);return!i._shouldAllowMigration||!u.length?new Ln(i,e,n):(i=u[0],c&&await i._set(o,c.toJSON()),await Promise.all(t.map(async h=>{if(h!==i)try{await h._remove(o)}catch{}})),new Ln(i,e,n))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function el(r){const e=r.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(od(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(rd(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(cd(e))return"Blackberry";if(ud(e))return"Webos";if(sd(e))return"Safari";if((e.includes("chrome/")||id(e))&&!e.includes("edge/"))return"Chrome";if(ad(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,n=r.match(t);if((n==null?void 0:n.length)===2)return n[1]}return"Other"}function rd(r=ge()){return/firefox\//i.test(r)}function sd(r=ge()){const e=r.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function id(r=ge()){return/crios\//i.test(r)}function od(r=ge()){return/iemobile/i.test(r)}function ad(r=ge()){return/android/i.test(r)}function cd(r=ge()){return/blackberry/i.test(r)}function ud(r=ge()){return/webos/i.test(r)}function ja(r=ge()){return/iphone|ipad|ipod/i.test(r)||/macintosh/i.test(r)&&/mobile/i.test(r)}function S_(r=ge()){var e;return ja(r)&&!!((e=window.navigator)!=null&&e.standalone)}function R_(){return Up()&&document.documentMode===10}function ld(r=ge()){return ja(r)||ad(r)||ud(r)||cd(r)||/windows phone/i.test(r)||od(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hd(r,e=[]){let t;switch(r){case"Browser":t=el(ge());break;case"Worker":t=`${el(ge())}-${r}`;break;default:t=r}const n=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${ur}/${n}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class b_{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const n=i=>new Promise((o,c)=>{try{const u=e(i);o(u)}catch(u){c(u)}});n.onAbort=t,this.queue.push(n);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const n of this.queue)await n(e),n.onAbort&&t.push(n.onAbort)}catch(n){t.reverse();for(const s of t)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:n==null?void 0:n.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function P_(r,e={}){return lr(r,"GET","/v2/passwordPolicy",ji(r,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const C_=6;class V_{constructor(e){var n;const t=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=t.minPasswordLength??C_,t.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=t.maxPasswordLength),t.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=t.containsLowercaseCharacter),t.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=t.containsUppercaseCharacter),t.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=t.containsNumericCharacter),t.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=t.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((n=e.allowedNonAlphanumericCharacters)==null?void 0:n.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&(t.isValid=t.meetsMinPasswordLength??!0),t.isValid&&(t.isValid=t.meetsMaxPasswordLength??!0),t.isValid&&(t.isValid=t.containsLowercaseLetter??!0),t.isValid&&(t.isValid=t.containsUppercaseLetter??!0),t.isValid&&(t.isValid=t.containsNumericCharacter??!0),t.isValid&&(t.isValid=t.containsNonAlphanumericCharacter??!0),t}validatePasswordLengthOptions(e,t){const n=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;n&&(t.meetsMinPasswordLength=e.length>=n),s&&(t.meetsMaxPasswordLength=e.length<=s)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let n;for(let s=0;s<e.length;s++)n=e.charAt(s),this.updatePasswordCharacterOptionsStatuses(t,n>="a"&&n<="z",n>="A"&&n<="Z",n>="0"&&n<="9",this.allowedNonAlphanumericCharacters.includes(n))}updatePasswordCharacterOptionsStatuses(e,t,n,s,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=n)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class D_{constructor(e,t,n,s){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=n,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new tl(this),this.idTokenSubscription=new tl(this),this.beforeStateQueue=new b_(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Qh,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion,this._persistenceManagerAvailable=new Promise(i=>this._resolvePersistenceManagerAvailable=i)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=st(t)),this._initializationPromise=this.queue(async()=>{var n,s,i;if(!this._deleted&&(this.persistenceManager=await Ln.create(this,e),(n=this._resolvePersistenceManagerAvailable)==null||n.call(this),!this._deleted)){if((s=this._popupRedirectResolver)!=null&&s._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((i=this.currentUser)==null?void 0:i.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await gi(this,{idToken:e}),n=await ze._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(n)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var i;if(qe(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(c=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(c,c))}):this.directlySetCurrentUser(null)}const t=await this.assertedPersistence.getCurrentUser();let n=t,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(i=this.redirectUser)==null?void 0:i._redirectEventId,c=n==null?void 0:n._redirectEventId,u=await this.tryRedirectSignIn(e);(!o||o===c)&&(u!=null&&u.user)&&(n=u.user,s=!0)}if(!n)return this.directlySetCurrentUser(null);if(!n._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(n)}catch(o){n=t,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return n?this.reloadAndSetCurrentUserOrClear(n):this.directlySetCurrentUser(null)}return B(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===n._redirectEventId?this.directlySetCurrentUser(n):this.reloadAndSetCurrentUserOrClear(n)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await _i(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=d_()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(qe(this.app))return Promise.reject(xt(this));const t=e?Fe(e):null;return t&&B(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&B(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return qe(this.app)?Promise.reject(xt(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return qe(this.app)?Promise.reject(xt(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(st(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await P_(this),t=new V_(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new ps("auth","Firebase",e())}onAuthStateChanged(e,t,n){return this.registerStateListener(this.authStateSubscription,e,t,n)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,n){return this.registerStateListener(this.idTokenSubscription,e,t,n)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const n=this.onAuthStateChanged(()=>{n(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),n={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(n.tenantId=this.tenantId),await A_(this,n)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,t){const n=await this.getOrInitRedirectPersistenceManager(t);return e===null?n.removeCurrentUser():n.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&st(e)||this._popupRedirectResolver;B(t,this,"argument-error"),this.redirectPersistenceManager=await Ln.create(this,[st(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,n;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)==null?void 0:t._redirectEventId)===e?this._currentUser:((n=this.redirectUser)==null?void 0:n._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((t=this.currentUser)==null?void 0:t.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,n,s){if(this._deleted)return()=>{};const i=typeof t=="function"?t:t.next.bind(t);let o=!1;const c=this._isInitialized?Promise.resolve():this._initializationPromise;if(B(c,this,"internal-error"),c.then(()=>{o||i(this.currentUser)}),typeof t=="function"){const u=e.addObserver(t,n,s);return()=>{o=!0,u()}}else{const u=e.addObserver(t);return()=>{o=!0,u()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return B(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=hd(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var s;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const t=await((s=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:s.getHeartbeatsHeader());t&&(e["X-Firebase-Client"]=t);const n=await this._getAppCheckToken();return n&&(e["X-Firebase-AppCheck"]=n),e}async _getAppCheckToken(){var t;if(qe(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((t=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:t.getToken());return e!=null&&e.error&&u_(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function qi(r){return Fe(r)}class tl{constructor(e){this.auth=e,this.observer=null,this.addObserver=Kp(t=>this.observer=t)}get next(){return B(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let qa={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function k_(r){qa=r}function N_(r){return qa.loadJS(r)}function x_(){return qa.gapiScript}function O_(r){return`__${r}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function M_(r,e){const t=La(r,"auth");if(t.isInitialized()){const s=t.getImmediate(),i=t.getOptions();if(fn(i,e??{}))return s;at(s,"already-initialized")}return t.initialize({options:e})}function L_(r,e){const t=(e==null?void 0:e.persistence)||[],n=(Array.isArray(t)?t:[t]).map(st);e!=null&&e.errorMap&&r._updateErrorMap(e.errorMap),r._initializeWithPersistence(n,e==null?void 0:e.popupRedirectResolver)}function F_(r,e,t){const n=qi(r);B(/^https?:\/\//.test(e),n,"invalid-emulator-scheme");const s=!1,i=dd(e),{host:o,port:c}=U_(e),u=c===null?"":`:${c}`,h={url:`${i}//${o}${u}/`},f=Object.freeze({host:o,port:c,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:s})});if(!n._canInitEmulator){B(n.config.emulator&&n.emulatorConfig,n,"emulator-config-failed"),B(fn(h,n.config.emulator)&&fn(f,n.emulatorConfig),n,"emulator-config-failed");return}n.config.emulator=h,n.emulatorConfig=f,n.settings.appVerificationDisabledForTesting=!0,_s(o)?zh(`${i}//${o}${u}`):B_()}function dd(r){const e=r.indexOf(":");return e<0?"":r.substr(0,e+1)}function U_(r){const e=dd(r),t=/(\/\/)?([^?#/]+)/.exec(r.substr(e.length));if(!t)return{host:"",port:null};const n=t[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(n);if(s){const i=s[1];return{host:i,port:nl(n.substr(i.length+1))}}else{const[i,o]=n.split(":");return{host:i,port:nl(o)}}}function nl(r){if(!r)return null;const e=Number(r);return isNaN(e)?null:e}function B_(){function r(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",r):r())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fd{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return rt("not implemented")}_getIdTokenResponse(e){return rt("not implemented")}_linkToIdToken(e,t){return rt("not implemented")}_getReauthenticationResolver(e){return rt("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Fn(r,e){return Zh(r,"POST","/v1/accounts:signInWithIdp",ji(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const j_="http://localhost";class pn extends fd{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new pn(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):at("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:n,signInMethod:s,...i}=t;if(!n||!s)return null;const o=new pn(n,s);return o.idToken=i.idToken||void 0,o.accessToken=i.accessToken||void 0,o.secret=i.secret,o.nonce=i.nonce,o.pendingToken=i.pendingToken||null,o}_getIdTokenResponse(e){const t=this.buildRequest();return Fn(e,t)}_linkToIdToken(e,t){const n=this.buildRequest();return n.idToken=t,Fn(e,n)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,Fn(e,t)}buildRequest(){const e={requestUri:j_,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=gs(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class md{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Is extends md{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class St extends Is{constructor(){super("facebook.com")}static credential(e){return pn._fromParams({providerId:St.PROVIDER_ID,signInMethod:St.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return St.credentialFromTaggedObject(e)}static credentialFromError(e){return St.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return St.credential(e.oauthAccessToken)}catch{return null}}}St.FACEBOOK_SIGN_IN_METHOD="facebook.com";St.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rt extends Is{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return pn._fromParams({providerId:Rt.PROVIDER_ID,signInMethod:Rt.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Rt.credentialFromTaggedObject(e)}static credentialFromError(e){return Rt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:n}=e;if(!t&&!n)return null;try{return Rt.credential(t,n)}catch{return null}}}Rt.GOOGLE_SIGN_IN_METHOD="google.com";Rt.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bt extends Is{constructor(){super("github.com")}static credential(e){return pn._fromParams({providerId:bt.PROVIDER_ID,signInMethod:bt.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return bt.credentialFromTaggedObject(e)}static credentialFromError(e){return bt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return bt.credential(e.oauthAccessToken)}catch{return null}}}bt.GITHUB_SIGN_IN_METHOD="github.com";bt.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pt extends Is{constructor(){super("twitter.com")}static credential(e,t){return pn._fromParams({providerId:Pt.PROVIDER_ID,signInMethod:Pt.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return Pt.credentialFromTaggedObject(e)}static credentialFromError(e){return Pt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:n}=e;if(!t||!n)return null;try{return Pt.credential(t,n)}catch{return null}}}Pt.TWITTER_SIGN_IN_METHOD="twitter.com";Pt.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function q_(r,e){return Zh(r,"POST","/v1/accounts:signUp",ji(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lt{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,n,s=!1){const i=await ze._fromIdTokenResponse(e,n,s),o=rl(n);return new Lt({user:i,providerId:o,_tokenResponse:n,operationType:t})}static async _forOperation(e,t,n){await e._updateTokensIfNecessary(n,!0);const s=rl(n);return new Lt({user:e,providerId:s,_tokenResponse:n,operationType:t})}}function rl(r){return r.providerId?r.providerId:"phoneNumber"in r?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Xw(r){var s;if(qe(r.app))return Promise.reject(xt(r));const e=qi(r);if(await e._initializationPromise,(s=e.currentUser)!=null&&s.isAnonymous)return new Lt({user:e.currentUser,providerId:null,operationType:"signIn"});const t=await q_(e,{returnSecureToken:!0}),n=await Lt._fromIdTokenResponse(e,"signIn",t,!0);return await e._updateCurrentUser(n.user),n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yi extends dt{constructor(e,t,n,s){super(t.code,t.message),this.operationType=n,this.user=s,Object.setPrototypeOf(this,yi.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:t.customData._serverResponse,operationType:n}}static _fromErrorAndOperation(e,t,n,s){return new yi(e,t,n,s)}}function pd(r,e,t,n){return(e==="reauthenticate"?t._getReauthenticationResolver(r):t._getIdTokenResponse(r)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?yi._fromErrorAndOperation(r,i,e,n):i})}async function z_(r,e,t=!1){const n=await ns(r,e._linkToIdToken(r.auth,await r.getIdToken()),t);return Lt._forOperation(r,"link",n)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function $_(r,e,t=!1){const{auth:n}=r;if(qe(n.app))return Promise.reject(xt(n));const s="reauthenticate";try{const i=await ns(r,pd(n,s,e,r),t);B(i.idToken,n,"internal-error");const o=Ba(i.idToken);B(o,n,"internal-error");const{sub:c}=o;return B(r.uid===c,n,"user-mismatch"),Lt._forOperation(r,s,i)}catch(i){throw(i==null?void 0:i.code)==="auth/user-not-found"&&at(n,"user-mismatch"),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function K_(r,e,t=!1){if(qe(r.app))return Promise.reject(xt(r));const n="signIn",s=await pd(r,n,e),i=await Lt._fromIdTokenResponse(r,n,s);return t||await r._updateCurrentUser(i.user),i}function G_(r,e,t,n){return Fe(r).onIdTokenChanged(e,t,n)}function H_(r,e,t){return Fe(r).beforeAuthStateChanged(e,t)}const Ii="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gd{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Ii,"1"),this.storage.removeItem(Ii),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const W_=1e3,Q_=10;class _d extends gd{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=ld(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const n=this.storage.getItem(t),s=this.localCache[t];n!==s&&e(t,s,n)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((o,c,u)=>{this.notifyListeners(o,u)});return}const n=e.key;t?this.detachListener():this.stopPolling();const s=()=>{const o=this.storage.getItem(n);!t&&this.localCache[n]===o||this.notifyListeners(n,o)},i=this.storage.getItem(n);R_()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,Q_):s()}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const s of Array.from(n))s(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,n)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:n}),!0)})},W_)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}_d.type="LOCAL";const J_=_d;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yd extends gd{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}yd.type="SESSION";const Id=yd;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Y_(r){return Promise.all(r.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zi{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(s=>s.isListeningto(e));if(t)return t;const n=new zi(e);return this.receivers.push(n),n}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:n,eventType:s,data:i}=t.data,o=this.handlersMap[s];if(!(o!=null&&o.size))return;t.ports[0].postMessage({status:"ack",eventId:n,eventType:s});const c=Array.from(o).map(async h=>h(t.origin,i)),u=await Y_(c);t.ports[0].postMessage({status:"done",eventId:n,eventType:s,response:u})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}zi.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function za(r="",e=10){let t="";for(let n=0;n<e;n++)t+=Math.floor(Math.random()*10);return r+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class X_{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,n=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let i,o;return new Promise((c,u)=>{const h=za("",20);s.port1.start();const f=setTimeout(()=>{u(new Error("unsupported_event"))},n);o={messageChannel:s,onMessage(p){const E=p;if(E.data.eventId===h)switch(E.data.status){case"ack":clearTimeout(f),i=setTimeout(()=>{u(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),c(E.data.response);break;default:clearTimeout(f),clearTimeout(i),u(new Error("invalid_response"));break}}},this.handlers.add(o),s.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:h,data:t},[s.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ze(){return window}function Z_(r){Ze().location.href=r}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Td(){return typeof Ze().WorkerGlobalScope<"u"&&typeof Ze().importScripts=="function"}async function ey(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function ty(){var r;return((r=navigator==null?void 0:navigator.serviceWorker)==null?void 0:r.controller)||null}function ny(){return Td()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ed="firebaseLocalStorageDb",ry=1,Ti="firebaseLocalStorage",wd="fbase_key";class Ts{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function $i(r,e){return r.transaction([Ti],e?"readwrite":"readonly").objectStore(Ti)}function sy(){const r=indexedDB.deleteDatabase(Ed);return new Ts(r).toPromise()}function aa(){const r=indexedDB.open(Ed,ry);return new Promise((e,t)=>{r.addEventListener("error",()=>{t(r.error)}),r.addEventListener("upgradeneeded",()=>{const n=r.result;try{n.createObjectStore(Ti,{keyPath:wd})}catch(s){t(s)}}),r.addEventListener("success",async()=>{const n=r.result;n.objectStoreNames.contains(Ti)?e(n):(n.close(),await sy(),e(await aa()))})})}async function sl(r,e,t){const n=$i(r,!0).put({[wd]:e,value:t});return new Ts(n).toPromise()}async function iy(r,e){const t=$i(r,!1).get(e),n=await new Ts(t).toPromise();return n===void 0?null:n.value}function il(r,e){const t=$i(r,!0).delete(e);return new Ts(t).toPromise()}const oy=800,ay=3;class vd{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await aa(),this.db)}async _withRetries(e){let t=0;for(;;)try{const n=await this._openDb();return await e(n)}catch(n){if(t++>ay)throw n;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return Td()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=zi._getInstance(ny()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var t,n;if(this.activeServiceWorker=await ey(),!this.activeServiceWorker)return;this.sender=new X_(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(t=e[0])!=null&&t.fulfilled&&(n=e[0])!=null&&n.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||ty()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await aa();return await sl(e,Ii,"1"),await il(e,Ii),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(n=>sl(n,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(n=>iy(n,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>il(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(s=>{const i=$i(s,!1).getAll();return new Ts(i).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],n=new Set;if(e.length!==0)for(const{fbase_key:s,value:i}of e)n.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(i)&&(this.notifyListeners(s,i),t.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!n.has(s)&&(this.notifyListeners(s,null),t.push(s));return t}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const s of Array.from(n))s(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),oy)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}vd.type="LOCAL";const cy=vd;new ys(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function uy(r,e){return e?st(e):(B(r._popupRedirectResolver,r,"argument-error"),r._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $a extends fd{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Fn(e,this._buildIdpRequest())}_linkToIdToken(e,t){return Fn(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return Fn(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function ly(r){return K_(r.auth,new $a(r),r.bypassAuthState)}function hy(r){const{auth:e,user:t}=r;return B(t,e,"internal-error"),$_(t,new $a(r),r.bypassAuthState)}async function dy(r){const{auth:e,user:t}=r;return B(t,e,"internal-error"),z_(t,new $a(r),r.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ad{constructor(e,t,n,s,i=!1){this.auth=e,this.resolver=n,this.user=s,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(n){this.reject(n)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:n,postBody:s,tenantId:i,error:o,type:c}=e;if(o){this.reject(o);return}const u={auth:this.auth,requestUri:t,sessionId:n,tenantId:i||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(c)(u))}catch(h){this.reject(h)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return ly;case"linkViaPopup":case"linkViaRedirect":return dy;case"reauthViaPopup":case"reauthViaRedirect":return hy;default:at(this.auth,"internal-error")}}resolve(e){ct(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){ct(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fy=new ys(2e3,1e4);class On extends Ad{constructor(e,t,n,s,i){super(e,t,s,i),this.provider=n,this.authWindow=null,this.pollId=null,On.currentPopupAction&&On.currentPopupAction.cancel(),On.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return B(e,this.auth,"internal-error"),e}async onExecution(){ct(this.filter.length===1,"Popup operations only handle one event");const e=za();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(Xe(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(Xe(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,On.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,n;if((n=(t=this.authWindow)==null?void 0:t.window)!=null&&n.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Xe(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,fy.get())};e()}}On.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const my="pendingRedirect",Zs=new Map;class py extends Ad{constructor(e,t,n=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,n),this.eventId=null}async execute(){let e=Zs.get(this.auth._key());if(!e){try{const n=await gy(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(n)}catch(t){e=()=>Promise.reject(t)}Zs.set(this.auth._key(),e)}return this.bypassAuthState||Zs.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function gy(r,e){const t=Iy(e),n=yy(r);if(!await n._isAvailable())return!1;const s=await n._get(t)==="true";return await n._remove(t),s}function _y(r,e){Zs.set(r._key(),e)}function yy(r){return st(r._redirectPersistence)}function Iy(r){return Xs(my,r.config.apiKey,r.name)}async function Ty(r,e,t=!1){if(qe(r.app))return Promise.reject(xt(r));const n=qi(r),s=uy(n,e),o=await new py(n,s,t).execute();return o&&!t&&(delete o.user._redirectEventId,await n._persistUserIfCurrent(o.user),await n._setRedirectUser(null,e)),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ey=600*1e3;class wy{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(n=>{this.isEventForConsumer(e,n)&&(t=!0,this.sendToConsumer(e,n),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!vy(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var n;if(e.error&&!Sd(e)){const s=((n=e.error.code)==null?void 0:n.split("auth/")[1])||"internal-error";t.onError(Xe(this.auth,s))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const n=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&n}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Ey&&this.cachedEventUids.clear(),this.cachedEventUids.has(ol(e))}saveEventToCache(e){this.cachedEventUids.add(ol(e)),this.lastProcessedEventTime=Date.now()}}function ol(r){return[r.type,r.eventId,r.sessionId,r.tenantId].filter(e=>e).join("-")}function Sd({type:r,error:e}){return r==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function vy(r){switch(r.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Sd(r);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ay(r,e={}){return lr(r,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sy=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Ry=/^https?/;async function by(r){if(r.config.emulator)return;const{authorizedDomains:e}=await Ay(r);for(const t of e)try{if(Py(t))return}catch{}at(r,"unauthorized-domain")}function Py(r){const e=ia(),{protocol:t,hostname:n}=new URL(e);if(r.startsWith("chrome-extension://")){const o=new URL(r);return o.hostname===""&&n===""?t==="chrome-extension:"&&r.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&o.hostname===n}if(!Ry.test(t))return!1;if(Sy.test(r))return n===r;const s=r.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(n)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cy=new ys(3e4,6e4);function al(){const r=Ze().___jsl;if(r!=null&&r.H){for(const e of Object.keys(r.H))if(r.H[e].r=r.H[e].r||[],r.H[e].L=r.H[e].L||[],r.H[e].r=[...r.H[e].L],r.CP)for(let t=0;t<r.CP.length;t++)r.CP[t]=null}}function Vy(r){return new Promise((e,t)=>{var s,i,o;function n(){al(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{al(),t(Xe(r,"network-request-failed"))},timeout:Cy.get()})}if((i=(s=Ze().gapi)==null?void 0:s.iframes)!=null&&i.Iframe)e(gapi.iframes.getContext());else if((o=Ze().gapi)!=null&&o.load)n();else{const c=O_("iframefcb");return Ze()[c]=()=>{gapi.load?n():t(Xe(r,"network-request-failed"))},N_(`${x_()}?onload=${c}`).catch(u=>t(u))}}).catch(e=>{throw ei=null,e})}let ei=null;function Dy(r){return ei=ei||Vy(r),ei}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ky=new ys(5e3,15e3),Ny="__/auth/iframe",xy="emulator/auth/iframe",Oy={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},My=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Ly(r){const e=r.config;B(e.authDomain,r,"auth-domain-config-required");const t=e.emulator?Ua(e,xy):`https://${r.config.authDomain}/${Ny}`,n={apiKey:e.apiKey,appName:r.name,v:ur},s=My.get(r.config.apiHost);s&&(n.eid=s);const i=r._getFrameworks();return i.length&&(n.fw=i.join(",")),`${t}?${gs(n).slice(1)}`}async function Fy(r){const e=await Dy(r),t=Ze().gapi;return B(t,r,"internal-error"),e.open({where:document.body,url:Ly(r),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Oy,dontclear:!0},n=>new Promise(async(s,i)=>{await n.restyle({setHideOnLeave:!1});const o=Xe(r,"network-request-failed"),c=Ze().setTimeout(()=>{i(o)},ky.get());function u(){Ze().clearTimeout(c),s(n)}n.ping(u).then(u,()=>{i(o)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Uy={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},By=500,jy=600,qy="_blank",zy="http://localhost";class cl{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function $y(r,e,t,n=By,s=jy){const i=Math.max((window.screen.availHeight-s)/2,0).toString(),o=Math.max((window.screen.availWidth-n)/2,0).toString();let c="";const u={...Uy,width:n.toString(),height:s.toString(),top:i,left:o},h=ge().toLowerCase();t&&(c=id(h)?qy:t),rd(h)&&(e=e||zy,u.scrollbars="yes");const f=Object.entries(u).reduce((E,[b,V])=>`${E}${b}=${V},`,"");if(S_(h)&&c!=="_self")return Ky(e||"",c),new cl(null);const p=window.open(e||"",c,f);B(p,r,"popup-blocked");try{p.focus()}catch{}return new cl(p)}function Ky(r,e){const t=document.createElement("a");t.href=r,t.target=e;const n=document.createEvent("MouseEvent");n.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(n)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gy="__/auth/handler",Hy="emulator/auth/handler",Wy=encodeURIComponent("fac");async function ul(r,e,t,n,s,i){B(r.config.authDomain,r,"auth-domain-config-required"),B(r.config.apiKey,r,"invalid-api-key");const o={apiKey:r.config.apiKey,appName:r.name,authType:t,redirectUrl:n,v:ur,eventId:s};if(e instanceof md){e.setDefaultLanguage(r.languageCode),o.providerId=e.providerId||"",$p(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[f,p]of Object.entries({}))o[f]=p}if(e instanceof Is){const f=e.getScopes().filter(p=>p!=="");f.length>0&&(o.scopes=f.join(","))}r.tenantId&&(o.tid=r.tenantId);const c=o;for(const f of Object.keys(c))c[f]===void 0&&delete c[f];const u=await r._getAppCheckToken(),h=u?`#${Wy}=${encodeURIComponent(u)}`:"";return`${Qy(r)}?${gs(c).slice(1)}${h}`}function Qy({config:r}){return r.emulator?Ua(r,Hy):`https://${r.authDomain}/${Gy}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $o="webStorageSupport";class Jy{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Id,this._completeRedirectFn=Ty,this._overrideRedirectResult=_y}async _openPopup(e,t,n,s){var o;ct((o=this.eventManagers[e._key()])==null?void 0:o.manager,"_initialize() not called before _openPopup()");const i=await ul(e,t,n,ia(),s);return $y(e,i,za())}async _openRedirect(e,t,n,s){await this._originValidation(e);const i=await ul(e,t,n,ia(),s);return Z_(i),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:s,promise:i}=this.eventManagers[t];return s?Promise.resolve(s):(ct(i,"If manager is not set, promise should be"),i)}const n=this.initAndGetManager(e);return this.eventManagers[t]={promise:n},n.catch(()=>{delete this.eventManagers[t]}),n}async initAndGetManager(e){const t=await Fy(e),n=new wy(e);return t.register("authEvent",s=>(B(s==null?void 0:s.authEvent,e,"invalid-auth-event"),{status:n.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:n},this.iframes[e._key()]=t,n}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send($o,{type:$o},s=>{var o;const i=(o=s==null?void 0:s[0])==null?void 0:o[$o];i!==void 0&&t(!!i),at(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=by(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return ld()||sd()||ja()}}const Yy=Jy;var ll="@firebase/auth",hl="1.13.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xy{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(n=>{e((n==null?void 0:n.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){B(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zy(r){switch(r){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function eI(r){jn(new mn("auth",(e,{options:t})=>{const n=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:o,authDomain:c}=n.options;B(o&&!o.includes(":"),"invalid-api-key",{appName:n.name});const u={apiKey:o,authDomain:c,clientPlatform:r,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:hd(r)},h=new D_(n,s,i,u);return L_(h,t),h},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,n)=>{e.getProvider("auth-internal").initialize()})),jn(new mn("auth-internal",e=>{const t=qi(e.getProvider("auth").getImmediate());return(n=>new Xy(n))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),Nt(ll,hl,Zy(r)),Nt(ll,hl,"esm2020")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tI=300,nI=Fh("authIdTokenMaxAge")||tI;let dl=null;const rI=r=>async e=>{const t=e&&await e.getIdTokenResult(),n=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(n&&n>nI)return;const s=t==null?void 0:t.token;dl!==s&&(dl=s,await fetch(r,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function Zw(r=Yg()){const e=La(r,"auth");if(e.isInitialized())return e.getImmediate();const t=M_(r,{popupRedirectResolver:Yy,persistence:[cy,J_,Id]}),n=Fh("authTokenSyncURL");if(n&&typeof isSecureContext=="boolean"&&isSecureContext){const i=new URL(n,location.origin);if(location.origin===i.origin){const o=rI(i.toString());H_(t,o,()=>o(t.currentUser)),G_(t,c=>o(c))}}const s=Mh("auth");return s&&F_(t,`http://${s}`),t}function sI(){var r;return((r=document.getElementsByTagName("head"))==null?void 0:r[0])??document}k_({loadJS(r){return new Promise((e,t)=>{const n=document.createElement("script");n.setAttribute("src",r),n.onload=e,n.onerror=s=>{const i=Xe("internal-error");i.customData=s,t(i)},n.type="text/javascript",n.charset="UTF-8",sI().appendChild(n)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});eI("Browser");var fl=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Ot,Rd;(function(){var r;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(I,g){function y(){}y.prototype=g.prototype,I.F=g.prototype,I.prototype=new y,I.prototype.constructor=I,I.D=function(w,T,S){for(var _=Array(arguments.length-2),Ve=2;Ve<arguments.length;Ve++)_[Ve-2]=arguments[Ve];return g.prototype[T].apply(w,_)}}function t(){this.blockSize=-1}function n(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}e(n,t),n.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(I,g,y){y||(y=0);const w=Array(16);if(typeof g=="string")for(var T=0;T<16;++T)w[T]=g.charCodeAt(y++)|g.charCodeAt(y++)<<8|g.charCodeAt(y++)<<16|g.charCodeAt(y++)<<24;else for(T=0;T<16;++T)w[T]=g[y++]|g[y++]<<8|g[y++]<<16|g[y++]<<24;g=I.g[0],y=I.g[1],T=I.g[2];let S=I.g[3],_;_=g+(S^y&(T^S))+w[0]+3614090360&4294967295,g=y+(_<<7&4294967295|_>>>25),_=S+(T^g&(y^T))+w[1]+3905402710&4294967295,S=g+(_<<12&4294967295|_>>>20),_=T+(y^S&(g^y))+w[2]+606105819&4294967295,T=S+(_<<17&4294967295|_>>>15),_=y+(g^T&(S^g))+w[3]+3250441966&4294967295,y=T+(_<<22&4294967295|_>>>10),_=g+(S^y&(T^S))+w[4]+4118548399&4294967295,g=y+(_<<7&4294967295|_>>>25),_=S+(T^g&(y^T))+w[5]+1200080426&4294967295,S=g+(_<<12&4294967295|_>>>20),_=T+(y^S&(g^y))+w[6]+2821735955&4294967295,T=S+(_<<17&4294967295|_>>>15),_=y+(g^T&(S^g))+w[7]+4249261313&4294967295,y=T+(_<<22&4294967295|_>>>10),_=g+(S^y&(T^S))+w[8]+1770035416&4294967295,g=y+(_<<7&4294967295|_>>>25),_=S+(T^g&(y^T))+w[9]+2336552879&4294967295,S=g+(_<<12&4294967295|_>>>20),_=T+(y^S&(g^y))+w[10]+4294925233&4294967295,T=S+(_<<17&4294967295|_>>>15),_=y+(g^T&(S^g))+w[11]+2304563134&4294967295,y=T+(_<<22&4294967295|_>>>10),_=g+(S^y&(T^S))+w[12]+1804603682&4294967295,g=y+(_<<7&4294967295|_>>>25),_=S+(T^g&(y^T))+w[13]+4254626195&4294967295,S=g+(_<<12&4294967295|_>>>20),_=T+(y^S&(g^y))+w[14]+2792965006&4294967295,T=S+(_<<17&4294967295|_>>>15),_=y+(g^T&(S^g))+w[15]+1236535329&4294967295,y=T+(_<<22&4294967295|_>>>10),_=g+(T^S&(y^T))+w[1]+4129170786&4294967295,g=y+(_<<5&4294967295|_>>>27),_=S+(y^T&(g^y))+w[6]+3225465664&4294967295,S=g+(_<<9&4294967295|_>>>23),_=T+(g^y&(S^g))+w[11]+643717713&4294967295,T=S+(_<<14&4294967295|_>>>18),_=y+(S^g&(T^S))+w[0]+3921069994&4294967295,y=T+(_<<20&4294967295|_>>>12),_=g+(T^S&(y^T))+w[5]+3593408605&4294967295,g=y+(_<<5&4294967295|_>>>27),_=S+(y^T&(g^y))+w[10]+38016083&4294967295,S=g+(_<<9&4294967295|_>>>23),_=T+(g^y&(S^g))+w[15]+3634488961&4294967295,T=S+(_<<14&4294967295|_>>>18),_=y+(S^g&(T^S))+w[4]+3889429448&4294967295,y=T+(_<<20&4294967295|_>>>12),_=g+(T^S&(y^T))+w[9]+568446438&4294967295,g=y+(_<<5&4294967295|_>>>27),_=S+(y^T&(g^y))+w[14]+3275163606&4294967295,S=g+(_<<9&4294967295|_>>>23),_=T+(g^y&(S^g))+w[3]+4107603335&4294967295,T=S+(_<<14&4294967295|_>>>18),_=y+(S^g&(T^S))+w[8]+1163531501&4294967295,y=T+(_<<20&4294967295|_>>>12),_=g+(T^S&(y^T))+w[13]+2850285829&4294967295,g=y+(_<<5&4294967295|_>>>27),_=S+(y^T&(g^y))+w[2]+4243563512&4294967295,S=g+(_<<9&4294967295|_>>>23),_=T+(g^y&(S^g))+w[7]+1735328473&4294967295,T=S+(_<<14&4294967295|_>>>18),_=y+(S^g&(T^S))+w[12]+2368359562&4294967295,y=T+(_<<20&4294967295|_>>>12),_=g+(y^T^S)+w[5]+4294588738&4294967295,g=y+(_<<4&4294967295|_>>>28),_=S+(g^y^T)+w[8]+2272392833&4294967295,S=g+(_<<11&4294967295|_>>>21),_=T+(S^g^y)+w[11]+1839030562&4294967295,T=S+(_<<16&4294967295|_>>>16),_=y+(T^S^g)+w[14]+4259657740&4294967295,y=T+(_<<23&4294967295|_>>>9),_=g+(y^T^S)+w[1]+2763975236&4294967295,g=y+(_<<4&4294967295|_>>>28),_=S+(g^y^T)+w[4]+1272893353&4294967295,S=g+(_<<11&4294967295|_>>>21),_=T+(S^g^y)+w[7]+4139469664&4294967295,T=S+(_<<16&4294967295|_>>>16),_=y+(T^S^g)+w[10]+3200236656&4294967295,y=T+(_<<23&4294967295|_>>>9),_=g+(y^T^S)+w[13]+681279174&4294967295,g=y+(_<<4&4294967295|_>>>28),_=S+(g^y^T)+w[0]+3936430074&4294967295,S=g+(_<<11&4294967295|_>>>21),_=T+(S^g^y)+w[3]+3572445317&4294967295,T=S+(_<<16&4294967295|_>>>16),_=y+(T^S^g)+w[6]+76029189&4294967295,y=T+(_<<23&4294967295|_>>>9),_=g+(y^T^S)+w[9]+3654602809&4294967295,g=y+(_<<4&4294967295|_>>>28),_=S+(g^y^T)+w[12]+3873151461&4294967295,S=g+(_<<11&4294967295|_>>>21),_=T+(S^g^y)+w[15]+530742520&4294967295,T=S+(_<<16&4294967295|_>>>16),_=y+(T^S^g)+w[2]+3299628645&4294967295,y=T+(_<<23&4294967295|_>>>9),_=g+(T^(y|~S))+w[0]+4096336452&4294967295,g=y+(_<<6&4294967295|_>>>26),_=S+(y^(g|~T))+w[7]+1126891415&4294967295,S=g+(_<<10&4294967295|_>>>22),_=T+(g^(S|~y))+w[14]+2878612391&4294967295,T=S+(_<<15&4294967295|_>>>17),_=y+(S^(T|~g))+w[5]+4237533241&4294967295,y=T+(_<<21&4294967295|_>>>11),_=g+(T^(y|~S))+w[12]+1700485571&4294967295,g=y+(_<<6&4294967295|_>>>26),_=S+(y^(g|~T))+w[3]+2399980690&4294967295,S=g+(_<<10&4294967295|_>>>22),_=T+(g^(S|~y))+w[10]+4293915773&4294967295,T=S+(_<<15&4294967295|_>>>17),_=y+(S^(T|~g))+w[1]+2240044497&4294967295,y=T+(_<<21&4294967295|_>>>11),_=g+(T^(y|~S))+w[8]+1873313359&4294967295,g=y+(_<<6&4294967295|_>>>26),_=S+(y^(g|~T))+w[15]+4264355552&4294967295,S=g+(_<<10&4294967295|_>>>22),_=T+(g^(S|~y))+w[6]+2734768916&4294967295,T=S+(_<<15&4294967295|_>>>17),_=y+(S^(T|~g))+w[13]+1309151649&4294967295,y=T+(_<<21&4294967295|_>>>11),_=g+(T^(y|~S))+w[4]+4149444226&4294967295,g=y+(_<<6&4294967295|_>>>26),_=S+(y^(g|~T))+w[11]+3174756917&4294967295,S=g+(_<<10&4294967295|_>>>22),_=T+(g^(S|~y))+w[2]+718787259&4294967295,T=S+(_<<15&4294967295|_>>>17),_=y+(S^(T|~g))+w[9]+3951481745&4294967295,I.g[0]=I.g[0]+g&4294967295,I.g[1]=I.g[1]+(T+(_<<21&4294967295|_>>>11))&4294967295,I.g[2]=I.g[2]+T&4294967295,I.g[3]=I.g[3]+S&4294967295}n.prototype.v=function(I,g){g===void 0&&(g=I.length);const y=g-this.blockSize,w=this.C;let T=this.h,S=0;for(;S<g;){if(T==0)for(;S<=y;)s(this,I,S),S+=this.blockSize;if(typeof I=="string"){for(;S<g;)if(w[T++]=I.charCodeAt(S++),T==this.blockSize){s(this,w),T=0;break}}else for(;S<g;)if(w[T++]=I[S++],T==this.blockSize){s(this,w),T=0;break}}this.h=T,this.o+=g},n.prototype.A=function(){var I=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);I[0]=128;for(var g=1;g<I.length-8;++g)I[g]=0;g=this.o*8;for(var y=I.length-8;y<I.length;++y)I[y]=g&255,g/=256;for(this.v(I),I=Array(16),g=0,y=0;y<4;++y)for(let w=0;w<32;w+=8)I[g++]=this.g[y]>>>w&255;return I};function i(I,g){var y=c;return Object.prototype.hasOwnProperty.call(y,I)?y[I]:y[I]=g(I)}function o(I,g){this.h=g;const y=[];let w=!0;for(let T=I.length-1;T>=0;T--){const S=I[T]|0;w&&S==g||(y[T]=S,w=!1)}this.g=y}var c={};function u(I){return-128<=I&&I<128?i(I,function(g){return new o([g|0],g<0?-1:0)}):new o([I|0],I<0?-1:0)}function h(I){if(isNaN(I)||!isFinite(I))return p;if(I<0)return D(h(-I));const g=[];let y=1;for(let w=0;I>=y;w++)g[w]=I/y|0,y*=4294967296;return new o(g,0)}function f(I,g){if(I.length==0)throw Error("number format error: empty string");if(g=g||10,g<2||36<g)throw Error("radix out of range: "+g);if(I.charAt(0)=="-")return D(f(I.substring(1),g));if(I.indexOf("-")>=0)throw Error('number format error: interior "-" character');const y=h(Math.pow(g,8));let w=p;for(let S=0;S<I.length;S+=8){var T=Math.min(8,I.length-S);const _=parseInt(I.substring(S,S+T),g);T<8?(T=h(Math.pow(g,T)),w=w.j(T).add(h(_))):(w=w.j(y),w=w.add(h(_)))}return w}var p=u(0),E=u(1),b=u(16777216);r=o.prototype,r.m=function(){if(N(this))return-D(this).m();let I=0,g=1;for(let y=0;y<this.g.length;y++){const w=this.i(y);I+=(w>=0?w:4294967296+w)*g,g*=4294967296}return I},r.toString=function(I){if(I=I||10,I<2||36<I)throw Error("radix out of range: "+I);if(V(this))return"0";if(N(this))return"-"+D(this).toString(I);const g=h(Math.pow(I,6));var y=this;let w="";for(;;){const T=se(y,g).g;y=G(y,T.j(g));let S=((y.g.length>0?y.g[0]:y.h)>>>0).toString(I);if(y=T,V(y))return S+w;for(;S.length<6;)S="0"+S;w=S+w}},r.i=function(I){return I<0?0:I<this.g.length?this.g[I]:this.h};function V(I){if(I.h!=0)return!1;for(let g=0;g<I.g.length;g++)if(I.g[g]!=0)return!1;return!0}function N(I){return I.h==-1}r.l=function(I){return I=G(this,I),N(I)?-1:V(I)?0:1};function D(I){const g=I.g.length,y=[];for(let w=0;w<g;w++)y[w]=~I.g[w];return new o(y,~I.h).add(E)}r.abs=function(){return N(this)?D(this):this},r.add=function(I){const g=Math.max(this.g.length,I.g.length),y=[];let w=0;for(let T=0;T<=g;T++){let S=w+(this.i(T)&65535)+(I.i(T)&65535),_=(S>>>16)+(this.i(T)>>>16)+(I.i(T)>>>16);w=_>>>16,S&=65535,_&=65535,y[T]=_<<16|S}return new o(y,y[y.length-1]&-2147483648?-1:0)};function G(I,g){return I.add(D(g))}r.j=function(I){if(V(this)||V(I))return p;if(N(this))return N(I)?D(this).j(D(I)):D(D(this).j(I));if(N(I))return D(this.j(D(I)));if(this.l(b)<0&&I.l(b)<0)return h(this.m()*I.m());const g=this.g.length+I.g.length,y=[];for(var w=0;w<2*g;w++)y[w]=0;for(w=0;w<this.g.length;w++)for(let T=0;T<I.g.length;T++){const S=this.i(w)>>>16,_=this.i(w)&65535,Ve=I.i(T)>>>16,Ht=I.i(T)&65535;y[2*w+2*T]+=_*Ht,z(y,2*w+2*T),y[2*w+2*T+1]+=S*Ht,z(y,2*w+2*T+1),y[2*w+2*T+1]+=_*Ve,z(y,2*w+2*T+1),y[2*w+2*T+2]+=S*Ve,z(y,2*w+2*T+2)}for(I=0;I<g;I++)y[I]=y[2*I+1]<<16|y[2*I];for(I=g;I<2*g;I++)y[I]=0;return new o(y,0)};function z(I,g){for(;(I[g]&65535)!=I[g];)I[g+1]+=I[g]>>>16,I[g]&=65535,g++}function q(I,g){this.g=I,this.h=g}function se(I,g){if(V(g))throw Error("division by zero");if(V(I))return new q(p,p);if(N(I))return g=se(D(I),g),new q(D(g.g),D(g.h));if(N(g))return g=se(I,D(g)),new q(D(g.g),g.h);if(I.g.length>30){if(N(I)||N(g))throw Error("slowDivide_ only works with positive integers.");for(var y=E,w=g;w.l(I)<=0;)y=J(y),w=J(w);var T=Y(y,1),S=Y(w,1);for(w=Y(w,2),y=Y(y,2);!V(w);){var _=S.add(w);_.l(I)<=0&&(T=T.add(y),S=_),w=Y(w,1),y=Y(y,1)}return g=G(I,T.j(g)),new q(T,g)}for(T=p;I.l(g)>=0;){for(y=Math.max(1,Math.floor(I.m()/g.m())),w=Math.ceil(Math.log(y)/Math.LN2),w=w<=48?1:Math.pow(2,w-48),S=h(y),_=S.j(g);N(_)||_.l(I)>0;)y-=w,S=h(y),_=S.j(g);V(S)&&(S=E),T=T.add(S),I=G(I,_)}return new q(T,I)}r.B=function(I){return se(this,I).h},r.and=function(I){const g=Math.max(this.g.length,I.g.length),y=[];for(let w=0;w<g;w++)y[w]=this.i(w)&I.i(w);return new o(y,this.h&I.h)},r.or=function(I){const g=Math.max(this.g.length,I.g.length),y=[];for(let w=0;w<g;w++)y[w]=this.i(w)|I.i(w);return new o(y,this.h|I.h)},r.xor=function(I){const g=Math.max(this.g.length,I.g.length),y=[];for(let w=0;w<g;w++)y[w]=this.i(w)^I.i(w);return new o(y,this.h^I.h)};function J(I){const g=I.g.length+1,y=[];for(let w=0;w<g;w++)y[w]=I.i(w)<<1|I.i(w-1)>>>31;return new o(y,I.h)}function Y(I,g){const y=g>>5;g%=32;const w=I.g.length-y,T=[];for(let S=0;S<w;S++)T[S]=g>0?I.i(S+y)>>>g|I.i(S+y+1)<<32-g:I.i(S+y);return new o(T,I.h)}n.prototype.digest=n.prototype.A,n.prototype.reset=n.prototype.u,n.prototype.update=n.prototype.v,Rd=n,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.B,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=h,o.fromString=f,Ot=o}).apply(typeof fl<"u"?fl:typeof self<"u"?self:typeof window<"u"?window:{});var $s=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var bd,Ur,Pd,ti,ca,Cd,Vd,Dd;(function(){var r,e=Object.defineProperty;function t(a){a=[typeof globalThis=="object"&&globalThis,a,typeof window=="object"&&window,typeof self=="object"&&self,typeof $s=="object"&&$s];for(var l=0;l<a.length;++l){var d=a[l];if(d&&d.Math==Math)return d}throw Error("Cannot find global object")}var n=t(this);function s(a,l){if(l)e:{var d=n;a=a.split(".");for(var m=0;m<a.length-1;m++){var A=a[m];if(!(A in d))break e;d=d[A]}a=a[a.length-1],m=d[a],l=l(m),l!=m&&l!=null&&e(d,a,{configurable:!0,writable:!0,value:l})}}s("Symbol.dispose",function(a){return a||Symbol("Symbol.dispose")}),s("Array.prototype.values",function(a){return a||function(){return this[Symbol.iterator]()}}),s("Object.entries",function(a){return a||function(l){var d=[],m;for(m in l)Object.prototype.hasOwnProperty.call(l,m)&&d.push([m,l[m]]);return d}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var i=i||{},o=this||self;function c(a){var l=typeof a;return l=="object"&&a!=null||l=="function"}function u(a,l,d){return a.call.apply(a.bind,arguments)}function h(a,l,d){return h=u,h.apply(null,arguments)}function f(a,l){var d=Array.prototype.slice.call(arguments,1);return function(){var m=d.slice();return m.push.apply(m,arguments),a.apply(this,m)}}function p(a,l){function d(){}d.prototype=l.prototype,a.Z=l.prototype,a.prototype=new d,a.prototype.constructor=a,a.Ob=function(m,A,R){for(var k=Array(arguments.length-2),$=2;$<arguments.length;$++)k[$-2]=arguments[$];return l.prototype[A].apply(m,k)}}var E=typeof AsyncContext<"u"&&typeof AsyncContext.Snapshot=="function"?a=>a&&AsyncContext.Snapshot.wrap(a):a=>a;function b(a){const l=a.length;if(l>0){const d=Array(l);for(let m=0;m<l;m++)d[m]=a[m];return d}return[]}function V(a,l){for(let m=1;m<arguments.length;m++){const A=arguments[m];var d=typeof A;if(d=d!="object"?d:A?Array.isArray(A)?"array":d:"null",d=="array"||d=="object"&&typeof A.length=="number"){d=a.length||0;const R=A.length||0;a.length=d+R;for(let k=0;k<R;k++)a[d+k]=A[k]}else a.push(A)}}class N{constructor(l,d){this.i=l,this.j=d,this.h=0,this.g=null}get(){let l;return this.h>0?(this.h--,l=this.g,this.g=l.next,l.next=null):l=this.i(),l}}function D(a){o.setTimeout(()=>{throw a},0)}function G(){var a=I;let l=null;return a.g&&(l=a.g,a.g=a.g.next,a.g||(a.h=null),l.next=null),l}class z{constructor(){this.h=this.g=null}add(l,d){const m=q.get();m.set(l,d),this.h?this.h.next=m:this.g=m,this.h=m}}var q=new N(()=>new se,a=>a.reset());class se{constructor(){this.next=this.g=this.h=null}set(l,d){this.h=l,this.g=d,this.next=null}reset(){this.next=this.g=this.h=null}}let J,Y=!1,I=new z,g=()=>{const a=Promise.resolve(void 0);J=()=>{a.then(y)}};function y(){for(var a;a=G();){try{a.h.call(a.g)}catch(d){D(d)}var l=q;l.j(a),l.h<100&&(l.h++,a.next=l.g,l.g=a)}Y=!1}function w(){this.u=this.u,this.C=this.C}w.prototype.u=!1,w.prototype.dispose=function(){this.u||(this.u=!0,this.N())},w.prototype[Symbol.dispose]=function(){this.dispose()},w.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function T(a,l){this.type=a,this.g=this.target=l,this.defaultPrevented=!1}T.prototype.h=function(){this.defaultPrevented=!0};var S=(function(){if(!o.addEventListener||!Object.defineProperty)return!1;var a=!1,l=Object.defineProperty({},"passive",{get:function(){a=!0}});try{const d=()=>{};o.addEventListener("test",d,l),o.removeEventListener("test",d,l)}catch{}return a})();function _(a){return/^[\s\xa0]*$/.test(a)}function Ve(a,l){T.call(this,a?a.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,a&&this.init(a,l)}p(Ve,T),Ve.prototype.init=function(a,l){const d=this.type=a.type,m=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;this.target=a.target||a.srcElement,this.g=l,l=a.relatedTarget,l||(d=="mouseover"?l=a.fromElement:d=="mouseout"&&(l=a.toElement)),this.relatedTarget=l,m?(this.clientX=m.clientX!==void 0?m.clientX:m.pageX,this.clientY=m.clientY!==void 0?m.clientY:m.pageY,this.screenX=m.screenX||0,this.screenY=m.screenY||0):(this.clientX=a.clientX!==void 0?a.clientX:a.pageX,this.clientY=a.clientY!==void 0?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0),this.button=a.button,this.key=a.key||"",this.ctrlKey=a.ctrlKey,this.altKey=a.altKey,this.shiftKey=a.shiftKey,this.metaKey=a.metaKey,this.pointerId=a.pointerId||0,this.pointerType=a.pointerType,this.state=a.state,this.i=a,a.defaultPrevented&&Ve.Z.h.call(this)},Ve.prototype.h=function(){Ve.Z.h.call(this);const a=this.i;a.preventDefault?a.preventDefault():a.returnValue=!1};var Ht="closure_listenable_"+(Math.random()*1e6|0),Hm=0;function Wm(a,l,d,m,A){this.listener=a,this.proxy=null,this.src=l,this.type=d,this.capture=!!m,this.ha=A,this.key=++Hm,this.da=this.fa=!1}function Ps(a){a.da=!0,a.listener=null,a.proxy=null,a.src=null,a.ha=null}function Cs(a,l,d){for(const m in a)l.call(d,a[m],m,a)}function Qm(a,l){for(const d in a)l.call(void 0,a[d],d,a)}function Uc(a){const l={};for(const d in a)l[d]=a[d];return l}const Bc="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function jc(a,l){let d,m;for(let A=1;A<arguments.length;A++){m=arguments[A];for(d in m)a[d]=m[d];for(let R=0;R<Bc.length;R++)d=Bc[R],Object.prototype.hasOwnProperty.call(m,d)&&(a[d]=m[d])}}function Vs(a){this.src=a,this.g={},this.h=0}Vs.prototype.add=function(a,l,d,m,A){const R=a.toString();a=this.g[R],a||(a=this.g[R]=[],this.h++);const k=po(a,l,m,A);return k>-1?(l=a[k],d||(l.fa=!1)):(l=new Wm(l,this.src,R,!!m,A),l.fa=d,a.push(l)),l};function mo(a,l){const d=l.type;if(d in a.g){var m=a.g[d],A=Array.prototype.indexOf.call(m,l,void 0),R;(R=A>=0)&&Array.prototype.splice.call(m,A,1),R&&(Ps(l),a.g[d].length==0&&(delete a.g[d],a.h--))}}function po(a,l,d,m){for(let A=0;A<a.length;++A){const R=a[A];if(!R.da&&R.listener==l&&R.capture==!!d&&R.ha==m)return A}return-1}var go="closure_lm_"+(Math.random()*1e6|0),_o={};function qc(a,l,d,m,A){if(Array.isArray(l)){for(let R=0;R<l.length;R++)qc(a,l[R],d,m,A);return null}return d=Kc(d),a&&a[Ht]?a.J(l,d,c(m)?!!m.capture:!1,A):Jm(a,l,d,!1,m,A)}function Jm(a,l,d,m,A,R){if(!l)throw Error("Invalid event type");const k=c(A)?!!A.capture:!!A;let $=Io(a);if($||(a[go]=$=new Vs(a)),d=$.add(l,d,m,k,R),d.proxy)return d;if(m=Ym(),d.proxy=m,m.src=a,m.listener=d,a.addEventListener)S||(A=k),A===void 0&&(A=!1),a.addEventListener(l.toString(),m,A);else if(a.attachEvent)a.attachEvent($c(l.toString()),m);else if(a.addListener&&a.removeListener)a.addListener(m);else throw Error("addEventListener and attachEvent are unavailable.");return d}function Ym(){function a(d){return l.call(a.src,a.listener,d)}const l=Xm;return a}function zc(a,l,d,m,A){if(Array.isArray(l))for(var R=0;R<l.length;R++)zc(a,l[R],d,m,A);else m=c(m)?!!m.capture:!!m,d=Kc(d),a&&a[Ht]?(a=a.i,R=String(l).toString(),R in a.g&&(l=a.g[R],d=po(l,d,m,A),d>-1&&(Ps(l[d]),Array.prototype.splice.call(l,d,1),l.length==0&&(delete a.g[R],a.h--)))):a&&(a=Io(a))&&(l=a.g[l.toString()],a=-1,l&&(a=po(l,d,m,A)),(d=a>-1?l[a]:null)&&yo(d))}function yo(a){if(typeof a!="number"&&a&&!a.da){var l=a.src;if(l&&l[Ht])mo(l.i,a);else{var d=a.type,m=a.proxy;l.removeEventListener?l.removeEventListener(d,m,a.capture):l.detachEvent?l.detachEvent($c(d),m):l.addListener&&l.removeListener&&l.removeListener(m),(d=Io(l))?(mo(d,a),d.h==0&&(d.src=null,l[go]=null)):Ps(a)}}}function $c(a){return a in _o?_o[a]:_o[a]="on"+a}function Xm(a,l){if(a.da)a=!0;else{l=new Ve(l,this);const d=a.listener,m=a.ha||a.src;a.fa&&yo(a),a=d.call(m,l)}return a}function Io(a){return a=a[go],a instanceof Vs?a:null}var To="__closure_events_fn_"+(Math.random()*1e9>>>0);function Kc(a){return typeof a=="function"?a:(a[To]||(a[To]=function(l){return a.handleEvent(l)}),a[To])}function Ee(){w.call(this),this.i=new Vs(this),this.M=this,this.G=null}p(Ee,w),Ee.prototype[Ht]=!0,Ee.prototype.removeEventListener=function(a,l,d,m){zc(this,a,l,d,m)};function be(a,l){var d,m=a.G;if(m)for(d=[];m;m=m.G)d.push(m);if(a=a.M,m=l.type||l,typeof l=="string")l=new T(l,a);else if(l instanceof T)l.target=l.target||a;else{var A=l;l=new T(m,a),jc(l,A)}A=!0;let R,k;if(d)for(k=d.length-1;k>=0;k--)R=l.g=d[k],A=Ds(R,m,!0,l)&&A;if(R=l.g=a,A=Ds(R,m,!0,l)&&A,A=Ds(R,m,!1,l)&&A,d)for(k=0;k<d.length;k++)R=l.g=d[k],A=Ds(R,m,!1,l)&&A}Ee.prototype.N=function(){if(Ee.Z.N.call(this),this.i){var a=this.i;for(const l in a.g){const d=a.g[l];for(let m=0;m<d.length;m++)Ps(d[m]);delete a.g[l],a.h--}}this.G=null},Ee.prototype.J=function(a,l,d,m){return this.i.add(String(a),l,!1,d,m)},Ee.prototype.K=function(a,l,d,m){return this.i.add(String(a),l,!0,d,m)};function Ds(a,l,d,m){if(l=a.i.g[String(l)],!l)return!0;l=l.concat();let A=!0;for(let R=0;R<l.length;++R){const k=l[R];if(k&&!k.da&&k.capture==d){const $=k.listener,me=k.ha||k.src;k.fa&&mo(a.i,k),A=$.call(me,m)!==!1&&A}}return A&&!m.defaultPrevented}function Zm(a,l){if(typeof a!="function")if(a&&typeof a.handleEvent=="function")a=h(a.handleEvent,a);else throw Error("Invalid listener argument");return Number(l)>2147483647?-1:o.setTimeout(a,l||0)}function Gc(a){a.g=Zm(()=>{a.g=null,a.i&&(a.i=!1,Gc(a))},a.l);const l=a.h;a.h=null,a.m.apply(null,l)}class ep extends w{constructor(l,d){super(),this.m=l,this.l=d,this.h=null,this.i=!1,this.g=null}j(l){this.h=arguments,this.g?this.i=!0:Gc(this)}N(){super.N(),this.g&&(o.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function _r(a){w.call(this),this.h=a,this.g={}}p(_r,w);var Hc=[];function Wc(a){Cs(a.g,function(l,d){this.g.hasOwnProperty(d)&&yo(l)},a),a.g={}}_r.prototype.N=function(){_r.Z.N.call(this),Wc(this)},_r.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Eo=o.JSON.stringify,tp=o.JSON.parse,np=class{stringify(a){return o.JSON.stringify(a,void 0)}parse(a){return o.JSON.parse(a,void 0)}};function Qc(){}function Jc(){}var yr={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function wo(){T.call(this,"d")}p(wo,T);function vo(){T.call(this,"c")}p(vo,T);var Wt={},Yc=null;function ks(){return Yc=Yc||new Ee}Wt.Ia="serverreachability";function Xc(a){T.call(this,Wt.Ia,a)}p(Xc,T);function Ir(a){const l=ks();be(l,new Xc(l))}Wt.STAT_EVENT="statevent";function Zc(a,l){T.call(this,Wt.STAT_EVENT,a),this.stat=l}p(Zc,T);function Pe(a){const l=ks();be(l,new Zc(l,a))}Wt.Ja="timingevent";function eu(a,l){T.call(this,Wt.Ja,a),this.size=l}p(eu,T);function Tr(a,l){if(typeof a!="function")throw Error("Fn must not be null and must be a function");return o.setTimeout(function(){a()},l)}function Er(){this.g=!0}Er.prototype.ua=function(){this.g=!1};function rp(a,l,d,m,A,R){a.info(function(){if(a.g)if(R){var k="",$=R.split("&");for(let ne=0;ne<$.length;ne++){var me=$[ne].split("=");if(me.length>1){const ye=me[0];me=me[1];const Ge=ye.split("_");k=Ge.length>=2&&Ge[1]=="type"?k+(ye+"="+me+"&"):k+(ye+"=redacted&")}}}else k=null;else k=R;return"XMLHTTP REQ ("+m+") [attempt "+A+"]: "+l+`
`+d+`
`+k})}function sp(a,l,d,m,A,R,k){a.info(function(){return"XMLHTTP RESP ("+m+") [ attempt "+A+"]: "+l+`
`+d+`
`+R+" "+k})}function En(a,l,d,m){a.info(function(){return"XMLHTTP TEXT ("+l+"): "+op(a,d)+(m?" "+m:"")})}function ip(a,l){a.info(function(){return"TIMEOUT: "+l})}Er.prototype.info=function(){};function op(a,l){if(!a.g)return l;if(!l)return null;try{const R=JSON.parse(l);if(R){for(a=0;a<R.length;a++)if(Array.isArray(R[a])){var d=R[a];if(!(d.length<2)){var m=d[1];if(Array.isArray(m)&&!(m.length<1)){var A=m[0];if(A!="noop"&&A!="stop"&&A!="close")for(let k=1;k<m.length;k++)m[k]=""}}}}return Eo(R)}catch{return l}}var Ns={NO_ERROR:0,cb:1,qb:2,pb:3,kb:4,ob:5,rb:6,Ga:7,TIMEOUT:8,ub:9},tu={ib:"complete",Fb:"success",ERROR:"error",Ga:"abort",xb:"ready",yb:"readystatechange",TIMEOUT:"timeout",sb:"incrementaldata",wb:"progress",lb:"downloadprogress",Nb:"uploadprogress"},nu;function Ao(){}p(Ao,Qc),Ao.prototype.g=function(){return new XMLHttpRequest},nu=new Ao;function wr(a){return encodeURIComponent(String(a))}function ap(a){var l=1;a=a.split(":");const d=[];for(;l>0&&a.length;)d.push(a.shift()),l--;return a.length&&d.push(a.join(":")),d}function pt(a,l,d,m){this.j=a,this.i=l,this.l=d,this.S=m||1,this.V=new _r(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new ru}function ru(){this.i=null,this.g="",this.h=!1}var su={},So={};function Ro(a,l,d){a.M=1,a.A=Os(Ke(l)),a.u=d,a.R=!0,iu(a,null)}function iu(a,l){a.F=Date.now(),xs(a),a.B=Ke(a.A);var d=a.B,m=a.S;Array.isArray(m)||(m=[String(m)]),yu(d.i,"t",m),a.C=0,d=a.j.L,a.h=new ru,a.g=Mu(a.j,d?l:null,!a.u),a.P>0&&(a.O=new ep(h(a.Y,a,a.g),a.P)),l=a.V,d=a.g,m=a.ba;var A="readystatechange";Array.isArray(A)||(A&&(Hc[0]=A.toString()),A=Hc);for(let R=0;R<A.length;R++){const k=qc(d,A[R],m||l.handleEvent,!1,l.h||l);if(!k)break;l.g[k.key]=k}l=a.J?Uc(a.J):{},a.u?(a.v||(a.v="POST"),l["Content-Type"]="application/x-www-form-urlencoded",a.g.ea(a.B,a.v,a.u,l)):(a.v="GET",a.g.ea(a.B,a.v,null,l)),Ir(),rp(a.i,a.v,a.B,a.l,a.S,a.u)}pt.prototype.ba=function(a){a=a.target;const l=this.O;l&&yt(a)==3?l.j():this.Y(a)},pt.prototype.Y=function(a){try{if(a==this.g)e:{const $=yt(this.g),me=this.g.ya(),ne=this.g.ca();if(!($<3)&&($!=3||this.g&&(this.h.h||this.g.la()||Su(this.g)))){this.K||$!=4||me==7||(me==8||ne<=0?Ir(3):Ir(2)),bo(this);var l=this.g.ca();this.X=l;var d=cp(this);if(this.o=l==200,sp(this.i,this.v,this.B,this.l,this.S,$,l),this.o){if(this.U&&!this.L){t:{if(this.g){var m,A=this.g;if((m=A.g?A.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!_(m)){var R=m;break t}}R=null}if(a=R)En(this.i,this.l,a,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,Po(this,a);else{this.o=!1,this.m=3,Pe(12),Qt(this),vr(this);break e}}if(this.R){a=!0;let ye;for(;!this.K&&this.C<d.length;)if(ye=up(this,d),ye==So){$==4&&(this.m=4,Pe(14),a=!1),En(this.i,this.l,null,"[Incomplete Response]");break}else if(ye==su){this.m=4,Pe(15),En(this.i,this.l,d,"[Invalid Chunk]"),a=!1;break}else En(this.i,this.l,ye,null),Po(this,ye);if(ou(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),$!=4||d.length!=0||this.h.h||(this.m=1,Pe(16),a=!1),this.o=this.o&&a,!a)En(this.i,this.l,d,"[Invalid Chunked Response]"),Qt(this),vr(this);else if(d.length>0&&!this.W){this.W=!0;var k=this.j;k.g==this&&k.aa&&!k.P&&(k.j.info("Great, no buffering proxy detected. Bytes received: "+d.length),Mo(k),k.P=!0,Pe(11))}}else En(this.i,this.l,d,null),Po(this,d);$==4&&Qt(this),this.o&&!this.K&&($==4?ku(this.j,this):(this.o=!1,xs(this)))}else vp(this.g),l==400&&d.indexOf("Unknown SID")>0?(this.m=3,Pe(12)):(this.m=0,Pe(13)),Qt(this),vr(this)}}}catch{}finally{}};function cp(a){if(!ou(a))return a.g.la();const l=Su(a.g);if(l==="")return"";let d="";const m=l.length,A=yt(a.g)==4;if(!a.h.i){if(typeof TextDecoder>"u")return Qt(a),vr(a),"";a.h.i=new o.TextDecoder}for(let R=0;R<m;R++)a.h.h=!0,d+=a.h.i.decode(l[R],{stream:!(A&&R==m-1)});return l.length=0,a.h.g+=d,a.C=0,a.h.g}function ou(a){return a.g?a.v=="GET"&&a.M!=2&&a.j.Aa:!1}function up(a,l){var d=a.C,m=l.indexOf(`
`,d);return m==-1?So:(d=Number(l.substring(d,m)),isNaN(d)?su:(m+=1,m+d>l.length?So:(l=l.slice(m,m+d),a.C=m+d,l)))}pt.prototype.cancel=function(){this.K=!0,Qt(this)};function xs(a){a.T=Date.now()+a.H,au(a,a.H)}function au(a,l){if(a.D!=null)throw Error("WatchDog timer not null");a.D=Tr(h(a.aa,a),l)}function bo(a){a.D&&(o.clearTimeout(a.D),a.D=null)}pt.prototype.aa=function(){this.D=null;const a=Date.now();a-this.T>=0?(ip(this.i,this.B),this.M!=2&&(Ir(),Pe(17)),Qt(this),this.m=2,vr(this)):au(this,this.T-a)};function vr(a){a.j.I==0||a.K||ku(a.j,a)}function Qt(a){bo(a);var l=a.O;l&&typeof l.dispose=="function"&&l.dispose(),a.O=null,Wc(a.V),a.g&&(l=a.g,a.g=null,l.abort(),l.dispose())}function Po(a,l){try{var d=a.j;if(d.I!=0&&(d.g==a||Co(d.h,a))){if(!a.L&&Co(d.h,a)&&d.I==3){try{var m=d.Ba.g.parse(l)}catch{m=null}if(Array.isArray(m)&&m.length==3){var A=m;if(A[0]==0){e:if(!d.v){if(d.g)if(d.g.F+3e3<a.F)Bs(d),Fs(d);else break e;Oo(d),Pe(18)}}else d.xa=A[1],0<d.xa-d.K&&A[2]<37500&&d.F&&d.A==0&&!d.C&&(d.C=Tr(h(d.Va,d),6e3));lu(d.h)<=1&&d.ta&&(d.ta=void 0)}else Yt(d,11)}else if((a.L||d.g==a)&&Bs(d),!_(l))for(A=d.Ba.g.parse(l),l=0;l<A.length;l++){let ne=A[l];const ye=ne[0];if(!(ye<=d.K))if(d.K=ye,ne=ne[1],d.I==2)if(ne[0]=="c"){d.M=ne[1],d.ba=ne[2];const Ge=ne[3];Ge!=null&&(d.ka=Ge,d.j.info("VER="+d.ka));const Xt=ne[4];Xt!=null&&(d.za=Xt,d.j.info("SVER="+d.za));const It=ne[5];It!=null&&typeof It=="number"&&It>0&&(m=1.5*It,d.O=m,d.j.info("backChannelRequestTimeoutMs_="+m)),m=d;const Tt=a.g;if(Tt){const qs=Tt.g?Tt.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(qs){var R=m.h;R.g||qs.indexOf("spdy")==-1&&qs.indexOf("quic")==-1&&qs.indexOf("h2")==-1||(R.j=R.l,R.g=new Set,R.h&&(Vo(R,R.h),R.h=null))}if(m.G){const Lo=Tt.g?Tt.g.getResponseHeader("X-HTTP-Session-Id"):null;Lo&&(m.wa=Lo,ie(m.J,m.G,Lo))}}d.I=3,d.l&&d.l.ra(),d.aa&&(d.T=Date.now()-a.F,d.j.info("Handshake RTT: "+d.T+"ms")),m=d;var k=a;if(m.na=Ou(m,m.L?m.ba:null,m.W),k.L){hu(m.h,k);var $=k,me=m.O;me&&($.H=me),$.D&&(bo($),xs($)),m.g=k}else Vu(m);d.i.length>0&&Us(d)}else ne[0]!="stop"&&ne[0]!="close"||Yt(d,7);else d.I==3&&(ne[0]=="stop"||ne[0]=="close"?ne[0]=="stop"?Yt(d,7):xo(d):ne[0]!="noop"&&d.l&&d.l.qa(ne),d.A=0)}}Ir(4)}catch{}}var lp=class{constructor(a,l){this.g=a,this.map=l}};function cu(a){this.l=a||10,o.PerformanceNavigationTiming?(a=o.performance.getEntriesByType("navigation"),a=a.length>0&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(o.chrome&&o.chrome.loadTimes&&o.chrome.loadTimes()&&o.chrome.loadTimes().wasFetchedViaSpdy),this.j=a?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function uu(a){return a.h?!0:a.g?a.g.size>=a.j:!1}function lu(a){return a.h?1:a.g?a.g.size:0}function Co(a,l){return a.h?a.h==l:a.g?a.g.has(l):!1}function Vo(a,l){a.g?a.g.add(l):a.h=l}function hu(a,l){a.h&&a.h==l?a.h=null:a.g&&a.g.has(l)&&a.g.delete(l)}cu.prototype.cancel=function(){if(this.i=du(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const a of this.g.values())a.cancel();this.g.clear()}};function du(a){if(a.h!=null)return a.i.concat(a.h.G);if(a.g!=null&&a.g.size!==0){let l=a.i;for(const d of a.g.values())l=l.concat(d.G);return l}return b(a.i)}var fu=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function hp(a,l){if(a){a=a.split("&");for(let d=0;d<a.length;d++){const m=a[d].indexOf("=");let A,R=null;m>=0?(A=a[d].substring(0,m),R=a[d].substring(m+1)):A=a[d],l(A,R?decodeURIComponent(R.replace(/\+/g," ")):"")}}}function gt(a){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let l;a instanceof gt?(this.l=a.l,Ar(this,a.j),this.o=a.o,this.g=a.g,Sr(this,a.u),this.h=a.h,Do(this,Iu(a.i)),this.m=a.m):a&&(l=String(a).match(fu))?(this.l=!1,Ar(this,l[1]||"",!0),this.o=Rr(l[2]||""),this.g=Rr(l[3]||"",!0),Sr(this,l[4]),this.h=Rr(l[5]||"",!0),Do(this,l[6]||"",!0),this.m=Rr(l[7]||"")):(this.l=!1,this.i=new Pr(null,this.l))}gt.prototype.toString=function(){const a=[];var l=this.j;l&&a.push(br(l,mu,!0),":");var d=this.g;return(d||l=="file")&&(a.push("//"),(l=this.o)&&a.push(br(l,mu,!0),"@"),a.push(wr(d).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),d=this.u,d!=null&&a.push(":",String(d))),(d=this.h)&&(this.g&&d.charAt(0)!="/"&&a.push("/"),a.push(br(d,d.charAt(0)=="/"?mp:fp,!0))),(d=this.i.toString())&&a.push("?",d),(d=this.m)&&a.push("#",br(d,gp)),a.join("")},gt.prototype.resolve=function(a){const l=Ke(this);let d=!!a.j;d?Ar(l,a.j):d=!!a.o,d?l.o=a.o:d=!!a.g,d?l.g=a.g:d=a.u!=null;var m=a.h;if(d)Sr(l,a.u);else if(d=!!a.h){if(m.charAt(0)!="/")if(this.g&&!this.h)m="/"+m;else{var A=l.h.lastIndexOf("/");A!=-1&&(m=l.h.slice(0,A+1)+m)}if(A=m,A==".."||A==".")m="";else if(A.indexOf("./")!=-1||A.indexOf("/.")!=-1){m=A.lastIndexOf("/",0)==0,A=A.split("/");const R=[];for(let k=0;k<A.length;){const $=A[k++];$=="."?m&&k==A.length&&R.push(""):$==".."?((R.length>1||R.length==1&&R[0]!="")&&R.pop(),m&&k==A.length&&R.push("")):(R.push($),m=!0)}m=R.join("/")}else m=A}return d?l.h=m:d=a.i.toString()!=="",d?Do(l,Iu(a.i)):d=!!a.m,d&&(l.m=a.m),l};function Ke(a){return new gt(a)}function Ar(a,l,d){a.j=d?Rr(l,!0):l,a.j&&(a.j=a.j.replace(/:$/,""))}function Sr(a,l){if(l){if(l=Number(l),isNaN(l)||l<0)throw Error("Bad port number "+l);a.u=l}else a.u=null}function Do(a,l,d){l instanceof Pr?(a.i=l,_p(a.i,a.l)):(d||(l=br(l,pp)),a.i=new Pr(l,a.l))}function ie(a,l,d){a.i.set(l,d)}function Os(a){return ie(a,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),a}function Rr(a,l){return a?l?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""}function br(a,l,d){return typeof a=="string"?(a=encodeURI(a).replace(l,dp),d&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null}function dp(a){return a=a.charCodeAt(0),"%"+(a>>4&15).toString(16)+(a&15).toString(16)}var mu=/[#\/\?@]/g,fp=/[#\?:]/g,mp=/[#\?]/g,pp=/[#\?@]/g,gp=/#/g;function Pr(a,l){this.h=this.g=null,this.i=a||null,this.j=!!l}function Jt(a){a.g||(a.g=new Map,a.h=0,a.i&&hp(a.i,function(l,d){a.add(decodeURIComponent(l.replace(/\+/g," ")),d)}))}r=Pr.prototype,r.add=function(a,l){Jt(this),this.i=null,a=wn(this,a);let d=this.g.get(a);return d||this.g.set(a,d=[]),d.push(l),this.h+=1,this};function pu(a,l){Jt(a),l=wn(a,l),a.g.has(l)&&(a.i=null,a.h-=a.g.get(l).length,a.g.delete(l))}function gu(a,l){return Jt(a),l=wn(a,l),a.g.has(l)}r.forEach=function(a,l){Jt(this),this.g.forEach(function(d,m){d.forEach(function(A){a.call(l,A,m,this)},this)},this)};function _u(a,l){Jt(a);let d=[];if(typeof l=="string")gu(a,l)&&(d=d.concat(a.g.get(wn(a,l))));else for(a=Array.from(a.g.values()),l=0;l<a.length;l++)d=d.concat(a[l]);return d}r.set=function(a,l){return Jt(this),this.i=null,a=wn(this,a),gu(this,a)&&(this.h-=this.g.get(a).length),this.g.set(a,[l]),this.h+=1,this},r.get=function(a,l){return a?(a=_u(this,a),a.length>0?String(a[0]):l):l};function yu(a,l,d){pu(a,l),d.length>0&&(a.i=null,a.g.set(wn(a,l),b(d)),a.h+=d.length)}r.toString=function(){if(this.i)return this.i;if(!this.g)return"";const a=[],l=Array.from(this.g.keys());for(let m=0;m<l.length;m++){var d=l[m];const A=wr(d);d=_u(this,d);for(let R=0;R<d.length;R++){let k=A;d[R]!==""&&(k+="="+wr(d[R])),a.push(k)}}return this.i=a.join("&")};function Iu(a){const l=new Pr;return l.i=a.i,a.g&&(l.g=new Map(a.g),l.h=a.h),l}function wn(a,l){return l=String(l),a.j&&(l=l.toLowerCase()),l}function _p(a,l){l&&!a.j&&(Jt(a),a.i=null,a.g.forEach(function(d,m){const A=m.toLowerCase();m!=A&&(pu(this,m),yu(this,A,d))},a)),a.j=l}function yp(a,l){const d=new Er;if(o.Image){const m=new Image;m.onload=f(_t,d,"TestLoadImage: loaded",!0,l,m),m.onerror=f(_t,d,"TestLoadImage: error",!1,l,m),m.onabort=f(_t,d,"TestLoadImage: abort",!1,l,m),m.ontimeout=f(_t,d,"TestLoadImage: timeout",!1,l,m),o.setTimeout(function(){m.ontimeout&&m.ontimeout()},1e4),m.src=a}else l(!1)}function Ip(a,l){const d=new Er,m=new AbortController,A=setTimeout(()=>{m.abort(),_t(d,"TestPingServer: timeout",!1,l)},1e4);fetch(a,{signal:m.signal}).then(R=>{clearTimeout(A),R.ok?_t(d,"TestPingServer: ok",!0,l):_t(d,"TestPingServer: server error",!1,l)}).catch(()=>{clearTimeout(A),_t(d,"TestPingServer: error",!1,l)})}function _t(a,l,d,m,A){try{A&&(A.onload=null,A.onerror=null,A.onabort=null,A.ontimeout=null),m(d)}catch{}}function Tp(){this.g=new np}function ko(a){this.i=a.Sb||null,this.h=a.ab||!1}p(ko,Qc),ko.prototype.g=function(){return new Ms(this.i,this.h)};function Ms(a,l){Ee.call(this),this.H=a,this.o=l,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}p(Ms,Ee),r=Ms.prototype,r.open=function(a,l){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=a,this.D=l,this.readyState=1,Vr(this)},r.send=function(a){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const l={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};a&&(l.body=a),(this.H||o).fetch(new Request(this.D,l)).then(this.Pa.bind(this),this.ga.bind(this))},r.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,Cr(this)),this.readyState=0},r.Pa=function(a){if(this.g&&(this.l=a,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=a.headers,this.readyState=2,Vr(this)),this.g&&(this.readyState=3,Vr(this),this.g)))if(this.responseType==="arraybuffer")a.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof o.ReadableStream<"u"&&"body"in a){if(this.j=a.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;Tu(this)}else a.text().then(this.Oa.bind(this),this.ga.bind(this))};function Tu(a){a.j.read().then(a.Ma.bind(a)).catch(a.ga.bind(a))}r.Ma=function(a){if(this.g){if(this.o&&a.value)this.response.push(a.value);else if(!this.o){var l=a.value?a.value:new Uint8Array(0);(l=this.B.decode(l,{stream:!a.done}))&&(this.response=this.responseText+=l)}a.done?Cr(this):Vr(this),this.readyState==3&&Tu(this)}},r.Oa=function(a){this.g&&(this.response=this.responseText=a,Cr(this))},r.Na=function(a){this.g&&(this.response=a,Cr(this))},r.ga=function(){this.g&&Cr(this)};function Cr(a){a.readyState=4,a.l=null,a.j=null,a.B=null,Vr(a)}r.setRequestHeader=function(a,l){this.A.append(a,l)},r.getResponseHeader=function(a){return this.h&&this.h.get(a.toLowerCase())||""},r.getAllResponseHeaders=function(){if(!this.h)return"";const a=[],l=this.h.entries();for(var d=l.next();!d.done;)d=d.value,a.push(d[0]+": "+d[1]),d=l.next();return a.join(`\r
`)};function Vr(a){a.onreadystatechange&&a.onreadystatechange.call(a)}Object.defineProperty(Ms.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(a){this.m=a?"include":"same-origin"}});function Eu(a){let l="";return Cs(a,function(d,m){l+=m,l+=":",l+=d,l+=`\r
`}),l}function No(a,l,d){e:{for(m in d){var m=!1;break e}m=!0}m||(d=Eu(d),typeof a=="string"?d!=null&&wr(d):ie(a,l,d))}function ce(a){Ee.call(this),this.headers=new Map,this.L=a||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}p(ce,Ee);var Ep=/^https?$/i,wp=["POST","PUT"];r=ce.prototype,r.Fa=function(a){this.H=a},r.ea=function(a,l,d,m){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+a);l=l?l.toUpperCase():"GET",this.D=a,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():nu.g(),this.g.onreadystatechange=E(h(this.Ca,this));try{this.B=!0,this.g.open(l,String(a),!0),this.B=!1}catch(R){wu(this,R);return}if(a=d||"",d=new Map(this.headers),m)if(Object.getPrototypeOf(m)===Object.prototype)for(var A in m)d.set(A,m[A]);else if(typeof m.keys=="function"&&typeof m.get=="function")for(const R of m.keys())d.set(R,m.get(R));else throw Error("Unknown input type for opt_headers: "+String(m));m=Array.from(d.keys()).find(R=>R.toLowerCase()=="content-type"),A=o.FormData&&a instanceof o.FormData,!(Array.prototype.indexOf.call(wp,l,void 0)>=0)||m||A||d.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[R,k]of d)this.g.setRequestHeader(R,k);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(a),this.v=!1}catch(R){wu(this,R)}};function wu(a,l){a.h=!1,a.g&&(a.j=!0,a.g.abort(),a.j=!1),a.l=l,a.o=5,vu(a),Ls(a)}function vu(a){a.A||(a.A=!0,be(a,"complete"),be(a,"error"))}r.abort=function(a){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=a||7,be(this,"complete"),be(this,"abort"),Ls(this))},r.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Ls(this,!0)),ce.Z.N.call(this)},r.Ca=function(){this.u||(this.B||this.v||this.j?Au(this):this.Xa())},r.Xa=function(){Au(this)};function Au(a){if(a.h&&typeof i<"u"){if(a.v&&yt(a)==4)setTimeout(a.Ca.bind(a),0);else if(be(a,"readystatechange"),yt(a)==4){a.h=!1;try{const R=a.ca();e:switch(R){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var l=!0;break e;default:l=!1}var d;if(!(d=l)){var m;if(m=R===0){let k=String(a.D).match(fu)[1]||null;!k&&o.self&&o.self.location&&(k=o.self.location.protocol.slice(0,-1)),m=!Ep.test(k?k.toLowerCase():"")}d=m}if(d)be(a,"complete"),be(a,"success");else{a.o=6;try{var A=yt(a)>2?a.g.statusText:""}catch{A=""}a.l=A+" ["+a.ca()+"]",vu(a)}}finally{Ls(a)}}}}function Ls(a,l){if(a.g){a.m&&(clearTimeout(a.m),a.m=null);const d=a.g;a.g=null,l||be(a,"ready");try{d.onreadystatechange=null}catch{}}}r.isActive=function(){return!!this.g};function yt(a){return a.g?a.g.readyState:0}r.ca=function(){try{return yt(this)>2?this.g.status:-1}catch{return-1}},r.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},r.La=function(a){if(this.g){var l=this.g.responseText;return a&&l.indexOf(a)==0&&(l=l.substring(a.length)),tp(l)}};function Su(a){try{if(!a.g)return null;if("response"in a.g)return a.g.response;switch(a.F){case"":case"text":return a.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in a.g)return a.g.mozResponseArrayBuffer}return null}catch{return null}}function vp(a){const l={};a=(a.g&&yt(a)>=2&&a.g.getAllResponseHeaders()||"").split(`\r
`);for(let m=0;m<a.length;m++){if(_(a[m]))continue;var d=ap(a[m]);const A=d[0];if(d=d[1],typeof d!="string")continue;d=d.trim();const R=l[A]||[];l[A]=R,R.push(d)}Qm(l,function(m){return m.join(", ")})}r.ya=function(){return this.o},r.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function Dr(a,l,d){return d&&d.internalChannelParams&&d.internalChannelParams[a]||l}function Ru(a){this.za=0,this.i=[],this.j=new Er,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=Dr("failFast",!1,a),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=Dr("baseRetryDelayMs",5e3,a),this.Za=Dr("retryDelaySeedMs",1e4,a),this.Ta=Dr("forwardChannelMaxRetries",2,a),this.va=Dr("forwardChannelRequestTimeoutMs",2e4,a),this.ma=a&&a.xmlHttpFactory||void 0,this.Ua=a&&a.Rb||void 0,this.Aa=a&&a.useFetchStreams||!1,this.O=void 0,this.L=a&&a.supportsCrossDomainXhr||!1,this.M="",this.h=new cu(a&&a.concurrentRequestLimit),this.Ba=new Tp,this.S=a&&a.fastHandshake||!1,this.R=a&&a.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=a&&a.Pb||!1,a&&a.ua&&this.j.ua(),a&&a.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&a&&a.detectBufferingProxy||!1,this.ia=void 0,a&&a.longPollingTimeout&&a.longPollingTimeout>0&&(this.ia=a.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}r=Ru.prototype,r.ka=8,r.I=1,r.connect=function(a,l,d,m){Pe(0),this.W=a,this.H=l||{},d&&m!==void 0&&(this.H.OSID=d,this.H.OAID=m),this.F=this.X,this.J=Ou(this,null,this.W),Us(this)};function xo(a){if(bu(a),a.I==3){var l=a.V++,d=Ke(a.J);if(ie(d,"SID",a.M),ie(d,"RID",l),ie(d,"TYPE","terminate"),kr(a,d),l=new pt(a,a.j,l),l.M=2,l.A=Os(Ke(d)),d=!1,o.navigator&&o.navigator.sendBeacon)try{d=o.navigator.sendBeacon(l.A.toString(),"")}catch{}!d&&o.Image&&(new Image().src=l.A,d=!0),d||(l.g=Mu(l.j,null),l.g.ea(l.A)),l.F=Date.now(),xs(l)}xu(a)}function Fs(a){a.g&&(Mo(a),a.g.cancel(),a.g=null)}function bu(a){Fs(a),a.v&&(o.clearTimeout(a.v),a.v=null),Bs(a),a.h.cancel(),a.m&&(typeof a.m=="number"&&o.clearTimeout(a.m),a.m=null)}function Us(a){if(!uu(a.h)&&!a.m){a.m=!0;var l=a.Ea;J||g(),Y||(J(),Y=!0),I.add(l,a),a.D=0}}function Ap(a,l){return lu(a.h)>=a.h.j-(a.m?1:0)?!1:a.m?(a.i=l.G.concat(a.i),!0):a.I==1||a.I==2||a.D>=(a.Sa?0:a.Ta)?!1:(a.m=Tr(h(a.Ea,a,l),Nu(a,a.D)),a.D++,!0)}r.Ea=function(a){if(this.m)if(this.m=null,this.I==1){if(!a){this.V=Math.floor(Math.random()*1e5),a=this.V++;const A=new pt(this,this.j,a);let R=this.o;if(this.U&&(R?(R=Uc(R),jc(R,this.U)):R=this.U),this.u!==null||this.R||(A.J=R,R=null),this.S)e:{for(var l=0,d=0;d<this.i.length;d++){t:{var m=this.i[d];if("__data__"in m.map&&(m=m.map.__data__,typeof m=="string")){m=m.length;break t}m=void 0}if(m===void 0)break;if(l+=m,l>4096){l=d;break e}if(l===4096||d===this.i.length-1){l=d+1;break e}}l=1e3}else l=1e3;l=Cu(this,A,l),d=Ke(this.J),ie(d,"RID",a),ie(d,"CVER",22),this.G&&ie(d,"X-HTTP-Session-Id",this.G),kr(this,d),R&&(this.R?l="headers="+wr(Eu(R))+"&"+l:this.u&&No(d,this.u,R)),Vo(this.h,A),this.Ra&&ie(d,"TYPE","init"),this.S?(ie(d,"$req",l),ie(d,"SID","null"),A.U=!0,Ro(A,d,null)):Ro(A,d,l),this.I=2}}else this.I==3&&(a?Pu(this,a):this.i.length==0||uu(this.h)||Pu(this))};function Pu(a,l){var d;l?d=l.l:d=a.V++;const m=Ke(a.J);ie(m,"SID",a.M),ie(m,"RID",d),ie(m,"AID",a.K),kr(a,m),a.u&&a.o&&No(m,a.u,a.o),d=new pt(a,a.j,d,a.D+1),a.u===null&&(d.J=a.o),l&&(a.i=l.G.concat(a.i)),l=Cu(a,d,1e3),d.H=Math.round(a.va*.5)+Math.round(a.va*.5*Math.random()),Vo(a.h,d),Ro(d,m,l)}function kr(a,l){a.H&&Cs(a.H,function(d,m){ie(l,m,d)}),a.l&&Cs({},function(d,m){ie(l,m,d)})}function Cu(a,l,d){d=Math.min(a.i.length,d);const m=a.l?h(a.l.Ka,a.l,a):null;e:{var A=a.i;let $=-1;for(;;){const me=["count="+d];$==-1?d>0?($=A[0].g,me.push("ofs="+$)):$=0:me.push("ofs="+$);let ne=!0;for(let ye=0;ye<d;ye++){var R=A[ye].g;const Ge=A[ye].map;if(R-=$,R<0)$=Math.max(0,A[ye].g-100),ne=!1;else try{R="req"+R+"_"||"";try{var k=Ge instanceof Map?Ge:Object.entries(Ge);for(const[Xt,It]of k){let Tt=It;c(It)&&(Tt=Eo(It)),me.push(R+Xt+"="+encodeURIComponent(Tt))}}catch(Xt){throw me.push(R+"type="+encodeURIComponent("_badmap")),Xt}}catch{m&&m(Ge)}}if(ne){k=me.join("&");break e}}k=void 0}return a=a.i.splice(0,d),l.G=a,k}function Vu(a){if(!a.g&&!a.v){a.Y=1;var l=a.Da;J||g(),Y||(J(),Y=!0),I.add(l,a),a.A=0}}function Oo(a){return a.g||a.v||a.A>=3?!1:(a.Y++,a.v=Tr(h(a.Da,a),Nu(a,a.A)),a.A++,!0)}r.Da=function(){if(this.v=null,Du(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var a=4*this.T;this.j.info("BP detection timer enabled: "+a),this.B=Tr(h(this.Wa,this),a)}},r.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,Pe(10),Fs(this),Du(this))};function Mo(a){a.B!=null&&(o.clearTimeout(a.B),a.B=null)}function Du(a){a.g=new pt(a,a.j,"rpc",a.Y),a.u===null&&(a.g.J=a.o),a.g.P=0;var l=Ke(a.na);ie(l,"RID","rpc"),ie(l,"SID",a.M),ie(l,"AID",a.K),ie(l,"CI",a.F?"0":"1"),!a.F&&a.ia&&ie(l,"TO",a.ia),ie(l,"TYPE","xmlhttp"),kr(a,l),a.u&&a.o&&No(l,a.u,a.o),a.O&&(a.g.H=a.O);var d=a.g;a=a.ba,d.M=1,d.A=Os(Ke(l)),d.u=null,d.R=!0,iu(d,a)}r.Va=function(){this.C!=null&&(this.C=null,Fs(this),Oo(this),Pe(19))};function Bs(a){a.C!=null&&(o.clearTimeout(a.C),a.C=null)}function ku(a,l){var d=null;if(a.g==l){Bs(a),Mo(a),a.g=null;var m=2}else if(Co(a.h,l))d=l.G,hu(a.h,l),m=1;else return;if(a.I!=0){if(l.o)if(m==1){d=l.u?l.u.length:0,l=Date.now()-l.F;var A=a.D;m=ks(),be(m,new eu(m,d)),Us(a)}else Vu(a);else if(A=l.m,A==3||A==0&&l.X>0||!(m==1&&Ap(a,l)||m==2&&Oo(a)))switch(d&&d.length>0&&(l=a.h,l.i=l.i.concat(d)),A){case 1:Yt(a,5);break;case 4:Yt(a,10);break;case 3:Yt(a,6);break;default:Yt(a,2)}}}function Nu(a,l){let d=a.Qa+Math.floor(Math.random()*a.Za);return a.isActive()||(d*=2),d*l}function Yt(a,l){if(a.j.info("Error code "+l),l==2){var d=h(a.bb,a),m=a.Ua;const A=!m;m=new gt(m||"//www.google.com/images/cleardot.gif"),o.location&&o.location.protocol=="http"||Ar(m,"https"),Os(m),A?yp(m.toString(),d):Ip(m.toString(),d)}else Pe(2);a.I=0,a.l&&a.l.pa(l),xu(a),bu(a)}r.bb=function(a){a?(this.j.info("Successfully pinged google.com"),Pe(2)):(this.j.info("Failed to ping google.com"),Pe(1))};function xu(a){if(a.I=0,a.ja=[],a.l){const l=du(a.h);(l.length!=0||a.i.length!=0)&&(V(a.ja,l),V(a.ja,a.i),a.h.i.length=0,b(a.i),a.i.length=0),a.l.oa()}}function Ou(a,l,d){var m=d instanceof gt?Ke(d):new gt(d);if(m.g!="")l&&(m.g=l+"."+m.g),Sr(m,m.u);else{var A=o.location;m=A.protocol,l=l?l+"."+A.hostname:A.hostname,A=+A.port;const R=new gt(null);m&&Ar(R,m),l&&(R.g=l),A&&Sr(R,A),d&&(R.h=d),m=R}return d=a.G,l=a.wa,d&&l&&ie(m,d,l),ie(m,"VER",a.ka),kr(a,m),m}function Mu(a,l,d){if(l&&!a.L)throw Error("Can't create secondary domain capable XhrIo object.");return l=a.Aa&&!a.ma?new ce(new ko({ab:d})):new ce(a.ma),l.Fa(a.L),l}r.isActive=function(){return!!this.l&&this.l.isActive(this)};function Lu(){}r=Lu.prototype,r.ra=function(){},r.qa=function(){},r.pa=function(){},r.oa=function(){},r.isActive=function(){return!0},r.Ka=function(){};function js(){}js.prototype.g=function(a,l){return new xe(a,l)};function xe(a,l){Ee.call(this),this.g=new Ru(l),this.l=a,this.h=l&&l.messageUrlParams||null,a=l&&l.messageHeaders||null,l&&l.clientProtocolHeaderRequired&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"}),this.g.o=a,a=l&&l.initMessageHeaders||null,l&&l.messageContentType&&(a?a["X-WebChannel-Content-Type"]=l.messageContentType:a={"X-WebChannel-Content-Type":l.messageContentType}),l&&l.sa&&(a?a["X-WebChannel-Client-Profile"]=l.sa:a={"X-WebChannel-Client-Profile":l.sa}),this.g.U=a,(a=l&&l.Qb)&&!_(a)&&(this.g.u=a),this.A=l&&l.supportsCrossDomainXhr||!1,this.v=l&&l.sendRawJson||!1,(l=l&&l.httpSessionIdParam)&&!_(l)&&(this.g.G=l,a=this.h,a!==null&&l in a&&(a=this.h,l in a&&delete a[l])),this.j=new vn(this)}p(xe,Ee),xe.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},xe.prototype.close=function(){xo(this.g)},xe.prototype.o=function(a){var l=this.g;if(typeof a=="string"){var d={};d.__data__=a,a=d}else this.v&&(d={},d.__data__=Eo(a),a=d);l.i.push(new lp(l.Ya++,a)),l.I==3&&Us(l)},xe.prototype.N=function(){this.g.l=null,delete this.j,xo(this.g),delete this.g,xe.Z.N.call(this)};function Fu(a){wo.call(this),a.__headers__&&(this.headers=a.__headers__,this.statusCode=a.__status__,delete a.__headers__,delete a.__status__);var l=a.__sm__;if(l){e:{for(const d in l){a=d;break e}a=void 0}(this.i=a)&&(a=this.i,l=l!==null&&a in l?l[a]:void 0),this.data=l}else this.data=a}p(Fu,wo);function Uu(){vo.call(this),this.status=1}p(Uu,vo);function vn(a){this.g=a}p(vn,Lu),vn.prototype.ra=function(){be(this.g,"a")},vn.prototype.qa=function(a){be(this.g,new Fu(a))},vn.prototype.pa=function(a){be(this.g,new Uu)},vn.prototype.oa=function(){be(this.g,"b")},js.prototype.createWebChannel=js.prototype.g,xe.prototype.send=xe.prototype.o,xe.prototype.open=xe.prototype.m,xe.prototype.close=xe.prototype.close,Dd=function(){return new js},Vd=function(){return ks()},Cd=Wt,ca={jb:0,mb:1,nb:2,Hb:3,Mb:4,Jb:5,Kb:6,Ib:7,Gb:8,Lb:9,PROXY:10,NOPROXY:11,Eb:12,Ab:13,Bb:14,zb:15,Cb:16,Db:17,fb:18,eb:19,gb:20},Ns.NO_ERROR=0,Ns.TIMEOUT=8,Ns.HTTP_ERROR=6,ti=Ns,tu.COMPLETE="complete",Pd=tu,Jc.EventType=yr,yr.OPEN="a",yr.CLOSE="b",yr.ERROR="c",yr.MESSAGE="d",Ee.prototype.listen=Ee.prototype.J,Ur=Jc,ce.prototype.listenOnce=ce.prototype.K,ce.prototype.getLastError=ce.prototype.Ha,ce.prototype.getLastErrorCode=ce.prototype.ya,ce.prototype.getStatus=ce.prototype.ca,ce.prototype.getResponseJson=ce.prototype.La,ce.prototype.getResponseText=ce.prototype.la,ce.prototype.send=ce.prototype.ea,ce.prototype.setWithCredentials=ce.prototype.Fa,bd=ce}).apply(typeof $s<"u"?$s:typeof self<"u"?self:typeof window<"u"?window:{});/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ve{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}ve.UNAUTHENTICATED=new ve(null),ve.GOOGLE_CREDENTIALS=new ve("google-credentials-uid"),ve.FIRST_PARTY=new ve("first-party-uid"),ve.MOCK_USER=new ve("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let hr="12.13.0";function iI(r){hr=r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ft=new Oa("@firebase/firestore");function Vn(){return Ft.logLevel}function ev(r){Ft.setLogLevel(r)}function C(r,...e){if(Ft.logLevel<=H.DEBUG){const t=e.map(Ka);Ft.debug(`Firestore (${hr}): ${r}`,...t)}}function le(r,...e){if(Ft.logLevel<=H.ERROR){const t=e.map(Ka);Ft.error(`Firestore (${hr}): ${r}`,...t)}}function qn(r,...e){if(Ft.logLevel<=H.WARN){const t=e.map(Ka);Ft.warn(`Firestore (${hr}): ${r}`,...t)}}function Ka(r){if(typeof r=="string")return r;try{return(function(t){return JSON.stringify(t)})(r)}catch{return r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function M(r,e,t){let n="Unexpected state";typeof e=="string"?n=e:t=e,kd(r,n,t)}function kd(r,e,t){let n=`FIRESTORE (${hr}) INTERNAL ASSERTION FAILED: ${e} (ID: ${r.toString(16)})`;if(t!==void 0)try{n+=" CONTEXT: "+JSON.stringify(t)}catch{n+=" CONTEXT: "+t}throw le(n),new Error(n)}function F(r,e,t,n){let s="Unexpected state";typeof t=="string"?s=t:n=t,r||kd(e,s,n)}function L(r,e){return r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const P={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class O extends dt{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class it{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oI{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class aI{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(ve.UNAUTHENTICATED)))}shutdown(){}}class cI{constructor(e){this.t=e,this.currentUser=ve.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){F(this.o===void 0,42304);let n=this.i;const s=u=>this.i!==n?(n=this.i,t(u)):Promise.resolve();let i=new it;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new it,e.enqueueRetryable((()=>s(this.currentUser)))};const o=()=>{const u=i;e.enqueueRetryable((async()=>{await u.promise,await s(this.currentUser)}))},c=u=>{C("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=u,this.o&&(this.auth.addAuthTokenListener(this.o),o())};this.t.onInit((u=>c(u))),setTimeout((()=>{if(!this.auth){const u=this.t.getImmediate({optional:!0});u?c(u):(C("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new it)}}),0),o()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((n=>this.i!==e?(C("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):n?(F(typeof n.accessToken=="string",31837,{l:n}),new oI(n.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return F(e===null||typeof e=="string",2055,{h:e}),new ve(e)}}class uI{constructor(e,t,n){this.P=e,this.T=t,this.I=n,this.type="FirstParty",this.user=ve.FIRST_PARTY,this.R=new Map}A(){return this.I?this.I():null}get headers(){this.R.set("X-Goog-AuthUser",this.P);const e=this.A();return e&&this.R.set("Authorization",e),this.T&&this.R.set("X-Goog-Iam-Authorization-Token",this.T),this.R}}class lI{constructor(e,t,n){this.P=e,this.T=t,this.I=n}getToken(){return Promise.resolve(new uI(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable((()=>t(ve.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class ml{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class hI{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,qe(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){F(this.o===void 0,3512);const n=i=>{i.error!=null&&C("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const o=i.token!==this.m;return this.m=i.token,C("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?t(i.token):Promise.resolve()};this.o=i=>{e.enqueueRetryable((()=>n(i)))};const s=i=>{C("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((i=>s(i))),setTimeout((()=>{if(!this.appCheck){const i=this.V.getImmediate({optional:!0});i?s(i):C("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new ml(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(F(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new ml(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dI(r){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(r);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let n=0;n<r;n++)t[n]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ga{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let n="";for(;n.length<20;){const s=dI(40);for(let i=0;i<s.length;++i)n.length<20&&s[i]<t&&(n+=e.charAt(s[i]%62))}return n}}function j(r,e){return r<e?-1:r>e?1:0}function ua(r,e){const t=Math.min(r.length,e.length);for(let n=0;n<t;n++){const s=r.charAt(n),i=e.charAt(n);if(s!==i)return Ko(s)===Ko(i)?j(s,i):Ko(s)?1:-1}return j(r.length,e.length)}const fI=55296,mI=57343;function Ko(r){const e=r.charCodeAt(0);return e>=fI&&e<=mI}function zn(r,e,t){return r.length===e.length&&r.every(((n,s)=>t(n,e[s])))}function Nd(r){return r+"\0"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pl="__name__";class He{constructor(e,t,n){t===void 0?t=0:t>e.length&&M(637,{offset:t,range:e.length}),n===void 0?n=e.length-t:n>e.length-t&&M(1746,{length:n,range:e.length-t}),this.segments=e,this.offset=t,this.len=n}get length(){return this.len}isEqual(e){return He.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof He?e.forEach((n=>{t.push(n)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,n=this.limit();t<n;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const n=Math.min(e.length,t.length);for(let s=0;s<n;s++){const i=He.compareSegments(e.get(s),t.get(s));if(i!==0)return i}return j(e.length,t.length)}static compareSegments(e,t){const n=He.isNumericId(e),s=He.isNumericId(t);return n&&!s?-1:!n&&s?1:n&&s?He.extractNumericId(e).compare(He.extractNumericId(t)):ua(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return Ot.fromString(e.substring(4,e.length-2))}}class ee extends He{construct(e,t,n){return new ee(e,t,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const n of e){if(n.indexOf("//")>=0)throw new O(P.INVALID_ARGUMENT,`Invalid segment (${n}). Paths must not contain // in them.`);t.push(...n.split("/").filter((s=>s.length>0)))}return new ee(t)}static emptyPath(){return new ee([])}}const pI=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class ae extends He{construct(e,t,n){return new ae(e,t,n)}static isValidIdentifier(e){return pI.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),ae.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===pl}static keyField(){return new ae([pl])}static fromServerFormat(e){const t=[];let n="",s=0;const i=()=>{if(n.length===0)throw new O(P.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(n),n=""};let o=!1;for(;s<e.length;){const c=e[s];if(c==="\\"){if(s+1===e.length)throw new O(P.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const u=e[s+1];if(u!=="\\"&&u!=="."&&u!=="`")throw new O(P.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);n+=u,s+=2}else c==="`"?(o=!o,s++):c!=="."||o?(n+=c,s++):(i(),s++)}if(i(),o)throw new O(P.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new ae(t)}static emptyPath(){return new ae([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class x{constructor(e){this.path=e}static fromPath(e){return new x(ee.fromString(e))}static fromName(e){return new x(ee.fromString(e).popFirst(5))}static empty(){return new x(ee.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&ee.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return ee.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new x(new ee(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gI(r,e,t){if(!t)throw new O(P.INVALID_ARGUMENT,`Function ${r}() cannot be called with an empty ${e}.`)}function _I(r,e,t,n){if(e===!0&&n===!0)throw new O(P.INVALID_ARGUMENT,`${r} and ${t} cannot be used together.`)}function gl(r){if(!x.isDocumentKey(r))throw new O(P.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${r} has ${r.length}.`)}function xd(r){return typeof r=="object"&&r!==null&&(Object.getPrototypeOf(r)===Object.prototype||Object.getPrototypeOf(r)===null)}function Ha(r){if(r===void 0)return"undefined";if(r===null)return"null";if(typeof r=="string")return r.length>20&&(r=`${r.substring(0,20)}...`),JSON.stringify(r);if(typeof r=="number"||typeof r=="boolean")return""+r;if(typeof r=="object"){if(r instanceof Array)return"an array";{const e=(function(n){return n.constructor?n.constructor.name:null})(r);return e?`a custom ${e} object`:"an object"}}return typeof r=="function"?"a function":M(12329,{type:typeof r})}function $n(r,e){if("_delegate"in r&&(r=r._delegate),!(r instanceof e)){if(e.name===r.constructor.name)throw new O(P.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Ha(r);throw new O(P.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return r}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fe(r,e){const t={typeString:r};return e&&(t.value=e),t}function Es(r,e){if(!xd(r))throw new O(P.INVALID_ARGUMENT,"JSON must be an object");let t;for(const n in e)if(e[n]){const s=e[n].typeString,i="value"in e[n]?{value:e[n].value}:void 0;if(!(n in r)){t=`JSON missing required field: '${n}'`;break}const o=r[n];if(s&&typeof o!==s){t=`JSON field '${n}' must be a ${s}.`;break}if(i!==void 0&&o!==i.value){t=`Expected '${n}' field to equal '${i.value}'`;break}}if(t)throw new O(P.INVALID_ARGUMENT,t);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _l=-62135596800,yl=1e6;class X{static now(){return X.fromMillis(Date.now())}static fromDate(e){return X.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),n=Math.floor((e-1e3*t)*yl);return new X(t,n)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new O(P.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new O(P.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<_l)throw new O(P.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new O(P.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/yl}_compareTo(e){return this.seconds===e.seconds?j(this.nanoseconds,e.nanoseconds):j(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:X._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(Es(e,X._jsonSchema))return new X(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-_l;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}X._jsonSchemaVersion="firestore/timestamp/1.0",X._jsonSchema={type:fe("string",X._jsonSchemaVersion),seconds:fe("number"),nanoseconds:fe("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class U{static fromTimestamp(e){return new U(e)}static min(){return new U(new X(0,0))}static max(){return new U(new X(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kn=-1;class Ei{constructor(e,t,n,s){this.indexId=e,this.collectionGroup=t,this.fields=n,this.indexState=s}}function la(r){return r.fields.find((e=>e.kind===2))}function tn(r){return r.fields.filter((e=>e.kind!==2))}Ei.UNKNOWN_ID=-1;class ni{constructor(e,t){this.fieldPath=e,this.kind=t}}class rs{constructor(e,t){this.sequenceNumber=e,this.offset=t}static empty(){return new rs(0,Ue.min())}}function Od(r,e){const t=r.toTimestamp().seconds,n=r.toTimestamp().nanoseconds+1,s=U.fromTimestamp(n===1e9?new X(t+1,0):new X(t,n));return new Ue(s,x.empty(),e)}function Md(r){return new Ue(r.readTime,r.key,Kn)}class Ue{constructor(e,t,n){this.readTime=e,this.documentKey=t,this.largestBatchId=n}static min(){return new Ue(U.min(),x.empty(),Kn)}static max(){return new Ue(U.max(),x.empty(),Kn)}}function Wa(r,e){let t=r.readTime.compareTo(e.readTime);return t!==0?t:(t=x.comparator(r.documentKey,e.documentKey),t!==0?t:j(r.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ld="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class Fd{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function zt(r){if(r.code!==P.FAILED_PRECONDITION||r.message!==Ld)throw r;C("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class v{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&M(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new v(((n,s)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(n,s)},this.catchCallback=i=>{this.wrapFailure(t,i).next(n,s)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{const t=e();return t instanceof v?t:v.resolve(t)}catch(t){return v.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):v.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):v.reject(t)}static resolve(e){return new v(((t,n)=>{t(e)}))}static reject(e){return new v(((t,n)=>{n(e)}))}static waitFor(e){return new v(((t,n)=>{let s=0,i=0,o=!1;e.forEach((c=>{++s,c.next((()=>{++i,o&&i===s&&t()}),(u=>n(u)))})),o=!0,i===s&&t()}))}static or(e){let t=v.resolve(!1);for(const n of e)t=t.next((s=>s?v.resolve(s):n()));return t}static forEach(e,t){const n=[];return e.forEach(((s,i)=>{n.push(t.call(this,s,i))})),this.waitFor(n)}static mapArray(e,t){return new v(((n,s)=>{const i=e.length,o=new Array(i);let c=0;for(let u=0;u<i;u++){const h=u;t(e[h]).next((f=>{o[h]=f,++c,c===i&&n(o)}),(f=>s(f)))}}))}static doWhile(e,t){return new v(((n,s)=>{const i=()=>{e()===!0?t().next((()=>{i()}),s):n()};i()}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Oe="SimpleDb";class Ki{static open(e,t,n,s){try{return new Ki(t,e.transaction(s,n))}catch(i){throw new Kr(t,i)}}constructor(e,t){this.action=e,this.transaction=t,this.aborted=!1,this.S=new it,this.transaction.oncomplete=()=>{this.S.resolve()},this.transaction.onabort=()=>{t.error?this.S.reject(new Kr(e,t.error)):this.S.resolve()},this.transaction.onerror=n=>{const s=Qa(n.target.error);this.S.reject(new Kr(e,s))}}get D(){return this.S.promise}abort(e){e&&this.S.reject(e),this.aborted||(C(Oe,"Aborting transaction:",e?e.message:"Client-initiated abort"),this.aborted=!0,this.transaction.abort())}C(){const e=this.transaction;this.aborted||typeof e.commit!="function"||e.commit()}store(e){const t=this.transaction.objectStore(e);return new II(t)}}class Mt{static delete(e){return C(Oe,"Removing database:",e),rn(Oh().indexedDB.deleteDatabase(e)).toPromise()}static v(){if(!qh())return!1;if(Mt.F())return!0;const e=ge(),t=Mt.M(e),n=0<t&&t<10,s=Ud(e),i=0<s&&s<4.5;return!(e.indexOf("MSIE ")>0||e.indexOf("Trident/")>0||e.indexOf("Edge/")>0||n||i)}static F(){var e;return typeof process<"u"&&((e=process.__PRIVATE_env)==null?void 0:e.__PRIVATE_USE_MOCK_PERSISTENCE)==="YES"}static O(e,t){return e.store(t)}static M(e){const t=e.match(/i(?:phone|pad|pod) os ([\d_]+)/i),n=t?t[1].split("_").slice(0,2).join("."):"-1";return Number(n)}constructor(e,t,n){this.name=e,this.version=t,this.N=n,this.B=null,Mt.M(ge())===12.2&&le("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.")}async L(e){return this.db||(C(Oe,"Opening database:",this.name),this.db=await new Promise(((t,n)=>{const s=indexedDB.open(this.name,this.version);s.onsuccess=i=>{const o=i.target.result;t(o)},s.onblocked=()=>{n(new Kr(e,"Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."))},s.onerror=i=>{const o=i.target.error;o.name==="VersionError"?n(new O(P.FAILED_PRECONDITION,"A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")):o.name==="InvalidStateError"?n(new O(P.FAILED_PRECONDITION,"Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: "+o)):n(new Kr(e,o))},s.onupgradeneeded=i=>{C(Oe,'Database "'+this.name+'" requires upgrade from version:',i.oldVersion);const o=i.target.result;this.N.k(o,s.transaction,i.oldVersion,this.version).next((()=>{C(Oe,"Database upgrade to version "+this.version+" complete")}))}}))),this.K&&(this.db.onversionchange=t=>this.K(t)),this.db}q(e){this.K=e,this.db&&(this.db.onversionchange=t=>e(t))}async runTransaction(e,t,n,s){const i=t==="readonly";let o=0;for(;;){++o;try{this.db=await this.L(e);const c=Ki.open(this.db,e,i?"readonly":"readwrite",n),u=s(c).next((h=>(c.C(),h))).catch((h=>(c.abort(h),v.reject(h)))).toPromise();return u.catch((()=>{})),await c.D,u}catch(c){const u=c,h=u.name!=="FirebaseError"&&o<3;if(C(Oe,"Transaction failed with error:",u.message,"Retrying:",h),this.close(),!h)return Promise.reject(u)}}}close(){this.db&&this.db.close(),this.db=void 0}}function Ud(r){const e=r.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}class yI{constructor(e){this.U=e,this.$=!1,this.W=null}get isDone(){return this.$}get G(){return this.W}set cursor(e){this.U=e}done(){this.$=!0}j(e){this.W=e}delete(){return rn(this.U.delete())}}class Kr extends O{constructor(e,t){super(P.UNAVAILABLE,`IndexedDB transaction '${e}' failed: ${t}`),this.name="IndexedDbTransactionError"}}function $t(r){return r.name==="IndexedDbTransactionError"}class II{constructor(e){this.store=e}put(e,t){let n;return t!==void 0?(C(Oe,"PUT",this.store.name,e,t),n=this.store.put(t,e)):(C(Oe,"PUT",this.store.name,"<auto-key>",e),n=this.store.put(e)),rn(n)}add(e){return C(Oe,"ADD",this.store.name,e,e),rn(this.store.add(e))}get(e){return rn(this.store.get(e)).next((t=>(t===void 0&&(t=null),C(Oe,"GET",this.store.name,e,t),t)))}delete(e){return C(Oe,"DELETE",this.store.name,e),rn(this.store.delete(e))}count(){return C(Oe,"COUNT",this.store.name),rn(this.store.count())}J(e,t){const n=this.options(e,t),s=n.index?this.store.index(n.index):this.store;if(typeof s.getAll=="function"){const i=s.getAll(n.range);return new v(((o,c)=>{i.onerror=u=>{c(u.target.error)},i.onsuccess=u=>{o(u.target.result)}}))}{const i=this.cursor(n),o=[];return this.H(i,((c,u)=>{o.push(u)})).next((()=>o))}}Z(e,t){const n=this.store.getAll(e,t===null?void 0:t);return new v(((s,i)=>{n.onerror=o=>{i(o.target.error)},n.onsuccess=o=>{s(o.target.result)}}))}X(e,t){C(Oe,"DELETE ALL",this.store.name);const n=this.options(e,t);n.Y=!1;const s=this.cursor(n);return this.H(s,((i,o,c)=>c.delete()))}ee(e,t){let n;t?n=e:(n={},t=e);const s=this.cursor(n);return this.H(s,t)}te(e){const t=this.cursor({});return new v(((n,s)=>{t.onerror=i=>{const o=Qa(i.target.error);s(o)},t.onsuccess=i=>{const o=i.target.result;o?e(o.primaryKey,o.value).next((c=>{c?o.continue():n()})):n()}}))}H(e,t){const n=[];return new v(((s,i)=>{e.onerror=o=>{i(o.target.error)},e.onsuccess=o=>{const c=o.target.result;if(!c)return void s();const u=new yI(c),h=t(c.primaryKey,c.value,u);if(h instanceof v){const f=h.catch((p=>(u.done(),v.reject(p))));n.push(f)}u.isDone?s():u.G===null?c.continue():c.continue(u.G)}})).next((()=>v.waitFor(n)))}options(e,t){let n;return e!==void 0&&(typeof e=="string"?n=e:t=e),{index:n,range:t}}cursor(e){let t="next";if(e.reverse&&(t="prev"),e.index){const n=this.store.index(e.index);return e.Y?n.openKeyCursor(e.range,t):n.openCursor(e.range,t)}return this.store.openCursor(e.range,t)}}function rn(r){return new v(((e,t)=>{r.onsuccess=n=>{const s=n.target.result;e(s)},r.onerror=n=>{const s=Qa(n.target.error);t(s)}}))}let Il=!1;function Qa(r){const e=Mt.M(ge());if(e>=12.2&&e<13){const t="An internal error was encountered in the Indexed Database server";if(r.message.indexOf(t)>=0){const n=new O("internal",`IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${t}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);return Il||(Il=!0,setTimeout((()=>{throw n}),0)),n}}return r}const Gr="IndexBackfiller";class TI{constructor(e,t){this.asyncQueue=e,this.ne=t,this.task=null}start(){this.re(15e3)}stop(){this.task&&(this.task.cancel(),this.task=null)}get started(){return this.task!==null}re(e){C(Gr,`Scheduled in ${e}ms`),this.task=this.asyncQueue.enqueueAfterDelay("index_backfill",e,(async()=>{this.task=null;try{const t=await this.ne.ie();C(Gr,`Documents written: ${t}`)}catch(t){$t(t)?C(Gr,"Ignoring IndexedDB error during index backfill: ",t):await zt(t)}await this.re(6e4)}))}}class EI{constructor(e,t){this.localStore=e,this.persistence=t}async ie(e=50){return this.persistence.runTransaction("Backfill Indexes","readwrite-primary",(t=>this.se(t,e)))}se(e,t){const n=new Set;let s=t,i=!0;return v.doWhile((()=>i===!0&&s>0),(()=>this.localStore.indexManager.getNextCollectionGroupToUpdate(e).next((o=>{if(o!==null&&!n.has(o))return C(Gr,`Processing collection: ${o}`),this.oe(e,o,s).next((c=>{s-=c,n.add(o)}));i=!1})))).next((()=>t-s))}oe(e,t,n){return this.localStore.indexManager.getMinOffsetFromCollectionGroup(e,t).next((s=>this.localStore.localDocuments.getNextDocuments(e,t,s,n).next((i=>{const o=i.changes;return this.localStore.indexManager.updateIndexEntries(e,o).next((()=>this._e(s,i))).next((c=>(C(Gr,`Updating offset: ${c}`),this.localStore.indexManager.updateCollectionGroup(e,t,c)))).next((()=>o.size))}))))}_e(e,t){let n=e;return t.changes.forEach(((s,i)=>{const o=Md(i);Wa(o,n)>0&&(n=o)})),new Ue(n.readTime,n.documentKey,Math.max(t.batchId,e.largestBatchId))}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class De{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=n=>this.ae(n),this.ue=n=>t.writeSequenceNumber(n))}ae(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ue&&this.ue(e),e}}De.ce=-1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const un=-1;function Gi(r){return r==null}function ss(r){return r===0&&1/r==-1/0}function Bd(r){return typeof r=="number"&&Number.isInteger(r)&&!ss(r)&&r<=Number.MAX_SAFE_INTEGER&&r>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wi="";function Re(r){let e="";for(let t=0;t<r.length;t++)e.length>0&&(e=Tl(e)),e=wI(r.get(t),e);return Tl(e)}function wI(r,e){let t=e;const n=r.length;for(let s=0;s<n;s++){const i=r.charAt(s);switch(i){case"\0":t+="";break;case wi:t+="";break;default:t+=i}}return t}function Tl(r){return r+wi+""}function Qe(r){const e=r.length;if(F(e>=2,64408,{path:r}),e===2)return F(r.charAt(0)===wi&&r.charAt(1)==="",56145,{path:r}),ee.emptyPath();const t=e-2,n=[];let s="";for(let i=0;i<e;){const o=r.indexOf(wi,i);switch((o<0||o>t)&&M(50515,{path:r}),r.charAt(o+1)){case"":const c=r.substring(i,o);let u;s.length===0?u=c:(s+=c,u=s,s=""),n.push(u);break;case"":s+=r.substring(i,o),s+="\0";break;case"":s+=r.substring(i,o+1);break;default:M(61167,{path:r})}i=o+2}return new ee(n)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nn="remoteDocuments",ws="owner",An="owner",is="mutationQueues",vI="userId",je="mutations",El="batchId",cn="userMutationsIndex",wl=["userId","batchId"];/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ri(r,e){return[r,Re(e)]}function jd(r,e,t){return[r,Re(e),t]}const AI={},Gn="documentMutations",vi="remoteDocumentsV14",SI=["prefixPath","collectionGroup","readTime","documentId"],si="documentKeyIndex",RI=["prefixPath","collectionGroup","documentId"],qd="collectionGroupIndex",bI=["collectionGroup","readTime","prefixPath","documentId"],os="remoteDocumentGlobal",ha="remoteDocumentGlobalKey",Hn="targets",zd="queryTargetsIndex",PI=["canonicalId","targetId"],Wn="targetDocuments",CI=["targetId","path"],Ja="documentTargetsIndex",VI=["path","targetId"],Ai="targetGlobalKey",ln="targetGlobal",as="collectionParents",DI=["collectionId","parent"],Qn="clientMetadata",kI="clientId",Hi="bundles",NI="bundleId",Wi="namedQueries",xI="name",Ya="indexConfiguration",OI="indexId",da="collectionGroupIndex",MI="collectionGroup",Hr="indexState",LI=["indexId","uid"],$d="sequenceNumberIndex",FI=["uid","sequenceNumber"],Wr="indexEntries",UI=["indexId","uid","arrayValue","directionalValue","orderedDocumentKey","documentKey"],Kd="documentKeyIndex",BI=["indexId","uid","orderedDocumentKey"],Qi="documentOverlays",jI=["userId","collectionPath","documentId"],fa="collectionPathOverlayIndex",qI=["userId","collectionPath","largestBatchId"],Gd="collectionGroupOverlayIndex",zI=["userId","collectionGroup","largestBatchId"],Xa="globals",$I="name",Hd=[is,je,Gn,nn,Hn,ws,ln,Wn,Qn,os,as,Hi,Wi],KI=[...Hd,Qi],Wd=[is,je,Gn,vi,Hn,ws,ln,Wn,Qn,os,as,Hi,Wi,Qi],Qd=Wd,Za=[...Qd,Ya,Hr,Wr],GI=Za,Jd=[...Za,Xa],HI=Jd;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ma extends Fd{constructor(e,t){super(),this.le=e,this.currentSequenceNumber=t}}function _e(r,e){const t=L(r);return Mt.O(t.le,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vl(r){let e=0;for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e++;return e}function Kt(r,e){for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e(t,r[t])}function Yd(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class re{constructor(e,t){this.comparator=e,this.root=t||Te.EMPTY}insert(e,t){return new re(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,Te.BLACK,null,null))}remove(e){return new re(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Te.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const n=this.comparator(e,t.key);if(n===0)return t.value;n<0?t=t.left:n>0&&(t=t.right)}return null}indexOf(e){let t=0,n=this.root;for(;!n.isEmpty();){const s=this.comparator(e,n.key);if(s===0)return t+n.left.size;s<0?n=n.left:(t+=n.left.size+1,n=n.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,n)=>(e(t,n),!1)))}toString(){const e=[];return this.inorderTraversal(((t,n)=>(e.push(`${t}:${n}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Ks(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Ks(this.root,e,this.comparator,!1)}getReverseIterator(){return new Ks(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Ks(this.root,e,this.comparator,!0)}}class Ks{constructor(e,t,n,s){this.isReverse=s,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?n(e.key,t):1,t&&s&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class Te{constructor(e,t,n,s,i){this.key=e,this.value=t,this.color=n??Te.RED,this.left=s??Te.EMPTY,this.right=i??Te.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,n,s,i){return new Te(e??this.key,t??this.value,n??this.color,s??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,n){let s=this;const i=n(e,s.key);return s=i<0?s.copy(null,null,null,s.left.insert(e,t,n),null):i===0?s.copy(null,t,null,null,null):s.copy(null,null,null,null,s.right.insert(e,t,n)),s.fixUp()}removeMin(){if(this.left.isEmpty())return Te.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let n,s=this;if(t(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),t(e,s.key)===0){if(s.right.isEmpty())return Te.EMPTY;n=s.right.min(),s=s.copy(n.key,n.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Te.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Te.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw M(43730,{key:this.key,value:this.value});if(this.right.isRed())throw M(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw M(27949);return e+(this.isRed()?0:1)}}Te.EMPTY=null,Te.RED=!0,Te.BLACK=!1;Te.EMPTY=new class{constructor(){this.size=0}get key(){throw M(57766)}get value(){throw M(16141)}get color(){throw M(16727)}get left(){throw M(29726)}get right(){throw M(36894)}copy(e,t,n,s,i){return this}insert(e,t,n){return new Te(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Z{constructor(e){this.comparator=e,this.data=new re(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,n)=>(e(t),!1)))}forEachInRange(e,t){const n=this.data.getIteratorFrom(e[0]);for(;n.hasNext();){const s=n.getNext();if(this.comparator(s.key,e[1])>=0)return;t(s.key)}}forEachWhile(e,t){let n;for(n=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();n.hasNext();)if(!e(n.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Al(this.data.getIterator())}getIteratorFrom(e){return new Al(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((n=>{t=t.add(n)})),t}isEqual(e){if(!(e instanceof Z)||this.size!==e.size)return!1;const t=this.data.getIterator(),n=e.data.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=n.getNext().key;if(this.comparator(s,i)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((t=>{e.push(t)})),e}toString(){const e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){const t=new Z(this.comparator);return t.data=e,t}}class Al{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}function Sn(r){return r.hasNext()?r.getNext():void 0}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ke{constructor(e){this.fields=e,e.sort(ae.comparator)}static empty(){return new ke([])}unionWith(e){let t=new Z(ae.comparator);for(const n of this.fields)t=t.add(n);for(const n of e)t=t.add(n);return new ke(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return zn(this.fields,e.fields,((t,n)=>t.isEqual(n)))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xd extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class he{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(s){try{return atob(s)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new Xd("Invalid base64 string: "+i):i}})(e);return new he(t)}static fromUint8Array(e){const t=(function(s){let i="";for(let o=0;o<s.length;++o)i+=String.fromCharCode(s[o]);return i})(e);return new he(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const n=new Uint8Array(t.length);for(let s=0;s<t.length;s++)n[s]=t.charCodeAt(s);return n})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return j(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}he.EMPTY_BYTE_STRING=new he("");const WI=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function ut(r){if(F(!!r,39018),typeof r=="string"){let e=0;const t=WI.exec(r);if(F(!!t,46558,{timestamp:r}),t[1]){let s=t[1];s=(s+"000000000").substr(0,9),e=Number(s)}const n=new Date(r);return{seconds:Math.floor(n.getTime()/1e3),nanos:e}}return{seconds:oe(r.seconds),nanos:oe(r.nanos)}}function oe(r){return typeof r=="number"?r:typeof r=="string"?Number(r):0}function lt(r){return typeof r=="string"?he.fromBase64String(r):he.fromUint8Array(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zd="server_timestamp",ef="__type__",tf="__previous_value__",nf="__local_write_time__";function ec(r){var t,n;return((n=(((t=r==null?void 0:r.mapValue)==null?void 0:t.fields)||{})[ef])==null?void 0:n.stringValue)===Zd}function Ji(r){const e=r.mapValue.fields[tf];return ec(e)?Ji(e):e}function cs(r){const e=ut(r.mapValue.fields[nf].timestampValue);return new X(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class QI{constructor(e,t,n,s,i,o,c,u,h,f,p){this.databaseId=e,this.appId=t,this.persistenceKey=n,this.host=s,this.ssl=i,this.forceLongPolling=o,this.autoDetectLongPolling=c,this.longPollingOptions=u,this.useFetchStreams=h,this.isUsingEmulator=f,this.apiKey=p}}const Si="(default)";class gn{constructor(e,t){this.projectId=e,this.database=t||Si}static empty(){return new gn("","")}get isDefaultDatabase(){return this.database===Si}isEqual(e){return e instanceof gn&&e.projectId===this.projectId&&e.database===this.database}}function JI(r,e){if(!Object.prototype.hasOwnProperty.apply(r.options,["projectId"]))throw new O(P.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new gn(r.options.projectId,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tc="__type__",rf="__max__",Vt={mapValue:{fields:{__type__:{stringValue:rf}}}},nc="__vector__",Jn="value",ii={nullValue:"NULL_VALUE"};function Ut(r){return"nullValue"in r?0:"booleanValue"in r?1:"integerValue"in r||"doubleValue"in r?2:"timestampValue"in r?3:"stringValue"in r?5:"bytesValue"in r?6:"referenceValue"in r?7:"geoPointValue"in r?8:"arrayValue"in r?9:"mapValue"in r?ec(r)?4:sf(r)?9007199254740991:Yi(r)?10:11:M(28295,{value:r})}function tt(r,e){if(r===e)return!0;const t=Ut(r);if(t!==Ut(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return r.booleanValue===e.booleanValue;case 4:return cs(r).isEqual(cs(e));case 3:return(function(s,i){if(typeof s.timestampValue=="string"&&typeof i.timestampValue=="string"&&s.timestampValue.length===i.timestampValue.length)return s.timestampValue===i.timestampValue;const o=ut(s.timestampValue),c=ut(i.timestampValue);return o.seconds===c.seconds&&o.nanos===c.nanos})(r,e);case 5:return r.stringValue===e.stringValue;case 6:return(function(s,i){return lt(s.bytesValue).isEqual(lt(i.bytesValue))})(r,e);case 7:return r.referenceValue===e.referenceValue;case 8:return(function(s,i){return oe(s.geoPointValue.latitude)===oe(i.geoPointValue.latitude)&&oe(s.geoPointValue.longitude)===oe(i.geoPointValue.longitude)})(r,e);case 2:return(function(s,i){if("integerValue"in s&&"integerValue"in i)return oe(s.integerValue)===oe(i.integerValue);if("doubleValue"in s&&"doubleValue"in i){const o=oe(s.doubleValue),c=oe(i.doubleValue);return o===c?ss(o)===ss(c):isNaN(o)&&isNaN(c)}return!1})(r,e);case 9:return zn(r.arrayValue.values||[],e.arrayValue.values||[],tt);case 10:case 11:return(function(s,i){const o=s.mapValue.fields||{},c=i.mapValue.fields||{};if(vl(o)!==vl(c))return!1;for(const u in o)if(o.hasOwnProperty(u)&&(c[u]===void 0||!tt(o[u],c[u])))return!1;return!0})(r,e);default:return M(52216,{left:r})}}function us(r,e){return(r.values||[]).find((t=>tt(t,e)))!==void 0}function Bt(r,e){if(r===e)return 0;const t=Ut(r),n=Ut(e);if(t!==n)return j(t,n);switch(t){case 0:case 9007199254740991:return 0;case 1:return j(r.booleanValue,e.booleanValue);case 2:return(function(i,o){const c=oe(i.integerValue||i.doubleValue),u=oe(o.integerValue||o.doubleValue);return c<u?-1:c>u?1:c===u?0:isNaN(c)?isNaN(u)?0:-1:1})(r,e);case 3:return Sl(r.timestampValue,e.timestampValue);case 4:return Sl(cs(r),cs(e));case 5:return ua(r.stringValue,e.stringValue);case 6:return(function(i,o){const c=lt(i),u=lt(o);return c.compareTo(u)})(r.bytesValue,e.bytesValue);case 7:return(function(i,o){const c=i.split("/"),u=o.split("/");for(let h=0;h<c.length&&h<u.length;h++){const f=j(c[h],u[h]);if(f!==0)return f}return j(c.length,u.length)})(r.referenceValue,e.referenceValue);case 8:return(function(i,o){const c=j(oe(i.latitude),oe(o.latitude));return c!==0?c:j(oe(i.longitude),oe(o.longitude))})(r.geoPointValue,e.geoPointValue);case 9:return Rl(r.arrayValue,e.arrayValue);case 10:return(function(i,o){var E,b,V,N;const c=i.fields||{},u=o.fields||{},h=(E=c[Jn])==null?void 0:E.arrayValue,f=(b=u[Jn])==null?void 0:b.arrayValue,p=j(((V=h==null?void 0:h.values)==null?void 0:V.length)||0,((N=f==null?void 0:f.values)==null?void 0:N.length)||0);return p!==0?p:Rl(h,f)})(r.mapValue,e.mapValue);case 11:return(function(i,o){if(i===Vt.mapValue&&o===Vt.mapValue)return 0;if(i===Vt.mapValue)return 1;if(o===Vt.mapValue)return-1;const c=i.fields||{},u=Object.keys(c),h=o.fields||{},f=Object.keys(h);u.sort(),f.sort();for(let p=0;p<u.length&&p<f.length;++p){const E=ua(u[p],f[p]);if(E!==0)return E;const b=Bt(c[u[p]],h[f[p]]);if(b!==0)return b}return j(u.length,f.length)})(r.mapValue,e.mapValue);default:throw M(23264,{he:t})}}function Sl(r,e){if(typeof r=="string"&&typeof e=="string"&&r.length===e.length)return j(r,e);const t=ut(r),n=ut(e),s=j(t.seconds,n.seconds);return s!==0?s:j(t.nanos,n.nanos)}function Rl(r,e){const t=r.values||[],n=e.values||[];for(let s=0;s<t.length&&s<n.length;++s){const i=Bt(t[s],n[s]);if(i)return i}return j(t.length,n.length)}function Yn(r){return pa(r)}function pa(r){return"nullValue"in r?"null":"booleanValue"in r?""+r.booleanValue:"integerValue"in r?""+r.integerValue:"doubleValue"in r?""+r.doubleValue:"timestampValue"in r?(function(t){const n=ut(t);return`time(${n.seconds},${n.nanos})`})(r.timestampValue):"stringValue"in r?r.stringValue:"bytesValue"in r?(function(t){return lt(t).toBase64()})(r.bytesValue):"referenceValue"in r?(function(t){return x.fromName(t).toString()})(r.referenceValue):"geoPointValue"in r?(function(t){return`geo(${t.latitude},${t.longitude})`})(r.geoPointValue):"arrayValue"in r?(function(t){let n="[",s=!0;for(const i of t.values||[])s?s=!1:n+=",",n+=pa(i);return n+"]"})(r.arrayValue):"mapValue"in r?(function(t){const n=Object.keys(t.fields||{}).sort();let s="{",i=!0;for(const o of n)i?i=!1:s+=",",s+=`${o}:${pa(t.fields[o])}`;return s+"}"})(r.mapValue):M(61005,{value:r})}function oi(r){switch(Ut(r)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=Ji(r);return e?16+oi(e):16;case 5:return 2*r.stringValue.length;case 6:return lt(r.bytesValue).approximateByteSize();case 7:return r.referenceValue.length;case 9:return(function(n){return(n.values||[]).reduce(((s,i)=>s+oi(i)),0)})(r.arrayValue);case 10:case 11:return(function(n){let s=0;return Kt(n.fields,((i,o)=>{s+=i.length+oi(o)})),s})(r.mapValue);default:throw M(13486,{value:r})}}function rc(r,e){return{referenceValue:`projects/${r.projectId}/databases/${r.database}/documents/${e.path.canonicalString()}`}}function ga(r){return!!r&&"integerValue"in r}function ls(r){return!!r&&"arrayValue"in r}function bl(r){return!!r&&"nullValue"in r}function Pl(r){return!!r&&"doubleValue"in r&&isNaN(Number(r.doubleValue))}function ai(r){return!!r&&"mapValue"in r}function Yi(r){var t,n;return((n=(((t=r==null?void 0:r.mapValue)==null?void 0:t.fields)||{})[tc])==null?void 0:n.stringValue)===nc}function Qr(r){if(r.geoPointValue)return{geoPointValue:{...r.geoPointValue}};if(r.timestampValue&&typeof r.timestampValue=="object")return{timestampValue:{...r.timestampValue}};if(r.mapValue){const e={mapValue:{fields:{}}};return Kt(r.mapValue.fields,((t,n)=>e.mapValue.fields[t]=Qr(n))),e}if(r.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(r.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Qr(r.arrayValue.values[t]);return e}return{...r}}function sf(r){return(((r.mapValue||{}).fields||{}).__type__||{}).stringValue===rf}const of={mapValue:{fields:{[tc]:{stringValue:nc},[Jn]:{arrayValue:{}}}}};function YI(r){return"nullValue"in r?ii:"booleanValue"in r?{booleanValue:!1}:"integerValue"in r||"doubleValue"in r?{doubleValue:NaN}:"timestampValue"in r?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"stringValue"in r?{stringValue:""}:"bytesValue"in r?{bytesValue:""}:"referenceValue"in r?rc(gn.empty(),x.empty()):"geoPointValue"in r?{geoPointValue:{latitude:-90,longitude:-180}}:"arrayValue"in r?{arrayValue:{}}:"mapValue"in r?Yi(r)?of:{mapValue:{}}:M(35942,{value:r})}function XI(r){return"nullValue"in r?{booleanValue:!1}:"booleanValue"in r?{doubleValue:NaN}:"integerValue"in r||"doubleValue"in r?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"timestampValue"in r?{stringValue:""}:"stringValue"in r?{bytesValue:""}:"bytesValue"in r?rc(gn.empty(),x.empty()):"referenceValue"in r?{geoPointValue:{latitude:-90,longitude:-180}}:"geoPointValue"in r?{arrayValue:{}}:"arrayValue"in r?of:"mapValue"in r?Yi(r)?{mapValue:{}}:Vt:M(61959,{value:r})}function Cl(r,e){const t=Bt(r.value,e.value);return t!==0?t:r.inclusive&&!e.inclusive?-1:!r.inclusive&&e.inclusive?1:0}function Vl(r,e){const t=Bt(r.value,e.value);return t!==0?t:r.inclusive&&!e.inclusive?1:!r.inclusive&&e.inclusive?-1:0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Se{constructor(e){this.value=e}static empty(){return new Se({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let n=0;n<e.length-1;++n)if(t=(t.mapValue.fields||{})[e.get(n)],!ai(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Qr(t)}setAll(e){let t=ae.emptyPath(),n={},s=[];e.forEach(((o,c)=>{if(!t.isImmediateParentOf(c)){const u=this.getFieldsMap(t);this.applyChanges(u,n,s),n={},s=[],t=c.popLast()}o?n[c.lastSegment()]=Qr(o):s.push(c.lastSegment())}));const i=this.getFieldsMap(t);this.applyChanges(i,n,s)}delete(e){const t=this.field(e.popLast());ai(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return tt(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let n=0;n<e.length;++n){let s=t.mapValue.fields[e.get(n)];ai(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},t.mapValue.fields[e.get(n)]=s),t=s}return t.mapValue.fields}applyChanges(e,t,n){Kt(t,((s,i)=>e[s]=i));for(const s of n)delete e[s]}clone(){return new Se(Qr(this.value))}}function af(r){const e=[];return Kt(r.fields,((t,n)=>{const s=new ae([t]);if(ai(n)){const i=af(n.mapValue).fields;if(i.length===0)e.push(s);else for(const o of i)e.push(s.child(o))}else e.push(s)})),new ke(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ue{constructor(e,t,n,s,i,o,c){this.key=e,this.documentType=t,this.version=n,this.readTime=s,this.createTime=i,this.data=o,this.documentState=c}static newInvalidDocument(e){return new ue(e,0,U.min(),U.min(),U.min(),Se.empty(),0)}static newFoundDocument(e,t,n,s){return new ue(e,1,t,U.min(),n,s,0)}static newNoDocument(e,t){return new ue(e,2,t,U.min(),U.min(),Se.empty(),0)}static newUnknownDocument(e,t){return new ue(e,3,t,U.min(),U.min(),Se.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(U.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Se.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Se.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=U.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof ue&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new ue(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xn{constructor(e,t){this.position=e,this.inclusive=t}}function Dl(r,e,t){let n=0;for(let s=0;s<r.position.length;s++){const i=e[s],o=r.position[s];if(i.field.isKeyField()?n=x.comparator(x.fromName(o.referenceValue),t.key):n=Bt(o,t.data.field(i.field)),i.dir==="desc"&&(n*=-1),n!==0)break}return n}function kl(r,e){if(r===null)return e===null;if(e===null||r.inclusive!==e.inclusive||r.position.length!==e.position.length)return!1;for(let t=0;t<r.position.length;t++)if(!tt(r.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ri{constructor(e,t="asc"){this.field=e,this.dir=t}}function ZI(r,e){return r.dir===e.dir&&r.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cf{}class W extends cf{constructor(e,t,n){super(),this.field=e,this.op=t,this.value=n}static create(e,t,n){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,n):new eT(e,t,n):t==="array-contains"?new rT(e,n):t==="in"?new mf(e,n):t==="not-in"?new sT(e,n):t==="array-contains-any"?new iT(e,n):new W(e,t,n)}static createKeyFieldInFilter(e,t,n){return t==="in"?new tT(e,n):new nT(e,n)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(Bt(t,this.value)):t!==null&&Ut(this.value)===Ut(t)&&this.matchesComparison(Bt(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return M(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class te extends cf{constructor(e,t){super(),this.filters=e,this.op=t,this.Pe=null}static create(e,t){return new te(e,t)}matches(e){return Zn(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.Pe!==null||(this.Pe=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.Pe}getFilters(){return Object.assign([],this.filters)}}function Zn(r){return r.op==="and"}function _a(r){return r.op==="or"}function sc(r){return uf(r)&&Zn(r)}function uf(r){for(const e of r.filters)if(e instanceof te)return!1;return!0}function ya(r){if(r instanceof W)return r.field.canonicalString()+r.op.toString()+Yn(r.value);if(sc(r))return r.filters.map((e=>ya(e))).join(",");{const e=r.filters.map((t=>ya(t))).join(",");return`${r.op}(${e})`}}function lf(r,e){return r instanceof W?(function(n,s){return s instanceof W&&n.op===s.op&&n.field.isEqual(s.field)&&tt(n.value,s.value)})(r,e):r instanceof te?(function(n,s){return s instanceof te&&n.op===s.op&&n.filters.length===s.filters.length?n.filters.reduce(((i,o,c)=>i&&lf(o,s.filters[c])),!0):!1})(r,e):void M(19439)}function hf(r,e){const t=r.filters.concat(e);return te.create(t,r.op)}function df(r){return r instanceof W?(function(t){return`${t.field.canonicalString()} ${t.op} ${Yn(t.value)}`})(r):r instanceof te?(function(t){return t.op.toString()+" {"+t.getFilters().map(df).join(" ,")+"}"})(r):"Filter"}class eT extends W{constructor(e,t,n){super(e,t,n),this.key=x.fromName(n.referenceValue)}matches(e){const t=x.comparator(e.key,this.key);return this.matchesComparison(t)}}class tT extends W{constructor(e,t){super(e,"in",t),this.keys=ff("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}}class nT extends W{constructor(e,t){super(e,"not-in",t),this.keys=ff("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}}function ff(r,e){var t;return(((t=e.arrayValue)==null?void 0:t.values)||[]).map((n=>x.fromName(n.referenceValue)))}class rT extends W{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return ls(t)&&us(t.arrayValue,this.value)}}class mf extends W{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&us(this.value.arrayValue,t)}}class sT extends W{constructor(e,t){super(e,"not-in",t)}matches(e){if(us(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!us(this.value.arrayValue,t)}}class iT extends W{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!ls(t)||!t.arrayValue.values)&&t.arrayValue.values.some((n=>us(this.value.arrayValue,n)))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oT{constructor(e,t=null,n=[],s=[],i=null,o=null,c=null){this.path=e,this.collectionGroup=t,this.orderBy=n,this.filters=s,this.limit=i,this.startAt=o,this.endAt=c,this.Te=null}}function Ia(r,e=null,t=[],n=[],s=null,i=null,o=null){return new oT(r,e,t,n,s,i,o)}function _n(r){const e=L(r);if(e.Te===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((n=>ya(n))).join(","),t+="|ob:",t+=e.orderBy.map((n=>(function(i){return i.field.canonicalString()+i.dir})(n))).join(","),Gi(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((n=>Yn(n))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((n=>Yn(n))).join(",")),e.Te=t}return e.Te}function vs(r,e){if(r.limit!==e.limit||r.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<r.orderBy.length;t++)if(!ZI(r.orderBy[t],e.orderBy[t]))return!1;if(r.filters.length!==e.filters.length)return!1;for(let t=0;t<r.filters.length;t++)if(!lf(r.filters[t],e.filters[t]))return!1;return r.collectionGroup===e.collectionGroup&&!!r.path.isEqual(e.path)&&!!kl(r.startAt,e.startAt)&&kl(r.endAt,e.endAt)}function bi(r){return x.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}function Pi(r,e){return r.filters.filter((t=>t instanceof W&&t.field.isEqual(e)))}function Nl(r,e,t){let n=ii,s=!0;for(const i of Pi(r,e)){let o=ii,c=!0;switch(i.op){case"<":case"<=":o=YI(i.value);break;case"==":case"in":case">=":o=i.value;break;case">":o=i.value,c=!1;break;case"!=":case"not-in":o=ii}Cl({value:n,inclusive:s},{value:o,inclusive:c})<0&&(n=o,s=c)}if(t!==null){for(let i=0;i<r.orderBy.length;++i)if(r.orderBy[i].field.isEqual(e)){const o=t.position[i];Cl({value:n,inclusive:s},{value:o,inclusive:t.inclusive})<0&&(n=o,s=t.inclusive);break}}return{value:n,inclusive:s}}function xl(r,e,t){let n=Vt,s=!0;for(const i of Pi(r,e)){let o=Vt,c=!0;switch(i.op){case">=":case">":o=XI(i.value),c=!1;break;case"==":case"in":case"<=":o=i.value;break;case"<":o=i.value,c=!1;break;case"!=":case"not-in":o=Vt}Vl({value:n,inclusive:s},{value:o,inclusive:c})>0&&(n=o,s=c)}if(t!==null){for(let i=0;i<r.orderBy.length;++i)if(r.orderBy[i].field.isEqual(e)){const o=t.position[i];Vl({value:n,inclusive:s},{value:o,inclusive:t.inclusive})>0&&(n=o,s=t.inclusive);break}}return{value:n,inclusive:s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xi{constructor(e,t=null,n=[],s=[],i=null,o="F",c=null,u=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=n,this.filters=s,this.limit=i,this.limitType=o,this.startAt=c,this.endAt=u,this.Ie=null,this.Ee=null,this.Re=null,this.startAt,this.endAt}}function pf(r,e,t,n,s,i,o,c){return new Xi(r,e,t,n,s,i,o,c)}function Zi(r){return new Xi(r)}function Ol(r){return r.filters.length===0&&r.limit===null&&r.startAt==null&&r.endAt==null&&(r.explicitOrderBy.length===0||r.explicitOrderBy.length===1&&r.explicitOrderBy[0].field.isKeyField())}function aT(r){return x.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}function cT(r){return r.collectionGroup!==null}function Jr(r){const e=L(r);if(e.Ie===null){e.Ie=[];const t=new Set;for(const i of e.explicitOrderBy)e.Ie.push(i),t.add(i.field.canonicalString());const n=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let c=new Z(ae.comparator);return o.filters.forEach((u=>{u.getFlattenedFilters().forEach((h=>{h.isInequality()&&(c=c.add(h.field))}))})),c})(e).forEach((i=>{t.has(i.canonicalString())||i.isKeyField()||e.Ie.push(new Ri(i,n))})),t.has(ae.keyField().canonicalString())||e.Ie.push(new Ri(ae.keyField(),n))}return e.Ie}function Le(r){const e=L(r);return e.Ee||(e.Ee=uT(e,Jr(r))),e.Ee}function uT(r,e){if(r.limitType==="F")return Ia(r.path,r.collectionGroup,e,r.filters,r.limit,r.startAt,r.endAt);{e=e.map((s=>{const i=s.dir==="desc"?"asc":"desc";return new Ri(s.field,i)}));const t=r.endAt?new Xn(r.endAt.position,r.endAt.inclusive):null,n=r.startAt?new Xn(r.startAt.position,r.startAt.inclusive):null;return Ia(r.path,r.collectionGroup,e,r.filters,r.limit,t,n)}}function Ta(r,e,t){return new Xi(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),e,t,r.startAt,r.endAt)}function eo(r,e){return vs(Le(r),Le(e))&&r.limitType===e.limitType}function gf(r){return`${_n(Le(r))}|lt:${r.limitType}`}function Dn(r){return`Query(target=${(function(t){let n=t.path.canonicalString();return t.collectionGroup!==null&&(n+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(n+=`, filters: [${t.filters.map((s=>df(s))).join(", ")}]`),Gi(t.limit)||(n+=", limit: "+t.limit),t.orderBy.length>0&&(n+=`, orderBy: [${t.orderBy.map((s=>(function(o){return`${o.field.canonicalString()} (${o.dir})`})(s))).join(", ")}]`),t.startAt&&(n+=", startAt: ",n+=t.startAt.inclusive?"b:":"a:",n+=t.startAt.position.map((s=>Yn(s))).join(",")),t.endAt&&(n+=", endAt: ",n+=t.endAt.inclusive?"a:":"b:",n+=t.endAt.position.map((s=>Yn(s))).join(",")),`Target(${n})`})(Le(r))}; limitType=${r.limitType})`}function As(r,e){return e.isFoundDocument()&&(function(n,s){const i=s.key.path;return n.collectionGroup!==null?s.key.hasCollectionId(n.collectionGroup)&&n.path.isPrefixOf(i):x.isDocumentKey(n.path)?n.path.isEqual(i):n.path.isImmediateParentOf(i)})(r,e)&&(function(n,s){for(const i of Jr(n))if(!i.field.isKeyField()&&s.data.field(i.field)===null)return!1;return!0})(r,e)&&(function(n,s){for(const i of n.filters)if(!i.matches(s))return!1;return!0})(r,e)&&(function(n,s){return!(n.startAt&&!(function(o,c,u){const h=Dl(o,c,u);return o.inclusive?h<=0:h<0})(n.startAt,Jr(n),s)||n.endAt&&!(function(o,c,u){const h=Dl(o,c,u);return o.inclusive?h>=0:h>0})(n.endAt,Jr(n),s))})(r,e)}function _f(r){return r.collectionGroup||(r.path.length%2==1?r.path.lastSegment():r.path.get(r.path.length-2))}function yf(r){return(e,t)=>{let n=!1;for(const s of Jr(r)){const i=lT(s,e,t);if(i!==0)return i;n=n||s.field.isKeyField()}return 0}}function lT(r,e,t){const n=r.field.isKeyField()?x.comparator(e.key,t.key):(function(i,o,c){const u=o.data.field(i),h=c.data.field(i);return u!==null&&h!==null?Bt(u,h):M(42886)})(r.field,e,t);switch(r.dir){case"asc":return n;case"desc":return-1*n;default:return M(19790,{direction:r.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ft{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),n=this.inner[t];if(n!==void 0){for(const[s,i]of n)if(this.equalsFn(s,e))return i}}has(e){return this.get(e)!==void 0}set(e,t){const n=this.mapKeyFn(e),s=this.inner[n];if(s===void 0)return this.inner[n]=[[e,t]],void this.innerSize++;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],e))return void(s[i]=[e,t]);s.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),n=this.inner[t];if(n===void 0)return!1;for(let s=0;s<n.length;s++)if(this.equalsFn(n[s][0],e))return n.length===1?delete this.inner[t]:n.splice(s,1),this.innerSize--,!0;return!1}forEach(e){Kt(this.inner,((t,n)=>{for(const[s,i]of n)e(s,i)}))}isEmpty(){return Yd(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hT=new re(x.comparator);function Me(){return hT}const If=new re(x.comparator);function Br(...r){let e=If;for(const t of r)e=e.insert(t.key,t);return e}function Tf(r){let e=If;return r.forEach(((t,n)=>e=e.insert(t,n.overlayedDocument))),e}function Je(){return Yr()}function Ef(){return Yr()}function Yr(){return new ft((r=>r.toString()),((r,e)=>r.isEqual(e)))}const dT=new re(x.comparator),fT=new Z(x.comparator);function K(...r){let e=fT;for(const t of r)e=e.add(t);return e}const mT=new Z(j);function ic(){return mT}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function oc(r,e){if(r.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:ss(e)?"-0":e}}function wf(r){return{integerValue:""+r}}function vf(r,e){return Bd(e)?wf(e):oc(r,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class to{constructor(){this._=void 0}}function pT(r,e,t){return r instanceof er?(function(s,i){const o={fields:{[ef]:{stringValue:Zd},[nf]:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return i&&ec(i)&&(i=Ji(i)),i&&(o.fields[tf]=i),{mapValue:o}})(t,e):r instanceof tr?Sf(r,e):r instanceof nr?Rf(r,e):(function(s,i){const o=Af(s,i),c=Ml(o)+Ml(s.Ae);return ga(o)&&ga(s.Ae)?wf(c):oc(s.serializer,c)})(r,e)}function gT(r,e,t){return r instanceof tr?Sf(r,e):r instanceof nr?Rf(r,e):t}function Af(r,e){return r instanceof rr?(function(n){return ga(n)||(function(i){return!!i&&"doubleValue"in i})(n)})(e)?e:{integerValue:0}:null}class er extends to{}class tr extends to{constructor(e){super(),this.elements=e}}function Sf(r,e){const t=bf(e);for(const n of r.elements)t.some((s=>tt(s,n)))||t.push(n);return{arrayValue:{values:t}}}class nr extends to{constructor(e){super(),this.elements=e}}function Rf(r,e){let t=bf(e);for(const n of r.elements)t=t.filter((s=>!tt(s,n)));return{arrayValue:{values:t}}}class rr extends to{constructor(e,t){super(),this.serializer=e,this.Ae=t}}function Ml(r){return oe(r.integerValue||r.doubleValue)}function bf(r){return ls(r)&&r.arrayValue.values?r.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ac{constructor(e,t){this.field=e,this.transform=t}}function _T(r,e){return r.field.isEqual(e.field)&&(function(n,s){return n instanceof tr&&s instanceof tr||n instanceof nr&&s instanceof nr?zn(n.elements,s.elements,tt):n instanceof rr&&s instanceof rr?tt(n.Ae,s.Ae):n instanceof er&&s instanceof er})(r.transform,e.transform)}class yT{constructor(e,t){this.version=e,this.transformResults=t}}class Ne{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new Ne}static exists(e){return new Ne(void 0,e)}static updateTime(e){return new Ne(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function ci(r,e){return r.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(r.updateTime):r.exists===void 0||r.exists===e.isFoundDocument()}class no{}function Pf(r,e){if(!r.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return r.isNoDocument()?new cc(r.key,Ne.none()):new dr(r.key,r.data,Ne.none());{const t=r.data,n=Se.empty();let s=new Z(ae.comparator);for(let i of e.fields)if(!s.has(i)){let o=t.field(i);o===null&&i.length>1&&(i=i.popLast(),o=t.field(i)),o===null?n.delete(i):n.set(i,o),s=s.add(i)}return new mt(r.key,n,new ke(s.toArray()),Ne.none())}}function IT(r,e,t){r instanceof dr?(function(s,i,o){const c=s.value.clone(),u=Fl(s.fieldTransforms,i,o.transformResults);c.setAll(u),i.convertToFoundDocument(o.version,c).setHasCommittedMutations()})(r,e,t):r instanceof mt?(function(s,i,o){if(!ci(s.precondition,i))return void i.convertToUnknownDocument(o.version);const c=Fl(s.fieldTransforms,i,o.transformResults),u=i.data;u.setAll(Cf(s)),u.setAll(c),i.convertToFoundDocument(o.version,u).setHasCommittedMutations()})(r,e,t):(function(s,i,o){i.convertToNoDocument(o.version).setHasCommittedMutations()})(0,e,t)}function Xr(r,e,t,n){return r instanceof dr?(function(i,o,c,u){if(!ci(i.precondition,o))return c;const h=i.value.clone(),f=Ul(i.fieldTransforms,u,o);return h.setAll(f),o.convertToFoundDocument(o.version,h).setHasLocalMutations(),null})(r,e,t,n):r instanceof mt?(function(i,o,c,u){if(!ci(i.precondition,o))return c;const h=Ul(i.fieldTransforms,u,o),f=o.data;return f.setAll(Cf(i)),f.setAll(h),o.convertToFoundDocument(o.version,f).setHasLocalMutations(),c===null?null:c.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map((p=>p.field)))})(r,e,t,n):(function(i,o,c){return ci(i.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):c})(r,e,t)}function TT(r,e){let t=null;for(const n of r.fieldTransforms){const s=e.data.field(n.field),i=Af(n.transform,s||null);i!=null&&(t===null&&(t=Se.empty()),t.set(n.field,i))}return t||null}function Ll(r,e){return r.type===e.type&&!!r.key.isEqual(e.key)&&!!r.precondition.isEqual(e.precondition)&&!!(function(n,s){return n===void 0&&s===void 0||!(!n||!s)&&zn(n,s,((i,o)=>_T(i,o)))})(r.fieldTransforms,e.fieldTransforms)&&(r.type===0?r.value.isEqual(e.value):r.type!==1||r.data.isEqual(e.data)&&r.fieldMask.isEqual(e.fieldMask))}class dr extends no{constructor(e,t,n,s=[]){super(),this.key=e,this.value=t,this.precondition=n,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class mt extends no{constructor(e,t,n,s,i=[]){super(),this.key=e,this.data=t,this.fieldMask=n,this.precondition=s,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function Cf(r){const e=new Map;return r.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){const n=r.data.field(t);e.set(t,n)}})),e}function Fl(r,e,t){const n=new Map;F(r.length===t.length,32656,{Ve:t.length,de:r.length});for(let s=0;s<t.length;s++){const i=r[s],o=i.transform,c=e.data.field(i.field);n.set(i.field,gT(o,c,t[s]))}return n}function Ul(r,e,t){const n=new Map;for(const s of r){const i=s.transform,o=t.data.field(s.field);n.set(s.field,pT(i,o,e))}return n}class cc extends no{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class Vf extends no{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uc{constructor(e,t,n,s){this.batchId=e,this.localWriteTime=t,this.baseMutations=n,this.mutations=s}applyToRemoteDocument(e,t){const n=t.mutationResults;for(let s=0;s<this.mutations.length;s++){const i=this.mutations[s];i.key.isEqual(e.key)&&IT(i,e,n[s])}}applyToLocalView(e,t){for(const n of this.baseMutations)n.key.isEqual(e.key)&&(t=Xr(n,e,t,this.localWriteTime));for(const n of this.mutations)n.key.isEqual(e.key)&&(t=Xr(n,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const n=Ef();return this.mutations.forEach((s=>{const i=e.get(s.key),o=i.overlayedDocument;let c=this.applyToLocalView(o,i.mutatedFields);c=t.has(s.key)?null:c;const u=Pf(o,c);u!==null&&n.set(s.key,u),o.isValidDocument()||o.convertToNoDocument(U.min())})),n}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),K())}isEqual(e){return this.batchId===e.batchId&&zn(this.mutations,e.mutations,((t,n)=>Ll(t,n)))&&zn(this.baseMutations,e.baseMutations,((t,n)=>Ll(t,n)))}}class lc{constructor(e,t,n,s){this.batch=e,this.commitVersion=t,this.mutationResults=n,this.docVersions=s}static from(e,t,n){F(e.mutations.length===n.length,58842,{me:e.mutations.length,fe:n.length});let s=(function(){return dT})();const i=e.mutations;for(let o=0;o<i.length;o++)s=s.insert(i[o].key,n[o].version);return new lc(e,t,n,s)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hc{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ET{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var de,Q;function wT(r){switch(r){case P.OK:return M(64938);case P.CANCELLED:case P.UNKNOWN:case P.DEADLINE_EXCEEDED:case P.RESOURCE_EXHAUSTED:case P.INTERNAL:case P.UNAVAILABLE:case P.UNAUTHENTICATED:return!1;case P.INVALID_ARGUMENT:case P.NOT_FOUND:case P.ALREADY_EXISTS:case P.PERMISSION_DENIED:case P.FAILED_PRECONDITION:case P.ABORTED:case P.OUT_OF_RANGE:case P.UNIMPLEMENTED:case P.DATA_LOSS:return!0;default:return M(15467,{code:r})}}function Df(r){if(r===void 0)return le("GRPC error has no .code"),P.UNKNOWN;switch(r){case de.OK:return P.OK;case de.CANCELLED:return P.CANCELLED;case de.UNKNOWN:return P.UNKNOWN;case de.DEADLINE_EXCEEDED:return P.DEADLINE_EXCEEDED;case de.RESOURCE_EXHAUSTED:return P.RESOURCE_EXHAUSTED;case de.INTERNAL:return P.INTERNAL;case de.UNAVAILABLE:return P.UNAVAILABLE;case de.UNAUTHENTICATED:return P.UNAUTHENTICATED;case de.INVALID_ARGUMENT:return P.INVALID_ARGUMENT;case de.NOT_FOUND:return P.NOT_FOUND;case de.ALREADY_EXISTS:return P.ALREADY_EXISTS;case de.PERMISSION_DENIED:return P.PERMISSION_DENIED;case de.FAILED_PRECONDITION:return P.FAILED_PRECONDITION;case de.ABORTED:return P.ABORTED;case de.OUT_OF_RANGE:return P.OUT_OF_RANGE;case de.UNIMPLEMENTED:return P.UNIMPLEMENTED;case de.DATA_LOSS:return P.DATA_LOSS;default:return M(39323,{code:r})}}(Q=de||(de={}))[Q.OK=0]="OK",Q[Q.CANCELLED=1]="CANCELLED",Q[Q.UNKNOWN=2]="UNKNOWN",Q[Q.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",Q[Q.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",Q[Q.NOT_FOUND=5]="NOT_FOUND",Q[Q.ALREADY_EXISTS=6]="ALREADY_EXISTS",Q[Q.PERMISSION_DENIED=7]="PERMISSION_DENIED",Q[Q.UNAUTHENTICATED=16]="UNAUTHENTICATED",Q[Q.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",Q[Q.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",Q[Q.ABORTED=10]="ABORTED",Q[Q.OUT_OF_RANGE=11]="OUT_OF_RANGE",Q[Q.UNIMPLEMENTED=12]="UNIMPLEMENTED",Q[Q.INTERNAL=13]="INTERNAL",Q[Q.UNAVAILABLE=14]="UNAVAILABLE",Q[Q.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vT(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const AT=new Ot([4294967295,4294967295],0);function Bl(r){const e=vT().encode(r),t=new Rd;return t.update(e),new Uint8Array(t.digest())}function jl(r){const e=new DataView(r.buffer),t=e.getUint32(0,!0),n=e.getUint32(4,!0),s=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new Ot([t,n],0),new Ot([s,i],0)]}class dc{constructor(e,t,n){if(this.bitmap=e,this.padding=t,this.hashCount=n,t<0||t>=8)throw new jr(`Invalid padding: ${t}`);if(n<0)throw new jr(`Invalid hash count: ${n}`);if(e.length>0&&this.hashCount===0)throw new jr(`Invalid hash count: ${n}`);if(e.length===0&&t!==0)throw new jr(`Invalid padding when bitmap length is 0: ${t}`);this.ge=8*e.length-t,this.pe=Ot.fromNumber(this.ge)}ye(e,t,n){let s=e.add(t.multiply(Ot.fromNumber(n)));return s.compare(AT)===1&&(s=new Ot([s.getBits(0),s.getBits(1)],0)),s.modulo(this.pe).toNumber()}we(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.ge===0)return!1;const t=Bl(e),[n,s]=jl(t);for(let i=0;i<this.hashCount;i++){const o=this.ye(n,s,i);if(!this.we(o))return!1}return!0}static create(e,t,n){const s=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),o=new dc(i,s,t);return n.forEach((c=>o.insert(c))),o}insert(e){if(this.ge===0)return;const t=Bl(e),[n,s]=jl(t);for(let i=0;i<this.hashCount;i++){const o=this.ye(n,s,i);this.Se(o)}}Se(e){const t=Math.floor(e/8),n=e%8;this.bitmap[t]|=1<<n}}class jr extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fr{constructor(e,t,n,s,i){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=n,this.documentUpdates=s,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(e,t,n){const s=new Map;return s.set(e,Ss.createSynthesizedTargetChangeForCurrentChange(e,t,n)),new fr(U.min(),s,new re(j),Me(),K())}}class Ss{constructor(e,t,n,s,i){this.resumeToken=e,this.current=t,this.addedDocuments=n,this.modifiedDocuments=s,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t,n){return new Ss(n,t,K(),K(),K())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ui{constructor(e,t,n,s){this.be=e,this.removedTargetIds=t,this.key=n,this.De=s}}class kf{constructor(e,t){this.targetId=e,this.Ce=t}}class Nf{constructor(e,t,n=he.EMPTY_BYTE_STRING,s=null){this.state=e,this.targetIds=t,this.resumeToken=n,this.cause=s}}class ql{constructor(){this.ve=0,this.Fe=zl(),this.Me=he.EMPTY_BYTE_STRING,this.xe=!1,this.Oe=!0}get current(){return this.xe}get resumeToken(){return this.Me}get Ne(){return this.ve!==0}get Be(){return this.Oe}Le(e){e.approximateByteSize()>0&&(this.Oe=!0,this.Me=e)}ke(){let e=K(),t=K(),n=K();return this.Fe.forEach(((s,i)=>{switch(i){case 0:e=e.add(s);break;case 2:t=t.add(s);break;case 1:n=n.add(s);break;default:M(38017,{changeType:i})}})),new Ss(this.Me,this.xe,e,t,n)}Ke(){this.Oe=!1,this.Fe=zl()}qe(e,t){this.Oe=!0,this.Fe=this.Fe.insert(e,t)}Ue(e){this.Oe=!0,this.Fe=this.Fe.remove(e)}$e(){this.ve+=1}We(){this.ve-=1,F(this.ve>=0,3241,{ve:this.ve})}Qe(){this.Oe=!0,this.xe=!0}}class ST{constructor(e){this.Ge=e,this.ze=new Map,this.je=Me(),this.Je=Gs(),this.He=Gs(),this.Ze=new re(j)}Xe(e){for(const t of e.be)e.De&&e.De.isFoundDocument()?this.Ye(t,e.De):this.et(t,e.key,e.De);for(const t of e.removedTargetIds)this.et(t,e.key,e.De)}tt(e){this.forEachTarget(e,(t=>{const n=this.nt(t);switch(e.state){case 0:this.rt(t)&&n.Le(e.resumeToken);break;case 1:n.We(),n.Ne||n.Ke(),n.Le(e.resumeToken);break;case 2:n.We(),n.Ne||this.removeTarget(t);break;case 3:this.rt(t)&&(n.Qe(),n.Le(e.resumeToken));break;case 4:this.rt(t)&&(this.it(t),n.Le(e.resumeToken));break;default:M(56790,{state:e.state})}}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.ze.forEach(((n,s)=>{this.rt(s)&&t(s)}))}st(e){const t=e.targetId,n=e.Ce.count,s=this.ot(t);if(s){const i=s.target;if(bi(i))if(n===0){const o=new x(i.path);this.et(t,o,ue.newNoDocument(o,U.min()))}else F(n===1,20013,{expectedCount:n});else{const o=this._t(t);if(o!==n){const c=this.ut(e),u=c?this.ct(c,e,o):1;if(u!==0){this.it(t);const h=u===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Ze=this.Ze.insert(t,h)}}}}}ut(e){const t=e.Ce.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:n="",padding:s=0},hashCount:i=0}=t;let o,c;try{o=lt(n).toUint8Array()}catch(u){if(u instanceof Xd)return qn("Decoding the base64 bloom filter in existence filter failed ("+u.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw u}try{c=new dc(o,s,i)}catch(u){return qn(u instanceof jr?"BloomFilter error: ":"Applying bloom filter failed: ",u),null}return c.ge===0?null:c}ct(e,t,n){return t.Ce.count===n-this.Pt(e,t.targetId)?0:2}Pt(e,t){const n=this.Ge.getRemoteKeysForTarget(t);let s=0;return n.forEach((i=>{const o=this.Ge.ht(),c=`projects/${o.projectId}/databases/${o.database}/documents/${i.path.canonicalString()}`;e.mightContain(c)||(this.et(t,i,null),s++)})),s}Tt(e){const t=new Map;this.ze.forEach(((i,o)=>{const c=this.ot(o);if(c){if(i.current&&bi(c.target)){const u=new x(c.target.path);this.It(u).has(o)||this.Et(o,u)||this.et(o,u,ue.newNoDocument(u,e))}i.Be&&(t.set(o,i.ke()),i.Ke())}}));let n=K();this.He.forEach(((i,o)=>{let c=!0;o.forEachWhile((u=>{const h=this.ot(u);return!h||h.purpose==="TargetPurposeLimboResolution"||(c=!1,!1)})),c&&(n=n.add(i))})),this.je.forEach(((i,o)=>o.setReadTime(e)));const s=new fr(e,t,this.Ze,this.je,n);return this.je=Me(),this.Je=Gs(),this.He=Gs(),this.Ze=new re(j),s}Ye(e,t){if(!this.rt(e))return;const n=this.Et(e,t.key)?2:0;this.nt(e).qe(t.key,n),this.je=this.je.insert(t.key,t),this.Je=this.Je.insert(t.key,this.It(t.key).add(e)),this.He=this.He.insert(t.key,this.Rt(t.key).add(e))}et(e,t,n){if(!this.rt(e))return;const s=this.nt(e);this.Et(e,t)?s.qe(t,1):s.Ue(t),this.He=this.He.insert(t,this.Rt(t).delete(e)),this.He=this.He.insert(t,this.Rt(t).add(e)),n&&(this.je=this.je.insert(t,n))}removeTarget(e){this.ze.delete(e)}_t(e){const t=this.nt(e).ke();return this.Ge.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}$e(e){this.nt(e).$e()}nt(e){let t=this.ze.get(e);return t||(t=new ql,this.ze.set(e,t)),t}Rt(e){let t=this.He.get(e);return t||(t=new Z(j),this.He=this.He.insert(e,t)),t}It(e){let t=this.Je.get(e);return t||(t=new Z(j),this.Je=this.Je.insert(e,t)),t}rt(e){const t=this.ot(e)!==null;return t||C("WatchChangeAggregator","Detected inactive target",e),t}ot(e){const t=this.ze.get(e);return t&&t.Ne?null:this.Ge.At(e)}it(e){this.ze.set(e,new ql),this.Ge.getRemoteKeysForTarget(e).forEach((t=>{this.et(e,t,null)}))}Et(e,t){return this.Ge.getRemoteKeysForTarget(e).has(t)}}function Gs(){return new re(x.comparator)}function zl(){return new re(x.comparator)}const RT={asc:"ASCENDING",desc:"DESCENDING"},bT={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},PT={and:"AND",or:"OR"};class CT{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function Ea(r,e){return r.useProto3Json||Gi(e)?e:{value:e}}function sr(r,e){return r.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function xf(r,e){return r.useProto3Json?e.toBase64():e.toUint8Array()}function VT(r,e){return sr(r,e.toTimestamp())}function Ce(r){return F(!!r,49232),U.fromTimestamp((function(t){const n=ut(t);return new X(n.seconds,n.nanos)})(r))}function fc(r,e){return wa(r,e).canonicalString()}function wa(r,e){const t=(function(s){return new ee(["projects",s.projectId,"databases",s.database])})(r).child("documents");return e===void 0?t:t.child(e)}function Of(r){const e=ee.fromString(r);return F($f(e),10190,{key:e.toString()}),e}function Ci(r,e){return fc(r.databaseId,e.path)}function hn(r,e){const t=Of(e);if(t.get(1)!==r.databaseId.projectId)throw new O(P.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+r.databaseId.projectId);if(t.get(3)!==r.databaseId.database)throw new O(P.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+r.databaseId.database);return new x(Ff(t))}function Mf(r,e){return fc(r.databaseId,e)}function Lf(r){const e=Of(r);return e.length===4?ee.emptyPath():Ff(e)}function va(r){return new ee(["projects",r.databaseId.projectId,"databases",r.databaseId.database]).canonicalString()}function Ff(r){return F(r.length>4&&r.get(4)==="documents",29091,{key:r.toString()}),r.popFirst(5)}function $l(r,e,t){return{name:Ci(r,e),fields:t.value.mapValue.fields}}function DT(r,e,t){const n=hn(r,e.name),s=Ce(e.updateTime),i=e.createTime?Ce(e.createTime):U.min(),o=new Se({mapValue:{fields:e.fields}}),c=ue.newFoundDocument(n,s,i,o);return t&&c.setHasCommittedMutations(),t?c.setHasCommittedMutations():c}function kT(r,e){let t;if("targetChange"in e){e.targetChange;const n=(function(h){return h==="NO_CHANGE"?0:h==="ADD"?1:h==="REMOVE"?2:h==="CURRENT"?3:h==="RESET"?4:M(39313,{state:h})})(e.targetChange.targetChangeType||"NO_CHANGE"),s=e.targetChange.targetIds||[],i=(function(h,f){return h.useProto3Json?(F(f===void 0||typeof f=="string",58123),he.fromBase64String(f||"")):(F(f===void 0||f instanceof Buffer||f instanceof Uint8Array,16193),he.fromUint8Array(f||new Uint8Array))})(r,e.targetChange.resumeToken),o=e.targetChange.cause,c=o&&(function(h){const f=h.code===void 0?P.UNKNOWN:Df(h.code);return new O(f,h.message||"")})(o);t=new Nf(n,s,i,c||null)}else if("documentChange"in e){e.documentChange;const n=e.documentChange;n.document,n.document.name,n.document.updateTime;const s=hn(r,n.document.name),i=Ce(n.document.updateTime),o=n.document.createTime?Ce(n.document.createTime):U.min(),c=new Se({mapValue:{fields:n.document.fields}}),u=ue.newFoundDocument(s,i,o,c),h=n.targetIds||[],f=n.removedTargetIds||[];t=new ui(h,f,u.key,u)}else if("documentDelete"in e){e.documentDelete;const n=e.documentDelete;n.document;const s=hn(r,n.document),i=n.readTime?Ce(n.readTime):U.min(),o=ue.newNoDocument(s,i),c=n.removedTargetIds||[];t=new ui([],c,o.key,o)}else if("documentRemove"in e){e.documentRemove;const n=e.documentRemove;n.document;const s=hn(r,n.document),i=n.removedTargetIds||[];t=new ui([],i,s,null)}else{if(!("filter"in e))return M(11601,{Vt:e});{e.filter;const n=e.filter;n.targetId;const{count:s=0,unchangedNames:i}=n,o=new ET(s,i),c=n.targetId;t=new kf(c,o)}}return t}function Vi(r,e){let t;if(e instanceof dr)t={update:$l(r,e.key,e.value)};else if(e instanceof cc)t={delete:Ci(r,e.key)};else if(e instanceof mt)t={update:$l(r,e.key,e.data),updateMask:FT(e.fieldMask)};else{if(!(e instanceof Vf))return M(16599,{dt:e.type});t={verify:Ci(r,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((n=>(function(i,o){const c=o.transform;if(c instanceof er)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(c instanceof tr)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:c.elements}};if(c instanceof nr)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:c.elements}};if(c instanceof rr)return{fieldPath:o.field.canonicalString(),increment:c.Ae};throw M(20930,{transform:o.transform})})(0,n)))),e.precondition.isNone||(t.currentDocument=(function(s,i){return i.updateTime!==void 0?{updateTime:VT(s,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:M(27497)})(r,e.precondition)),t}function Aa(r,e){const t=e.currentDocument?(function(i){return i.updateTime!==void 0?Ne.updateTime(Ce(i.updateTime)):i.exists!==void 0?Ne.exists(i.exists):Ne.none()})(e.currentDocument):Ne.none(),n=e.updateTransforms?e.updateTransforms.map((s=>(function(o,c){let u=null;if("setToServerValue"in c)F(c.setToServerValue==="REQUEST_TIME",16630,{proto:c}),u=new er;else if("appendMissingElements"in c){const f=c.appendMissingElements.values||[];u=new tr(f)}else if("removeAllFromArray"in c){const f=c.removeAllFromArray.values||[];u=new nr(f)}else"increment"in c?u=new rr(o,c.increment):M(16584,{proto:c});const h=ae.fromServerFormat(c.fieldPath);return new ac(h,u)})(r,s))):[];if(e.update){e.update.name;const s=hn(r,e.update.name),i=new Se({mapValue:{fields:e.update.fields}});if(e.updateMask){const o=(function(u){const h=u.fieldPaths||[];return new ke(h.map((f=>ae.fromServerFormat(f))))})(e.updateMask);return new mt(s,i,o,t,n)}return new dr(s,i,t,n)}if(e.delete){const s=hn(r,e.delete);return new cc(s,t)}if(e.verify){const s=hn(r,e.verify);return new Vf(s,t)}return M(1463,{proto:e})}function NT(r,e){return r&&r.length>0?(F(e!==void 0,14353),r.map((t=>(function(s,i){let o=s.updateTime?Ce(s.updateTime):Ce(i);return o.isEqual(U.min())&&(o=Ce(i)),new yT(o,s.transformResults||[])})(t,e)))):[]}function Uf(r,e){return{documents:[Mf(r,e.path)]}}function Bf(r,e){const t={structuredQuery:{}},n=e.path;let s;e.collectionGroup!==null?(s=n,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(s=n.popLast(),t.structuredQuery.from=[{collectionId:n.lastSegment()}]),t.parent=Mf(r,s);const i=(function(h){if(h.length!==0)return zf(te.create(h,"and"))})(e.filters);i&&(t.structuredQuery.where=i);const o=(function(h){if(h.length!==0)return h.map((f=>(function(E){return{field:kn(E.field),direction:OT(E.dir)}})(f)))})(e.orderBy);o&&(t.structuredQuery.orderBy=o);const c=Ea(r,e.limit);return c!==null&&(t.structuredQuery.limit=c),e.startAt&&(t.structuredQuery.startAt=(function(h){return{before:h.inclusive,values:h.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(h){return{before:!h.inclusive,values:h.position}})(e.endAt)),{ft:t,parent:s}}function jf(r){let e=Lf(r.parent);const t=r.structuredQuery,n=t.from?t.from.length:0;let s=null;if(n>0){F(n===1,65062);const f=t.from[0];f.allDescendants?s=f.collectionId:e=e.child(f.collectionId)}let i=[];t.where&&(i=(function(p){const E=qf(p);return E instanceof te&&sc(E)?E.getFilters():[E]})(t.where));let o=[];t.orderBy&&(o=(function(p){return p.map((E=>(function(V){return new Ri(Nn(V.field),(function(D){switch(D){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(V.direction))})(E)))})(t.orderBy));let c=null;t.limit&&(c=(function(p){let E;return E=typeof p=="object"?p.value:p,Gi(E)?null:E})(t.limit));let u=null;t.startAt&&(u=(function(p){const E=!!p.before,b=p.values||[];return new Xn(b,E)})(t.startAt));let h=null;return t.endAt&&(h=(function(p){const E=!p.before,b=p.values||[];return new Xn(b,E)})(t.endAt)),pf(e,s,o,i,c,"F",u,h)}function xT(r,e){const t=(function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return M(28987,{purpose:s})}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function qf(r){return r.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":const n=Nn(t.unaryFilter.field);return W.create(n,"==",{doubleValue:NaN});case"IS_NULL":const s=Nn(t.unaryFilter.field);return W.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=Nn(t.unaryFilter.field);return W.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=Nn(t.unaryFilter.field);return W.create(o,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return M(61313);default:return M(60726)}})(r):r.fieldFilter!==void 0?(function(t){return W.create(Nn(t.fieldFilter.field),(function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return M(58110);default:return M(50506)}})(t.fieldFilter.op),t.fieldFilter.value)})(r):r.compositeFilter!==void 0?(function(t){return te.create(t.compositeFilter.filters.map((n=>qf(n))),(function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return M(1026)}})(t.compositeFilter.op))})(r):M(30097,{filter:r})}function OT(r){return RT[r]}function MT(r){return bT[r]}function LT(r){return PT[r]}function kn(r){return{fieldPath:r.canonicalString()}}function Nn(r){return ae.fromServerFormat(r.fieldPath)}function zf(r){return r instanceof W?(function(t){if(t.op==="=="){if(Pl(t.value))return{unaryFilter:{field:kn(t.field),op:"IS_NAN"}};if(bl(t.value))return{unaryFilter:{field:kn(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(Pl(t.value))return{unaryFilter:{field:kn(t.field),op:"IS_NOT_NAN"}};if(bl(t.value))return{unaryFilter:{field:kn(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:kn(t.field),op:MT(t.op),value:t.value}}})(r):r instanceof te?(function(t){const n=t.getFilters().map((s=>zf(s)));return n.length===1?n[0]:{compositeFilter:{op:LT(t.op),filters:n}}})(r):M(54877,{filter:r})}function FT(r){const e=[];return r.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function $f(r){return r.length>=4&&r.get(0)==="projects"&&r.get(2)==="databases"}function Kf(r){return!!r&&typeof r._toProto=="function"&&r._protoValueType==="ProtoValue"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ye{constructor(e,t,n,s,i=U.min(),o=U.min(),c=he.EMPTY_BYTE_STRING,u=null){this.target=e,this.targetId=t,this.purpose=n,this.sequenceNumber=s,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=c,this.expectedCount=u}withSequenceNumber(e){return new Ye(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new Ye(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new Ye(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new Ye(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gf{constructor(e){this.yt=e}}function UT(r,e){let t;if(e.document)t=DT(r.yt,e.document,!!e.hasCommittedMutations);else if(e.noDocument){const n=x.fromSegments(e.noDocument.path),s=In(e.noDocument.readTime);t=ue.newNoDocument(n,s),e.hasCommittedMutations&&t.setHasCommittedMutations()}else{if(!e.unknownDocument)return M(56709);{const n=x.fromSegments(e.unknownDocument.path),s=In(e.unknownDocument.version);t=ue.newUnknownDocument(n,s)}}return e.readTime&&t.setReadTime((function(s){const i=new X(s[0],s[1]);return U.fromTimestamp(i)})(e.readTime)),t}function Kl(r,e){const t=e.key,n={prefixPath:t.getCollectionPath().popLast().toArray(),collectionGroup:t.collectionGroup,documentId:t.path.lastSegment(),readTime:Di(e.readTime),hasCommittedMutations:e.hasCommittedMutations};if(e.isFoundDocument())n.document=(function(i,o){return{name:Ci(i,o.key),fields:o.data.value.mapValue.fields,updateTime:sr(i,o.version.toTimestamp()),createTime:sr(i,o.createTime.toTimestamp())}})(r.yt,e);else if(e.isNoDocument())n.noDocument={path:t.path.toArray(),readTime:yn(e.version)};else{if(!e.isUnknownDocument())return M(57904,{document:e});n.unknownDocument={path:t.path.toArray(),version:yn(e.version)}}return n}function Di(r){const e=r.toTimestamp();return[e.seconds,e.nanoseconds]}function yn(r){const e=r.toTimestamp();return{seconds:e.seconds,nanoseconds:e.nanoseconds}}function In(r){const e=new X(r.seconds,r.nanoseconds);return U.fromTimestamp(e)}function sn(r,e){const t=(e.baseMutations||[]).map((i=>Aa(r.yt,i)));for(let i=0;i<e.mutations.length-1;++i){const o=e.mutations[i];if(i+1<e.mutations.length&&e.mutations[i+1].transform!==void 0){const c=e.mutations[i+1];o.updateTransforms=c.transform.fieldTransforms,e.mutations.splice(i+1,1),++i}}const n=e.mutations.map((i=>Aa(r.yt,i))),s=X.fromMillis(e.localWriteTimeMs);return new uc(e.batchId,s,t,n)}function qr(r){const e=In(r.readTime),t=r.lastLimboFreeSnapshotVersion!==void 0?In(r.lastLimboFreeSnapshotVersion):U.min();let n;return n=(function(i){return i.documents!==void 0})(r.query)?(function(i){const o=i.documents.length;return F(o===1,1966,{count:o}),Le(Zi(Lf(i.documents[0])))})(r.query):(function(i){return Le(jf(i))})(r.query),new Ye(n,r.targetId,"TargetPurposeListen",r.lastListenSequenceNumber,e,t,he.fromBase64String(r.resumeToken))}function Hf(r,e){const t=yn(e.snapshotVersion),n=yn(e.lastLimboFreeSnapshotVersion);let s;s=bi(e.target)?Uf(r.yt,e.target):Bf(r.yt,e.target).ft;const i=e.resumeToken.toBase64();return{targetId:e.targetId,canonicalId:_n(e.target),readTime:t,resumeToken:i,lastListenSequenceNumber:e.sequenceNumber,lastLimboFreeSnapshotVersion:n,query:s}}function Wf(r){const e=jf({parent:r.parent,structuredQuery:r.structuredQuery});return r.limitType==="LAST"?Ta(e,e.limit,"L"):e}function Go(r,e){return new hc(e.largestBatchId,Aa(r.yt,e.overlayMutation))}function Gl(r,e){const t=e.path.lastSegment();return[r,Re(e.path.popLast()),t]}function Hl(r,e,t,n){return{indexId:r,uid:e,sequenceNumber:t,readTime:yn(n.readTime),documentKey:Re(n.documentKey.path),largestBatchId:n.largestBatchId}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class BT{getBundleMetadata(e,t){return Wl(e).get(t).next((n=>{if(n)return(function(i){return{id:i.bundleId,createTime:In(i.createTime),version:i.version}})(n)}))}saveBundleMetadata(e,t){return Wl(e).put((function(s){return{bundleId:s.id,createTime:yn(Ce(s.createTime)),version:s.version}})(t))}getNamedQuery(e,t){return Ql(e).get(t).next((n=>{if(n)return(function(i){return{name:i.name,query:Wf(i.bundledQuery),readTime:In(i.readTime)}})(n)}))}saveNamedQuery(e,t){return Ql(e).put((function(s){return{name:s.name,readTime:yn(Ce(s.readTime)),bundledQuery:s.bundledQuery}})(t))}}function Wl(r){return _e(r,Hi)}function Ql(r){return _e(r,Wi)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ro{constructor(e,t){this.serializer=e,this.userId=t}static wt(e,t){const n=t.uid||"";return new ro(e,n)}getOverlay(e,t){return Nr(e).get(Gl(this.userId,t)).next((n=>n?Go(this.serializer,n):null))}getOverlays(e,t){const n=Je();return v.forEach(t,(s=>this.getOverlay(e,s).next((i=>{i!==null&&n.set(s,i)})))).next((()=>n))}saveOverlays(e,t,n){const s=[];return n.forEach(((i,o)=>{const c=new hc(t,o);s.push(this.St(e,c))})),v.waitFor(s)}removeOverlaysForBatchId(e,t,n){const s=new Set;t.forEach((o=>s.add(Re(o.getCollectionPath()))));const i=[];return s.forEach((o=>{const c=IDBKeyRange.bound([this.userId,o,n],[this.userId,o,n+1],!1,!0);i.push(Nr(e).X(fa,c))})),v.waitFor(i)}getOverlaysForCollection(e,t,n){const s=Je(),i=Re(t),o=IDBKeyRange.bound([this.userId,i,n],[this.userId,i,Number.POSITIVE_INFINITY],!0);return Nr(e).J(fa,o).next((c=>{for(const u of c){const h=Go(this.serializer,u);s.set(h.getKey(),h)}return s}))}getOverlaysForCollectionGroup(e,t,n,s){const i=Je();let o;const c=IDBKeyRange.bound([this.userId,t,n],[this.userId,t,Number.POSITIVE_INFINITY],!0);return Nr(e).ee({index:Gd,range:c},((u,h,f)=>{const p=Go(this.serializer,h);i.size()<s||p.largestBatchId===o?(i.set(p.getKey(),p),o=p.largestBatchId):f.done()})).next((()=>i))}St(e,t){return Nr(e).put((function(s,i,o){const[c,u,h]=Gl(i,o.mutation.key);return{userId:i,collectionPath:u,documentId:h,collectionGroup:o.mutation.key.getCollectionGroup(),largestBatchId:o.largestBatchId,overlayMutation:Vi(s.yt,o.mutation)}})(this.serializer,this.userId,t))}}function Nr(r){return _e(r,Qi)}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jT{bt(e){return _e(e,Xa)}getSessionToken(e){return this.bt(e).get("sessionToken").next((t=>{const n=t==null?void 0:t.value;return n?he.fromUint8Array(n):he.EMPTY_BYTE_STRING}))}setSessionToken(e,t){return this.bt(e).put({name:"sessionToken",value:t.toUint8Array()})}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class on{constructor(){}Dt(e,t){this.Ct(e,t),t.vt()}Ct(e,t){if("nullValue"in e)this.Ft(t,5);else if("booleanValue"in e)this.Ft(t,10),t.Mt(e.booleanValue?1:0);else if("integerValue"in e)this.Ft(t,15),t.Mt(oe(e.integerValue));else if("doubleValue"in e){const n=oe(e.doubleValue);isNaN(n)?this.Ft(t,13):(this.Ft(t,15),ss(n)?t.Mt(0):t.Mt(n))}else if("timestampValue"in e){let n=e.timestampValue;this.Ft(t,20),typeof n=="string"&&(n=ut(n)),t.xt(`${n.seconds||""}`),t.Mt(n.nanos||0)}else if("stringValue"in e)this.Ot(e.stringValue,t),this.Nt(t);else if("bytesValue"in e)this.Ft(t,30),t.Bt(lt(e.bytesValue)),this.Nt(t);else if("referenceValue"in e)this.Lt(e.referenceValue,t);else if("geoPointValue"in e){const n=e.geoPointValue;this.Ft(t,45),t.Mt(n.latitude||0),t.Mt(n.longitude||0)}else"mapValue"in e?sf(e)?this.Ft(t,Number.MAX_SAFE_INTEGER):Yi(e)?this.kt(e.mapValue,t):(this.Kt(e.mapValue,t),this.Nt(t)):"arrayValue"in e?(this.qt(e.arrayValue,t),this.Nt(t)):M(19022,{Ut:e})}Ot(e,t){this.Ft(t,25),this.$t(e,t)}$t(e,t){t.xt(e)}Kt(e,t){const n=e.fields||{};this.Ft(t,55);for(const s of Object.keys(n))this.Ot(s,t),this.Ct(n[s],t)}kt(e,t){var o,c;const n=e.fields||{};this.Ft(t,53);const s=Jn,i=((c=(o=n[s].arrayValue)==null?void 0:o.values)==null?void 0:c.length)||0;this.Ft(t,15),t.Mt(oe(i)),this.Ot(s,t),this.Ct(n[s],t)}qt(e,t){const n=e.values||[];this.Ft(t,50);for(const s of n)this.Ct(s,t)}Lt(e,t){this.Ft(t,37),x.fromName(e).path.forEach((n=>{this.Ft(t,60),this.$t(n,t)}))}Ft(e,t){e.Mt(t)}Nt(e){e.Mt(2)}}on.Wt=new on;/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law | agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES | CONDITIONS OF ANY KIND, either express | implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rn=255;function qT(r){if(r===0)return 8;let e=0;return r>>4||(e+=4,r<<=4),r>>6||(e+=2,r<<=2),r>>7||(e+=1),e}function Jl(r){const e=64-(function(n){let s=0;for(let i=0;i<8;++i){const o=qT(255&n[i]);if(s+=o,o!==8)break}return s})(r);return Math.ceil(e/8)}class zT{constructor(){this.buffer=new Uint8Array(1024),this.position=0}Qt(e){const t=e[Symbol.iterator]();let n=t.next();for(;!n.done;)this.Gt(n.value),n=t.next();this.zt()}jt(e){const t=e[Symbol.iterator]();let n=t.next();for(;!n.done;)this.Jt(n.value),n=t.next();this.Ht()}Zt(e){for(const t of e){const n=t.charCodeAt(0);if(n<128)this.Gt(n);else if(n<2048)this.Gt(960|n>>>6),this.Gt(128|63&n);else if(t<"\uD800"||"\uDBFF"<t)this.Gt(480|n>>>12),this.Gt(128|63&n>>>6),this.Gt(128|63&n);else{const s=t.codePointAt(0);this.Gt(240|s>>>18),this.Gt(128|63&s>>>12),this.Gt(128|63&s>>>6),this.Gt(128|63&s)}}this.zt()}Xt(e){for(const t of e){const n=t.charCodeAt(0);if(n<128)this.Jt(n);else if(n<2048)this.Jt(960|n>>>6),this.Jt(128|63&n);else if(t<"\uD800"||"\uDBFF"<t)this.Jt(480|n>>>12),this.Jt(128|63&n>>>6),this.Jt(128|63&n);else{const s=t.codePointAt(0);this.Jt(240|s>>>18),this.Jt(128|63&s>>>12),this.Jt(128|63&s>>>6),this.Jt(128|63&s)}}this.Ht()}Yt(e){const t=this.en(e),n=Jl(t);this.tn(1+n),this.buffer[this.position++]=255&n;for(let s=t.length-n;s<t.length;++s)this.buffer[this.position++]=255&t[s]}nn(e){const t=this.en(e),n=Jl(t);this.tn(1+n),this.buffer[this.position++]=~(255&n);for(let s=t.length-n;s<t.length;++s)this.buffer[this.position++]=~(255&t[s])}rn(){this.sn(Rn),this.sn(255)}_n(){this.an(Rn),this.an(255)}reset(){this.position=0}seed(e){this.tn(e.length),this.buffer.set(e,this.position),this.position+=e.length}un(){return this.buffer.slice(0,this.position)}en(e){const t=(function(i){const o=new DataView(new ArrayBuffer(8));return o.setFloat64(0,i,!1),new Uint8Array(o.buffer)})(e),n=!!(128&t[0]);t[0]^=n?255:128;for(let s=1;s<t.length;++s)t[s]^=n?255:0;return t}Gt(e){const t=255&e;t===0?(this.sn(0),this.sn(255)):t===Rn?(this.sn(Rn),this.sn(0)):this.sn(t)}Jt(e){const t=255&e;t===0?(this.an(0),this.an(255)):t===Rn?(this.an(Rn),this.an(0)):this.an(e)}zt(){this.sn(0),this.sn(1)}Ht(){this.an(0),this.an(1)}sn(e){this.tn(1),this.buffer[this.position++]=e}an(e){this.tn(1),this.buffer[this.position++]=~e}tn(e){const t=e+this.position;if(t<=this.buffer.length)return;let n=2*this.buffer.length;n<t&&(n=t);const s=new Uint8Array(n);s.set(this.buffer),this.buffer=s}}class $T{constructor(e){this.cn=e}Bt(e){this.cn.Qt(e)}xt(e){this.cn.Zt(e)}Mt(e){this.cn.Yt(e)}vt(){this.cn.rn()}}class KT{constructor(e){this.cn=e}Bt(e){this.cn.jt(e)}xt(e){this.cn.Xt(e)}Mt(e){this.cn.nn(e)}vt(){this.cn._n()}}class xr{constructor(){this.cn=new zT,this.ascending=new $T(this.cn),this.descending=new KT(this.cn)}seed(e){this.cn.seed(e)}ln(e){return e===0?this.ascending:this.descending}un(){return this.cn.un()}reset(){this.cn.reset()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class an{constructor(e,t,n,s){this.hn=e,this.Pn=t,this.Tn=n,this.In=s}En(){const e=this.In.length,t=e===0||this.In[e-1]===255?e+1:e,n=new Uint8Array(t);return n.set(this.In,0),t!==e?n.set([0],this.In.length):++n[n.length-1],new an(this.hn,this.Pn,this.Tn,n)}Rn(e,t,n){return{indexId:this.hn,uid:e,arrayValue:li(this.Tn),directionalValue:li(this.In),orderedDocumentKey:li(t),documentKey:n.path.toArray()}}An(e,t,n){const s=this.Rn(e,t,n);return[s.indexId,s.uid,s.arrayValue,s.directionalValue,s.orderedDocumentKey,s.documentKey]}}function wt(r,e){let t=r.hn-e.hn;return t!==0?t:(t=Yl(r.Tn,e.Tn),t!==0?t:(t=Yl(r.In,e.In),t!==0?t:x.comparator(r.Pn,e.Pn)))}function Yl(r,e){for(let t=0;t<r.length&&t<e.length;++t){const n=r[t]-e[t];if(n!==0)return n}return r.length-e.length}function li(r){return jh()?(function(t){let n="";for(let s=0;s<t.length;s++)n+=String.fromCharCode(t[s]);return n})(r):r}function Xl(r){return typeof r!="string"?r:(function(t){const n=new Uint8Array(t.length);for(let s=0;s<t.length;s++)n[s]=t.charCodeAt(s);return n})(r)}class Zl{constructor(e){this.Vn=new Z(((t,n)=>ae.comparator(t.field,n.field))),this.collectionId=e.collectionGroup!=null?e.collectionGroup:e.path.lastSegment(),this.dn=e.orderBy,this.mn=[];for(const t of e.filters){const n=t;n.isInequality()?this.Vn=this.Vn.add(n):this.mn.push(n)}}get fn(){return this.Vn.size>1}gn(e){if(F(e.collectionGroup===this.collectionId,49279),this.fn)return!1;const t=la(e);if(t!==void 0&&!this.pn(t))return!1;const n=tn(e);let s=new Set,i=0,o=0;for(;i<n.length&&this.pn(n[i]);++i)s=s.add(n[i].fieldPath.canonicalString());if(i===n.length)return!0;if(this.Vn.size>0){const c=this.Vn.getIterator().getNext();if(!s.has(c.field.canonicalString())){const u=n[i];if(!this.yn(c,u)||!this.wn(this.dn[o++],u))return!1}++i}for(;i<n.length;++i){const c=n[i];if(o>=this.dn.length||!this.wn(this.dn[o++],c))return!1}return!0}Sn(){if(this.fn)return null;let e=new Z(ae.comparator);const t=[];for(const n of this.mn)if(!n.field.isKeyField())if(n.op==="array-contains"||n.op==="array-contains-any")t.push(new ni(n.field,2));else{if(e.has(n.field))continue;e=e.add(n.field),t.push(new ni(n.field,0))}for(const n of this.dn)n.field.isKeyField()||e.has(n.field)||(e=e.add(n.field),t.push(new ni(n.field,n.dir==="asc"?0:1)));return new Ei(Ei.UNKNOWN_ID,this.collectionId,t,rs.empty())}pn(e){for(const t of this.mn)if(this.yn(t,e))return!0;return!1}yn(e,t){if(e===void 0||!e.field.isEqual(t.fieldPath))return!1;const n=e.op==="array-contains"||e.op==="array-contains-any";return t.kind===2===n}wn(e,t){return!!e.field.isEqual(t.fieldPath)&&(t.kind===0&&e.dir==="asc"||t.kind===1&&e.dir==="desc")}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qf(r){var t,n;if(F(r instanceof W||r instanceof te,20012),r instanceof W){if(r instanceof mf){const s=((n=(t=r.value.arrayValue)==null?void 0:t.values)==null?void 0:n.map((i=>W.create(r.field,"==",i))))||[];return te.create(s,"or")}return r}const e=r.filters.map((s=>Qf(s)));return te.create(e,r.op)}function GT(r){if(r.getFilters().length===0)return[];const e=ba(Qf(r));return F(Jf(e),7391),Sa(e)||Ra(e)?[e]:e.getFilters()}function Sa(r){return r instanceof W}function Ra(r){return r instanceof te&&sc(r)}function Jf(r){return Sa(r)||Ra(r)||(function(t){if(t instanceof te&&_a(t)){for(const n of t.getFilters())if(!Sa(n)&&!Ra(n))return!1;return!0}return!1})(r)}function ba(r){if(F(r instanceof W||r instanceof te,34018),r instanceof W)return r;if(r.filters.length===1)return ba(r.filters[0]);const e=r.filters.map((n=>ba(n)));let t=te.create(e,r.op);return t=ki(t),Jf(t)?t:(F(t instanceof te,64498),F(Zn(t),40251),F(t.filters.length>1,57927),t.filters.reduce(((n,s)=>mc(n,s))))}function mc(r,e){let t;return F(r instanceof W||r instanceof te,38388),F(e instanceof W||e instanceof te,25473),t=r instanceof W?e instanceof W?(function(s,i){return te.create([s,i],"and")})(r,e):eh(r,e):e instanceof W?eh(e,r):(function(s,i){if(F(s.filters.length>0&&i.filters.length>0,48005),Zn(s)&&Zn(i))return hf(s,i.getFilters());const o=_a(s)?s:i,c=_a(s)?i:s,u=o.filters.map((h=>mc(h,c)));return te.create(u,"or")})(r,e),ki(t)}function eh(r,e){if(Zn(e))return hf(e,r.getFilters());{const t=e.filters.map((n=>mc(r,n)));return te.create(t,"or")}}function ki(r){if(F(r instanceof W||r instanceof te,11850),r instanceof W)return r;const e=r.getFilters();if(e.length===1)return ki(e[0]);if(uf(r))return r;const t=e.map((s=>ki(s))),n=[];return t.forEach((s=>{s instanceof W?n.push(s):s instanceof te&&(s.op===r.op?n.push(...s.filters):n.push(s))})),n.length===1?n[0]:te.create(n,r.op)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class HT{constructor(){this.bn=new pc}addToCollectionParentIndex(e,t){return this.bn.add(t),v.resolve()}getCollectionParents(e,t){return v.resolve(this.bn.getEntries(t))}addFieldIndex(e,t){return v.resolve()}deleteFieldIndex(e,t){return v.resolve()}deleteAllFieldIndexes(e){return v.resolve()}createTargetIndexes(e,t){return v.resolve()}getDocumentsMatchingTarget(e,t){return v.resolve(null)}getIndexType(e,t){return v.resolve(0)}getFieldIndexes(e,t){return v.resolve([])}getNextCollectionGroupToUpdate(e){return v.resolve(null)}getMinOffset(e,t){return v.resolve(Ue.min())}getMinOffsetFromCollectionGroup(e,t){return v.resolve(Ue.min())}updateCollectionGroup(e,t,n){return v.resolve()}updateIndexEntries(e,t){return v.resolve()}}class pc{constructor(){this.index={}}add(e){const t=e.lastSegment(),n=e.popLast(),s=this.index[t]||new Z(ee.comparator),i=!s.has(n);return this.index[t]=s.add(n),i}has(e){const t=e.lastSegment(),n=e.popLast(),s=this.index[t];return s&&s.has(n)}getEntries(e){return(this.index[e]||new Z(ee.comparator)).toArray()}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const th="IndexedDbIndexManager",Hs=new Uint8Array(0);class WT{constructor(e,t){this.databaseId=t,this.Dn=new pc,this.Cn=new ft((n=>_n(n)),((n,s)=>vs(n,s))),this.uid=e.uid||""}addToCollectionParentIndex(e,t){if(!this.Dn.has(t)){const n=t.lastSegment(),s=t.popLast();e.addOnCommittedListener((()=>{this.Dn.add(t)}));const i={collectionId:n,parent:Re(s)};return nh(e).put(i)}return v.resolve()}getCollectionParents(e,t){const n=[],s=IDBKeyRange.bound([t,""],[Nd(t),""],!1,!0);return nh(e).J(s).next((i=>{for(const o of i){if(o.collectionId!==t)break;n.push(Qe(o.parent))}return n}))}addFieldIndex(e,t){const n=Or(e),s=(function(c){return{indexId:c.indexId,collectionGroup:c.collectionGroup,fields:c.fields.map((u=>[u.fieldPath.canonicalString(),u.kind]))}})(t);delete s.indexId;const i=n.add(s);if(t.indexState){const o=Pn(e);return i.next((c=>{o.put(Hl(c,this.uid,t.indexState.sequenceNumber,t.indexState.offset))}))}return i.next()}deleteFieldIndex(e,t){const n=Or(e),s=Pn(e),i=bn(e);return n.delete(t.indexId).next((()=>s.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0)))).next((()=>i.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0))))}deleteAllFieldIndexes(e){const t=Or(e),n=bn(e),s=Pn(e);return t.X().next((()=>n.X())).next((()=>s.X()))}createTargetIndexes(e,t){return v.forEach(this.vn(t),(n=>this.getIndexType(e,n).next((s=>{if(s===0||s===1){const i=new Zl(n).Sn();if(i!=null)return this.addFieldIndex(e,i)}}))))}getDocumentsMatchingTarget(e,t){const n=bn(e);let s=!0;const i=new Map;return v.forEach(this.vn(t),(o=>this.Fn(e,o).next((c=>{s&&(s=!!c),i.set(o,c)})))).next((()=>{if(s){let o=K();const c=[];return v.forEach(i,((u,h)=>{C(th,`Using index ${(function(q){return`id=${q.indexId}|cg=${q.collectionGroup}|f=${q.fields.map((se=>`${se.fieldPath}:${se.kind}`)).join(",")}`})(u)} to execute ${_n(t)}`);const f=(function(q,se){const J=la(se);if(J===void 0)return null;for(const Y of Pi(q,J.fieldPath))switch(Y.op){case"array-contains-any":return Y.value.arrayValue.values||[];case"array-contains":return[Y.value]}return null})(h,u),p=(function(q,se){const J=new Map;for(const Y of tn(se))for(const I of Pi(q,Y.fieldPath))switch(I.op){case"==":case"in":J.set(Y.fieldPath.canonicalString(),I.value);break;case"not-in":case"!=":return J.set(Y.fieldPath.canonicalString(),I.value),Array.from(J.values())}return null})(h,u),E=(function(q,se){const J=[];let Y=!0;for(const I of tn(se)){const g=I.kind===0?Nl(q,I.fieldPath,q.startAt):xl(q,I.fieldPath,q.startAt);J.push(g.value),Y&&(Y=g.inclusive)}return new Xn(J,Y)})(h,u),b=(function(q,se){const J=[];let Y=!0;for(const I of tn(se)){const g=I.kind===0?xl(q,I.fieldPath,q.endAt):Nl(q,I.fieldPath,q.endAt);J.push(g.value),Y&&(Y=g.inclusive)}return new Xn(J,Y)})(h,u),V=this.Mn(u,h,E),N=this.Mn(u,h,b),D=this.xn(u,h,p),G=this.On(u.indexId,f,V,E.inclusive,N,b.inclusive,D);return v.forEach(G,(z=>n.Z(z,t.limit).next((q=>{q.forEach((se=>{const J=x.fromSegments(se.documentKey);o.has(J)||(o=o.add(J),c.push(J))}))}))))})).next((()=>c))}return v.resolve(null)}))}vn(e){let t=this.Cn.get(e);return t||(e.filters.length===0?t=[e]:t=GT(te.create(e.filters,"and")).map((n=>Ia(e.path,e.collectionGroup,e.orderBy,n.getFilters(),e.limit,e.startAt,e.endAt))),this.Cn.set(e,t),t)}On(e,t,n,s,i,o,c){const u=(t!=null?t.length:1)*Math.max(n.length,i.length),h=u/(t!=null?t.length:1),f=[];for(let p=0;p<u;++p){const E=t?this.Nn(t[p/h]):Hs,b=this.Bn(e,E,n[p%h],s),V=this.Ln(e,E,i[p%h],o),N=c.map((D=>this.Bn(e,E,D,!0)));f.push(...this.createRange(b,V,N))}return f}Bn(e,t,n,s){const i=new an(e,x.empty(),t,n);return s?i:i.En()}Ln(e,t,n,s){const i=new an(e,x.empty(),t,n);return s?i.En():i}Fn(e,t){const n=new Zl(t),s=t.collectionGroup!=null?t.collectionGroup:t.path.lastSegment();return this.getFieldIndexes(e,s).next((i=>{let o=null;for(const c of i)n.gn(c)&&(!o||c.fields.length>o.fields.length)&&(o=c);return o}))}getIndexType(e,t){let n=2;const s=this.vn(t);return v.forEach(s,(i=>this.Fn(e,i).next((o=>{o?n!==0&&o.fields.length<(function(u){let h=new Z(ae.comparator),f=!1;for(const p of u.filters)for(const E of p.getFlattenedFilters())E.field.isKeyField()||(E.op==="array-contains"||E.op==="array-contains-any"?f=!0:h=h.add(E.field));for(const p of u.orderBy)p.field.isKeyField()||(h=h.add(p.field));return h.size+(f?1:0)})(i)&&(n=1):n=0})))).next((()=>(function(o){return o.limit!==null})(t)&&s.length>1&&n===2?1:n))}kn(e,t){const n=new xr;for(const s of tn(e)){const i=t.data.field(s.fieldPath);if(i==null)return null;const o=n.ln(s.kind);on.Wt.Dt(i,o)}return n.un()}Nn(e){const t=new xr;return on.Wt.Dt(e,t.ln(0)),t.un()}Kn(e,t){const n=new xr;return on.Wt.Dt(rc(this.databaseId,t),n.ln((function(i){const o=tn(i);return o.length===0?0:o[o.length-1].kind})(e))),n.un()}xn(e,t,n){if(n===null)return[];let s=[];s.push(new xr);let i=0;for(const o of tn(e)){const c=n[i++];for(const u of s)if(this.qn(t,o.fieldPath)&&ls(c))s=this.Un(s,o,c);else{const h=u.ln(o.kind);on.Wt.Dt(c,h)}}return this.$n(s)}Mn(e,t,n){return this.xn(e,t,n.position)}$n(e){const t=[];for(let n=0;n<e.length;++n)t[n]=e[n].un();return t}Un(e,t,n){const s=[...e],i=[];for(const o of n.arrayValue.values||[])for(const c of s){const u=new xr;u.seed(c.un()),on.Wt.Dt(o,u.ln(t.kind)),i.push(u)}return i}qn(e,t){return!!e.filters.find((n=>n instanceof W&&n.field.isEqual(t)&&(n.op==="in"||n.op==="not-in")))}getFieldIndexes(e,t){const n=Or(e),s=Pn(e);return(t?n.J(da,IDBKeyRange.bound(t,t)):n.J()).next((i=>{const o=[];return v.forEach(i,(c=>s.get([c.indexId,this.uid]).next((u=>{o.push((function(f,p){const E=p?new rs(p.sequenceNumber,new Ue(In(p.readTime),new x(Qe(p.documentKey)),p.largestBatchId)):rs.empty(),b=f.fields.map((([V,N])=>new ni(ae.fromServerFormat(V),N)));return new Ei(f.indexId,f.collectionGroup,b,E)})(c,u))})))).next((()=>o))}))}getNextCollectionGroupToUpdate(e){return this.getFieldIndexes(e).next((t=>t.length===0?null:(t.sort(((n,s)=>{const i=n.indexState.sequenceNumber-s.indexState.sequenceNumber;return i!==0?i:j(n.collectionGroup,s.collectionGroup)})),t[0].collectionGroup)))}updateCollectionGroup(e,t,n){const s=Or(e),i=Pn(e);return this.Wn(e).next((o=>s.J(da,IDBKeyRange.bound(t,t)).next((c=>v.forEach(c,(u=>i.put(Hl(u.indexId,this.uid,o,n))))))))}updateIndexEntries(e,t){const n=new Map;return v.forEach(t,((s,i)=>{const o=n.get(s.collectionGroup);return(o?v.resolve(o):this.getFieldIndexes(e,s.collectionGroup)).next((c=>(n.set(s.collectionGroup,c),v.forEach(c,(u=>this.Qn(e,s,u).next((h=>{const f=this.Gn(i,u);return h.isEqual(f)?v.resolve():this.zn(e,i,u,h,f)})))))))}))}jn(e,t,n,s){return bn(e).put(s.Rn(this.uid,this.Kn(n,t.key),t.key))}Jn(e,t,n,s){return bn(e).delete(s.An(this.uid,this.Kn(n,t.key),t.key))}Qn(e,t,n){const s=bn(e);let i=new Z(wt);return s.ee({index:Kd,range:IDBKeyRange.only([n.indexId,this.uid,li(this.Kn(n,t))])},((o,c)=>{i=i.add(new an(n.indexId,t,Xl(c.arrayValue),Xl(c.directionalValue)))})).next((()=>i))}Gn(e,t){let n=new Z(wt);const s=this.kn(t,e);if(s==null)return n;const i=la(t);if(i!=null){const o=e.data.field(i.fieldPath);if(ls(o))for(const c of o.arrayValue.values||[])n=n.add(new an(t.indexId,e.key,this.Nn(c),s))}else n=n.add(new an(t.indexId,e.key,Hs,s));return n}zn(e,t,n,s,i){C(th,"Updating index entries for document '%s'",t.key);const o=[];return(function(u,h,f,p,E){const b=u.getIterator(),V=h.getIterator();let N=Sn(b),D=Sn(V);for(;N||D;){let G=!1,z=!1;if(N&&D){const q=f(N,D);q<0?z=!0:q>0&&(G=!0)}else N!=null?z=!0:G=!0;G?(p(D),D=Sn(V)):z?(E(N),N=Sn(b)):(N=Sn(b),D=Sn(V))}})(s,i,wt,(c=>{o.push(this.jn(e,t,n,c))}),(c=>{o.push(this.Jn(e,t,n,c))})),v.waitFor(o)}Wn(e){let t=1;return Pn(e).ee({index:$d,reverse:!0,range:IDBKeyRange.upperBound([this.uid,Number.MAX_SAFE_INTEGER])},((n,s,i)=>{i.done(),t=s.sequenceNumber+1})).next((()=>t))}createRange(e,t,n){n=n.sort(((o,c)=>wt(o,c))).filter(((o,c,u)=>!c||wt(o,u[c-1])!==0));const s=[];s.push(e);for(const o of n){const c=wt(o,e),u=wt(o,t);if(c===0)s[0]=e.En();else if(c>0&&u<0)s.push(o),s.push(o.En());else if(u>0)break}s.push(t);const i=[];for(let o=0;o<s.length;o+=2){if(this.Hn(s[o],s[o+1]))return[];const c=s[o].An(this.uid,Hs,x.empty()),u=s[o+1].An(this.uid,Hs,x.empty());i.push(IDBKeyRange.bound(c,u))}return i}Hn(e,t){return wt(e,t)>0}getMinOffsetFromCollectionGroup(e,t){return this.getFieldIndexes(e,t).next(rh)}getMinOffset(e,t){return v.mapArray(this.vn(t),(n=>this.Fn(e,n).next((s=>s||M(44426))))).next(rh)}}function nh(r){return _e(r,as)}function bn(r){return _e(r,Wr)}function Or(r){return _e(r,Ya)}function Pn(r){return _e(r,Hr)}function rh(r){F(r.length!==0,28825);let e=r[0].indexState.offset,t=e.largestBatchId;for(let n=1;n<r.length;n++){const s=r[n].indexState.offset;Wa(s,e)<0&&(e=s),t<s.largestBatchId&&(t=s.largestBatchId)}return new Ue(e.readTime,e.documentKey,t)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sh={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},Yf=41943040;class Ae{static withCacheSize(e){return new Ae(e,Ae.DEFAULT_COLLECTION_PERCENTILE,Ae.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,n){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=n}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xf(r,e,t){const n=r.store(je),s=r.store(Gn),i=[],o=IDBKeyRange.only(t.batchId);let c=0;const u=n.ee({range:o},((f,p,E)=>(c++,E.delete())));i.push(u.next((()=>{F(c===1,47070,{batchId:t.batchId})})));const h=[];for(const f of t.mutations){const p=jd(e,f.key.path,t.batchId);i.push(s.delete(p)),h.push(f.key)}return v.waitFor(i).next((()=>h))}function Ni(r){if(!r)return 0;let e;if(r.document)e=r.document;else if(r.unknownDocument)e=r.unknownDocument;else{if(!r.noDocument)throw M(14731);e=r.noDocument}return JSON.stringify(e).length}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Ae.DEFAULT_COLLECTION_PERCENTILE=10,Ae.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Ae.DEFAULT=new Ae(Yf,Ae.DEFAULT_COLLECTION_PERCENTILE,Ae.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Ae.DISABLED=new Ae(-1,0,0);class so{constructor(e,t,n,s){this.userId=e,this.serializer=t,this.indexManager=n,this.referenceDelegate=s,this.Zn={}}static wt(e,t,n,s){F(e.uid!=="",64387);const i=e.isAuthenticated()?e.uid:"";return new so(i,t,n,s)}checkEmpty(e){let t=!0;const n=IDBKeyRange.bound([this.userId,Number.NEGATIVE_INFINITY],[this.userId,Number.POSITIVE_INFINITY]);return vt(e).ee({index:cn,range:n},((s,i,o)=>{t=!1,o.done()})).next((()=>t))}addMutationBatch(e,t,n,s){const i=xn(e),o=vt(e);return o.add({}).next((c=>{F(typeof c=="number",49019);const u=new uc(c,t,n,s),h=(function(b,V,N){const D=N.baseMutations.map((z=>Vi(b.yt,z))),G=N.mutations.map((z=>Vi(b.yt,z)));return{userId:V,batchId:N.batchId,localWriteTimeMs:N.localWriteTime.toMillis(),baseMutations:D,mutations:G}})(this.serializer,this.userId,u),f=[];let p=new Z(((E,b)=>j(E.canonicalString(),b.canonicalString())));for(const E of s){const b=jd(this.userId,E.key.path,c);p=p.add(E.key.path.popLast()),f.push(o.put(h)),f.push(i.put(b,AI))}return p.forEach((E=>{f.push(this.indexManager.addToCollectionParentIndex(e,E))})),e.addOnCommittedListener((()=>{this.Zn[c]=u.keys()})),v.waitFor(f).next((()=>u))}))}lookupMutationBatch(e,t){return vt(e).get(t).next((n=>n?(F(n.userId===this.userId,48,"Unexpected user for mutation batch",{userId:n.userId,batchId:t}),sn(this.serializer,n)):null))}Xn(e,t){return this.Zn[t]?v.resolve(this.Zn[t]):this.lookupMutationBatch(e,t).next((n=>{if(n){const s=n.keys();return this.Zn[t]=s,s}return null}))}getNextMutationBatchAfterBatchId(e,t){const n=t+1,s=IDBKeyRange.lowerBound([this.userId,n]);let i=null;return vt(e).ee({index:cn,range:s},((o,c,u)=>{c.userId===this.userId&&(F(c.batchId>=n,47524,{Yn:n}),i=sn(this.serializer,c)),u.done()})).next((()=>i))}getHighestUnacknowledgedBatchId(e){const t=IDBKeyRange.upperBound([this.userId,Number.POSITIVE_INFINITY]);let n=un;return vt(e).ee({index:cn,range:t,reverse:!0},((s,i,o)=>{n=i.batchId,o.done()})).next((()=>n))}getAllMutationBatches(e){const t=IDBKeyRange.bound([this.userId,un],[this.userId,Number.POSITIVE_INFINITY]);return vt(e).J(cn,t).next((n=>n.map((s=>sn(this.serializer,s)))))}getAllMutationBatchesAffectingDocumentKey(e,t){const n=ri(this.userId,t.path),s=IDBKeyRange.lowerBound(n),i=[];return xn(e).ee({range:s},((o,c,u)=>{const[h,f,p]=o,E=Qe(f);if(h===this.userId&&t.path.isEqual(E))return vt(e).get(p).next((b=>{if(!b)throw M(61480,{er:o,batchId:p});F(b.userId===this.userId,10503,"Unexpected user for mutation batch",{userId:b.userId,batchId:p}),i.push(sn(this.serializer,b))}));u.done()})).next((()=>i))}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new Z(j);const s=[];return t.forEach((i=>{const o=ri(this.userId,i.path),c=IDBKeyRange.lowerBound(o),u=xn(e).ee({range:c},((h,f,p)=>{const[E,b,V]=h,N=Qe(b);E===this.userId&&i.path.isEqual(N)?n=n.add(V):p.done()}));s.push(u)})),v.waitFor(s).next((()=>this.tr(e,n)))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,s=n.length+1,i=ri(this.userId,n),o=IDBKeyRange.lowerBound(i);let c=new Z(j);return xn(e).ee({range:o},((u,h,f)=>{const[p,E,b]=u,V=Qe(E);p===this.userId&&n.isPrefixOf(V)?V.length===s&&(c=c.add(b)):f.done()})).next((()=>this.tr(e,c)))}tr(e,t){const n=[],s=[];return t.forEach((i=>{s.push(vt(e).get(i).next((o=>{if(o===null)throw M(35274,{batchId:i});F(o.userId===this.userId,9748,"Unexpected user for mutation batch",{userId:o.userId,batchId:i}),n.push(sn(this.serializer,o))})))})),v.waitFor(s).next((()=>n))}removeMutationBatch(e,t){return Xf(e.le,this.userId,t).next((n=>(e.addOnCommittedListener((()=>{this.nr(t.batchId)})),v.forEach(n,(s=>this.referenceDelegate.markPotentiallyOrphaned(e,s))))))}nr(e){delete this.Zn[e]}performConsistencyCheck(e){return this.checkEmpty(e).next((t=>{if(!t)return v.resolve();const n=IDBKeyRange.lowerBound((function(o){return[o]})(this.userId)),s=[];return xn(e).ee({range:n},((i,o,c)=>{if(i[0]===this.userId){const u=Qe(i[1]);s.push(u)}else c.done()})).next((()=>{F(s.length===0,56720,{rr:s.map((i=>i.canonicalString()))})}))}))}containsKey(e,t){return Zf(e,this.userId,t)}ir(e){return em(e).get(this.userId).next((t=>t||{userId:this.userId,lastAcknowledgedBatchId:un,lastStreamToken:""}))}}function Zf(r,e,t){const n=ri(e,t.path),s=n[1],i=IDBKeyRange.lowerBound(n);let o=!1;return xn(r).ee({range:i,Y:!0},((c,u,h)=>{const[f,p,E]=c;f===e&&p===s&&(o=!0),h.done()})).next((()=>o))}function vt(r){return _e(r,je)}function xn(r){return _e(r,Gn)}function em(r){return _e(r,is)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ht{constructor(e){this.sr=e}next(){return this.sr+=2,this.sr}static _r(){return new ht(0)}static ar(){return new ht(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class QT{constructor(e,t){this.referenceDelegate=e,this.serializer=t}allocateTargetId(e){return this.ur(e).next((t=>{const n=new ht(t.highestTargetId);return t.highestTargetId=n.next(),this.cr(e,t).next((()=>t.highestTargetId))}))}getLastRemoteSnapshotVersion(e){return this.ur(e).next((t=>U.fromTimestamp(new X(t.lastRemoteSnapshotVersion.seconds,t.lastRemoteSnapshotVersion.nanoseconds))))}getHighestSequenceNumber(e){return this.ur(e).next((t=>t.highestListenSequenceNumber))}setTargetsMetadata(e,t,n){return this.ur(e).next((s=>(s.highestListenSequenceNumber=t,n&&(s.lastRemoteSnapshotVersion=n.toTimestamp()),t>s.highestListenSequenceNumber&&(s.highestListenSequenceNumber=t),this.cr(e,s))))}addTargetData(e,t){return this.lr(e,t).next((()=>this.ur(e).next((n=>(n.targetCount+=1,this.hr(t,n),this.cr(e,n))))))}updateTargetData(e,t){return this.lr(e,t)}removeTargetData(e,t){return this.removeMatchingKeysForTargetId(e,t.targetId).next((()=>Cn(e).delete(t.targetId))).next((()=>this.ur(e))).next((n=>(F(n.targetCount>0,8065),n.targetCount-=1,this.cr(e,n))))}removeTargets(e,t,n){let s=0;const i=[];return Cn(e).ee(((o,c)=>{const u=qr(c);u.sequenceNumber<=t&&n.get(u.targetId)===null&&(s++,i.push(this.removeTargetData(e,u)))})).next((()=>v.waitFor(i))).next((()=>s))}forEachTarget(e,t){return Cn(e).ee(((n,s)=>{const i=qr(s);t(i)}))}ur(e){return ih(e).get(Ai).next((t=>(F(t!==null,2888),t)))}cr(e,t){return ih(e).put(Ai,t)}lr(e,t){return Cn(e).put(Hf(this.serializer,t))}hr(e,t){let n=!1;return e.targetId>t.highestTargetId&&(t.highestTargetId=e.targetId,n=!0),e.sequenceNumber>t.highestListenSequenceNumber&&(t.highestListenSequenceNumber=e.sequenceNumber,n=!0),n}getTargetCount(e){return this.ur(e).next((t=>t.targetCount))}getTargetData(e,t){const n=_n(t),s=IDBKeyRange.bound([n,Number.NEGATIVE_INFINITY],[n,Number.POSITIVE_INFINITY]);let i=null;return Cn(e).ee({range:s,index:zd},((o,c,u)=>{const h=qr(c);vs(t,h.target)&&(i=h,u.done())})).next((()=>i))}addMatchingKeys(e,t,n){const s=[],i=Ct(e);return t.forEach((o=>{const c=Re(o.path);s.push(i.put({targetId:n,path:c})),s.push(this.referenceDelegate.addReference(e,n,o))})),v.waitFor(s)}removeMatchingKeys(e,t,n){const s=Ct(e);return v.forEach(t,(i=>{const o=Re(i.path);return v.waitFor([s.delete([n,o]),this.referenceDelegate.removeReference(e,n,i)])}))}removeMatchingKeysForTargetId(e,t){const n=Ct(e),s=IDBKeyRange.bound([t],[t+1],!1,!0);return n.delete(s)}getMatchingKeysForTargetId(e,t){const n=IDBKeyRange.bound([t],[t+1],!1,!0),s=Ct(e);let i=K();return s.ee({range:n,Y:!0},((o,c,u)=>{const h=Qe(o[1]),f=new x(h);i=i.add(f)})).next((()=>i))}containsKey(e,t){const n=Re(t.path),s=IDBKeyRange.bound([n],[Nd(n)],!1,!0);let i=0;return Ct(e).ee({index:Ja,Y:!0,range:s},(([o,c],u,h)=>{o!==0&&(i++,h.done())})).next((()=>i>0))}At(e,t){return Cn(e).get(t).next((n=>n?qr(n):null))}}function Cn(r){return _e(r,Hn)}function ih(r){return _e(r,ln)}function Ct(r){return _e(r,Wn)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const oh="LruGarbageCollector",tm=1048576;function ah([r,e],[t,n]){const s=j(r,t);return s===0?j(e,n):s}class JT{constructor(e){this.Pr=e,this.buffer=new Z(ah),this.Tr=0}Ir(){return++this.Tr}Er(e){const t=[e,this.Ir()];if(this.buffer.size<this.Pr)this.buffer=this.buffer.add(t);else{const n=this.buffer.last();ah(t,n)<0&&(this.buffer=this.buffer.delete(n).add(t))}}get maxValue(){return this.buffer.last()[0]}}class nm{constructor(e,t,n){this.garbageCollector=e,this.asyncQueue=t,this.localStore=n,this.Rr=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Ar(6e4)}stop(){this.Rr&&(this.Rr.cancel(),this.Rr=null)}get started(){return this.Rr!==null}Ar(e){C(oh,`Garbage collection scheduled in ${e}ms`),this.Rr=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.Rr=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){$t(t)?C(oh,"Ignoring IndexedDB error during garbage collection: ",t):await zt(t)}await this.Ar(3e5)}))}}class YT{constructor(e,t){this.Vr=e,this.params=t}calculateTargetCount(e,t){return this.Vr.dr(e).next((n=>Math.floor(t/100*n)))}nthSequenceNumber(e,t){if(t===0)return v.resolve(De.ce);const n=new JT(t);return this.Vr.forEachTarget(e,(s=>n.Er(s.sequenceNumber))).next((()=>this.Vr.mr(e,(s=>n.Er(s))))).next((()=>n.maxValue))}removeTargets(e,t,n){return this.Vr.removeTargets(e,t,n)}removeOrphanedDocuments(e,t){return this.Vr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(C("LruGarbageCollector","Garbage collection skipped; disabled"),v.resolve(sh)):this.getCacheSize(e).next((n=>n<this.params.cacheSizeCollectionThreshold?(C("LruGarbageCollector",`Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),sh):this.gr(e,t)))}getCacheSize(e){return this.Vr.getCacheSize(e)}gr(e,t){let n,s,i,o,c,u,h;const f=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((p=>(p>this.params.maximumSequenceNumbersToCollect?(C("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${p}`),s=this.params.maximumSequenceNumbersToCollect):s=p,o=Date.now(),this.nthSequenceNumber(e,s)))).next((p=>(n=p,c=Date.now(),this.removeTargets(e,n,t)))).next((p=>(i=p,u=Date.now(),this.removeOrphanedDocuments(e,n)))).next((p=>(h=Date.now(),Vn()<=H.DEBUG&&C("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${o-f}ms
	Determined least recently used ${s} in `+(c-o)+`ms
	Removed ${i} targets in `+(u-c)+`ms
	Removed ${p} documents in `+(h-u)+`ms
Total Duration: ${h-f}ms`),v.resolve({didRun:!0,sequenceNumbersCollected:s,targetsRemoved:i,documentsRemoved:p}))))}}function rm(r,e){return new YT(r,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class XT{constructor(e,t){this.db=e,this.garbageCollector=rm(this,t)}dr(e){const t=this.pr(e);return this.db.getTargetCache().getTargetCount(e).next((n=>t.next((s=>n+s))))}pr(e){let t=0;return this.mr(e,(n=>{t++})).next((()=>t))}forEachTarget(e,t){return this.db.getTargetCache().forEachTarget(e,t)}mr(e,t){return this.yr(e,((n,s)=>t(s)))}addReference(e,t,n){return Ws(e,n)}removeReference(e,t,n){return Ws(e,n)}removeTargets(e,t,n){return this.db.getTargetCache().removeTargets(e,t,n)}markPotentiallyOrphaned(e,t){return Ws(e,t)}wr(e,t){return(function(s,i){let o=!1;return em(s).te((c=>Zf(s,c,i).next((u=>(u&&(o=!0),v.resolve(!u)))))).next((()=>o))})(e,t)}removeOrphanedDocuments(e,t){const n=this.db.getRemoteDocumentCache().newChangeBuffer(),s=[];let i=0;return this.yr(e,((o,c)=>{if(c<=t){const u=this.wr(e,o).next((h=>{if(!h)return i++,n.getEntry(e,o).next((()=>(n.removeEntry(o,U.min()),Ct(e).delete((function(p){return[0,Re(p.path)]})(o)))))}));s.push(u)}})).next((()=>v.waitFor(s))).next((()=>n.apply(e))).next((()=>i))}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.db.getTargetCache().updateTargetData(e,n)}updateLimboDocument(e,t){return Ws(e,t)}yr(e,t){const n=Ct(e);let s,i=De.ce;return n.ee({index:Ja},(([o,c],{path:u,sequenceNumber:h})=>{o===0?(i!==De.ce&&t(new x(Qe(s)),i),i=h,s=u):i=De.ce})).next((()=>{i!==De.ce&&t(new x(Qe(s)),i)}))}getCacheSize(e){return this.db.getRemoteDocumentCache().getSize(e)}}function Ws(r,e){return Ct(r).put((function(n,s){return{targetId:0,path:Re(n.path),sequenceNumber:s}})(e,r.currentSequenceNumber))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sm{constructor(){this.changes=new ft((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,ue.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const n=this.changes.get(t);return n!==void 0?v.resolve(n):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ZT{constructor(e){this.serializer=e}setIndexManager(e){this.indexManager=e}addEntry(e,t,n){return Zt(e).put(n)}removeEntry(e,t,n){return Zt(e).delete((function(i,o){const c=i.path.toArray();return[c.slice(0,c.length-2),c[c.length-2],Di(o),c[c.length-1]]})(t,n))}updateMetadata(e,t){return this.getMetadata(e).next((n=>(n.byteSize+=t,this.Sr(e,n))))}getEntry(e,t){let n=ue.newInvalidDocument(t);return Zt(e).ee({index:si,range:IDBKeyRange.only(Mr(t))},((s,i)=>{n=this.br(t,i)})).next((()=>n))}Dr(e,t){let n={size:0,document:ue.newInvalidDocument(t)};return Zt(e).ee({index:si,range:IDBKeyRange.only(Mr(t))},((s,i)=>{n={document:this.br(t,i),size:Ni(i)}})).next((()=>n))}getEntries(e,t){let n=Me();return this.Cr(e,t,((s,i)=>{const o=this.br(s,i);n=n.insert(s,o)})).next((()=>n))}vr(e,t){let n=Me(),s=new re(x.comparator);return this.Cr(e,t,((i,o)=>{const c=this.br(i,o);n=n.insert(i,c),s=s.insert(i,Ni(o))})).next((()=>({documents:n,Fr:s})))}Cr(e,t,n){if(t.isEmpty())return v.resolve();let s=new Z(lh);t.forEach((u=>s=s.add(u)));const i=IDBKeyRange.bound(Mr(s.first()),Mr(s.last())),o=s.getIterator();let c=o.getNext();return Zt(e).ee({index:si,range:i},((u,h,f)=>{const p=x.fromSegments([...h.prefixPath,h.collectionGroup,h.documentId]);for(;c&&lh(c,p)<0;)n(c,null),c=o.getNext();c&&c.isEqual(p)&&(n(c,h),c=o.hasNext()?o.getNext():null),c?f.j(Mr(c)):f.done()})).next((()=>{for(;c;)n(c,null),c=o.hasNext()?o.getNext():null}))}getDocumentsMatchingQuery(e,t,n,s,i){const o=t.path,c=[o.popLast().toArray(),o.lastSegment(),Di(n.readTime),n.documentKey.path.isEmpty()?"":n.documentKey.path.lastSegment()],u=[o.popLast().toArray(),o.lastSegment(),[Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],""];return Zt(e).J(IDBKeyRange.bound(c,u,!0)).next((h=>{i==null||i.incrementDocumentReadCount(h.length);let f=Me();for(const p of h){const E=this.br(x.fromSegments(p.prefixPath.concat(p.collectionGroup,p.documentId)),p);E.isFoundDocument()&&(As(t,E)||s.has(E.key))&&(f=f.insert(E.key,E))}return f}))}getAllFromCollectionGroup(e,t,n,s){let i=Me();const o=uh(t,n),c=uh(t,Ue.max());return Zt(e).ee({index:qd,range:IDBKeyRange.bound(o,c,!0)},((u,h,f)=>{const p=this.br(x.fromSegments(h.prefixPath.concat(h.collectionGroup,h.documentId)),h);i=i.insert(p.key,p),i.size===s&&f.done()})).next((()=>i))}newChangeBuffer(e){return new eE(this,!!e&&e.trackRemovals)}getSize(e){return this.getMetadata(e).next((t=>t.byteSize))}getMetadata(e){return ch(e).get(ha).next((t=>(F(!!t,20021),t)))}Sr(e,t){return ch(e).put(ha,t)}br(e,t){if(t){const n=UT(this.serializer,t);if(!(n.isNoDocument()&&n.version.isEqual(U.min())))return n}return ue.newInvalidDocument(e)}}function im(r){return new ZT(r)}class eE extends sm{constructor(e,t){super(),this.Mr=e,this.trackRemovals=t,this.Or=new ft((n=>n.toString()),((n,s)=>n.isEqual(s)))}applyChanges(e){const t=[];let n=0,s=new Z(((i,o)=>j(i.canonicalString(),o.canonicalString())));return this.changes.forEach(((i,o)=>{const c=this.Or.get(i);if(t.push(this.Mr.removeEntry(e,i,c.readTime)),o.isValidDocument()){const u=Kl(this.Mr.serializer,o);s=s.add(i.path.popLast());const h=Ni(u);n+=h-c.size,t.push(this.Mr.addEntry(e,i,u))}else if(n-=c.size,this.trackRemovals){const u=Kl(this.Mr.serializer,o.convertToNoDocument(U.min()));t.push(this.Mr.addEntry(e,i,u))}})),s.forEach((i=>{t.push(this.Mr.indexManager.addToCollectionParentIndex(e,i))})),t.push(this.Mr.updateMetadata(e,n)),v.waitFor(t)}getFromCache(e,t){return this.Mr.Dr(e,t).next((n=>(this.Or.set(t,{size:n.size,readTime:n.document.readTime}),n.document)))}getAllFromCache(e,t){return this.Mr.vr(e,t).next((({documents:n,Fr:s})=>(s.forEach(((i,o)=>{this.Or.set(i,{size:o,readTime:n.get(i).readTime})})),n)))}}function ch(r){return _e(r,os)}function Zt(r){return _e(r,vi)}function Mr(r){const e=r.path.toArray();return[e.slice(0,e.length-2),e[e.length-2],e[e.length-1]]}function uh(r,e){const t=e.documentKey.path.toArray();return[r,Di(e.readTime),t.slice(0,t.length-2),t.length>0?t[t.length-1]:""]}function lh(r,e){const t=r.path.toArray(),n=e.path.toArray();let s=0;for(let i=0;i<t.length-2&&i<n.length-2;++i)if(s=j(t[i],n[i]),s)return s;return s=j(t.length,n.length),s||(s=j(t[t.length-2],n[n.length-2]),s||j(t[t.length-1],n[n.length-1]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tE{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class om{constructor(e,t,n,s){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=n,this.indexManager=s}getDocument(e,t){let n=null;return this.documentOverlayCache.getOverlay(e,t).next((s=>(n=s,this.remoteDocumentCache.getEntry(e,t)))).next((s=>(n!==null&&Xr(n.mutation,s,ke.empty(),X.now()),s)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((n=>this.getLocalViewOfDocuments(e,n,K()).next((()=>n))))}getLocalViewOfDocuments(e,t,n=K()){const s=Je();return this.populateOverlays(e,s,t).next((()=>this.computeViews(e,t,s,n).next((i=>{let o=Br();return i.forEach(((c,u)=>{o=o.insert(c,u.overlayedDocument)})),o}))))}getOverlayedDocuments(e,t){const n=Je();return this.populateOverlays(e,n,t).next((()=>this.computeViews(e,t,n,K())))}populateOverlays(e,t,n){const s=[];return n.forEach((i=>{t.has(i)||s.push(i)})),this.documentOverlayCache.getOverlays(e,s).next((i=>{i.forEach(((o,c)=>{t.set(o,c)}))}))}computeViews(e,t,n,s){let i=Me();const o=Yr(),c=(function(){return Yr()})();return t.forEach(((u,h)=>{const f=n.get(h.key);s.has(h.key)&&(f===void 0||f.mutation instanceof mt)?i=i.insert(h.key,h):f!==void 0?(o.set(h.key,f.mutation.getFieldMask()),Xr(f.mutation,h,f.mutation.getFieldMask(),X.now())):o.set(h.key,ke.empty())})),this.recalculateAndSaveOverlays(e,i).next((u=>(u.forEach(((h,f)=>o.set(h,f))),t.forEach(((h,f)=>c.set(h,new tE(f,o.get(h)??null)))),c)))}recalculateAndSaveOverlays(e,t){const n=Yr();let s=new re(((o,c)=>o-c)),i=K();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((o=>{for(const c of o)c.keys().forEach((u=>{const h=t.get(u);if(h===null)return;let f=n.get(u)||ke.empty();f=c.applyToLocalView(h,f),n.set(u,f);const p=(s.get(c.batchId)||K()).add(u);s=s.insert(c.batchId,p)}))})).next((()=>{const o=[],c=s.getReverseIterator();for(;c.hasNext();){const u=c.getNext(),h=u.key,f=u.value,p=Ef();f.forEach((E=>{if(!i.has(E)){const b=Pf(t.get(E),n.get(E));b!==null&&p.set(E,b),i=i.add(E)}})),o.push(this.documentOverlayCache.saveOverlays(e,h,p))}return v.waitFor(o)})).next((()=>n))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((n=>this.recalculateAndSaveOverlays(e,n)))}getDocumentsMatchingQuery(e,t,n,s){return aT(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):cT(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,n,s):this.getDocumentsMatchingCollectionQuery(e,t,n,s)}getNextDocuments(e,t,n,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,n,s).next((i=>{const o=s-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,n.largestBatchId,s-i.size):v.resolve(Je());let c=Kn,u=i;return o.next((h=>v.forEach(h,((f,p)=>(c<p.largestBatchId&&(c=p.largestBatchId),i.get(f)?v.resolve():this.remoteDocumentCache.getEntry(e,f).next((E=>{u=u.insert(f,E)}))))).next((()=>this.populateOverlays(e,h,i))).next((()=>this.computeViews(e,u,h,K()))).next((f=>({batchId:c,changes:Tf(f)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new x(t)).next((n=>{let s=Br();return n.isFoundDocument()&&(s=s.insert(n.key,n)),s}))}getDocumentsMatchingCollectionGroupQuery(e,t,n,s){const i=t.collectionGroup;let o=Br();return this.indexManager.getCollectionParents(e,i).next((c=>v.forEach(c,(u=>{const h=(function(p,E){return new Xi(E,null,p.explicitOrderBy.slice(),p.filters.slice(),p.limit,p.limitType,p.startAt,p.endAt)})(t,u.child(i));return this.getDocumentsMatchingCollectionQuery(e,h,n,s).next((f=>{f.forEach(((p,E)=>{o=o.insert(p,E)}))}))})).next((()=>o))))}getDocumentsMatchingCollectionQuery(e,t,n,s){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,n.largestBatchId).next((o=>(i=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,n,i,s)))).next((o=>{i.forEach(((u,h)=>{const f=h.getKey();o.get(f)===null&&(o=o.insert(f,ue.newInvalidDocument(f)))}));let c=Br();return o.forEach(((u,h)=>{const f=i.get(u);f!==void 0&&Xr(f.mutation,h,ke.empty(),X.now()),As(t,h)&&(c=c.insert(u,h))})),c}))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nE{constructor(e){this.serializer=e,this.Nr=new Map,this.Br=new Map}getBundleMetadata(e,t){return v.resolve(this.Nr.get(t))}saveBundleMetadata(e,t){return this.Nr.set(t.id,(function(s){return{id:s.id,version:s.version,createTime:Ce(s.createTime)}})(t)),v.resolve()}getNamedQuery(e,t){return v.resolve(this.Br.get(t))}saveNamedQuery(e,t){return this.Br.set(t.name,(function(s){return{name:s.name,query:Wf(s.bundledQuery),readTime:Ce(s.readTime)}})(t)),v.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rE{constructor(){this.overlays=new re(x.comparator),this.Lr=new Map}getOverlay(e,t){return v.resolve(this.overlays.get(t))}getOverlays(e,t){const n=Je();return v.forEach(t,(s=>this.getOverlay(e,s).next((i=>{i!==null&&n.set(s,i)})))).next((()=>n))}saveOverlays(e,t,n){return n.forEach(((s,i)=>{this.St(e,t,i)})),v.resolve()}removeOverlaysForBatchId(e,t,n){const s=this.Lr.get(n);return s!==void 0&&(s.forEach((i=>this.overlays=this.overlays.remove(i))),this.Lr.delete(n)),v.resolve()}getOverlaysForCollection(e,t,n){const s=Je(),i=t.length+1,o=new x(t.child("")),c=this.overlays.getIteratorFrom(o);for(;c.hasNext();){const u=c.getNext().value,h=u.getKey();if(!t.isPrefixOf(h.path))break;h.path.length===i&&u.largestBatchId>n&&s.set(u.getKey(),u)}return v.resolve(s)}getOverlaysForCollectionGroup(e,t,n,s){let i=new re(((h,f)=>h-f));const o=this.overlays.getIterator();for(;o.hasNext();){const h=o.getNext().value;if(h.getKey().getCollectionGroup()===t&&h.largestBatchId>n){let f=i.get(h.largestBatchId);f===null&&(f=Je(),i=i.insert(h.largestBatchId,f)),f.set(h.getKey(),h)}}const c=Je(),u=i.getIterator();for(;u.hasNext()&&(u.getNext().value.forEach(((h,f)=>c.set(h,f))),!(c.size()>=s)););return v.resolve(c)}St(e,t,n){const s=this.overlays.get(n.key);if(s!==null){const o=this.Lr.get(s.largestBatchId).delete(n.key);this.Lr.set(s.largestBatchId,o)}this.overlays=this.overlays.insert(n.key,new hc(t,n));let i=this.Lr.get(t);i===void 0&&(i=K(),this.Lr.set(t,i)),this.Lr.set(t,i.add(n.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sE{constructor(){this.sessionToken=he.EMPTY_BYTE_STRING}getSessionToken(e){return v.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,v.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gc{constructor(){this.kr=new Z(Ie.Kr),this.qr=new Z(Ie.Ur)}isEmpty(){return this.kr.isEmpty()}addReference(e,t){const n=new Ie(e,t);this.kr=this.kr.add(n),this.qr=this.qr.add(n)}$r(e,t){e.forEach((n=>this.addReference(n,t)))}removeReference(e,t){this.Wr(new Ie(e,t))}Qr(e,t){e.forEach((n=>this.removeReference(n,t)))}Gr(e){const t=new x(new ee([])),n=new Ie(t,e),s=new Ie(t,e+1),i=[];return this.qr.forEachInRange([n,s],(o=>{this.Wr(o),i.push(o.key)})),i}zr(){this.kr.forEach((e=>this.Wr(e)))}Wr(e){this.kr=this.kr.delete(e),this.qr=this.qr.delete(e)}jr(e){const t=new x(new ee([])),n=new Ie(t,e),s=new Ie(t,e+1);let i=K();return this.qr.forEachInRange([n,s],(o=>{i=i.add(o.key)})),i}containsKey(e){const t=new Ie(e,0),n=this.kr.firstAfterOrEqual(t);return n!==null&&e.isEqual(n.key)}}class Ie{constructor(e,t){this.key=e,this.Jr=t}static Kr(e,t){return x.comparator(e.key,t.key)||j(e.Jr,t.Jr)}static Ur(e,t){return j(e.Jr,t.Jr)||x.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iE{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Yn=1,this.Hr=new Z(Ie.Kr)}checkEmpty(e){return v.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,n,s){const i=this.Yn;this.Yn++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new uc(i,t,n,s);this.mutationQueue.push(o);for(const c of s)this.Hr=this.Hr.add(new Ie(c.key,i)),this.indexManager.addToCollectionParentIndex(e,c.key.path.popLast());return v.resolve(o)}lookupMutationBatch(e,t){return v.resolve(this.Zr(t))}getNextMutationBatchAfterBatchId(e,t){const n=t+1,s=this.Xr(n),i=s<0?0:s;return v.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return v.resolve(this.mutationQueue.length===0?un:this.Yn-1)}getAllMutationBatches(e){return v.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const n=new Ie(t,0),s=new Ie(t,Number.POSITIVE_INFINITY),i=[];return this.Hr.forEachInRange([n,s],(o=>{const c=this.Zr(o.Jr);i.push(c)})),v.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new Z(j);return t.forEach((s=>{const i=new Ie(s,0),o=new Ie(s,Number.POSITIVE_INFINITY);this.Hr.forEachInRange([i,o],(c=>{n=n.add(c.Jr)}))})),v.resolve(this.Yr(n))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,s=n.length+1;let i=n;x.isDocumentKey(i)||(i=i.child(""));const o=new Ie(new x(i),0);let c=new Z(j);return this.Hr.forEachWhile((u=>{const h=u.key.path;return!!n.isPrefixOf(h)&&(h.length===s&&(c=c.add(u.Jr)),!0)}),o),v.resolve(this.Yr(c))}Yr(e){const t=[];return e.forEach((n=>{const s=this.Zr(n);s!==null&&t.push(s)})),t}removeMutationBatch(e,t){F(this.ei(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let n=this.Hr;return v.forEach(t.mutations,(s=>{const i=new Ie(s.key,t.batchId);return n=n.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)})).next((()=>{this.Hr=n}))}nr(e){}containsKey(e,t){const n=new Ie(t,0),s=this.Hr.firstAfterOrEqual(n);return v.resolve(t.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,v.resolve()}ei(e,t){return this.Xr(e)}Xr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Zr(e){const t=this.Xr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oE{constructor(e){this.ti=e,this.docs=(function(){return new re(x.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const n=t.key,s=this.docs.get(n),i=s?s.size:0,o=this.ti(t);return this.docs=this.docs.insert(n,{document:t.mutableCopy(),size:o}),this.size+=o-i,this.indexManager.addToCollectionParentIndex(e,n.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const n=this.docs.get(t);return v.resolve(n?n.document.mutableCopy():ue.newInvalidDocument(t))}getEntries(e,t){let n=Me();return t.forEach((s=>{const i=this.docs.get(s);n=n.insert(s,i?i.document.mutableCopy():ue.newInvalidDocument(s))})),v.resolve(n)}getDocumentsMatchingQuery(e,t,n,s){let i=Me();const o=t.path,c=new x(o.child("__id-9223372036854775808__")),u=this.docs.getIteratorFrom(c);for(;u.hasNext();){const{key:h,value:{document:f}}=u.getNext();if(!o.isPrefixOf(h.path))break;h.path.length>o.length+1||Wa(Md(f),n)<=0||(s.has(f.key)||As(t,f))&&(i=i.insert(f.key,f.mutableCopy()))}return v.resolve(i)}getAllFromCollectionGroup(e,t,n,s){M(9500)}ni(e,t){return v.forEach(this.docs,(n=>t(n)))}newChangeBuffer(e){return new aE(this)}getSize(e){return v.resolve(this.size)}}class aE extends sm{constructor(e){super(),this.Mr=e}applyChanges(e){const t=[];return this.changes.forEach(((n,s)=>{s.isValidDocument()?t.push(this.Mr.addEntry(e,s)):this.Mr.removeEntry(n)})),v.waitFor(t)}getFromCache(e,t){return this.Mr.getEntry(e,t)}getAllFromCache(e,t){return this.Mr.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cE{constructor(e){this.persistence=e,this.ri=new ft((t=>_n(t)),vs),this.lastRemoteSnapshotVersion=U.min(),this.highestTargetId=0,this.ii=0,this.si=new gc,this.targetCount=0,this.oi=ht._r()}forEachTarget(e,t){return this.ri.forEach(((n,s)=>t(s))),v.resolve()}getLastRemoteSnapshotVersion(e){return v.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return v.resolve(this.ii)}allocateTargetId(e){return this.highestTargetId=this.oi.next(),v.resolve(this.highestTargetId)}setTargetsMetadata(e,t,n){return n&&(this.lastRemoteSnapshotVersion=n),t>this.ii&&(this.ii=t),v.resolve()}lr(e){this.ri.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.oi=new ht(t),this.highestTargetId=t),e.sequenceNumber>this.ii&&(this.ii=e.sequenceNumber)}addTargetData(e,t){return this.lr(t),this.targetCount+=1,v.resolve()}updateTargetData(e,t){return this.lr(t),v.resolve()}removeTargetData(e,t){return this.ri.delete(t.target),this.si.Gr(t.targetId),this.targetCount-=1,v.resolve()}removeTargets(e,t,n){let s=0;const i=[];return this.ri.forEach(((o,c)=>{c.sequenceNumber<=t&&n.get(c.targetId)===null&&(this.ri.delete(o),i.push(this.removeMatchingKeysForTargetId(e,c.targetId)),s++)})),v.waitFor(i).next((()=>s))}getTargetCount(e){return v.resolve(this.targetCount)}getTargetData(e,t){const n=this.ri.get(t)||null;return v.resolve(n)}addMatchingKeys(e,t,n){return this.si.$r(t,n),v.resolve()}removeMatchingKeys(e,t,n){this.si.Qr(t,n);const s=this.persistence.referenceDelegate,i=[];return s&&t.forEach((o=>{i.push(s.markPotentiallyOrphaned(e,o))})),v.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this.si.Gr(t),v.resolve()}getMatchingKeysForTargetId(e,t){const n=this.si.jr(t);return v.resolve(n)}containsKey(e,t){return v.resolve(this.si.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _c{constructor(e,t){this._i={},this.overlays={},this.ai=new De(0),this.ui=!1,this.ui=!0,this.ci=new sE,this.referenceDelegate=e(this),this.li=new cE(this),this.indexManager=new HT,this.remoteDocumentCache=(function(s){return new oE(s)})((n=>this.referenceDelegate.hi(n))),this.serializer=new Gf(t),this.Pi=new nE(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.ui=!1,Promise.resolve()}get started(){return this.ui}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new rE,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let n=this._i[e.toKey()];return n||(n=new iE(t,this.referenceDelegate),this._i[e.toKey()]=n),n}getGlobalsCache(){return this.ci}getTargetCache(){return this.li}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Pi}runTransaction(e,t,n){C("MemoryPersistence","Starting transaction:",e);const s=new uE(this.ai.next());return this.referenceDelegate.Ti(),n(s).next((i=>this.referenceDelegate.Ii(s).next((()=>i)))).toPromise().then((i=>(s.raiseOnCommittedEvent(),i)))}Ei(e,t){return v.or(Object.values(this._i).map((n=>()=>n.containsKey(e,t))))}}class uE extends Fd{constructor(e){super(),this.currentSequenceNumber=e}}class io{constructor(e){this.persistence=e,this.Ri=new gc,this.Ai=null}static Vi(e){return new io(e)}get di(){if(this.Ai)return this.Ai;throw M(60996)}addReference(e,t,n){return this.Ri.addReference(n,t),this.di.delete(n.toString()),v.resolve()}removeReference(e,t,n){return this.Ri.removeReference(n,t),this.di.add(n.toString()),v.resolve()}markPotentiallyOrphaned(e,t){return this.di.add(t.toString()),v.resolve()}removeTarget(e,t){this.Ri.Gr(t.targetId).forEach((s=>this.di.add(s.toString())));const n=this.persistence.getTargetCache();return n.getMatchingKeysForTargetId(e,t.targetId).next((s=>{s.forEach((i=>this.di.add(i.toString())))})).next((()=>n.removeTargetData(e,t)))}Ti(){this.Ai=new Set}Ii(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return v.forEach(this.di,(n=>{const s=x.fromPath(n);return this.mi(e,s).next((i=>{i||t.removeEntry(s,U.min())}))})).next((()=>(this.Ai=null,t.apply(e))))}updateLimboDocument(e,t){return this.mi(e,t).next((n=>{n?this.di.delete(t.toString()):this.di.add(t.toString())}))}hi(e){return 0}mi(e,t){return v.or([()=>v.resolve(this.Ri.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ei(e,t)])}}class xi{constructor(e,t){this.persistence=e,this.fi=new ft((n=>Re(n.path)),((n,s)=>n.isEqual(s))),this.garbageCollector=rm(this,t)}static Vi(e,t){return new xi(e,t)}Ti(){}Ii(e){return v.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}dr(e){const t=this.pr(e);return this.persistence.getTargetCache().getTargetCount(e).next((n=>t.next((s=>n+s))))}pr(e){let t=0;return this.mr(e,(n=>{t++})).next((()=>t))}mr(e,t){return v.forEach(this.fi,((n,s)=>this.wr(e,n,s).next((i=>i?v.resolve():t(s)))))}removeTargets(e,t,n){return this.persistence.getTargetCache().removeTargets(e,t,n)}removeOrphanedDocuments(e,t){let n=0;const s=this.persistence.getRemoteDocumentCache(),i=s.newChangeBuffer();return s.ni(e,(o=>this.wr(e,o,t).next((c=>{c||(n++,i.removeEntry(o,U.min()))})))).next((()=>i.apply(e))).next((()=>n))}markPotentiallyOrphaned(e,t){return this.fi.set(t,e.currentSequenceNumber),v.resolve()}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,n)}addReference(e,t,n){return this.fi.set(n,e.currentSequenceNumber),v.resolve()}removeReference(e,t,n){return this.fi.set(n,e.currentSequenceNumber),v.resolve()}updateLimboDocument(e,t){return this.fi.set(t,e.currentSequenceNumber),v.resolve()}hi(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=oi(e.data.value)),t}wr(e,t,n){return v.or([()=>this.persistence.Ei(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const s=this.fi.get(t);return v.resolve(s!==void 0&&s>n)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lE{constructor(e){this.serializer=e}k(e,t,n,s){const i=new Ki("createOrUpgrade",t);n<1&&s>=1&&((function(u){u.createObjectStore(ws)})(e),(function(u){u.createObjectStore(is,{keyPath:vI}),u.createObjectStore(je,{keyPath:El,autoIncrement:!0}).createIndex(cn,wl,{unique:!0}),u.createObjectStore(Gn)})(e),hh(e),(function(u){u.createObjectStore(nn)})(e));let o=v.resolve();return n<3&&s>=3&&(n!==0&&((function(u){u.deleteObjectStore(Wn),u.deleteObjectStore(Hn),u.deleteObjectStore(ln)})(e),hh(e)),o=o.next((()=>(function(u){const h=u.store(ln),f={highestTargetId:0,highestListenSequenceNumber:0,lastRemoteSnapshotVersion:U.min().toTimestamp(),targetCount:0};return h.put(Ai,f)})(i)))),n<4&&s>=4&&(n!==0&&(o=o.next((()=>(function(u,h){return h.store(je).J().next((p=>{u.deleteObjectStore(je),u.createObjectStore(je,{keyPath:El,autoIncrement:!0}).createIndex(cn,wl,{unique:!0});const E=h.store(je),b=p.map((V=>E.put(V)));return v.waitFor(b)}))})(e,i)))),o=o.next((()=>{(function(u){u.createObjectStore(Qn,{keyPath:kI})})(e)}))),n<5&&s>=5&&(o=o.next((()=>this.gi(i)))),n<6&&s>=6&&(o=o.next((()=>((function(u){u.createObjectStore(os)})(e),this.pi(i))))),n<7&&s>=7&&(o=o.next((()=>this.yi(i)))),n<8&&s>=8&&(o=o.next((()=>this.wi(e,i)))),n<9&&s>=9&&(o=o.next((()=>{(function(u){u.objectStoreNames.contains("remoteDocumentChanges")&&u.deleteObjectStore("remoteDocumentChanges")})(e)}))),n<10&&s>=10&&(o=o.next((()=>this.Si(i)))),n<11&&s>=11&&(o=o.next((()=>{(function(u){u.createObjectStore(Hi,{keyPath:NI})})(e),(function(u){u.createObjectStore(Wi,{keyPath:xI})})(e)}))),n<12&&s>=12&&(o=o.next((()=>{(function(u){const h=u.createObjectStore(Qi,{keyPath:jI});h.createIndex(fa,qI,{unique:!1}),h.createIndex(Gd,zI,{unique:!1})})(e)}))),n<13&&s>=13&&(o=o.next((()=>(function(u){const h=u.createObjectStore(vi,{keyPath:SI});h.createIndex(si,RI),h.createIndex(qd,bI)})(e))).next((()=>this.bi(e,i))).next((()=>e.deleteObjectStore(nn)))),n<14&&s>=14&&(o=o.next((()=>this.Di(e,i)))),n<15&&s>=15&&(o=o.next((()=>(function(u){u.createObjectStore(Ya,{keyPath:OI,autoIncrement:!0}).createIndex(da,MI,{unique:!1}),u.createObjectStore(Hr,{keyPath:LI}).createIndex($d,FI,{unique:!1}),u.createObjectStore(Wr,{keyPath:UI}).createIndex(Kd,BI,{unique:!1})})(e)))),n<16&&s>=16&&(o=o.next((()=>{t.objectStore(Hr).clear()})).next((()=>{t.objectStore(Wr).clear()}))),n<17&&s>=17&&(o=o.next((()=>{(function(u){u.createObjectStore(Xa,{keyPath:$I})})(e)}))),n<18&&s>=18&&jh()&&(o=o.next((()=>{t.objectStore(Hr).clear()})).next((()=>{t.objectStore(Wr).clear()}))),o}pi(e){let t=0;return e.store(nn).ee(((n,s)=>{t+=Ni(s)})).next((()=>{const n={byteSize:t};return e.store(os).put(ha,n)}))}gi(e){const t=e.store(is),n=e.store(je);return t.J().next((s=>v.forEach(s,(i=>{const o=IDBKeyRange.bound([i.userId,un],[i.userId,i.lastAcknowledgedBatchId]);return n.J(cn,o).next((c=>v.forEach(c,(u=>{F(u.userId===i.userId,18650,"Cannot process batch from unexpected user",{batchId:u.batchId});const h=sn(this.serializer,u);return Xf(e,i.userId,h).next((()=>{}))}))))}))))}yi(e){const t=e.store(Wn),n=e.store(nn);return e.store(ln).get(Ai).next((s=>{const i=[];return n.ee(((o,c)=>{const u=new ee(o),h=(function(p){return[0,Re(p)]})(u);i.push(t.get(h).next((f=>f?v.resolve():(p=>t.put({targetId:0,path:Re(p),sequenceNumber:s.highestListenSequenceNumber}))(u))))})).next((()=>v.waitFor(i)))}))}wi(e,t){e.createObjectStore(as,{keyPath:DI});const n=t.store(as),s=new pc,i=o=>{if(s.add(o)){const c=o.lastSegment(),u=o.popLast();return n.put({collectionId:c,parent:Re(u)})}};return t.store(nn).ee({Y:!0},((o,c)=>{const u=new ee(o);return i(u.popLast())})).next((()=>t.store(Gn).ee({Y:!0},(([o,c,u],h)=>{const f=Qe(c);return i(f.popLast())}))))}Si(e){const t=e.store(Hn);return t.ee(((n,s)=>{const i=qr(s),o=Hf(this.serializer,i);return t.put(o)}))}bi(e,t){const n=t.store(nn),s=[];return n.ee(((i,o)=>{const c=t.store(vi),u=(function(p){return p.document?new x(ee.fromString(p.document.name).popFirst(5)):p.noDocument?x.fromSegments(p.noDocument.path):p.unknownDocument?x.fromSegments(p.unknownDocument.path):M(36783)})(o).path.toArray(),h={prefixPath:u.slice(0,u.length-2),collectionGroup:u[u.length-2],documentId:u[u.length-1],readTime:o.readTime||[0,0],unknownDocument:o.unknownDocument,noDocument:o.noDocument,document:o.document,hasCommittedMutations:!!o.hasCommittedMutations};s.push(c.put(h))})).next((()=>v.waitFor(s)))}Di(e,t){const n=t.store(je),s=im(this.serializer),i=new _c(io.Vi,this.serializer.yt);return n.J().next((o=>{const c=new Map;return o.forEach((u=>{let h=c.get(u.userId)??K();sn(this.serializer,u).keys().forEach((f=>h=h.add(f))),c.set(u.userId,h)})),v.forEach(c,((u,h)=>{const f=new ve(h),p=ro.wt(this.serializer,f),E=i.getIndexManager(f),b=so.wt(f,this.serializer,E,i.referenceDelegate);return new om(s,b,p,E).recalculateAndSaveOverlaysForDocumentKeys(new ma(t,De.ce),u).next()}))}))}}function hh(r){r.createObjectStore(Wn,{keyPath:CI}).createIndex(Ja,VI,{unique:!0}),r.createObjectStore(Hn,{keyPath:"targetId"}).createIndex(zd,PI,{unique:!0}),r.createObjectStore(ln)}const At="IndexedDbPersistence",Ho=18e5,Wo=5e3,Qo="Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.",hE="main";class yc{constructor(e,t,n,s,i,o,c,u,h,f,p=18){if(this.allowTabSynchronization=e,this.persistenceKey=t,this.clientId=n,this.Ci=i,this.window=o,this.document=c,this.Fi=h,this.Mi=f,this.xi=p,this.ai=null,this.ui=!1,this.isPrimary=!1,this.networkEnabled=!0,this.Oi=null,this.inForeground=!1,this.Ni=null,this.Bi=null,this.Li=Number.NEGATIVE_INFINITY,this.ki=E=>Promise.resolve(),!yc.v())throw new O(P.UNIMPLEMENTED,"This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");this.referenceDelegate=new XT(this,s),this.Ki=t+hE,this.serializer=new Gf(u),this.qi=new Mt(this.Ki,this.xi,new lE(this.serializer)),this.ci=new jT,this.li=new QT(this.referenceDelegate,this.serializer),this.remoteDocumentCache=im(this.serializer),this.Pi=new BT,this.window&&this.window.localStorage?this.Ui=this.window.localStorage:(this.Ui=null,f===!1&&le(At,"LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."))}start(){return this.$i().then((()=>{if(!this.isPrimary&&!this.allowTabSynchronization)throw new O(P.FAILED_PRECONDITION,Qo);return this.Wi(),this.Qi(),this.Gi(),this.runTransaction("getHighestListenSequenceNumber","readonly",(e=>this.li.getHighestSequenceNumber(e)))})).then((e=>{this.ai=new De(e,this.Fi)})).then((()=>{this.ui=!0})).catch((e=>(this.qi&&this.qi.close(),Promise.reject(e))))}zi(e){return this.ki=async t=>{if(this.started)return e(t)},e(this.isPrimary)}setDatabaseDeletedListener(e){this.qi.q((async t=>{t.newVersion===null&&await e()}))}setNetworkEnabled(e){this.networkEnabled!==e&&(this.networkEnabled=e,this.Ci.enqueueAndForget((async()=>{this.started&&await this.$i()})))}$i(){return this.runTransaction("updateClientMetadataAndTryBecomePrimary","readwrite",(e=>Qs(e).put({clientId:this.clientId,updateTimeMs:Date.now(),networkEnabled:this.networkEnabled,inForeground:this.inForeground}).next((()=>{if(this.isPrimary)return this.ji(e).next((t=>{t||(this.isPrimary=!1,this.Ci.enqueueRetryable((()=>this.ki(!1))))}))})).next((()=>this.Ji(e))).next((t=>this.isPrimary&&!t?this.Hi(e).next((()=>!1)):!!t&&this.Zi(e).next((()=>!0)))))).catch((e=>{if($t(e))return C(At,"Failed to extend owner lease: ",e),this.isPrimary;if(!this.allowTabSynchronization)throw e;return C(At,"Releasing owner lease after error during lease refresh",e),!1})).then((e=>{this.isPrimary!==e&&this.Ci.enqueueRetryable((()=>this.ki(e))),this.isPrimary=e}))}ji(e){return Lr(e).get(An).next((t=>v.resolve(this.Xi(t))))}Yi(e){return Qs(e).delete(this.clientId)}async es(){if(this.isPrimary&&!this.ts(this.Li,Ho)){this.Li=Date.now();const e=await this.runTransaction("maybeGarbageCollectMultiClientState","readwrite-primary",(t=>{const n=_e(t,Qn);return n.J().next((s=>{const i=this.ns(s,Ho),o=s.filter((c=>i.indexOf(c)===-1));return v.forEach(o,(c=>n.delete(c.clientId))).next((()=>o))}))})).catch((()=>[]));if(this.Ui)for(const t of e)this.Ui.removeItem(this.rs(t.clientId))}}Gi(){this.Bi=this.Ci.enqueueAfterDelay("client_metadata_refresh",4e3,(()=>this.$i().then((()=>this.es())).then((()=>this.Gi()))))}Xi(e){return!!e&&e.ownerId===this.clientId}Ji(e){return this.Mi?v.resolve(!0):Lr(e).get(An).next((t=>{if(t!==null&&this.ts(t.leaseTimestampMs,Wo)&&!this.ss(t.ownerId)){if(this.Xi(t)&&this.networkEnabled)return!0;if(!this.Xi(t)){if(!t.allowTabSynchronization)throw new O(P.FAILED_PRECONDITION,Qo);return!1}}return!(!this.networkEnabled||!this.inForeground)||Qs(e).J().next((n=>this.ns(n,Wo).find((s=>{if(this.clientId!==s.clientId){const i=!this.networkEnabled&&s.networkEnabled,o=!this.inForeground&&s.inForeground,c=this.networkEnabled===s.networkEnabled;if(i||o&&c)return!0}return!1}))===void 0))})).next((t=>(this.isPrimary!==t&&C(At,`Client ${t?"is":"is not"} eligible for a primary lease.`),t)))}async shutdown(){this.ui=!1,this._s(),this.Bi&&(this.Bi.cancel(),this.Bi=null),this.us(),this.cs(),await this.qi.runTransaction("shutdown","readwrite",[ws,Qn],(e=>{const t=new ma(e,De.ce);return this.Hi(t).next((()=>this.Yi(t)))})),this.qi.close(),this.ls()}ns(e,t){return e.filter((n=>this.ts(n.updateTimeMs,t)&&!this.ss(n.clientId)))}hs(){return this.runTransaction("getActiveClients","readonly",(e=>Qs(e).J().next((t=>this.ns(t,Ho).map((n=>n.clientId))))))}get started(){return this.ui}getGlobalsCache(){return this.ci}getMutationQueue(e,t){return so.wt(e,this.serializer,t,this.referenceDelegate)}getTargetCache(){return this.li}getRemoteDocumentCache(){return this.remoteDocumentCache}getIndexManager(e){return new WT(e,this.serializer.yt.databaseId)}getDocumentOverlayCache(e){return ro.wt(this.serializer,e)}getBundleCache(){return this.Pi}runTransaction(e,t,n){C(At,"Starting transaction:",e);const s=t==="readonly"?"readonly":"readwrite",i=(function(u){return u===18?HI:u===17?Jd:u===16?GI:u===15?Za:u===14?Qd:u===13?Wd:u===12?KI:u===11?Hd:void M(60245)})(this.xi);let o;return this.qi.runTransaction(e,s,i,(c=>(o=new ma(c,this.ai?this.ai.next():De.ce),t==="readwrite-primary"?this.ji(o).next((u=>!!u||this.Ji(o))).next((u=>{if(!u)throw le(`Failed to obtain primary lease for action '${e}'.`),this.isPrimary=!1,this.Ci.enqueueRetryable((()=>this.ki(!1))),new O(P.FAILED_PRECONDITION,Ld);return n(o)})).next((u=>this.Zi(o).next((()=>u)))):this.Ps(o).next((()=>n(o)))))).then((c=>(o.raiseOnCommittedEvent(),c)))}Ps(e){return Lr(e).get(An).next((t=>{if(t!==null&&this.ts(t.leaseTimestampMs,Wo)&&!this.ss(t.ownerId)&&!this.Xi(t)&&!(this.Mi||this.allowTabSynchronization&&t.allowTabSynchronization))throw new O(P.FAILED_PRECONDITION,Qo)}))}Zi(e){const t={ownerId:this.clientId,allowTabSynchronization:this.allowTabSynchronization,leaseTimestampMs:Date.now()};return Lr(e).put(An,t)}static v(){return Mt.v()}Hi(e){const t=Lr(e);return t.get(An).next((n=>this.Xi(n)?(C(At,"Releasing primary lease."),t.delete(An)):v.resolve()))}ts(e,t){const n=Date.now();return!(e<n-t)&&(!(e>n)||(le(`Detected an update time that is in the future: ${e} > ${n}`),!1))}Wi(){this.document!==null&&typeof this.document.addEventListener=="function"&&(this.Ni=()=>{this.Ci.enqueueAndForget((()=>(this.inForeground=this.document.visibilityState==="visible",this.$i())))},this.document.addEventListener("visibilitychange",this.Ni),this.inForeground=this.document.visibilityState==="visible")}us(){this.Ni&&(this.document.removeEventListener("visibilitychange",this.Ni),this.Ni=null)}Qi(){var e;typeof((e=this.window)==null?void 0:e.addEventListener)=="function"&&(this.Oi=()=>{this._s();const t=/(?:Version|Mobile)\/1[456]/;Bh()&&(navigator.appVersion.match(t)||navigator.userAgent.match(t))&&this.Ci.enterRestrictedMode(!0),this.Ci.enqueueAndForget((()=>this.shutdown()))},this.window.addEventListener("pagehide",this.Oi))}cs(){this.Oi&&(this.window.removeEventListener("pagehide",this.Oi),this.Oi=null)}ss(e){var t;try{const n=((t=this.Ui)==null?void 0:t.getItem(this.rs(e)))!==null;return C(At,`Client '${e}' ${n?"is":"is not"} zombied in LocalStorage`),n}catch(n){return le(At,"Failed to get zombied client id.",n),!1}}_s(){if(this.Ui)try{this.Ui.setItem(this.rs(this.clientId),String(Date.now()))}catch(e){le("Failed to set zombie client id.",e)}}ls(){if(this.Ui)try{this.Ui.removeItem(this.rs(this.clientId))}catch{}}rs(e){return`firestore_zombie_${this.persistenceKey}_${e}`}}function Lr(r){return _e(r,ws)}function Qs(r){return _e(r,Qn)}function am(r,e){let t=r.projectId;return r.isDefaultDatabase||(t+="."+r.database),"firestore/"+e+"/"+t+"/"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ic{constructor(e,t,n,s){this.targetId=e,this.fromCache=t,this.Ts=n,this.Is=s}static Es(e,t){let n=K(),s=K();for(const i of t.docChanges)switch(i.type){case 0:n=n.add(i.doc.key);break;case 1:s=s.add(i.doc.key)}return new Ic(e,t.fromCache,n,s)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dE{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cm{constructor(){this.Rs=!1,this.As=!1,this.Vs=100,this.ds=(function(){return Bh()?8:Ud(ge())>0?6:4})()}initialize(e,t){this.fs=e,this.indexManager=t,this.Rs=!0}getDocumentsMatchingQuery(e,t,n,s){const i={result:null};return this.gs(e,t).next((o=>{i.result=o})).next((()=>{if(!i.result)return this.ps(e,t,s,n).next((o=>{i.result=o}))})).next((()=>{if(i.result)return;const o=new dE;return this.ys(e,t,o).next((c=>{if(i.result=c,this.As)return this.ws(e,t,o,c.size)}))})).next((()=>i.result))}ws(e,t,n,s){return n.documentReadCount<this.Vs?(Vn()<=H.DEBUG&&C("QueryEngine","SDK will not create cache indexes for query:",Dn(t),"since it only creates cache indexes for collection contains","more than or equal to",this.Vs,"documents"),v.resolve()):(Vn()<=H.DEBUG&&C("QueryEngine","Query:",Dn(t),"scans",n.documentReadCount,"local documents and returns",s,"documents as results."),n.documentReadCount>this.ds*s?(Vn()<=H.DEBUG&&C("QueryEngine","The SDK decides to create cache indexes for query:",Dn(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,Le(t))):v.resolve())}gs(e,t){if(Ol(t))return v.resolve(null);let n=Le(t);return this.indexManager.getIndexType(e,n).next((s=>s===0?null:(t.limit!==null&&s===1&&(t=Ta(t,null,"F"),n=Le(t)),this.indexManager.getDocumentsMatchingTarget(e,n).next((i=>{const o=K(...i);return this.fs.getDocuments(e,o).next((c=>this.indexManager.getMinOffset(e,n).next((u=>{const h=this.Ss(t,c);return this.bs(t,h,o,u.readTime)?this.gs(e,Ta(t,null,"F")):this.Ds(e,h,t,u)}))))})))))}ps(e,t,n,s){return Ol(t)||s.isEqual(U.min())?v.resolve(null):this.fs.getDocuments(e,n).next((i=>{const o=this.Ss(t,i);return this.bs(t,o,n,s)?v.resolve(null):(Vn()<=H.DEBUG&&C("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),Dn(t)),this.Ds(e,o,t,Od(s,Kn)).next((c=>c)))}))}Ss(e,t){let n=new Z(yf(e));return t.forEach(((s,i)=>{As(e,i)&&(n=n.add(i))})),n}bs(e,t,n,s){if(e.limit===null)return!1;if(n.size!==t.size)return!0;const i=e.limitType==="F"?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(s)>0)}ys(e,t,n){return Vn()<=H.DEBUG&&C("QueryEngine","Using full collection scan to execute query:",Dn(t)),this.fs.getDocumentsMatchingQuery(e,t,Ue.min(),n)}Ds(e,t,n,s){return this.fs.getDocumentsMatchingQuery(e,n,s).next((i=>(t.forEach((o=>{i=i.insert(o.key,o)})),i)))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tc="LocalStore",fE=3e8;class mE{constructor(e,t,n,s){this.persistence=e,this.Cs=t,this.serializer=s,this.vs=new re(j),this.Fs=new ft((i=>_n(i)),vs),this.Ms=new Map,this.xs=e.getRemoteDocumentCache(),this.li=e.getTargetCache(),this.Pi=e.getBundleCache(),this.Os(n)}Os(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new om(this.xs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.xs.setIndexManager(this.indexManager),this.Cs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.vs)))}}function um(r,e,t,n){return new mE(r,e,t,n)}async function lm(r,e){const t=L(r);return await t.persistence.runTransaction("Handle user change","readonly",(n=>{let s;return t.mutationQueue.getAllMutationBatches(n).next((i=>(s=i,t.Os(e),t.mutationQueue.getAllMutationBatches(n)))).next((i=>{const o=[],c=[];let u=K();for(const h of s){o.push(h.batchId);for(const f of h.mutations)u=u.add(f.key)}for(const h of i){c.push(h.batchId);for(const f of h.mutations)u=u.add(f.key)}return t.localDocuments.getDocuments(n,u).next((h=>({Ns:h,removedBatchIds:o,addedBatchIds:c})))}))}))}function pE(r,e){const t=L(r);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",(n=>{const s=e.batch.keys(),i=t.xs.newChangeBuffer({trackRemovals:!0});return(function(c,u,h,f){const p=h.batch,E=p.keys();let b=v.resolve();return E.forEach((V=>{b=b.next((()=>f.getEntry(u,V))).next((N=>{const D=h.docVersions.get(V);F(D!==null,48541),N.version.compareTo(D)<0&&(p.applyToRemoteDocument(N,h),N.isValidDocument()&&(N.setReadTime(h.commitVersion),f.addEntry(N)))}))})),b.next((()=>c.mutationQueue.removeMutationBatch(u,p)))})(t,n,e,i).next((()=>i.apply(n))).next((()=>t.mutationQueue.performConsistencyCheck(n))).next((()=>t.documentOverlayCache.removeOverlaysForBatchId(n,s,e.batch.batchId))).next((()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(n,(function(c){let u=K();for(let h=0;h<c.mutationResults.length;++h)c.mutationResults[h].transformResults.length>0&&(u=u.add(c.batch.mutations[h].key));return u})(e)))).next((()=>t.localDocuments.getDocuments(n,s)))}))}function hm(r){const e=L(r);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.li.getLastRemoteSnapshotVersion(t)))}function gE(r,e){const t=L(r),n=e.snapshotVersion;let s=t.vs;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(i=>{const o=t.xs.newChangeBuffer({trackRemovals:!0});s=t.vs;const c=[];e.targetChanges.forEach(((f,p)=>{const E=s.get(p);if(!E)return;c.push(t.li.removeMatchingKeys(i,f.removedDocuments,p).next((()=>t.li.addMatchingKeys(i,f.addedDocuments,p))));let b=E.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.get(p)!==null?b=b.withResumeToken(he.EMPTY_BYTE_STRING,U.min()).withLastLimboFreeSnapshotVersion(U.min()):f.resumeToken.approximateByteSize()>0&&(b=b.withResumeToken(f.resumeToken,n)),s=s.insert(p,b),(function(N,D,G){return N.resumeToken.approximateByteSize()===0||D.snapshotVersion.toMicroseconds()-N.snapshotVersion.toMicroseconds()>=fE?!0:G.addedDocuments.size+G.modifiedDocuments.size+G.removedDocuments.size>0})(E,b,f)&&c.push(t.li.updateTargetData(i,b))}));let u=Me(),h=K();if(e.documentUpdates.forEach((f=>{e.resolvedLimboDocuments.has(f)&&c.push(t.persistence.referenceDelegate.updateLimboDocument(i,f))})),c.push(_E(i,o,e.documentUpdates).next((f=>{u=f.Bs,h=f.Ls}))),!n.isEqual(U.min())){const f=t.li.getLastRemoteSnapshotVersion(i).next((p=>t.li.setTargetsMetadata(i,i.currentSequenceNumber,n)));c.push(f)}return v.waitFor(c).next((()=>o.apply(i))).next((()=>t.localDocuments.getLocalViewOfDocuments(i,u,h))).next((()=>u))})).then((i=>(t.vs=s,i)))}function _E(r,e,t){let n=K(),s=K();return t.forEach((i=>n=n.add(i))),e.getEntries(r,n).next((i=>{let o=Me();return t.forEach(((c,u)=>{const h=i.get(c);u.isFoundDocument()!==h.isFoundDocument()&&(s=s.add(c)),u.isNoDocument()&&u.version.isEqual(U.min())?(e.removeEntry(c,u.readTime),o=o.insert(c,u)):!h.isValidDocument()||u.version.compareTo(h.version)>0||u.version.compareTo(h.version)===0&&h.hasPendingWrites?(e.addEntry(u),o=o.insert(c,u)):C(Tc,"Ignoring outdated watch update for ",c,". Current version:",h.version," Watch version:",u.version)})),{Bs:o,Ls:s}}))}function yE(r,e){const t=L(r);return t.persistence.runTransaction("Get next mutation batch","readonly",(n=>(e===void 0&&(e=un),t.mutationQueue.getNextMutationBatchAfterBatchId(n,e))))}function Oi(r,e){const t=L(r);return t.persistence.runTransaction("Allocate target","readwrite",(n=>{let s;return t.li.getTargetData(n,e).next((i=>i?(s=i,v.resolve(s)):t.li.allocateTargetId(n).next((o=>(s=new Ye(e,o,"TargetPurposeListen",n.currentSequenceNumber),t.li.addTargetData(n,s).next((()=>s)))))))})).then((n=>{const s=t.vs.get(n.targetId);return(s===null||n.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(t.vs=t.vs.insert(n.targetId,n),t.Fs.set(e,n.targetId)),n}))}async function ir(r,e,t){const n=L(r),s=n.vs.get(e),i=t?"readwrite":"readwrite-primary";try{t||await n.persistence.runTransaction("Release target",i,(o=>n.persistence.referenceDelegate.removeTarget(o,s)))}catch(o){if(!$t(o))throw o;C(Tc,`Failed to update sequence numbers for target ${e}: ${o}`)}n.vs=n.vs.remove(e),n.Fs.delete(s.target)}function Pa(r,e,t){const n=L(r);let s=U.min(),i=K();return n.persistence.runTransaction("Execute query","readwrite",(o=>(function(u,h,f){const p=L(u),E=p.Fs.get(f);return E!==void 0?v.resolve(p.vs.get(E)):p.li.getTargetData(h,f)})(n,o,Le(e)).next((c=>{if(c)return s=c.lastLimboFreeSnapshotVersion,n.li.getMatchingKeysForTargetId(o,c.targetId).next((u=>{i=u}))})).next((()=>n.Cs.getDocumentsMatchingQuery(o,e,t?s:U.min(),t?i:K()))).next((c=>(mm(n,_f(e),c),{documents:c,ks:i})))))}function dm(r,e){const t=L(r),n=L(t.li),s=t.vs.get(e);return s?Promise.resolve(s.target):t.persistence.runTransaction("Get target data","readonly",(i=>n.At(i,e).next((o=>o?o.target:null))))}function fm(r,e){const t=L(r),n=t.Ms.get(e)||U.min();return t.persistence.runTransaction("Get new document changes","readonly",(s=>t.xs.getAllFromCollectionGroup(s,e,Od(n,Kn),Number.MAX_SAFE_INTEGER))).then((s=>(mm(t,e,s),s)))}function mm(r,e,t){let n=r.Ms.get(e)||U.min();t.forEach(((s,i)=>{i.readTime.compareTo(n)>0&&(n=i.readTime)})),r.Ms.set(e,n)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pm="firestore_clients";function dh(r,e){return`${pm}_${r}_${e}`}const gm="firestore_mutations";function fh(r,e,t){let n=`${gm}_${r}_${t}`;return e.isAuthenticated()&&(n+=`_${e.uid}`),n}const _m="firestore_targets";function Jo(r,e){return`${_m}_${r}_${e}`}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const We="SharedClientState";class Mi{constructor(e,t,n,s){this.user=e,this.batchId=t,this.state=n,this.error=s}static $s(e,t,n){const s=JSON.parse(n);let i,o=typeof s=="object"&&["pending","acknowledged","rejected"].indexOf(s.state)!==-1&&(s.error===void 0||typeof s.error=="object");return o&&s.error&&(o=typeof s.error.message=="string"&&typeof s.error.code=="string",o&&(i=new O(s.error.code,s.error.message))),o?new Mi(e,t,s.state,i):(le(We,`Failed to parse mutation state for ID '${t}': ${n}`),null)}Ws(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class Zr{constructor(e,t,n){this.targetId=e,this.state=t,this.error=n}static $s(e,t){const n=JSON.parse(t);let s,i=typeof n=="object"&&["not-current","current","rejected"].indexOf(n.state)!==-1&&(n.error===void 0||typeof n.error=="object");return i&&n.error&&(i=typeof n.error.message=="string"&&typeof n.error.code=="string",i&&(s=new O(n.error.code,n.error.message))),i?new Zr(e,n.state,s):(le(We,`Failed to parse target state for ID '${e}': ${t}`),null)}Ws(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class Li{constructor(e,t){this.clientId=e,this.activeTargetIds=t}static $s(e,t){const n=JSON.parse(t);let s=typeof n=="object"&&n.activeTargetIds instanceof Array,i=ic();for(let o=0;s&&o<n.activeTargetIds.length;++o)s=Bd(n.activeTargetIds[o]),i=i.add(n.activeTargetIds[o]);return s?new Li(e,i):(le(We,`Failed to parse client data for instance '${e}': ${t}`),null)}}class Ec{constructor(e,t){this.clientId=e,this.onlineState=t}static $s(e){const t=JSON.parse(e);return typeof t=="object"&&["Unknown","Online","Offline"].indexOf(t.onlineState)!==-1&&typeof t.clientId=="string"?new Ec(t.clientId,t.onlineState):(le(We,`Failed to parse online state: ${e}`),null)}}class Ca{constructor(){this.activeTargetIds=ic()}Qs(e){this.activeTargetIds=this.activeTargetIds.add(e)}Gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Ws(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class Yo{constructor(e,t,n,s,i){this.window=e,this.Ci=t,this.persistenceKey=n,this.zs=s,this.syncEngine=null,this.onlineStateHandler=null,this.sequenceNumberHandler=null,this.js=this.Js.bind(this),this.Hs=new re(j),this.started=!1,this.Zs=[];const o=n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");this.storage=this.window.localStorage,this.currentUser=i,this.Xs=dh(this.persistenceKey,this.zs),this.Ys=(function(u){return`firestore_sequence_number_${u}`})(this.persistenceKey),this.Hs=this.Hs.insert(this.zs,new Ca),this.eo=new RegExp(`^${pm}_${o}_([^_]*)$`),this.no=new RegExp(`^${gm}_${o}_(\\d+)(?:_(.*))?$`),this.ro=new RegExp(`^${_m}_${o}_(\\d+)$`),this.io=(function(u){return`firestore_online_state_${u}`})(this.persistenceKey),this.so=(function(u){return`firestore_bundle_loaded_v2_${u}`})(this.persistenceKey),this.window.addEventListener("storage",this.js)}static v(e){return!(!e||!e.localStorage)}async start(){const e=await this.syncEngine.hs();for(const n of e){if(n===this.zs)continue;const s=this.getItem(dh(this.persistenceKey,n));if(s){const i=Li.$s(n,s);i&&(this.Hs=this.Hs.insert(i.clientId,i))}}this.oo();const t=this.storage.getItem(this.io);if(t){const n=this._o(t);n&&this.ao(n)}for(const n of this.Zs)this.Js(n);this.Zs=[],this.window.addEventListener("pagehide",(()=>this.shutdown())),this.started=!0}writeSequenceNumber(e){this.setItem(this.Ys,JSON.stringify(e))}getAllActiveQueryTargets(){return this.uo(this.Hs)}isActiveQueryTarget(e){let t=!1;return this.Hs.forEach(((n,s)=>{s.activeTargetIds.has(e)&&(t=!0)})),t}addPendingMutation(e){this.co(e,"pending")}updateMutationState(e,t,n){this.co(e,t,n),this.lo(e)}addLocalQueryTarget(e,t=!0){let n="not-current";if(this.isActiveQueryTarget(e)){const s=this.storage.getItem(Jo(this.persistenceKey,e));if(s){const i=Zr.$s(e,s);i&&(n=i.state)}}return t&&this.ho.Qs(e),this.oo(),n}removeLocalQueryTarget(e){this.ho.Gs(e),this.oo()}isLocalQueryTarget(e){return this.ho.activeTargetIds.has(e)}clearQueryState(e){this.removeItem(Jo(this.persistenceKey,e))}updateQueryState(e,t,n){this.Po(e,t,n)}handleUserChange(e,t,n){t.forEach((s=>{this.lo(s)})),this.currentUser=e,n.forEach((s=>{this.addPendingMutation(s)}))}setOnlineState(e){this.To(e)}notifyBundleLoaded(e){this.Io(e)}shutdown(){this.started&&(this.window.removeEventListener("storage",this.js),this.removeItem(this.Xs),this.started=!1)}getItem(e){const t=this.storage.getItem(e);return C(We,"READ",e,t),t}setItem(e,t){C(We,"SET",e,t),this.storage.setItem(e,t)}removeItem(e){C(We,"REMOVE",e),this.storage.removeItem(e)}Js(e){const t=e;if(t.storageArea===this.storage){if(C(We,"EVENT",t.key,t.newValue),t.key===this.Xs)return void le("Received WebStorage notification for local change. Another client might have garbage-collected our state");this.Ci.enqueueRetryable((async()=>{if(this.started){if(t.key!==null){if(this.eo.test(t.key)){if(t.newValue==null){const n=this.Eo(t.key);return this.Ro(n,null)}{const n=this.Ao(t.key,t.newValue);if(n)return this.Ro(n.clientId,n)}}else if(this.no.test(t.key)){if(t.newValue!==null){const n=this.Vo(t.key,t.newValue);if(n)return this.mo(n)}}else if(this.ro.test(t.key)){if(t.newValue!==null){const n=this.fo(t.key,t.newValue);if(n)return this.po(n)}}else if(t.key===this.io){if(t.newValue!==null){const n=this._o(t.newValue);if(n)return this.ao(n)}}else if(t.key===this.Ys){const n=(function(i){let o=De.ce;if(i!=null)try{const c=JSON.parse(i);F(typeof c=="number",30636,{yo:i}),o=c}catch(c){le(We,"Failed to read sequence number from WebStorage",c)}return o})(t.newValue);n!==De.ce&&this.sequenceNumberHandler(n)}else if(t.key===this.so){const n=this.wo(t.newValue);await Promise.all(n.map((s=>this.syncEngine.So(s))))}}}else this.Zs.push(t)}))}}get ho(){return this.Hs.get(this.zs)}oo(){this.setItem(this.Xs,this.ho.Ws())}co(e,t,n){const s=new Mi(this.currentUser,e,t,n),i=fh(this.persistenceKey,this.currentUser,e);this.setItem(i,s.Ws())}lo(e){const t=fh(this.persistenceKey,this.currentUser,e);this.removeItem(t)}To(e){const t={clientId:this.zs,onlineState:e};this.storage.setItem(this.io,JSON.stringify(t))}Po(e,t,n){const s=Jo(this.persistenceKey,e),i=new Zr(e,t,n);this.setItem(s,i.Ws())}Io(e){const t=JSON.stringify(Array.from(e));this.setItem(this.so,t)}Eo(e){const t=this.eo.exec(e);return t?t[1]:null}Ao(e,t){const n=this.Eo(e);return Li.$s(n,t)}Vo(e,t){const n=this.no.exec(e),s=Number(n[1]),i=n[2]!==void 0?n[2]:null;return Mi.$s(new ve(i),s,t)}fo(e,t){const n=this.ro.exec(e),s=Number(n[1]);return Zr.$s(s,t)}_o(e){return Ec.$s(e)}wo(e){return JSON.parse(e)}async mo(e){if(e.user.uid===this.currentUser.uid)return this.syncEngine.bo(e.batchId,e.state,e.error);C(We,`Ignoring mutation for non-active user ${e.user.uid}`)}po(e){return this.syncEngine.Do(e.targetId,e.state,e.error)}Ro(e,t){const n=t?this.Hs.insert(e,t):this.Hs.remove(e),s=this.uo(this.Hs),i=this.uo(n),o=[],c=[];return i.forEach((u=>{s.has(u)||o.push(u)})),s.forEach((u=>{i.has(u)||c.push(u)})),this.syncEngine.Co(o,c).then((()=>{this.Hs=n}))}ao(e){this.Hs.get(e.clientId)&&this.onlineStateHandler(e.onlineState)}uo(e){let t=ic();return e.forEach(((n,s)=>{t=t.unionWith(s.activeTargetIds)})),t}}class ym{constructor(){this.vo=new Ca,this.Fo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,n){}addLocalQueryTarget(e,t=!0){return t&&this.vo.Qs(e),this.Fo[e]||"not-current"}updateQueryState(e,t,n){this.Fo[e]=t}removeLocalQueryTarget(e){this.vo.Gs(e)}isLocalQueryTarget(e){return this.vo.activeTargetIds.has(e)}clearQueryState(e){delete this.Fo[e]}getAllActiveQueryTargets(){return this.vo.activeTargetIds}isActiveQueryTarget(e){return this.vo.activeTargetIds.has(e)}start(){return this.vo=new Ca,Promise.resolve()}handleUserChange(e,t,n){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class IE{Mo(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mh="ConnectivityMonitor";class ph{constructor(){this.xo=()=>this.Oo(),this.No=()=>this.Bo(),this.Lo=[],this.ko()}Mo(e){this.Lo.push(e)}shutdown(){window.removeEventListener("online",this.xo),window.removeEventListener("offline",this.No)}ko(){window.addEventListener("online",this.xo),window.addEventListener("offline",this.No)}Oo(){C(mh,"Network connectivity changed: AVAILABLE");for(const e of this.Lo)e(0)}Bo(){C(mh,"Network connectivity changed: UNAVAILABLE");for(const e of this.Lo)e(1)}static v(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Js=null;function Va(){return Js===null?Js=(function(){return 268435456+Math.round(2147483648*Math.random())})():Js++,"0x"+Js.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xo="RestConnection",TE={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery",ExecutePipeline:"executePipeline"};class EE{get Ko(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",n=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.qo=t+"://"+e.host,this.Uo=`projects/${n}/databases/${s}`,this.$o=this.databaseId.database===Si?`project_id=${n}`:`project_id=${n}&database_id=${s}`}Wo(e,t,n,s,i){const o=Va(),c=this.Qo(e,t.toUriEncodedString());C(Xo,`Sending RPC '${e}' ${o}:`,c,n);const u={"google-cloud-resource-prefix":this.Uo,"x-goog-request-params":this.$o};this.Go(u,s,i);const{host:h}=new URL(c),f=_s(h);return this.zo(e,c,u,n,f).then((p=>(C(Xo,`Received RPC '${e}' ${o}: `,p),p)),(p=>{throw qn(Xo,`RPC '${e}' ${o} failed with error: `,p,"url: ",c,"request:",n),p}))}jo(e,t,n,s,i,o){return this.Wo(e,t,n,s,i)}Go(e,t,n){e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+hr})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((s,i)=>e[i]=s)),n&&n.headers.forEach(((s,i)=>e[i]=s))}Qo(e,t){const n=TE[e];let s=`${this.qo}/v1/${t}:${n}`;return this.databaseInfo.apiKey&&(s=`${s}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`),s}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wE{constructor(e){this.Jo=e.Jo,this.Ho=e.Ho}Zo(e){this.Xo=e}Yo(e){this.e_=e}t_(e){this.n_=e}onMessage(e){this.r_=e}close(){this.Ho()}send(e){this.Jo(e)}i_(){this.Xo()}s_(){this.e_()}o_(e){this.n_(e)}__(e){this.r_(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const we="WebChannelConnection",Fr=(r,e,t)=>{r.listen(e,(n=>{try{t(n)}catch(s){setTimeout((()=>{throw s}),0)}}))};class Un extends EE{constructor(e){super(e),this.a_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}static u_(){if(!Un.c_){const e=Vd();Fr(e,Cd.STAT_EVENT,(t=>{t.stat===ca.PROXY?C(we,"STAT_EVENT: detected buffering proxy"):t.stat===ca.NOPROXY&&C(we,"STAT_EVENT: detected no buffering proxy")})),Un.c_=!0}}zo(e,t,n,s,i){const o=Va();return new Promise(((c,u)=>{const h=new bd;h.setWithCredentials(!0),h.listenOnce(Pd.COMPLETE,(()=>{try{switch(h.getLastErrorCode()){case ti.NO_ERROR:const p=h.getResponseJson();C(we,`XHR for RPC '${e}' ${o} received:`,JSON.stringify(p)),c(p);break;case ti.TIMEOUT:C(we,`RPC '${e}' ${o} timed out`),u(new O(P.DEADLINE_EXCEEDED,"Request time out"));break;case ti.HTTP_ERROR:const E=h.getStatus();if(C(we,`RPC '${e}' ${o} failed with status:`,E,"response text:",h.getResponseText()),E>0){let b=h.getResponseJson();Array.isArray(b)&&(b=b[0]);const V=b==null?void 0:b.error;if(V&&V.status&&V.message){const N=(function(G){const z=G.toLowerCase().replace(/_/g,"-");return Object.values(P).indexOf(z)>=0?z:P.UNKNOWN})(V.status);u(new O(N,V.message))}else u(new O(P.UNKNOWN,"Server responded with status "+h.getStatus()))}else u(new O(P.UNAVAILABLE,"Connection failed."));break;default:M(9055,{l_:e,streamId:o,h_:h.getLastErrorCode(),P_:h.getLastError()})}}finally{C(we,`RPC '${e}' ${o} completed.`)}}));const f=JSON.stringify(s);C(we,`RPC '${e}' ${o} sending request:`,s),h.send(t,"POST",f,n,15)}))}T_(e,t,n){const s=Va(),i=[this.qo,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=this.createWebChannelTransport(),c={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},u=this.longPollingOptions.timeoutSeconds;u!==void 0&&(c.longPollingTimeout=Math.round(1e3*u)),this.useFetchStreams&&(c.useFetchStreams=!0),this.Go(c.initMessageHeaders,t,n),c.encodeInitMessageHeaders=!0;const h=i.join("");C(we,`Creating RPC '${e}' stream ${s}: ${h}`,c);const f=o.createWebChannel(h,c);this.I_(f);let p=!1,E=!1;const b=new wE({Jo:V=>{E?C(we,`Not sending because RPC '${e}' stream ${s} is closed:`,V):(p||(C(we,`Opening RPC '${e}' stream ${s} transport.`),f.open(),p=!0),C(we,`RPC '${e}' stream ${s} sending:`,V),f.send(V))},Ho:()=>f.close()});return Fr(f,Ur.EventType.OPEN,(()=>{E||(C(we,`RPC '${e}' stream ${s} transport opened.`),b.i_())})),Fr(f,Ur.EventType.CLOSE,(()=>{E||(E=!0,C(we,`RPC '${e}' stream ${s} transport closed`),b.o_(),this.E_(f))})),Fr(f,Ur.EventType.ERROR,(V=>{E||(E=!0,qn(we,`RPC '${e}' stream ${s} transport errored. Name:`,V.name,"Message:",V.message),b.o_(new O(P.UNAVAILABLE,"The operation could not be completed")))})),Fr(f,Ur.EventType.MESSAGE,(V=>{var N;if(!E){const D=V.data[0];F(!!D,16349);const G=D,z=(G==null?void 0:G.error)||((N=G[0])==null?void 0:N.error);if(z){C(we,`RPC '${e}' stream ${s} received error:`,z);const q=z.status;let se=(function(I){const g=de[I];if(g!==void 0)return Df(g)})(q),J=z.message;q==="NOT_FOUND"&&J.includes("database")&&J.includes("does not exist")&&J.includes(this.databaseId.database)&&qn(`Database '${this.databaseId.database}' not found. Please check your project configuration.`),se===void 0&&(se=P.INTERNAL,J="Unknown error status: "+q+" with message "+z.message),E=!0,b.o_(new O(se,J)),f.close()}else C(we,`RPC '${e}' stream ${s} received:`,D),b.__(D)}})),Un.u_(),setTimeout((()=>{b.s_()}),0),b}terminate(){this.a_.forEach((e=>e.close())),this.a_=[]}I_(e){this.a_.push(e)}E_(e){this.a_=this.a_.filter((t=>t===e))}Go(e,t,n){super.Go(e,t,n),this.databaseInfo.apiKey&&(e["x-goog-api-key"]=this.databaseInfo.apiKey)}createWebChannelTransport(){return Dd()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vE(r){return new Un(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Im(){return typeof window<"u"?window:null}function hi(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function oo(r){return new CT(r,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Un.c_=!1;class Tm{constructor(e,t,n=1e3,s=1.5,i=6e4){this.Ci=e,this.timerId=t,this.R_=n,this.A_=s,this.V_=i,this.d_=0,this.m_=null,this.f_=Date.now(),this.reset()}reset(){this.d_=0}g_(){this.d_=this.V_}p_(e){this.cancel();const t=Math.floor(this.d_+this.y_()),n=Math.max(0,Date.now()-this.f_),s=Math.max(0,t-n);s>0&&C("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.d_} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`),this.m_=this.Ci.enqueueAfterDelay(this.timerId,s,(()=>(this.f_=Date.now(),e()))),this.d_*=this.A_,this.d_<this.R_&&(this.d_=this.R_),this.d_>this.V_&&(this.d_=this.V_)}w_(){this.m_!==null&&(this.m_.skipDelay(),this.m_=null)}cancel(){this.m_!==null&&(this.m_.cancel(),this.m_=null)}y_(){return(Math.random()-.5)*this.d_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gh="PersistentStream";class Em{constructor(e,t,n,s,i,o,c,u){this.Ci=e,this.S_=n,this.b_=s,this.connection=i,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=c,this.listener=u,this.state=0,this.D_=0,this.C_=null,this.v_=null,this.stream=null,this.F_=0,this.M_=new Tm(e,t)}x_(){return this.state===1||this.state===5||this.O_()}O_(){return this.state===2||this.state===3}start(){this.F_=0,this.state!==4?this.auth():this.N_()}async stop(){this.x_()&&await this.close(0)}B_(){this.state=0,this.M_.reset()}L_(){this.O_()&&this.C_===null&&(this.C_=this.Ci.enqueueAfterDelay(this.S_,6e4,(()=>this.k_())))}K_(e){this.q_(),this.stream.send(e)}async k_(){if(this.O_())return this.close(0)}q_(){this.C_&&(this.C_.cancel(),this.C_=null)}U_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,t){this.q_(),this.U_(),this.M_.cancel(),this.D_++,e!==4?this.M_.reset():t&&t.code===P.RESOURCE_EXHAUSTED?(le(t.toString()),le("Using maximum backoff delay to prevent overloading the backend."),this.M_.g_()):t&&t.code===P.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.W_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.t_(t)}W_(){}auth(){this.state=1;const e=this.Q_(this.D_),t=this.D_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([n,s])=>{this.D_===t&&this.G_(n,s)}),(n=>{e((()=>{const s=new O(P.UNKNOWN,"Fetching auth token failed: "+n.message);return this.z_(s)}))}))}G_(e,t){const n=this.Q_(this.D_);this.stream=this.j_(e,t),this.stream.Zo((()=>{n((()=>this.listener.Zo()))})),this.stream.Yo((()=>{n((()=>(this.state=2,this.v_=this.Ci.enqueueAfterDelay(this.b_,1e4,(()=>(this.O_()&&(this.state=3),Promise.resolve()))),this.listener.Yo())))})),this.stream.t_((s=>{n((()=>this.z_(s)))})),this.stream.onMessage((s=>{n((()=>++this.F_==1?this.J_(s):this.onNext(s)))}))}N_(){this.state=5,this.M_.p_((async()=>{this.state=0,this.start()}))}z_(e){return C(gh,`close with error: ${e}`),this.stream=null,this.close(4,e)}Q_(e){return t=>{this.Ci.enqueueAndForget((()=>this.D_===e?t():(C(gh,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class AE extends Em{constructor(e,t,n,s,i,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,n,s,o),this.serializer=i}j_(e,t){return this.connection.T_("Listen",e,t)}J_(e){return this.onNext(e)}onNext(e){this.M_.reset();const t=kT(this.serializer,e),n=(function(i){if(!("targetChange"in i))return U.min();const o=i.targetChange;return o.targetIds&&o.targetIds.length?U.min():o.readTime?Ce(o.readTime):U.min()})(e);return this.listener.H_(t,n)}Z_(e){const t={};t.database=va(this.serializer),t.addTarget=(function(i,o){let c;const u=o.target;if(c=bi(u)?{documents:Uf(i,u)}:{query:Bf(i,u).ft},c.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){c.resumeToken=xf(i,o.resumeToken);const h=Ea(i,o.expectedCount);h!==null&&(c.expectedCount=h)}else if(o.snapshotVersion.compareTo(U.min())>0){c.readTime=sr(i,o.snapshotVersion.toTimestamp());const h=Ea(i,o.expectedCount);h!==null&&(c.expectedCount=h)}return c})(this.serializer,e);const n=xT(this.serializer,e);n&&(t.labels=n),this.K_(t)}X_(e){const t={};t.database=va(this.serializer),t.removeTarget=e,this.K_(t)}}class SE extends Em{constructor(e,t,n,s,i,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,n,s,o),this.serializer=i}get Y_(){return this.F_>0}start(){this.lastStreamToken=void 0,super.start()}W_(){this.Y_&&this.ea([])}j_(e,t){return this.connection.T_("Write",e,t)}J_(e){return F(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,F(!e.writeResults||e.writeResults.length===0,55816),this.listener.ta()}onNext(e){F(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.M_.reset();const t=NT(e.writeResults,e.commitTime),n=Ce(e.commitTime);return this.listener.na(n,t)}ra(){const e={};e.database=va(this.serializer),this.K_(e)}ea(e){const t={streamToken:this.lastStreamToken,writes:e.map((n=>Vi(this.serializer,n)))};this.K_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class RE{}class bE extends RE{constructor(e,t,n,s){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=n,this.serializer=s,this.ia=!1}sa(){if(this.ia)throw new O(P.FAILED_PRECONDITION,"The client has already been terminated.")}Wo(e,t,n,s){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([i,o])=>this.connection.Wo(e,wa(t,n),s,i,o))).catch((i=>{throw i.name==="FirebaseError"?(i.code===P.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new O(P.UNKNOWN,i.toString())}))}jo(e,t,n,s,i){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([o,c])=>this.connection.jo(e,wa(t,n),s,o,c,i))).catch((o=>{throw o.name==="FirebaseError"?(o.code===P.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new O(P.UNKNOWN,o.toString())}))}terminate(){this.ia=!0,this.connection.terminate()}}function PE(r,e,t,n){return new bE(r,e,t,n)}class CE{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.oa=0,this._a=null,this.aa=!0}ua(){this.oa===0&&(this.ca("Unknown"),this._a=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this._a=null,this.la("Backend didn't respond within 10 seconds."),this.ca("Offline"),Promise.resolve()))))}ha(e){this.state==="Online"?this.ca("Unknown"):(this.oa++,this.oa>=1&&(this.Pa(),this.la(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ca("Offline")))}set(e){this.Pa(),this.oa=0,e==="Online"&&(this.aa=!1),this.ca(e)}ca(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}la(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.aa?(le(t),this.aa=!1):C("OnlineStateTracker",t)}Pa(){this._a!==null&&(this._a.cancel(),this._a=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nt="RemoteStore";class VE{constructor(e,t,n,s,i){this.localStore=e,this.datastore=t,this.asyncQueue=n,this.remoteSyncer={},this.Ta=[],this.Ia=new Map,this.Ea=new Map,this.Ra=new Map,this.Aa=new ht(1e3),this.Va=new ht(1001),this.da=new Set,this.ma=[],this.fa=i,this.fa.Mo((o=>{n.enqueueAndForget((async()=>{Tn(this)&&(C(nt,"Restarting streams for network reachability change."),await(async function(u){const h=L(u);h.da.add(4),await Rs(h),h.ga.set("Unknown"),h.da.delete(4),await ao(h)})(this))}))})),this.ga=new CE(n,s)}}async function ao(r){if(Tn(r))for(const e of r.ma)await e(!0)}async function Rs(r){for(const e of r.ma)await e(!1)}function Da(r,e){return r.Ea.get(e)||void 0}function co(r,e){const t=L(r),n=Da(t,e.targetId);if(n!==void 0&&t.Ia.has(n))return;const s=(function(c,u){const h=Da(c,u);h!==void 0&&c.Ra.delete(h);const f=(function(E,b){return b%2!=0?E.Va.next():E.Aa.next()})(c,u);return c.Ea.set(u,f),c.Ra.set(f,u),f})(t,e.targetId);C(nt,"remoteStoreListen mapping SDK target ID to remote",e.targetId,s);const i=new Ye(e.target,s,e.purpose,e.sequenceNumber,e.snapshotVersion,e.lastLimboFreeSnapshotVersion,e.resumeToken);t.Ia.set(s,i),Ac(t)?vc(t):pr(t).O_()&&wc(t,i)}function or(r,e){const t=L(r),n=pr(t),s=Da(t,e);C(nt,"remoteStoreUnlisten removing mapping of SDK target ID to remote",e,s),t.Ia.delete(s),t.Ea.delete(e),t.Ra.delete(s),n.O_()&&wm(t,s),t.Ia.size===0&&(n.O_()?n.L_():Tn(t)&&t.ga.set("Unknown"))}function wc(r,e){if(r.pa.$e(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(U.min())>0){const t=r.Ra.get(e.targetId);if(t===void 0)return void C(nt,"SDK target ID not found for remote ID: "+e.targetId);const n=r.remoteSyncer.getRemoteKeysForTarget(t).size;e=e.withExpectedCount(n)}pr(r).Z_(e)}function wm(r,e){r.pa.$e(e),pr(r).X_(e)}function vc(r){r.pa=new ST({getRemoteKeysForTarget:e=>{const t=r.Ra.get(e);return t!==void 0?r.remoteSyncer.getRemoteKeysForTarget(t):K()},At:e=>r.Ia.get(e)||null,ht:()=>r.datastore.serializer.databaseId}),pr(r).start(),r.ga.ua()}function Ac(r){return Tn(r)&&!pr(r).x_()&&r.Ia.size>0}function Tn(r){return L(r).da.size===0}function vm(r){r.pa=void 0}async function DE(r){r.ga.set("Online")}async function kE(r){r.Ia.forEach(((e,t)=>{wc(r,e)}))}async function NE(r,e){vm(r),Ac(r)?(r.ga.ha(e),vc(r)):r.ga.set("Unknown")}async function xE(r,e,t){if(r.ga.set("Online"),e instanceof Nf&&e.state===2&&e.cause)try{await(async function(s,i){const o=i.cause;for(const c of i.targetIds){if(s.Ia.has(c)){const u=s.Ra.get(c);u!==void 0&&(await s.remoteSyncer.rejectListen(u,o),s.Ea.delete(u),s.Ra.delete(c)),s.Ia.delete(c)}s.pa.removeTarget(c)}})(r,e)}catch(n){C(nt,"Failed to remove targets %s: %s ",e.targetIds.join(","),n),await Fi(r,n)}else if(e instanceof ui?r.pa.Xe(e):e instanceof kf?r.pa.st(e):r.pa.tt(e),!t.isEqual(U.min()))try{const n=await hm(r.localStore);t.compareTo(n)>=0&&await(function(i,o){const c=i.pa.Tt(o);c.targetChanges.forEach(((h,f)=>{if(h.resumeToken.approximateByteSize()>0){const p=i.Ia.get(f);p&&i.Ia.set(f,p.withResumeToken(h.resumeToken,o))}})),c.targetMismatches.forEach(((h,f)=>{const p=i.Ia.get(h);if(!p)return;i.Ia.set(h,p.withResumeToken(he.EMPTY_BYTE_STRING,p.snapshotVersion)),wm(i,h);const E=new Ye(p.target,h,f,p.sequenceNumber);wc(i,E)}));const u=(function(f,p){const E=new Map;p.targetChanges.forEach(((V,N)=>{const D=f.Ra.get(N);D!==void 0&&E.set(D,V)}));let b=new re(j);return p.targetMismatches.forEach(((V,N)=>{const D=f.Ra.get(V);D!==void 0&&(b=b.insert(D,N))})),new fr(p.snapshotVersion,E,b,p.documentUpdates,p.resolvedLimboDocuments)})(i,c);return i.remoteSyncer.applyRemoteEvent(u)})(r,t)}catch(n){C(nt,"Failed to raise snapshot:",n),await Fi(r,n)}}async function Fi(r,e,t){if(!$t(e))throw e;r.da.add(1),await Rs(r),r.ga.set("Offline"),t||(t=()=>hm(r.localStore)),r.asyncQueue.enqueueRetryable((async()=>{C(nt,"Retrying IndexedDB access"),await t(),r.da.delete(1),await ao(r)}))}function Am(r,e){return e().catch((t=>Fi(r,t,e)))}async function mr(r){const e=L(r),t=jt(e);let n=e.Ta.length>0?e.Ta[e.Ta.length-1].batchId:un;for(;OE(e);)try{const s=await yE(e.localStore,n);if(s===null){e.Ta.length===0&&t.L_();break}n=s.batchId,ME(e,s)}catch(s){await Fi(e,s)}Sm(e)&&Rm(e)}function OE(r){return Tn(r)&&r.Ta.length<10}function ME(r,e){r.Ta.push(e);const t=jt(r);t.O_()&&t.Y_&&t.ea(e.mutations)}function Sm(r){return Tn(r)&&!jt(r).x_()&&r.Ta.length>0}function Rm(r){jt(r).start()}async function LE(r){jt(r).ra()}async function FE(r){const e=jt(r);for(const t of r.Ta)e.ea(t.mutations)}async function UE(r,e,t){const n=r.Ta.shift(),s=lc.from(n,e,t);await Am(r,(()=>r.remoteSyncer.applySuccessfulWrite(s))),await mr(r)}async function BE(r,e){e&&jt(r).Y_&&await(async function(n,s){if((function(o){return wT(o)&&o!==P.ABORTED})(s.code)){const i=n.Ta.shift();jt(n).B_(),await Am(n,(()=>n.remoteSyncer.rejectFailedWrite(i.batchId,s))),await mr(n)}})(r,e),Sm(r)&&Rm(r)}async function _h(r,e){const t=L(r);t.asyncQueue.verifyOperationInProgress(),C(nt,"RemoteStore received new credentials");const n=Tn(t);t.da.add(3),await Rs(t),n&&t.ga.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.da.delete(3),await ao(t)}async function ka(r,e){const t=L(r);e?(t.da.delete(2),await ao(t)):e||(t.da.add(2),await Rs(t),t.ga.set("Unknown"))}function pr(r){return r.ya||(r.ya=(function(t,n,s){const i=L(t);return i.sa(),new AE(n,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(r.datastore,r.asyncQueue,{Zo:DE.bind(null,r),Yo:kE.bind(null,r),t_:NE.bind(null,r),H_:xE.bind(null,r)}),r.ma.push((async e=>{e?(r.ya.B_(),Ac(r)?vc(r):r.ga.set("Unknown")):(await r.ya.stop(),vm(r))}))),r.ya}function jt(r){return r.wa||(r.wa=(function(t,n,s){const i=L(t);return i.sa(),new SE(n,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(r.datastore,r.asyncQueue,{Zo:()=>Promise.resolve(),Yo:LE.bind(null,r),t_:BE.bind(null,r),ta:FE.bind(null,r),na:UE.bind(null,r)}),r.ma.push((async e=>{e?(r.wa.B_(),await mr(r)):(await r.wa.stop(),r.Ta.length>0&&(C(nt,`Stopping write stream with ${r.Ta.length} pending writes`),r.Ta=[]))}))),r.wa}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sc{constructor(e,t,n,s,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=n,this.op=s,this.removalCallback=i,this.deferred=new it,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((o=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,n,s,i){const o=Date.now()+n,c=new Sc(e,t,o,s,i);return c.start(n),c}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new O(P.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Rc(r,e){if(le("AsyncQueue",`${e}: ${r}`),$t(r))return new O(P.UNAVAILABLE,`${e}: ${r}`);throw r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bn{static emptySet(e){return new Bn(e.comparator)}constructor(e){this.comparator=e?(t,n)=>e(t,n)||x.comparator(t.key,n.key):(t,n)=>x.comparator(t.key,n.key),this.keyedMap=Br(),this.sortedSet=new re(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,n)=>(e(t),!1)))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof Bn)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),n=e.sortedSet.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=n.getNext().key;if(!s.isEqual(i))return!1}return!0}toString(){const e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const n=new Bn;return n.comparator=this.comparator,n.keyedMap=e,n.sortedSet=t,n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yh{constructor(){this.Sa=new re(x.comparator)}track(e){const t=e.doc.key,n=this.Sa.get(t);n?e.type!==0&&n.type===3?this.Sa=this.Sa.insert(t,e):e.type===3&&n.type!==1?this.Sa=this.Sa.insert(t,{type:n.type,doc:e.doc}):e.type===2&&n.type===2?this.Sa=this.Sa.insert(t,{type:2,doc:e.doc}):e.type===2&&n.type===0?this.Sa=this.Sa.insert(t,{type:0,doc:e.doc}):e.type===1&&n.type===0?this.Sa=this.Sa.remove(t):e.type===1&&n.type===2?this.Sa=this.Sa.insert(t,{type:1,doc:n.doc}):e.type===0&&n.type===1?this.Sa=this.Sa.insert(t,{type:2,doc:e.doc}):M(63341,{Vt:e,ba:n}):this.Sa=this.Sa.insert(t,e)}Da(){const e=[];return this.Sa.inorderTraversal(((t,n)=>{e.push(n)})),e}}class ar{constructor(e,t,n,s,i,o,c,u,h){this.query=e,this.docs=t,this.oldDocs=n,this.docChanges=s,this.mutatedKeys=i,this.fromCache=o,this.syncStateChanged=c,this.excludesMetadataChanges=u,this.hasCachedResults=h}static fromInitialDocuments(e,t,n,s,i){const o=[];return t.forEach((c=>{o.push({type:0,doc:c})})),new ar(e,t,Bn.emptySet(t),o,n,s,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&eo(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,n=e.docChanges;if(t.length!==n.length)return!1;for(let s=0;s<t.length;s++)if(t[s].type!==n[s].type||!t[s].doc.isEqual(n[s].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jE{constructor(){this.Ca=void 0,this.va=[]}Fa(){return this.va.some((e=>e.Ma()))}}class qE{constructor(){this.queries=Ih(),this.onlineState="Unknown",this.xa=new Set}terminate(){(function(t,n){const s=L(t),i=s.queries;s.queries=Ih(),i.forEach(((o,c)=>{for(const u of c.va)u.onError(n)}))})(this,new O(P.ABORTED,"Firestore shutting down"))}}function Ih(){return new ft((r=>gf(r)),eo)}async function zE(r,e){const t=L(r);let n=3;const s=e.query;let i=t.queries.get(s);i?!i.Fa()&&e.Ma()&&(n=2):(i=new jE,n=e.Ma()?0:1);try{switch(n){case 0:i.Ca=await t.onListen(s,!0);break;case 1:i.Ca=await t.onListen(s,!1);break;case 2:await t.onFirstRemoteStoreListen(s)}}catch(o){const c=Rc(o,`Initialization of query '${Dn(e.query)}' failed`);return void e.onError(c)}t.queries.set(s,i),i.va.push(e),e.Oa(t.onlineState),i.Ca&&e.Na(i.Ca)&&bc(t)}async function $E(r,e){const t=L(r),n=e.query;let s=3;const i=t.queries.get(n);if(i){const o=i.va.indexOf(e);o>=0&&(i.va.splice(o,1),i.va.length===0?s=e.Ma()?0:1:!i.Fa()&&e.Ma()&&(s=2))}switch(s){case 0:return t.queries.delete(n),t.onUnlisten(n,!0);case 1:return t.queries.delete(n),t.onUnlisten(n,!1);case 2:return t.onLastRemoteStoreUnlisten(n);default:return}}function KE(r,e){const t=L(r);let n=!1;for(const s of e){const i=s.query,o=t.queries.get(i);if(o){for(const c of o.va)c.Na(s)&&(n=!0);o.Ca=s}}n&&bc(t)}function GE(r,e,t){const n=L(r),s=n.queries.get(e);if(s)for(const i of s.va)i.onError(t);n.queries.delete(e)}function bc(r){r.xa.forEach((e=>{e.next()}))}var Na,Th;(Th=Na||(Na={})).Ba="default",Th.Cache="cache";class HE{constructor(e,t,n){this.query=e,this.La=t,this.ka=!1,this.Ka=null,this.onlineState="Unknown",this.options=n||{}}Na(e){if(!this.options.includeMetadataChanges){const n=[];for(const s of e.docChanges)s.type!==3&&n.push(s);e=new ar(e.query,e.docs,e.oldDocs,n,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.ka?this.qa(e)&&(this.La.next(e),t=!0):this.Ua(e,this.onlineState)&&(this.$a(e),t=!0),this.Ka=e,t}onError(e){this.La.error(e)}Oa(e){this.onlineState=e;let t=!1;return this.Ka&&!this.ka&&this.Ua(this.Ka,e)&&(this.$a(this.Ka),t=!0),t}Ua(e,t){if(!e.fromCache||!this.Ma())return!0;const n=t!=="Offline";return(!this.options.Wa||!n)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}qa(e){if(e.docChanges.length>0)return!0;const t=this.Ka&&this.Ka.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}$a(e){e=ar.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.ka=!0,this.La.next(e)}Ma(){return this.options.source!==Na.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bm{constructor(e){this.key=e}}class Pm{constructor(e){this.key=e}}class WE{constructor(e,t){this.query=e,this.tu=t,this.nu=null,this.hasCachedResults=!1,this.current=!1,this.ru=K(),this.mutatedKeys=K(),this.iu=yf(e),this.su=new Bn(this.iu)}get ou(){return this.tu}_u(e,t){const n=t?t.au:new yh,s=t?t.su:this.su;let i=t?t.mutatedKeys:this.mutatedKeys,o=s,c=!1;const u=this.query.limitType==="F"&&s.size===this.query.limit?s.last():null,h=this.query.limitType==="L"&&s.size===this.query.limit?s.first():null;if(e.inorderTraversal(((f,p)=>{const E=s.get(f),b=As(this.query,p)?p:null,V=!!E&&this.mutatedKeys.has(E.key),N=!!b&&(b.hasLocalMutations||this.mutatedKeys.has(b.key)&&b.hasCommittedMutations);let D=!1;E&&b?E.data.isEqual(b.data)?V!==N&&(n.track({type:3,doc:b}),D=!0):this.uu(E,b)||(n.track({type:2,doc:b}),D=!0,(u&&this.iu(b,u)>0||h&&this.iu(b,h)<0)&&(c=!0)):!E&&b?(n.track({type:0,doc:b}),D=!0):E&&!b&&(n.track({type:1,doc:E}),D=!0,(u||h)&&(c=!0)),D&&(b?(o=o.add(b),i=N?i.add(f):i.delete(f)):(o=o.delete(f),i=i.delete(f)))})),this.query.limit!==null)for(;o.size>this.query.limit;){const f=this.query.limitType==="F"?o.last():o.first();o=o.delete(f.key),i=i.delete(f.key),n.track({type:1,doc:f})}return{su:o,au:n,bs:c,mutatedKeys:i}}uu(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,n,s){const i=this.su;this.su=e.su,this.mutatedKeys=e.mutatedKeys;const o=e.au.Da();o.sort(((f,p)=>(function(b,V){const N=D=>{switch(D){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return M(20277,{Vt:D})}};return N(b)-N(V)})(f.type,p.type)||this.iu(f.doc,p.doc))),this.cu(n),s=s??!1;const c=t&&!s?this.lu():[],u=this.ru.size===0&&this.current&&!s?1:0,h=u!==this.nu;return this.nu=u,o.length!==0||h?{snapshot:new ar(this.query,e.su,i,o,e.mutatedKeys,u===0,h,!1,!!n&&n.resumeToken.approximateByteSize()>0),hu:c}:{hu:c}}Oa(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({su:this.su,au:new yh,mutatedKeys:this.mutatedKeys,bs:!1},!1)):{hu:[]}}Pu(e){return!this.tu.has(e)&&!!this.su.has(e)&&!this.su.get(e).hasLocalMutations}cu(e){e&&(e.addedDocuments.forEach((t=>this.tu=this.tu.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.tu=this.tu.delete(t))),this.current=e.current)}lu(){if(!this.current)return[];const e=this.ru;this.ru=K(),this.su.forEach((n=>{this.Pu(n.key)&&(this.ru=this.ru.add(n.key))}));const t=[];return e.forEach((n=>{this.ru.has(n)||t.push(new Pm(n))})),this.ru.forEach((n=>{e.has(n)||t.push(new bm(n))})),t}Tu(e){this.tu=e.ks,this.ru=K();const t=this._u(e.documents);return this.applyChanges(t,!0)}Iu(){return ar.fromInitialDocuments(this.query,this.su,this.mutatedKeys,this.nu===0,this.hasCachedResults)}}const gr="SyncEngine";class QE{constructor(e,t,n){this.query=e,this.targetId=t,this.view=n}}class JE{constructor(e){this.key=e,this.Eu=!1}}class YE{constructor(e,t,n,s,i,o){this.localStore=e,this.remoteStore=t,this.eventManager=n,this.sharedClientState=s,this.currentUser=i,this.maxConcurrentLimboResolutions=o,this.Ru={},this.Au=new ft((c=>gf(c)),eo),this.Vu=new Map,this.du=new Set,this.mu=new re(x.comparator),this.fu=new Map,this.gu=new gc,this.pu={},this.yu=new Map,this.wu=ht.ar(),this.onlineState="Unknown",this.Su=void 0}get isPrimaryClient(){return this.Su===!0}}async function XE(r,e,t=!0){const n=uo(r);let s;const i=n.Au.get(e);return i?(n.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.Iu()):s=await Cm(n,e,t,!0),s}async function ZE(r,e){const t=uo(r);await Cm(t,e,!0,!1)}async function Cm(r,e,t,n){const s=await Oi(r.localStore,Le(e)),i=s.targetId,o=r.sharedClientState.addLocalQueryTarget(i,t);let c;return n&&(c=await Pc(r,e,i,o==="current",s.resumeToken)),r.isPrimaryClient&&t&&co(r.remoteStore,s),c}async function Pc(r,e,t,n,s){r.bu=(p,E,b)=>(async function(N,D,G,z){let q=D.view._u(G);q.bs&&(q=await Pa(N.localStore,D.query,!1).then((({documents:I})=>D.view._u(I,q))));const se=z&&z.targetChanges.get(D.targetId),J=z&&z.targetMismatches.get(D.targetId)!=null,Y=D.view.applyChanges(q,N.isPrimaryClient,se,J);return xa(N,D.targetId,Y.hu),Y.snapshot})(r,p,E,b);const i=await Pa(r.localStore,e,!0),o=new WE(e,i.ks),c=o._u(i.documents),u=Ss.createSynthesizedTargetChangeForCurrentChange(t,n&&r.onlineState!=="Offline",s),h=o.applyChanges(c,r.isPrimaryClient,u);xa(r,t,h.hu);const f=new QE(e,t,o);return r.Au.set(e,f),r.Vu.has(t)?r.Vu.get(t).push(e):r.Vu.set(t,[e]),h.snapshot}async function ew(r,e,t){const n=L(r),s=n.Au.get(e),i=n.Vu.get(s.targetId);if(i.length>1)return n.Vu.set(s.targetId,i.filter((o=>!eo(o,e)))),void n.Au.delete(e);n.isPrimaryClient?(n.sharedClientState.removeLocalQueryTarget(s.targetId),n.sharedClientState.isActiveQueryTarget(s.targetId)||await ir(n.localStore,s.targetId,!1).then((()=>{n.sharedClientState.clearQueryState(s.targetId),t&&or(n.remoteStore,s.targetId),cr(n,s.targetId)})).catch(zt)):(cr(n,s.targetId),await ir(n.localStore,s.targetId,!0))}async function tw(r,e){const t=L(r),n=t.Au.get(e),s=t.Vu.get(n.targetId);t.isPrimaryClient&&s.length===1&&(t.sharedClientState.removeLocalQueryTarget(n.targetId),or(t.remoteStore,n.targetId))}async function nw(r,e,t){const n=kc(r);try{const s=await(function(o,c){const u=L(o),h=X.now(),f=c.reduce(((b,V)=>b.add(V.key)),K());let p,E;return u.persistence.runTransaction("Locally write mutations","readwrite",(b=>{let V=Me(),N=K();return u.xs.getEntries(b,f).next((D=>{V=D,V.forEach(((G,z)=>{z.isValidDocument()||(N=N.add(G))}))})).next((()=>u.localDocuments.getOverlayedDocuments(b,V))).next((D=>{p=D;const G=[];for(const z of c){const q=TT(z,p.get(z.key).overlayedDocument);q!=null&&G.push(new mt(z.key,q,af(q.value.mapValue),Ne.exists(!0)))}return u.mutationQueue.addMutationBatch(b,h,G,c)})).next((D=>{E=D;const G=D.applyToLocalDocumentSet(p,N);return u.documentOverlayCache.saveOverlays(b,D.batchId,G)}))})).then((()=>({batchId:E.batchId,changes:Tf(p)})))})(n.localStore,e);n.sharedClientState.addPendingMutation(s.batchId),(function(o,c,u){let h=o.pu[o.currentUser.toKey()];h||(h=new re(j)),h=h.insert(c,u),o.pu[o.currentUser.toKey()]=h})(n,s.batchId,t),await Gt(n,s.changes),await mr(n.remoteStore)}catch(s){const i=Rc(s,"Failed to persist write");t.reject(i)}}async function Vm(r,e){const t=L(r);try{const n=await gE(t.localStore,e);e.targetChanges.forEach(((s,i)=>{const o=t.fu.get(i);o&&(F(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1,22616),s.addedDocuments.size>0?o.Eu=!0:s.modifiedDocuments.size>0?F(o.Eu,14607):s.removedDocuments.size>0&&(F(o.Eu,42227),o.Eu=!1))})),await Gt(t,n,e)}catch(n){await zt(n)}}function Eh(r,e,t){const n=L(r);if(n.isPrimaryClient&&t===0||!n.isPrimaryClient&&t===1){const s=[];n.Au.forEach(((i,o)=>{const c=o.view.Oa(e);c.snapshot&&s.push(c.snapshot)})),(function(o,c){const u=L(o);u.onlineState=c;let h=!1;u.queries.forEach(((f,p)=>{for(const E of p.va)E.Oa(c)&&(h=!0)})),h&&bc(u)})(n.eventManager,e),s.length&&n.Ru.H_(s),n.onlineState=e,n.isPrimaryClient&&n.sharedClientState.setOnlineState(e)}}async function rw(r,e,t){const n=L(r);n.sharedClientState.updateQueryState(e,"rejected",t);const s=n.fu.get(e),i=s&&s.key;if(i){let o=new re(x.comparator);o=o.insert(i,ue.newNoDocument(i,U.min()));const c=K().add(i),u=new fr(U.min(),new Map,new re(j),o,c);await Vm(n,u),n.mu=n.mu.remove(i),n.fu.delete(e),Dc(n)}else await ir(n.localStore,e,!1).then((()=>cr(n,e,t))).catch(zt)}async function sw(r,e){const t=L(r),n=e.batch.batchId;try{const s=await pE(t.localStore,e);Vc(t,n,null),Cc(t,n),t.sharedClientState.updateMutationState(n,"acknowledged"),await Gt(t,s)}catch(s){await zt(s)}}async function iw(r,e,t){const n=L(r);try{const s=await(function(o,c){const u=L(o);return u.persistence.runTransaction("Reject batch","readwrite-primary",(h=>{let f;return u.mutationQueue.lookupMutationBatch(h,c).next((p=>(F(p!==null,37113),f=p.keys(),u.mutationQueue.removeMutationBatch(h,p)))).next((()=>u.mutationQueue.performConsistencyCheck(h))).next((()=>u.documentOverlayCache.removeOverlaysForBatchId(h,f,c))).next((()=>u.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(h,f))).next((()=>u.localDocuments.getDocuments(h,f)))}))})(n.localStore,e);Vc(n,e,t),Cc(n,e),n.sharedClientState.updateMutationState(e,"rejected",t),await Gt(n,s)}catch(s){await zt(s)}}function Cc(r,e){(r.yu.get(e)||[]).forEach((t=>{t.resolve()})),r.yu.delete(e)}function Vc(r,e,t){const n=L(r);let s=n.pu[n.currentUser.toKey()];if(s){const i=s.get(e);i&&(t?i.reject(t):i.resolve(),s=s.remove(e)),n.pu[n.currentUser.toKey()]=s}}function cr(r,e,t=null){r.sharedClientState.removeLocalQueryTarget(e);for(const n of r.Vu.get(e))r.Au.delete(n),t&&r.Ru.Du(n,t);r.Vu.delete(e),r.isPrimaryClient&&r.gu.Gr(e).forEach((n=>{r.gu.containsKey(n)||Dm(r,n)}))}function Dm(r,e){r.du.delete(e.path.canonicalString());const t=r.mu.get(e);t!==null&&(or(r.remoteStore,t),r.mu=r.mu.remove(e),r.fu.delete(t),Dc(r))}function xa(r,e,t){for(const n of t)n instanceof bm?(r.gu.addReference(n.key,e),ow(r,n)):n instanceof Pm?(C(gr,"Document no longer in limbo: "+n.key),r.gu.removeReference(n.key,e),r.gu.containsKey(n.key)||Dm(r,n.key)):M(19791,{Cu:n})}function ow(r,e){const t=e.key,n=t.path.canonicalString();r.mu.get(t)||r.du.has(n)||(C(gr,"New document in limbo: "+t),r.du.add(n),Dc(r))}function Dc(r){for(;r.du.size>0&&r.mu.size<r.maxConcurrentLimboResolutions;){const e=r.du.values().next().value;r.du.delete(e);const t=new x(ee.fromString(e)),n=r.wu.next();r.fu.set(n,new JE(t)),r.mu=r.mu.insert(t,n),co(r.remoteStore,new Ye(Le(Zi(t.path)),n,"TargetPurposeLimboResolution",De.ce))}}async function Gt(r,e,t){const n=L(r),s=[],i=[],o=[];n.Au.isEmpty()||(n.Au.forEach(((c,u)=>{o.push(n.bu(u,e,t).then((h=>{var f;if((h||t)&&n.isPrimaryClient){const p=h?!h.fromCache:(f=t==null?void 0:t.targetChanges.get(u.targetId))==null?void 0:f.current;n.sharedClientState.updateQueryState(u.targetId,p?"current":"not-current")}if(h){s.push(h);const p=Ic.Es(u.targetId,h);i.push(p)}})))})),await Promise.all(o),n.Ru.H_(s),await(async function(u,h){const f=L(u);try{await f.persistence.runTransaction("notifyLocalViewChanges","readwrite",(p=>v.forEach(h,(E=>v.forEach(E.Ts,(b=>f.persistence.referenceDelegate.addReference(p,E.targetId,b))).next((()=>v.forEach(E.Is,(b=>f.persistence.referenceDelegate.removeReference(p,E.targetId,b)))))))))}catch(p){if(!$t(p))throw p;C(Tc,"Failed to update sequence numbers: "+p)}for(const p of h){const E=p.targetId;if(!p.fromCache){const b=f.vs.get(E),V=b.snapshotVersion,N=b.withLastLimboFreeSnapshotVersion(V);f.vs=f.vs.insert(E,N)}}})(n.localStore,i))}async function aw(r,e){const t=L(r);if(!t.currentUser.isEqual(e)){C(gr,"User change. New user:",e.toKey());const n=await lm(t.localStore,e);t.currentUser=e,(function(i,o){i.yu.forEach((c=>{c.forEach((u=>{u.reject(new O(P.CANCELLED,o))}))})),i.yu.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,n.removedBatchIds,n.addedBatchIds),await Gt(t,n.Ns)}}function cw(r,e){const t=L(r),n=t.fu.get(e);if(n&&n.Eu)return K().add(n.key);{let s=K();const i=t.Vu.get(e);if(!i)return s;for(const o of i){const c=t.Au.get(o);s=s.unionWith(c.view.ou)}return s}}async function uw(r,e){const t=L(r),n=await Pa(t.localStore,e.query,!0),s=e.view.Tu(n);return t.isPrimaryClient&&xa(t,e.targetId,s.hu),s}async function lw(r,e){const t=L(r);return fm(t.localStore,e).then((n=>Gt(t,n)))}async function hw(r,e,t,n){const s=L(r),i=await(function(c,u){const h=L(c),f=L(h.mutationQueue);return h.persistence.runTransaction("Lookup mutation documents","readonly",(p=>f.Xn(p,u).next((E=>E?h.localDocuments.getDocuments(p,E):v.resolve(null)))))})(s.localStore,e);i!==null?(t==="pending"?await mr(s.remoteStore):t==="acknowledged"||t==="rejected"?(Vc(s,e,n||null),Cc(s,e),(function(c,u){L(L(c).mutationQueue).nr(u)})(s.localStore,e)):M(6720,"Unknown batchState",{vu:t}),await Gt(s,i)):C(gr,"Cannot apply mutation batch with id: "+e)}async function dw(r,e){const t=L(r);if(uo(t),kc(t),e===!0&&t.Su!==!0){const n=t.sharedClientState.getAllActiveQueryTargets(),s=await wh(t,n.toArray());t.Su=!0,await ka(t.remoteStore,!0);for(const i of s)co(t.remoteStore,i)}else if(e===!1&&t.Su!==!1){const n=[];let s=Promise.resolve();t.Vu.forEach(((i,o)=>{t.sharedClientState.isLocalQueryTarget(o)?n.push(o):s=s.then((()=>(cr(t,o),ir(t.localStore,o,!0)))),or(t.remoteStore,o)})),await s,await wh(t,n),(function(o){const c=L(o);c.fu.forEach(((u,h)=>{or(c.remoteStore,h)})),c.gu.zr(),c.fu=new Map,c.mu=new re(x.comparator)})(t),t.Su=!1,await ka(t.remoteStore,!1)}}async function wh(r,e,t){const n=L(r),s=[],i=[];for(const o of e){let c;const u=n.Vu.get(o);if(u&&u.length!==0){c=await Oi(n.localStore,Le(u[0]));for(const h of u){const f=n.Au.get(h),p=await uw(n,f);p.snapshot&&i.push(p.snapshot)}}else{const h=await dm(n.localStore,o);c=await Oi(n.localStore,h),await Pc(n,km(h),o,!1,c.resumeToken)}s.push(c)}return n.Ru.H_(i),s}function km(r){return pf(r.path,r.collectionGroup,r.orderBy,r.filters,r.limit,"F",r.startAt,r.endAt)}function fw(r){return(function(t){return L(L(t).persistence).hs()})(L(r).localStore)}async function mw(r,e,t,n){const s=L(r);if(s.Su)return void C(gr,"Ignoring unexpected query state notification.");const i=s.Vu.get(e);if(i&&i.length>0)switch(t){case"current":case"not-current":{const o=await fm(s.localStore,_f(i[0])),c=fr.createSynthesizedRemoteEventForCurrentChange(e,t==="current",he.EMPTY_BYTE_STRING);await Gt(s,o,c);break}case"rejected":await ir(s.localStore,e,!0),cr(s,e,n);break;default:M(64155,t)}}async function pw(r,e,t){const n=uo(r);if(n.Su){for(const s of e){if(n.Vu.has(s)&&n.sharedClientState.isActiveQueryTarget(s)){C(gr,"Adding an already active target "+s);continue}const i=await dm(n.localStore,s),o=await Oi(n.localStore,i);await Pc(n,km(i),o.targetId,!1,o.resumeToken),co(n.remoteStore,o)}for(const s of t)n.Vu.has(s)&&await ir(n.localStore,s,!1).then((()=>{or(n.remoteStore,s),cr(n,s)})).catch(zt)}}function uo(r){const e=L(r);return e.remoteStore.remoteSyncer.applyRemoteEvent=Vm.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=cw.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=rw.bind(null,e),e.Ru.H_=KE.bind(null,e.eventManager),e.Ru.Du=GE.bind(null,e.eventManager),e}function kc(r){const e=L(r);return e.remoteStore.remoteSyncer.applySuccessfulWrite=sw.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=iw.bind(null,e),e}class hs{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=oo(e.databaseInfo.databaseId),this.sharedClientState=this.Mu(e),this.persistence=this.xu(e),await this.persistence.start(),this.localStore=this.Ou(e),this.gcScheduler=this.Nu(e,this.localStore),this.indexBackfillerScheduler=this.Bu(e,this.localStore)}Nu(e,t){return null}Bu(e,t){return null}Ou(e){return um(this.persistence,new cm,e.initialUser,this.serializer)}xu(e){return new _c(io.Vi,this.serializer)}Mu(e){return new ym}async terminate(){var e,t;(e=this.gcScheduler)==null||e.stop(),(t=this.indexBackfillerScheduler)==null||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}hs.provider={build:()=>new hs};class gw extends hs{constructor(e){super(),this.cacheSizeBytes=e}Nu(e,t){F(this.persistence.referenceDelegate instanceof xi,46915);const n=this.persistence.referenceDelegate.garbageCollector;return new nm(n,e.asyncQueue,t)}xu(e){const t=this.cacheSizeBytes!==void 0?Ae.withCacheSize(this.cacheSizeBytes):Ae.DEFAULT;return new _c((n=>xi.Vi(n,t)),this.serializer)}}class Nm extends hs{constructor(e,t,n){super(),this.Lu=e,this.cacheSizeBytes=t,this.forceOwnership=n,this.kind="persistent",this.synchronizeTabs=!1}async initialize(e){await super.initialize(e),await this.Lu.initialize(this,e),await kc(this.Lu.syncEngine),await mr(this.Lu.remoteStore),await this.persistence.zi((()=>(this.gcScheduler&&!this.gcScheduler.started&&this.gcScheduler.start(),this.indexBackfillerScheduler&&!this.indexBackfillerScheduler.started&&this.indexBackfillerScheduler.start(),Promise.resolve())))}Ou(e){return um(this.persistence,new cm,e.initialUser,this.serializer)}Nu(e,t){const n=this.persistence.referenceDelegate.garbageCollector;return new nm(n,e.asyncQueue,t)}Bu(e,t){const n=new EI(t,this.persistence);return new TI(e.asyncQueue,n)}xu(e){const t=am(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey),n=this.cacheSizeBytes!==void 0?Ae.withCacheSize(this.cacheSizeBytes):Ae.DEFAULT;return new yc(this.synchronizeTabs,t,e.clientId,n,e.asyncQueue,Im(),hi(),this.serializer,this.sharedClientState,!!this.forceOwnership)}Mu(e){return new ym}}class _w extends Nm{constructor(e,t){super(e,t,!1),this.Lu=e,this.cacheSizeBytes=t,this.synchronizeTabs=!0}async initialize(e){await super.initialize(e);const t=this.Lu.syncEngine;this.sharedClientState instanceof Yo&&(this.sharedClientState.syncEngine={bo:hw.bind(null,t),Do:mw.bind(null,t),Co:pw.bind(null,t),hs:fw.bind(null,t),So:lw.bind(null,t)},await this.sharedClientState.start()),await this.persistence.zi((async n=>{await dw(this.Lu.syncEngine,n),this.gcScheduler&&(n&&!this.gcScheduler.started?this.gcScheduler.start():n||this.gcScheduler.stop()),this.indexBackfillerScheduler&&(n&&!this.indexBackfillerScheduler.started?this.indexBackfillerScheduler.start():n||this.indexBackfillerScheduler.stop())}))}Mu(e){const t=Im();if(!Yo.v(t))throw new O(P.UNIMPLEMENTED,"IndexedDB persistence is only available on platforms that support LocalStorage.");const n=am(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey);return new Yo(t,e.asyncQueue,n,e.clientId,e.initialUser)}}class ds{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=n=>Eh(this.syncEngine,n,1),this.remoteStore.remoteSyncer.handleCredentialChange=aw.bind(null,this.syncEngine),await ka(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new qE})()}createDatastore(e){const t=oo(e.databaseInfo.databaseId),n=vE(e.databaseInfo);return PE(e.authCredentials,e.appCheckCredentials,n,t)}createRemoteStore(e){return(function(n,s,i,o,c){return new VE(n,s,i,o,c)})(this.localStore,this.datastore,e.asyncQueue,(t=>Eh(this.syncEngine,t,0)),(function(){return ph.v()?new ph:new IE})())}createSyncEngine(e,t){return(function(s,i,o,c,u,h,f){const p=new YE(s,i,o,c,u,h);return f&&(p.Su=!0),p})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await(async function(s){const i=L(s);C(nt,"RemoteStore shutting down."),i.da.add(5),await Rs(i),i.fa.shutdown(),i.ga.set("Unknown")})(this.remoteStore),(e=this.datastore)==null||e.terminate(),(t=this.eventManager)==null||t.terminate()}}ds.provider={build:()=>new ds};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yw{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.ku(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.ku(this.observer.error,e):le("Uncaught Error in snapshot listener:",e.toString()))}Ku(){this.muted=!0}ku(e,t){setTimeout((()=>{this.muted||e(t)}),0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qt="FirestoreClient";class Iw{constructor(e,t,n,s,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=n,this._databaseInfo=s,this.user=ve.UNAUTHENTICATED,this.clientId=Ga.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(n,(async o=>{C(qt,"Received user=",o.uid),await this.authCredentialListener(o),this.user=o})),this.appCheckCredentials.start(n,(o=>(C(qt,"Received new app check token=",o),this.appCheckCredentialListener(o,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this._databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new it;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const n=Rc(t,"Failed to shutdown persistence");e.reject(n)}})),e.promise}}async function Zo(r,e){r.asyncQueue.verifyOperationInProgress(),C(qt,"Initializing OfflineComponentProvider");const t=r.configuration;await e.initialize(t);let n=t.initialUser;r.setCredentialChangeListener((async s=>{n.isEqual(s)||(await lm(e.localStore,s),n=s)})),e.persistence.setDatabaseDeletedListener((()=>r.terminate())),r._offlineComponents=e}async function vh(r,e){r.asyncQueue.verifyOperationInProgress();const t=await Tw(r);C(qt,"Initializing OnlineComponentProvider"),await e.initialize(t,r.configuration),r.setCredentialChangeListener((n=>_h(e.remoteStore,n))),r.setAppCheckTokenChangeListener(((n,s)=>_h(e.remoteStore,s))),r._onlineComponents=e}async function Tw(r){if(!r._offlineComponents)if(r._uninitializedComponentsProvider){C(qt,"Using user provided OfflineComponentProvider");try{await Zo(r,r._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!(function(s){return s.name==="FirebaseError"?s.code===P.FAILED_PRECONDITION||s.code===P.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11})(t))throw t;qn("Error using user provided cache. Falling back to memory cache: "+t),await Zo(r,new hs)}}else C(qt,"Using default OfflineComponentProvider"),await Zo(r,new gw(void 0));return r._offlineComponents}async function xm(r){return r._onlineComponents||(r._uninitializedComponentsProvider?(C(qt,"Using user provided OnlineComponentProvider"),await vh(r,r._uninitializedComponentsProvider._online)):(C(qt,"Using default OnlineComponentProvider"),await vh(r,new ds))),r._onlineComponents}function Ew(r){return xm(r).then((e=>e.syncEngine))}async function ww(r){const e=await xm(r),t=e.eventManager;return t.onListen=XE.bind(null,e.syncEngine),t.onUnlisten=ew.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=ZE.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=tw.bind(null,e.syncEngine),t}function vw(r,e,t={}){const n=new it;return r.asyncQueue.enqueueAndForget((async()=>(function(i,o,c,u,h){const f=new yw({next:E=>{f.Ku(),o.enqueueAndForget((()=>$E(i,p)));const b=E.docs.has(c);!b&&E.fromCache?h.reject(new O(P.UNAVAILABLE,"Failed to get document because the client is offline.")):b&&E.fromCache&&u&&u.source==="server"?h.reject(new O(P.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):h.resolve(E)},error:E=>h.reject(E)}),p=new HE(Zi(c.path),f,{includeMetadataChanges:!0,Wa:!0});return zE(i,p)})(await ww(r),r.asyncQueue,e,t,n))),n.promise}function Aw(r,e){const t=new it;return r.asyncQueue.enqueueAndForget((async()=>nw(await Ew(r),e,t))),t.promise}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Om(r){const e={};return r.timeoutSeconds!==void 0&&(e.timeoutSeconds=r.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sw="ComponentProvider",Ah=new Map;function Rw(r,e,t,n,s){return new QI(r,e,t,s.host,s.ssl,s.experimentalForceLongPolling,s.experimentalAutoDetectLongPolling,Om(s.experimentalLongPollingOptions),s.useFetchStreams,s.isUsingEmulator,n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bw="firestore.googleapis.com",Sh=!0;class Rh{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new O(P.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=bw,this.ssl=Sh}else this.host=e.host,this.ssl=e.ssl??Sh;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=Yf;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<tm)throw new O(P.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}_I("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Om(e.experimentalLongPollingOptions??{}),(function(n){if(n.timeoutSeconds!==void 0){if(isNaN(n.timeoutSeconds))throw new O(P.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (must not be NaN)`);if(n.timeoutSeconds<5)throw new O(P.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (minimum allowed value is 5)`);if(n.timeoutSeconds>30)throw new O(P.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(n,s){return n.timeoutSeconds===s.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Mm{constructor(e,t,n,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=n,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Rh({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new O(P.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new O(P.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Rh(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(n){if(!n)return new aI;switch(n.type){case"firstParty":return new lI(n.sessionIndex||"0",n.iamToken||null,n.authTokenFactory||null);case"provider":return n.client;default:throw new O(P.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const n=Ah.get(t);n&&(C(Sw,"Removing Datastore"),Ah.delete(t),n.terminate())})(this),Promise.resolve()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nc{constructor(e,t,n){this.converter=t,this._query=n,this.type="query",this.firestore=e}withConverter(e){return new Nc(this.firestore,e,this._query)}}class pe{constructor(e,t,n){this.converter=t,this._key=n,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new fs(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new pe(this.firestore,e,this._key)}toJSON(){return{type:pe._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,n){if(Es(t,pe._jsonSchema))return new pe(e,n||null,new x(ee.fromString(t.referencePath)))}}pe._jsonSchemaVersion="firestore/documentReference/1.0",pe._jsonSchema={type:fe("string",pe._jsonSchemaVersion),referencePath:fe("string")};class fs extends Nc{constructor(e,t,n){super(e,t,Zi(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new pe(this.firestore,null,new x(e))}withConverter(e){return new fs(this.firestore,e,this._path)}}function nv(r,e,...t){if(r=Fe(r),arguments.length===1&&(e=Ga.newId()),gI("doc","path",e),r instanceof Mm){const n=ee.fromString(e,...t);return gl(n),new pe(r,null,new x(n))}{if(!(r instanceof pe||r instanceof fs))throw new O(P.INVALID_ARGUMENT,"Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(ee.fromString(e,...t));return gl(n),new pe(r.firestore,r instanceof fs?r.converter:null,new x(n))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bh="AsyncQueue";class Ph{constructor(e=Promise.resolve()){this.rc=[],this.sc=!1,this.oc=[],this._c=null,this.ac=!1,this.uc=!1,this.cc=[],this.M_=new Tm(this,"async_queue_retry"),this.lc=()=>{const n=hi();n&&C(bh,"Visibility state changed to "+n.visibilityState),this.M_.w_()},this.hc=e;const t=hi();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.lc)}get isShuttingDown(){return this.sc}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.Pc(),this.Tc(e)}enterRestrictedMode(e){if(!this.sc){this.sc=!0,this.uc=e||!1;const t=hi();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.lc)}}enqueue(e){if(this.Pc(),this.sc)return new Promise((()=>{}));const t=new it;return this.Tc((()=>this.sc&&this.uc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.rc.push(e),this.Ic())))}async Ic(){if(this.rc.length!==0){try{await this.rc[0](),this.rc.shift(),this.M_.reset()}catch(e){if(!$t(e))throw e;C(bh,"Operation failed with retryable error: "+e)}this.rc.length>0&&this.M_.p_((()=>this.Ic()))}}Tc(e){const t=this.hc.then((()=>(this.ac=!0,e().catch((n=>{throw this._c=n,this.ac=!1,le("INTERNAL UNHANDLED ERROR: ",Ch(n)),n})).then((n=>(this.ac=!1,n))))));return this.hc=t,t}enqueueAfterDelay(e,t,n){this.Pc(),this.cc.indexOf(e)>-1&&(t=0);const s=Sc.createAndSchedule(this,e,t,n,(i=>this.Ec(i)));return this.oc.push(s),s}Pc(){this._c&&M(47125,{Rc:Ch(this._c)})}verifyOperationInProgress(){}async Ac(){let e;do e=this.hc,await e;while(e!==this.hc)}Vc(e){for(const t of this.oc)if(t.timerId===e)return!0;return!1}dc(e){return this.Ac().then((()=>{this.oc.sort(((t,n)=>t.targetTimeMs-n.targetTimeMs));for(const t of this.oc)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Ac()}))}mc(e){this.cc.push(e)}Ec(e){const t=this.oc.indexOf(e);this.oc.splice(t,1)}}function Ch(r){let e=r.message||"";return r.stack&&(e=r.stack.includes(r.message)?r.stack:r.message+`
`+r.stack),e}class lo extends Mm{constructor(e,t,n,s){super(e,t,n,s),this.type="firestore",this._queue=new Ph,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Ph(e),this._firestoreClient=void 0,await e}}}function rv(r,e,t){t||(t=Si);const n=La(r,"firestore");if(n.isInitialized(t)){const s=n.getImmediate({identifier:t}),i=n.getOptions(t);if(fn(i,e))return s;throw new O(P.FAILED_PRECONDITION,"initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.")}if(e.cacheSizeBytes!==void 0&&e.localCache!==void 0)throw new O(P.INVALID_ARGUMENT,"cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");if(e.cacheSizeBytes!==void 0&&e.cacheSizeBytes!==-1&&e.cacheSizeBytes<tm)throw new O(P.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");return e.host&&_s(e.host)&&zh(e.host),n.initialize({options:e,instanceIdentifier:t})}function Lm(r){if(r._terminated)throw new O(P.FAILED_PRECONDITION,"The client has already been terminated.");return r._firestoreClient||Pw(r),r._firestoreClient}function Pw(r){var n,s,i,o;const e=r._freezeSettings(),t=Rw(r._databaseId,((n=r._app)==null?void 0:n.options.appId)||"",r._persistenceKey,(s=r._app)==null?void 0:s.options.apiKey,e);r._componentsProvider||(i=e.localCache)!=null&&i._offlineComponentProvider&&((o=e.localCache)!=null&&o._onlineComponentProvider)&&(r._componentsProvider={_offline:e.localCache._offlineComponentProvider,_online:e.localCache._onlineComponentProvider}),r._firestoreClient=new Iw(r._authCredentials,r._appCheckCredentials,r._queue,t,r._componentsProvider&&(function(u){const h=u==null?void 0:u._online.build();return{_offline:u==null?void 0:u._offline.build(h),_online:h}})(r._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Be{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Be(he.fromBase64String(e))}catch(t){throw new O(P.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Be(he.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:Be._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(Es(e,Be._jsonSchema))return Be.fromBase64String(e.bytes)}}Be._jsonSchemaVersion="firestore/bytes/1.0",Be._jsonSchema={type:fe("string",Be._jsonSchemaVersion),bytes:fe("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xc{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new O(P.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new ae(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bs{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class et{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new O(P.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new O(P.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return j(this._lat,e._lat)||j(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:et._jsonSchemaVersion}}static fromJSON(e){if(Es(e,et._jsonSchema))return new et(e.latitude,e.longitude)}}et._jsonSchemaVersion="firestore/geoPoint/1.0",et._jsonSchema={type:fe("string",et._jsonSchemaVersion),latitude:fe("number"),longitude:fe("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $e{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(n,s){if(n.length!==s.length)return!1;for(let i=0;i<n.length;++i)if(n[i]!==s[i])return!1;return!0})(this._values,e._values)}toJSON(){return{type:$e._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(Es(e,$e._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new $e(e.vectorValues);throw new O(P.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}$e._jsonSchemaVersion="firestore/vectorValue/1.0",$e._jsonSchema={type:fe("string",$e._jsonSchemaVersion),vectorValues:fe("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cw=/^__.*__$/;class Vw{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return this.fieldMask!==null?new mt(e,this.data,this.fieldMask,t,this.fieldTransforms):new dr(e,this.data,t,this.fieldTransforms)}}class Fm{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return new mt(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function Um(r){switch(r){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw M(40011,{dataSource:r})}}class Oc{constructor(e,t,n,s,i,o){this.settings=e,this.databaseId=t,this.serializer=n,this.ignoreUndefinedProperties=s,i===void 0&&this.fc(),this.fieldTransforms=i||[],this.fieldMask=o||[]}get path(){return this.settings.path}get dataSource(){return this.settings.dataSource}i(e){return new Oc({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}yc(e){var s;const t=(s=this.path)==null?void 0:s.child(e),n=this.i({path:t,arrayElement:!1});return n.wc(e),n}Sc(e){var s;const t=(s=this.path)==null?void 0:s.child(e),n=this.i({path:t,arrayElement:!1});return n.fc(),n}bc(e){return this.i({path:void 0,arrayElement:!0})}Dc(e){return Ui(e,this.settings.methodName,this.settings.hasConverter||!1,this.path,this.settings.targetDoc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}fc(){if(this.path)for(let e=0;e<this.path.length;e++)this.wc(this.path.get(e))}wc(e){if(e.length===0)throw this.Dc("Document fields must not be empty");if(Um(this.dataSource)&&Cw.test(e))throw this.Dc('Document fields cannot begin and end with "__"')}}class Dw{constructor(e,t,n){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=n||oo(e)}V(e,t,n,s=!1){return new Oc({dataSource:e,methodName:t,targetDoc:n,path:ae.emptyPath(),arrayElement:!1,hasConverter:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Bm(r){const e=r._freezeSettings(),t=oo(r._databaseId);return new Dw(r._databaseId,!!e.ignoreUndefinedProperties,t)}function kw(r,e,t,n,s,i={}){const o=r.V(i.merge||i.mergeFields?2:0,e,t,s);Fc("Data must be an object, but it was:",o,n);const c=jm(n,o);let u,h;if(i.merge)u=new ke(o.fieldMask),h=o.fieldTransforms;else if(i.mergeFields){const f=[];for(const p of i.mergeFields){const E=ms(e,p,t);if(!o.contains(E))throw new O(P.INVALID_ARGUMENT,`Field '${E}' is specified in your field mask but missing from your input data.`);$m(f,E)||f.push(E)}u=new ke(f),h=o.fieldTransforms.filter((p=>u.covers(p.field)))}else u=null,h=o.fieldTransforms;return new Vw(new Se(c),u,h)}class ho extends bs{_toFieldTransform(e){if(e.dataSource!==2)throw e.dataSource===1?e.Dc(`${this._methodName}() can only appear at the top level of your update data`):e.Dc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof ho}}class Mc extends bs{_toFieldTransform(e){return new ac(e.path,new er)}isEqual(e){return e instanceof Mc}}class Lc extends bs{constructor(e,t){super(e),this.Fc=t}_toFieldTransform(e){const t=new rr(e.serializer,vf(e.serializer,this.Fc));return new ac(e.path,t)}isEqual(e){return e instanceof Lc&&this.Fc===e.Fc}}function Nw(r,e,t,n){const s=r.V(1,e,t);Fc("Data must be an object, but it was:",s,n);const i=[],o=Se.empty();Kt(n,((u,h)=>{const f=zm(e,u,t);h=Fe(h);const p=s.Sc(f);if(h instanceof ho)i.push(f);else{const E=fo(h,p);E!=null&&(i.push(f),o.set(f,E))}}));const c=new ke(i);return new Fm(o,c,s.fieldTransforms)}function xw(r,e,t,n,s,i){const o=r.V(1,e,t),c=[ms(e,n,t)],u=[s];if(i.length%2!=0)throw new O(P.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let E=0;E<i.length;E+=2)c.push(ms(e,i[E])),u.push(i[E+1]);const h=[],f=Se.empty();for(let E=c.length-1;E>=0;--E)if(!$m(h,c[E])){const b=c[E];let V=u[E];V=Fe(V);const N=o.Sc(b);if(V instanceof ho)h.push(b);else{const D=fo(V,N);D!=null&&(h.push(b),f.set(b,D))}}const p=new ke(h);return new Fm(f,p,o.fieldTransforms)}function fo(r,e){if(qm(r=Fe(r)))return Fc("Unsupported field value:",e,r),jm(r,e);if(r instanceof bs)return(function(n,s){if(!Um(s.dataSource))throw s.Dc(`${n._methodName}() can only be used with update() and set()`);if(!s.path)throw s.Dc(`${n._methodName}() is not currently supported inside arrays`);const i=n._toFieldTransform(s);i&&s.fieldTransforms.push(i)})(r,e),null;if(r===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),r instanceof Array){if(e.settings.arrayElement&&e.dataSource!==4)throw e.Dc("Nested arrays are not supported");return(function(n,s){const i=[];let o=0;for(const c of n){let u=fo(c,s.bc(o));u==null&&(u={nullValue:"NULL_VALUE"}),i.push(u),o++}return{arrayValue:{values:i}}})(r,e)}return(function(n,s){if((n=Fe(n))===null)return{nullValue:"NULL_VALUE"};if(typeof n=="number")return vf(s.serializer,n);if(typeof n=="boolean")return{booleanValue:n};if(typeof n=="string")return{stringValue:n};if(n instanceof Date){const i=X.fromDate(n);return{timestampValue:sr(s.serializer,i)}}if(n instanceof X){const i=new X(n.seconds,1e3*Math.floor(n.nanoseconds/1e3));return{timestampValue:sr(s.serializer,i)}}if(n instanceof et)return{geoPointValue:{latitude:n.latitude,longitude:n.longitude}};if(n instanceof Be)return{bytesValue:xf(s.serializer,n._byteString)};if(n instanceof pe){const i=s.databaseId,o=n.firestore._databaseId;if(!o.isEqual(i))throw s.Dc(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${i.projectId}/${i.database}`);return{referenceValue:fc(n.firestore._databaseId||s.databaseId,n._key.path)}}if(n instanceof $e)return(function(o,c){const u=o instanceof $e?o.toArray():o;return{mapValue:{fields:{[tc]:{stringValue:nc},[Jn]:{arrayValue:{values:u.map((f=>{if(typeof f!="number")throw c.Dc("VectorValues must only contain numeric values.");return oc(c.serializer,f)}))}}}}}})(n,s);if(Kf(n))return n._toProto(s.serializer);throw s.Dc(`Unsupported field value: ${Ha(n)}`)})(r,e)}function jm(r,e){const t={};return Yd(r)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Kt(r,((n,s)=>{const i=fo(s,e.yc(n));i!=null&&(t[n]=i)})),{mapValue:{fields:t}}}function qm(r){return!(typeof r!="object"||r===null||r instanceof Array||r instanceof Date||r instanceof X||r instanceof et||r instanceof Be||r instanceof pe||r instanceof bs||r instanceof $e||Kf(r))}function Fc(r,e,t){if(!qm(t)||!xd(t)){const n=Ha(t);throw n==="an object"?e.Dc(r+" a custom object"):e.Dc(r+" "+n)}}function ms(r,e,t){if((e=Fe(e))instanceof xc)return e._internalPath;if(typeof e=="string")return zm(r,e);throw Ui("Field path arguments must be of type string or ",r,!1,void 0,t)}const Ow=new RegExp("[~\\*/\\[\\]]");function zm(r,e,t){if(e.search(Ow)>=0)throw Ui(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,r,!1,void 0,t);try{return new xc(...e.split("."))._internalPath}catch{throw Ui(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,r,!1,void 0,t)}}function Ui(r,e,t,n,s){const i=n&&!n.isEmpty(),o=s!==void 0;let c=`Function ${e}() called with invalid data`;t&&(c+=" (via `toFirestore()`)"),c+=". ";let u="";return(i||o)&&(u+=" (found",i&&(u+=` in field ${n}`),o&&(u+=` in document ${s}`),u+=")"),new O(P.INVALID_ARGUMENT,c+r+u)}function $m(r,e){return r.some((t=>t.isEqual(e)))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mw{convertValue(e,t="none"){switch(Ut(e)){case 0:return null;case 1:return e.booleanValue;case 2:return oe(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(lt(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw M(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const n={};return Kt(e,((s,i)=>{n[s]=this.convertValue(i,t)})),n}convertVectorValue(e){var n,s,i;const t=(i=(s=(n=e.fields)==null?void 0:n[Jn].arrayValue)==null?void 0:s.values)==null?void 0:i.map((o=>oe(o.doubleValue)));return new $e(t)}convertGeoPoint(e){return new et(oe(e.latitude),oe(e.longitude))}convertArray(e,t){return(e.values||[]).map((n=>this.convertValue(n,t)))}convertServerTimestamp(e,t){switch(t){case"previous":const n=Ji(e);return n==null?null:this.convertValue(n,t);case"estimate":return this.convertTimestamp(cs(e));default:return null}}convertTimestamp(e){const t=ut(e);return new X(t.seconds,t.nanos)}convertDocumentKey(e,t){const n=ee.fromString(e);F($f(n),9688,{name:e});const s=new gn(n.get(1),n.get(3)),i=new x(n.popFirst(5));return s.isEqual(t)||le(`Document ${i} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lw extends Mw{constructor(e){super(),this.firestore=e}convertBytes(e){return new Be(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new pe(this.firestore,null,t)}}function sv(){return new Mc("serverTimestamp")}function iv(r){return new Lc("increment",r)}const Vh="@firebase/firestore",Dh="4.14.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Km{constructor(e,t,n,s,i){this._firestore=e,this._userDataWriter=t,this._key=n,this._document=s,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new pe(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new Fw(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}_fieldsProto(){var e;return((e=this._document)==null?void 0:e.data.clone().value.mapValue.fields)??void 0}get(e){if(this._document){const t=this._document.data.field(ms("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class Fw extends Km{data(){return super.data()}}function Uw(r,e,t){let n;return n=r?r.toFirestore(e):e,n}class Bw{constructor(e){let t;this.kind="persistent",e!=null&&e.tabManager?(e.tabManager._initialize(e),t=e.tabManager):(t=zw(void 0),t._initialize(e)),this._onlineComponentProvider=t._onlineComponentProvider,this._offlineComponentProvider=t._offlineComponentProvider}toJSON(){return{kind:this.kind}}}function ov(r){return new Bw(r)}class jw{constructor(e){this.forceOwnership=e,this.kind="persistentSingleTab"}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=ds.provider,this._offlineComponentProvider={build:t=>new Nm(t,e==null?void 0:e.cacheSizeBytes,this.forceOwnership)}}}class qw{constructor(){this.kind="PersistentMultipleTab"}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=ds.provider,this._offlineComponentProvider={build:t=>new _w(t,e==null?void 0:e.cacheSizeBytes)}}}function zw(r){return new jw(r==null?void 0:r.forceOwnership)}function av(){return new qw}class zr{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class dn extends Km{constructor(e,t,n,s,i,o){super(e,t,n,s,o),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new di(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const n=this._document.data.field(ms("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new O(P.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=dn._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}dn._jsonSchemaVersion="firestore/documentSnapshot/1.0",dn._jsonSchema={type:fe("string",dn._jsonSchemaVersion),bundleSource:fe("string","DocumentSnapshot"),bundleName:fe("string"),bundle:fe("string")};class di extends dn{data(e={}){return super.data(e)}}class es{constructor(e,t,n,s){this._firestore=e,this._userDataWriter=t,this._snapshot=s,this.metadata=new zr(s.hasPendingWrites,s.fromCache),this.query=n}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((n=>{e.call(t,new di(this._firestore,this._userDataWriter,n.key,n,new zr(this._snapshot.mutatedKeys.has(n.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new O(P.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(s,i){if(s._snapshot.oldDocs.isEmpty()){let o=0;return s._snapshot.docChanges.map((c=>{const u=new di(s._firestore,s._userDataWriter,c.doc.key,c.doc,new zr(s._snapshot.mutatedKeys.has(c.doc.key),s._snapshot.fromCache),s.query.converter);return c.doc,{type:"added",doc:u,oldIndex:-1,newIndex:o++}}))}{let o=s._snapshot.oldDocs;return s._snapshot.docChanges.filter((c=>i||c.type!==3)).map((c=>{const u=new di(s._firestore,s._userDataWriter,c.doc.key,c.doc,new zr(s._snapshot.mutatedKeys.has(c.doc.key),s._snapshot.fromCache),s.query.converter);let h=-1,f=-1;return c.type!==0&&(h=o.indexOf(c.doc.key),o=o.delete(c.doc.key)),c.type!==1&&(o=o.add(c.doc),f=o.indexOf(c.doc.key)),{type:$w(c.type),doc:u,oldIndex:h,newIndex:f}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new O(P.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=es._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=Ga.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],n=[],s=[];return this.docs.forEach((i=>{i._document!==null&&(t.push(i._document),n.push(this._userDataWriter.convertObjectMap(i._document.data.value.mapValue.fields,"previous")),s.push(i.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function $w(r){switch(r){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return M(61501,{type:r})}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */es._jsonSchemaVersion="firestore/querySnapshot/1.0",es._jsonSchema={type:fe("string",es._jsonSchemaVersion),bundleSource:fe("string","QuerySnapshot"),bundleName:fe("string"),bundle:fe("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cv(r){r=$n(r,pe);const e=$n(r.firestore,lo),t=Lm(e);return vw(t,r._key).then((n=>Kw(e,r,n)))}function uv(r,e,t){r=$n(r,pe);const n=$n(r.firestore,lo),s=Uw(r.converter,e),i=Bm(n);return Gm(n,[kw(i,"setDoc",r._key,s,r.converter!==null,t).toMutation(r._key,Ne.none())])}function lv(r,e,t,...n){r=$n(r,pe);const s=$n(r.firestore,lo),i=Bm(s);let o;return o=typeof(e=Fe(e))=="string"||e instanceof xc?xw(i,"updateDoc",r._key,e,t,n):Nw(i,"updateDoc",r._key,e),Gm(s,[o.toMutation(r._key,Ne.exists(!0))])}function Gm(r,e){const t=Lm(r);return Aw(t,e)}function Kw(r,e,t){const n=t.docs.get(e._key),s=new Lw(r);return new dn(r,s,e._key,n,new zr(t.hasPendingWrites,t.fromCache),e.converter)}(function(e,t=!0){iI(ur),jn(new mn("firestore",((n,{instanceIdentifier:s,options:i})=>{const o=n.getProvider("app").getImmediate(),c=new lo(new cI(n.getProvider("auth-internal")),new hI(o,n.getProvider("app-check-internal")),JI(o,s),o);return i={useFetchStreams:t,...i},c._setSettings(i),c}),"PUBLIC").setMultipleInstances(!0)),Nt(Vh,Dh,e),Nt(Vh,Dh,"esm2020")})();var Gw="firebase",Hw="12.13.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Nt(Gw,Hw,"app");export{Xw as A,lv as B,mn as C,ps as E,dt as F,H as L,ur as S,La as _,Oa as a,qe as b,jn as c,Ww as d,Yw as e,Jw as f,fn as g,nv as h,Yg as i,Zw as j,Qw as k,cv as l,Fe as m,iv as n,Jg as o,rv as p,_s as q,qh as r,mg as s,ov as t,av as u,zh as v,Nt as w,sv as x,uv as y,ev as z};

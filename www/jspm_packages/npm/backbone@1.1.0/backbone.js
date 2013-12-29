//     Backbone.js 1.1.0
(function(){var t=this,e=t.Backbone,i=[];i.push;var s=i.slice;i.splice;var n;n="undefined"!=typeof exports?exports:t.Backbone={},n.VERSION="1.1.0";var r=t._;r||"undefined"==typeof require||(r=require("npm:underscore")),n.$=t.jQuery||t.Zepto||t.ender||t.$,n.noConflict=function(){return t.Backbone=e,this},n.emulateHTTP=!1,n.emulateJSON=!1;var a=n.Events={on:function(t,e,i){if(!h(this,"on",t,[e,i])||!e)return this;this._events||(this._events={});var s=this._events[t]||(this._events[t]=[]);return s.push({callback:e,context:i,ctx:i||this}),this},once:function(t,e,i){if(!h(this,"once",t,[e,i])||!e)return this;var s=this,n=r.once(function(){s.off(t,n),e.apply(this,arguments)});return n._callback=e,this.on(t,n,i)},off:function(t,e,i){var s,n,a,o,u,c,l,d;if(!this._events||!h(this,"off",t,[e,i]))return this;if(!t&&!e&&!i)return this._events={},this;for(o=t?[t]:r.keys(this._events),u=0,c=o.length;c>u;u++)if(t=o[u],a=this._events[t]){if(this._events[t]=s=[],e||i)for(l=0,d=a.length;d>l;l++)n=a[l],(e&&e!==n.callback&&e!==n.callback._callback||i&&i!==n.context)&&s.push(n);s.length||delete this._events[t]}return this},trigger:function(t){if(!this._events)return this;var e=s.call(arguments,1);if(!h(this,"trigger",t,e))return this;var i=this._events[t],n=this._events.all;return i&&u(i,e),n&&u(n,arguments),this},stopListening:function(t,e,i){var s=this._listeningTo;if(!s)return this;var n=!e&&!i;i||"object"!=typeof e||(i=this),t&&((s={})[t._listenId]=t);for(var a in s)t=s[a],t.off(e,i,this),(n||r.isEmpty(t._events))&&delete this._listeningTo[a];return this}},o=/\s+/,h=function(t,e,i,s){if(!i)return!0;if("object"==typeof i){for(var n in i)t[e].apply(t,[n,i[n]].concat(s));return!1}if(o.test(i)){for(var r=i.split(o),a=0,h=r.length;h>a;a++)t[e].apply(t,[r[a]].concat(s));return!1}return!0},u=function(t,e){var i,s=-1,n=t.length,r=e[0],a=e[1],o=e[2];switch(e.length){case 0:for(;++s<n;)(i=t[s]).callback.call(i.ctx);return;case 1:for(;++s<n;)(i=t[s]).callback.call(i.ctx,r);return;case 2:for(;++s<n;)(i=t[s]).callback.call(i.ctx,r,a);return;case 3:for(;++s<n;)(i=t[s]).callback.call(i.ctx,r,a,o);return;default:for(;++s<n;)(i=t[s]).callback.apply(i.ctx,e)}},c={listenTo:"on",listenToOnce:"once"};r.each(c,function(t,e){a[e]=function(e,i,s){var n=this._listeningTo||(this._listeningTo={}),a=e._listenId||(e._listenId=r.uniqueId("l"));return n[a]=e,s||"object"!=typeof i||(s=this),e[t](i,s,this),this}}),a.bind=a.on,a.unbind=a.off,r.extend(n,a);var l=n.Model=function(t,e){var i=t||{};e||(e={}),this.cid=r.uniqueId("c"),this.attributes={},e.collection&&(this.collection=e.collection),e.parse&&(i=this.parse(i,e)||{}),i=r.defaults({},i,r.result(this,"defaults")),this.set(i,e),this.changed={},this.initialize.apply(this,arguments)};r.extend(l.prototype,a,{changed:null,validationError:null,idAttribute:"id",initialize:function(){},toJSON:function(){return r.clone(this.attributes)},sync:function(){return n.sync.apply(this,arguments)},get:function(t){return this.attributes[t]},escape:function(t){return r.escape(this.get(t))},has:function(t){return null!=this.get(t)},set:function(t,e,i){var s,n,a,o,h,u,c,l;if(null==t)return this;if("object"==typeof t?(n=t,i=e):(n={})[t]=e,i||(i={}),!this._validate(n,i))return!1;a=i.unset,h=i.silent,o=[],u=this._changing,this._changing=!0,u||(this._previousAttributes=r.clone(this.attributes),this.changed={}),l=this.attributes,c=this._previousAttributes,this.idAttribute in n&&(this.id=n[this.idAttribute]);for(s in n)e=n[s],r.isEqual(l[s],e)||o.push(s),r.isEqual(c[s],e)?delete this.changed[s]:this.changed[s]=e,a?delete l[s]:l[s]=e;if(!h){o.length&&(this._pending=!0);for(var d=0,f=o.length;f>d;d++)this.trigger("change:"+o[d],this,l[o[d]],i)}if(u)return this;if(!h)for(;this._pending;)this._pending=!1,this.trigger("change",this,i);return this._pending=!1,this._changing=!1,this},unset:function(t,e){return this.set(t,void 0,r.extend({},e,{unset:!0}))},clear:function(t){var e={};for(var i in this.attributes)e[i]=void 0;return this.set(e,r.extend({},t,{unset:!0}))},hasChanged:function(t){return null==t?!r.isEmpty(this.changed):r.has(this.changed,t)},changedAttributes:function(t){if(!t)return this.hasChanged()?r.clone(this.changed):!1;var e,i=!1,s=this._changing?this._previousAttributes:this.attributes;for(var n in t)r.isEqual(s[n],e=t[n])||((i||(i={}))[n]=e);return i},previous:function(t){return null!=t&&this._previousAttributes?this._previousAttributes[t]:null},previousAttributes:function(){return r.clone(this._previousAttributes)},fetch:function(t){t=t?r.clone(t):{},void 0===t.parse&&(t.parse=!0);var e=this,i=t.success;return t.success=function(s){return e.set(e.parse(s,t),t)?(i&&i(e,s,t),e.trigger("sync",e,s,t),void 0):!1},R(this,t),this.sync("read",this,t)},save:function(t,e,i){var s,n,a,o=this.attributes;if(null==t||"object"==typeof t?(s=t,i=e):(s={})[t]=e,i=r.extend({validate:!0},i),s&&!i.wait){if(!this.set(s,i))return!1}else if(!this._validate(s,i))return!1;s&&i.wait&&(this.attributes=r.extend({},o,s)),void 0===i.parse&&(i.parse=!0);var h=this,u=i.success;return i.success=function(t){h.attributes=o;var e=h.parse(t,i);return i.wait&&(e=r.extend(s||{},e)),r.isObject(e)&&!h.set(e,i)?!1:(u&&u(h,t,i),h.trigger("sync",h,t,i),void 0)},R(this,i),n=this.isNew()?"create":i.patch?"patch":"update","patch"===n&&(i.attrs=s),a=this.sync(n,this,i),s&&i.wait&&(this.attributes=o),a},destroy:function(t){t=t?r.clone(t):{};var e=this,i=t.success,s=function(){e.trigger("destroy",e,e.collection,t)};if(t.success=function(n){(t.wait||e.isNew())&&s(),i&&i(e,n,t),e.isNew()||e.trigger("sync",e,n,t)},this.isNew())return t.success(),!1;R(this,t);var n=this.sync("delete",this,t);return t.wait||s(),n},url:function(){var t=r.result(this,"urlRoot")||r.result(this.collection,"url")||j();return this.isNew()?t:t+("/"===t.charAt(t.length-1)?"":"/")+encodeURIComponent(this.id)},parse:function(t){return t},clone:function(){return new this.constructor(this.attributes)},isNew:function(){return null==this.id},isValid:function(t){return this._validate({},r.extend(t||{},{validate:!0}))},_validate:function(t,e){if(!e.validate||!this.validate)return!0;t=r.extend({},this.attributes,t);var i=this.validationError=this.validate(t,e)||null;return i?(this.trigger("invalid",this,i,r.extend(e,{validationError:i})),!1):!0}});var d=["keys","values","pairs","invert","pick","omit"];r.each(d,function(t){l.prototype[t]=function(){var e=s.call(arguments);return e.unshift(this.attributes),r[t].apply(r,e)}});var f=n.Collection=function(t,e){e||(e={}),e.model&&(this.model=e.model),void 0!==e.comparator&&(this.comparator=e.comparator),this._reset(),this.initialize.apply(this,arguments),t&&this.reset(t,r.extend({silent:!0},e))},p={add:!0,remove:!0,merge:!0},g={add:!0,remove:!1};r.extend(f.prototype,a,{model:l,initialize:function(){},toJSON:function(t){return this.map(function(e){return e.toJSON(t)})},sync:function(){return n.sync.apply(this,arguments)},add:function(t,e){return this.set(t,r.extend({merge:!1},e,g))},remove:function(t,e){var i=!r.isArray(t);t=i?[t]:r.clone(t),e||(e={});var s,n,a,o;for(s=0,n=t.length;n>s;s++)o=t[s]=this.get(t[s]),o&&(delete this._byId[o.id],delete this._byId[o.cid],a=this.indexOf(o),this.models.splice(a,1),this.length--,e.silent||(e.index=a,o.trigger("remove",o,this,e)),this._removeReference(o));return i?t[0]:t},set:function(t,e){e=r.defaults({},e,p),e.parse&&(t=this.parse(t,e));var i=!r.isArray(t);t=i?t?[t]:[]:r.clone(t);var s,n,a,o,h,u,c,d=e.at,f=this.model,g=this.comparator&&null==d&&e.sort!==!1,v=r.isString(this.comparator)?this.comparator:null,m=[],y=[],_={},b=e.add,w=e.merge,x=e.remove,E=!g&&b&&x?[]:!1;for(s=0,n=t.length;n>s;s++){if(h=t[s],a=h instanceof l?o=h:h[f.prototype.idAttribute],u=this.get(a))x&&(_[u.cid]=!0),w&&(h=h===o?o.attributes:h,e.parse&&(h=u.parse(h,e)),u.set(h,e),g&&!c&&u.hasChanged(v)&&(c=!0)),t[s]=u;else if(b){if(o=t[s]=this._prepareModel(h,e),!o)continue;m.push(o),o.on("all",this._onModelEvent,this),this._byId[o.cid]=o,null!=o.id&&(this._byId[o.id]=o)}E&&E.push(u||o)}if(x){for(s=0,n=this.length;n>s;++s)_[(o=this.models[s]).cid]||y.push(o);y.length&&this.remove(y,e)}if(m.length||E&&E.length)if(g&&(c=!0),this.length+=m.length,null!=d)for(s=0,n=m.length;n>s;s++)this.models.splice(d+s,0,m[s]);else{E&&(this.models.length=0);var T=E||m;for(s=0,n=T.length;n>s;s++)this.models.push(T[s])}if(c&&this.sort({silent:!0}),!e.silent){for(s=0,n=m.length;n>s;s++)(o=m[s]).trigger("add",o,this,e);(c||E&&E.length)&&this.trigger("sort",this,e)}return i?t[0]:t},reset:function(t,e){e||(e={});for(var i=0,s=this.models.length;s>i;i++)this._removeReference(this.models[i]);return e.previousModels=this.models,this._reset(),t=this.add(t,r.extend({silent:!0},e)),e.silent||this.trigger("reset",this,e),t},push:function(t,e){return this.add(t,r.extend({at:this.length},e))},pop:function(t){var e=this.at(this.length-1);return this.remove(e,t),e},unshift:function(t,e){return this.add(t,r.extend({at:0},e))},shift:function(t){var e=this.at(0);return this.remove(e,t),e},slice:function(){return s.apply(this.models,arguments)},get:function(t){return null==t?void 0:this._byId[t.id]||this._byId[t.cid]||this._byId[t]},at:function(t){return this.models[t]},where:function(t,e){return r.isEmpty(t)?e?void 0:[]:this[e?"find":"filter"](function(e){for(var i in t)if(t[i]!==e.get(i))return!1;return!0})},findWhere:function(t){return this.where(t,!0)},sort:function(t){if(!this.comparator)throw new Error("Cannot sort a set without a comparator");return t||(t={}),r.isString(this.comparator)||1===this.comparator.length?this.models=this.sortBy(this.comparator,this):this.models.sort(r.bind(this.comparator,this)),t.silent||this.trigger("sort",this,t),this},pluck:function(t){return r.invoke(this.models,"get",t)},fetch:function(t){t=t?r.clone(t):{},void 0===t.parse&&(t.parse=!0);var e=t.success,i=this;return t.success=function(s){var n=t.reset?"reset":"set";i[n](s,t),e&&e(i,s,t),i.trigger("sync",i,s,t)},R(this,t),this.sync("read",this,t)},create:function(t,e){if(e=e?r.clone(e):{},!(t=this._prepareModel(t,e)))return!1;e.wait||this.add(t,e);var i=this,s=e.success;return e.success=function(t,e,n){n.wait&&i.add(t,n),s&&s(t,e,n)},t.save(null,e),t},parse:function(t){return t},clone:function(){return new this.constructor(this.models)},_reset:function(){this.length=0,this.models=[],this._byId={}},_prepareModel:function(t,e){if(t instanceof l)return t.collection||(t.collection=this),t;e=e?r.clone(e):{},e.collection=this;var i=new this.model(t,e);return i.validationError?(this.trigger("invalid",this,i.validationError,e),!1):i},_removeReference:function(t){this===t.collection&&delete t.collection,t.off("all",this._onModelEvent,this)},_onModelEvent:function(t,e,i,s){("add"!==t&&"remove"!==t||i===this)&&("destroy"===t&&this.remove(e,s),e&&t==="change:"+e.idAttribute&&(delete this._byId[e.previous(e.idAttribute)],null!=e.id&&(this._byId[e.id]=e)),this.trigger.apply(this,arguments))}});var v=["forEach","each","map","collect","reduce","foldl","inject","reduceRight","foldr","find","detect","filter","select","reject","every","all","some","any","include","contains","invoke","max","min","toArray","size","first","head","take","initial","rest","tail","drop","last","without","difference","indexOf","shuffle","lastIndexOf","isEmpty","chain"];r.each(v,function(t){f.prototype[t]=function(){var e=s.call(arguments);return e.unshift(this.models),r[t].apply(r,e)}});var m=["groupBy","countBy","sortBy"];r.each(m,function(t){f.prototype[t]=function(e,i){var s=r.isFunction(e)?e:function(t){return t.get(e)};return r[t](this.models,s,i)}});var y=n.View=function(t){this.cid=r.uniqueId("view"),t||(t={}),r.extend(this,r.pick(t,b)),this._ensureElement(),this.initialize.apply(this,arguments),this.delegateEvents()},_=/^(\S+)\s*(.*)$/,b=["model","collection","el","id","attributes","className","tagName","events"];r.extend(y.prototype,a,{tagName:"div",$:function(t){return this.$el.find(t)},initialize:function(){},render:function(){return this},remove:function(){return this.$el.remove(),this.stopListening(),this},setElement:function(t,e){return this.$el&&this.undelegateEvents(),this.$el=t instanceof n.$?t:n.$(t),this.el=this.$el[0],e!==!1&&this.delegateEvents(),this},delegateEvents:function(t){if(!t&&!(t=r.result(this,"events")))return this;this.undelegateEvents();for(var e in t){var i=t[e];if(r.isFunction(i)||(i=this[t[e]]),i){var s=e.match(_),n=s[1],a=s[2];i=r.bind(i,this),n+=".delegateEvents"+this.cid,""===a?this.$el.on(n,i):this.$el.on(n,a,i)}}return this},undelegateEvents:function(){return this.$el.off(".delegateEvents"+this.cid),this},_ensureElement:function(){if(this.el)this.setElement(r.result(this,"el"),!1);else{var t=r.extend({},r.result(this,"attributes"));this.id&&(t.id=r.result(this,"id")),this.className&&(t["class"]=r.result(this,"className"));var e=n.$("<"+r.result(this,"tagName")+">").attr(t);this.setElement(e,!1)}}}),n.sync=function(t,e,i){var s=x[t];r.defaults(i||(i={}),{emulateHTTP:n.emulateHTTP,emulateJSON:n.emulateJSON});var a={type:s,dataType:"json"};if(i.url||(a.url=r.result(e,"url")||j()),null!=i.data||!e||"create"!==t&&"update"!==t&&"patch"!==t||(a.contentType="application/json",a.data=JSON.stringify(i.attrs||e.toJSON(i))),i.emulateJSON&&(a.contentType="application/x-www-form-urlencoded",a.data=a.data?{model:a.data}:{}),i.emulateHTTP&&("PUT"===s||"DELETE"===s||"PATCH"===s)){a.type="POST",i.emulateJSON&&(a.data._method=s);var o=i.beforeSend;i.beforeSend=function(t){return t.setRequestHeader("X-HTTP-Method-Override",s),o?o.apply(this,arguments):void 0}}"GET"===a.type||i.emulateJSON||(a.processData=!1),"PATCH"===a.type&&w&&(a.xhr=function(){return new ActiveXObject("Microsoft.XMLHTTP")});var h=i.xhr=n.ajax(r.extend(a,i));return e.trigger("request",e,h,i),h};var w=!("undefined"==typeof window||!window.ActiveXObject||window.XMLHttpRequest&&(new XMLHttpRequest).dispatchEvent),x={create:"POST",update:"PUT",patch:"PATCH","delete":"DELETE",read:"GET"};n.ajax=function(){return n.$.ajax.apply(n.$,arguments)};var E=n.Router=function(t){t||(t={}),t.routes&&(this.routes=t.routes),this._bindRoutes(),this.initialize.apply(this,arguments)},T=/\((.*?)\)/g,k=/(\(\?)?:\w+/g,S=/\*\w+/g,$=/[\-{}\[\]+?.,\\\^$|#\s]/g;r.extend(E.prototype,a,{initialize:function(){},route:function(t,e,i){r.isRegExp(t)||(t=this._routeToRegExp(t)),r.isFunction(e)&&(i=e,e=""),i||(i=this[e]);var s=this;return n.history.route(t,function(r){var a=s._extractParameters(t,r);i&&i.apply(s,a),s.trigger.apply(s,["route:"+e].concat(a)),s.trigger("route",e,a),n.history.trigger("route",s,e,a)}),this},navigate:function(t,e){return n.history.navigate(t,e),this},_bindRoutes:function(){if(this.routes){this.routes=r.result(this,"routes");for(var t,e=r.keys(this.routes);null!=(t=e.pop());)this.route(t,this.routes[t])}},_routeToRegExp:function(t){return t=t.replace($,"\\$&").replace(T,"(?:$1)?").replace(k,function(t,e){return e?t:"([^/]+)"}).replace(S,"(.*?)"),new RegExp("^"+t+"$")},_extractParameters:function(t,e){var i=t.exec(e).slice(1);return r.map(i,function(t){return t?decodeURIComponent(t):null})}});var H=n.History=function(){this.handlers=[],r.bindAll(this,"checkUrl"),"undefined"!=typeof window&&(this.location=window.location,this.history=window.history)},A=/^[#\/]|\s+$/g,I=/^\/+|\/+$/g,N=/msie [\w.]+/,O=/\/$/,P=/[?#].*$/;H.started=!1,r.extend(H.prototype,a,{interval:50,getHash:function(t){var e=(t||this).location.href.match(/#(.*)$/);return e?e[1]:""},getFragment:function(t,e){if(null==t)if(this._hasPushState||!this._wantsHashChange||e){t=this.location.pathname;var i=this.root.replace(O,"");t.indexOf(i)||(t=t.slice(i.length))}else t=this.getHash();return t.replace(A,"")},start:function(t){if(H.started)throw new Error("Backbone.history has already been started");H.started=!0,this.options=r.extend({root:"/"},this.options,t),this.root=this.options.root,this._wantsHashChange=this.options.hashChange!==!1,this._wantsPushState=!!this.options.pushState,this._hasPushState=!!(this.options.pushState&&this.history&&this.history.pushState);var e=this.getFragment(),i=document.documentMode,s=N.exec(navigator.userAgent.toLowerCase())&&(!i||7>=i);this.root=("/"+this.root+"/").replace(I,"/"),s&&this._wantsHashChange&&(this.iframe=n.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow,this.navigate(e)),this._hasPushState?n.$(window).on("popstate",this.checkUrl):this._wantsHashChange&&"onhashchange"in window&&!s?n.$(window).on("hashchange",this.checkUrl):this._wantsHashChange&&(this._checkUrlInterval=setInterval(this.checkUrl,this.interval)),this.fragment=e;var a=this.location,o=a.pathname.replace(/[^\/]$/,"$&/")===this.root;if(this._wantsHashChange&&this._wantsPushState){if(!this._hasPushState&&!o)return this.fragment=this.getFragment(null,!0),this.location.replace(this.root+this.location.search+"#"+this.fragment),!0;this._hasPushState&&o&&a.hash&&(this.fragment=this.getHash().replace(A,""),this.history.replaceState({},document.title,this.root+this.fragment+a.search))}return this.options.silent?void 0:this.loadUrl()},stop:function(){n.$(window).off("popstate",this.checkUrl).off("hashchange",this.checkUrl),clearInterval(this._checkUrlInterval),H.started=!1},route:function(t,e){this.handlers.unshift({route:t,callback:e})},checkUrl:function(){var t=this.getFragment();return t===this.fragment&&this.iframe&&(t=this.getFragment(this.getHash(this.iframe))),t===this.fragment?!1:(this.iframe&&this.navigate(t),this.loadUrl(),void 0)},loadUrl:function(t){return t=this.fragment=this.getFragment(t),r.any(this.handlers,function(e){return e.route.test(t)?(e.callback(t),!0):void 0})},navigate:function(t,e){if(!H.started)return!1;e&&e!==!0||(e={trigger:!!e});var i=this.root+(t=this.getFragment(t||""));if(t=t.replace(P,""),this.fragment!==t){if(this.fragment=t,""===t&&"/"!==i&&(i=i.slice(0,-1)),this._hasPushState)this.history[e.replace?"replaceState":"pushState"]({},document.title,i);else{if(!this._wantsHashChange)return this.location.assign(i);this._updateHash(this.location,t,e.replace),this.iframe&&t!==this.getFragment(this.getHash(this.iframe))&&(e.replace||this.iframe.document.open().close(),this._updateHash(this.iframe.location,t,e.replace))}return e.trigger?this.loadUrl(t):void 0}},_updateHash:function(t,e,i){if(i){var s=t.href.replace(/(javascript:|#).*$/,"");t.replace(s+"#"+e)}else t.hash="#"+e}}),n.history=new H;var C=function(t,e){var i,s=this;i=t&&r.has(t,"constructor")?t.constructor:function(){return s.apply(this,arguments)},r.extend(i,s,e);var n=function(){this.constructor=i};return n.prototype=s.prototype,i.prototype=new n,t&&r.extend(i.prototype,t),i.__super__=s.prototype,i};l.extend=f.extend=E.extend=y.extend=H.extend=C;var j=function(){throw new Error('A "url" property or function must be specified')},R=function(t,e){var i=e.error;e.error=function(s){i&&i(t,s,e),t.trigger("error",t,s,e)}}}).call(this);
//# sourceMappingURL=jspm_packages/npm/backbone@1.1.0/backbone.js.map
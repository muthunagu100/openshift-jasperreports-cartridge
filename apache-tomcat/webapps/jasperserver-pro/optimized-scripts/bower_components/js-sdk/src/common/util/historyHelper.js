define(["require","utils.common","jrs.configs"],function(e){e("utils.common");var o=e("jrs.configs");return{saveCurrent:function(e){new JSCookie(e,encodeURIComponent(document.location.href))},saveReferrer:function(e){-1===document.referrer.indexOf("login.html")&&new JSCookie(e,encodeURIComponent(document.referrer))},restore:function(e,n){var r=encodeURIComponent(document.location.href),t=new JSCookie(e).value;if(t&&t!==r){var i=decodeURIComponent(t);if(i)return void redirectToUrl(i)}n=n||"/",redirectToUrl(o.contextPath+n)}}});
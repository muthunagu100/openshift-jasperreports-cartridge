function makeCustomTooltip(t,o){hideCustomTooltip(t);var t=t?t:window.event,e=document.getElementById("customTooltipTemplate").cloneNode(!0);return e.style.display=o?"block":"none",e.setAttribute("id",customTooltip.TOOLTIP_ID),e.innerHTML=o,e.onmouseover=function(t){hideCustomTooltip(t)},e}function addCustomTooltip(t){document.body.appendChild(t),fitObjectIntoScreen(t,t.style.left,t.style.top,t.clientWidth,t.clientWidth)}function showCustomTooltip(t,o,e,l,i,n){var s=makeCustomTooltip(t,o);return e&&(s.style.maxWidth=e),i&&(s.style.backgroundColor=i),l&&(s.style.color=l),s.style.left=t.clientX+getScrollLeft(),s.style.top=t.clientY+getScrollTop()+5+(n?n:0),addCustomTooltip(s),s}function showCustomTooltipBelowObject(t,o,e,l,i){if(i.parentNode){var n=makeCustomTooltip(t,o);e&&(n.style.maxWidth=e),l&&(n.className=l);var s=getBoxOffsets(i),u=s[1]+i.clientHeight+5;return n.style.left=s[0],n.style.top=u,addCustomTooltip(n),n}}function updateCustomTooltip(t){var o=document.getElementById(customTooltip.TOOLTIP_ID);if(o){var e=o.getElementsByTagName("TD")[0];e.innerHTML=t,o.style.display="block",fitObjectIntoScreen(o,o.style.left,o.style.top,e.offsetWidth,e.offsetHeight)}}function hideCustomTooltip(t){var t=t?t:window.event,o=t.explicitOriginalTarget?getParentDiv(t.explicitOriginalTarget):null;if(!o||o.getAttribute("id")!=customTooltip.TOOLTIP_ID){var e=document.getElementById(customTooltip.TOOLTIP_ID);e&&(e.parentNode&&e.parentNode.removeChild(e),e=null)}}var customTooltip={};customTooltip.TOOLTIP_ID="custTooltip";
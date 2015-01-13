define(["require","underscore","../view/base/ComponentView","../view/designer/DesignerComponentView","../view/base/componentViewTrait/reportTrait","../view/base/componentViewTrait/webPageTrait","../view/base/componentViewTrait/textTrait","../view/base/componentViewTrait/filterGroupTrait","../view/base/componentViewTrait/inputControlTrait","../view/base/componentViewTrait/dashletTrait","../view/designer/componentViewTrait/designerDashletTrait","../view/designer/componentViewTrait/designerInputControlTrait","../view/designer/componentViewTrait/designerAdhocViewTrait","../view/designer/componentViewTrait/designerFilterGroupTrait","../enum/dashboardComponentTypes"],function(e){function i(e,i){for(var r in i)e[r]=e[r]&&t.isFunction(e[r])&&t.isFunction(i[r])?n(e[r],i[r]):i[r]}function n(e,i){return function(){return e.apply(this,arguments),i.apply(this,arguments)}}var t=e("underscore"),r=e("../view/base/ComponentView"),o=e("../view/designer/DesignerComponentView"),a=e("../view/base/componentViewTrait/reportTrait"),T=e("../view/base/componentViewTrait/webPageTrait"),w=e("../view/base/componentViewTrait/textTrait"),s=e("../view/base/componentViewTrait/filterGroupTrait"),p=e("../view/base/componentViewTrait/inputControlTrait"),d=e("../view/base/componentViewTrait/dashletTrait"),c=e("../view/designer/componentViewTrait/designerDashletTrait"),m=e("../view/designer/componentViewTrait/designerInputControlTrait"),v=e("../view/designer/componentViewTrait/designerAdhocViewTrait"),V=e("../view/designer/componentViewTrait/designerFilterGroupTrait"),u=e("../enum/dashboardComponentTypes"),g={},b={};return g[u.WEB_PAGE_VIEW]=T,g[u.FILTER_GROUP]=s,g[u.FREE_TEXT]=w,g[u.INPUT_CONTROL]=p,g[u.REPORT]=a,g[u.ADHOC_VIEW]=a,g[u.CROSSTAB]=a,g[u.CHART]=a,g[u.TABLE]=a,b[u.INPUT_CONTROL]=m,b[u.CROSSTAB]=v,b[u.CHART]=v,b[u.TABLE]=v,b[u.FILTER_GROUP]=V,function(e,n){var a=e.model.get("type"),T=n&&a in b?b:g,w=a!==u.INPUT_CONTROL?t.extend({},n?c:d):{};i(w,a in T?T[a]:{});var s=n?o:r,p=s.extend(w);return new p(e)}});
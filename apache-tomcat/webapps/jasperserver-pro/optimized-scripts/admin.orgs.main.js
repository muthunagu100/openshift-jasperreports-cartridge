define(["require","org.mng.components","org.mng.components","utils.common","csrf.guard","!domReady","underscore","org.mng.actions","jrs.configs"],function(n){n("org.mng.components"),n("org.mng.components"),n("utils.common"),n("csrf.guard");var o=n("!domReady"),e=n("underscore"),g=n("org.mng.actions"),r=n("jrs.configs");o(function(){"undefined"==typeof g.messages&&(g.messages={}),"undefined"==typeof g.Configuration&&(g.Configuration={}),e.extend(window.localContext,r.orgManagement.localContext),e.extend(g.messages,r.orgManagement.orgModule.messages),e.extend(g.Configuration,r.orgManagement.orgModule.Configuration),g.orgManager.initialize()})});
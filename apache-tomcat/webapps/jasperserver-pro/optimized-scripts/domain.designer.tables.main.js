define(["require","!domReady","domain.components","domain.designer.validators","jrs.configs","tools.drag","domain.designer.tables.validators"],function(o){var e=o("!domReady"),n=o("domain.components"),i=o("domain.designer.validators"),a=o("jrs.configs");o("tools.drag"),o("domain.designer.tables.validators"),e(function(){"undefined"==typeof window.localContext&&(window.localContext={}),_.extend(window.localContext,a.domainDesigner.localContext),_.extend(n._messages,a.domainDesigner.domain._messages),i.initialize()})});
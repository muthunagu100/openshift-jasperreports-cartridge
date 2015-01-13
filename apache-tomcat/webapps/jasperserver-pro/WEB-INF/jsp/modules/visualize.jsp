<%--
  ~ Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
  ~ http://www.jaspersoft.com.
  ~ Licensed under commercial Jaspersoft Subscription License Agreement
  --%>

<%@ page language="java" contentType="application/javascript" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

/**
 * @author: Igor Nesterenko, Sergey Prilukin
 * @version $Id: visualize.jsp 51369 2014-11-12 13:59:41Z sergey.prilukin $
 */

<jsp:include page="setScriptOptimizationProps.jsp"/>

<c:choose>
    <c:when test="${optimizeJavascript == true}">
        <jsp:include page="${scriptsFolderInternal}/bower_components/visualize-js/build/visualize.js" />
        <%-- Workaround to fix jquery.ui.datepicker in case if optimization is enabled. In this case __jrsConfigs__ will not be global --%>
        visualize.__jrsConfigs__["userLocale"] = "${userLocale}";
        visualize.__jrsConfigs__["avaliableLocales"] = ["de", "en", "es", "fr", "it", "ja", "ro", "zh_TW", "zh_CN"];

        <%--TODO: maybe it's better to move it to visualize.js--%>
        if (typeof define === "function" && define.amd) {
            define([], function () {
                return visualize;
            });
        }

    </c:when>
    <c:otherwise>
        <%-- Workaround to fix jquery.ui.datepicker. Set global __jrsConfigs__ property --%>
        var __jrsConfigs__ = {
            userLocale: "${userLocale}",
            avaliableLocales: ["de", "en", "es", "fr", "it", "ja", "ro", "zh_TW", "zh_CN"]
        };
        <%--Adding already optimized loader, not need in decomposing it--%>
        <jsp:include page="${scriptsFolderInternal}/bower_components/js-sdk/build/jasper.js" />
        <%--Use not optimized version of visualize for development proposes--%>
        <jsp:include page="${scriptsFolderInternal}/bower_components/visualize-js/src/bi/viz/visualize.js" />
    </c:otherwise>
</c:choose>

visualize.config({
    server : "${baseUrl}",
    scripts : "${scriptsFolder}",
    logEnabled: ${logEnabled},
    logLevel: "${logLevel}"
});

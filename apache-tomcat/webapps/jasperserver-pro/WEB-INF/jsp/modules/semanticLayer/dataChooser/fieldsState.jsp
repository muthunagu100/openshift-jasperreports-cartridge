<%--
  ~ Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
  ~ http://www.jaspersoft.com.
  ~ Licensed under commercial Jaspersoft Subscription License Agreement
  --%>

<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>

<script type="text/javascript">
    if (typeof domain === "undefined") {
        domain = {};
    }

    if (typeof domain._messages === "undefined") {
        domain._messages = {};
    }

    domain._messages["exitMessage"]  = '<spring:message code="domain.chooser.exitMessage" javaScriptEscape="true"/>';
    domain._messages["error.fromDifferentIslands"]  = '<spring:message code="page.fields.error.fromDifferentIslands" javaScriptEscape="true"/>';
    domain._messages["error.itemsDeleted"]  = '<spring:message code="page.fields.error.itemsDeleted" javaScriptEscape="true"/>';
    domain._messages["error.itemsMoved"]  = '<spring:message code="page.fields.error.itemsMoved" javaScriptEscape="true"/>';

    if (typeof localContext === "undefined") {
        localContext = {};
    }

    // Initialization of repository search init object.
    localContext.rsInitOptions = {
        flowExecutionKey: '${flowExecutionKey}',
        <c:if test="${invalidDomainFields eq null}">
            invalidFields: {},
        </c:if>
        <c:if test="${not (invalidDomainFields eq null)}">
            invalidFields: ${invalidDomainFields},
        </c:if>
        unsavedChangesPresent: ${unsavedChangesPresent}
        /*slSchemaTreeModel: ${slSchemaTreeModel},
        prevDataSource: '${sessionScope['semantic-layer-uri']}',
        itemsUsedInRules: [${itemsUsedInRules}],
        slBundlesConflict: ${slBundlesConflict},*/
    };

    if (typeof __jrsConfigs__.dataChooser === "undefined") {
        __jrsConfigs__.dataChooser = {};
    }

    __jrsConfigs__.dataChooser.localContext = localContext;
    __jrsConfigs__.dataChooser.domain = domain;

</script>

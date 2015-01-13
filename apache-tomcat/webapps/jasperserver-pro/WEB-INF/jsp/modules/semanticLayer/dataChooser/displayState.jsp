<%--
  ~ Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
  ~ http://www.jaspersoft.com.
  ~ Licensed under commercial Jaspersoft Subscription License Agreement
  --%>

<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>

<script type="text/javascript">
    if (typeof domain === "undefined") {
        domain = {};
    }

    if (typeof domain._messages === "undefined") {
        domain._messages = {};
    }

    domain._messages["exitMessage"]  = '<spring:message code="domain.chooser.exitMessage" javaScriptEscape="true"/>';
    domain._messages["sortingInfoWillBeLost"]  = '<spring:message code="page.display.sortingInfoWillBeLost" javaScriptEscape="true"/>';

    if (typeof localContext === "undefined") {
        localContext = {};
    }

    // Initialization of repository search init object.
    localContext.rsInitOptions = {
        flowExecutionKey: '${flowExecutionKey}',
        treeItemsModel: ${slSortedQueryTree},
        listItemsModel: ${slSortedQueryList},
        itemOriginalLabels: ${treeItemOriginalLabelsJSON},
        isFlatList: ${slIsTableAsList},
        unsavedChangesPresent: ${unsavedChangesPresent}
    };

    if (typeof __jrsConfigs__.dataChooser === "undefined") {
        __jrsConfigs__.dataChooser = {};
    }

    __jrsConfigs__.dataChooser.localContext = localContext;
    __jrsConfigs__.dataChooser.domain = domain;

</script>

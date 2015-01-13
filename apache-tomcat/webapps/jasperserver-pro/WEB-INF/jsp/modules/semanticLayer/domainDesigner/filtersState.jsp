<%--
~ Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
~ http://www.jaspersoft.com.
~ Licensed under commercial Jaspersoft Subscription License Agreement
--%>

<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<script type="text/javascript">
    if (typeof domain === "undefined") {
        domain = {};
    }

    if (typeof domain._messages === "undefined") {
        domain._messages = {};
    }

    domain._messages["exitMessage"]  = '<spring:message code="domain.designer.exitMessage" javaScriptEscape="true"/>';
    domain._messages["designIsValid"]  = '<spring:message code="domain.designer.designIsValid" javaScriptEscape="true"/>';
    domain._messages["yes"]  = '<spring:message code="button.designer.yes" javaScriptEscape="true"/>';
    domain._messages["no"]  = '<spring:message code="button.designer.no" javaScriptEscape="true"/>';
    domain._messages["ok"]  = '<spring:message code="DIALOG_CONFIRM_BUTTON_LABEL_OK" javaScriptEscape="true"/>';
    domain._messages["cancel"]  = '<spring:message code="DIALOG_CONFIRM_BUTTON_LABEL_CANCEL" javaScriptEscape="true"/>';

    domain._messages['ITEM_BEING_USED_BY_RESOURCE'] ='<spring:message code="ITEM_BEING_USED_BY_RESOURCE" javaScriptEscape="true"/>';
    domain._messages['resource.label'] ='<spring:message code="jsp.listResources.resource" javaScriptEscape="true"/>';
    domain._messages['field.label'] ='<spring:message code="DD_ITEM_PROPERTY_DIMENSION" javaScriptEscape="true"/>';
    domain._messages['resourcesWithNoAccess'] = '<spring:message code="DOMAIN_DEPENDENCY_NO_ACCES_TO_RESOURCE" javaScriptEscape="true"/>';

    if (typeof localContext === "undefined") {
        localContext = {};
    }

    // Initialization of repository search init object.
    localContext.domainInitOptions = {
        flowExecutionKey: '${flowExecutionKey}',
        datasourcesProperties: ${datasourcesProperties}, // Do not remove. used for common domain dsigner logic
        presentationSelected: ${presentationSelected}, // Do not remove. used for common domain dsigner logic
        dataSourceId: '${selectedDatasource}', // Do not remove. used for common domain dsigner logic
        javaToDataTypeMap : ${slObjectTypeMap},
        filtersJson : [<c:forEach items="${slRulesProvider}" var="item" varStatus="status">
                <c:out value="${item.json}" escapeXml="false"/>
                ${not status.last ? ',' : ''}
            </c:forEach>],
        dateFormat : '${dateFormat}',
        dateTimeFormat : '${dateTimeFormat}',
        timeFormat : '${timeFormat}',
        calendarDateFormat : '${calendarDateFormat}',
        calendarDateTimeFormat : '${calendarDateTimeFormat}',
        calendarTimeFormat : '${calendarTimeFormat}',
        validationDatePatten : '${validationDatePatten}',
        validationDateTimePatten : '${validationDateTimePatten}',
        validationTimePatten : '${validationTimePatten}',
        timeOffset : ${timeOffset},
        decimalSeparator : '${decimalSeparatorForUserLocale}',
        groupingSeparator : "${groupingSeparatorForUserLocale}",
        unsavedChangesPresent: ${unsavedChangesPresent},
        allowDesignerCloseWithValidationErrors: ${domainDependentsDontBlock}
    };

    if (typeof __jrsConfigs__.domainDesigner === "undefined") {
        __jrsConfigs__.domainDesigner = {};
    }

    // save references to variables defined in state
    __jrsConfigs__.domainDesigner.domain = domain;
    __jrsConfigs__.domainDesigner.localContext = localContext;

</script>
<jsp:include page="../filtersMessages.jsp"/>
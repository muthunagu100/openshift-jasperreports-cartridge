<%--
  ~ Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
  ~ http://www.jaspersoft.com.
  ~ Licensed under commercial Jaspersoft Subscription License Agreement
  --%>
<%@ page import="com.jaspersoft.ji.license.LicenseManager" %>

<%@ taglib prefix="spring" uri="/spring" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<script type="text/javascript">

    __jrsConfigs__.isEncryptionOn=${isEncryptionOn};

    __jrsConfigs__.loginState = {
        showLocaleMessage: '<spring:message code="jsp.Login.link.showLocale" javaScriptEscape="true"/>',
        hideLocaleMessage: '<spring:message code="jsp.Login.link.hideLocale" javaScriptEscape="true"/>',
        allowUserPasswordChange: ${allowUserPasswordChange},
        changePasswordMessage: '<spring:message code="jsp.Login.link.changePassword" javaScriptEscape="true"/>',
        cancelPasswordMessage: '<spring:message code="jsp.Login.link.cancelPassword" javaScriptEscape="true"/>',
        passwordExpirationInDays: ${passwordExpirationInDays},
        nonEmptyPasswordMessage: '<spring:message code="jsp.Login.link.nonEmptyPassword" javaScriptEscape="true"/>',
        passwordNotMatchMessage: '<spring:message code="jsp.Login.link.passwordNotMatch" javaScriptEscape="true"/>',
        <%
            String warningMessage = (String)request.getSession().getAttribute(LicenseManager.LICENSE_WARNING);
            if (warningMessage != null && warningMessage.length() > 0 ) {
        %>
        warningMessage: '<%= warningMessage %>',
        <%
            }
        %>
        organizationId: "${fn:escapeXml(param.orgId)}",
        singleOrganization: <%=((Boolean)request.getSession().getAttribute("singleOrganization")).booleanValue()%>
    };


</script>

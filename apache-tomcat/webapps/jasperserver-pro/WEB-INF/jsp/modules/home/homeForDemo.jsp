<%--
  ~ Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
  ~ http://www.jaspersoft.com.
  ~ Licensed under commercial Jaspersoft Subscription License Agreement
  --%>
<%@ page import="com.jaspersoft.ji.license.LicenseManager" %>
<%@ page import="com.jaspersoft.jasperserver.api.common.util.spring.StaticApplicationContext" %>
<%@ page import="com.jaspersoft.ji.license.LicenseReportCounter" %>

<%@ taglib prefix="t" uri="http://tiles.apache.org/tags-tiles" %>
<%@ taglib uri="/spring" prefix="spring"%>

<%
    request.setAttribute("homePage","true");
    LicenseManager licenseManager = LicenseManager.getInstance();
    LicenseReportCounter licenseReportCounter = StaticApplicationContext.getApplicationContext().getBean("licenseReportCounter", LicenseReportCounter.class);
%>

<%if (licenseReportCounter != null && licenseReportCounter.isReportRunsLimitReached()) {%>
    <script>
        window.location="${pageContext.request.contextPath}/dashboard/viewer.html?hidden_isJasperAnalysis=<%=licenseManager.isAnalysisFeatureSupported()?"true":"false"%>#${demoHomeResource}";
    </script>
<% } else {%>
    <t:insertTemplate template="/WEB-INF/jsp/templates/page.jsp">
        <t:putAttribute name="pageTitle"><spring:message code='home.title'/></t:putAttribute>
        <t:putAttribute name="bodyID">home_user</t:putAttribute>
        <t:putAttribute name="bodyClass" value="oneColumn"/>
        <t:putAttribute name="moduleName" value="commons.main"/>
        <t:putAttribute name="bodyContent" >
            <t:insertTemplate template="/WEB-INF/jsp/templates/container.jsp">
                <t:putAttribute name="containerClass" value="column decorated primary"/>
                <t:putAttribute name="containerTitle"><spring:message code="home.header.title"/></t:putAttribute>
                <t:putAttribute name="swipeScroll" value="${isIPad}"/>
                <t:putAttribute name="bodyContent">
                    <iframe id="outerFrame" class="outerDashboardFrame" name="Dashboard" allowtransparency="true" align="center" marginwidth="0" marginheight="0" hspace="0" vspace="0" frameborder="0" height="100%" width="100%" scrolling="no"
                            src="${pageContext.request.contextPath}/dashboard/viewer.html?decorate=no&hidden_isJasperAnalysis=<%=licenseManager.isAnalysisFeatureSupported()?"true":"false"%>#${demoHomeResource}">
                    </iframe>
                </t:putAttribute>
            </t:insertTemplate>
        </t:putAttribute>
    </t:insertTemplate>
<%}%>

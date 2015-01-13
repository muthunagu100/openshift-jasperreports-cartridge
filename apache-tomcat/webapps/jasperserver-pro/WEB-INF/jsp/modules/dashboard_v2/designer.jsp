<%@ taglib prefix="t" uri="http://tiles.apache.org/tags-tiles" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="authz"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>
<%@ taglib uri="/spring" prefix="spring"%>

<t:insertTemplate template="/WEB-INF/jsp/templates/page.jsp">
    <t:putAttribute name="pageTitle"><spring:message code='ADH_701_DASHBOARD_DESIGNER_HEADER'/></t:putAttribute>

    <t:putAttribute name="bodyID">dashboard</t:putAttribute>
    <t:putAttribute name="bodyClass" value="twoColumn dashboardDesigner"/>
    <t:putAttribute name="moduleName" value="dashboardDesignerPage"/>

    <t:putAttribute name="headerContent" >
    </t:putAttribute>
    <t:putAttribute name="bodyContent">
    </t:putAttribute>

</t:insertTemplate>
<%--
  ~ Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
  ~ http://www.jaspersoft.com.
  ~ Licensed under commercial Jaspersoft Subscription License Agreement
  --%>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<c:set var="contextTenantId" value="<%=session.getAttribute(\"tenantId\")%>"/>

<table cellspacing="2" cellpadding="2" border="2">
    <thead>
        <tr>
            <td><b>ROLE NAME</b></td>
            <td><b>EXTERNALLY DEFINED</b></td>
            <td colspan="2"><b>ACTIONS</b></td>
        </tr>
    </thead>
    <tbody>
    <c:forEach var="role" items="${roles}">
        <tr>
            <td>${role.roleName} <c:if test="${role.tenantId != null}">(${role.tenantId})</c:if></td>
            <td align="center">
                <input type="checkbox" name="enabled" disabled="disabled" ${(role.externallyDefined) ? 'checked="checked"' : ''}/>
            </td>
            <td width="50">
                <c:choose>
                    <c:when test="${role.tenantId != null || contextTenantId == null}">
                        <center><a href="#" onclick="doAction('${role.roleName}', '${role.tenantId}', 'edit');">Edit</a></center>
                    </c:when>
                    <c:otherwise>&nbsp;</c:otherwise>
                </c:choose>
            </td>
            <td width="50">
                <c:choose>
                    <c:when test="${role.tenantId != null || contextTenantId == null}">
                        <center><a href="#" onclick="doAction('${role.roleName}', '${role.tenantId}', 'delete');">Delete</a></center>
                    </c:when>
                    <c:otherwise>&nbsp;</c:otherwise>
                </c:choose>
            </td>
        </tr>
    </c:forEach>
    </tbody>
</table>

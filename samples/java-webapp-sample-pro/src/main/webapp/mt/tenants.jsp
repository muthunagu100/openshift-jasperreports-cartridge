<%--
  ~ Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
  ~ http://www.jaspersoft.com.
  ~ Licensed under commercial Jaspersoft Subscription License Agreement
  --%>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<div><b>Manage Organizations</b></div>
<br/>
<div>Current organization: <b>${tenant.tenantId}</b></div>
<br/>

<c:if test="${tenant.tenantUri != '/'}">
    <a href="??action=show&tenantId=${tenant.parentId}">[..]</a><br>
</c:if>    
<table cellspacing="2" cellpadding="2" border="1">
    <thead>
        <tr>
            <td>Name</td>
            <td>ID</td>
            <td colspan="2">Actions</td>
        </tr>
    </thead>
    <tbody>
    <c:forEach var="tenant" items="${tenants}">
        <tr>
            <td><a href="?action=show&tenantId=${tenant.tenantId}">${tenant.tenantName}</a></td>
            <td>${tenant.tenantId}</td>
            <td><a href="?action=edit&tenantId=${tenant.tenantId}">Edit</a></td>
            <td><a href="?action=delete&tenantId=${tenant.tenantId}">Delete</a></td>
        </tr>
    </c:forEach>
    </tbody>
</table>
<a href="?action=edit&parentId=${tenant.tenantId}&tenantId=">[Add Organization]</a>
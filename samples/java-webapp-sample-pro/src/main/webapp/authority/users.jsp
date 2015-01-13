<%--
  ~ Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
  ~ http://www.jaspersoft.com.
  ~ Licensed under commercial Jaspersoft Subscription License Agreement
  --%>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<table cellspacing="2" cellpadding="2" border="2">
    <thead>
        <tr>
            <td><b>USERNAME</b></td>
            <td><b>FULL NAME</b></td>
            <td><b>EMAIL</b></td>
            <td><b>ENABLED</b></td>
            <td><b>ROLES</b></td>
            <td colspan="2"></td>
        </tr>
    </thead>
    <tbody>
    <c:forEach var="user" items="${users}">
        <tr>
            <td>${user.username} <c:if test="${user.tenantId != null}">(${user.tenantId})</c:if></td>
            <td>${user.fullName}</td>
            <td><i>${user.emailAddress}</i></td>
            <td>
                <input type="checkbox" name="enabled" disabled="disabled" ${(user.enabled) ? 'checked="checked"' : ''}/>
            </td>
            <td>
                <c:set var="first" value="true"/>
                <c:forEach var="role" items="${user.roles}"><c:if test="${first != 'true'}">,&nbsp;</c:if><a href="role?searchName=${role.roleName}<c:if test="${role.tenantId != null}">&tenantId=${role.tenantId}</c:if>">${role.roleName} <c:if test="${role.tenantId != null}">(${role.tenantId})</c:if></a><c:set var="first" value="false"/></c:forEach>
                &nbsp;
            </td>
            <td width="50">
                <center><a href="#" onclick="doAction('${user.username}', '${user.tenantId}', 'edit');">Edit</a></center>
            </td>
            <td width="50">
                <center><a href="#" onclick="doAction('${user.username}', '${user.tenantId}', 'delete');">Delete</a></center>
            </td>
        </tr>
    </c:forEach>
    </tbody>
</table>

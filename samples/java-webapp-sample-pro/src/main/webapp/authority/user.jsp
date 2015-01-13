<%--
  ~ Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
  ~ http://www.jaspersoft.com.
  ~ Licensed under commercial Jaspersoft Subscription License Agreement
  --%>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<form name="updateForm" action="user" method="POST">
    <input type="hidden" name="action" value="put"/>

    <table cellspacing="2" cellpadding="2" border="0">
        <tbody>
        <tr>
            <td>Organization:</td>
            <td><input type="text" name="tenantId" value="${user.tenantId}" readonly/></td>
        </tr>
        <tr>
            <td>User Name:</td>
            <td><input type="text" name="username" value="${user.username}" <c:if test="${not empty user.username}">readonly</c:if>/></td>
        </tr>
        <tr>
            <td>Password:</td>
            <td><input type="password" name="password" value="${user.password}"/></td>
        </tr>
        <tr>
            <td>Full Name:</td>
            <td><input type="text" name="fullName" value="${user.fullName}"/></td>
        </tr>
        <tr>
            <td>Email Address:</td>
            <td><input type="text" name="emailAddress" value="${user.emailAddress}"/></td>
        </tr>
        <tr>
            <td>Enabled:</td>
            <td><input type="checkbox" name="enabled" ${(user.enabled) ? 'checked="checked"' : ''}/></td>
        </tr>
        <c:if test="${not empty roles}">
            <tr>
                <td valign="top">Assigned roles:</td>
                <td>
                    <table>
                        <c:forEach var="role" items="${roles}">
                            <tr>
                                <td>&nbsp;</td>
                                <td>
                                    <input type="checkbox" name="role_${role.role.roleName}|${role.role.tenantId}" <c:if test="${role.assigned}">checked</c:if>/> ${role.role.roleName} <c:if test="${role.role.tenantId != null}">(${role.role.tenantId})</c:if>
                                </td>
                            </tr>
                        </c:forEach>
                    </table>
                </td>
            </tr>
        </c:if>
        <tr>
            <td colspan="2">
                <center><input type="submit" name="save" value="Save" title="save"/></center>
            </td>
        </tr>
        </tbody>
    </table>
</form>

<%--
  ~ Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
  ~ http://www.jaspersoft.com.
  ~ Licensed under commercial Jaspersoft Subscription License Agreement
  --%>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<form name="updateForm" action="role" method="POST">
    <input type="hidden" name="action" value="put"/>
    <input type="hidden" name="oldRoleName" value="${role.roleName}"/>

    <table cellspacing="2" cellpadding="2" border="0">
        <tbody>
        <tr>
            <td>Organization Name:</td>
            <td><input type="text" name="tenantId" value="${role.tenantId}" readonly/></td>
        </tr>
        <tr>
            <td>Role Name:</td>
            <td><input type="text" name="roleName" value="${role.roleName}"/></td>
        </tr>
        <c:if test="${not empty users}">
            <tr>
                <td valign="top">Assigned users:</td>
                <td>
                    <table>
                        <c:forEach var="user" items="${users}">
                            <tr>
                                <td>&nbsp;</td>
                                <td>
                                    <input type="checkbox" name="user_${user.user.username}<c:if test="${user.user.tenantId != null}">|${user.user.tenantId}</c:if>" <c:if test="${user.assigned}">checked</c:if>/> ${user.user.username} <c:if test="${user.user.tenantId != null}">(${user.user.tenantId})</c:if>
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

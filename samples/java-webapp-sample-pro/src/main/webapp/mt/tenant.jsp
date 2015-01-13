<%--
  ~ Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
  ~ http://www.jaspersoft.com.
  ~ Licensed under commercial Jaspersoft Subscription License Agreement
  --%>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<form name="updateForm" action="?action=put" method="POST">
    <input type="hidden" name="action" value="put"/>

    <table cellspacing="2" cellpadding="2" border="0">
        <tbody>
        <tr>
            <td>Parent Organization:</td>
            <td><input type="text" name="parentId" value="${tenant.parentId}" readonly/></td>
        </tr>
        <tr>
            <td>Organization ID:</td>
            <td>
                <input type="text" name="tenantId" value="${tenant.tenantId}" <c:if test="${tenant.tenantId != null}">readonly</c:if>/>
            </td>
        </tr>
        <tr>
            <td>Organization Name:</td>
            <td><input type="text" name="tenantName" value="${tenant.tenantName}"/></td>
        </tr>
        <tr>
            <td>Organization Alias:</td>
            <td><input type="text" name="tenantAlias" value="${tenant.tenantAlias}"/></td>
        </tr>
        <tr>
            <td>Organization Description:</td>
            <td><textarea name="tenantDesc">${tenant.tenantDesc}</textarea></td>
        </tr>
        <tr>
            <td>Organization Theme:</td>
            <td><input type="text" name="tenantTheme" value="${tenant.theme}"/></td>
        </tr>
        <tr>
            <td>Organization Note:</td>
            <td><textarea name="tenantNote">${tenant.tenantNote}</textarea></td>
        </tr>
        <tr>
            <td>Organization URI:</td>
            <td><input type="text" name="tenantUri" value="${tenant.tenantUri}" readonly/></td>
        </tr>
        <tr>
            <td>Organization Folder URI:</td>
            <td><input type="text" name="tenantFolderUri" value="${tenant.tenantFolderUri}" readonly/></td>
        </tr>
        <tr>
            <td colspan="2">
                <center><input type="submit" name="save" value="Save" title="save"/></center>
            </td>
        </tr>
        </tbody>
    </table>
</form>

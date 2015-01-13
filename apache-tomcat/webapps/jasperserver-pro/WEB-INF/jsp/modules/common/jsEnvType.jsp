<%--
~ Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
~ http://www.jaspersoft.com.
~ Licensed under commercial Jaspersoft Subscription License Agreement
--%>

<%@ page import="com.jaspersoft.ji.license.LicenseManager" %>

<%
    LicenseManager licenseManager = LicenseManager.getInstance();
    request.setAttribute("isDevelopmentEnvironmentType", licenseManager.isDevelopmentEnvironmentType());
%>
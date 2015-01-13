<%--
  ~ Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
  ~ http://www.jaspersoft.com.
  ~ Licensed under commercial Jaspersoft Subscription License Agreement
  --%>

<%@page import="com.jaspersoft.jasperserver.ws.scheduling.ReportSchedulerFacade" %>
<%@page import="java.net.URL" %>
<%@page contentType="text/html" %>
<%@page pageEncoding="UTF-8" %>
<%
    String errorMessage = "";
    if (request.getParameter("username") != null &&
            request.getParameter("username").length() > 0) {
        String tenantId = request.getParameter("tenantId");
        if (tenantId != null && tenantId.trim().length() == 0) {
            tenantId = null;
        }

        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String wsUsername = tenantId == null ? username : (username + '|' + tenantId);

        session.setAttribute("tenantId", tenantId);
        session.setAttribute("username", username);
        session.setAttribute("password", password);
        session.setAttribute("wsUsername", wsUsername);


        com.jaspersoft.jasperserver.sample.WSClient client = new com.jaspersoft.ji.sample.WSClient(
                this.getServletContext().getInitParameter("webServiceUrl"),
                wsUsername,
                password);

        String reportSchedulingWebServiceUrl = getServletContext().getInitParameter("reportSchedulingWebServiceUrl");
        ReportSchedulerFacade reportScheduler = new ReportSchedulerFacade(new URL(reportSchedulingWebServiceUrl),
                wsUsername, password);

        try {
            client.list("/"); // Trick to check if the user is valid...
            if (session == null) session = request.getSession(true);
            session.setAttribute("client", client);

            session.setAttribute("ReportScheduler", reportScheduler);

            response.sendRedirect(request.getContextPath() + "/listReports.jsp");

        } catch (Exception ex) {
            ex.printStackTrace();
            errorMessage = ex.getMessage();
        }

    }

%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>JasperServer Web Services Sample Pro</title>
</head>
<body>

<h1>
    <center>JasperServer Web Services Sample Pro</center>
</h1>
<hr>

<h2><font color="red"><%=errorMessage%>
</font></h2>
<center>
    <form action="index.jsp" method=POST>

        Type in a JasperServer organization id/alias, username and password (i.e. organization_1/jasperadmin/jasperadmin)<br><br>

        Organization ID:<br/><input type="text" name="tenantId"><br>
        User ID:<br/><input type="text" name="username"><br>
        Password:<br/><input type="password" name="password"><br>

        <br>
        <input type="submit" value="Enter">

    </form>
</center>


</body>
</html>

<%--
  ~ Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
  ~ http://www.jaspersoft.com.
  ~ Licensed under commercial Jaspersoft Subscription License Agreement
  --%>

<%--<link rel="stylesheet" href="${pageContext.request.contextPath}/<spring:theme code="overrides_custom.css"/>" type="text/css" media="screen"/>--%>

<!-- These resources only needed for dash in dash -->
<c:if test='${!empty param.viewAsDashboardFrame}'>

    <link rel="stylesheet" href="${pageContext.request.contextPath}/themes/reset.css" type="text/css" media="screen">
	<link rel="stylesheet" href="${pageContext.request.contextPath}/<spring:theme code="buttons.css"/>" type="text/css" media="screen,print"/>
	<link rel="stylesheet" href="${pageContext.request.contextPath}/<spring:theme code="controls.css"/>" type="text/css" media="screen,print"/>
	<link rel="stylesheet" href="${pageContext.request.contextPath}/<spring:theme code="pageSpecific.css"/>" type="text/css" media="screen,print"/>
	<link rel="stylesheet" href="${pageContext.request.contextPath}/<spring:theme code="dialogSpecific.css"/>" type="text/css" media="screen,print"/>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/scripts/bower_components/jquery-ui/themes/jquery.ui.theme.css" type="text/css" media="screen,print"/>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/scripts/bower_components/jquery-ui/themes/redmond/jquery-ui-1.10.4-custom.css" type="text/css" media="screen">


    <!--[if IE]>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/<spring:theme code="overrides_ie.css"/>" type="text/css" media="screen"/>
<![endif]-->

	<style type="text/css">
		body {background:#fff;}
		.hidden {display:none;}
		.column.decorated.primary {border:none;border-radius:0;}
		.column.decorated.primary>.corner,
		.column.decorated.primary>.edge,
		/*.column.decorated.primary>.content>.header,*/
		.column.decorated.primary>.content .title,
		.column.decorated.primary>.content>.footer {
			display:none !important;
		}
		
		.column.decorated.primary,
		.column.decorated.primary>.content,
	    .column.decorated.primary>.content>.body {
			top:0;
			bottom:0;
			left:0;
			right:0;
			margin:0;
		}
		
		#display {overflow: visible;}

		#pageDimmer {
			position: absolute;
			top:0;
			left:0;
			right:0;
			bottom: 0;
			background-color: #000;
			opacity:.6;
		}

        #title {
            display: block;
            top: 0 !important;
        }

        #dashboardViewerFrame {
            position: relative;
            top: 0;
        }

        #dashboardViewerFrame.withTitle {
            top: 35px !important;
        }

		@media print {
			.floatingMenuContainer {
    			display:none;
			}
			#button_print {
				display:none;
			}
		}
	</style>
    <script type="text/javascript">
        if (typeof __jrsConfigs__.dashboardRuntime == "undefined") {
            __jrsConfigs__.dashboardRuntime = {};
        }
        __jrsConfigs__.dashboardRuntime.isRunInFrame = true;
	</script>
</c:if>

<%-- common input control imports --%>
<%@ include file="../inputControls/InputControlConstants.jsp"%>
<%@ include file="../inputControls/InputControlTemplates.jsp"%>
<%--
  ~ Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
  ~ http://www.jaspersoft.com.
  ~ Licensed under commercial Jaspersoft Subscription License Agreement
  --%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<%--Apply input controls--%>

<jsp:include page="../inputControls/commonInputControlsImports.jsp" />

<script type="text/javascript">
    if (typeof __jrsConfigs__.adhoc === "undefined") {
        __jrsConfigs__.adhoc = {}; // prepare variable to store all intermediate variables
    }

    __jrsConfigs__.adhoc.adhocDesigner = __jrsConfigs__.adhoc.adhocDesigner || {};
    __jrsConfigs__.adhoc.adhocDesigner.systemWarning = '${systemWarning}';
    __jrsConfigs__.adhoc.adhocDesignerViewModelViewType = "${viewModel.viewType}";
</script>

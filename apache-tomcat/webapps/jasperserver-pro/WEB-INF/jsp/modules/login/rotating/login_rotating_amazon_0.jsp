<%--
  ~ Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
  ~ http://www.jaspersoft.com.
  ~ Licensed under commercial Jaspersoft Subscription License Agreement
  --%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>

<c:set var="urlParams" value="${not empty ec2InstanceId ? '?awsinstanceid='.concat(ec2InstanceId) : ''}" />
<c:set var="paramDevider" value="${not empty urlParams ? '&' : '?'}" />
<c:set var="urlParams" value="${not empty awsAccountId ? urlParams.concat(paramDevider).concat('awsaccountid=').concat(awsAccountId) : urlParams}" />

<div class="primary">
	<h2 class="textAccent"><spring:message code='LOGIN_ROTATING_0_WHAT_IS_NEW'/></h2>
		<ul class="list decorated">
			<li><span class="sellPoint"><spring:message code='LOGIN_ROTATING_AMAZON_0_WHAT_IS_NEW_ITEM_1_1'/>:</span> <spring:message code='LOGIN_ROTATING_AMAZON_0_WHAT_IS_NEW_ITEM_1_2'/></li>
			<li><span class="sellPoint"><spring:message code='LOGIN_ROTATING_0_WHAT_IS_NEW_ITEM_1_1'/>:</span> <spring:message code='LOGIN_ROTATING_0_WHAT_IS_NEW_ITEM_1_2'/></li>
			<li><span class="sellPoint"><spring:message code='LOGIN_ROTATING_0_WHAT_IS_NEW_ITEM_2_1'/>:</span> <spring:message code='LOGIN_ROTATING_0_WHAT_IS_NEW_ITEM_2_2'/></li>
			<li><span class="sellPoint"><spring:message code='LOGIN_ROTATING_0_WHAT_IS_NEW_ITEM_3_1'/>:</span> <spring:message code='LOGIN_ROTATING_0_WHAT_IS_NEW_ITEM_3_2'/></li>
		</ul>
</div>
<div class="secondary">
	<h2 class="textAccent"><spring:message code='LOGIN_ROTATING_0_GETTING_STARTED'/></h2>
	<ul class="list decorated">
        <c:choose>
            <c:when test="${(awsProductType == 'PRO_HOURLY') || ((awsProductType == 'ENT_HOURLY'))}">
                <li><a class="launcher" href='<spring:message code="LOGIN_ROTATING_AMAZON_0_GETTING_STARTED_ITEM_4_URL"/>' target="_blank"><spring:message code='LOGIN_ROTATING_AMAZON_0_GETTING_STARTED_ITEM_4'/></a></li>
            </c:when>
            <c:when test="${awsProductType == 'PRO_ANNUAL'}">
                <li><a class="launcher" href='<spring:message code="LOGIN_ROTATING_AMAZON_0_GETTING_STARTED_ITEM_5_URL"/>' target="_blank"><spring:message code='LOGIN_ROTATING_AMAZON_0_GETTING_STARTED_ITEM_5'/></a></li>
            </c:when>

        </c:choose>
		<li><a class="launcher" href='<spring:message code="LOGIN_ROTATING_AMAZON_0_GETTING_STARTED_ITEM_1_URL" arguments="${awsAccountId}"/>' target="_blank"><spring:message code='LOGIN_ROTATING_AMAZON_0_GETTING_STARTED_ITEM_1'/></a></li>
		<li><a class="launcher" href='<spring:message code="LOGIN_ROTATING_AMAZON_0_GETTING_STARTED_ITEM_2_URL"/>' target="_blank"><spring:message code='LOGIN_ROTATING_AMAZON_0_GETTING_STARTED_ITEM_2'/></a></li>
		<li><a class="launcher" href='<spring:message code="LOGIN_ROTATING_AMAZON_0_GETTING_STARTED_ITEM_3_URL"/>' target="_blank"><spring:message code='LOGIN_ROTATING_AMAZON_0_GETTING_STARTED_ITEM_3'/></a></li>
    </ul>
</div>
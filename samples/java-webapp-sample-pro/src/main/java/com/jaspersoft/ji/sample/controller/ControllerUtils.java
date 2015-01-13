/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

package com.jaspersoft.ji.sample.controller;

import javax.servlet.http.HttpServletRequest;

/**
 * @author Yuriy Plakosh
 */
public class ControllerUtils {
    public final static String ROOT_TENANT = "organizations";
    public final static String PARAM_TENANT_ID = "tenantId";

    public final static String TENANT_SEPARATOR = "|";

    public static String parseName(String nameWithTenant) {
        if (nameWithTenant == null || nameWithTenant.trim().length() == 0) {
            return "";
        } else if (nameWithTenant.indexOf(TENANT_SEPARATOR) == -1) {
            return nameWithTenant;
        }

        return nameWithTenant.substring(0, nameWithTenant.indexOf(TENANT_SEPARATOR));
    }

    public static String parseTenant(String nameWithTenant) {
        if (nameWithTenant == null || nameWithTenant.trim().length() == 0) {
            return null;
        } else if (nameWithTenant.indexOf(TENANT_SEPARATOR) == -1) {
            return null;
        }
        
        String tenantId = nameWithTenant.substring(nameWithTenant.indexOf(TENANT_SEPARATOR) + 1);

        if (tenantId.trim().length() == 0) {
            tenantId = null;
        }

        return tenantId;
    }

    public static String getTenantFromRequest(HttpServletRequest request) {
        String tenantId = request.getParameter(PARAM_TENANT_ID);

        if (tenantId != null && tenantId.trim().length() == 0) {
            tenantId = null;
        }
        return tenantId;
    }

    public static String fixTenantId(String tenantId) {
        return ControllerUtils.ROOT_TENANT.equals(tenantId) ? null : tenantId;
    }
}

/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

package com.jaspersoft.ji.sample.controller;

import com.jaspersoft.jasperserver.sample.controller.WSServlet;
import com.jaspersoft.ji.ws.axis2.mt.generate.WSTenant;
import com.jaspersoft.ji.ws.client.controller.WSClientManager;
import com.jaspersoft.ji.ws.client.organization.OrganizationManagement;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.rpc.ServiceException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * @author Yuriy Plakosh
 */
public class TenantServlet extends WSServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doPost(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            String action = request.getParameter("action");
            request.setAttribute("action", action);
            if (action == null || action.trim().length() == 0) {
                action = "show";
            }

            if ("show".equals(action)) {
                doShowAction(request, response);
            } else if ("edit".equals(action)) {
                doEditAction(request, response);
            } else if ("put".equals(action)) {
                doPutAction(request, response);
            } else if ("delete".equals(action)) {
                doDeleteAction(request, response);
            }
        } catch (ServiceException e) {
            forwardError(e, request, response);
        }
    }

    private void doShowAction(HttpServletRequest request, HttpServletResponse response)
            throws ServiceException, IOException, ServletException {
        String tenantId = request.getParameter("tenantId");
        if (tenantId == null || tenantId.trim().length() == 0) {
            tenantId = (String)request.getSession().getAttribute("tenantId");
        }
        if (tenantId == null || tenantId.trim().length() == 0) {
            tenantId = ControllerUtils.ROOT_TENANT;
        }

        doShowAction(request, response, tenantId);
    }

    private void doShowAction(HttpServletRequest request, HttpServletResponse response, String tenantId)
            throws ServiceException, IOException, ServletException {
        OrganizationManagement organizationManagement =
                WSClientManager.getOrganizationsManagement(getBaseAddress(request));

        WSTenant tenant = organizationManagement.getTenant(tenantId);
        WSTenant[] tenants = organizationManagement.getSubTenantList(tenantId);

        List<WSTenant> tenantList = new ArrayList<WSTenant>();

        for (WSTenant tenantItem : tenants) {
            if (tenantItem.getParentId() != null && tenantItem.getParentId().equals(tenant.getTenantId())) {
                tenantList.add(tenantItem);
            }
        }

        request.setAttribute("tenant", tenant);
        request.setAttribute("tenants", tenantList);

        forward("mt/tenants.jsp", request, response);
    }

    private void doEditAction(HttpServletRequest request, HttpServletResponse response)
            throws ServiceException, IOException, ServletException {
        String tenantId = request.getParameter("tenantId");
        if (tenantId != null && tenantId.trim().length() == 0) {
            tenantId = null;
        }

        String parentId = request.getParameter("parentId");
        if (parentId == null || parentId.trim().length() == 0) {
            parentId = ControllerUtils.ROOT_TENANT;
        }

        WSTenant tenant;
        if (tenantId == null) {
            tenant = new WSTenant();
            tenant.setParentId(parentId);
        } else {
            OrganizationManagement organizationManagement =
                    WSClientManager.getOrganizationsManagement(getBaseAddress(request));

            tenant = organizationManagement.getTenant(tenantId);
        }

        request.setAttribute("tenant", tenant);

        forward("mt/tenant.jsp", request, response);
    }

    private void doPutAction(HttpServletRequest request, HttpServletResponse response)
            throws ServiceException, IOException, ServletException {
        String tenantId = request.getParameter("tenantId");
        if (tenantId != null && tenantId.trim().length() == 0) {
            throw new RuntimeException("Tenant ID cannot be null");
        }

        String parentId = request.getParameter("parentId");
        if (parentId != null && parentId.trim().length() == 0) {
             throw new RuntimeException("Parent ID cannot be null");
        }

        String tenantAlias = request.getParameter("tenantAlias");
        if (tenantAlias != null && tenantAlias.trim().length() == 0) {
             throw new RuntimeException("Parent ID cannot be null");
        }

        WSTenant wsTenant = new WSTenant();
        wsTenant.setTenantId(tenantId);
        wsTenant.setParentId(parentId);
        wsTenant.setTenantName(request.getParameter("tenantName"));
        wsTenant.setTenantAlias(tenantAlias);
        wsTenant.setTenantDesc(request.getParameter("tenantDesc"));
        wsTenant.setTenantNote(request.getParameter("tenantNote"));
        wsTenant.setTheme(request.getParameter("tenantTheme"));

        OrganizationManagement organizationManagement =
                    WSClientManager.getOrganizationsManagement(getBaseAddress(request));

        organizationManagement.putTenant(wsTenant);

        doShowAction(request, response);
    }

    private void doDeleteAction(HttpServletRequest request, HttpServletResponse response)
            throws ServiceException, IOException, ServletException {
        String tenantId = request.getParameter("tenantId");
        if (tenantId != null && tenantId.trim().length() == 0) {
            throw new RuntimeException("Tenant ID cannot be null");
        }

        OrganizationManagement organizationManagement =
                    WSClientManager.getOrganizationsManagement(getBaseAddress(request));

        WSTenant tenant = organizationManagement.getTenant(tenantId);
        organizationManagement.deleteTenant(tenantId);

        doShowAction(request, response, tenant.getParentId());
    }
}

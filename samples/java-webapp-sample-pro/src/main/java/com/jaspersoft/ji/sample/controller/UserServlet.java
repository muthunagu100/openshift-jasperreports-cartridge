/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

package com.jaspersoft.ji.sample.controller;

import com.jaspersoft.jasperserver.ws.authority.WSRole;
import com.jaspersoft.jasperserver.ws.authority.WSRoleSearchCriteria;
import com.jaspersoft.jasperserver.ws.authority.WSUser;
import com.jaspersoft.jasperserver.ws.authority.WSUserSearchCriteria;
import com.jaspersoft.jasperserver.ws.client.authority.UserAndRoleManagement;
import com.jaspersoft.ji.ws.axis2.mt.generate.WSTenant;
import com.jaspersoft.ji.ws.client.controller.WSClientManager;
import com.jaspersoft.ji.ws.client.organization.OrganizationManagement;

import javax.servlet.http.HttpServletRequest;
import javax.xml.rpc.ServiceException;
import java.rmi.RemoteException;
import java.util.*;

/**
 * @author Yuriy Plakosh
 */
public class UserServlet extends com.jaspersoft.jasperserver.sample.controller.UserServlet {

    @Override
    protected WSUserSearchCriteria createSearchCriteria(HttpServletRequest request, String searchName)
            throws RemoteException, ServiceException {
        WSUserSearchCriteria searchCriteria = new WSUserSearchCriteria();
        searchCriteria.setName(ControllerUtils.parseName(searchName));

        String tenantId = ControllerUtils.getTenantFromRequest(request);
        if (tenantId == null) {
            tenantId = (String)request.getSession().getAttribute("tenantId");
        }
        if (tenantId == null || tenantId.trim().length() == 0) {
            tenantId = ControllerUtils.ROOT_TENANT;
        }
        searchCriteria.setTenantId(ControllerUtils.fixTenantId(tenantId));

        searchCriteria.setMaxRecords(0);
        searchCriteria.setIncludeSubOrgs(Boolean.TRUE);
        searchCriteria.setRequiredRoles(null);

        OrganizationManagement organizationManagement = WSClientManager.getOrganizationsManagement(getBaseAddress(request));

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

        return searchCriteria;
    }

    protected WSUser getUser(HttpServletRequest request, String username, UserAndRoleManagement userAndRoleManagement)
            throws RemoteException {
        WSUserSearchCriteria searchCriteria = new WSUserSearchCriteria();

        searchCriteria.setName(username);

        String tenantId = ControllerUtils.getTenantFromRequest(request);
        searchCriteria.setTenantId(tenantId);

        searchCriteria.setMaxRecords(0);
        searchCriteria.setIncludeSubOrgs(Boolean.TRUE);
        searchCriteria.setRequiredRoles(null);

        WSUser[] users = userAndRoleManagement.findUsers(searchCriteria);

        for (WSUser user : users) {
            if (username.equals(user.getUsername()) &&
                    ((tenantId == null && user.getTenantId() == null)
                            || (tenantId != null && user.getTenantId() != null && tenantId.equals(user.getTenantId())))) {
                return user;
            }
        }

        return null;
    }

    @Override
    protected WSRole[] getAllRoles(HttpServletRequest request, UserAndRoleManagement userAndRoleManagement)
            throws RemoteException {
        WSRoleSearchCriteria searchCriteria = new WSRoleSearchCriteria("", null, false, 0);
        WSRole[] rootRoles = userAndRoleManagement.findRoles(searchCriteria);

        searchCriteria = new WSRoleSearchCriteria("",
                ControllerUtils.fixTenantId(ControllerUtils.getTenantFromRequest(request)), true, 0);
        WSRole[] tenantRoles = userAndRoleManagement.findRoles(searchCriteria);

        Set<WSRole> roles = new HashSet<WSRole>(rootRoles.length + tenantRoles.length);
        roles.addAll(Arrays.asList(rootRoles));
        roles.addAll(Arrays.asList(tenantRoles));

        return roles.toArray(new WSRole[roles.size()]);
    }

    protected void deleteUser(HttpServletRequest request, UserAndRoleManagement userAndRoleManagement) throws RemoteException {
        String username = request.getParameter(PARAM_USERNAME);
        String tenantId = ControllerUtils.getTenantFromRequest(request);

        WSUser user = new WSUser();
        user.setUsername(username);
        user.setTenantId(tenantId);

        userAndRoleManagement.deleteUser(user);
    }

    protected void putUser(HttpServletRequest request, UserAndRoleManagement userAndRoleManagement) throws RemoteException {
        String username = request.getParameter(PARAM_USERNAME);
        String password = request.getParameter(PARAM_PASSWORD);
        String fullName = request.getParameter(PARAM_FULLNAME);
        String emailAddress = request.getParameter(PARAM_EMAILADDRESS);
        boolean enabled = ( request.getParameter(PARAM_ENABLED)!=null && request.getParameter(PARAM_ENABLED).equals("on")) ? true : false;
        String tenantId = ControllerUtils.getTenantFromRequest(request);

        WSRole[] assignedRoles = getAssignedRoles(request, userAndRoleManagement);

        WSUser user = new WSUser();
        user.setUsername(username);
        user.setTenantId(ControllerUtils.fixTenantId(tenantId));
        user.setPassword(password);
        user.setFullName(fullName);
        user.setEmailAddress(emailAddress);
        user.setEnabled(enabled);
        user.setPreviousPasswordChangeTime(new Date());
        user.setRoles(assignedRoles);

        userAndRoleManagement.putUser(user);
    }

    protected WSRole[] getAssignedRoles(HttpServletRequest request, UserAndRoleManagement userAndRoleManagement)
            throws RemoteException {
        List<WSRole> roles = new ArrayList<WSRole>();
        for (Map.Entry<String, String[]> entry : (Set<Map.Entry<String, String[]>>)request.getParameterMap().entrySet()) {
            String key = entry.getKey();

            if (key.startsWith(PARAM_ROLE_PREFIX)) {
                String roleNameWithTenant = key.substring(PARAM_ROLE_PREFIX.length());

                WSRole[] wsRole = userAndRoleManagement.findRoles(
                        new WSRoleSearchCriteria(ControllerUtils.parseName(roleNameWithTenant),
                                ControllerUtils.parseTenant(roleNameWithTenant), false, 0));

                if (wsRole == null || wsRole.length == 0 || wsRole.length > 1) {
                    throw new RuntimeException("Problems to find role with role name '" + roleNameWithTenant + "'");
                }

                roles.add(wsRole[0]);
            }
        }

        return roles.toArray(new WSRole[roles.size()]);
    }

    protected WSUser getEditUser(HttpServletRequest request, UserAndRoleManagement userAndRoleManagement)
            throws RemoteException {
        String username = request.getParameter(PARAM_USERNAME);
        String tenantId = ControllerUtils.getTenantFromRequest(request);

        WSUser user;
        if (username != null && username.length() > 0) {
            user = getUser(request, username, userAndRoleManagement);
        } else {
            user = new WSUser();
            user.setTenantId(tenantId);
        }

        return user;
    }
}

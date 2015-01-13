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

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.rpc.ServiceException;
import java.io.IOException;
import java.rmi.RemoteException;
import java.util.*;

/**
 * @author Yuriy Plakosh
 */
public class RoleServlet extends com.jaspersoft.jasperserver.sample.controller.RoleServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String searchName = request.getParameter(PARAM_SEARCH_NAME);
        searchName = (searchName != null) ? searchName : "";

        String tenantId = ControllerUtils.getTenantFromRequest(request);
        if (tenantId == null) {
            tenantId = (String)request.getSession().getAttribute(ControllerUtils.PARAM_TENANT_ID);
        }
        if (tenantId == null || tenantId.trim().length() == 0) {
            tenantId = ControllerUtils.ROOT_TENANT;
        }

        UserAndRoleManagement userAndRoleManagement;
        try {
            userAndRoleManagement = WSClientManager.getUserAndRoleManagement(getBaseAddress(request));

            WSRoleSearchCriteria searchCriteria = createSearchCriteria(request, searchName, null, false);
            WSRole[] rootRoles = userAndRoleManagement.findRoles(searchCriteria);

            searchCriteria = createSearchCriteria(request, searchName, tenantId, true);
            WSRole[] tenantRoles = userAndRoleManagement.findRoles(searchCriteria);

            Set<WSRole> roles = new HashSet<WSRole>(rootRoles.length + tenantRoles.length);
            roles.addAll(Arrays.asList(rootRoles));
            roles.addAll(Arrays.asList(tenantRoles));

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

            request.setAttribute(ATTR_SEARCH_NAME, searchName);
            request.setAttribute(ATTR_ROLES, roles.toArray());
            request.setAttribute(ATTR_VIEW_MODE, "role");

            forward("authority/list.jsp", request, response);
        } catch (ServiceException e) {
            forwardError(e, request, response);
        }
    }

    protected WSRoleSearchCriteria createSearchCriteria(HttpServletRequest request, String searchName, String tenantId,
            boolean includeSubOrgs) throws RemoteException, ServiceException {
        WSRoleSearchCriteria searchCriteria = new WSRoleSearchCriteria();
        searchCriteria.setRoleName(searchName);

        searchCriteria.setTenantId(ControllerUtils.fixTenantId(tenantId));

        searchCriteria.setMaxRecords(0);
        searchCriteria.setIncludeSubOrgs(includeSubOrgs);

        return searchCriteria;
    }

    @Override
    protected WSRole getEditRole(HttpServletRequest request, UserAndRoleManagement userAndRoleManagement)
            throws RemoteException {
        String roleName = request.getParameter(PARAM_ROLE_NAME);
        String tenantId = ControllerUtils.getTenantFromRequest(request);

        WSRole role;
        if (roleName != null && roleName.length() > 0) {
            role = getRole(request, roleName, tenantId, userAndRoleManagement);
        } else {
            role = new WSRole();
            role.setTenantId(tenantId);
        }

        return role;
    }

    protected WSRole getRole(HttpServletRequest request, String roleName, String tenantId,
            UserAndRoleManagement userAndRoleManagement) throws RemoteException {
        WSRoleSearchCriteria searchCriteria = new WSRoleSearchCriteria();
        searchCriteria.setRoleName(roleName);

        if (tenantId == null) {
            tenantId = (String)request.getSession().getAttribute(ControllerUtils.PARAM_TENANT_ID);
        }
        searchCriteria.setTenantId(tenantId);

        searchCriteria.setMaxRecords(0);
        searchCriteria.setIncludeSubOrgs(Boolean.TRUE);

        WSRole[] roles = userAndRoleManagement.findRoles(searchCriteria);

        for (WSRole role : roles) {
            if (roleName.equals(role.getRoleName()) &&
                    ((tenantId == null && role.getTenantId() == null)
                            || (tenantId != null && role.getTenantId() != null && tenantId.equals(role.getTenantId())))) {
                return role;
            }
        }

        return null;
    }

    @Override
    protected WSUser[] getAllUsersForRole(HttpServletRequest request, WSRole role,
            UserAndRoleManagement userAndRoleManagement) throws RemoteException {
        WSUserSearchCriteria searchCriteria = new WSUserSearchCriteria("",
                ControllerUtils.fixTenantId(ControllerUtils.getTenantFromRequest(request)), true,
                (role == null) ? null : new WSRole[] {role}, 0);

        return userAndRoleManagement.findUsers(searchCriteria);
    }

    @Override
    protected WSRole getRole(HttpServletRequest request, String roleName, UserAndRoleManagement userAndRoleManagement)
            throws RemoteException {
        WSRoleSearchCriteria searchCriteria = new WSRoleSearchCriteria();
        searchCriteria.setRoleName(roleName);

        String tenantId = ControllerUtils.getTenantFromRequest(request);
        searchCriteria.setTenantId(tenantId);

        searchCriteria.setMaxRecords(0);
        searchCriteria.setIncludeSubOrgs(Boolean.TRUE);

        WSRole[] roles = userAndRoleManagement.findRoles(searchCriteria);

        for (WSRole role : roles) {
            if (roleName.equals(role.getRoleName()) &&
                    ((tenantId == null && role.getTenantId() == null)
                            || (tenantId != null && role.getTenantId() != null && tenantId.equals(role.getTenantId())))) {
                return role;
            }
        }

        return null;
    }

    @Override
    protected WSUser[] getAssignedUsers(HttpServletRequest request, UserAndRoleManagement userAndRoleManagement)
            throws RemoteException {
        List<WSUser> users = new ArrayList<WSUser>();
        for (Map.Entry<String, String[]> entry : (Set<Map.Entry<String, String[]>>)request.getParameterMap().entrySet()) {
            String key = entry.getKey();

            if (key.startsWith(PARAM_USER_PREFIX)) {
                String userWithTenant = key.substring(PARAM_USER_PREFIX.length());

                WSUser[] wsUsers = userAndRoleManagement.findUsers(
                        new WSUserSearchCriteria(ControllerUtils.parseName(userWithTenant),
                                ControllerUtils.parseTenant(userWithTenant), false, null, 0));

                if (wsUsers == null || wsUsers.length == 0 || wsUsers.length > 1) {
                    throw new RuntimeException("Problems to find user with username '" + userWithTenant + "'");
                }

                users.add(wsUsers[0]);
            }
        }

        return users.toArray(new WSUser[users.size()]);
    }

    @Override
    protected void putRole(HttpServletRequest request, UserAndRoleManagement userAndRoleManagement)
            throws RemoteException {
        String roleName = request.getParameter(PARAM_ROLE_NAME);
        String oldRoleName = request.getParameter(PARAM_OLD_ROLE_NAME);
        String tenantId = ControllerUtils.getTenantFromRequest(request);

        WSRole role = new WSRole();
        role.setRoleName(roleName);
        role.setTenantId(ControllerUtils.fixTenantId(tenantId));

        if (oldRoleName != null && oldRoleName.length() > 0 && !oldRoleName.equals(roleName)) {
            role = getRole(request, oldRoleName, userAndRoleManagement);
            role = userAndRoleManagement.updateRoleName(role, roleName);
        }

        WSUser[] assignedUsers = getAssignedUsers(request, userAndRoleManagement);
        role.setUsers(assignedUsers);
        userAndRoleManagement.putRole(role);
    }

    protected void deleteRole(HttpServletRequest request, UserAndRoleManagement userAndRoleManagement)
            throws RemoteException {
        String roleName = request.getParameter(PARAM_ROLE_NAME);

        WSRole role = new WSRole();
        role.setRoleName(roleName);
        role.setTenantId(ControllerUtils.getTenantFromRequest(request));

        userAndRoleManagement.deleteRole(role);
    }
}

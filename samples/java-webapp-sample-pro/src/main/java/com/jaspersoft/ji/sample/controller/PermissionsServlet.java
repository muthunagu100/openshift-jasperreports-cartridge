/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

package com.jaspersoft.ji.sample.controller;

import com.jaspersoft.jasperserver.sample.controller.vo.PermissionVO;
import com.jaspersoft.jasperserver.sample.controller.vo.RoleVO;
import com.jaspersoft.jasperserver.sample.controller.vo.UserVO;
import com.jaspersoft.jasperserver.ws.authority.WSRole;
import com.jaspersoft.jasperserver.ws.authority.WSRoleSearchCriteria;
import com.jaspersoft.jasperserver.ws.authority.WSUser;
import com.jaspersoft.jasperserver.ws.authority.WSUserSearchCriteria;
import com.jaspersoft.jasperserver.ws.client.authority.UserAndRoleManagement;
import com.jaspersoft.ji.ws.client.controller.WSClientManager;

import javax.servlet.http.HttpServletRequest;
import javax.xml.rpc.ServiceException;
import java.rmi.RemoteException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/**
 * @author Yuriy Plakosh
 */
public class PermissionsServlet extends com.jaspersoft.jasperserver.sample.controller.PermissionsServlet {

    @Override
    protected WSUser[] getUsers(HttpServletRequest request) throws ServiceException, RemoteException {
        UserAndRoleManagement userAndRoleManagement =
               WSClientManager.getUserAndRoleManagement(getBaseAddress(request));

        WSUserSearchCriteria searchCriteria = new WSUserSearchCriteria();
        searchCriteria.setName("");
        searchCriteria.setTenantId((String)request.getSession().getAttribute("tenantId"));
        searchCriteria.setMaxRecords(0);
        searchCriteria.setIncludeSubOrgs(Boolean.FALSE);
        searchCriteria.setRequiredRoles(null);

        return userAndRoleManagement.findUsers(searchCriteria);
    }

    @Override
    protected WSRole[] getRoles(HttpServletRequest request) throws ServiceException, RemoteException {
        UserAndRoleManagement userAndRoleManagement =
                WSClientManager.getUserAndRoleManagement(getBaseAddress(request));

        WSRoleSearchCriteria searchCriteria = new WSRoleSearchCriteria("", null, Boolean.TRUE, 0);
        WSRole[] rootRoles = userAndRoleManagement.findRoles(searchCriteria);

        searchCriteria = new WSRoleSearchCriteria("", (String)request.getSession().getAttribute("tenantId"),
                Boolean.TRUE, 0);
        WSRole[] tenantRoles = userAndRoleManagement.findRoles(searchCriteria);

        Set<WSRole> roles = new HashSet<WSRole>(rootRoles.length + tenantRoles.length);
        roles.addAll(Arrays.asList(rootRoles));
        roles.addAll(Arrays.asList(tenantRoles));

        return roles.toArray(new WSRole[roles.size()]);
    }

    @Override
    protected WSRole getRole(HttpServletRequest request, String roleName) throws RemoteException, ServiceException {
        WSRoleSearchCriteria searchCriteria = new WSRoleSearchCriteria(ControllerUtils.parseName(roleName),
                ControllerUtils.parseTenant(roleName), false, 0);
        WSRole[] roles = WSClientManager.getUserAndRoleManagement(getBaseAddress(request)).findRoles(searchCriteria);

        if (roles == null || roles.length == 0 || roles.length > 1) {
            throw new RuntimeException("Problems to find role with role name '" + roleName + "'");
        }

        return roles[0];
    }

    @Override
    protected WSUser getUser(HttpServletRequest request, String userName) throws RemoteException, ServiceException {
        WSUserSearchCriteria searchCriteria = new WSUserSearchCriteria(ControllerUtils.parseName(userName),
                ControllerUtils.parseTenant(userName), false, null, 0);
        WSUser[] users = WSClientManager.getUserAndRoleManagement(getBaseAddress(request)).findUsers(searchCriteria);

        if (users == null || users.length == 0 || users.length > 1) {
            throw new RuntimeException("Problems to find role with role name '" + userName + "'");
        }

        return users[0];
    }

    @Override
    protected String getUserKey(WSUser user) {
        return user.getUsername() + ControllerUtils.TENANT_SEPARATOR + user.getTenantId();
    }

    @Override
    protected String getRoleKey(WSRole role) {
        return role.getRoleName() + ControllerUtils.TENANT_SEPARATOR + role.getTenantId();
    }
}

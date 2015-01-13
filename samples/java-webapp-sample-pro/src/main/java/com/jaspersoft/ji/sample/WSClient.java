/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */
package com.jaspersoft.ji.sample;

import com.jaspersoft.jasperserver.api.metadata.xml.domain.impl.ResourceDescriptor;

import java.io.File;

/**
 * @author Yuriy Plakosh
 */
public class WSClient extends com.jaspersoft.jasperserver.sample.WSClient {
    private static String organization1Uri = "/organizations/organization_1";
    
    public WSClient(String webServiceUrl, String username, String password) {
        super(webServiceUrl, username, password);
    }

    @Override
    protected String getDataSourceUri() {
        if (!isRootTenantUser()) {
            return super.getDataSourceUri();
        } else {
            return organization1Uri + super.getDataSourceUri();
        }
    }

    private boolean isRootTenantUser() {
        return server.getUsername().indexOf('|') == -1;
    }

    @Override
    public String getContentFilesFolder() {
        if (!isRootTenantUser()) {
            return super.getContentFilesFolder();
        } else {
            return organization1Uri + super.getContentFilesFolder();
        }
    }
}

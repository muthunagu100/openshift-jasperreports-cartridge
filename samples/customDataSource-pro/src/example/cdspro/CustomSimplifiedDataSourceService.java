/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */
package example.cdspro;

import java.util.Map;

import com.jaspersoft.jasperserver.api.metadata.jasperreports.domain.CustomDomainMetaData;
import com.jaspersoft.jasperserver.api.metadata.jasperreports.domain.CustomDomainMetaDataProvider;
import com.jaspersoft.jasperserver.api.metadata.jasperreports.domain.CustomReportDataSource;
import net.sf.jasperreports.engine.JRDataSource;
import net.sf.jasperreports.engine.JRParameter;

import com.jaspersoft.jasperserver.api.metadata.common.service.RepositoryService;
import com.jaspersoft.jasperserver.api.metadata.jasperreports.service.ReportDataSourceService;

/**
 * @author ichan
 *
 */
public class CustomSimplifiedDataSourceService implements ReportDataSourceService, CustomDomainMetaDataProvider {

	JRDataSource ds;
	private String sampleName;
	private RepositoryService repository;
	private Map propertyMap;
	
	public String getsSmpleName() {
		return sampleName;
	}

	public void setSampleName(String sampleName) {
		this.sampleName = sampleName;
	}

	public Map getPropertyMap() {
		return propertyMap;
	}

	public void setPropertyMap(Map propertyMap) {
		this.propertyMap = propertyMap;
	}

	public CustomSimplifiedDataSourceService() {
		this.ds = new SampleCustomDataSourceWithMetadata();
	}
	
	public CustomSimplifiedDataSourceService(JRDataSource ds) {
		this.ds = ds;
	}
	
	/* (non-Javadoc)
	 * @see com.jaspersoft.jasperserver.api.metadata.jasperreports.service.ReportDataSourceService#closeConnection()
	 */
	public void closeConnection() {
		// Do nothing
	}

	/* (non-Javadoc)
	 * @see com.jaspersoft.jasperserver.api.metadata.jasperreports.service.ReportDataSourceService#setReportParameterValues(java.util.Map)
	 */
	public void setReportParameterValues(Map parameterValues) {
		parameterValues.put(JRParameter.REPORT_DATA_SOURCE, ds);
	}

	public RepositoryService getRepository() {
		return repository;
	}

	public void setRepository(RepositoryService repository) {
		this.repository = repository;
	}
    public CustomDomainMetaData getCustomDomainMetaData(CustomReportDataSource customReportDataSource) {
        if (ds instanceof SampleCustomDataSourceWithMetadata) return ((SampleCustomDataSourceWithMetadata) ds).getCustomDomainMetaData(customReportDataSource);
        else return null;
    }
}

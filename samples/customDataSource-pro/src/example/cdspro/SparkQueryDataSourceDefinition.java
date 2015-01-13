/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */
 

package example.cdspro;

import com.jaspersoft.jasperserver.api.metadata.jasperreports.domain.CustomReportDataSource;
import java.util.Map;
import java.util.Set;


/**
 * @author ichan
 * custom report data source definition for SPARK QUERY
 * This class is meant to be instantiated as a spring bean that registers a custom data source with the system.
 */
public class SparkQueryDataSourceDefinition extends JDBCQueryDataSourceDefinition {

    public SparkQueryDataSourceDefinition() {
        super();
        // add additional field
        Set<String> additionalPropertySet = getAdditionalPropertySet();
        additionalPropertySet.add("portNumber");


        // define default values for the following properties
        Map<String, String> propertyDefaultValueMap = getPropertyDefaultValueMap();
        propertyDefaultValueMap.put("name", "SparkQueryDataSource");
        propertyDefaultValueMap.put("driver", "tibcosoftware.jdbc.hive.HiveDriver");

        // hide the following properties from UI
        Set<String> hiddenPropertySet = getHiddenPropertySet();
        hiddenPropertySet.remove("serverAddress");
        hiddenPropertySet.remove("database");
        hiddenPropertySet.add("driver");
        hiddenPropertySet.add("url");
    }

    @Override
    public Map<String, Object>  customizePropertyValueMap(CustomReportDataSource customReportDataSource, Map<String, Object>  propertyValueMap) {
        String url = "jdbc:tibcosoftware:hive://";
        String serverAddress = ((String) propertyValueMap.get("serverAddress")).trim();
        String portNumber = ((String) propertyValueMap.get("portNumber")).trim();
        url = url + serverAddress + ":"  + portNumber + ";TransactionMode=ignore";

        String userName = ((String) propertyValueMap.get("username"));
        String password = ((String) propertyValueMap.get("password"));
        String database = ((String) propertyValueMap.get("database"));

        if (userName != null && password != null) url = url + ";User=" + userName + ";Password=" + password;
        if (database != null) url = url + ";DatabaseName=" + database;

        propertyValueMap.put("url", url.trim());
        return propertyValueMap;
    }

}


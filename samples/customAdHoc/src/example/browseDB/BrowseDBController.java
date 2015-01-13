/*
 * Copyright (C) 2005 - 2014 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

package example.browseDB;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.context.MessageSource;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.multiaction.MultiActionController;

import com.jaspersoft.commons.adhoc.AdhocConstants;
import com.jaspersoft.commons.adhoc.AdhocMetadata;
import com.jaspersoft.commons.adhoc.AdhocEngineService;
import com.jaspersoft.commons.adhoc.AdhocField;
import com.jaspersoft.jasperserver.api.metadata.common.domain.ResourceLookup;
import com.jaspersoft.jasperserver.api.metadata.common.service.RepositoryService;
import com.jaspersoft.jasperserver.war.action.tree.TreeAction;
import com.jaspersoft.jasperserver.war.model.TreeDataProvider;
import com.jaspersoft.jasperserver.war.model.TreeHelper;
import com.jaspersoft.jasperserver.war.model.TreeNode;
import com.jaspersoft.ji.adhoc.metadata.AdhocTopicMetadata;
import com.jaspersoft.ji.adhoc.service.AdhocEngineServiceImpl;
import com.jaspersoft.ji.adhoc.service.SessionAttributeManager;

import example.browseDB.tree.BrowseDBTreeDataProvider;

public class BrowseDBController extends MultiActionController {
    public static final String DATASOURCE_URI = "datasourceURI";
    public static final String TABLE_NAME = "tableName";
    public static final String COLUMN_NAME = "columnName";
    public static final String JOIN_FROM_COLUMN = "joinFromColumn";
    public static final String JOIN_TO_TABLE = "joinToTable";
    private static final String REFRESH = "refresh";
    
    private static Map typeMap;
    static {
        typeMap = new HashMap();
        typeMap.put("int", "java.lang.Integer");
        typeMap.put("int2", "java.lang.Integer");
        typeMap.put("int4", "java.lang.Integer");
        typeMap.put("int8", "java.lang.Long");
        typeMap.put("smallint", "java.lang.Integer");
        typeMap.put("bigint", "java.lang.Long");
        typeMap.put("decimal", "java.lang.Double");
        typeMap.put("numeric", "java.lang.Double");
        typeMap.put("float4", "java.lang.Double");
        typeMap.put("float8", "java.lang.Double");
        typeMap.put("date", "java.util.Date");
        typeMap.put("datetime", "java.sql.Timestamp");
        typeMap.put("timestamp", "java.sql.Timestamp");
        typeMap.put("bit", "java.lang.Boolean");
        typeMap.put("bool", "java.lang.Boolean");
        typeMap.put("varchar", "java.lang.String");
    }
    private RepositoryService repository;
    private AdhocEngineServiceImpl engine;
    private MessageSource messages;

    public ModelAndView pickDatasource(HttpServletRequest req, HttpServletResponse res) {
        ResourceLookup[] lookups = engine.getDataSources(null, "sql");
        
        List allDataSources = null;
        
        if (lookups != null && lookups.length != 0) {
            for (int i = 0; i < lookups.length; i++) {
                ResourceLookup dr = lookups[i];
                // no, I REALLY meant just sql datasources...for some reason the engine sees domain and some other types as "universal" datasources
                if (dr.getResourceType().equals("com.jaspersoft.jasperserver.api.metadata.jasperreports.domain.JdbcReportDataSource") ||
                		dr.getResourceType().equals("com.jaspersoft.jasperserver.api.metadata.jasperreports.domain.JndiJdbcReportDataSource")) {
	                if (allDataSources == null)
	                    allDataSources = new ArrayList();
	                allDataSources.add(dr.getURIString());
                }
            }
        }
        req.setAttribute("datasources", allDataSources);
        return new ModelAndView("browseDB/pickDatasource");
    }
    /**
     * This is the action we return to when reading an existing Ad Hoc
     * We should have an AdhocData in the session when that happens,
     * in which case that's where we get the datasourceURI
     * @param req
     * @param res
     * @return
     * @throws Exception
     */
    public ModelAndView displayTables(HttpServletRequest req, HttpServletResponse res) throws Exception {
        // assume that if you have the datasourceURI param, you are starting a new report
        String datasourceURI = req.getParameter(DATASOURCE_URI);
        AdhocTopicMetadata data; 
        long clientKey;
        
        // if you have a datasource URI, you just started...so we we need to init AdhocData and put it in session
        if (datasourceURI != null) {
        	data = engine.getAdhocMetadataFactory().getTopicMetadata();
        	data.setLocale(req.getLocale());
            data.initDatasource(engine, datasourceURI);
            // get new client key for Ad Hoc
            clientKey = SessionAttributeManager.getInstance().createClientKey();
            SessionAttributeManager.getInstance().setSessionAttribute(AdhocConstants.ADHOC_DATA, data, clientKey, req);
        } else {
            data = (AdhocTopicMetadata) SessionAttributeManager.getInstance().getSessionAttribute(AdhocConstants.ADHOC_DATA, req);
            clientKey = Long.parseLong(SessionAttributeManager.getInstance().getClientKeyAsString(req));
            if (data == null) {
                // maybe we went out of session...go back & pick datasource
                return pickDatasource(req, res);
            }
        }
        // set up handler to serialize/deserialize
        data.setCustomDataHandler(new BrowseDBDataHandler());
        BrowseDBData dbdata = (BrowseDBData) data.getCustomData();
        
        // create list of tables if it's not there, or refresh is requested
        String refresh = req.getParameter(REFRESH);
        if (refresh != null || dbdata.getTableList().size() == 0) {
            getTableList(data, dbdata);
        }
        req.setAttribute("adhocData", data);
        req.setAttribute("dbdata", dbdata);
        req.setAttribute("clientKey", clientKey);
        ModelAndView mv = new ModelAndView("browseDB/displayTables");
        return mv;
    }
    
    private void getTableList(AdhocMetadata data, BrowseDBData dbdata) throws SQLException {
        // clear table list
        dbdata.getTableList().clear();
        
        // get db metadata
        Connection conn = getJDBCConnection(data);
        DatabaseMetaData md = conn.getMetaData();

        // add tables
        // pg: only public catalog
        String schema = null;
        String[] types = null;
        if (md.getDatabaseProductName().toLowerCase().contains("postgresql")) {
        	schema = "public";
        	types = new String[] { "TABLE" };
        }
        ResultSet tables = md.getTables(null, schema, null, types);
        while (tables.next()) {
            String tableName = tables.getString("TABLE_NAME");
            dbdata.addTable(tableName);
        }
        tables.close();
        
        // add cols to tables
        ResultSet colset = md.getColumns(null, null, null, null);
        while (colset.next()) {
            String tableName = colset.getString("TABLE_NAME");
            String colName = colset.getString("COLUMN_NAME");
            String colType = colset.getString("TYPE_NAME");
            int colSize = colset.getInt("COLUMN_SIZE");
            DBField f = new DBField(colName, getDisplayName(colName), colType, colSize);
            dbdata.addField(tableName, f);
        }
        colset.close();
        conn.close();
    }
    
    public ModelAndView selectTable(HttpServletRequest req, HttpServletResponse res) throws Exception {
        AdhocMetadata data = (AdhocMetadata) SessionAttributeManager.getInstance().getSessionAttribute(AdhocConstants.ADHOC_DATA, req);
        BrowseDBData dbdata = (BrowseDBData) data.getCustomData();
        String tname = req.getParameter(TABLE_NAME);
        dbdata.selectTable(tname);
        return displayTables(req, res);
    }

    public ModelAndView setPrimaryKey(HttpServletRequest req, HttpServletResponse res) throws Exception {
        AdhocMetadata data = (AdhocMetadata) SessionAttributeManager.getInstance().getSessionAttribute(AdhocConstants.ADHOC_DATA, req);
        BrowseDBData dbdata = (BrowseDBData) data.getCustomData();
        String tname = req.getParameter(TABLE_NAME);
        String cname = req.getParameter(COLUMN_NAME);
        Table t = dbdata.getTable(tname);
        t.setPrimaryKey(cname);
        return displayTables(req, res);
    }

    public ModelAndView join(HttpServletRequest req, HttpServletResponse res) throws Exception {
        AdhocMetadata data = (AdhocMetadata) SessionAttributeManager.getInstance().getSessionAttribute(AdhocConstants.ADHOC_DATA, req);
        BrowseDBData dbdata = (BrowseDBData) data.getCustomData();
        String fromColumnName = req.getParameter(JOIN_FROM_COLUMN);
        String toTableName = req.getParameter(JOIN_TO_TABLE);
        DBField fromColumn = dbdata.getSelectedTable().getField(fromColumnName);
        Table toTable = dbdata.getTable(toTableName);
        DBField pk = toTable.getPrimaryKey();
        fromColumn.setJoinField(pk);
        return displayTables(req, res);
    }

    public ModelAndView unjoin(HttpServletRequest req, HttpServletResponse res) throws Exception {
        AdhocMetadata data = (AdhocMetadata) SessionAttributeManager.getInstance().getSessionAttribute(AdhocConstants.ADHOC_DATA, req);
        BrowseDBData dbdata = (BrowseDBData) data.getCustomData();
        String fromColumnName = req.getParameter(JOIN_FROM_COLUMN);
        DBField fromColumn = dbdata.getSelectedTable().getField(fromColumnName);
        fromColumn.setJoinField(null);
        return displayTables(req, res);
    }

    public ModelAndView launchAdHoc(HttpServletRequest req, HttpServletResponse res) throws Exception {
        AdhocTopicMetadata data = (AdhocTopicMetadata) SessionAttributeManager.getInstance().getSessionAttribute(AdhocConstants.ADHOC_DATA, req);
        if (data == null) {
            throw new Exception("no AdhocBaseData found in session");
        }
        BrowseDBData dbdata = (BrowseDBData) data.getCustomData();
        // testing for custom data
        data.setCustomType("test"); 
        // set report type
        String reportType = req.getParameter(AdhocConstants.REPORT_TYPE);
        if (reportType != null) {
            data.setAdhocReportType(reportType);
        }
        // set up query
        String tableName = dbdata.getSelectedTable().getName();
        data.setQueryLanguage("sql");
        StringBuffer query = new StringBuffer("select * from " + tableName);
        Iterator sfi = dbdata.getSelectedTable().getFieldList().iterator();
        while (sfi.hasNext()) {
            DBField f = (DBField) sfi.next();
            DBField jf = f.getJoinField();
            if (jf != null) {
                query.append("\n");
                String fromField = f.getTable().getName() + "." + f.getName();
                String toField = jf.getTable().getName() + "." + jf.getName();
                query.append("join " + jf.getTable().getName() + 
                        " on (" + fromField + " = " + toField + ")");
            }
        }
        data.setQueryText(query.toString());
   
        // set field list from selected table
        // TODO detect if we're deleting fields in use by existing report (need to access adhoc state for that)
        // delete non-calculated fields by getting list and deleting (avoid concurrent delete ex)
        Iterator oldfi = data.getFieldList().iterator();
        List fields2delete = new ArrayList();
        while (oldfi.hasNext()) {
            AdhocField f = (AdhocField) oldfi.next();
            if (! f.isCalculated()) {
                fields2delete.add(f.getName());
            }
        }
        Iterator f2di = fields2delete.iterator();
        while (f2di.hasNext()) {
            data.deleteField((String)f2di.next());
        }
        Iterator fi = dbdata.getSelectedTable().getFieldList().iterator();
        while (fi.hasNext()) {
            DBField f = (DBField) fi.next();
            DBField jf = f.getJoinField();
            // if we find join, then add all the fields on the joined table 
            // (although not the other end of the join which would be redundant)
            if (jf != null) {
                Iterator jtfi = jf.getTable().getFieldList().iterator();
                while (jtfi.hasNext()) {
                    DBField jtf = (DBField) jtfi.next();
                    AdhocField af = new AdhocField(jtf.getName(), getJRType(jtf.getDbType()));
                    af.setDisplay(jtf.getLabel());
                    data.addField(af);
                }
            }
            // otherwise, just add the field
            else {
                AdhocField af = new AdhocField(f.getName(), getJRType(f.getDbType()));
                af.setDisplay(f.getLabel());
                data.addField(af);
            }
        }
        // clobber any leftover reports
        data.setReport(null);
        // redirect to adhoc
        // need to tell adhoc that you are redirecting from a launcher so it knows to skip realms
        ModelAndView mv = new ModelAndView("redirect:/flow.html?_flowId=adhocFlow&adhocLauncher=true&clientKey=" + SessionAttributeManager.getInstance().getClientKeyAsString(req));
        return mv;
    }
    
    public ModelAndView getNode(HttpServletRequest req, HttpServletResponse res) throws Exception {
        AdhocMetadata data = (AdhocMetadata) SessionAttributeManager.getInstance().getSessionAttribute(AdhocConstants.ADHOC_DATA, req);
        BrowseDBData dbdata = (BrowseDBData) data.getCustomData();
        String uri = req.getParameter(TreeAction.URI);
        int depth = getIntParam(req, TreeAction.DEPTH);
        String prefetchNodesList = req.getParameter(TreeAction.PREFETCH);
        
        TreeNode treeNode = getNode(dbdata, uri, depth);
        
        String model = "";
        if (treeNode != null) {
            StringBuffer sb = new StringBuffer();
            sb.append("<div id='treeNodeText'>");
            sb.append(treeNode.toJSONString());
            sb.append("</div>");
            model = sb.toString();
        }
        
        req.setAttribute(TreeAction.AJAX_REPORT_MODEL, model);
        
        return new ModelAndView("ajax/ajaxresponse");
    }
    
    public ModelAndView getChildren(HttpServletRequest req, HttpServletResponse res) throws Exception {
        AdhocMetadata data = (AdhocMetadata) SessionAttributeManager.getInstance().getSessionAttribute(AdhocConstants.ADHOC_DATA, req);
        BrowseDBData dbdata = (BrowseDBData) data.getCustomData();
        String uri = req.getParameter(TreeAction.URI);

        TreeNode treeNode = getNode(dbdata, uri, 1);
        
        String model = "";
        if (treeNode != null) {
            StringBuffer sb = new StringBuffer();
            sb.append("<div id='treeNodeText'>");
            //sb.append(treeNode.toJSONString());
            sb.append('[');
            for (Iterator i = treeNode.getChildren().iterator(); i.hasNext(); ) {
                TreeNode n = (TreeNode) i.next();
                sb.append(n.toJSONString());
                if (i.hasNext()) {
                    sb.append(',');
                }
            }
            sb.append(']');
            sb.append("</div>");
            model = sb.toString();
        }
        
        req.setAttribute(TreeAction.AJAX_REPORT_MODEL, model);
        
        return new ModelAndView("ajax/ajaxresponse");
    }
    
    private TreeNode getNode(BrowseDBData dbdata, String uri, int d) {
        
        List prefetchList = null;
        /* TODO implement this
        if (prefetchNodesList != null && prefetchNodesList.length() > 0) {
            String[] ss = prefetchNodesList.split(",");
            prefetchList = new ArrayList();
            for (int i = 0; i < ss.length; i++) {
                prefetchList.add(ss[i]);
            }
        }
        */
        
        TreeDataProvider treeDataProvider = new BrowseDBTreeDataProvider(dbdata);
        TreeNode treeNode;
        if (prefetchList == null) {
            treeNode = treeDataProvider.getNode(null, uri, d);
        } else {
            treeNode = TreeHelper.getSubtree(null, treeDataProvider, uri, prefetchList, 2);
        }
        return treeNode;
    }
        
    private String getJRType(String mysqlType) {
        String jrType = (String) typeMap.get(mysqlType.toLowerCase());
        if (jrType == null) {
            jrType = "java.lang.String";
        }
        return jrType;
    }
    
    private String getDisplayName(String colName) {
        StringBuffer dispName = new StringBuffer(colName);
        for (int i = 0; i > -1; i = dispName.indexOf("_")) {
            if (i > 0) {
                dispName.setCharAt(i, ' ');
                i++;
            }
            dispName.setCharAt(i, Character.toUpperCase(dispName.charAt(i)));
        }
        return dispName.toString();
    }

    /**
     * convenience method to get a connection from a jdbc data source
     */
    public Connection getJDBCConnection(AdhocMetadata adhocData) {
        Map params = new HashMap();
        adhocData.getDataSourceService().setReportParameterValues(params);
        Connection conn = (Connection) params.get("REPORT_CONNECTION");
        return conn;
    }


    protected int getIntParam(HttpServletRequest req, String str) {
        return Integer.parseInt(req.getParameter(str));
    }

    public AdhocEngineServiceImpl getEngine() {
        return engine;
    }

    public void setEngine(AdhocEngineServiceImpl engine) {
        this.engine = engine;
    }

    public MessageSource getMessages() {
        return messages;
    }

    public void setMessages(MessageSource messages) {
        this.messages = messages;
    }

    public RepositoryService getRepository() {
        return repository;
    }

    public void setRepository(RepositoryService repository) {
        this.repository = repository;
    }
    
    
}

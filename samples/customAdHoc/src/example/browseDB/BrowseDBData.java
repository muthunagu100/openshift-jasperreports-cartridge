package example.browseDB;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class BrowseDBData {
    private Table selectedTable;
    private List tableList = new ArrayList();
    private Map tableMap = new HashMap();
    
    public Table addTable(String tableName) {
        Table t = new Table(tableName);
        tableList.add(t);
        tableMap.put(tableName, t);
        return t;
    }
    
    public List getTableList() {
        return tableList;
    }
    
    public Table getTable(String tname) {
        return (Table) tableMap.get(tname);
    }
    
    public void selectTable(String tname) {
        selectedTable = getTable(tname);
    }
    
    public Table getSelectedTable() {
        return selectedTable;
    }

    public Map getOtherTables() {
        LinkedHashMap others = new LinkedHashMap();
        Iterator ti = tableList.iterator();
        while (ti.hasNext()) {
            Table t = (Table) ti.next();
            if (selectedTable == null || t.getName() != selectedTable.getName()) {
                others.put(t.getName(), t);
            }
        }
        return others;
    }

    public void addField(String tableName, DBField f) {
        Table t = getTable(tableName);
        if (t != null) {
            t.addField(f);
        }
    }
}

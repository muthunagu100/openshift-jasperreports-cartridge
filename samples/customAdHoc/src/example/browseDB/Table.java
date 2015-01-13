package example.browseDB;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

public class Table {
    private String name;
    private List fieldList = new ArrayList();
    private Map fieldMap = new HashMap();
    
    public boolean getHasPrimaryKey() {
        return getPrimaryKey() != null;
    }

    public DBField getPrimaryKey() {
        Iterator fi = fieldList.iterator();
        while (fi.hasNext()) {
            DBField f = (DBField) fi.next();
            if (f.isPrimaryKey()) {
                return f;
            }
        }
        return null;
    }

    public Table(String name) {
        this.name = name;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public List getFieldList() {
        return fieldList;
    }
    
    public void setFieldList(List fieldList) {
        this.fieldList = new ArrayList();
        Iterator fi = fieldList.iterator();
        while (fi.hasNext()) {
            addField((DBField) fi.next());
        }
    }
    
    public void addField(DBField field) {
        field.setTable(this);
        fieldList.add(field);
        fieldMap.put(field.getName(), field);
    }
    
    public DBField getField(String name) {
        return (DBField) fieldMap.get(name);
    }

    public void setPrimaryKey(String cname) {
        Iterator fi = fieldList.iterator();
        while (fi.hasNext()) {
            DBField f = (DBField) fi.next();
            f.setPrimaryKey(f.getName().equals(cname));
        }
    }

	public void setProperty(String row_count, int fullRowCount) {
		// TODO Auto-generated method stub
		
	}
}

package example.browseDB;

public class DBField {
    private Table table;
    private String name;
    private String label;
    private String dbType;
    private boolean isPrimaryKey;
    private int length;
    private DBField joinField;
    
    public DBField(String name, String label, String dbType, int length) {
        this.name = name;
        this.label = label;
        this.dbType = dbType;
        this.length = length;
    }
    
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getLabel() {
        return label;
    }
    public void setLabel(String label) {
        this.label = label;
    }
    public String getDbType() {
        return dbType;
    }
    public void setDbType(String dbType) {
        this.dbType = dbType;
    }
    public int getLength() {
        return length;
    }
    public void setLength(int length) {
        this.length = length;
    }

    public void setTable(Table table) {
        this.table = table;
    }
    
    public Table getTable() {
        return table;
    }
    
    public DBField getJoinField() {
        return joinField;
    }

    public void setJoinField(DBField joinField) {
        this.joinField = joinField;
    }

    public boolean isPrimaryKey() {
        return isPrimaryKey;
    }
    
    public void setPrimaryKey(boolean pk) {
        isPrimaryKey = pk;
    }

	public boolean propertyEquals(String semantic_type, String primary_key) {
		// TODO Auto-generated method stub
		return false;
	}

	public void setProperty(String cardinality, int cardinality2) {
		// TODO Auto-generated method stub
		
	}

	public void setProperty(String semantic_type, String foreign_key) {
		// TODO Auto-generated method stub
		
	}
}

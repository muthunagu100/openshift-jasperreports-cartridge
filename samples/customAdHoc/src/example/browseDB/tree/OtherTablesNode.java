package example.browseDB.tree;

import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.jaspersoft.jasperserver.war.model.TreeDataProvider;

import example.browseDB.Table;

public class OtherTablesNode extends BaseNode {
    Map tableMap;
    
    public OtherTablesNode(TreeDataProvider dataProvider, BaseNode parent, Map otherTables) {
        super(dataProvider, parent, "otherTables", "Other Tables", "tableList");
        tableMap = otherTables;
    }
    
    public List getChildren() {
        if (super.getChildren().isEmpty()) {
            Iterator ti = tableMap.values().iterator();
            while (ti.hasNext()) {
                Table t = (Table) ti.next();
                addChild(new TableNode(this.dataProvider, this, t));
            }
        }
        return super.getChildren();
    }
    
}

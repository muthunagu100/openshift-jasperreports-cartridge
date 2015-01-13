package example.browseDB.tree;

import java.util.Iterator;
import java.util.List;

import com.jaspersoft.jasperserver.war.model.TreeDataProvider;

import example.browseDB.DBField;
import example.browseDB.Table;

public class TableNode extends BaseNode {
    Table table;
    
    public TableNode(TreeDataProvider dataProvider, BaseNode parent, Table t) {
        super(dataProvider, parent, t.getName(), t.getName(), "table");
        this.table = t;
    }

    public List getChildren() {
        if (super.getChildren().isEmpty()) {
            Iterator fi = table.getFieldList().iterator();
            while (fi.hasNext()) {
                DBField f = (DBField) fi.next();
                if (f.getJoinField() != null) {
                    addChild(new JoinNode(this.dataProvider, this, f));
                } else {
                    addChild(new FieldNode(this.dataProvider, this, f));
                }
            }
        }
        return super.getChildren();
    }
}

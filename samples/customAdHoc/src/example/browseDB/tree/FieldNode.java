package example.browseDB.tree;

import com.jaspersoft.jasperserver.war.model.TreeDataProvider;

import example.browseDB.DBField;

public class FieldNode extends BaseNode {

    private DBField field;

    public FieldNode(TreeDataProvider dataProvider, BaseNode parent, DBField f) {
        super(dataProvider, parent, f.getName(), f.getLabel(), "field");
        this.field = f;
    }

}

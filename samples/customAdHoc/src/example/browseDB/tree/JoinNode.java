package example.browseDB.tree;

import com.jaspersoft.jasperserver.war.model.TreeDataProvider;

import example.browseDB.DBField;

public class JoinNode extends TableNode {

    private DBField field;

    public JoinNode(TreeDataProvider dataProvider, BaseNode parent, DBField f) {
        super(dataProvider, parent, f.getJoinField().getTable());
        this.field = f;
        setId(field.getName());
        setLabel("Join Table " + getLabel());
        setType("join");
    }
}

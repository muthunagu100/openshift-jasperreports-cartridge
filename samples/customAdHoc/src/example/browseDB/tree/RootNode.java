package example.browseDB.tree;

import com.jaspersoft.jasperserver.war.model.TreeDataProvider;

import example.browseDB.BrowseDBData;

public class RootNode extends BaseNode {
    public RootNode(TreeDataProvider dataProvider, BrowseDBData dbData) {
        super(dataProvider, null, "", "root", "root");
        if (dbData.getSelectedTable() != null) {
            super.addChild(new TableNode(dataProvider, this, dbData.getSelectedTable()));
        }
        super.addChild(new OtherTablesNode(dataProvider, this, dbData.getOtherTables()));
    }

}

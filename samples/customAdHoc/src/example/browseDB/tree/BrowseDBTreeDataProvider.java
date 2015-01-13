package example.browseDB.tree;

import java.util.List;

import com.jaspersoft.jasperserver.api.common.domain.ExecutionContext;
import com.jaspersoft.jasperserver.war.model.TreeDataProvider;
import com.jaspersoft.jasperserver.war.model.TreeNode;

import example.browseDB.BrowseDBData;

public class BrowseDBTreeDataProvider implements TreeDataProvider {
    private BrowseDBData dbData;
    
    public BrowseDBTreeDataProvider(BrowseDBData data) {
        dbData = data;
    }

    public List getChildren(ExecutionContext executionContext, String parentUri, int depth) {
        BaseNode parent = (BaseNode) getNode(executionContext, parentUri, depth);
        if (parent != null) {
            return parent.getChildren();
        }
        return null;
    }

    public TreeNode getNode(ExecutionContext executionContext, String uri, int depth) {
        RootNode root = new RootNode(this, dbData);
        BaseNode top = root.getNodeByPath(uri);
        top.prefetchChildren(depth);
        return top;
    }

}

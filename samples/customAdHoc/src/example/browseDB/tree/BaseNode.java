package example.browseDB.tree;

import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;

import com.jaspersoft.jasperserver.war.model.TreeDataProvider;
import com.jaspersoft.jasperserver.war.model.impl.TreeNodeImpl;

public class BaseNode extends TreeNodeImpl {
    private BaseNode parent;
    private Map childrenMap = new LinkedHashMap();

    public BaseNode(TreeDataProvider dataProvider, BaseNode parent, String id, String label, String type) {
        super(dataProvider, id, label, type, (parent == null ? "" : parent.getUriString()) + "/" + id);
        this.parent = parent;
    }
    
    public BaseNode getParent() {
        return parent;
    }
    
    public String getParentPrefix() {
        return parent.getUriString() + "/";
    }
    
    /** 
     * thought this would be recursive but it's easier to iterate
     * @param uri
     * @return
     */
    public BaseNode getNodeByPath(String uri) {
        if (uri.startsWith("/")) {
            if (parent != null) {
                throw new IllegalArgumentException("can't resolve absolute path on non-root node");
            }
            // root is special case
            if (uri.equals("/")) {
                return this;
            }
            // lop off initial /
            return this.getNodeByPath(uri.substring(1));
        }
        String[] elements = uri.split("/");
        BaseNode child = this;
        for (int i = 0; i < elements.length && child != null; i++) {
            child = getChild(elements[0]);
        }
        return child;
    }
    
    public void prefetchChildren(int level) {
        if (level == 0) {
            return;
        }
        Iterator ci = getChildren().iterator();
        while (ci.hasNext()) {
            BaseNode c = (BaseNode) ci.next();
            c.prefetchChildren(level - 1);
        }
    }
    
    public void addChild(BaseNode node) {
        if (getChild(node.getId()) != null) {
            throw new IllegalArgumentException("node already has a child with id " + node.getId());
        }
        childrenMap.put(node.getId(), node);
        children.add(node);
        
    }
    
    protected void setType(String type) {
        this.type = type;
    }

    protected void setId(String id) {
        this.id = id;
    }
    
    protected void setLabel(String label) {
        this.label = label;
    }
    
    public BaseNode getChild(String id) {
        return (BaseNode) childrenMap.get(id);
    }

    public void setChildrenMap(Map childrenMap) {
        this.childrenMap = childrenMap;
    }
}

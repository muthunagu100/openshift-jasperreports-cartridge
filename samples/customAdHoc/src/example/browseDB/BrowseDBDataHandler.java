package example.browseDB;

import java.io.UnsupportedEncodingException;

import com.jaspersoft.commons.adhoc.CustomAdhocDataHandler;
import com.thoughtworks.xstream.XStream;
import com.thoughtworks.xstream.io.xml.JDomDriver;

/**
 * this is an example of something that will handle serialization
 * of an arbitrary object
 * @author bob
 *
 */
public class BrowseDBDataHandler implements CustomAdhocDataHandler {
    public static final String UTF_8 = "UTF-8";
    private static XStream xstream;

    private static XStream getXStream() {
        if (xstream == null) {
            // xstream = new XStream(new PureJavaReflectionProvider(), new
            // JDomDriver());
            XStream xs = new XStream(new JDomDriver());
            xs.useAttributeFor(Boolean.TYPE);
            xs.useAttributeFor(Integer.TYPE);
            xstream = xs;
        }
        return xstream;
    }

    public Object init() {
        return new BrowseDBData();
    }

    public Object deserialize(byte[] serialized) {
        if (serialized == null) {
            return null;
        }
        try {
            BrowseDBData data = (BrowseDBData) getXStream().fromXML(new String(serialized, UTF_8));
            return data;
        } catch (UnsupportedEncodingException e) {
            throw new IllegalStateException("unexpected exception decoding xml", e);
        }
    }

    public byte[] serialize(Object data) {
        String xml = getXStream().toXML(data);
        try {
            return xml.getBytes(UTF_8);
        } catch (UnsupportedEncodingException e) {
            throw new IllegalStateException("unexpected exception encoding xml", e);
        }
    }

}

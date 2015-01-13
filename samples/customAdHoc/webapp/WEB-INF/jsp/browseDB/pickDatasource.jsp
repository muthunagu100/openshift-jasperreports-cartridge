<%@ taglib prefix="t" uri="http://tiles.apache.org/tags-tiles" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<t:insertTemplate template="/WEB-INF/jsp/templates/page.jsp">
    <t:putAttribute name="pageTitle"><spring:message code="browseDB.pickDatasource.title"/></t:putAttribute> <%-- add definition to bundles file, Pick datasource --%>
    <t:putAttribute name="bodyID" value="pickDatasource"/>
    <t:putAttribute name="bodyClass" value="oneColumn"/>
		<t:putAttribute name="bodyContent" >
		
			<t:insertTemplate template="/WEB-INF/jsp/templates/container.jsp">
		    	<t:putAttribute name="containerClass" value="column decorated primary"/>
			    <t:putAttribute name="containerTitle"><spring:message code="browseDB.pickDatasource.title"/></t:putAttribute>  <%-- add definition to bundles file, Pick datasource --%>
			    <t:putAttribute name="bodyContent">
					<form>
						
							<label class="control input text" title="Select datasource" for="datasourceURI">
								<p class="wrap">Datasource:</p>		
								<div style="display:block; margin:0">				
									<select id="datasourceID" name="datasourceURI">
										<c:forEach var="datasource" items="${datasources}">
											<option value="${datasource}">${datasource}</option>
										</c:forEach>
									</select>
									<input type="hidden" name="action" value="displayTables"/>
									<input type="submit" name="doIt" value="Display Tables"/>
								</div>
							</label>
					</form>
		    
			    </t:putAttribute>
			</t:insertTemplate>
			
	    </t:putAttribute>
</t:insertTemplate>
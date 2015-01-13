<%@ taglib prefix="t" uri="http://tiles.apache.org/tags-tiles" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<t:insertTemplate template="/WEB-INF/jsp/templates/page.jsp">
    <t:putAttribute name="pageTitle"><spring:message code="browseDB.displayTables.title"/></t:putAttribute>
    <t:putAttribute name="bodyID" value="displayTables"/>
    <t:putAttribute name="bodyClass" value="oneColumn"/>
	<t:putAttribute name="headerContent">
		<link rel="StyleSheet" href="${pageContext.request.contextPath}/browseDB/dtree.css" type="text/css" />
		<script type="text/javascript" src="${pageContext.request.contextPath}/browseDB/dtree.js"></script>
    </t:putAttribute>
		<t:putAttribute name="bodyContent" >
			<script>
				var selectedTable;
				var selectedColumn;
				var joinFromColumn;
				var clientKeyParam = clientKeyParam = '&clientKey=' + ${clientKey};
				
				function launch(type) {
					var url = 'browseDB.html?action=launchAdHoc' + clientKeyParam;
					if (type) {
						url += ('&reportType=' + type);
					}
					document.location = url;
				}
				
				function selectTable(table) {
					document.location = 'browseDB.html?action=selectTable&tableName=' + table + clientKeyParam;
				}
				
				function selectColumn(table, column) {
					selectedTable = table;
					selectedColumn = column;
				}
				
				function setPrimaryKey() {
					if (selectedTable && selectedColumn) {
						document.location = 'browseDB.html?action=setPrimaryKey&tableName=' + selectedTable + '&columnName=' + selectedColumn + clientKeyParam;
					}
				}
				
				function join() {
					var joinToTable = document.getElementById("joinToTable").value;
					if (joinToTable && selectedColumn) {
						document.location = 'browseDB.html?action=join&joinToTable=' + joinToTable + '&joinFromColumn=' + selectedColumn + clientKeyParam;
					}
				}
				
				function unjoin() {
					if (selectedColumn) {
						document.location = 'browseDB.html?action=unjoin&joinFromColumn=' + selectedColumn + clientKeyParam;
					} else {
						alert('Please select a join to undo');
					}
				}
				// would be nice to have join/unjoin be one smart button
				function setJoinText(join) {
					var joinButton = document.getElementById("joinButton");
					joinButton.text = join ? "Join selected column on main table to..." : "Undo selected join";
				}
				
				function pkText(isPK) {
					return isPK ? ' <b>PK</b>':'';
				}
			</script>
			
			<t:insertTemplate template="/WEB-INF/jsp/templates/container.jsp">
		    	<t:putAttribute name="containerClass" value="column decorated primary"/>
			    <t:putAttribute name="containerTitle"><spring:message code="browseDB.displayTables.title"/></t:putAttribute> 
			    <t:putAttribute name="bodyContent">
					<c:set var="isNew" value="${adhocData.reportURI == null}"/>
					<c:if test="${isNew}">
						<input type="button" value="Table" onclick="launch('table')">
						<input type="button" value="Crosstab" onclick="launch('crosstab')">
						<input type="button" value="Chart" onclick="launch('chart')">
					</c:if>
					<c:if test="${! isNew}">
						<input type="button" value="Start Ad Hoc" onclick="launch('')">
					</c:if>
					<input type="button" value="Set selected column as primary key" onclick="setPrimaryKey()">
					<input id="join" type="button" value="Join selected column on main table to..." onclick="join()">
					<select id="joinToTable">
						<c:forEach var="tableEntry" items="${dbdata.otherTables}">
							<c:if test="${tableEntry.value.hasPrimaryKey}">
								<option value="${tableEntry.key}">${tableEntry.key}</option>
							</c:if>
						</c:forEach>
					</select>
					<input id="unjoin" type="button" value="Undo selected join" onclick="unjoin()">
					<div class="dtree">
						<script>
							<c:set var="selected" value="${dbdata.selectedTable}"/>
							<c:if test="${selected != null}">
								var sel = new dTree('sel');
								var n = 0;
								var nroot = n++;
								sel.add(nroot, -1,'Main query table (${selected.name})', '#');
								<c:forEach var="field" items="${selected.fieldList}">
									<c:choose>
						  			<c:when test="${field.joinField != null}">
											<c:set var="joinTable" value="${field.joinField.table}"/>
											var jt = n++;
											sel.add(jt, nroot,'Join table (${joinTable.name})',
												"javascript:selectColumn('${selected.name}', '${field.name}')");
						  				<c:forEach var="jtfield" items="${joinTable.fieldList}">
												sel.add(n++, jt,
												'${jtfield.name} ${jtfield.dbType}(${jtfield.length})',
												"javascript:selectColumn('${joinTable.name}', '${jtfield.name}')");
											</c:forEach>
						  			</c:when>
							  		<c:otherwise>
											sel.add(n++, nroot,
											'${field.name} ${field.dbType}(${field.length})',
											"javascript:selectColumn('${selected.name}', '${field.name}')");
							  		</c:otherwise>
									</c:choose>
								</c:forEach>
								document.write(sel);
							</c:if>
						
							var d = new dTree('d');
							n = 0;
							nroot = n++;
							d.add(nroot, -1,'Tables');
							<c:forEach var="tableEntry" items="${dbdata.otherTables}">
								var t = n++;
								d.add(t, nroot, "${tableEntry.key}", "javascript:selectTable('${tableEntry.key}')");
								<c:forEach var="field" items="${tableEntry.value.fieldList}">
									d.add(n++, t, '${field.name} ${field.dbType}(${field.length})' + pkText(${field.primaryKey}),
										"javascript:selectColumn('${tableEntry.key}', '${field.name}')");
								</c:forEach>
							</c:forEach>
							document.write(d);
						</script>
					</div>
		    
			    </t:putAttribute>
			</t:insertTemplate>
			
	    </t:putAttribute>
</t:insertTemplate>

connect("weblogic","weblogic", "t3://localhost:7001")

try:
    cd('JDBCSystemResources/${dsJndiName}')
except Exception, e:
    edit()
    
    dsname="${dsJndiName}"
    server="examplesServer"
    cd("Servers/"+server)
    target=cmo
    cd("../..")

    startEdit()
    jdbcSR = create(dsname,"JDBCSystemResource")
    theJDBCResource = jdbcSR.getJDBCResource()
    theJDBCResource.setName("${dsJndiName}")

    connectionPoolParams = theJDBCResource.getJDBCConnectionPoolParams()
    connectionPoolParams.setTestTableName("SQL SELECT 1")

    dsParams = theJDBCResource.getJDBCDataSourceParams()
    dsParams.addJNDIName("${dsJndiName}")

    driverParams = theJDBCResource.getJDBCDriverParams()
    driverParams.setUrl("${dsUrl}")
    driverParams.setDriverName("org.postgresql.Driver")

    driverParams.setPassword("${dsPassword}")
    driverProperties = driverParams.getProperties()

    proper = driverProperties.createProperty("user")
    proper.setValue("${dsUser}")

    jdbcSR.addTarget(target)

    save()
    activate(block="true")
else:
    print "Datasource ${dsJndiName} already exists"


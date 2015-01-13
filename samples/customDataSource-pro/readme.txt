Installing Custom Data Source Examples

These examples may be used in JasperServer Pro. For further information on developing
custom data sources, refer to the JasperServer User's Guide, or the JasperServer Pro Administration Guide.

The examples are found in <js-install>/samples/customDataSource-pro. Once you have deployed a JasperServer web 
application to your application server, you can use Ant to build and deploy the examples. 
If you used an installer to install JasperServer version 2.1 or later, you will have Ant installed already. Ant may be run with 
the following command:

<js-install>/ant/bin/ant <ant-arguments>(for Linux/Unix)
<js-install>\ant\bin\ant <ant-arguments> (for Windows)

If you installed JasperServer manually with a WAR file, you will need to download Ant from http://ant.apache.org. Ant 
1.6.2 was used for testing, but earlier versions should also work.

The JVM used for installing the examples needs to be a full Java Development Kit, because it needs to compile Java source 
files. Ensure that the JAVA_HOME environment variable points to a JDK installation.
The sample directory includes the following files and directories:
*	build.xml: The Ant build file
*	src: Java source directory
*	webapp: A directory containing other files required by the examples, such as JSPs and Spring configuration files, 
    which are copied directly to the JasperServer-Pro web application directory

Take the following steps to install the samples in your JasperServer-Pro web application (this can be built from the source code 
or the delivered version of JasperServer):
*	At the command line, change directories to the custom data source sample directory (<js-
    install>/samples/customDataSource-pro)
*	Edit build.xml and set the webAppDir property to the root of the JasperServer-Pro web application.
*	Run the Ant command (see above) with no arguments, which will execute the default target, which is named 
    deploy. The deploy target will run the following tasks:
    o	Compile the Java source under the src directory
    o	Deploy the compiled Java class files to the JasperServer-Pro web application
    o	Deploy files under the webapp directory to the the JasperServer-Pro web application
*	Restart the application server

My Custom Data Source PRO

The custom data source implementation creates a data source from JRDataSource. Its Spring bean definition
file is located in <js-install>/samples/customDataSource-pro/webapp/WEB-INF/applicationContext-sampleCDSWithMetData.xml.

JDBC Query Data Source

The JDBC custom data source implementation can establish JDBC connection, get metadata to build domain 
and extract selected data to build data source.  Its Spring bean definition file is located in <js-
install>/samples/customDataSource-pro/webapp/WEB-INF/applicationContext-JdbcQueryDataSource.xml. 

The implementation creates a data source by taking the following steps:
*   get the properties from JDBC Data Adapter in order to build custom data source
*	establish JDBC connection by driver, url, username and password
*	execute query and retreive metadata layer for domain used
*	Create a new data source from JDBCQueryDataSourceService

MongoDB Query Data Source

The MongoDB custom data source implementation can establish MongoDB connection, get metadata to build domain 
and extract selected data to build data source.  Its Spring bean definition file is located in <js-
install>/samples/customDataSource-pro/webapp/WEB-INF/applicationContext-MongoDBQueryDataSource.xml. 

The implementation creates a data source by taking the following steps:
*   get the properties from MongoDB Data Adapter in order to build custom data source
*	establish MONGODB connection from URL, username, and password
*	execute query and retreive metadata layer for domain used
*	Create a new data source from MongoDbDataAdapterService

Spark Query Data Source

The Spark custom data source implementation can establish HIVE connection, get metadata to build domain 
and extract selected data to build data source.  Its Spring bean definition file is located in <js-
install>/samples/customDataSource-pro/webapp/WEB-INF/applicationContext-SparkQueryDataSource.xml. 

The implementation creates a data source by taking the following steps:
*   get the properties from JDBC Data Adapter in order to build custom data source
*   hard code SPARK HIVE JDBC Driver information
*   construct URL in runtime based on database name, host, port, username and password
*	establish HIVE JDBC connection
*	execute query and retreive metadata layer for domain used
*	Create a new data source from JDBCQueryDataSourceService

Cassandra Query Data Source

The Cassandra custom data source implementation establishes Cassandra connection, gets metadata to 
builds domain and extract selected data to build data source.  Its Spring bean definition file is 
located in <js-install>/samples/customDataSource-pro/webapp/WEB-INF/applicationContext-CassandraQueryDataSource.xml.

The implementation creates a data source by taking the following steps:
*   get the properties from Cassandra Data Adapter in order to build custom data source
*    establish Cassandra connection from hostname, key space, port number, username, and password
*    execute CQL and retreive metadata layer for domain used
*    Create a new data source from CassandraDbDataAdapterService
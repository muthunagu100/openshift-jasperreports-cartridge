#!/bin/sh
echo $LD_LIBRARY_PATH | egrep "/var/lib/openshift/54b59a874382ecf02b00024d/jasper/common" > /dev/null
if [ $? -ne 0 ] ; then
PATH="/var/lib/openshift/54b59a874382ecf02b00024d/jasper/java/bin:/var/lib/openshift/54b59a874382ecf02b00024d/jasper/postgresql/bin:/var/lib/openshift/54b59a874382ecf02b00024d/jasper/common/bin:$PATH"
export PATH
LD_LIBRARY_PATH="/var/lib/openshift/54b59a874382ecf02b00024d/jasper/postgresql/lib:/var/lib/openshift/54b59a874382ecf02b00024d/jasper/common/lib:$LD_LIBRARY_PATH"
export LD_LIBRARY_PATH
fi

##### JAVA ENV #####
JAVA_HOME=/var/lib/openshift/54b59a874382ecf02b00024d/jasper/java
export JAVA_HOME

##### POSTGRES ENV #####

        ##### SSL ENV #####
SSL_CERT_FILE=/var/lib/openshift/54b59a874382ecf02b00024d/jasper/common/openssl/certs/curl-ca-bundle.crt
export SSL_CERT_FILE


. /var/lib/openshift/54b59a874382ecf02b00024d/jasper/scripts/build-setenv.sh

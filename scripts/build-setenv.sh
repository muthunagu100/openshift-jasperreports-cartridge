#!/bin/sh
LDFLAGS="-L/var/lib/openshift/54b59a874382ecf02b00024d/jasper/common/lib $LDFLAGS"
export LDFLAGS
CFLAGS="-I/var/lib/openshift/54b59a874382ecf02b00024d/jasper/common/include $CFLAGS"
export CFLAGS
		    
PKG_CONFIG_PATH="/var/lib/openshift/54b59a874382ecf02b00024d/jasper/common/lib/pkgconfig"
export PKG_CONFIG_PATH

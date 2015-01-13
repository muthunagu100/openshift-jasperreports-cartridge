/*!
 * @license FusionCharts JavaScript Library
 * Copyright FusionCharts Technologies LLP
 * License Information at <http://www.fusioncharts.com/license>
 *
 * @author FusionCharts Technologies LLP
 * @version fusioncharts/3.2.4-sr1.10100
 * @id fusionmaps.RioGrandedoNorte.20.10-30-2012 08:25:25
 */
FusionCharts(["private","modules.renderer.highcharts-riograndedonorte",function(){var p=this,k=p.hcLib,n=k.chartAPI,h=k.moduleCmdQueue,a=k.injectModuleDependency,i="M",j="L",c="Z",f="Q",b="left",q="right",t="center",v="middle",o="top",m="bottom",s="maps",l=false&&!/fusioncharts\.com$/i.test(location.hostname),r=!!n.geo,d,e,u,g;d=[{name:"RioGrandedoNorte",revision:20,creditLabel:l,standaloneInit:true,baseWidth:360,baseHeight:220,baseScaleFactor:10,entities:{"BR.RN":{outlines:[[i,2358,361,f,2313,361,2280,345,2246,329,2191,329,2152,330,2132,329,2056,325,2011,328,1981,329,1958,323,1931,316,1916,315,1894,314,1857,314,1850,314,1827,315,1806,315,1797,311,1778,303,1762,276,1740,240,1739,239,1731,230,1708,232,1679,234,1662,229,1652,226,1629,206,1612,191,1582,193,1521,197,1492,190,1472,186,1415,167,1414,167,1413,167,j,1357,92,1265,99,f,1163,121,1085,169,964,241,887,335,859,378,856,381,848,391,842,424,834,461,808,505,808,510,791,533,j,776,554,f,770,562,761,569,755,579,754,582,754,591,752,611,746,628,747,637,j,744,656,f,707,741,636,795,631,801,571,875,561,885,561,916,561,931,551,963,556,986,556,992,556,1015,554,1022,553,1023,536,1049,530,1059,519,1087,518,1088,504,1106,502,1108,488,1128,487,1131,479,1134,468,1138,461,1145,j,443,1158,f,438,1162,426,1176,418,1181,411,1193,395,1216,391,1221,368,1246,363,1249,359,1251,343,1260,335,1271,315,1285,291,1302,273,1302,j,221,1300,f,202,1300,190,1315,187,1318,171,1348,j,171,1354,174,1354,174,1358,f,176,1359,176,1365,176,1369,151,1393,j,118,1437,f,117,1439,86,1478,j,72,1491,f,70,1494,66,1498,j,58,1519,58,1585,f,61,1598,79,1605,j,110,1612,f,186,1615,211,1620,226,1623,232,1632,242,1652,248,1657,323,1692,327,1693,358,1691,368,1684,388,1669,413,1669,422,1669,443,1685,465,1702,485,1702,j,516,1699,f,533,1693,534,1693,537,1669,558,1646,572,1631,583,1629,621,1620,643,1617,670,1613,696,1600,723,1586,724,1575,735,1571,747,1553,759,1534,763,1529,777,1513,793,1493,809,1471,817,1464,831,1452,830,1444,j,840,1412,f,842,1406,850,1402,861,1397,867,1394,880,1385,893,1372,j,914,1345,f,927,1329,941,1327,961,1326,979,1321,j,983,1322,f,1003,1311,1007,1310,1013,1310,1020,1310,1036,1310,1043,1310,1054,1307,1069,1307,j,1069,1307,f,1074,1307,1103,1311,1128,1310,1128,1312,j,1123,1312,f,1195,1313,1203,1307,1228,1293,1245,1279,1278,1258,1285,1254,1315,1248,1318,1245,1326,1240,1329,1240,1330,1240,1331,1243,1342,1242,1354,1242,j,1355,1242,f,1373,1242,1401,1249,1408,1250,1408,1274,1408,1293,1409,1296,j,1413,1319,f,1413,1332,1400,1342,1392,1348,1389,1356,1386,1371,1380,1379,1378,1382,1365,1393,1353,1405,1353,1409,1350,1418,1331,1437,1307,1460,1302,1474,1299,1484,1278,1507,1273,1513,1256,1526,1250,1533,1236,1542,1222,1553,1215,1577,1215,1600,1212,1611,1211,1616,1188,1678,1187,1688,1175,1694,1152,1707,1151,1708,1148,1710,1138,1723,1134,1727,1105,1752,1093,1769,1088,1773,1080,1779,1072,1787,1056,1803,1056,1811,1056,1824,1068,1840,1076,1849,1088,1852,1103,1855,1112,1864,1121,1874,1128,1875,j,1265,1875,f,1293,1871,1313,1901,1323,1916,1330,1925,1332,1931,1334,1973,1339,1979,1398,1980,1446,1980,1459,1970,1483,1951,1507,1936,1525,1918,1541,1912,1572,1900,1585,1900,1615,1914,1615,1915,1628,1919,1636,1920,1658,1922,1662,1922,1662,1922,1696,1925,1698,1925,1699,1932,1699,1933,1707,1939,1719,1945,1756,1951,1781,1956,1781,1969,j,1789,1981,f,1796,1984,1804,1992,1811,1997,1822,2002,1831,2008,1831,2018,1831,2031,1818,2049,1805,2067,1805,2085,1805,2105,1821,2124,1826,2157,1845,2157,1855,2157,1863,2147,1874,2131,1902,2116,1913,2114,1924,2110,j,1940,2111,f,1950,2111,1979,2088,2009,2062,2018,2055,2036,2040,2039,2030,2039,1989,2042,1978,j,2042,1936,2041,1935,2041,1931,f,2036,1912,2027,1905,2017,1899,2013,1895,2005,1885,2005,1869,2005,1859,2013,1846,2015,1839,2017,1835,2018,1832,2024,1826,2028,1818,2032,1816,2036,1814,2050,1815,2076,1816,2085,1812,2088,1811,2093,1802,2090,1796,2090,1788,j,2088,1772,f,2086,1760,2079,1757,2065,1736,2062,1734,2046,1720,2031,1694,2027,1687,2027,1651,2028,1642,2030,1621,j,2031,1615,f,2043,1599,2050,1588,2073,1553,2090,1547,2132,1530,2140,1518,2154,1493,2186,1493,2209,1493,2229,1501,2235,1502,2248,1516,2258,1523,2265,1541,2279,1574,2283,1581,2284,1582,2300,1600,2312,1614,2330,1613,2363,1612,2375,1621,2388,1630,2402,1631,j,2400,1631,f,2400,1632,2444,1628,2457,1628,2505,1636,2525,1638,2558,1637,2593,1641,2609,1645,2616,1646,2666,1641,2681,1640,2693,1642,2701,1642,2715,1630,2724,1622,2745,1623,j,2795,1622,f,2811,1622,2814,1628,2818,1634,2827,1634,2841,1634,2880,1630,j,2878,1630,f,2878,1628,2898,1630,2918,1632,2921,1634,2942,1643,2952,1643,j,2969,1642,f,2970,1648,2988,1654,2999,1656,3001,1662,3003,1665,3006,1672,3012,1682,3031,1686,3037,1688,3049,1694,3058,1699,3070,1699,3086,1699,3098,1695,3125,1695,3147,1699,3153,1698,3160,1704,3170,1710,3205,1714,3347,1723,3489,1707,3524,1667,3505,1624,j,3454,1537,3444,1473,3406,1337,3410,1233,3370,1139,3329,987,3220,768,3211,708,3168,620,3157,551,f,3157,525,3143,507,3132,494,3120,476,3101,458,3100,456,3095,450,3055,413,3044,404,3033,402,3005,398,3004,398,j,3001,398,2738,323,f,2719,322,2702,321,2580,314,2553,314,2512,314,2465,337,f,2418,361,2358,361,c]],label:"Rio Grande do Norte",shortLabel:"RN",labelPosition:[178.5,112.5],labelAlignment:[t,v]}}}];g=d.length;if(r){while(g--){e=d[g];n(e.name.toLowerCase(),e,n.geo)}}else{while(g--){e=d[g];u=e.name.toLowerCase();a(s,u,1);h[s].unshift({cmd:"_call",obj:window,args:[function(w,x){if(!n.geo){p.raiseError(p.core,"12052314141","run","JavaScriptRenderer~Maps._call()",new Error("FusionCharts.HC.Maps.js is required in order to define vizualization"));return}n(w,x,n.geo)},[u,e],window]})}}}]);
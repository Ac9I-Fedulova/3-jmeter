/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9393939393939394, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Бронирование билета"], "isController": true}, {"data": [1.0, 500, 1500, "Забронировать билет"], "isController": false}, {"data": [1.0, 500, 1500, "Забронировать билет-5"], "isController": false}, {"data": [1.0, 500, 1500, "Забронировать билет-6"], "isController": false}, {"data": [1.0, 500, 1500, "Забронировать билет-7"], "isController": false}, {"data": [1.0, 500, 1500, "Выбрать место-7"], "isController": false}, {"data": [1.0, 500, 1500, "Зайти на главную страницу-6"], "isController": false}, {"data": [1.0, 500, 1500, "Выбрать место-5"], "isController": false}, {"data": [1.0, 500, 1500, "Зайти на главную страницу-5"], "isController": false}, {"data": [1.0, 500, 1500, "Выбрать место-6"], "isController": false}, {"data": [0.0, 500, 1500, "Зайти на главную страницу-4"], "isController": false}, {"data": [1.0, 500, 1500, "Выбрать место-3"], "isController": false}, {"data": [1.0, 500, 1500, "получение QR-кода"], "isController": false}, {"data": [1.0, 500, 1500, "Зайти на главную страницу-3"], "isController": false}, {"data": [1.0, 500, 1500, "Выбрать место-4"], "isController": false}, {"data": [1.0, 500, 1500, "Забронировать билет-0"], "isController": false}, {"data": [1.0, 500, 1500, "Зайти на главную страницу-2"], "isController": false}, {"data": [1.0, 500, 1500, "Выбрать место-1"], "isController": false}, {"data": [1.0, 500, 1500, "Забронировать билет-1"], "isController": false}, {"data": [1.0, 500, 1500, "получение QR-кода-4"], "isController": false}, {"data": [1.0, 500, 1500, "Зайти на главную страницу-1"], "isController": false}, {"data": [1.0, 500, 1500, "Выбрать место-2"], "isController": false}, {"data": [1.0, 500, 1500, "Забронировать билет-2"], "isController": false}, {"data": [1.0, 500, 1500, "Зайти на главную страницу-0"], "isController": false}, {"data": [1.0, 500, 1500, "Забронировать билет-3"], "isController": false}, {"data": [1.0, 500, 1500, "Выбрать место-0"], "isController": false}, {"data": [1.0, 500, 1500, "Забронировать билет-4"], "isController": false}, {"data": [1.0, 500, 1500, "получение QR-кода-0"], "isController": false}, {"data": [1.0, 500, 1500, "получение QR-кода-1"], "isController": false}, {"data": [1.0, 500, 1500, "Выбрать место"], "isController": false}, {"data": [1.0, 500, 1500, "получение QR-кода-2"], "isController": false}, {"data": [1.0, 500, 1500, "получение QR-кода-3"], "isController": false}, {"data": [1.0, 500, 1500, "Зайти на главную страницу-7"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 32, 0, 0.0, 93.71875, 6, 1776, 24.5, 116.6, 792.5499999999968, 1776.0, 6.772486772486773, 71.26157407407408, 6.427538029100529], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Бронирование билета", 1, 0, 0.0, 2586.0, 2586, 2586, 2586.0, 2586.0, 2586.0, 2586.0, 0.3866976024748647, 86.2913434116396, 6.720003746133024], "isController": true}, {"data": ["Забронировать билет", 1, 0, 0.0, 70.0, 70, 70, 70.0, 70.0, 70.0, 70.0, 14.285714285714285, 553.5853794642857, 71.37276785714285], "isController": false}, {"data": ["Забронировать билет-5", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 10.0, 100.0, 24.31640625, 63.671875], "isController": false}, {"data": ["Забронировать билет-6", 1, 0, 0.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 7.0, 142.85714285714286, 34.737723214285715, 90.95982142857143], "isController": false}, {"data": ["Забронировать билет-7", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 10.0, 100.0, 24.31640625, 63.671875], "isController": false}, {"data": ["Выбрать место-7", 1, 0, 0.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 7.0, 142.85714285714286, 34.737723214285715, 90.95982142857143], "isController": false}, {"data": ["Зайти на главную страницу-6", 1, 0, 0.0, 38.0, 38, 38, 38.0, 38.0, 38.0, 38.0, 26.31578947368421, 469.3410773026316, 14.519942434210527], "isController": false}, {"data": ["Выбрать место-5", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 10.0, 100.0, 24.31640625, 63.671875], "isController": false}, {"data": ["Зайти на главную страницу-5", 1, 0, 0.0, 38.0, 38, 38, 38.0, 38.0, 38.0, 38.0, 26.31578947368421, 469.3410773026316, 14.519942434210527], "isController": false}, {"data": ["Выбрать место-6", 1, 0, 0.0, 20.0, 20, 20, 20.0, 20.0, 20.0, 20.0, 50.0, 12.158203125, 31.8359375], "isController": false}, {"data": ["Зайти на главную страницу-4", 1, 0, 0.0, 1776.0, 1776, 1776, 1776.0, 1776.0, 1776.0, 1776.0, 0.5630630630630631, 18.21212081221847, 0.3194723043355856], "isController": false}, {"data": ["Выбрать место-3", 1, 0, 0.0, 15.0, 15, 15, 15.0, 15.0, 15.0, 15.0, 66.66666666666667, 16.145833333333336, 42.3828125], "isController": false}, {"data": ["получение QR-кода", 1, 0, 0.0, 119.0, 119, 119, 119.0, 119.0, 119.0, 119.0, 8.403361344537815, 303.0215992647059, 25.234703256302524], "isController": false}, {"data": ["Зайти на главную страницу-3", 1, 0, 0.0, 41.0, 41, 41, 41.0, 41.0, 41.0, 41.0, 24.390243902439025, 88.12881097560975, 13.457507621951219], "isController": false}, {"data": ["Выбрать место-4", 1, 0, 0.0, 60.0, 60, 60, 60.0, 60.0, 60.0, 60.0, 16.666666666666668, 539.0787760416667, 10.270182291666668], "isController": false}, {"data": ["Забронировать билет-0", 1, 0, 0.0, 16.0, 16, 16, 16.0, 16.0, 16.0, 16.0, 62.5, 309.26513671875, 34.48486328125], "isController": false}, {"data": ["Зайти на главную страницу-2", 1, 0, 0.0, 33.0, 33, 33, 33.0, 33.0, 33.0, 33.0, 30.303030303030305, 269.7975852272727, 16.80871212121212], "isController": false}, {"data": ["Выбрать место-1", 1, 0, 0.0, 26.0, 26, 26, 26.0, 26.0, 26.0, 26.0, 38.46153846153847, 9.352463942307693, 24.71454326923077], "isController": false}, {"data": ["Забронировать билет-1", 1, 0, 0.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 11.0, 90.9090909090909, 22.105823863636363, 58.41619318181819], "isController": false}, {"data": ["получение QR-кода-4", 1, 0, 0.0, 20.0, 20, 20, 20.0, 20.0, 20.0, 20.0, 50.0, 47.8515625, 27.685546875], "isController": false}, {"data": ["Зайти на главную страницу-1", 1, 0, 0.0, 30.0, 30, 30, 30.0, 30.0, 30.0, 30.0, 33.333333333333336, 207.03125, 18.587239583333336], "isController": false}, {"data": ["Выбрать место-2", 1, 0, 0.0, 21.0, 21, 21, 21.0, 21.0, 21.0, 21.0, 47.61904761904761, 11.579241071428571, 30.4594494047619], "isController": false}, {"data": ["Забронировать билет-2", 1, 0, 0.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 11.0, 90.9090909090909, 22.105823863636363, 58.14985795454546], "isController": false}, {"data": ["Зайти на главную страницу-0", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 19.055964828897338, 1.8974275190114067], "isController": false}, {"data": ["Забронировать билет-3", 1, 0, 0.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 6.0, 166.66666666666666, 40.364583333333336, 105.95703125], "isController": false}, {"data": ["Выбрать место-0", 1, 0, 0.0, 29.0, 29, 29, 29.0, 29.0, 29.0, 29.0, 34.48275862068965, 170.62904094827584, 18.92510775862069], "isController": false}, {"data": ["Забронировать билет-4", 1, 0, 0.0, 44.0, 44, 44, 44.0, 44.0, 44.0, 44.0, 22.727272727272727, 735.107421875, 14.00479403409091], "isController": false}, {"data": ["получение QR-кода-0", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 57.0, 17.543859649122805, 39.85060307017544, 9.662828947368421], "isController": false}, {"data": ["получение QR-кода-1", 1, 0, 0.0, 23.0, 23, 23, 23.0, 23.0, 23.0, 23.0, 43.47826086956522, 10.572350543478262, 27.938179347826086], "isController": false}, {"data": ["Выбрать место", 1, 0, 0.0, 111.0, 111, 111, 111.0, 111.0, 111.0, 111.0, 9.00900900900901, 349.1078969594595, 44.98346002252252], "isController": false}, {"data": ["получение QR-кода-2", 1, 0, 0.0, 16.0, 16, 16, 16.0, 16.0, 16.0, 16.0, 62.5, 15.19775390625, 39.97802734375], "isController": false}, {"data": ["получение QR-кода-3", 1, 0, 0.0, 48.0, 48, 48, 48.0, 48.0, 48.0, 48.0, 20.833333333333332, 673.8484700520834, 12.837727864583334], "isController": false}, {"data": ["Зайти на главную страницу-7", 1, 0, 0.0, 13.0, 13, 13, 13.0, 13.0, 13.0, 13.0, 76.92307692307693, 1371.844951923077, 42.44290865384615], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 32, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

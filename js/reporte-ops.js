/**
 * Archivo: reporte-ops.js
 * Autor:   Andy Sapper
 * Creado:  07/02/2015
 */

var fs = require('fs'),
    dataForGraph = [];

$(document).ready(function () {
    $('#modal-reporte-ops').modal('show');
});

// helper for fitting chart in window when printing
// Chrome, Firefox, and IE 10 support mediaMatch listeners
window.matchMedia('print').addListener(function(media) {
    chart.validateNow();
});

// functions
function generarReporteOPs() {
    alert("Este reporte aún no está habilitado.");
}

function createChart() {
    var chart = AmCharts.makeChart( "chartdiv", {
        "type": "serial",
        "theme": "light",
        "dataProvider": dataForGraph,
        "valueAxes": [{
            "gridColor": "#FFFFFF",
            "gridAlpha": 0.2,
            "dashLength": 0
        }],
        "gridAboveGraphs": true,
        "startDuration": 1,
        "graphs": [{
            "balloonText": "Venta a [[category]]: <b>Q.[[value]]</b>",
            "fillAlphas": 0.8,
            "lineAlpha": 0.2,
            "type": "column",
            "valueField": "venta"
        }],
        "chartCursor": {
            "categoryBalloonEnabled": false,
            "cursorAlpha": 0,
            "zoomable": false
        },
        "categoryField": "cliente",
        "categoryAxis": {
            "gridPosition": "start",
            "gridAlpha": 0,
            "tickPosition": "start",
            "tickLength": 20
        },
        "export": {
            "enabled": true
        },
        "rotate": true
    });
}














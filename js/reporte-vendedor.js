/**
 * Archivo: reporte-vendedor.js
 * Autor:   Andy Sapper
 * Creado:  07/02/2015
 */

var dataForGraph = [],  // data displayed in chart
    chart;              // chart

const CLIENTE         = 0,
      RANGO_FECHAS    = 1,
      NOMBRE_VENDEDOR = 2,
      COMISION        = 11,
      TOTAL_CLIENTE   = 12;

$(document).ready(function () {
    $('#modal-reporte-ventas').modal('show');
});

// helper for fitting chart in window when printing
// Chrome, Firefox, and IE 10 support mediaMatch listeners
window.matchMedia('print').addListener(function(media) {
    chart.validateNow();
});

// functions
function generarReporteVendedor() {
    var fileInput = document.getElementById("archivo-vendedor");

    if (fileInput !== null) {
        var file = fileInput.files[0],
            data = [],
            topClientes = [],
            cliente     = "",
            comision    = 0,
            ventas      = 0,
            tmpObj      = {},
            fechaInit   = "",
            fechaFinal  = "",
            vendedor    = "",
            totalComision = 0,
            totalVenta    = 0,
            reader        = new FileReader(),
            contents      = "";

        reader.onload = function(e) {
            contents = reader.result;

            // lee contenido y lo guarda en 2D array
            var arr = $.csv.toArrays(contents.toString());
            // procesa contenidos
            for (var i = 0; i < arr.length; i++) {
                
                // lee datos iniciales (rango de fechas, vendedor)
                if ( i === RANGO_FECHAS) {
                    fechaInit  = arr[RANGO_FECHAS][3];
                    fechaFinal = arr[RANGO_FECHAS][5];
                    vendedor   = arr[NOMBRE_VENDEDOR][4];
                    
                    $('#titulo-reporte').append('<h2 style="text-align:center">Reporte de Ventas - ' + vendedor + '</h2>');
                    
                    $('#titulo-reporte').append('<h3 style="text-align:center">Fechas del ' + fechaInit + ' al ' + fechaFinal + '</h3>');
                }
                
                // lee nombre de cliente
                if (arr[i][CLIENTE] !== "" && arr[i][1] === "") {
                    if ( cliente !== "") {
                        // agregar objeto con datos
                        data.push(tmpObj);
                        // limpiar objeto
                        tmpObj = {};
                    }
                    
                    cliente = arr[i][CLIENTE];
                    tmpObj.cliente = cliente;
                }
                // lee hasta encontrar totales de cliente
                else {
                    var lineOfTotals = true;
                    for (var j = 0; j < arr[i].length; j++) {
                        if ( j >= COMISION && lineOfTotals === false) {
                            if ( i < arr.length-2) {
                                comision = arr[i][COMISION];
                                ventas = arr[i][TOTAL_CLIENTE];
                                
                                // remover comas
                                comision = comision.split(',').join('');
                                ventas   = ventas.split(',').join('');
                                
                                // convertir a numeros
                         if (ventas !== "") {
                                    tmpObj.comision = parseFloat(comision).toFixed(2);
                                    tmpObj.venta    = parseFloat(ventas).toFixed(2);
                         }
                            }
                            else if ( i < arr.length-1) {
                                // guardar totales
                                totalComision = arr[i][COMISION];
                                totalVenta    = arr[i][TOTAL_CLIENTE];
                                
                                // remover comas de totales
                                totalComision = totalComision.split(',').join('');
                                totalVenta    = totalVenta.split(',').join('');
                                
                                // convertir a numeros
                                totalComision = parseFloat(totalComision).toFixed(2);
                                totalVenta    = parseFloat(totalVenta).toFixed(2);
                            }
                        }
                        else if ( arr[i][j] === "" && j < COMISION) {
                            lineOfTotals = false;
                        }
                    }
                }
            }
            // agrega ultimo cliente en archivo
            data.push(tmpObj);
            
            // ordena los clientes por ventas, de mayor a menor
            data.sort(sortingFunction);
            
            // incluir todos los datos en tabla
            for (var k = 0; k < data.length; k++) {
                $('#info-area tr:last').after('<tr>' +
                '<td>' + (k+1) + '</td>' +
                '<td>' + data[k].cliente + '</td>' +
                '<td>Q.' + addCommas(data[k].venta) + '</td>' +
                '<td>Q.' + addCommas(data[k].comision) + '</td>' +
                '</tr>');
                
                // agregar totales de comision y ventas
                if ( k === data.length-1) {
                    $('#info-area tr:last').after('<tr>' +
                    '<td></td>' +
                    '<td><strong>TOTAL<strong></td>' +
                    '<td><strong>Q.' + addCommas(totalVenta) + '</strong></td>' +
                    '<td><strong>Q.' + addCommas(totalComision) + '</strong></td>' +
                    '</tr>');
                }
            }
            
            // pasar a chart los clientes que forman el 80% del total
            var tmpTotal = 0,
                ventasTopOchenta = (totalVenta * 80) / 100;
            for (var i = 0; i < data.length && tmpTotal <= ventasTopOchenta; i++) {
             data[i].index = (i+1);
                topClientes.push(data[i]);

             tmpTotal += parseInt(data[i].venta);
            }

           var porcentajeClientes = (tmpTotal * 100) / totalVenta;
           $('#titulo-reporte').append('<h5 style="text-align: center">(Clientes en grafica representan el ' + Math.round(porcentajeClientes) + '% de la venta total)</h5>');

            // clear files selected
            $(":file").filestyle('clear');
            
            // display chart
            dataForGraph = topClientes;
            createChart();
        }

        reader.readAsText(file);
    } else {
        alert("Error: el archivo no fue leido");
    }
}

// ayuda a ordenar clientes por ventas
function sortingFunction(a, b) {
    return b.venta - a.venta;
}

// crea el chart de ventas
function createChart() {
    chart = AmCharts.makeChart( "chartdiv", {
	   "type": "pie",
	   "theme": "light",
	   "dataProvider": dataForGraph,
	   "titleField": "cliente",
	   "valueField": "venta",
	   "labelRadius": 5,

	   "radius": "42%",
	   "innerRadius": "60%",
	   "labelText": "[[title]]"
	} );
}

/* Function credit to: baacke on StackOverflow */
function addCommas(val){
    val = val.replace(/,/g, ''); //remove existing commas first
    var valSplit = val.split('.'); //then separate decimals
		
    while (/(\d+)(\d{3})/.test(valSplit[0].toString())) {
        valSplit[0] = valSplit[0].replace(/(\d+)(\d{3})/, '$1'+','+'$2');
    }
    
    if(valSplit.length == 2) { //if there were decimals
        val = valSplit[0] + "." + valSplit[1]; //add decimals back
    }
    else {
        val = valSplit[0];
    }

    return val;
}












/**
 * Archivo: reporte-hojas.js
 * Autor:   Andy Sapper
 * Creado:  07/01/2015
 */

var fs = require('fs'),
    dataForGraph = [],
    chart;

$(document).ready(function () {
    $('#modal-reporte-hojas').modal('show');
});

// helper for fitting chart in window when printing
// Chrome, Firefox, and IE 10 support mediaMatch listeners
window.matchMedia('print').addListener(function(media) {
    chart.validateNow();
});

// functions
function generarReporteHojas() {
    var impFile1    = document.getElementById("archivo-imp1"),
        sunhiveFile = document.getElementById("archivo-sunhive"),
        impFile2    = document.getElementById("archivo-imp2");
    
    if (impFile1.value != "" && sunhiveFile.value != "") {
        // determina si dos archivos fueron subidos
        var flag = (impFile2.value != "");
        
        // leer data de archivos
        var data        = leerArchivoImpresora(impFile1, flag),
            sunhiveData = leerArchivoSunhive(sunhiveFile),
            count_OPspliegosMas   = 0,
            count_OPspleigosMenos = 0,
            totalPliegosImp       = 0,
            totalPliegosAut       = 0,
            totalPliegosDif       = 0,
            fechaInit             = "",
            fechaFinal            = "";
        
        // agregar datos de Sunhive a data
        for (var p = 0; p < data.length; p++) {
            // unir con data de Sunhive
            for (var k = 0; k < sunhiveData.length; k++) {
                if (data[p].orden == sunhiveData[k].orden) {
                    // agregar datos de orden a dara
                    data[p].cliente    = sunhiveData[k].cliente;
                    data[p].pliegosAut = parseInt(sunhiveData[k].pliegos);
                    data[p].fechaAut   = sunhiveData[k].fechaAut;
                }
            }
            
            // checkar si datos Sunhive fueron encontrados para orden
            if (!data[p].cliente) {
                data[p].cliente    = "--- Cliente no encontrado ---";
                data[p].pliegosAut = "---";
                data[p].fechaAut   = "---";
                data[p].pliegosDif = data[p].pliegosImpresos;
            }
            else {
                if (data[p].cliente !== "OTROS") {
                    var dif = data[p].pliegosImpresos - data[p].pliegosAut;
                    data[p].pliegosDif = dif;
                } else {
                    data[p].pliegosAut = "---";
                    data[p].pliegosDif = data[p].pliegosImpresos;
                    data[p].registro   = "---";
                    data[p].fechaAut   = "";
                    data[p].fechaImpresa = "";
                }
            }
            
            // checkear fechas
            if (data[p].fechaImpresa != "") {
                var temp  = new Date(data[p].fechaImpresa);

                // asigna fecha de primer record
                if (p == 1) {
                    fechaInit  = temp;
                    fechaFinal = temp;
                }
                else {
                    // si fecha es menor que la inicial
                    if (temp < fechaInit) {
                        fechaInit = temp;
                    }

                    // si fecha es mayor que la final
                    if (temp > fechaFinal) {
                        fechaFinal = temp;
                    }
                }
            }
            
            // sumar pliegos impresos
            totalPliegosImp += data[p].pliegosImpresos;
            
            // sumar pleigso autorizados
            if (! isNaN(data[p].pliegosAut)) {
                totalPliegosAut += data[p].pliegosAut;
            }
            
            // checkear pliegos diferencia
            if (data[p].pliegosDif > 10) {
                data[p].orden = data[p].orden.toString() + "*";
                count_OPspliegosMas += 1;
            }
            else if (data[p].pliegosDif < 5) {
                data[p].orden = data[p].orden.toString() + "~";
                count_OPspleigosMenos += 1;
            }
            
            $('#info-area-hojas tbody').append('<tr>' +
            '<td>' + (p+1) + '</td>' +
            '<td>' + data[p].orden + '</td>' +
            '<td>' + data[p].cliente + '</td>' +
            '<td>' + data[p].pliegosImpresos + '</td>' +
            '<td>' + data[p].pliegosAut + '</td>' +
            '<td>' + data[p].pliegosDif + '</td>' +
            '<td>' + data[p].registro + '</td>' +
            '<td>' + data[p].fechaAut + '</td>' +
            '<td>' + data[p].fechaImpresa + '</td>' +
            '</tr>');
            
            // necesario para que al imprimir no se coma datos
            if (p === 16 || p === 39 || p === 61 || p === 84) {
                $('#info-area-hojas tbody').append('<tr>' +
                '<td>' + '...' + '</td>' +
                '<td>' + '' + '</td>' +
                '<td>' + '' + '</td>' +
                '<td>' + '' + '</td>' +
                '<td>' + '' + '</td>' +
                '<td>' + '' + '</td>' +
                '<td>' + '' + '</td>' +
                '<td>' + '...' + '</td>' +
                '</tr>');
            }
        }
        
        // calcular total pliegos diferencia
        totalPliegosDif = totalPliegosImp - totalPliegosAut;
        
        // display datos iniciales
        $('#info-header tbody').append('<tr class="info">' +
        '<td class="text-center">' + data.length + '</td>' +
        '<td class="text-center">' + count_OPspliegosMas + '</td>' +
        '<td class="text-center">' + count_OPspleigosMenos + '</td>' +
        '<td class="text-center">' + totalPliegosImp + '</td>' +
        '<td class="text-center">' + totalPliegosAut + '</td>' +
        '<td class="text-center">' + totalPliegosDif + '</td>' +
        '</tr>');
        
        // formatear fechas al español
        var final_fechaInit  = formatearFecha(fechaInit),
            final_fechaFinal = formatearFecha(fechaFinal);
        
        // display titulo y rango de fechas
        $('#titulo-reporte').append('<h2 style="text-align:center">Reporte de Hojas Impresas</h2>');
                
        $('#titulo-reporte').append('<h3 style="text-align:center">Fechas del ' + final_fechaInit + ' al ' + final_fechaFinal + '</h3>');
        
        // clear files selected
        $(":file").filestyle('clear');
        
        // set data for graph
        var pliegosNeutro = data.length - (count_OPspliegosMas + count_OPspleigosMenos);
        
        dataForGraph.push({"title": "OPS - 10+ pliegos diferencia", "value": count_OPspliegosMas});
        dataForGraph.push({"title": "OPS - 5- pliegos diferencia", "value": count_OPspleigosMenos});
        dataForGraph.push({"title": "OPS - pliegos diferencia buena", "value": pliegosNeutro});
        
        // display chart
        createChart();
    } else {
        alert("Error: uno(s) de los archivos necesarios no fue detectado");
    }
}

function crearArrayData(archivo) {
    var contents = fs.readFileSync(archivo.files[0].path);
    
    // eliminar "s de archivo (pues da error en file de Versa)
    contents = contents.toString().split('\"').join('');
    
    var arr = $.csv.toArrays(contents.toString(), {"separator":"\t"}),
        fileData  = [],
        otrosPliegos = 0;
    
    const FECHA    = 0,
          TITULO   = 1,
          PAG_IMP  = 4,
          REGISTRO = 7;
    
        // 0 - fecha
        // 1 - titulo
        // 2 - status
        // 3 - user
        // 4 - # paginas impresas
        // 5 - # paginas B/N
        // 6 - # paginas colores
        // 7 - # copias impresas
        // 8 - tamaño
        // 9 - media type
     
    // comienza en 2 para no leer titulo y headers
    for (var i = 2; i < arr.length; i++) {
        var tmpObj = {},
            orden  = "",
            fecha  = "";
        
        // leer fecha y modificar
        fecha = arr[i][FECHA];
        fecha = fecha.substring(0, 9);
        fecha = fecha.replace('-', ' ');
        fecha = fecha.replace('-', ' ');
        
        // leer # orden
        orden = arr[i][TITULO];
        orden = orden.substring(0, 5);
        
        if (isNaN(orden)) {
            // orden no es numero
            otrosPliegos += parseInt(arr[i][PAG_IMP]);
        }
        else {
            tmpObj.fechaImpresa    = fecha;
            tmpObj.orden           = parseInt(orden);    
            tmpObj.pliegosImpresos = parseInt(arr[i][PAG_IMP]);
            fileData.push(tmpObj);
        }
    }
    
    
    // agregar OTROS
    var tmpOtros = {};
    tmpOtros.orden = "";
    tmpOtros.cliente = "OTROS";
    tmpOtros.pliegosImpresos = otrosPliegos;
    fileData.push(tmpOtros);
    
    return fileData;
}

function leerArchivoImpresora(archivo, flag) {
    var fileData = crearArrayData(archivo),
        finalArr = [];
    
    if (flag) {
        var impFile2 = document.getElementById("archivo-imp2"),
            otroArchivoData = crearArrayData(impFile2);
        
        fileData = fileData.concat(otroArchivoData);
    }
    
    // ordenar de menor a mayor
    fileData.sort(ordenarPorOrden);
    
    // borrar ordenes repetidas, sumar pliegos impresos
    var i = 0, registro = 1;
    for (var j = 1; j < fileData.length; j++) {
        if (fileData[i].orden == fileData[j].orden) {
            // sumar pliegos de ordenes repetidas
            fileData[i].pliegosImpresos += fileData[j].pliegosImpresos;
            // sumar registros de ordenes repetidas
            registro += 1;
        }
        else {
            // agregar registro
            fileData[i].registro = registro;
            registro = 1;
            
            // guardar orden con suma de pliegos y registros
            finalArr.push(fileData[i]);
            // actualizar index
            i = j;
        }
    }
    
    return finalArr;
}

function ordenarPorOrden(a, b) {
    return a.orden - b.orden;
}

function leerArchivoSunhive(archivo) {
    var contents = fs.readFileSync(archivo.files[0].path),
        arr = $.csv.toArrays(contents.toString()),
        fileData  = [],
        finalArr  = [];
    
    const NUM_ORDEN = 0,
          CLIENTE   = 1,
          FECHA     = 2,
          PLIEGOS   = 4;
    
        // 0 - # orden
        // 1 - cliente
        // 2 - fecha
        // 3 - trabajo
        // 4 - pliegos
    
    // comienza en 4 para omitir los headers
    for (var i = 4; i < arr.length; i++) {
        var tmpObj = {},
            orden   = "",
            pliegos = "";

        orden = arr[i][NUM_ORDEN];
        if (isNaN(orden) || !orden) {
            // omitir - headers
        }
        else {
            tmpObj.orden   = parseInt(orden);
            tmpObj.cliente = arr[i][CLIENTE];
            tmpObj.fechaAut = arr[i][FECHA];
            
            // leer pliegos
            pliegos = arr[i][PLIEGOS];
            pliegos = pliegos.replace(',', '');
            
            tmpObj.pliegos = parseInt(pliegos);
            fileData.push(tmpObj);
        }
    }
    
    return fileData;
}

function formatearFecha(fecha) {
    var nuevaFecha = "";
    
    // dia
    nuevaFecha = nuevaFecha.concat(fecha.getDate() + " ");
    
    // mes
    switch(fecha.getMonth()) {
        case 0:
            nuevaFecha = nuevaFecha.concat("Enero ");
            break;
        case 1:
            nuevaFecha = nuevaFecha.concat("Feb. ");
            break;
        case 2:
            nuevaFecha = nuevaFecha.concat("Marzo ");
            break;
        case 3:
            nuevaFecha = nuevaFecha.concat("Abril ");
            break;
        case 4:
            nuevaFecha = nuevaFecha.concat("Mayo ");
            break;
        case 5:
            nuevaFecha = nuevaFecha.concat("Junio ");
            break;
        case 6:
            nuevaFecha = nuevaFecha.concat("Julio ");
            break;
        case 7:
            nuevaFecha = nuevaFecha.concat("Agosto ");
            break;
        case 8:
            nuevaFecha = nuevaFecha.concat("Sept. ");
            break;
        case 9:
            nuevaFecha = nuevaFecha.concat("Oct. ");
            break;
        case 10:
            nuevaFecha = nuevaFecha.concat("Nov. ");
            break;
        case 11:
            nuevaFecha = nuevaFecha.concat("Dec. ");
            break;
    }
    
    // año
    nuevaFecha = nuevaFecha.concat(fecha.getFullYear());
    
    return nuevaFecha;
}

function createChart() {
    chart = AmCharts.makeChart( "chartdiv", {
        "type": "pie",
        "theme": "light",
        "dataProvider": dataForGraph,
        "titleField": "title",
        "valueField": "value",
        "labelRadius": 5,
        
        "radius": "42%",
        "innerRadius": "60%",
        "labelText": "[[title]]",
        "export": {
            "enabled": true
        }
    } );
}














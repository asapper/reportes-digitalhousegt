/**
 * Archivo: general.js
 * Autor:   Andy Sapper
 * Creado:  06/30/2015
 */

// cambiar fondo y verso del dia acorde a fecha
var dia = ( new Date().getDate() ) % 18,
    versos = [
        { 
            "body": "\"Confía en el Señor de todo corazón, y no en tu propia inteligencia.\"",
            "verse": "Proverbios 3:5"
        },
        {
            "body": "\"Todo tiene su tiempo, y todo lo que se quiere debajo del cielo tiene su hora.\"",
            "verse": "Eclesiastes 3:1"
        },
        {
            "body": "\"Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús.\"",
            "verse": "Filipenses 4:7"
        },
        {
            "body": "\"Este es el día que hizo Jehová; nos gozaremos y alegraremos en él.\"",
            "verse": "Salmos 118:24"
        },
        {
            "body": "\"Un mandamiento nuevo os doy: Que os améis unos a otros; como yo os he amado, que también os améis unos a otros.\"",
            "verse": "Juan 13:34"
        },
        {
            "body": "\"Bendice, alma mía, a Jehová, y bendiga todo mi ser su santo nombre.\"",
            "verse": "Salmos 103:1"
        },
        {
            "body": "\"Ninguno tenga en poco tu juventud, sino sé ejemplo de los creyentes en palabra, conducta, amor, espíritu, fe y pureza.\"",
            "verse": "1 Timoteo 4:12"
        },
        {
            "body": "\"Todo lo puedo en Cristo que me fortalece.\"",
            "verse": "Filipenses 4:13"
        },
        {
            "body": "\"No paguéis a nadie mal por mal; procurad lo bueno delante de todos los hombres.\"",
            "verse": "Romanos 12:17"
        },
        {
            "body": "\"Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios estará contigo en dondequiera que vayas.\"",
            "verse": "Josué 1:9"
        },
        {
            "body": "\"El que no ama no conoce a Dios, porque Dios es amor.\"",
            "verse": "1 Juan 4:8"
        },
        {
            "body": "\"Jehová es mi pastor; nada me faltará. En lugares de delicados pastos me hará descansar; junto a aguas de reposo me pastoreará.\"",
            "verse": "Salmos 23:1-2"
        },
        {
            "body": "\"El hombre que tiene amigos ha de mostrarse amigo; y amigo hay más unido que un hermano.\"",
            "verse": "Proverbios 18:24"
        },
        {
            "body": "\"Nadie tiene mayor amor que este, que uno ponga su vida por sus amigos.\"",
            "verse": "Juan 15:13"
        },
        {
            "body": "\"Alma mía, en Dios solamente reposa, porque de él es mi esperanza.\"",
            "verse": "Salmos 62:5"
        },
        {
            "body": "\"Porque tú, oh Jehová, bendecirás al justo; Como con un escudo lo rodearás de tu favor.\"",
            "verse": "Salmos 5:12"
        },
        {
            "body": "\"La bendición de Jehová es la que enriquece, y no añade tristeza con ella.\"",
            "verse": "Proverbios 10:22"
        },
        {
            "body": "\"Mas Dios muestra su amor para con nosotros, en que siendo aún pecadores, Cristo murió por nosotros.\"",
            "verse": "Romanos 5:8"
        },
        {
            "body": "\"Amado, yo deseo que tú seas prosperado en todas las cosas, y que tengas salud, así como prospera tu alma.\"",
            "verse": "3 Juan 1:2"
        }
    ];

// actualizar datos
$(document).ready( function () {
    // cambiar imagen de strip
    var element = document.getElementById('main-strip');
    element.style.background = 'url(./images/backg-' + dia + '.jpg)';
    
    // cambiar verso del dia
    $('#verse-body').html(versos[dia].body);
    $('#verse').html(versos[dia].verse);
});









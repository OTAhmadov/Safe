$('document').ready(function() {

    $('#cssload-global').css({
        'top' : ( $(window).outerHeight() - $('#cssload-gloabal').outerHeight ) / 2 + 'px',
        'left' : ( $(window).outerWidth() - $('#cssload-gloabal').outerWidth ) / 2 + 'px'
    });
    
    setTimeout( function() {

        $('#cssload-global').addClass('fade');
        $('#main-div').removeClass('hidden');
        $('#main-div').addClass('fadeIn');
        $('#cssload-global').addClass('hidden');

    }, 1500);

});
$('document').ready(function() {

    var checkedArr = [];
    var inputs = $('#editable-table input');

    $('#actions').click(function(event) {

        /*Positioning and initiation of inner Loading*/

        opts['top'] = $('.content-header').outerHeight() + $('.content-upper-header').outerHeight() + ( $(window).outerHeight() -  $('.content-header').outerHeight() - $('.content-upper-header').outerHeight() ) / 2 + 'px';


        if( !($('.sidebar.menu').hasClass('collapsed')) )
            opts['left'] = ( $(window).outerWidth() + $('.sidebar.menu').outerWidth() ) / 2 + 'px';
        else
            opts['left'] = ( $(window).outerWidth() ) / 2 + 'px';

        spinner.spin(target);

        /*****/

        $('.main-page').toggleClass('hidden');


        setTimeout(function() {
            spinner.stop();

            $('.optional-page').toggleClass('hidden');
            checkedArr.length = 0;

            for(var i = 0; i < inputs.length; i++) {
                checkedArr.push(inputs[i].checked);
            }

        }, 1500);


    });

    $('#ok-button').click(function(event) {

        $('.main-page').toggleClass('hidden');
        $('.optional-page').toggleClass('hidden');

        checkedArr.length = 0;


        for( var i = 0; i < inputs.length; i++) {
            checkedArr.push(inputs[i].checked);
        }

    });

    $('#cancel-button').click(function(e) {


        $('.main-page').toggleClass('hidden');
        $('.optional-page').toggleClass('hidden');

        for(var i = 0; i < inputs.length; i++) {
            inputs[i].checked = checkedArr[i];
        }

    });


    /*Fix of bootstrap table*/

    $('#action-menu-collapse').click(function(e) {
       $('#editable-table').css('width', '100%');
    });

});
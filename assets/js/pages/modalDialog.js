$('document').ready(function() {

        $('#registration').click(function(e) {

            setTimeout(function() {

                $('.modal-dialog').css('marginTop', ( $(window).outerHeight() - $('.modal-dialog').outerHeight() ) / 2 + 'px');

            }, 200);

        });

});
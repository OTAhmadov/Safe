$('document').ready(function() {

    var thumbnails = $('.thumbnail');
    var flag = false;

    setTimeout(function() {
            /*Positioning of Datepicker*/


            $('.datepicker.form-control').focus(function(e) {
                $('.datepicker.datepicker-dropdown').css('top', $('.datepicker.form-control').get(0)
                        .getBoundingClientRect().top -  $('.datepicker.datepicker-dropdown').outerHeight() +
                    parseFloat($('.content-body').css('margin-top')) + 'px' );

            })

            /******/

            /*Positioning and initiation of inner Loading*/




            /*****/



            setTimeout( function() {





                for(var i = 0; i < thumbnails.length; i++) {

                    thumbnails.eq(i).css({
                        'width' : '150px',
                        'height' : '200px',
                        'max-height' : '200px',
                        'max-width' : '150px'
                    });

                }

                if(!flag) {
                    $('.btn-file-container').css({
                        'left' : ( $('.position-parent').outerWidth() - $('.btn-file-container').outerWidth() ) / 2 + 'px',
                        'top' : ( $('.position-parent').outerHeight() - $('.btn-file-container').outerHeight() ) / 2 + 'px'
                    });

                    flag = true;
                }

            }, 1000);



    }, 1600);


    $('.row.row-form .btn-danger.btn-block').click(function(e) {    // Cancel button handler

        $('.row.row-table').toggleClass('hidden');
        $('.row.row-form').toggleClass('hidden');

        $('.content-filters').toggleClass('hidden');  // Toggle for filters

        e.preventDefault();

    });


    $('.position-parent input').change(function(e) {                // Input button handler

        setTimeout(function() {

            $('.btn-file-container').css({
                'left' :  ( $('.position-parent').outerWidth() - $('.btn-file-container').outerWidth() ) / 2 + 'px',
                'bottom' : 0,
                'position' : 'static'
            });

            $('.btn-file-container').children().eq(0).css({
                'width' : '100%',
                'background-color' : '#eaeaea',
            });


            /*Changing size of thumbnail container*/
            /*thumbnails.eq(1).css({
             'width' : thumbnails.eq(1).children().eq(0).css('width'),
             'height' : thumbnails.eq(1).children().eq(0).css('height')
             });*/

        }, 10);

    });

});
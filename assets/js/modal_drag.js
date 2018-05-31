$(function(e) {

   

    $('#tree').on('click', 'a', function(e) {
        var chosenText = '';
        chosenText = $(this).text();

        $('.modal-content').on('click', '.btn.btn-primary', function(e) {

            if(chosenText) {
                $('.btn.tree-modal').text(chosenText);
            }

        });
    });

    $('.btn.tree-modal').on('click', function(event) {

        $('.tree-modal-container .modal-content').toggleClass('hidden');

        $('.tree-modal-container .close').on('click', function(e) {
            $('.tree-modal-container .modal-content').addClass('hidden');
        });

        $('.modal-footer .btn-primary').on('click', function(e) {
            $('.tree-modal-container .modal-content').addClass('hidden');
        });

    });

});
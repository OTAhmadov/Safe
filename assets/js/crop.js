$(function () {

    'use strict';
    
    var URL = window.URL || window.webkitURL;
    var $image = $('#main-div #userPhotoCrop');
    var originalImageURL = $image.attr('src');
    var uploadedImageURL;
    
    
    $('#main-div').on('shown.bs.modal','#mymodal', function () {
        var cropableImageSrc = $('#main-div .fileinput-preview img').attr('src');
        $('#main-div #userPhotoCrop').attr('src', cropableImageSrc);
        
        var $image = $('#main-div #userPhotoCrop');
        var croppable = false;
        var options = {
            aspectRatio: 1,
            ready: function () {
                croppable = true;
            },
            autoCropArea: 0.5
        };
        var $result = $('#main-div .fileinput-preview img');
        
        
        // Cropper
        $image.cropper(options);

        $('.docs-buttons').on('click', '[data-method]', function () {
            cropForm = new FormData();
            var $this = $(this);
            var data = $this.data();

            if (data.method === 'crop') {
                var croppedCanvas;

                if (!croppable) {
                    return;
                }

                // Crop
                croppedCanvas = $image.cropper('getCroppedCanvas');
                // console.log(croppedCanvas);
                // $('body').append('<img src="'+ croppedCanvas +'" />')
                // Show
                $result.attr('src', croppedCanvas.toDataURL('image/jpeg'));
                if($('#main-div input[name="user_photo"]')[0].files[0])
                 $('#main-div input[name="user_photo"]')[0].files[0].result = croppedCanvas.toDataURL('image/jpeg');
                // console.log($('#main-div input[name="user_photo"]')[0].files[0]);
                // $('body').append('<img src="'+ $('#main-div input[name="user_photo"]')[0].files[0].result +'" />')
                
                $image.cropper('getCroppedCanvas').toBlob(function (blob) {
                    cropForm.append('image', blob);
                });
                
            }
        });
    });
    
    $('#main-div').on('click', '.user-photo .fa-close',function(e) {
       e.preventDefault();

        if (uploadedImageURL) {
            URL.revokeObjectURL(uploadedImageURL);
            uploadedImageURL = '';
            $image.attr('src', originalImageURL);
        }

    });

});
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$(function () {

    var chosenLang;

    if (document.cookie.indexOf('lang') == -1) {
        chosenLang = Sec.lang;
    }

    else {
        chosenLang = Sec.getCookie('lang');
    }
    console.log('lange=' + chosenLang);


    if (Sec.token == '0') {
        Sec.initToken('tk');
    }


    Sec.loadLanguagePack('az');
    Sec.loadLanguagePack('en');
    Sec.loadLanguagePack('ru');


    setTimeout(function () {
        Sec.i18n();
        $.extend(jconfirm.pluginDefaults, {
            confirmButton: Sec.dictionary[Sec.lang]['buttons.ok'],
            cancelButton: Sec.dictionary[Sec.lang]['close'],
            title: Sec.dictionary[Sec.lang]['warning']
        });
        $.fn.datepicker.defaults.language = Sec.lang;
        $('.datepicker').datepicker();
    }, 1000)






    $('.language-buttons a').each(function () {
        console.log(chosenLang)
        if ($(this).attr('id') == chosenLang) {
            $(this).parent('li').prependTo($('.language-buttons ul'));

        }
    });

    $('.main-content').on('click', '.language-buttons a', function (e) {
        try {
            e.preventDefault();
            var lang = $(this).attr('id');

            if (lang != 'en' && lang != 'ru') {
                lang = 'az';
            }

            $('.language-buttons a').each(function () {
                $(this).removeAttr('data-chosen');
            });

            document.cookie = "lang=" + lang;
            window.location.reload();
        }
        catch (err) {
            console.error(err);
        }

    });

    Sec.Proxy.loadApplications();

    Sec.Proxy.loadModules('1000000', function (modules) {
        $('ul.module .mod-con').html(Sec.Service.parseModules(modules));
        var currModule = Sec.initCurrentModule('currModule');
        if (currModule != "") {
            Sec.currModule = currModule;
            var module = $('ul.module').find('.module-item[data-id="' + Sec.currModule + '"]');
            if (module.length) {
                module.click();
            }
            else {
                $('ul.module').find('.module-item').eq(0).click();
            }
        }
        else {
            $('ul.module').find('.module-item').eq(0).click();
        }

    });


    $('ul.module').on('click', '.module-item', function (e) {
        NProgress.done() ;
        NProgress.remove() ;
        try {
            NProgress.start() ;
            var data_attr = $(this).attr('data-attr');
            Sec.currModule = $(this).attr('data-id');
            document.cookie = "currModule=" + Sec.currModule;
            $('.content-body').load('partials/module_' + Sec.currModule + '.html', function () {
                $('#main-div #buttons_div').attr('title', 'Ümumi əməliyyatlar');
            });
            var moduleName = $(this).find('span').html();
            var html = '<li><a href="#">' +
                    '<span>' + moduleName + '</span>' +
                    '</a>' +
                    '</li>'

            $('ul.breadcrumb').html(html);
        }
        catch (err) {
            console.error(err);
        }
    });

    $('.content-body').on('click', '#operation_1000005', function () {
        try {
            if (!Sec.tempDataId) {
                $.notify("Please select data!", {
                    type: 'warning'
                });
                return false;
            }


            var block = $(this).parents('tr').attr('data-is-blocked');
            var string = block == "true" ? 'unblock' : 'block';
            $.confirm({
                title: Sec.dictionary[Sec.lang]['warning'],
                content: Sec.dictionary[Sec.lang][string + '_user'],
                confirm: function () {
                    Sec.Proxy.blockUser(Sec.tempDataId, block, function (code) {
                        if (code) {
                            if (code.code === Sec.statusCodes.OK) {
                                $.notify(Sec.dictionary[Sec.lang]['success'], {
                                    type: 'success'
                                });
                                Sec.Proxy.loadUsers();
                            }
                        }
                    });
                },
                theme: 'black'
            });


        }
        catch (err) {
            console.error(err);
        }
    });



    $('.content-body').on('click', '#operation_1000002', function () {

        try {
            if (!Sec.tempDataId) {
                $.notify(Sec.dictionary[Sec.lang]['select_information'], {
                    type: 'warning'
                });
            }

            $.confirm({
                title: Sec.dictionary[Sec.lang]['warning'],
                content: Sec.dictionary[Sec.lang]['delete_user'],
                confirm: function () {
                    Sec.Proxy.removeUser(Sec.tempDataId, function (code) {
                        if (code) {
                            if (code.code === Sec.statusCodes.OK) {
                                $.notify(Sec.dictionary[Sec.lang]['delete_user'], {
                                    type: 'success'
                                });
                                Sec.Proxy.loadUsers();
                            }
                        }
                    });
                },
                theme: 'black'
            });


        }
        catch (err) {
            console.error(err);
        }
    });

    $('.content-body').on('click', '.table tr', function (e) {
        try {
            Sec.tempDataId = $(this).attr("data-id");
        }
        catch (err) {
            console.error(err);
        }
    });

    $('.content-body').on('click', '#operation_1000006', function () {
        try {
            if (!Sec.tempDataId) {
                $.notify(Sec.dictionary[Sec.lang]['select_information'], {
                    type: 'warning'
                });
                return false;
            }

            $.confirm({
                title: Sec.dictionary[Sec.lang]['warning'],
                content: Sec.dictionary[Sec.lang]['deactivate_session'],
                confirm: function () {
                    Sec.Proxy.deactivateSession(Sec.tempDataId, function (code) {
                        if (code) {
                            if (code.code === Sec.statusCodes.OK) {
                                $.notify(Sec.dictionary[Sec.lang]['success'], {
                                    type: 'success'
                                });
                                Sec.Proxy.loadUsers();
                            }
                        }
                    });
                },
                theme: 'black'
            });



        }
        catch (err) {
            console.error(err);
        }

    });

    $('.content-body').on('click', '#operation_1000014', function (e) {
        try {
            if (!Sec.tempDataId) {
                $.notify(Sec.dictionary[Sec.lang]['select_information'], {
                    type: 'warning'
                });
                return false;
            }

            $.confirm({
                title: Sec.dictionary[Sec.lang]['warning'],
                content: Sec.dictionary[Sec.lang]['delete_role'],
                confirm: function () {
                    Sec.Proxy.removeRoles(Sec.tempDataId, function (role) {
                        if (role) {
                            if (role.code === Sec.statusCodes.OK) {
                                $.notify(Sec.dictionary[Sec.lang]['success'], {
                                    type: 'success'
                                });
                            }
                        }
                    });
                },
                theme: 'black'
            });


        }
        catch (err) {
            console.error(err);
        }
    });

    $('.content-body').on('click', '#operation_1000018', function () {
        try {
            if (!Sec.tempDataId) {
                $.notify(Sec.dictionary[Sec.lang]['select_information'], {
                    type: 'warning'
                });
                return false;
            }

            $.confirm({
                title: Sec.dictionary[Sec.lang]['warning'],
                content: Sec.dictionary[Sec.lang]['delete_info'],
                confirm: function () {
                    Sec.Proxy.removeDictionary(Sec.tempDataId, function (code) {
                        if (code) {
                            if (code.code === Sec.statusCodes.OK) {
                                $.notify(Sec.dictionary[Sec.lang]['success'], {
                                    type: 'success'
                                });
                                Sec.Proxy.loadDictionaries();
                            }
                        }
                    });
                },
                theme: 'black'
            });


        }
        catch (err) {
            console.error(err);
        }
    });

    $('.content-body').on('click', '#operation_1000017', function () {

        try {

            if (!Sec.tempDataId) {
                $.notify(Sec.dictionary[Sec.lang]['select_information'], {
                    type: 'warning'
                });
                return false;
            }

            $('#main-div #editDictionaryModal #' + Sec.lang + '').val('');
            $('#main-div #editDictionaryModal #code').val('');
            $('#main-div #editDictionaryModal .dic-type-select').html('');
            $('#main-div #editDictionaryModal .parent-select').html('');
            $('#main-div #editDictionaryModal #code').removeClass('error-border');
            $('#main-div #editDictionaryModal #code').removeClass('.success-border');
            $('#main-div #editDictionaryModal .span-code').removeClass('fa fa-close span-code-warning fa-check span-code-success');

            Sec.Proxy.getDictionaryDetails(Sec.tempDataId, function (result) {
                if (result) {
                    if (result.code === Sec.statusCodes.OK && result.data) {
                        var html = '';
                        var parentId = result.data.parentId;
                        Sec.Proxy.loadDictionariTypes(function (data) {
                            $.each(data.data, function (i, v) {
                                html += '<option value="' + v.id + '">' + v.value.az + '</option>';
                            });
                            $('#editDictionaryModal .dic-type-select').html(html);
                            if (parentId != 0) {
                                Sec.Proxy.getDictionaryDetails(parentId, function (details) {
                                    Sec.Proxy.loadDictionariesByTypeId(details.data.typeId, 0, function (type) {
                                        var html2 = '';
                                        $.each(type.data, function (i, v) {
                                            html2 += '<option value="' + v.id + '">' + v.value[Sec.lang] + '</option>';
                                        });
                                        $('#editDictionaryModal .parent-select').html(html2);
                                        $('#editDictionaryModal .parent-select').prepend('<option value="0">' + Sec.dictionary[Sec.lang]["no_parent"] + '</option>');
                                        $('#editDictionaryModal .parent-select').find('option[value=' + parentId + ']').attr('selected', 'selected');
                                        $('#editDictionaryModal .dic-type-select').find('option[value=' + details.data.typeId + ']').attr('selected', 'selected');
                                    })
                                });
                            } else {
                                $('#editDictionaryModal .parent-select').prepend('<option value="0">' + Sec.dictionary[Sec.lang]["no_parent"] + '</option>');
                                $('#editDictionaryModal .parent-select').find('option[value=0]').attr('selected', 'selected');
                            }

                        });


                        $('#code').val(result.data.code);
                        $('#editDictionaryModal .btn-dictionary').attr('operation-type', 'edit');
                        $('#editDictionaryModal').modal({
                            backdrop: false
                        });
                        $('#editDictionaryModal').find('.input-dictionary-name').removeAttr('id').attr('id', Sec.lang);
                        $('.content-body #az').val(result.data.value.az);
                        $('.content-body #en').val(result.data.value.en);
                        $('.content-body #ru').val(result.data.value.ru);
                    }
                    else {
                        $.notify(Sec.dictionary[Sec.lang]['error'], {
                            type: 'danger'
                        });
                    }
                }
            });
        }
        catch (err) {
            console.error(err);
        }
    });

    $('.content-body').on('click', '#operation_1000016', function () {

        if (!Sec.dicTypeId) {
            $.notify(Sec.dictionary[Sec.lang]['select_information'], {
                type: 'warning'
            });
            return false;
        }

        $('#main-div #editDictionaryModal #' + Sec.lang + '').val('');
        $('#main-div #editDictionaryModal #code').val('');
        $('#main-div #editDictionaryModal #code').removeClass('error-border success-border');
        $('#main-div #editDictionaryModal .span-code').removeClass('fa fa-close span-code-warning fa-check span-code-success');

        try {
            var html = '';
            Sec.Proxy.loadDictionariTypes(function (result) {   
                $.each(result.data, function (i, v) {
                    html += '<option value="' + v.id + '">' + v.value.az + '</option>';
                });
                $('#editDictionaryModal .dic-type-select').html(html);
                $('#editDictionaryModal .dic-type-select').find('option').eq(0).attr('selected', 'selected');
                var type = $('#editDictionaryModal .dic-type-select').find('option[selected]').val();
                Sec.Proxy.loadDictionariesByTypeId(type, 0, function (result) {
                    var html2 = '';
                    $.each(result.data, function (i, v) {
                        html2 += '<option value="' + v.id + '">' + v.value.az + '</option>';
                    });
                    $('#editDictionaryModal .parent-select').html(html2);
                    $('#editDictionaryModal .parent-select').prepend('<option value="0">' + Sec.dictionary[Sec.lang]['no_parent'] + '</option>');
                    $('#editDictionaryModal .parent-select').find('option').eq(0).attr('selected', 'selected');
                });
            });
            $('#code').val('');
            $('#az').val('');
            $('#en').val('');
            $('#ru').val('');
            $('#main-div .parent-div').hide()
            // $('#main-div .parent-show').attr('data-type', 'show')
            $('#main-div .parent-show').show(1)
            $('#editDictionaryModal .btn-dictionary').attr('operation-type', 'add');
            $('#editDictionaryModal').modal({
                backdrop: false
            });
            $('#editDictionaryModal').find('.input-dictionary-name').removeAttr('id').attr('id', Sec.lang)
        }
        catch (err) {
            console.error(err);
        }
    });

    $('.content-body').on('click', '#editDictionaryModal .dic-type-select option', function () {
        try {
            var type = $(this).val();
            Sec.Proxy.loadDictionariesByTypeId(type, 0, function (result) {
                var html2 = '';
                $.each(result.data, function (i, v) {
                    html2 += '<option value="' + v.id + '">' + v.value[Sec.lang] + '</option>';
                });
                $('#editDictionaryModal .parent-select').html(html2);
                $('#editDictionaryModal .parent-select').prepend('<option value="0">' + Sec.dictionary[Sec.lang]["no_parent"] + '</option>');
                $('#editDictionaryModal .parent-select').find('option').eq(0).attr('selected', 'selected');
            });
        }
        catch (err) {
            console.error(err);
        }
    });

    $('.content-body').on('click', '#editDictionaryModal .btn-dictionary', function () {

        try {
            var operationType = $(this).attr('operation-type');
            var code = $('#code').val();
            var lang = Sec.lang[0].toUpperCase() + Sec.lang.slice(1);
            if (code.trim().length == 0) {
                $.notify(Hsis.dictionary[Hsis.lang]['fill_code'], {
                    type: 'warning'
                });
                return false;
            }

            var dictionary = {
                code: $('#code').val(),
                parentId: $('.parent-select').find('option:selected').val(),
                typeId: Sec.dicTypeId

            };
            var nameLang = $('.content-body #' + Sec.lang).val();
            dictionary["name" + lang] = nameLang;

            if (nameLang.trim().length == 0) {
                $.notify(Sec.dictionary[Sec.lang]['fill_dictionary_name'], {
                    type: 'warning'
                });
                return false;
            }

            if (operationType == 'edit') {
                dictionary.id = Sec.tempDataId;

                Sec.Proxy.editDictionary(dictionary, function (result) {
                    if (result) {
                        if (result.code === Sec.statusCodes.OK) {
                            $('#editDictionaryModal').modal('hide');
                            $.notify(Sec.dictionary[Sec.lang]['success'], {
                                type: 'success'
                            });
                        }
                    }
                });
            }
            else if (operationType == 'add') {

                Sec.Proxy.addDictionary(dictionary, function (result) {
                    if (result) {
                        if (result.code === Sec.statusCodes.OK) {
                            $.notify(Sec.dictionary[Sec.lang]['success'], {
                                type: 'success'
                            });
                        }
                    }
                });
            }
        }
        catch (err) {
            if (console)
                console.error(err);
        }
    });

    $('.content-body').on('click', '#operation_1000004', function () {
        try {
            $('#exportModal').modal();
        }
        catch (err) {
            console.error(err);
        }


    });

    $('.content-body').on('click', '#exportModal a.export', function () {
        try {
            var type = $(this).attr('data-value');
            window.open(Sec.urls.REPORT + 'reports/users/' + type + '?token=' + Sec.token, '_blank');
            $('#exportModal').modal('hide');
        }
        catch (err) {
            console.error(err);
        }
    });

    $('.content-body').on('click', '#operation_1000000', function (e) {
        try {
            Sec.operationList = 'add';
            $('.content-body').load('partials/user_modal.html', function () {
                $('body').find('.sidebar').fadeOut(0);
                $('#confirm').html(Sec.dictionary[Sec.lang]["users.add"]);
            });
        }
        catch (err) {
            console.error(err);
        }
    });

    $('.content-body').on('click', '#operation_1000001', function (e) {
        try {
            $('body').addClass('operation-edit');
            var operation = $(this);
            if (!Sec.tempDataId) {
                $.notify(Sec.dictionary[Sec.lang]['select_information'], {
                    type: 'warning'
                });
            }
            $("#main-div .crop-btn").hide();

            Sec.operationList = 'edit';
            $('.content-body').load('partials/user_modal.html', function () {
                $('body').find('.sidebar').fadeOut(0);
                $('#confirm').html(Sec.dictionary[Sec.lang]["users.edit"]);

                var id = operation.parents('tr').attr('data-image-id');
                $('#userPhoto').attr('data-image-id', id);
            });

        }
        catch (err) {
            console.error(err);
        }

    });

    $('.content-body').on('click', '#operation_1000012', function () {
        try {
            $('.content-body').load('partials/user_group.html', function () {
                var roleId = $('#main-div .profile-data').attr('data-role');
                Sec.Proxy.getOperationsByRoleId(roleId,function (data) {
                    $('.content-body').find('#btn-user-group-ok').attr('operation-type', 'add');
                    $('.user-group-name-az').val('');
                    $('.user-group-name-en').val('');
                    $('.user-group-name-ru').val('');
                    Sec.Service.parseOperationToTable(data.data);
                });
            });
             $('body').find('.sidebar').fadeOut(0);
             $('body').find('.main-content').addClass('group-view');
        }
        catch (err) {
            console.error(err);
        }
    });

    $('.content-body').on('click', '#operation_1000013', function () {
        try {
            $('.content-body').load('partials/user_group.html', function () {
                $('body').find('.sidebar').fadeOut(0);
                $('body').find('.main-content').addClass('group-view');
                $('.content-body').find('#btn-user-group-ok').attr('operation-type', 'edit');
                $('.content-body').find('#btn-user-group-ok').attr('data-role-id', Sec.tempDataId);

                Sec.Proxy.loadRolesById(Sec.tempDataId, function (data) {
                    $('.user-group-name').val(data.data.value[Sec.lang]);
                    setTimeout(function(){
                        $('body #parentRole').find('option[value="'+data.data.parentId+'"]').prop('selected',true);
                    },1000);
                });
                var currentUserRoleId = $('.profile-data').attr('data-role');
                Sec.Proxy.getOperationsByRoleId(currentUserRoleId,function (result) {
                    Sec.Proxy.getOperationsByRoleId(Sec.tempDataId, function (data) {
                        var html = '';

                        $.each(result.data, function (i, v) {
                            var count = false;
                            $.each(data.data, function (x, y) {
                                if (v.id == y.id) {
                                    html += '<tr data-id="' + v.id + '">' +
                                            '<td>' + v.application.name[Sec.lang] + ' / ' + v.module.name[Sec.lang] + '</td>' +
                                            '<td>' + v.name[Sec.lang] + '</td>' +
                                            '<td>' +
                                            '<label>' +
                                            '<input value = "' + v.id + '"  name = "modOpIds" class="switch toggle switch-warning" type="checkbox" checked>' +
                                            '<span class="text"></span>' +
                                            '</label>' +
                                            '</td>' +
                                            '</tr>';
                                    count = true;
                                }

                            });

                            if (!count) {
                                html += '<tr data-id="' + v.id + '">' +
                                        '<td>' + v.application.name[Sec.lang] + ' / ' + v.module.name[Sec.lang] + '</td>' +
                                        '<td>' + v.name[Sec.lang] + '</td>' +
                                        '<td>' +
                                        '<label>' +
                                        '<input value = "' + v.id + '"  name = "modOpIds" class="switch toggle switch-warning" type="checkbox">' +
                                        '<span class="text"></span>' +
                                        '</label>' +
                                        '</td>' +
                                        '</tr>';
                            }

                        });

                        $('#operation-table tbody').html(html);

                    });
                });
            });
        }
        catch (err) {
            console.error(err);
        }
    });

    $('.content-body').on('click', '#btn-user-group-ok', function () {
        try {
            var operationType = $(this).attr('operation-type');
            var lang = Sec.lang[0].toUpperCase() + Sec.lang.slice(1);
            var roleName = $('input[name="roleName' + lang + '"]');
            if (roleName.val().trim().length == 0) {
                $.notify(Sec.dictionary[Sec.lang]['fill_user_group_name'], {
                    type: 'warning'
                });
                return false;
            }
            if (operationType === 'add') {
                $.ajax({
                    url: Sec.urls.AdminRest + 'users/roles/add?token=' + Sec.token,
                    type: 'POST',
                    data: $('#user-group-form').serialize(),
                    success: function (data) {
                        if (data) {
                            switch (data.code) {
                                case Sec.statusCodes.ERROR:
                                    $.notify("Xəta baş verdi!", {
                                        type: 'danger'
                                    });

                                    break;
                                case Sec.statusCodes.INVALID_PARAMS:
                                    $.notify("Daxil edilən parametrlər yanlışdır!", {
                                        type: 'danger'
                                    });
                                    break;
                                case Sec.statusCodes.OK:
                                    $.notify(Sec.dictionary[Sec.lang]['success'], {
                                        type: 'success'
                                    });
                                      $('body').find('.sidebar').fadeIn(0);
                                       $('body').find('.main-content').removeClass('group-view');
                                    break;
                                case Sec.statusCodes.UNAUTHORIZED:
                                    window.location = Sec.urls.ROS + 'login';
                                    break;
                            }
                        }
                        ;
                    }
                });
            }
            else if (operationType === 'edit') {
                var roleId = $(this).attr('data-role-id');
                $.ajax({
                    url: Sec.urls.AdminRest + 'users/roles/' + roleId + '/edit?token=' + Sec.token,
                    type: 'POST',
                    data: $('#user-group-form').serialize(),
                    success: function (data) {
                        if (data) {
                            switch (data.code) {
                                case Sec.statusCodes.ERROR:
                                    $.notify("Xəta baş verdi!", {
                                        type: 'danger'
                                    });
                                    break;
                                case Sec.statusCodes.OK:
                                    $.notify(Sec.dictionary[Sec.lang]['success'], {
                                        type: 'success'
                                    });
                                      $('body').find('.sidebar').fadeIn(0);
                                       $('body').find('.main-content').removeClass('group-view');
                                    break;
                                case Sec.statusCodes.UNAUTHORIZED:
                                    window.location = Sec.urls.ROS + 'login';
                                    break;
                                case Sec.statusCodes.INVALID_PARAMS:
                                    $.notify("daxil edilən parametrlər yanlışdır!", {
                                        type: 'danger'
                                    });
                                    break;
                            }
                        }
                        ;
                    }
                });
            }
        }
        catch (err) {
            console.error(err);
        }
    });

    $('.content-body').on('click', '#btn-user-group-cancel', function () {
        try {
            $('.content-body').load('partials/module_' + Sec.currModule + '.html');
            $('body').find('.sidebar').fadeIn(0);
            $('body').find('.main-content').removeClass('group-view');
        }
        catch (err) {
            console.error(err);
        }
    });

    $('.content-body').on('click', '.table tr', function (e) {
        try {
            $(this).parents('tbody').find('tr').removeClass('row-selected');
            $(this).addClass('row-selected');
        }
        catch (err) {
            console.error(err);
        }
    });

    $('.content-body').on('click', '#user-group-table tr', function () {
        try {
            var roleId = $(this).attr('data-id');
            var currentUserRoleId = $('.profile-data').attr('data-role');
            Sec.Proxy.getOperations(function (result) {
                Sec.Proxy.getOperationsByRoleId(roleId, function (data) {
                    var html = '';
                    $.each(result.data, function (i, v) {
                        var count = false;
                        $.each(data.data, function (x, y) {
                            if (v.id == y.id) {
                                html += '<tr data-id="' + v.id + '">' +
                                        '<td>' + v.application.name[Sec.lang] + ' / ' + v.module.name[Sec.lang] + '</td>' +
                                        '<td>' + v.name[Sec.lang] + '</td>' +
                                        '<td>' +
                                        '<label>' +
                                        '<span class="glyphicon glyphicon-ok" aria-hidden="true" style="color: green;font-size: 15px;"></span>' +
                                        '<span class="text"></span>' +
                                        '</label>' +
                                        '</td>' +
                                        '</tr>';
                                count = true;
                            }

                        });

                        if (!count) {
                            html += '<tr data-id="' + v.id + '">' +
                                    '<td>' + v.application.name[Sec.lang] + ' / ' + v.module.name[Sec.lang] + '</td>' +
                                    '<td>' + v.name[Sec.lang] + '</td>' +
                                    '<td>' +
                                    '<label>' +
                                    '<span aria-hidden="true" style="color: red;font-size: 15px;" class="glyphicon glyphicon-remove off"></span>' +
                                    '<span class="text"></span>' +
                                    '</label>' +
                                    '</td>' +
                                    '</tr>';
                        }

                    });
                    $('#operation-view-table tbody').html(html);

                });
            });
        }
        catch (err) {
            console.error(err);
        }
    });

    $('.content-body').on('keypress', '#userSearch', function (e) {
        try {
            if (e.keyCode == 13) {
                var keyword = $('#userSearch').val();
                var type = $('.user-search-form input[name="type"]').val();
                var orgId = $('.user-search-form input[name="orgId"]').val();
                var tableName = $('#main-div .row-table table').attr('id')
                
                if (keyword.trim().length > 2) {
                    $('.content-body .user-search-form input[name="keyword"]').val(keyword);
                    var params = $('.content-body .user-search-form').serialize();
                    if(tableName === 'unregistered-users-table') {
                        Sec.Proxy.getUnregistretedUsersList('', type, orgId, function (data) {
                            if (data) {
                                if (data.code == Sec.statusCodes.OK) {
                                    Sec.Service.parseUnregisteredUsers(data.data, type, '');
                                    
                                }
                            }
                        }, keyword)
                    }
                        
                    else if(tableName === 'users-table')    
                        Sec.Proxy.loadUsers('',params);
                }
                else if (keyword.trim().length == 0) {
                    if(tableName === 'users-table') 
                        Sec.Proxy.loadUsers();
                    else if(tableName === 'unregistered-users-table') {
                        Sec.Proxy.getUnregistretedUsersList('', type, orgId, function (data) {
                            if (data) {
                                if (data.code == Sec.statusCodes.OK) {
                                    Sec.Service.parseUnregisteredUsers(data.data, type, '');
                                    
                                }
                            }
                        }, '');
                    }
                }
            }

        }
        catch (err) {
            console.error(err);
        }
    });

    $('.content-body').on('mouseenter', '#logs-table .operations.dropdown-toggle', function () {
        try {
            var td = $(this).closest('td');
            var popover = td.find('.popover');
            popover.show();

            $(this).click(function (e) {
                popover.hide();
            });
        }
        catch (err) {
            console.error(err);
        }
    });

    $('.content-body').on('mouseleave', '#logs-table .operations.dropdown-toggle', function () {
        try {
            var td = $(this).closest('td');
            var popover = td.find('.popover');
            popover.hide();
        }
        catch (err) {
            console.error(err);
        }
    });



    $('.content-body').on('click', '#userGroup a', function (e) {
        try {
            var name = $(this).html();
            $('.content-body').find('#userGroupName').html(name);
            var roleId = $(this).attr('data-id');
            
            $('.content-body .user-search-form input[name="roleId"]').val(roleId);
            $('.btn-load-more').removeAttr('data-page');
            var params = $('#main-div .user-search-form').serialize();
            Sec.Proxy.loadUsers('', params);



        }
        catch (err) {
            console.error(err);
        }

    });

    $('.content-body').on('click', '.btn-load-more', function (e) {
        try {
            var typeTable = $(this).attr('data-table');
            var $btn = $(this);
            var type = $btn.attr('data-page');
            var page = parseInt(type ? type : '2');
            var paramsLogs = $('#main-div .log-search-form').serialize();
            var userKeyword = $('#userSearch').val();
            var paramsUsers = $('#main-div .user-search-form').serialize();
            $btn.prop('disabled', true);

            if (typeTable == 'users') {

                Sec.Proxy.loadUsers(page, paramsUsers, function (data) {
                    $btn.attr('data-page', parseInt(page) + 1);
                    $btn.prop('disabled', false);

                    if (!data || (data.userList.length == 0)) {
                        $btn.remove();
                    }
                });
            }
            else if (typeTable == 'logs') {

                Sec.Proxy.loadLogs(page, paramsLogs, function (data) {
                    $btn.attr('data-page', parseInt(page) + 1);
                    $btn.prop('disabled', false);

                    if (!data || (data.length == 0)) {
                        $btn.remove();
                    }
                });
            } else if (typeTable == 'unregistered_users') {
                var type = $('.user-search-form input[name="type"]').val();
                var orgId = $('.user-search-form input[name="orgId"]').val();
                Sec.Proxy.getUnregistretedUsersList(page, type, orgId, function (data) {
                    if (data) {
                        if (data.code == Sec.statusCodes.OK) {
                            Sec.Service.parseUnregisteredUsers(data.data, type, page);
                            $btn.attr('data-page', parseInt(page) + 1);
                            $btn.prop('disabled', false);
                            if (!data.data || (data.data.length == 0)) {
                                $btn.remove();
                            }
                        }
                    }
                })
            }
        }
        catch (err) {
            console.error(err);
        }
    });

    $('.content-body').on('change', '.log-date', function () {
//        Sec.dateFilterLog = $(this).val();
        var date = $(this).val();
        $('.content-body .log-search-form input[name="date"]').val(date);
        var params = $('#main-div .log-search-form').serialize();
        Sec.Proxy.loadLogs('', params);
    });

    $('.content-body').on('keypress', '#log_search', function (e) {
        try {

            if (e.keyCode == 13) {
                var keyword = $('#log_search').val();
                $('.content-body .log-search-form input[name="search"]').val(keyword);
                var params = $('#main-div .log-search-form').serialize();
                Sec.Proxy.loadLogs('', params)

            }

        }
        catch (err) {
            console.error(err);
        }
    });

    $('#logoutForm').attr("action", Sec.urls.ROS + "logout");
    $('#logoutForm input[name="token"]').val(Sec.token);

    Sec.Proxy.getProfile();

    $('body').on('click', '.sub_module_1000045', function () {
        try {

            $('.content-body').load('partials/unregistered_users.html', function () {
                var type = 'emp';
                $('.user-search-form input[name="type"]').val(type);
                var orgId = Sec.node.id ? Sec.node.id : 0;
                Sec.Proxy.getUnregistretedUsersList('', type, orgId, function (data) {
                    if (data) {
                        if (data.code == Sec.statusCodes.OK) {
                            Sec.Service.parseUnregisteredUsers(data.data, type);
                        }
                    }
                });
            });

        }
        catch (err) {
            console.error(err);
        }
    });

    $('body').on('click', '.sub_module_1000044', function () {
        try {
            $('.content-body').load('partials/unregistered_users.html', function () {
                var type = 'stud';
                $('.user-search-form input[name="type"]').val(type);
                var orgId = Sec.node.id ? Sec.node.id : 0;
                Sec.Proxy.getUnregistretedUsersList('', type, orgId, function (data) {
                    if (data) {
                        if (data.code == Sec.statusCodes.OK) {
                            Sec.Service.parseUnregisteredUsers(data.data, type);
                        }
                    }
                });
            });

        }
        catch (err) {
            console.error(err);
        }
    });

    $('body').on('click', '.sub_module_1000043', function () {
        try {
            $('.content-body').load('partials/module_' + Sec.currModule + '.html');


        }
        catch (err) {
            console.error(err);
        }
    });

    $('.content-body').on('click', '#registered-user', function () {
        try {
            $('.content-body #users-table').removeClass('hidden');
            $('.content-body #unregistered-users-table').addClass('hidden');
            Sec.Proxy.loadUsers();
        }
        catch (err) {
            console.error(err);
        }

    });

    $('.content-body').on('click', '#registered-user-a', function () {
        try {
            Sec.operationList = 'register';
            var id = $(this).attr('data-id');
            var fname = $(this).attr('data-fname');
            var lname = $(this).attr('data-lname');
            var mname = $(this).attr('data-mname');
            var pinCode = $(this).attr('data-pin');
            var genderId = $(this).attr('data-gender');
            var org = $(this).attr('data-org-id');
            var birthdate = $(this).attr('data-birthdate');
            var type = $(this).attr('data-type');
            $('.content-body').load('partials/user_modal.html', function () {
                $('#confirm').html(Sec.dictionary[Sec.lang]["users.add"]);
                if (Sec.operationList === 'register') {
                    Sec.Proxy.loadOrgTree(function (tree) {
                        Sec.Service.parseOrgTree(tree);
                        var orgId = $('#orgId');
                        $('#confirm').attr('data-type', 'register');
                        $('#confirm').attr('data-user-type', type);
                        $('#confirm').attr('data-id', id);
                        $('#firstname').val(fname).attr('disabled', 'disabled');
                        $('#lastname').val(lname).attr('disabled', 'disabled');
                        $('#middlename').val(mname).attr('disabled', 'disabled');
                        $('#pin').val(pinCode).attr('disabled', 'disabled');
                        $('#confirm').removeAttr('disabled');

                        $('#genderId').find('option[value="' + genderId + '"]').attr('selected', 'selected');
                        $('#genderId').attr('disabled', 'disabled');
                        $('#birthdate').val(birthdate).attr('disabled', 'disabled');
                        $('.file-div').addClass('hidden')
                        if (Sec.urls.AdminRest + 'users/' + id + '/type/' + type + '/image?token=' + Sec.token) {

                            $('.content-body #userPhoto').attr('src', Sec.urls.AdminRest + 'users/' + id + '/type/' + type + '/image?token=' + Sec.token + '&' + Math.random());
                            $('.content-body #userPhoto').on('error', function (e) {
                                $('.content-body #userPhoto').attr('src', 'assets/img/guest.png');
                            });

                        }

                        orgId.attr('data-id', org);
                        orgId.attr('disabled', 'disabled');
                        $.each(Sec.array, function (i, v) {
                            if (orgId.attr('data-id') == v.id) {
                                orgId.text(v.text).attr('disabled', 'disabled');
                            }
                        });
                    });

                }
            });
        }
        catch (err) {
            console.error(err);
        }
    });

    $('#main-div').on('click', '.settings-button', function () {
        $('#main-div .last-password').val('');
        $('#main-div .new-password').val('');
        $('#main-div .confirmed-password').val('');
        $('#main-div .last-password').removeClass('error-border');
        $('#main-div .settings-password-modal').modal({
            backdrop: false
        });

    });

    $('#main-div').on('click', '.change-password-submit', function () {
        var isValid = true;

        $(this).parents('.modal-content').find('input.required').each(function () {
            if (!$(this).val()) {
                $(this).addClass('error-border');
                isValid = false;
            }
            else {
                $(this).removeClass('error-border');
            }
        });


        if (!isValid)
            return false;

        var lpass = $('#main-div .last-password').val();
        var npass = $('#main-div .new-password').val();
        var cpass = $('#main-div .confirmed-password').val();
        if (npass !== cpass) {


            $.notify(Sec.dictionary[Sec.lang]['wrong_repeated_password'], {
                type: 'danger'
            });

            return false;

        }

        var password = {};
        password.lastPassword = lpass;
        password.password = npass;
        password.passwordConfirmation = cpass;

        Sec.Proxy.changePassword(password, function (data) {
            if (data) {
                if (data.code == Sec.statusCodes.OK) {
                    $('#main-div .last-password').removeClass('error-border');
                    $('#main-div .settings-password-modal').modal("hide");
                    $.notify(Sec.dictionary[Sec.lang]['success'], {
                        type: 'success'
                    });
                    $('#main-div #logoutForm').find('button[type="submit"]').click()
                }
                else if (data.code == Sec.statusCodes.INVALID_PARAMS) {
                    $.notify(Sec.dictionary[Sec.lang]['wrong_password'], {
                        type: 'danger'
                    });
                    $('#main-div .last-password').addClass('error-border');
                }

            }
        });

    });


    $('#main-div').on('click', 'a.button-icon', function (e) {
        try {
            var id = $(this).attr('data-id');
            if (id == Sec.appId) {
                e.preventDefault();
            }
        }
        catch (err) {
            console.error(err);
        }
    });



});
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var cropForm = new FormData();
var Sec = {
     // token: '0',
    // token: '97660b9379144e3b8553d7fb748fed45b7e87af2cf2548d6be635b6e5d44a1f4',
    lang: '',
    appId: 1000000,
    currModule: '',
    moduleList: [],
    operationList: [],
    tempDataId: '',
    node: [],
    array: [],
    dicTypeId: '',
    chosenText: '',
    dateFilterLog: '',
    structureId: '',
    role:'',
//    testData: {
//        translation: {
//            modules: [{'name': 'Dictionaries', 'type': 'dictionary'},
//                {'name': 'Org tree', 'type': 'org'},
//                {'name': 'Address tree', 'type': 'address'},
//                {'name': 'Org tree short name', 'type': 'org_short_name'}]
//        }
//    },
    urls: {
        //AdminRest: 'http://localhost:8080/AdministrationRest/',
        AdminRest: 'http://192.168.1.78:8082/AdministrationRest/',
        HSIS: 'http://192.168.1.78:8082/UnibookHsisRest/',
        //HSIS: 'http://localhost:8080/UnibookHsisRest/',
        ROS: 'http://192.168.1.78:8082/ROS/',
//        REPORT: 'http://localhost:8080/ReportingRest/',
        REPORT: 'http://192.168.1.78:8082/ReportingRest/',
        //REPORT: 'http://localhost:8080/ReportingRest/',
        //ROS: 'http://localhost:8080/ROS/'
    },
    statusCodes: {
        OK: 'OK',
        ERROR: 'ERROR',
        UNAUTHORIZED: 'UNAUTHORIZED',
        DUPLICATE_DATA: 'DUPLICATE_DATA',
        INVALID_PARAMS: 'INVALID_PARAMS'
    },
    initToken: function (cname) {
        var name = cname + "=";
        if (document.cookie == name + null || document.cookie == "") {
            window.location.href = '/SafeSecurityApp/greeting.html'
        }

        else {
            var ca = document.cookie.split(';');

            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];

                while (c.charAt(0) === ' ') {
                    c = c.substring(1);

                }

                if (c.indexOf(name) === 0) {
                    Sec.token = c.substring(name.length, c.length);
                }
            }
        }


    },
    initLanguageCookie: function (name) {
        var ca = document.cookie.split(';');

        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];

            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }

            if (c.indexOf(name) === 0) {
                Sec.lang = c.substring(name.length, c.length).split('=')[1];
            }
        }

        if (Sec.lang.trim().length === 0) {
            Sec.lang = 'az';
        }
    },
    initCurrentModule: function (name) {
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                var currModule = c.substring(name.length, c.length).split('=')[1];
                return currModule;
            }
        }
        return "";
    },
    Service: {
        parseApplications: function (data) {
            var html = '';
            if (data) {
                $.each(data, function (i, v) {

                    html += '<div class="col-md-4 p-l-0" title = "' + v.name[Sec.lang] + '">' +
                            '<li class="button-item">' +
                            '<a data-id="' + v.id + '" target="_blank" class="button-icon" href="' + v.url + '?token=' + Sec.token + '">' +
                            '<div class="flex-center">' +
                            '<div class="' + v.iconPath + '"></div>' +
                            '<span class="button-name">' + v.shortName[Sec.lang] + '</span>' +
                            '</div>' +
                            '</a>' +
                            '</li>' +
                            '</div>';
                });
                $('#application-list .div-application').html(html);
            }

        },
//        parseApplicationsList: function (data) {
//            var html = '';
//            if (data) {
//                $.each(data, function (i, v) {
//                    html += '<li data-toggle="tooltip" data-placement="bottom" title = "' + v.name[Sec.lang] + '">' + '<a data-id="' + v.id + '"  href="' + v.url + '?token=' + Sec.token + '">' + v.shortName[Sec.lang] +'</a>' +'</li>';
//                });
//                $('.app-con').html(html);
//                $('.app-con a[data-id="'+Sec.appId+'"]').parent('li').remove();
//            }
//
//        },
        parseApplicationsList: function (data) {
            var html = '';
            if (data) {
                $.each(data, function (i, v) {
                    if(v.id == 1000001)
                        html += '<li data-toggle="tooltip" data-placement="bottom" title = "' + v.name[Sec.lang] + '">' + 
                                    '<a data-id="' + v.id + '"  href="' + v.url + '?token=' + Sec.token + '">' + v.shortName[Sec.lang] + '</a>' + 
                                '</li>';
                });
                Sec.Proxy.loadSubApplications(function(data) {
                    if(data && data.data) {
                        $.each(data.data, function (i, v) {
                            html += '<li data-toggle="tooltip" data-placement="bottom" title = "' + v.name[Sec.lang] + '">' + 
                                        '<a data-id="' + v.id + '"  href="' + v.url + '?token=' + Sec.token + '">' + v.shortName[Sec.lang] + '</a>' + 
                                    '</li>';
                        })
                    }
                    
                    $('.app-con').html(html);
                    $('.app-con a[data-id="' + Sec.appId + '"]').parent('li').addClass('active');
                    $('[data-toggle="tooltip"]').tooltip();

                    var moduleListItems = $('body').find('.app-con li');
                    console.log(moduleListItems);
                    if (moduleListItems.length > 5) {
                        $('body').find('div.app-list, .hide-menu').addClass('less-menu')
                    } else {
                        $('body').find('div.app-list, .hide-menu').removeClass('less-menu')
                    }
                })
                
            }

        },
        parseModules: function (modules) {
            var html = '';
            if (modules.data) {
                $.each(modules.data, function (i, v) {
                    if (v.parentId == 0) {
                        html += '<li data-id="' + v.id + '" class="module-item">' +
                                '<a href="#">' +
                                '<span class="' + v.iconPath + '"></span>' +
                                '<span>' + v.name[Sec.lang] + '</span>' +
                                '</a></li>';
                    }

                });
            }

            return html;
        },
        parseOperations: function (operations, type,$obj) {
            var html = '';
            if (operations) {
                var innerButton = $('<div class="dropdown-func op-cont" >' +
                        '<div title = "Əməliyyatlar" class="operations dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                        '<span class="glyphicon glyphicon-list"></span>' +
                        '</div>' +
                        '<ul class="dropdown-menu">' +
                        '</ul>' +
                        '</div>' +
                        '</div>');


                $.each(operations, function (i, v) {
                    if (v.typeId == type) {
                        if (type == '1') {
                            html += '<li><a id="operation_' + v.id + '" href="#" >' + v.name[Sec.lang] + '</a></li>';
                        }
                        else if (type == '2') {
                            if($obj){
                               if($obj.id === Sec.role && (v.id == 1000013 || v.id == 1000014)){
                                   html += '';
                               }
                               else {
                                   html += '<li><a id="operation_' + v.id + '" href="#">' + v.name[Sec.lang] + '</a></li>';
                               }
                            }
                            else {
                                html += '<li><a id="operation_' + v.id + '" href="#">' + v.name[Sec.lang] + '</a></li>';
                            }
                            
                        }
                    }
                });

                if (type == '2') {
                    if (!html) {
                        return '';
                    }

                    innerButton.find('ul').html(html);
                    return innerButton.html();
                }
            }


            return html;
        },
        parseUsers: function (data, append) {
            var html = '';


            if (data.data && data.data.userList) {
                var count;

                if (append) {
                    count = $('.content-body #users-table tbody tr').length;
                }
                else {
                    count = 0;
                }

                $.each(data.data.userList, function (i, v) {
                    html += '<tr data-image-id="' + v.image.id + '" data-is-blocked="' + v.account.blocked + '" data-id="' + v.account.id + '">' +
                            '<td>' + (++count) + '</td>' +
                            '<td style="white-space:pre-line;">' + v.orgName.value[Sec.lang] + '</td>' +
                            '<td>' + v.account.username + '</td>' +
                            '<td>' + v.name + ' ' + v.surname + ' ' + v.patronymic + '</td>' +
                            '<td>' + v.account.role.value[Sec.lang] + '</td>' +
                            '<td style="white-space:pre-line;">' + v.account.lastAction.updateDate + '</td>' +
                            '<td><div class="' + (v.sessionActive ? "online" : "offline") + ' status"></div><span>' + (v.sessionActive ? Sec.dictionary[Sec.lang]['online'] : Sec.dictionary[Sec.lang]['offline']) + '</span></td>' +
                            '<td><div class="' + (v.account.blocked ? "offline" : "online") + ' status"></div><span>' + (v.account.blocked ? Sec.dictionary[Sec.lang]['blocked'] : Sec.dictionary[Sec.lang]['unblocked']) + '</span></td>' +
                            '<td>' + Sec.Service.parseOperations(Sec.operationList, '2') + '</td>' +
                            '</tr>';
                });

                $('#main-div #user_count').text(data.data.count)
            }

            if ($('#main-div #load_more_div').children().length == 0) {
                $('#main-div #load_more_div').html('<button  data-table="users" class="btn loading-margins btn-load-more">' + Sec.dictionary[Sec.lang]["load.more"] + '</button>');
            }

            if (append) {
                $('.content-body #users-table tbody').append(html);
            }
            else {
                $('.content-body #users-table tbody').html(html);
            }


        },
        parseUnregisteredUsers: function (data, type, page) {
            var html = '';
            var count;

            if (page) {
                count = $('.content-body #unregistered-users-table tbody tr').length;
            }
            else {
                count = 0;
            }
            $.each(data, function (i, v) {
                html += '<tr>' +
                        '<td>' + (++count) + '</td>' +
                        '<td>' + v.name + ' ' + v.surname + ' ' + v.patronymic + '</td>' +
                        '<td>' + v.gender.value[Sec.lang] + '</td>' +
                        '<td>' + v.birthdate + '</td>' +
                        '<td>' +
                        '<div class="operations dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                        '<span class="glyphicon glyphicon-list"></span>' +
                        '</div>' +
                        '<ul class="dropdown-menu ">' +
                        '<li><a id="registered-user-a" data-type = "' + type + '"data-org-id = "' + v.orgId + '" data-pin = "' + v.pin + '" data-id = "' + v.id + '" data-fname="' + v.name + '" data-lname="' + v.surname + '" data-mname="' + v.patronymic + '" data-birthdate = "' + v.birthdate + '" data-gender = "' + v.gender.id + '" href="#" >' + Sec.dictionary[Sec.lang]["sign_up"] + '</a></li>' +
                        '</ul>' +
                        '</td>' +
                        '</tr>';
            });

            if (page) {
                $('.content-body').find('#unregistered-users-table tbody').append(html);
            }
            else {
                $('.content-body').find('#unregistered-users-table tbody').html(html);
            }

        },
        parseDictype: function (data) {
            var html = '';
            if (data.data) {
                $.each(data.data, function (i, v) {
                    html += '<tr data-id="' + v.id + '">' +
                            '<td>' + (i + 1) + '</td>' +
                            '<td class="hidden">' + (v.parentId != 0 ? v.parentId : 'No parent') + '</td>' +
                            '<td>' + v.value[Sec.lang] + '</td>' +
                            '<td>' + v.updateDate + '</td>' +
                            '<td>' + Sec.Service.parseOperations(Sec.operationList, '2') + '</td>' +
                            '</tr>';
                });
            }

            $('#users-table tbody').html(html);
        },
        parseRolesToTable: function (data) {
            var html = '';
            if (data) {
                $.each(data, function (i, v) {
                    html += '<tr data-id="' + v.id + '">' +
                            '<td>' + v.value[Sec.lang] + '</td>' +
                            '<td>' + Sec.Service.parseOperations(Sec.operationList, '2',v) + '</td>' +
                            '</tr>';
                });
            }


            $('#user-group-table tbody').html(html);
        },
        parseOperationToTable: function (data) {
            var html = '';
            if (data) {
                $.each(data, function (i, v) {
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
                });
            }


            $('#operation-table tbody').html(html);

        },
        parseOrgTree: function (tree) {
            try {
                var array = [];
                if (tree.length > 0) {
                    $.each(tree, function (i, v) {
                        var obj = {
                            id: v.id.toString(),
                            parent: v.parent.id == 0 ? "#" : v.parent.id.toString(),
                            text: v.name[Sec.lang],
                            about: v.about[Sec.lang],
                        };
                        array.push(obj);
                        Sec.array.push(obj);
                    });

                    $('.content-body').find('#tree').jstree({
                        "core": {
                            "data": array,
                            "check_callback": true,
                            "themes": {
                                "variant": "large",
                                "dots": false,
                                "icons": true
                            },
                        },
                        "plugins": ["wholerow", "search"],
                        "themes": {"stripes": true}
                    });
                }
                else {
                    $('.content-body').find('#tree').jstree("destroy");
                }
            }
            catch (err) {
                console.error(err);
            }
        },
        commonParseTree: function (data, objectId) {
            try {
                var array = [];
                if (data.length > 0) {
                    $.each(data, function (i, v) {
                        var obj = {
                            id: v.id.toString(),
                            parent: v.parent.id == 0 ? "#" : v.parent.id.toString(),
                            text: v.name[Sec.lang],
                        };
                        array.push(obj);
                        Sec.array.push(obj);
                    });

                    $('#main-div').find('#' + objectId).jstree({
                        "core": {
                            "data": array,
                            "check_callback": true,
                            "themes": {
                                "variant": "large",
                                "dots": false,
                                "icons": true
                            },
                        },
                        "plugins": ["wholerow", "search"],
                        "themes": {"stripes": true}
                    });
                }
                else {
                    $('#main-div').find('#' + objectId).jstree("destroy");
                }
            }
            catch (err) {
                console.error(err);
            }
        },
    },
    Proxy: {
        loadApplications: function () {
            $.ajax({
                url: Sec.urls.ROS + 'applications?token=' + Sec.token,
                type: 'GET',
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Sec.statusCodes.OK:
                                    Sec.Service.parseApplications(data.data);
                                    Sec.Service.parseApplicationsList(data.data);
                                    $('[data-toggle="tooltip"]').tooltip()
                                    break;

                                case Sec.statusCodes.ERROR:
                                    $.notify(Sec.dictionary[Sec.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Sec.statusCodes.UNAUTHORIZED:

                                    window.location = Sec.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                }
            });
        },
        
        
        loadSubApplications: function (callback) {
            $.ajax({
                url: Sec.urls.ROS + 'applications/1000014/subApplications?token=' + Sec.token,
                type: 'GET',
//                headers: {
//                    'Token': Hsis.token
//                },
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Sec.statusCodes.OK:
                                    if(callback)
                                        callback(data);
                                    break;

                                case Sec.statusCodes.ERROR:
                                    break;

                                case Sec.statusCodes.UNAUTHORIZED:
                                    window.location = Sec.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                }
            });
        },
        
        loadModules: function (appId, callback) {
            var modules = {};
            $.ajax({
                url: Sec.urls.ROS + 'applications/' + appId + '/modules?token=' + Sec.token,
                type: 'GET',
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Sec.statusCodes.OK:
                                    modules = data;
                                    break;

                                case Sec.statusCodes.ERROR:
                                    $.notify(Sec.dictionary[Sec.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Sec.statusCodes.UNAUTHORIZED:
                                    window.location = Sec.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                },
                complete: function () {
                    callback(modules);
                }
            });
        },
        loadSubModules: function (moduleId, callback) {

            $.ajax({
                url: Sec.urls.ROS + 'applications/modules/' + moduleId + '/subModules?token=' + Sec.token,
                type: 'GET',
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Sec.statusCodes.OK:
                                    callback(data);
                                    break;

                                case Sec.statusCodes.ERROR:
                                    $.notify(Sec.dictionary[Sec.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Sec.statusCodes.UNAUTHORIZED:
                                    window.location = Sec.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                }
            });
        },
        loadOperations: function (moduleId, callback) {
            var operations = {};
            $.ajax({
                url: Sec.urls.ROS + 'applications/modules/' + moduleId + '/operations?token=' + Sec.token,
                type: 'GET',
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Sec.statusCodes.OK:
                                    operations = data.data;
                                    Sec.operationList = operations;
                                    break;

                                case Sec.statusCodes.ERROR:
                                    $.notify(Sec.dictionary[Sec.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Sec.statusCodes.UNAUTHORIZED:

                                    window.location = Sec.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                },
                complete: function () {
                    callback(operations);
                }
            });
        },
        loadUsers: function (page, params, callback) {
            $.ajax({
                url: Sec.urls.AdminRest + 'users?token=' + Sec.token + (page ? '&page=' + page : ''),
                type: 'GET',
                data: params,
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Sec.statusCodes.OK:
                                    Sec.Service.parseUsers(data, page);
                                    if (callback)
                                        callback(data.data);
                                    break;

                                case Sec.statusCodes.ERROR:
                                    $.notify(Sec.dictionary[Sec.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Sec.statusCodes.UNAUTHORIZED:

                                    window.location = Sec.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                }

            });
        },
        blockUser: function (userId, block, callback) {
            var code = {};

            $.ajax({
                url: Sec.urls.AdminRest + 'users/' + userId + (block == 'false' ? '/block' : '/unblock') + '?token=' + Sec.token,
                type: 'POST',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Sec.statusCodes.ERROR:
                                if (data.message) {
                                    $.notify(data.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                }
                                else {
                                    $.notify(Sec.dictionary[Sec.lang]['error'], {
                                        type: 'danger'
                                    });
                                }

                                break;
                            case Sec.statusCodes.OK:
                                code = data;
                                break;

                            case Sec.statusCodes.UNAUTHORIZED:

                                window.location = Sec.urls.ROS + 'unauthorized';
                                break;
                        }
                    }

                },
                complete: function () {
                    callback(code);
                }
            });
            return code;
        },
        removeUser: function (userId, callback) {
            var code = {};
            $.ajax({
                url: Sec.urls.AdminRest + 'users/' + userId + '/remove?token=' + Sec.token,
                type: 'POST',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Sec.statusCodes.ERROR:
                                if (data.message) {
                                    $.notify(data.message[Sec.lang], {
                                        type: 'danger'
                                    });
                                }
                                else {
                                    $.notify(Sec.dictionary[Sec.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;
                            case Sec.statusCodes.OK:
                                code = data;
                                break;

                            case Sec.statusCodes.UNAUTHORIZED:

                                window.location = Sec.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                    ;
                },
                complete: function () {
                    callback(code);
                }
            });
            return code;
        },
        addUser: function (formData, callback) {
            var code = {};
            $.ajax({
                url: Sec.urls.AdminRest + 'users/add',
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data) {

                        switch (data.code) {
                            case Sec.statusCodes.ERROR:
                                if (data.message) {
                                    $.notify(data.message[Sec.lang], {
                                        type: 'danger'
                                    });
                                }
                                else {
                                    $.notify(Sec.dictionary[Sec.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;
                            case Sec.statusCodes.DUPLICATE_DATA:
                                $.notify("İstifadəçi adı artıq mövcuddur!", {
                                    type: 'danger'
                                });
                                break;
                            case Sec.statusCodes.OK:
                                code = data;
                                break;

                            case Sec.statusCodes.UNAUTHORIZED:
                                window.location = Sec.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                },
                complete: function () {
                    cropForm = new FormData();
                    callback(code);
                }
            });
        },
        getUserById: function (id, callback) {
            var user = {};
            $.ajax({
                url: Sec.urls.AdminRest + '/users/' + id + '?token=' + Sec.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Sec.statusCodes.ERROR:
                                $.notify(Sec.dictionary[Sec.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Sec.statusCodes.OK:
                                user = data;
                                break;

                            case Sec.statusCodes.UNAUTHORIZED:

                                window.location = Sec.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                },
                complete: function () {
                    callback(user);
                    $('#confirm').removeAttr('disabled');
                }
            })
        },
        editUser: function (formData, callback) {
            var code = {};
            $.ajax({
                url: Sec.urls.AdminRest + "users/" + Sec.tempDataId + "/edit",
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data) {

                        switch (data.code) {
                            case Sec.statusCodes.ERROR:
                                if (data.message) {
                                    $.notify(data.message[Sec.lang], {
                                        type: 'danger'
                                    });
                                }
                                else {
                                    $.notify(Sec.dictionary[Sec.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;
                            case Sec.statusCodes.DUPLICATE_DATA:
                                $.notify("İstifadəçi adı artıq mövcuddur!", {
                                    type: 'danger'
                                });

                                break;
                            case Sec.statusCodes.OK:
                                code = data;
                                break;

                            case Sec.statusCodes.UNAUTHORIZED:
                                window.location = Sec.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                },
                complete: function () {
                    callback(code);
                }
            })

        },
        removeRoles: function (roleId, callback) {
            var roles = {};

            $.ajax({
                url: Sec.urls.AdminRest + 'users/roles/' + roleId + '/remove?token=' + Sec.token,
                type: 'POST',
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Sec.statusCodes.OK:
                                    roles = data;
                                    break;

                                case Sec.statusCodes.ERROR:
                                    if (data.message) {
                                        $.notify(data.message[Sec.lang], {
                                            type: 'danger'
                                        });
                                    }
                                    else {
                                        $.notify(Sec.dictionary[Sec.lang]['error'], {
                                            type: 'danger'
                                        });
                                    }
                                    break;

                                case Sec.statusCodes.UNAUTHORIZED:

                                    window.location = Sec.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                },
                complete: function () {
                    callback(roles);
                    $('.content-body').load('partials/module_' + Sec.currModule + '.html');
                }
            });
        },
        loadRoles: function (callback) {
            var roles = {};

            $.ajax({
                url: Sec.urls.AdminRest + 'users/roles?token=' + Sec.token,
                type: 'GET',
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Sec.statusCodes.OK:
                                    roles = data;
                                    break;

                                case Sec.statusCodes.ERROR:
                                    $.notify(Sec.dictionary[Sec.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Sec.statusCodes.UNAUTHORIZED:

                                    window.location = Sec.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                },
                complete: function () {
                    callback(roles);
                }
            });
        },
        loadRolesById: function (roleId, callback) {
            var result = {};
            $.ajax({
                url: Sec.urls.AdminRest + 'users/roles/' + roleId + '?token=' + Sec.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Sec.statusCodes.ERROR:
                                $.notify(Sec.dictionary[Sec.lang]['error'], {
                                    type: 'danger'
                                });
                                break;
                            case Sec.statusCodes.OK:
                                result = data;
                                break;

                            case Sec.statusCodes.UNAUTHORIZED:

                                window.location = Sec.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                },
                complete: function () {
                    callback(result);
                }
            });
        },
        deactivateSession: function (userId, callback) {
            var code = {};
            $.ajax({
                url: Sec.urls.AdminRest + 'users/' + userId + '/invalidatesession?token=' + Sec.token,
                type: 'POST',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Sec.statusCodes.OK:
                                code = data;
                                break;

                            case Sec.statusCodes.ERROR:
                                $.notify(Sec.dictionary[Sec.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Sec.statusCodes.UNAUTHORIZED:

                                window.location = Sec.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                },
                complete: function () {
                    callback(code);
                }
            })
        },
        loadLogs: function (page, params, callback) {
            var date = Sec.dateFilterLog.trim().length > 0 ? Sec.dateFilterLog : '';
            $.ajax({
                url: Sec.urls.AdminRest + 'logs?pageSize=20&token=' + Sec.token + (page ? '&page=' + page : ''),
                type: 'GET',
                data: params,
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Sec.statusCodes.OK:
                                    var html = '';

                                    $.each(data.data, function (i, v) {
                                        html += '<tr data-id="' + v.id + '">' +
                                                '<td class="hidden">' + v.session.user.account.id + '</td>' +
                                                '<td>' + v.session.user.account.role.value[Sec.lang] + '</td>' +
                                                '<td>' + v.session.user.account.username + '</td>' +
                                                '<td>' + v.session.user.surname + ' ' + v.session.user.name + ' ' + v.session.user.patronymic + '</td>' +
                                                '<td>' + v.application.value[Sec.lang] + '</td>' +
                                                '<td>' + v.operation.value[Sec.lang] + '</td>' +
                                                '<td>' + v.ipAddress + '</td>' +
                                                '<td>' + v.createDate + '</td>' +
                                                '<td>' +
                                                '<div class="log operations dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                                                '<span class="fa fa-info"></span>' +
                                                '</div>' +
                                                '</div>' +
                                                '<div class="popover left">' +
                                                '<div class="arrow"></div>' +
                                                '<h3 class="popover-title bg-primary">' + Sec.dictionary[Sec.lang]['details'] + '<a class="anchorjs-link" href="#popover-left"><span class="anchorjs-icon"></span></a></h3>' +
                                                '<div class="popover-content">' +
                                                '<p>' + v.name.value[Sec.lang] + '</p>' +
                                                '</div>' +
                                                '</td>' +
                                                '</tr>';
                                    });
                                    if ($('#main-div #load_more_div').children().length == 0) {
                                        $('#main-div #load_more_div').html('<button  data-table="logs" class="btn loading-margins btn-load-more">' + Sec.dictionary[Sec.lang]["load.more"] + '</button>');
                                    }
                                    if (page) {
                                        $('.content-body #logs-table tbody').append(html);
                                    }
                                    else {
                                        $('.content-body #logs-table tbody').html(html);
                                    }
                                    if (callback)
                                        callback(data.data);
                                    break;

                                case Sec.statusCodes.ERROR:
                                    $.notify(Sec.dictionary[Sec.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Sec.statusCodes.UNAUTHORIZED:

                                    window.location = Sec.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                }

            });
        },
        loadDictionaries: function () {
            $.ajax({
                url: Sec.urls.AdminRest + 'settings/dictionaries?token=' + Sec.token,
                type: 'GET',
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Sec.statusCodes.OK:
                                    break;

                                case Sec.statusCodes.ERROR:
                                    $.notify(Sec.dictionary[Sec.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Sec.statusCodes.UNAUTHORIZED:

                                    window.location = Sec.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                }

            });
        },
        loadDictionariesByTypeId: function (typeId, parentId, callback) {
            var result = {};
            $.ajax({
                url: Sec.urls.AdminRest + 'settings/dictionaries?typeId=' + typeId + '&parentId=' + parentId + '&token=' + Sec.token,
                type: 'GET',
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Sec.statusCodes.OK:
                                    result = data;
                                    break;

                                case Sec.statusCodes.ERROR:
                                    $.notify(Sec.dictionary[Sec.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Sec.statusCodes.UNAUTHORIZED:

                                    window.location = Sec.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                },
                complete: function () {

                    callback(result);
                }

            });
        },
        loadDictionariTypes: function (callback) {
            var result = {};
            $.ajax({
                url: Sec.urls.AdminRest + 'settings/dictionaries/types?token=' + Sec.token,
                type: 'GET',
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Sec.statusCodes.OK:
                                    var html = '';
                                    $.each(data.data, function (i, v) {
                                        html += '<tr data-id="' + v.id + '">' +
                                                '<td>' + v.code + '</td>' +
                                                '<td>' + v.value[Sec.lang] + '</td>' +
                                                '</tr>';
                                    });
                                    result = data;
                                    $('#dic-type-table tbody').html(html);
                                    break;

                                case Sec.statusCodes.ERROR:
                                    $.notify(Sec.dictionary[Sec.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Sec.statusCodes.UNAUTHORIZED:

                                    window.location = Sec.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                },
                complete: function () {
                    callback(result);
                }

            });
        },
        getDictionaryDetails: function (dicId, callback) {
            var code = {};
            $.ajax({
                url: Sec.urls.AdminRest + 'settings/dictionaries/' + dicId + '?token=' + Sec.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Sec.statusCodes.ERROR:
                                $.notify(Sec.dictionary[Sec.lang]['error'], {
                                    type: 'danger'
                                });
                                break;
                            case Sec.statusCodes.OK:
                                code = data;
                                break;

                            case Sec.statusCodes.UNAUTHORIZED:

                                window.location = Sec.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                    ;
                },
                complete: function () {
                    callback(code);
                }
            });
        },
        addDictionary: function (dic, callback) {
            var code = {};
            $.ajax({
                url: Sec.urls.AdminRest + 'settings/dictionaries/add?token=' + Sec.token,
                type: 'POST',
                data: dic,
                beforeSend: function () {
                    $('.btn-dictionary').attr('disabled', 'disabled');
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Sec.statusCodes.ERROR:
                                if (data.message) {
                                    $.notify(data.message[Sec.lang], {
                                        type: 'danger'
                                    });
                                }
                                else {
                                    $.notify(Sec.dictionary[Sec.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;
                            case Sec.statusCodes.DUPLICATE_DATA:
                                $.notify("Daxil etdiyiniz kod artıq mövcuddur!", {
                                    type: 'danger'
                                });
                                break;
                            case Sec.statusCodes.OK:
                                code = data;
                                break;

                            case Sec.statusCodes.UNAUTHORIZED:

                                window.location = Sec.urls.ROS + 'unauthorized';
                                break;

                            case Sec.statusCodes.INVALID_PARAMS:
                                $.notify("Daxil etdiyiniz parametrlər yanlışdır!", {
                                    type: 'danger'
                                });
                                break;
                        }
                    }
                    ;
                },
                complete: function () {
                    $('.btn-dictionary').removeAttr('disabled');
                    $('.span-code').removeClass('fa fa-close span-code-warning fa-check span-code-success');
                    $('#code').val('');
                    $('#az').val('');
                    $('#en').val('');
                    $('#ru').val('');
                    $('#code').removeClass('error-border success-border');
                    callback(code);
//                    $('.content-body').load('partials/module_' + Sec.currModule + '.html');
                    Sec.Proxy.loadDictionariTypes(function () {

//                        var typeId = $('#dic-type-table').find('tr').eq(1).attr('data-id');
                        Sec.Proxy.loadOperations(Sec.currModule, function (operations) {
                            $('#buttons_div').find('ul').html(Sec.Service.parseOperations(operations, 1));

                            Sec.Proxy.loadDictionariesByTypeId(Sec.dicTypeId, 0, function (result) {
                                Sec.Service.parseDictype(result);
                            });

                        });
                    });
                }
            });
            return code;
        },
        editDictionary: function (dic, callback) {
            var code = {};
            $.ajax({
                url: Sec.urls.AdminRest + 'settings/dictionaries/' + dic.id + '/edit?token=' + Sec.token,
                type: 'POST',
                data: dic,
                beforeSend: function () {
                    $('.btn-dictionary').attr('disabled', 'disabled');
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Sec.statusCodes.ERROR:
                                if (data.message) {
                                    $.notify(data.message[Sec.lang], {
                                        type: 'danger'
                                    });
                                }
                                else {
                                    $.notify(Sec.dictionary[Sec.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;
                            case Sec.statusCodes.OK:
                                code = data;
                                Sec.Proxy.loadOperations(Sec.currModule, function (operations) {
                                    $('#buttons_div').find('ul').html(Sec.Service.parseOperations(operations, 1));

                                    Sec.Proxy.loadDictionariesByTypeId(Sec.dicTypeId, 0, function (result) {
                                        Sec.Service.parseDictype(result);
                                    });

                                });
                                break;

                            case Sec.statusCodes.UNAUTHORIZED:

                                window.location = Sec.urls.ROS + 'unauthorized';
                                break;

                            case Sec.statusCodes.INVALID_PARAMS:
                                $.notify("Daxil etdiyiniz parametrlər yanlışdır!", {
                                    type: 'danger'
                                });
                        }
                    }
                    ;
                },
                complete: function () {
                    $('.btn-dictionary').removeAttr('disabled');
                    callback(code);


                }
            });
            return code;
        },
        removeDictionary: function (dicId, callback) {
            var code = {};
            $.ajax({
                url: Sec.urls.AdminRest + 'settings/dictionaries/' + dicId + '/remove?token=' + Sec.token,
                type: 'POST',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Sec.statusCodes.ERROR:
                                if (data.message) {
                                    $.notify(data.message[Sec.lang], {
                                        type: 'danger'
                                    });
                                }
                                else {
                                    $.notify(Sec.dictionary[Sec.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Sec.statusCodes.OK:
                                code = data;
                                break;

                            case Sec.statusCodes.UNAUTHORIZED:

                                window.location = Sec.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                },
                complete: function () {
                    callback(code);

                    Sec.Proxy.loadOperations(Sec.currModule, function (operations) {
                        $('#buttons_div').find('ul').html(Sec.Service.parseOperations(operations, 1));

                        Sec.Proxy.loadDictionariesByTypeId(Sec.dicTypeId, 0, function (result) {
                            Sec.Service.parseDictype(result);
                        });

                    });
                }
            });
            return code;
        },
        getOperations: function (callback) {
            var code = {};
            $.ajax({
                url: Sec.urls.ROS + 'operations?token=' + Sec.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Sec.statusCodes.ERROR:
                                $.notify(Sec.dictionary[Sec.lang]['error'], {
                                    type: 'danger'
                                });
                                break;
                            case Sec.statusCodes.OK:
                                code = data;
                                break;

                            case Sec.statusCodes.UNAUTHORIZED:

                                window.location = Sec.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                    ;
                },
                complete: function () {
                    callback(code);
                }
            });
            return code;
        },
        getOperationsByRoleId: function (roleId, callback) {
            var code = {};
            $.ajax({
                url: Sec.urls.ROS + 'operations?roleId=' + roleId + '&token=' + Sec.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Sec.statusCodes.ERROR:
                                $.notify(Sec.dictionary[Sec.lang]['error'], {
                                    type: 'danger'
                                });
                                break;
                            case Sec.statusCodes.OK:
                                code = data;
                                break;

                            case Sec.statusCodes.UNAUTHORIZED:

                                window.location = Sec.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                },
                complete: function () {
                    callback(code);
                }
            });
            return code;
        },
        search: function (url, callback) {
            var result = {};
            $.ajax({
                url: url,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Sec.statusCodes.ERROR:
                                $.notify(Sec.dictionary[Sec.lang]['error'], {
                                    type: 'danger'
                                });

                                break;

                            case Sec.statusCodes.OK:
                                result = data;
                                break;

                            case Sec.statusCodes.UNAUTHORIZED:
                                window.location = Sec.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                },
                complete: function () {
                    callback(result);
                }
            });
        },
        getUsersByRoleId: function (roleId, callback) {
            var users = {};
            $.ajax({
                url: Sec.urls.AdminRest + 'users/byrole/' + roleId + '?token=' + Sec.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Sec.statusCodes.ERROR:
                                $.notify(Sec.dictionary[Sec.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Sec.statusCodes.OK:
                                users = data;
                                break;

                            case Sec.statusCodes.UNAUTHORIZED:
                                window.location = Sec.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                },
                complete: function () {
                    callback(users);
                }

            });
        },
        getProfile: function () {
            $.ajax({
                url: Sec.urls.ROS + "profile?token=" + Sec.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Sec.statusCodes.ERROR:
                                $.notify(Sec.dictionary[Sec.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Sec.statusCodes.OK:
                                try {
                                    if (data.data) {
                                        var user = data.data;
                                        console.log(user.role.id)
                                        $('.user-notify-content h6[data-type="name"]').text(user.person.name + ' ' + user.person.surname + ' ' + user.person.patronymic);
                                        $('.user-notify-content p[data-type="role"]').text(user.role.value[Sec.lang]);
                                        $('.user-notify-content p[data-type="org"]').text(user.structure.name[Sec.lang]);
                                        $('.profile-data').attr('data-role',user.role.id);
                                        $('.logo-name').text(user.orgName.value[Sec.lang]);
                                        Sec.structureId = user.structure.id;
                                        Sec.role = user.role.id;
                                        $('.main-img').attr('src', Sec.urls.AdminRest + 'users/' + user.id + '/image?token=' + Sec.token);
                                        $('.org-logo').attr('src', Sec.urls.HSIS + 'structures/' + user.structure.id + '/logo?token=' + Sec.token);
                                        $('div.big-img img').attr('src', Sec.urls.AdminRest + 'users/' + user.id + '/image?token=' + Sec.token);
                                        var img = $('.main-img');
                                        img.on('error', function (e) {
                                            $('.main-img').attr('src', 'assets/img/guest.png');
                                        })
                                        $('div.big-img img').on('error', function (e) {
                                            $('div.big-img img').attr('src', 'assets/img/guest.png');
                                        });
                                        //$('.logo-picture').attr('src',url);
                                    }
                                }
                                catch (err) {
                                    console.error(err);
                                }
                                break;

                            case Sec.statusCodes.UNAUTHORIZED:
                                window.location = Sec.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                }
            })
        },
        checkDictionaryCode: function (code, callback) {
            var result = {};
            $.ajax({
                url: Sec.urls.AdminRest + 'settings/dictionaries?code=' + code + '&token=' + Sec.token,
                type: 'GET',
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Sec.statusCodes.OK:
                                    result = data;
                                    break;

                                case Sec.statusCodes.ERROR:
                                    $.notify(Sec.dictionary[Sec.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Sec.statusCodes.UNAUTHORIZED:

                                    window.location = Sec.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                },
                complete: function () {

                    callback(result);
                }

            });
        },
        loadOrgTree: function (callback) {
            var tree = {};
            $.ajax({
                url: Sec.urls.HSIS + 'structures?token=' + Sec.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Sec.statusCodes.ERROR:
                                $.notify(Sec.dictionary[Sec.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Sec.statusCodes.OK:
                                tree = data.data;
                                break;

                            case Sec.statusCodes.UNAUTHORIZED:
                                window.location = Sec.urls.ROS + 'unauthorized';
                                break;


                        }
                    }

                },
                complete: function () {
                    callback(tree);
                }
            });
        },
        getTranslationList: function (group, callback) {
            var tree = {};
            $.ajax({
                url: Sec.urls.AdminRest + 'translations?token=' + Sec.token + '&group=' + group,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Sec.statusCodes.ERROR:
                                $.notify(Sec.dictionary[Sec.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Sec.statusCodes.OK:

                                tree = data.data;
                                callback(tree);
                                break;

                            case Sec.statusCodes.UNAUTHORIZED:
                                window.location = Sec.urls.ROS + 'unauthorized';
                                break;


                        }
                    }

                }
            });
        },
        editTranslationName: function (name, callback) {
            $.ajax({
                url: Sec.urls.AdminRest + 'translations?token=' + Sec.token,
                type: 'POST',
                data: name,
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Sec.statusCodes.ERROR:
                                if (data.message) {
                                    $.notify(data.message[Sec.lang], {
                                        type: 'danger'
                                    });
                                }
                                else {
                                    $.notify(Sec.dictionary[Sec.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Sec.statusCodes.OK:
                                callback(data);
                                break;

                            case Sec.statusCodes.UNAUTHORIZED:
                                window.location = Sec.urls.ROS + 'unauthorized';
                                break;


                        }
                    }

                }
            });
        },
        getUnregistretedUsersList: function (page, type, orgId, callback, keyword) {
            $.ajax({
                url: Sec.urls.AdminRest + 'users/unregistreted?token=' + Sec.token + (page ? '&page=' + page : '') + (keyword ? '&keyword=' + keyword : ''),
                type: 'GET',
                data: {
                    type: type,
                    orgId: orgId
                    
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Sec.statusCodes.ERROR:
                                $.notify(Sec.dictionary[Sec.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Sec.statusCodes.OK:
                                callback(data);
                                break;

                            case Sec.statusCodes.UNAUTHORIZED:
                                window.location = Sec.urls.ROS + 'unauthorized';
                                break;

                        }
                    }

                }
            });
        },
        registretedUser: function (data, callback) {
            $.ajax({
                url: Sec.urls.AdminRest + 'users/registreted?token=' + Sec.token,
                type: 'POST',
                data: data,
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Sec.statusCodes.ERROR:
                                $.notify(Sec.dictionary[Sec.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Sec.statusCodes.OK:
                                callback(data);
                                break;

                            case Sec.statusCodes.UNAUTHORIZED:
                                window.location = Sec.urls.ROS + 'unauthorized';
                                break;

                        }
                    }

                }
            });
        },
        getOrgsWithoutSchools: function (callback) {
            var tree = {};
            $.ajax({
                url: Sec.urls.HSIS + 'structures/universities?token=' + Sec.token,
                type: 'GET',
                global: false,
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Sec.statusCodes.ERROR:
                                break;

                            case Sec.statusCodes.OK:
                                tree = data.data;
                                break;

                            case Sec.statusCodes.UNAUTHORIZED:
                                window.location = Sec.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                },
                complete: function () {
                    callback(tree);
                }
            })
        }
    },
    loadLanguagePack: function (lang) {
        $.getJSON('assets/js/i18n/' + lang + '.json', function (data) {
            $.each(data, function (i, v) {
                Sec.dictionary[lang][i] = v;
            });
        });
    },
    i18n: function () {
        Sec.initLanguageCookie('lang');
        var attr = '';

        $('[data-i18n]').each(function () {
            attr = $(this).attr('data-i18n');
            $(this).text(Sec.dictionary[Sec.lang][attr]);
            $(this).attr('placeholder', Sec.dictionary[Sec.lang][attr]);
        });
    },
    getCookie: function (cookie_name) {

        var results = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');
        if (results)
            return (decodeURI(results[2]));
        else
            return null;

    },
    dictionary: {
        az: {},
        en: {},
        ru: {}
    },
    Validation: {
        validateRequiredFields: function (requiredAttr) {
            var required = $('[' + requiredAttr + ']');

            var requiredIsEmpty = false;

            required.each(function (i, v) {
                if (v.value.length == 0 || (v.value == 0 && $(this).is('select'))) {
                    $(v).addClass('blank-required-field');

                    if (!requiredIsEmpty) {

                        $.notify(Sec.dictionary[Sec.lang]['required_fields'], {
                            type: 'warning'
                        });
                        requiredIsEmpty = true;
                    }

                    $(v).on('focusout', function (e) {
                        if (v.value.length && $(v).hasClass('blank-required-field')) {
                            $(v).removeClass('blank-required-field');
                            $(v).off('focusout');
                        }
                    });
                }
            });

            return !requiredIsEmpty;
        },
    }
};


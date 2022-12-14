$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

$(document).ready(function() {
    // Create menu datatable
    createMenuDataTable();
    

    let action = $("#parent-id-block").find("#parent-id").data("action");
    var level = $("#menu-level").val();
    if( level > 1){
        $("#parent-id-block").removeClass("d-none").find("#parent-id").prop( "disabled", false);
    }
    else {
        $("#parent-id-block").addClass("d-none").find("#parent-id").prop( "disabled", true);
        
        if(action === "edit"){
            $("#menu-level").prop("disabled", true);
        }
    }

    // When change level 
    $("#menu-level").change(function (){
        let level = $(this).val();
        if(level > 1)
        {   
            $("#parent-id-block").removeClass("d-none").find("#parent-id").prop( "disabled", false);
            $("#parent-id option").not("#parent-id option[value=0]").remove();
            
            let parentLevel = parseInt(level) - 1;
            $.ajax({
                type: "POST",
                dataType: "JSON",
                data: {"parentLevel" : parentLevel},
                url: "/admin/menus/getParentMenuList",
                success: function (result){
                    let html = '';
                    result.parentMenuList.forEach(menu => {
                        html += '<option value="'+menu.id+'">'+menu.name+'</option>';
                    });
                    $("#parent-id").append(html);
                },
                error: function (xhr, status, error){
                    console.log(error);
                }
            });  
        }
        else{
            $("#parent-id-block").addClass("d-none").find("#parent-id").prop( "disabled", true);
        }
    });
});


// Get level and parent id
function getLevelAndParentID(){
    let url = window.location.href;
    let arrayUrl = url.split('/');

    if(arrayUrl.length < 8){
        arrayUrl[7] = 0
    }

    let dataArray = [];
    dataArray[0] = arrayUrl[5]; // Get level
    dataArray[1] = arrayUrl[7]; // Get parent_id
    return dataArray;
}

// Create and set menu table using DataTable
function createMenuDataTable(){

    let levelAndParentID = getLevelAndParentID();
    let level = levelAndParentID[0];
    let parent_id = levelAndParentID[1];
    let nextMenuLevel = parseInt(level) + 1;

    $("#admin-menu-table-"+level).DataTable({
        processing: true,
        serverSide: true,
        ajax: "/admin/menus/getMenuList/"+level+"/"+parent_id,
        columns: [{
                data: "id",
                name: "checkbox",
                orderable: false,
                width: "4%",
                render: function(data, type, row, meta) {
                    return '<input type="checkbox" name="row-checkbox" data-id="' + data + '" id="">';
                }
            },
            // {
            //     data: 'id',
            //     name: 'id',
            //     width: "6%",
            // },
            {
                data: 'name',
                name: 'name',
                width: "20%",
            },
            {
                data: 'active',
                name: 'active',
                width: "5%",
                render: function(data, type, row, meta) {
                    var html = '';
                    if (data == 1) {
                        html = '<a href="javascript:void(0)"><i class="fas fa-check-circle text-success"></i></a>';
                    } else {
                        html = '<a href="javascript:void(0)"><i class="fas fa-times-circle text-danger"></i></a>';
                    }

                    return html;
                }
            },
            {
                data: 'updated_at',
                name: 'updated_at',
                width: "12%",
                render: function (data, type, row, meta){
                    let date = new Date(data);
                    return date.toLocaleString();
                }
            },
            {
                data: "id",
                name: "action",
                orderable: false,
                width: "12%",
                render: function(data, type, row, meta) {
                    var html = [];
                    html[0] = '<a href="/admin/menus/edit/' + data + '" title="Ch???nh s???a" class ="btn btn-primary btn-sm"><i class = "far fa-edit"></i></a> ';
                    html[1] = '<a href="javascript:void(0)" title="X??a" onclick="deteleMenu(' + data + ')" class ="btn btn-danger btn-sm btn-delete"> <i class = "far fa-trash-alt"></i></a> ';
                    
                    // Static settings only have 2 menu levels 
                    if(nextMenuLevel < 3){
                        html[2] = '<a href="/admin/menus/'+nextMenuLevel+'/list/'+data+'" data-id="'+data+'" title="Xem danh m???c con" class ="btn-next-menu-level btn btn-danger btn-sm "><i class="fa fa-eye" aria-hidden="true"></i></a>';
                    }
                    else{
                        html[2] = '';
                    }

                    return '<div>' + html[0] + html[1] + html[2] + '</div>';
                }
            }
        ],
        lengthMenu: [
            [5, 10, -1],
            [5, 10, "All"]
        ],
        language: {
            lengthMenu: "Hi???n th??? _MENU_ danh m???c",
            search: "T??m ki???m",
            zeroRecords: "Kh??ng t??m th???y k???t qu??? ph?? h???p",
            info: "Hi???n th??? _START_ ?????n _END_ danh m???c c???a t???ng _TOTAL_ danh m???c",
            infoEmpty: "Kh??ng c?? danh m???c n??o",
            infoFiltered:   "(l???c t??? t???ng _MAX_ danh m???c)",
            paginate: {
                next: "Ti???p",
                previous: "Tr?????c"
            }
        },
    }).on("draw", function (){
        // Each time redraw the table, main checkbox won't checked
        $("input[name=main-checkbox]").prop("checked", false);
    });;
}

// Delete menu
function deteleMenu(id) {
    let levelAndParentID = getLevelAndParentID();
    let level = levelAndParentID[0];
    $.confirm({
        title: 'X??a menu',
        content: 'B???n c?? ch???c mu???n x??a ch????',
        buttons: {
            yes: function() {
                $.ajax({
                    type: 'DELETE',
                    dataType: 'JSON',
                    data: { 'id': id },
                    url: "/admin/menus/delete",
                    success: function(result) {
                        if (result.message === true) {
                            $("#admin-menu-table-" + level).DataTable().ajax.reload();
                            $.alert({
                                title: 'Th??nh c??ng',
                                content: 'X??a menu th??nh c??ng!',
                            });
                        }
                        else{
                            $.confirm({
                                title: 'C???nh b??o!',
                                content: 'Tr?????c khi x??a. B???n ph???i x??a h???t s???n ph???m thu???c danh m???c n??y ho???c danh m???c con c???a n??!!',
                                type: 'red',
                                typeAnimated: true,
                                buttons: {
                                    tryAgain: {
                                        text: 'Th??? l???i',
                                        btnClass: 'btn-red',
                                        action: function() {}
                                    },
                                }
                            });
                        }
                    },
                    error(xhr, status, error) {
                        console.log(error);
                    }
                });
            },
            no: function() {},
        }
    });
}

// Delete multiple menus
function deleteMultipleMenus(){
    let levelAndParentID = getLevelAndParentID();
    let level = levelAndParentID[0];
    let checkedRowNumber = $("input[name=row-checkbox]:checked").length;
    if( checkedRowNumber > 0){
        $.confirm({
            title: 'X??a s???n ph???m',
            content: 'B???n c?? ch???c mu???n x??a '+ checkedRowNumber +' menu n??y ch????',
            buttons: {
                yes: function() {
                    let arrayOfID = [];
                    $("input[name=row-checkbox]").each(function (){
                        if(this.checked){
                            arrayOfID.push($(this).data("id"));
                        }
                    });

                    $.ajax({
                        type: "POST",
                        dataType: "JSON",
                        data: {"array_of_id": arrayOfID},
                        url: "/admin/menus/deleteMultiple",
                        success: function (result){
                            if (result.message === true) {
                                $("#admin-menu-table-" + level).DataTable().ajax.reload();
                                $.alert({
                                    title: 'Th??nh c??ng',
                                    content: 'X??a '+ checkedRowNumber +' menu th??nh c??ng!',
                                });
                            }
                            else{
                                $.confirm({
                                    title: 'C???nh b??o!',
                                    content: 'C?? v???n ????? x???y ra khi x??a. Xin h??y ki???m tra l???i!!',
                                    type: 'red',
                                    typeAnimated: true,
                                    buttons: {
                                        tryAgain: {
                                            text: 'Th??? l???i',
                                            btnClass: 'btn-red',
                                            action: function() {}
                                        },
                                    }
                                });
                            }
                        },
                        error(xhr, status, error) {
                            console.log(error);
                        }
                    });
                },
                no: function() {},
            }
        });
    }
    else{
        $.confirm({
            title: 'Ch?? ??!',
            content: 'Ch??a c?? slider n??o ???????c ch???n ????? x??a!!',
            type: 'red',
            typeAnimated: true,
            buttons: {
                tryAgain: {
                    text: 'Th??? l???i',
                    btnClass: 'btn-red',
                    action: function() {}
                },
            }
        });
    }
}
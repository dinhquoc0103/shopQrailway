$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

$(document).ready(function() {
    createProductDataTable();


    // Enable quantity input number when checked size checkbox
    // $("#size-block").on("click", ".size-checkbox", function (){

    //     let size = $(this).data("size");
    //     let sizeArray = [];
    //     if(this.checked == true){
    //         // $("#"+size+"-quantity").prop("disabled", false).removeClass("d-none");    
    //         // $("#"+size+"-quantity").removeClass("d-none");    
    //         if(JSON.parse(localStorage.getItem("sizeArray")) != null){
    //             sizeArray = JSON.parse(localStorage.getItem("sizeArray"));
    //         }   
    //         sizeArray.push(size);               
    //     }
    //     else{
    //         // $("#"+size+"-quantity").val(null).prop("disabled", true);
    //         // $("#"+size+"-quantity").val("").addClass("d-none");  
    //         sizeArray = JSON.parse(localStorage.getItem("sizeArray"));
    //         for(let i=0; i<sizeArray.length; i++){
    //             if(sizeArray[i] == size){
    //                 sizeArray.splice(i, 1);
    //             }
    //         }
    //     }  
    //     // Save to localStorage
    //     localStorage.setItem("sizeArray", JSON.stringify(sizeArray)); 
    // });
    // When submit if validation error, keep previously checked status
    // $("#size-block .size-checkbox").each(function (){
    //     let size = $(this).data("size");
    //     sizeArray = JSON.parse(localStorage.getItem("sizeArray"));
    //     if(this.checked){
    //         // $("#"+size+"-quantity").prop("disabled", false);
    //         // $("#"+size+"-quantity").removeClass("d-none");  
    //     }
    //     else{
    //         // $("#"+size+"-quantity").val(null).prop("disabled", true);
    //         // $("#"+size+"-quantity").val(" ").addClass("d-none");
    //         localStorage.removeItem("sizeArray");
    //     }
    // });
    
});


// Create and set product table using DataTable
function createProductDataTable(){
    $("#admin-product-table").DataTable({
        processing: true,
        serverSide: true,
        ajax: "/admin/products/getProductList",
        columns: [{
                data: "id",
                name: "checkbox",
                orderable: false,
                width: "2%",
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
                data: function(row, type, val, meta) {
                    // Get data from two columns to string
                    return row.thumb + '+' + row.name;
                },
                name: 'thumb',
                orderable: false,
                width: "5%",
                render: function(data, type, row, meta) {
                    // String to array separated by plus sign(k?? t???)
                    data = data.split('+');
                    return '<img src="' + data[0] + '" alt="' + data[1] + '" width="100px" height="120px">';
                }
            },
            {
                data: 'menu_name',
                name: 'menu_name',
                width: "15%",
            },
            {
                data: 'price',
                name: 'price',
                width: "10%",
                render: function(data, type, row, meta) {
                    // Return numbers to money format
                    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data);
                }
            },
            {
                data: 'discount',
                name: 'discount',
                width: "2%",
                render: function(data, type, row, meta) {
                    return data + '%';
                }
            },
            {
                data: 'inventory',
                name: 'inventory',
                orderable: false,
                width: "20%",
                render: function(data, type, row, meta) {
                    let html = "<span>Size <b>M</b>:c??n " + data.M + "</span><br>";
                    html += "<span>Size <b>L</b>: c??n " + data.L + "</span><br>";
                    html += "<span>Size <b>XL</b>: c??n " + data.XL + "</span><br>";
                    html += "<span>Size <b>XXL</b>: c??n " + data.XXL + "</span><br>";
                    return html;
                }
            },
            {
                data: 'active',
                name: 'active',
                width: "6%",
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
                width: "10%",
                render: function (data, type, row, meta){
                    let date = new Date(data);
                    return date.toLocaleString();
                }
            },
            {
                data: "id",
                name: "action",
                orderable: false,
                width: "10%",
                render: function(data, type, row, meta) {
                    var html = [];
                    html[0] = '<a href="/admin/products/edit/' + data + '" title="Ch???nh s???a" class ="btn btn-primary btn-sm"><i class = "far fa-edit"></i></a> ';
                    html[1] = '<a href="javascript:void(0)" title="X??a" onclick="deteleProduct(' + data + ')" class ="btn btn-danger btn-sm btn-delete"> <i class = "far fa-trash-alt"></i></a>';
                    return '<div>' + html[0] + html[1] + '</div>';
                }
            }
        ],
        lengthMenu: [
            [5, 10, -1],
            [5, 10, "All"]
        ],
        language: {
            lengthMenu: "Hi???n th??? _MENU_ s???n ph???m",
            search: "T??m ki???m",
            zeroRecords: "Kh??ng t??m th???y k???t qu??? ph?? h???p",
            info: "Hi???n th??? _START_ ?????n _END_ s???n ph???m c???a t???ng _TOTAL_ s???n ph???m",
            infoEmpty: "Kh??ng c?? s???n ph???m n??o",
            infoFiltered:   "(l???c t??? t???ng _MAX_ s???n ph???m )",
            paginate: {
                next: "Ti???p",
                previous: "Tr?????c"
            }
        },
    }).on("draw", function (){
        // Each time redraw the table, main checkbox won't checked
        $("input[name=main-checkbox]").prop("checked", false);
    });
}


// Delete product
function deteleProduct(id) {
    $.confirm({
        title: 'X??a s???n ph???m',
        content: 'B???n c?? ch???c mu???n x??a ch????',
        buttons: {
            yes: function() {
                $.ajax({
                    type: 'DELETE',
                    dataType: 'JSON',
                    data: { 'id': id },
                    url: "/admin/products/delete",
                    success: function(result) {
                        if (result.message === true) {
                            $("#admin-product-table").DataTable().ajax.reload();
                            $.alert({
                                title: 'Th??nh c??ng',
                                content: 'X??a s???n ph???m th??nh c??ng!',
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

// Delete multiple products
function deleteMultipleProducts(){
    let checkedRowNumber = $("input[name=row-checkbox]:checked").length;
    if( checkedRowNumber > 0){
        $.confirm({
            title: 'X??a s???n ph???m',
            content: 'B???n c?? ch???c mu???n x??a '+ checkedRowNumber +' s???n ph???m n??y ch????',
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
                        url: "/admin/products/deleteMultiple",
                        success: function (result){
                            if (result.message === true) {
                                $("#admin-product-table").DataTable().ajax.reload();
                                $.alert({
                                    title: 'Th??nh c??ng',
                                    content: 'X??a '+ checkedRowNumber +' s???n ph???m th??nh c??ng!',
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
            content: 'Ch??a c?? s???n ph???m n??o ???????c ch???n ????? x??a!!',
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
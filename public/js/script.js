$('#HomeUploadButtonHolder > a').click(function() {
    window.location.replace("/upload");
})

$('#HeaderBackLinkText').click(function() {
    var url = $(this).data("url");
    window.location.replace(url);
})

$('#ColorsFamiliesTap').click(function() {
    window.location.replace("/families");
})

$('#ColorsCollectionTap').click(function() {
    window.location.replace("/collection");
})

$('#AdminColorsFamiliesTap').click(function() {
    window.location.replace("/admin_families");
})

$('#AdminColorsCollectionTap').click(function() {
    window.location.replace("/admin_collection");
})

$('#nav-savedColorsTab').click(function() {
    if (screen.width >= 970) return;
    $('#SavedColorsModal').toggleClass('nav-slideDown');
    $('#SavedColorsModal').toggleClass('nav-slideUp');
    if ($('#SavedColorsModal').hasClass('nav-slideDown')) {
        $('#headerMenu').height(55 + $('#SavedColorsModal').height());
        if (screen.width >= 750) $('#headerMenu').height(70 + $('#SavedColorsModal').height());
    } else {
        $('#headerMenu').height(55);
        if (screen.width >= 750) $('#headerMenu').height(70);
    }
    $('#progressBar').removeClass('nav-slideDown');
    $('#progressBar').addClass('nav-slideUp');
})

$('#nav-menuTab').click(function() {
    if (screen.width >= 750) return;
    $('#progressBar').toggleClass('nav-slideDown');
    $('#progressBar').toggleClass('nav-slideUp');
    if ($('#progressBar').hasClass('nav-slideDown')) {
        $('#headerMenu').height(55 + $('#progressBar').height());
    } else {
        $('#headerMenu').height(55);
    }
    $('#SavedColorsModal').removeClass('nav-slideDown');
    $('#SavedColorsModal').addClass('nav-slideUp');
})

if (screen.width >= 970) {
    $('#SavedColorsModal').addClass('nav-slideDown');
} else {
    $('#SavedColorsModal').addClass('nav-slideUp');
}

$(window).resize(function(e){
    $('#headerMenu').height(70);
    if (screen.width >= 970) {
        $('#SavedColorsModal').removeClass('nav-slideUp');
        $('#SavedColorsModal').addClass('nav-slideDown');
        $('#nav-savedColorsTab').css({'border-top-right-radius': '15px'});
        return;
    }
    $('#nav-savedColorsTab').css({'border-top-right-radius': '0'});
    $('#SavedColorsModal').addClass('nav-slideUp');
    $('#SavedColorsModal').removeClass('nav-slideDown');
    if (screen.width < 750) {
    $('#headerMenu').height(55);
        $('#progressBar').addClass('nav-slideUp');
        $('#progressBar').removeClass('nav-slideDown');
    }
});

$(window).scroll(function(e){
    if (screen.width < 970) return;
    var $el = $('.fixedElement');
    var x_offset = $('#nav-menuTab').css('width');
    x_offset = 29;
    if (screen.width < 1170) x_offset = 26;
    if ($(this).scrollTop() > 170){ 
        $el.css({
            'position': 'fixed',
            'top': '0',
            'transform': `translateX(-${x_offset}px)`
        });
        $('#nav-savedColorsTab').css({'border-top-right-radius': '0'});
    }
    if ($(this).scrollTop() < 170){
        $el.css({
            'position': 'static',
            'top': '0',
            // 'transform': `translateX(-${x_offset})`
        });
        $('#nav-savedColorsTab').css({'border-top-right-radius': '15px'});
    } 
});

$('body').on('click', '.SavedColorDelete', function(){
    if (!$('#SavedColorsList').data('admin')) return;
    
    const index = $(this).closest('.SavedColorItem').data('index');
    var id = $(this).closest('.SavedColorItem').data('id');
    var self = $(this).closest('.SavedColorItem');
    $(".notification-pane").show();
    $.ajax({
        url : '/delete_product',
        type : 'POST',
        data : {
            id: id//title.toLowerCase().replace(/ /g,'-'),
        },
        success : function(data) {
            if (globalCurColorIdx == index + 1) {
                resetHandler();
            }
            if (globalCurColorIdx >= index + 1) globalCurColorIdx--;
            $('#SavedColorsList').data('current', globalCurColorIdx);
            const len = $('.SavedColorItem').length;
            if (index != len - 1) {
                for ( i = index + 1; i < len ; i++) {
                    $('.SavedColorItem').eq(i).attr('data-index', i - 1);
                    $('.SavedColorItem').eq(i).data('index', i - 1);
                }
            }
            
            $.ajax({
                url : '/reset_upload',
                type : 'POST',
                data : {
                    draftsrc: self.data('src'),
                },
                success : function(data) {
                    $(".notification-pane").hide();
                },
                error: function(data){
                    $(".notification-pane").hide();
                    console.log('Draft Upload Reset Failed.');
                }
            });
            self.remove();
            $('.SavedColorCountNum').first().text(String(len - 1));
        },
        error: function(data){
            $(".notification-pane").hide();
            alert('Product Add Failed. Please check and try again.');
        }
    });
})

$('body').on('click', '.SavedColorData', function(){
    const index = $(this).closest('.SavedColorItem').data('index');
    if (globalCurColorIdx == index + 1) {
        $(this).closest('#SavedColorsList').data('current', 0);
        $(this).children('.SavedColor_Col').first().html("");
        $('.ColorSelectorSwatch').html('');
        $('#ColorSelectorSelectedColor').text('');
        globalCurColorIdx = 0;
        $('#ActionOrderButton').removeClass('Active');
        $('#NotificationFooter #ActionOrderButton').removeClass('Active');
    } else {
        $(this).closest('#SavedColorsList').data('current', index + 1);
        $(".SavedColorItem[data-index="+(globalCurColorIdx - 1)+"]").find(".SavedColor_Col").html("");
        $(this).children(".SavedColor_Col").first().html("<span id='SavedColor_ColCheck'"+
            "class='material-icons'>check_circle</span>");
        $('.ColorSelectorSwatch').html('');
        $('.ColorSelectorSwatch').eq(index).html("<span class='material-icons'>check_circle</span>");
        ///###
        $('#ColorSelectorSelectedColor').text($(this).find('p').first().text());
        globalCurColorIdx = index + 1;
        $('#ActionOrderButton').addClass('Active');
        $('#NotificationFooter #ActionOrderButton').addClass('Active');
    }
    if ($('#SavedColorsList').data('admin')) productSelect();
})

$('.UploadCheckBox').click(function() {
    $('.UploadCheckBox').toggleClass('UploadCheckBoxChecked');
    $('.UploadCheckBox').toggleClass('UploadCheckBoxUnchecked');
    $('#UploadPhotoButton').toggleClass('Active');
});

$('#UploadPhotoButton').click(function() {
    $('#ImagePicker').click();
});

$('#UploadPhotoMobile > #UploadPhotoButton').click(function() {
    $('#ImagePicker').click();
});

$('#ImagePicker').on('change', function(e) {
    var formData = new FormData();
    if($('#ImagePicker').length == 0)
        return;
    formData.append('file', $('#ImagePicker')[0].files[0]);
    $(".notification-pane").show();
    $.ajax({
        url : '/file_upload',
        type : 'POST',
        data : formData,
        processData: false,  // tell jQuery not to process the data
        contentType: false,  // tell jQuery not to set contentType
        success : function(data) {
            $(".notification-pane").hide();
            $('.nav-2Step').attr('href', '/color');
            $('.nav-2Step .nav-circle').addClass('enabled');
            $('.nav-2Step .nav-progressLine').addClass('enabled');
            $('.nav-2Step .nav-progressText').addClass('enabled');
            $(location).attr('href', '/color');
        },
        error: function(data){
            $(".notification-pane").hide();
            alert('Upload Failed. try again.');
        }
    });
});

$('#UploadButton').click(function() {
    $('#ProductImagePicker').click();
});

function checkSubmitActive() {
    if ($('#ProductTitleContainer > .UploadRoboMedium').val() == '') { $('#SubmitButton').removeClass('Active'); return;}
    if ($('#ProductIdContainer > .UploadRoboMedium').val() == '') { $('#SubmitButton').removeClass('Active'); return;}
    if ($('#ProductPreview > img').attr('src') == '') { $('#SubmitButton').removeClass('Active'); return;}
    $('#SubmitButton').addClass('Active');
}

function checkProductSubtype(idx) {
    $('.ProductTypes > a').addClass('UploadCheckBoxUnchecked');
    $('.ProductTypes > a').removeClass('UploadCheckBoxChecked');
    $('.ProductTypes').eq(parseInt(idx) - 1).find('a').first().addClass('UploadCheckBoxChecked');
    $('.ProductTypes').eq(parseInt(idx) - 1).find('a').first().removeClass('UploadCheckBoxUnchecked');
}

function productReset(){
    $('#ProductTitleContainer > input').val('');
    $('#ProductIdContainer > input').val('');
    $('#SubmitButton').removeClass('Active');
    $('#ProductPreview > img').addClass('ProductPreviewHidden');
    $('#ProductPreview > div').removeClass('ProductPreviewHidden');
    $('#ProductPreview > img').attr('src', '');
    $('#ProductPreview').data('imgurl','');
    checkProductSubtype('1');
    $('#SubmitButton').find('#UploadText').text('Add');
};

function productSelect(){
    const draftsrc = $('#ProductPreview > img').attr('src');
    var curSrc = $('#ProductPreview').data('imgurl');
    if (draftsrc) {
        if(!curSrc || curSrc != draftsrc) {
            $(".notification-pane").show();
            $.ajax({
                url : '/reset_upload',
                type : 'POST',
                data : {
                    draftsrc: draftsrc,
                },
                success : function(data) {
                    $(".notification-pane").hide();
                },
                error: function(data){
                    $(".notification-pane").hide();
                    console.log('Draft Upload Reset Failed.');
                }
            });
        }
    }
    productReset();
    if( !globalCurColorIdx ) return;

    var el = $(".SavedColorItem[data-index="+(globalCurColorIdx - 1)+"]");
    var src = el.data('src');
    var id = el.data('id');
    var subtype = el.data('subtype');
    var type = src.indexOf('/colors/') != -1 ? 'colors' : 'patterns';
    var title = el.find('.SavedColorName > span').text();

    $('#ProductTitleContainer > input').val(title);
    $('#ProductIdContainer > input').val(id);
    $('#ProductIdContainer > input').data('id', id);
    checkProductSubtype(subtype);
    $('#ProductPreview > img').removeClass('ProductPreviewHidden');
    $('#ProductPreview > div').addClass('ProductPreviewHidden');
    $('#ProductPreview > img').attr('src', src);

    $('#ProductPreview').data('imgurl', src);
    $('#SubmitButton').find('#UploadText').text('Update');
    $('#SubmitButton').addClass('Active');
};

$('#SubmitButton').click(function() {
    const id= $('#ProductIdContainer > input').val();
    const title= $('#ProductTitleContainer .UploadRoboMedium').val();
    const oldId= $('#ProductIdContainer > input').data('id');
    var src = $('#ProductPreview > img').attr('src');
    const type = $('#UploadProductTypeContainer .UploadCheckBoxChecked').closest('.ProductTypes').hasClass('ColorTypeChecker') ? 'colors' : 'patterns';
    const subtype = $('#UploadProductTypeContainer .UploadCheckBoxChecked').closest('.ProductTypes').data('sub');
    const postUrl = $(this).find('#UploadText').text() == 'Add' ? '/add_product' : '/update_product';
    $(".notification-pane").show();
    $.ajax({
        url : postUrl,
        type : 'POST',
        data : {
            old_id: oldId ? oldId : undefined,//oldTitle.toLowerCase().replace(/ /g,'-')
            id: id,//title.toLowerCase().replace(/ /g,'-'),
            title: title,
            src: src,
            type: type,
            subtype: subtype
        },
        success : function(data) {
            if (src.indexOf(type) == -1) {
                var strList = src.split('/');
                for ( i in strList ) {
                    if (strList[i] == 'colors' || strList[i] == 'patterns') {strList[i] = type;break;}
                }
                var newStr = strList.join('/');
                console.log('newStr: ', newStr);
                src = newStr;
            }
            if (postUrl == '/update_product') {
                var curSrc = $('#ProductPreview').data('imgurl');
                if (curSrc != src)
                    $.ajax({
                        url : '/reset_upload',
                        type : 'POST',
                        data : {
                            draftsrc: curSrc,
                        },
                        success : function(data) {
                            $(".notification-pane").hide();
                        },
                        error: function(data){
                            $(".notification-pane").hide();
                            console.log('Draft Upload Reset Failed.');
                        }
                    });

                if( globalCurColorIdx ) {
                    var el = $(".SavedColorItem[data-index="+(globalCurColorIdx - 1)+"]");
                    el.data('id', id);
                    el.data('src', src);
                    el.data('subtype', subtype);
                    el.find('.SavedColor_Col').attr('style', 'background-image: url('+src+'); background-size: contain;');
                    el.find('.SavedColorName > span').text(title);
                    el.find(".SavedColor_Col").html("");
                }
                $(".notification-pane").hide();
            } else {
                var origin = $('#SavedColorsList').html();
                var idx = $('.SavedColorItem').length;
                $('.SavedColorCountNum').first().text(String(idx + 1));

                origin += 
                '<div class="SavedColorItem" style="" data-index="'+idx+'" data-id="'+id+'" data-subtype="'+subtype+'" data-src="'+src+'">'+
                    '<div class="SavedColorData">'+
                        '<div class="SavedColor_Col" style="background-image: url('+src+'); background-size: contain;">'+
                        '</div>'+
                        '<div class="SavedColorInfo UploadRoboMedium">'+
                            '<p class="SavedColorName">'+
                                '<span class="">'+title+'</span>'+
                            '</p>'+
                        '</div>'+
                    '</div>'+
                    '<div class="SavedColorDelete">'+
                        '<div class="SavedColorTrash material-icons">'+
                            '<span>delete</span>'+
                        '</div>'+
                    '</div>'+
                '</div>';
                $('#SavedColorsList').html(origin);
                $(".notification-pane").hide();
            }
            productReset();
        },
        error: function(data){
            if (postUrl == '/update_product') {
            } else {
                $.ajax({
                    url : '/reset_upload',
                    type : 'POST',
                    data : {
                        draftsrc: src,
                    },
                    success : function(data) {
                        $(".notification-pane").hide();
                    },
                    error: function(data){
                        $(".notification-pane").hide();
                        console.log('Draft Upload Reset Failed.');
                    }
                });
                $('#SubmitButton').removeClass('Active');
                $('#ProductPreview > img').addClass('ProductPreviewHidden');
                $('#ProductPreview > div').removeClass('ProductPreviewHidden');
                $('#ProductPreview > img').attr('src', '');
                alert('Product Id is already exist. Please check and try again.');
            }
        }
    });
});

const resetHandler = function() { 
    const draftsrc = $('#ProductPreview > img').attr('src');
    var curSrc = $('#ProductPreview').data('imgurl');
    if (draftsrc && curSrc != draftsrc) {
        $(".notification-pane").show();
        $.ajax({
            url : '/reset_upload',
            type : 'POST',
            data : {
                draftsrc,
            },
            success : function(data) {
                $(".notification-pane").hide();
            },
            error: function(data){
                $(".notification-pane").hide();
                console.log('Draft Upload Reset Failed.');
            }
        });
    }
    productReset();
    $(".SavedColorItem[data-index="+(globalCurColorIdx - 1)+"]").find(".SavedColor_Col").html("");
}

$('#ResetButton').click(resetHandler);

$('#ProductTitleContainer > input').on('change', function(e) {
    checkSubmitActive();
});

$('#ProductIdContainer > input').on('change', function(e) {
    checkSubmitActive();
});

$('#ProductImagePicker').on('change', function(e) {
    var formData = new FormData();
    var filePath;
    if($('#ProductImagePicker').length == 0)
        return;
    if ($('#ColorTypeChecker > a').hasClass('UploadCheckBoxChecked')) filePath = 'colors?';
    else filePath = 'patterns?';
    const draftsrc = $('#ProductPreview > img').attr('src');
    var curSrc = $('#ProductPreview').data('imgurl');
    if (curSrc && draftsrc!=curSrc)
        filePath +=  $('#ProductPreview > img').attr('src');
    formData.append('file', $('#ProductImagePicker')[0].files[0]);
    $(".notification-pane").show();
    $.ajax({
        url : '/image_upload' + filePath,
        type : 'POST',
        data : formData,
        processData: false,  // tell jQuery not to process the data
        contentType: false,  // tell jQuery not to set contentType
        success : function(data) {
            $(".notification-pane").hide();
            $('#ProductPreview > img').attr('src', data.result);
            $('#ProductPreview > img').removeClass('ProductPreviewHidden');
            $('#ProductPreview > div').addClass('ProductPreviewHidden');
            checkSubmitActive();
        },
        error: function(data){
            $(".notification-pane").hide();
            alert('Upload Failed. try again.');
        }
    });
});

// $(window).on('load', function () {
    var savedData = [];
    var items = $('.SavedColorItem');
    for (i = 0;i < items.length; i++) {
        var id = items.eq(i).data('id');
        var title = items.eq(i).find('.SavedColorName > span').text();
        var src = items.eq(i).data('src');
        savedData.push({id, title, src});
        $('.ColorItem[data-id="'+id+'"]').first().find('span').first().addClass('isSelected');
    }
    savedProductData = savedData;
    // $(".notification-pane").hide();
// });

$('.ColorItem').click(function() {
    var checkEle = $(this).find('span').first();
    if (checkEle.hasClass('isSelected')) {
        $(checkEle.removeClass('isSelected'));
        var idx = -1;
        for ( i in savedProductData) {
            var data = savedProductData[i];
            if (data.id == $(this).data('id')) {
                idx = i;
                break;
            }
        }
        if (idx != -1) savedProductData.splice(idx, 1);
        $('.SavedColorItem').eq(idx).remove();
        if (savedProductData.length == 0) {
            $('.nav-3Step .nav-progressLine').removeClass('enabled');
            $('.nav-3Step').attr('href', '');
            $('#SavedColorsAction').removeClass('enabled');
        }
    } else {
        $(checkEle.addClass('isSelected'));
        addSavedProductItem({idx: savedProductData.length, id: $(this).data('id'), title: $(this).find('p > span').first().text(), src: $(this).data('src')});
        savedProductData.push({id: $(this).data('id'), title: $(this).find('p > span').first().text(), src: $(this).data('src')});
        $('.nav-3Step .nav-progressLine').addClass('enabled');
        $('.nav-3Step').attr('href', '/room');
        $('#SavedColorsAction').addClass('enabled');
    }
    $.ajax({
        url : '/savedProductDataChanged',
        type : 'POST',
        data : {savedProductData},
        success : function(data) {
            $(".notification-pane").hide();
        },
        error: function(data){
            $(".notification-pane").hide();
            alert('Product data save failed. try again.');
        }
    });
    $('.SavedColorCountNum').first().text(String(savedProductData.length));
    console.log(savedProductData);
});

function addSavedProductItem (data) {
    $('#SavedColorsList').append(
       '<div class="SavedColorItem" style="" data-index="'+data.idx+'" data-id="'+data.id+'" data-src="'+data.src+'">'+
            '<div class="SavedColorData">'+
                '<div class="SavedColor_Col" style="background-image: url('+data.src+'); background-size: contain;">'+
                    // '<span id="SavedColor_ColCheck" class="material-icons" style="">check_circle</span>'+
                '</div>'+
                '<div class="SavedColorInfo UploadRoboMedium">'+
                    '<p class="SavedColorName">'+
                        '<span class="">'+ data.title+'</span>'+
                    '</p>'+
                '</div>'+
            '</div>'+
        '</div>'
    );
}

$('#SavedColorsAction').click(function () {
    if ($(this).hasClass('enabled') || savedProductData.length > 0) $(location).attr('href', '/room');
})

$('#NotificationFooter .ActionNextButton').click(function () {
    if (savedProductData.length > 0) $(location).attr('href', '/room');
})

$('body').on('click', '.ColorSelectorSwatch', function(){
    const index = $(this).data('index');
    if (globalCurColorIdx == index + 1) {
        $('#SavedColorsList').data('current', 0);
        $(".SavedColorItem[data-index="+(index)+"]").find(".SavedColor_Col").html("");
        $(this).html('');
        $('#ColorSelectorSelectedColor').text('No Select');
        globalCurColorIdx = 0;
        $('#ActionOrderButton').removeClass('Active');
        $('#NotificationFooter #ActionOrderButton').removeClass('Active');
    } else {
        $('#SavedColorsList').data('current', index + 1);
        $(".SavedColorItem[data-index="+(globalCurColorIdx - 1)+"]").find(".SavedColor_Col").html("");
        $(".SavedColorItem[data-index="+(index)+"]").find(".SavedColor_Col").html("<span id='SavedColor_ColCheck'"+
            "class='material-icons'>check_circle</span>");
        $('.ColorSelectorSwatch').html('');
        $('#ColorSelectorSelectedColor').text($(this).data('id'));
        $(this).html("<span class='material-icons'>check_circle</span>");
        globalCurColorIdx = index + 1;
        $('#ActionOrderButton').addClass('Active');
        $('#NotificationFooter #ActionOrderButton').addClass('Active');
    }
})

$('#LoginButton').click(function() {
    var input = $('input[type=password]').first();
    if (input.val().length < 8) {
        alert('Password must be at least 8 letters');
        input.val('');
    }

    $(".notification-pane").show();

    $.ajax({
        url : '/login',
        type : 'POST',
        data : {password: input.val()},
        success : function(data) {
            $(".notification-pane").hide();
            $(location).attr('href', '/admin');
        },
        error: function(data){
            $(".notification-pane").hide();
            alert('Password is incorrect. Try again.');
        }
    });
});

$('#PasswordChangeButton').click(function() {
    var input = $('input[type=password]').first();
    var confirmInput = $('input[type=password]').last();
    if (input.val().length < 8 || confirmInput.val().length < 8) {
        alert('Password must be at least 8 letters.');
        input.val('');
        confirmInput.val('');
        return;
    }

    if (input.val() != confirmInput.val()) {
        alert('Confirm Password is incorrect. Try again');
        input.val('');
        confirmInput.val('');
        return;
    }

    $(".notification-pane").show();

    $.ajax({
        url : '/reset',
        type : 'POST',
        data : {password: input.val()},
        success : function(data) {
            $(".notification-pane").hide();
            // $(location).attr('href', '/admin');
        },
        error: function(data){
            $(".notification-pane").hide();
            // $(location).attr('href', '/reset');
        }
    });
});

// $('#PasswordButton').click(function() {
//     $(location).attr('href', '/admin');
// });

// $('#LibraryButton').click(function() {
//     $(location).attr('href', '/admin');
// });

$('#ActionOrderButton').click(function() {
    if (globalCurColorIdx == 0 || savedProductData.length == 0) return;
    window.open('https://www.meriguet-carrere.com/products/'+savedProductData[globalCurColorIdx - 1].id);
})

$('#NotificationFooterActions #ActionOrderButton').click(function() {
    if (globalCurColorIdx == 0 || savedProductData.length == 0) return;
    window.open('https://www.meriguet-carrere.com/products/'+savedProductData[globalCurColorIdx - 1].id);
})

$('#ActionBackToShop').click(function() {
    $(location).attr('href', 'https://www.meriguet-carrere.com/');
})

$('.TileImage #TileImage').on('load', function(){
    $(this).closest('#TileImageLoading').find('.TileImageLoader').css('display', 'none');
})

var cur_thm = 0;

$('body').on('click', '#ThumbnailChooser .TileCell', function(){
    cur_thm = $(this).data('thm');
    $('#ThumbnailPicker').click();
});
$('body').on('click', '#PhotoChooser #TileContainer > a', function(){
    // const index = $(this).data('d1');
    // if (!index) {
        const src = $(this).data('src');
        if (!src) {
            return;
        }
        // const url = $(location).attr('href');
        // const dirIdx = url.substring(url.lastIndexOf('/') + 1);
        $(".notification-pane").show();
        $.ajax({
            url : '/select_library',
            type : 'POST',
            data : {
                // dirId: dirIdx,
                name: src
            },
            success : function(data) {
                console.log(data);
                // $(".notification-pane").hide();
                // $('.nav-2Step').attr('href', '/color');
                // $('.nav-2Step .nav-circle').addClass('enabled');
                // $('.nav-2Step .nav-progressLine').addClass('enabled');
                // $('.nav-2Step .nav-progressText').addClass('enabled');
                $(location).attr('href', '/color');
            },
            error: function(data){
                console.log(data);
                $(".notification-pane").hide();
            }
        });
    // } else
    //     $(location).attr('href', '/library/' + index);
})

$('#ThumbnailPicker').on('change', function(e) {
    var formData = new FormData();
    if (cur_thm == 0) return;
    var filePath = '/img/library/' + cur_thm + '.jpg';
    if (cur_thm == 9) filePath = '/img/families.jpg';
    if (cur_thm == 10) filePath = '/img/collections.jpg';
    if($('#ThumbnailPicker').length == 0)
        return;
    formData.append('file', $('#ThumbnailPicker')[0].files[0]);
    $(".notification-pane").show();
    $.ajax({
        url : '/thumbnail_upload' + filePath,
        type : 'POST',
        data : formData,
        processData: false,  // tell jQuery not to process the data
        contentType: false,  // tell jQuery not to set contentType
        success : function(data) {
            $(".notification-pane").hide();
            $(location).attr('href', '/admin');
        },
        error: function(data){
            $(".notification-pane").hide();
            alert('Upload Failed. try again.');
        }
    });
});

$('#subScribeModal button').click(function() {
    var firstname = $('#subScribeModal #firstname').val();
    var lastname = $('#subScribeModal #lastname').val();
    var email = $('#subScribeModal #email').val();
    if (firstname=='' || lastname == '' || email == '') {
        alert('Subscribe values is not valid. Please input your information.');
        return;
    }
    $(".notification-pane").show();
    $.ajax({
        url : '/subscribe',
        type : 'POST',
        data : {firstname, lastname, email},
        success : function(data) {
            $('#subScribeModal').hide();
            $(".notification-pane").hide();
            $('#subScribeModalBack').hide();
        },
        error: function(data){
            $('#subScribeModal').hide();
            $(".notification-pane").hide();
            $('#subScribeModalBack').hide();
        }
    });
})

$('#AdminTabDiv button').click(function() {
    if( $(this).hasClass('IsActive') ) return;
    $('#AdminTabDiv button').removeClass('IsActive');
    $(this).addClass('IsActive');

    $('#UploadMainContent > div').hide();
    if ($(this).data('idx') == '2') {$('#adminTab2').show();$('#nav-savedColorsTab').hide();$('#MainContentLeftPane').attr('style','width: 100%')}
    else if ($(this).data('idx') == '1') {$('#adminTab1').show();$('#nav-savedColorsTab').hide();$('#MainContentLeftPane').attr('style', 'width: 100%')}
    else {$('#adminTab3').show();$('#nav-savedColorsTab').show();$('#MainContentLeftPane').attr('style', '')}
});

function toggleColorTab(idx) {
    $('#colorTab3 > div').hide();
    $('#ColorFamilyColorsList > div').hide();
    if (idx == '2') {$('.ColorItem[data-subtype="2"]').show();}
    else if (idx == '1') {$('.ColorItem[data-subtype="1"]').show();}
    else if (idx == '3') {$('.ColorItem[data-subtype="3"]').show();}
    else if (idx == '4') {$('.ColorItem[data-subtype="4"]').show();}
    else if (idx == '5') {$('.ColorItem[data-subtype="5"]').show();}
    else {$('.ColorItem[data-subtype="6"]').show();}
}

if ($(location).attr('href').indexOf('families') != -1) toggleColorTab('1');
else toggleColorTab('5');

$('#ColorTabDiv button').click(function() {
    if( $(this).hasClass('IsActive') ) return;
    $('#ColorTabDiv button').removeClass('IsActive');
    $(this).addClass('IsActive');
    toggleColorTab($(this).data('idx'));
});

$('#PaletteTabDiv button').click(function() {
    if( $(this).hasClass('IsActive') ) return;
    $('#PaletteTabDiv button').removeClass('IsActive');
    $(this).addClass('IsActive');
    toggleColorTab($(this).data('idx'));
});

$('#ThumbnailChooser .TiltTextUpdateBtn').click(function() {
    // console.log($(this).closest('.TileItem').find('input').val());
    $(".notification-pane").show();
    $.ajax({
        url : '/libraryTitleUpdate',
        type : 'POST',
        data : {
            index: $(this).closest('.TileItem').find('#TileCell').data('thm'),
            value: $(this).closest('.TileItem').find('.TileText').val()
        },
        success : function(data) {

            $(".notification-pane").hide();
        },
        error: function(data){

            $(".notification-pane").hide();
        }
    });
});

$('#ThumbnailChooser .TiltDescUpdateBtn').click(function() {
    // console.log($(this).closest('.TileItem').find('input').val());
    $(".notification-pane").show();
    $.ajax({
        url : '/libraryDescUpdate',
        type : 'POST',
        data : {
            index: $(this).closest('.TileItem').find('#TileCell').data('thm'),
            value: $(this).closest('.TileItem').find('.TileDesc').val()
        },
        success : function(data) {

            $(".notification-pane").hide();
        },
        error: function(data){

            $(".notification-pane").hide();
        }
    });
});

$('#UploadProductTypeContainer .UploadCheckBox').click(function() {
    $('.UploadCheckBox').removeClass('UploadCheckBoxChecked');
    $('.UploadCheckBox').addClass('UploadCheckBoxUnchecked');
    $(this).addClass('UploadCheckBoxChecked');
    $(this).removeClass('UploadCheckBoxUnchecked');
});

$('body').on('click', '.UserTableDeleteBtn', function(){
    var btn = $(this);
    var email = btn.closest('td').data('email');
    $(".notification-pane").show();
    $.ajax({
        url : '/deleteUserInfo',
        type : 'POST',
        data : {email},
        success : function(data) {
            btn.closest('tr').remove();
            $(".notification-pane").hide();
        },
        error: function(data){
            alert('Could not delete customer info. Email is not exist!');
            $(".notification-pane").hide();
        }
    });
});

$('.SubscribeModalCloseBtn').click(function() {
    $('#subScribeModal').hide();
    $('#subScribeModalBack').hide();
})
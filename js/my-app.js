var myApp = new Framework7();

var mainView = myApp.addView('.view-main', {
  dynamicNavbar: true
});

AV.initialize("gosiknzn1db4o6sdlzjo2ozq17sqhyfl1wdomipneda90bbo", "x6zak5uxsty6jatbxx46al0rfsulj2lxntwpgh5125qr63j5");

$(document).ready(function(){

  FastClick.attach(document.body);

  function initPage(){
    //location.reload();
    $("a").removeClass("active");
    $("input").val(null);
    $("#buttonUpload span").show();
    $("#buttonUpload img").hide();
    $("#price a").on('click', moveToolbar);
    $("#buttonUpload").addClass('button button-big button-camera');
    $("#buttonUpload").removeClass('preview');
  }

  function isiOSDevice(){
    return !!(navigator.userAgent.match(/(iPod|iPhone|iPad)/));
  }

  function isCanvasSupported(){
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
  }

  function getPrice(){
    return $("#price .button.active").data("price");
  }

  function getFeatures(){
    return AV._.toArray(
      $("#feature .button.active").map(function(){
      return $(this).data("feature");
    }));
  }

  function getPhotoFile(){
    var fileUpload = $("#fileUpload")[0];
    if (fileUpload.files.length > 0) {
      var name = "photo.jpg";
      var dataBase64 = $("#imgUpload")[0].src.split(",")[1];
      var avFile = new AV.File(name, { base64: dataBase64 });
      return avFile;
    }
    return null;
  }

  function getName(){
    return $("#textLocation").val() ? $("#textLocation").val() : "";
  }

  function getGeoLocation(){
    navigator.geolocation.getCurrentPosition(function(position){
      $("#hiddenLocation").data("latitude", position.coords.latitude);
      $("#hiddenLocation").data("longitude", position.coords.longitude);
    });
  }

  function getComment(){
    return $("#textComment").val() ? $("#textComment").val() : "";
  }

  $("#buttonSubmit").on('click', function(){
    var price = getPrice();
    var features = getFeatures();
    var photo = getPhotoFile();
    var name = getName();
    var geo = new AV.GeoPoint({
      latitude: $("#hiddenLocation").data("latitude"),
      longitude: $("#hiddenLocation").data("longitude")
    });
    var comment = getComment();

    var Lot = AV.Object.extend("Lot");
    var lot = new Lot();
    lot.set("price", price);
    lot.set("features", {});
    lot.set("features", features);
    if (photo) {
      lot.set("photo", photo);
    }
    lot.set("name", name);
    lot.set("location", geo);
    lot.set("comment", comment);

    $("#toolbar a").text("提交中...")
    lot.save(null, {
      success: function(lot){
        setTimeout(function(){
          $("#toolbar a").text("提交成功")
          lot = null;
          initPage();
          $("#toolbar").animate({
            "bottom": "-=50px"
          }, 1000, function(){
            $("#toolbar a").text("提交")
          });
        }, 1000);
      },
      error: function(lot, error){
        alert('Failed to create new object, with error code: ' + error.description);
      }
    });
  });

  $("#price a").on('click', function(){
    $("#price a").removeClass("active");
    $(this).addClass("active");
  });

  $("#price a").on('click', moveToolbar);

  $("#price a").on('click', getGeoLocation);

  function moveToolbar(){
    $("#price a").off('click', moveToolbar);
    $("#toolbar").animate({
      "bottom": "+=50px"
    }, 1000, function(){
      $("#toolbar").removeClass('beneath');
    });
  }

  $("#feature .required a").on('click', function(){
    if ($(this).hasClass("active")) {
      $("#feature .required a").removeClass("active");
    } else {
      $("#feature .required a").removeClass("active");
      $(this).addClass("active");
    }
  });

  $("#feature .optional a").on('click', function(){
    $(this).toggleClass("active");
  });

  $("#buttonUpload").on('mousedown', function(){
    $(this).addClass("pressed");
  });

  $("#buttonUpload").on('mouseup', function(){
    $(this).removeClass("pressed");
  });

  $("#buttonUpload").on('touchstart', function(){
    $(this).addClass("pressed");
  });

  $("#buttonUpload").on('touchend', function(){
    $(this).removeClass("pressed");
  });

  $("#buttonUpload").on('click', function(){
    $("#fileUpload").click();
  });

  $("#fileUpload").on('change', function(e){
    var file = $("#fileUpload")[0].files[0];
    var mpImg = new MegaPixImage(file);

    var scaledImage = $("#imgUpload")[0];
    if(isiOSDevice()) {
      EXIF.getData(e.target.files[0], function(){
        var orientation = EXIF.getTag(this, "Orientation");
        mpImg.render(scaledImage, { maxWidth: 600, maxHeight: 600, quality: 1.0, orientation: orientation });
      });
    } else {
      mpImg.render(scaledImage, { maxWidth: 600, maxHeight: 600, quality: 1.0 });
    }

    $("#buttonUpload").removeClass('button button-big button-camera')
    $("#buttonUpload span").hide();
    $("#buttonUpload")[0].appendChild(scaledImage);
    $("#buttonUpload").addClass('preview');
    $("#imgUpload").show();
  });

  getGeoLocation();

  $("#buttonSubmit").removeClass('disabled');
});

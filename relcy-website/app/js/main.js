Parse.initialize("IeaYNu3Lg8RCHBiWImtlzZcsdy5VRiQ2IyNav3DT", "BOVnPL62ThrPQZGyCDiADXNtDnKaNCUmx0ZITbya");
var BetaSignup = Parse.Object.extend("BetaSignup");

$(function() {
  $(".early_access").click(function(e) {
    e.preventDefault();
    $("body").animate({
      scrollTop: 0
    });
    $("#hero").addClass("hero-form");
    $("body").addClass("disable-scroll");
    $("#signup form input:first").focus();
  });
  $("#hero a.cancel").click(function() {
    $("#signup form")[0].reset();
    // $("#signup form .phone-group").hide();
    $("#signup form").show();
    $("#errorAlert").hide();
    $("#seccusAlert").hide();
    //validator.resetForm();
    $("#hero").removeClass("hero-form");
    $("body").removeClass("disable-scroll");
  });
  $("#navigation a[href*=#]").click(function(e) {
    e.preventDefault();
    // $("button.navbar-toggle").click();
    var obj = $(this.hash);
    var position = 0;
    if (obj.length > 0) {
      position = obj.position().top - $("#navigation").height();
    }
    $("body").animate({
      scrollTop: position
    });
  });
  // $("#signup form select[name='device']").change(function() {
  // 	if ($(this).val()=="ios") {
  // 		$("#signup form .phone-group").show();
  // 	} else {
  // 		$("#signup form .phone-group").hide();
  // 	}
  // });
  //$("#signup form").submit(function(e) {
  //	e.preventDefault();
  //	if (!$(this).valid()) {
  //		// alert("not valid");
  //		return false;
  //	}
  //	var name = $(this).find("input[name='fullname']").val();
  //	var email = $(this).find("input[name='email']").val();
  //	var phone = $(this).find("input[name='phone']").val();
  //	var device = $(this).find("select[name='device']").val();
  //	var referer = $(this).find("input[name='referer']").val();
  //
  //	var signup = new BetaSignup();
  //	signup.save({
  //		name: name,
  //		email: email,
  //		phone: phone,
  //		device: device,
  //		referer: referer
  //	}).then(function(object) {
  //		$("#signup form").hide();
  //		$("#alert").show();
  //		setTimeout(function() {
  //			$("#hero a.cancel").click();
  //		}, 5000);
  //	});
  //});

  // load proper section via hash

  switch(location.hash) {
    case "#privacy-policy":
      $("#privacy-policy").modal();
      break;
    case "#terms-of-use":
      $("#terms-of-use").modal();
      break;
  }

});

// TRIGGER CLICK ON HERO CANCEL BUTTON WITH ESCAPE KEYPRESS
$(document).keyup(function(e) {
  if (e.keyCode === 27) {
    $(".modal .close").click();
    $("#hero a.cancel").click();
  }
});

// TRANSITION NAVBAR WHEN NEAR TOP
$(window).scroll(function() {
  var top = $(window).height() - $("#navigation").height();
  var scrolled = $(window).scrollTop();
  if (scrolled >= top) {
    $("#navigation").addClass("navbar-fixed-top");
    $("#navigation").removeClass("navbar-float");
  } else {
    $("#navigation").removeClass("navbar-fixed-top");
    $("#navigation").addClass("navbar-float");
  }
});

// SET ACTIVE SECTION ON SCROLL
$(window).scroll(function() {
  var scrolled = $(window).scrollTop();
  var top;
  var section;
  $("#navigation ul li.active").removeClass("active");
  $(".relcy-row").each(function() {
    top = $(this).position().top - $("#navigation").height();
    if (top <= scrolled) {
      section = $(this).attr("id");
      $("#navigation ul li.active").removeClass("active");
      $("#navigation ul li a[href='#"+section+"']").parents("li").addClass("active");
    }
  });
});

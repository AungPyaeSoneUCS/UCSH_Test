(function ($) {
    $.fn.stack_slider = function (options) {
      // Sldier core functions
      $("#slider-next").click(function () {
        var total = $(".intro-slide").length;
        $("#intro-slider .intro-slide:first-child")
          .hide()
          .appendTo("#intro-slider")
          .fadeIn();
        $.each($(".intro-slide"), function (index, dp_item) {
          $(dp_item).attr("data-position", index + 1);
        });
      });
      $("body").on(
        "click",
        "#intro-slider .intro-slide:not(:first-child)",
        function () {
          var get_slide = $(this).attr("data-class");
          console.log(get_slide);
          $("#intro-slider .intro-slide[data-class=" + get_slide + "]")
            .hide()
            .prependTo("#intro-slider")
            .fadeIn();
          $.each($(".intro-slide"), function (index, dp_item) {
            $(dp_item).attr("data-position", index + 1);
          });
        }
      );
      // Drag
      $.fn.swipe = function (callback) {
        var touchDown = false,
          originalPosition = null,
          $el = jQuery(this);
  
        function swipeInfo(event) {
          var x = event.originalEvent.pageX,
            y = event.originalEvent.pageY,
            dx;
  
          dx = x > originalPosition.x ? "right" : "left";
  
          return {
            direction: {
              x: dx
            },
            offset: {
              x: x - originalPosition.x
            }
          };
        }
  
        $el.on("touchstart mousedown", function (event) {
          touchDown = true;
          originalPosition = {
            x: event.originalEvent.pageX,
            y: event.originalEvent.pageY
          };
        });
  
        $el.on("touchend mouseup", function () {
          touchDown = false;
          originalPosition = null;
          flag = true;
        });
  
        $el.on("touchmove mousemove", function (event) {
          if (!touchDown) {
            return;
          }
          var info = swipeInfo(event);
          callback(info.direction, info.offset);
        });
  
        return true;
      };
      // disabel image drag
      $("#slider img").on("dragstart", function (event) {
        event.preventDefault();
      });
      // Slider Methods
      // This is the easiest way to have default options.
      var settings = $.extend(
        {
          // These are the defaults.
          color: "transparent",
          background: "transparent",
          autoPlay: true,
          autoPlaySpeed: 3000,
          dots: true,
          arrows: true,
          drag: true,
          direction: "horizontal"
        },
        options
      );
  
      // dots
      if (settings.dots !== true) {
        $("#dp-dots").hide();
      }
      // drag
      if (settings.drag == true) {
        // trigger next prev on drag
        var flag = true;
        jQuery(".intro-slide").swipe(function (direction, offset) {
          if (offset.x > 30 && flag) {
            flag = false;
            $("#slider-next").click();
          }
          if (offset.x < -30 && flag) {
            flag = false;
            $("#slider-prev").click();
          }
        });
      }
      // arrows
      if (settings.arrows !== true) {
        $("#slider-next, #slider-prev").hide();
      }
      // slider autoplay
      if (settings.autoPlay == true) {
        setInterval(function () {
          $("#slider-next").click();
        }, settings.autoPlaySpeed);
      }
  
      //slider direction
      if (settings.direction == "vertical") {
        $(".slider-wrap").addClass("vertical");
      }
  
      // stack_slider the collection based on the settings variable.
      return this.css({
        color: settings.color,
        background: settings.background
      });
    };
  })(jQuery);
  
  $("#slider").stack_slider({
    autoPlaySpeed: 6000,
    autoPlay: false,
    dots: true,
    arrows: true,
    drag: true,
    direction: "vertical"
  });
  
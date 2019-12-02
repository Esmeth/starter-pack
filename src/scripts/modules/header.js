(function($) {
  "use strict";

  $(document).ready(onDocumentReady);

  /**
   * All functions to be called on $(document).ready() should be in this function
   */
  function onDocumentReady() {
    setTimeout(function() {
      simpleDropDown();
    }, 100);
  }

  function simpleDropDown() {
    var menu_items = $(".header-nav > ul > li");

    menu_items.each(function() {
      var _this = $(this);

      if (_this.find(".sub-menu").length) {
        var dropDownWrapper = _this.find(".sub-menu");

        if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
          _this
            .on("touchstart mouseenter", function() {
              dropDownWrapper.css({
                overflow: "visible",
                visibility: "visible",
                opacity: "1"
              });
            })
            .on("mouseleave", function() {
              dropDownWrapper.css({
                overflow: "hidden",
                visiblity: "hidden",
                opacity: "0"
              });
            });
        } else {
          var config = {
            interval: 0,
            over: function() {
              setTimeout(function() {
                dropDownWrapper.addClass("sub-menu-open");
              }, 150);
            },
            timeout: 150,
            out: function() {
              dropDownWrapper.removeClass("sub-menu-open");
            }
          };

          _this.hoverIntent(config);
        }
      }
    });
  }
})(jQuery);

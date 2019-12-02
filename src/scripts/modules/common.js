(function($) {
  "use strict";

  $(document).ready(onDocumentReady);

  /**
   * All functions to be called on $(document).ready() should be in this function
   */
  function onDocumentReady() {
    var wow = new WOW({
      boxClass: "animate-item",
      animateClass: "is-visible",
      mobile: false
    });

    wow.init();
  }
})(jQuery);

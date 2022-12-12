/** Compatibility API.
 *
 * Copyright 2021 Night Furry
 */
define({
  // Internet Explorer doesn't support ImageData().
  createImageData: function (width, height) {
    var context = document.createElement("canvas").getContext("2d");
    return context.createImageData(width, height);
  }
});

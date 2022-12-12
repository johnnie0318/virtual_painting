/**
 * Canny + Watershed segmentation algorithm.
 *
 *  var segmentation = new WatershedSegmentation(imageData);
 *  var result = segmentation.result;
 *
 *  TODO:
 *  * Edge options other than canny.
 *  * Create a graph-structure for coarse/fine adjustment.
 *
 */
define(["./base"],
function (BaseSegmentation) {
  // Constructor for the segmentation configuration.
  function DetectedSegmentation(imageData) {
    BaseSegmentation.call(this, imageData, {});
    this.width = imageData.width;
    this.height = imageData.height;
    this.imageData = imageData;

    this.neighborMap8 = new NeighborMap(this.imageData.width,
                                        this.imageData.height);
    this.neighborMap4 = new NeighborMap(this.imageData.width,
                                        this.imageData.height,
                                        [[-1, -1],
                                         [-1, 0],
                                         [-1, 1],
                                         [ 0, -1]]);
  }

  DetectedSegmentation.prototype = Object.create(BaseSegmentation.prototype);

  DetectedSegmentation.prototype.diffSquare = function (offset1, offset2) {
    var data = this.imageData.data;
    var diff = 0;
    for ( var i = 0 ; i < 3; i++)
      diff += (data[4 * offset1 + i] - data[4 * offset2 + i]) * (data[4 * offset1 + i] - data[4 * offset2 + i]);
    return diff;
  }

  DetectedSegmentation.prototype.transPosAndOffset = function (src, isPos, w) {
    if (isPos) {
      return (src[1] * w + src[0]);
    } else {
      if ( w == 0 ) return false;
      var pos = [];
      pos.push(src/w);
      pos.push(src%w);
      return pos;
    }
  }

  DetectedSegmentation.prototype.pickPixel = function (offset) {
    if(this.imageData.data.length <= 4 * offset)return false;
    var pix = [];
    for ( var i = 0; i < 4; i++ )
      pix.push(this.imageData.data[4 * offset + i]);
    return pix;
  }

  DetectedSegmentation.prototype.getPoints = function (pos, limit, min) {
    var diff, offset, tolerance = 10, queue = [],
      init_offset = this.transPosAndOffset(pos, true, this.width),
      neighbors = this.neighborMap8.get(init_offset),
      labels = [init_offset];

    if(limit != undefined) tolerance = limit;

    for (var i = 0; i < neighbors.length; i++) {
      diff = this.diffSquare(init_offset, neighbors[i]);
      if(diff <= tolerance) queue.push([diff, neighbors[i]]);
      // console.log(this.pickPixel(neighbors[i]));
    }

    while(queue.length > 0) {
      offset = queue.shift();
      // console.log(offset[0]);
      if(labels.indexOf(offset[1]) != -1) continue;
      // console.log(this.pickPixel(offset[1]));
      labels.push(offset[1]);
      neighbors = this.neighborMap8.get(offset[1]);
      for (var i = 0; i < neighbors.length; i++) {
        // diff = this.diffSquare(init_offset, neighbors[i]);
        // if(diff > tolerance+15) continue;
        diff = this.diffSquare(offset[1], neighbors[i]);
        if(diff <= tolerance) queue.push([diff, neighbors[i]]);
      }
    }

    return this._relabel(labels, min ? min : 5);
  };

  DetectedSegmentation.prototype.getNeighbors = function (offset) {
    return this.neighborMap8.get(offset);
  };

  DetectedSegmentation.prototype._relabel = function (labels, min) {
    // console.log(labels.length);
    var uniqueArray = [], tmp, array = labels;
    for (var i = 0; i < array.length; ++i)
      for (var j = i + 1; j < array.length; ++j)
        if (array[i] > array[j]) {
          tmp = array[i];
          array[i] = array[j];
          array[j] = tmp;
        }
    // console.log(array);
    var y_buf;
    for (var i = 0; i < array.length - 1; ++i) {
      uniqueArray.push(array[i]);

      // x axis corrections
      if (array[i + 1] - array[i] <= min && array[i + 1] - array[i] > 1)
        for (var j = array[i] + 1; j < array[i + 1]; ++j)
          uniqueArray.push(j)
          ;

      // y axis corrections
      if (array.indexOf(array[i] + this.width) == -1)
        for ( var j = 2; j <= min; ++j) {
          y_buf = array[i] + j * this.width;
          if(array.indexOf(y_buf) != -1) {
            for ( var k = j - 1; k >= 1; k--)
              uniqueArray.push(array[i] + k * this.width);
            break;
          }
        }
    }
    // console.log(uniqueArray);
    return uniqueArray;
  };

  // Neighbor Map.
  function NeighborMap(width, height, neighbors) {
    this.neighbors = neighbors || [[-1, -1], [-1, 0], [-1, 1],
                                   [ 0, -1],          [ 0, 1],
                                   [ 1, -1], [ 1, 0], [ 1, 1]];
    this.maps = [];
    for (var k = 0; k < this.neighbors.length; ++k) {
      var dy = this.neighbors[k][0],
          dx = this.neighbors[k][1],
          map = new Int32Array(width * height);
      for (var y = 0; y < height; ++y) {
        for (var x = 0; x < width; ++x) {
          var Y = y + dy,
              X = x + dx;
          map[y * width + x] = (Y < 0 || height <= Y || X < 0 || width <= X) ?
                               -1 : Y * width + X;
        }
      }
      this.maps.push(map);
    }
  }

  NeighborMap.prototype.get = function (offset) {
    var neighborOffsets = [];
    for (var k = 0; k < this.neighbors.length; ++k) {
      var neighborOffset = this.maps[k][offset];
      if (neighborOffset >= 0)
        neighborOffsets.push(neighborOffset);
    }
    return neighborOffsets;
  };


  return DetectedSegmentation;
});

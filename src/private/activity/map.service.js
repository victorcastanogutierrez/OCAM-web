(function () {
"use strict";

angular.module('private')
.service('mapService', mapService);

/**
  Servicio encargado de retornar todos los tipos de mapa posibles
*/
mapService.$inject =[];
function mapService() {

  var service = this;

  service.getOverlayFn = function(size, map) {
    return {
      tileSize: size,
      getTile: function(coord, zoom, ownerDocument) {
          var n = Math.pow(2, zoom);
          var longitudeMin = coord.x/n * 360 -180;
          var lat_rad = Math.atan(Math.sinh(Math.PI * (1 - 2 * coord.y/n)));
          var latitudeMin = lat_rad * 180/Math.PI;

          var longitudeMax = (coord.x + 1)/n * 360 -180;
          lat_rad = Math.atan(Math.sinh(Math.PI * (1 - 2 * (coord.y + 1)/n)));
          var latitudeMax = lat_rad * 180/Math.PI;

          var metersPerPixel = 156543.03392 * Math.cos(map.getCenter().lat() * Math.PI / 180) / Math.pow(2, zoom);
          var coordsLabel = document.getElementById("btDistance");
          coordsLabel.innerHTML = "Distancia entre vértices: "+(metersPerPixel*this.tileSize.width).toFixed(3)+"m";

          var div = ownerDocument.createElement('div');
          div.innerHTML = latitudeMin.toFixed(7)+", "+longitudeMin.toFixed(7);
          div.style.width = this.tileSize.width + 'px';
          div.style.height = this.tileSize.height + 'px';
          div.style.fontSize = '10';
          div.style.borderStyle = 'solid';
          div.style.borderWidth = '1px';
          div.style.borderColor = '#AAAAAA';
          return div;
      }
    };
  };

  service.getOSM = function() {
    return new google.maps.ImageMapType({
      getTileUrl: function(coord, zoom) {
        var tilesPerGlobe = 1 << zoom;
        var x = coord.x % tilesPerGlobe;
        if (x < 0) {
            x = tilesPerGlobe+x;
        }
        return "https://tile.openstreetmap.org/" + zoom + "/" + x + "/" + coord.y + ".png";
      },
      tileSize: new google.maps.Size(256, 256),
      name: "OSM",
      maxZoom: 19
    });
  };

  service.getPNOAIGN = function(projection) {
    return new google.maps.ImageMapType({
        getTileUrl: function (tile, zoom) {
          var zpow = Math.pow(2, zoom);
          var ul = new google.maps.Point(tile.x * 256.0 / zpow, (tile.y + 1) * 256.0 / zpow);
          var lr = new google.maps.Point((tile.x + 1) * 256.0 / zpow, (tile.y) * 256.0 / zpow);
          var ulw = projection.fromPointToLatLng(ul);
          var lrw = projection.fromPointToLatLng(lr);

          var bbox = ulw.lat() + "," + ulw.lng() + "," + lrw.lat() + "," + lrw.lng();
          var url = "https://www.ign.es/wms-inspire/pnoa-ma?request=GetMap&service=WMS&VERSION=1.3.0&LAYERS=OI.OrthoimageCoverage";
          return url+"&STYLES=&FORMAT=image/png&BGCOLOR=0xFFFFFF&TRANSPARENT=TRUE&CRS=EPSG:4326&WIDTH=250&HEIGHT=250&BBOX=" + bbox;
        },
        isPng: false,
        maxZoom: 20,
        minZoom: 1,
        name: 'PNOA',
        tileSize: new google.maps.Size(256, 256)
    });
  };

  service.getRaster = function(projection) {
    return new google.maps.ImageMapType({
        getTileUrl: function (tile, zoom) {
          var zpow = Math.pow(2, zoom);
          var ul = new google.maps.Point(tile.x * 256.0 / zpow, (tile.y + 1) * 256.0 / zpow);
          var lr = new google.maps.Point((tile.x + 1) * 256.0 / zpow, (tile.y) * 256.0 / zpow);
          var ulw = fromPointToLatLng(ul);
          var lrw = fromPointToLatLng(lr);

          var bbox = ulw.lat() + "," + ulw.lng() + "," + lrw.lat() + "," + lrw.lng();
          var url = "https://www.ign.es/wms-inspire/mapa-raster?request=GetMap&service=WMS&VERSION=1.3.0&LAYERS=mtn_rasterizado";
          return url+"&STYLES=&FORMAT=image/png&BGCOLOR=0xFFFFFF&TRANSPARENT=TRUE&CRS=EPSG:4326&WIDTH=250&HEIGHT=250&BBOX=" + bbox;
        },
        isPng: false,
        maxZoom: 20,
        minZoom: 1,
        name: 'Raster',
        tileSize: new google.maps.Size(256, 256)
    });
  };

  service.getRasterFrance = function(projection) {
    return new google.maps.ImageMapType({
      getTileUrl: function (tile, zoom) {
        var zpow = Math.pow(2, zoom);
        var ul = new google.maps.Point(tile.x * 256.0 / zpow, (tile.y + 1) * 256.0 / zpow);
        var lr = new google.maps.Point((tile.x + 1) * 256.0 / zpow, (tile.y) * 256.0 / zpow);
        var ulw = fromPointToLatLng(ul);
        var lrw = fromPointToLatLng(lr);

        var bbox = ulw.lng() + "," + ulw.lat() + "," + lrw.lng() + "," + lrw.lat();
        var url = "https://mapsref.brgm.fr/WMS-C-REF/?request=GetMap&service=WMS&VERSION=1.1.1&LAYERS=REF93";
        return url+"&STYLES=&FORMAT=image/png&BGCOLOR=0xFFFFFF&TRANSPARENT=TRUE&SRS=EPSG:4326&WIDTH=250&HEIGHT=250&BBOX=" + bbox + "&WIDTH=256&HEIGHT=256";
      },
      isPng: false,
      maxZoom: 20,
      minZoom: 1,
      name: 'Raster Francia',
      tileSize: new google.maps.Size(256, 256)
    });
  };

  var fromPointToLatLng = function(point) {
    var lng = point.x / 256 * 360 - 180;
    var n = Math.PI - 2 * Math.PI * point.y / 256;
    var lat = (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));
    return new google.maps.LatLng(lat, lng);
  };
}
})();

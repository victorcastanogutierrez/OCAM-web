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

  service.getMapTypes = function() {
    return [
      {
        id: 0,
        name: "Google"
      },
      {
        id: 1,
        name: "OSM",
        mapType: service.getOSM
      },
      {
        id: 2,
        name: "PNOA IGN",
        mapType: service.getPNOAIGN
      },
      {
        id: 3,
        name: "Grid",
        mapType: service.getSquaresType
      },
      {
        id: 4,
        name: "Raster",
        mapType: service.getRaster
      }
    ];
  };

  service.getOSM = function() {
    return {
      getTileUrl: function(coord, zoom) {
        var tilesPerGlobe = 1 << zoom;
        var x = coord.x % tilesPerGlobe;
        if (x < 0) {
            x = tilesPerGlobe+x;
        }
        return "http://tile.openstreetmap.org/" + zoom + "/" + x + "/" + coord.y + ".png";
      },
      tileSize: new google.maps.Size(256, 256),
      name: "OSM",
      maxZoom: 16
    };
  };

  service.getPNOAIGN = function() {
    return {
      alt: "WMTS del PNOA",
      getTileUrl: function(tile, zoom) {
      var url = "http://www.ign.es/wmts/pnoama?request=getTile&layer=OI.OrthoimageCoverage&TileMatrixSet=GoogleMapsCompatible&TileMatrix=" + zoom + "&TileCol=" + tile.x + "&TileRow=" + tile.y + "&format=image/jpeg";
      return url;
      },
      maxZoom: 20,
      minZoom: 1,
      name: "PNOA",
      tileSize: new google.maps.Size(256, 256)
    };
  };

  service.getRaster = function() {
    return {
      alt: "RasterIGN",
      getTileUrl: function(tile, zoom) {
        var url = "http://www.ign.es/wmts/maparaster?request=getTile&layer=MTN&TileMatrixSet=GoogleMapsCompatible&TileMatrix="
        + zoom
        + "&TileCol=" + tile.x + "&TileRow=" + tile.y + "&format=image/jpeg";
         return url;
       },
       isPng: false,
       maxZoom: 20,
       minZoom: 1,
       name: "Raster IGN",
       tileSize: new google.maps.Size(256, 256)
     };
   }
}
})();

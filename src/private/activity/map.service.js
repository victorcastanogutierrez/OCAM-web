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
      }
    ];
  };

  service.getSquaresType = function() {
    return {
      getTile: function(coord, zoom, ownerDocument) {
        var div = ownerDocument.createElement('div');
        div.innerHTML = coord;
        div.style.width = this.tileSize.width + 'px';
        div.style.height = this.tileSize.height + 'px';
        div.style.fontSize = '10';
        div.style.borderStyle = 'solid';
        div.style.borderWidth = '1px';
        div.style.borderColor = '#AAAAAA';
        return div;
      },
      tileSize: new google.maps.Size(256, 256),
      name: 'Black Squares',
      maxZoom: 16,
    };
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
      name: "OpenStreetMap",
      maxZoom: 16
    };
  };

  service.getPNOAIGN = function() {
    return {
      getTileUrl: function(coord, zoom) {
        var tilesPerGlobe = 1 << zoom;
        var x = coord.x % tilesPerGlobe;
        if (x < 0) {
            x = tilesPerGlobe+x;
        }
        return "https://wxs.ign.fr/CLEF/geoportail/wmts?" +
         "&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0" +
         "&STYLE=normal" +
         "&TILEMATRIXSET=PM" +
         "&FORMAT=image/jpeg"+
         "&LAYER=ORTHOIMAGERY.ORTHOPHOTOS"+
         "&TILEMATRIX=" + zoom +
         "&TILEROW=" + coord.y +
         "&TILECOL=" + x;
      },
      tileSize: new google.maps.Size(256, 256),
      name: "OpenStreetMap",
      maxZoom: 16
    };
  };
}
})();

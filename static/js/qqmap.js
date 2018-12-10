var markerIndex = 0;
var map;

function $(a) {
    return document.getElementById(a);
}
 var data = [
            [30.61454, 104.113708],
            [30.66454, 104.153708],
            //[39.98296, 116.30676]
        ];
window.init = function() {

    var Map = qq.maps.Map;
    var Marker = qq.maps.Marker;
    var LatLng = qq.maps.LatLng;
    var Event = qq.maps.event;

    var MarkerImage = qq.maps.MarkerImage;
    var MarkerShape = qq.maps.MarkerShape;
    var MarkerAnimation = qq.maps.MarkerAnimation;
    var Point = qq.maps.Point;
    var Size = qq.maps.Size;
    var ALIGN = qq.maps.ALIGN;

    var MVCArray = qq.maps.MVCArray;
    var MarkerCluster = qq.maps.MarkerCluster;
    var Cluster = qq.maps.Cluster;
    var MarkerDecoration = qq.maps.MarkerDecoration;

    var forEach = function (array, fun) {
        for (var i = 0, l = array.length; i < l; ++i) {
            if (fun(array[i], i) === false) {
                return false;
            }
        }
    };

    var latlng = new LatLng(30.61454,104.113708);
    var options = {
        'zoom':11,
        'center':latlng,
        'mapTypeId': "roadmap",
        'zoomControl': false,
        'disableDefaultUI': true
    };

    //获取城市列表接口设置中心点
    citylocation = new qq.maps.CityService({
        complete: function (result) {
            map.setCenter(result.detail.latLng);
        }
    });
    citylocation.searchLocalCity();

    var map = new Map($('container'), options);

    var markers = new MVCArray();
    var markerCluster;

    function createCluster() {
        for (var i = 0; i < data.length; i++) {
            var latLng = new LatLng(data[i][0], data[i][1]);
            var decoration = new MarkerDecoration(i, new Point(0, -5));
            var marker = new Marker({
                'position':latLng,
                map:map
            });
            markers.push(marker);
        }

        markerClusterer = new MarkerCluster({
            map:map,
            minimumClusterSize:2, //默认2
            markers:markers,
            zoomOnClick:true, //默认为true
            gridSize:30, //默认60
            averageCenter:true, //默认false
            maxZoom: 18, //默认18
        });

        Event.addListener(markerClusterer, 'clusterclick', function (evt) {
            // writeLog("mouse event", eventType);
            var ss =  evt;
            // alert('点击了聚合点');
        });
    };

    createCluster();

    var maker_add;

    function addMarker(index) {
        var latLng = new LatLng(39.849558,116.406893);
        var decoration = new MarkerDecoration(index, new Point(0, -5));
        maker_add = new Marker({
            'position':latLng,
            decoration:decoration,
            map:map
        });
        markers.push(maker_add);

        markerClusterer.addMarker(maker_add);
    }

    var markers_add = [];

    function addMarkers() {
        var bounds = map.getBounds();
        var sw = bounds.getSouthWest();
        var ne = bounds.getNorthEast();
        var lngSpan = Math.abs(sw.getLng() - ne.getLng());
        var latSpan = Math.abs(ne.getLat() - sw.getLat());
        for (var i=0; i < 100; i++) {
            var position = new qq.maps.LatLng(ne.getLat() - latSpan*(Math.random()*0.95), sw.getLng() + lngSpan*(Math.random()*0.95));
            
            var decoration = new MarkerDecoration(i, new Point(0, -5));
            var makeradd = new Marker({
                'position':position,
                decoration:decoration,
                map:map
            });
            markers_add.push(makeradd);
        }
        
        markerClusterer.addMarkers(markers_add);
    }
}
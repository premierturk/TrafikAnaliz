const dialog = require('electron').remote.dialog
const { app } = require('electron');
var ffmpeg = require('ffmpeg');
const path = require('path');
const { spawn } = require('child_process');
var cmd=require('node-cmd');



$(function () {


    var map = L.map('image-map', {
        minZoom: 0,
        maxZoom: 4,
        center: [0, 0],
        zoom: 1,
        crs: L.CRS.Simple,
    });


    var w = 5312, h = 4880, url = 'https://www.isu.gov.tr/media/cover/72.jpg';


    var southWest = map.unproject([0, h], map.getMaxZoom() - 1);
    var northEast = map.unproject([w, 0], map.getMaxZoom() - 1);
    var bounds = new L.LatLngBounds(southWest, northEast);


    var overlay = L.imageOverlay(url, bounds)
    overlay.addTo(map);


    map.setMaxBounds(bounds);

    map.on("click", function (e) {
        // calculateImageCoordinate(e.latlng);


        var clientLatLng = map.project(e.latlng);
        var overlayImage = overlay._image;

        var yR = overlayImage.clientHeight / overlayImage.naturalHeight;
        var xR = overlayImage.clientWidth / overlayImage.naturalWidth;

        var x = clientLatLng.x / xR;
        var y = clientLatLng.y / yR;
        console.log("CLICK : " + x, y);


    });


    let editableLayers = new L.FeatureGroup();

    map.addLayer(editableLayers);

    let drawControl = new L.Control.Draw({
        position: "topright",
        draw: {
            polyline: false,
            polygon: true,
            circle: false,
            circlemarker: false,
            rectangle: false,
            marker: false
        },
        edit: {
            featureGroup: editableLayers,
            remove: true
        }
    });

    map.addControl(drawControl);


    map.on(L.Draw.Event.CREATED, function (e) {
        let layer = e.layer;
        editableLayers.addLayer(layer);


        console.log("ORGINAL");
        var latLng = layer.getLatLngs()[0];
        latLng.forEach(lat_lng => {
            var result = calculateImageCoordinate(lat_lng);
        });
        console.log("ORGINAL");


    });

    var calculateImageCoordinate = function (latLng) {

        var clientLatLng = map.project(latLng);
        var overlayImage = overlay._image;

        var yR = overlayImage.clientHeight / overlayImage.naturalHeight;
        var xR = overlayImage.clientWidth / overlayImage.naturalWidth;

        var x = clientLatLng.x / xR;
        var y = clientLatLng.y / yR;
        console.log(x, y);
        return [x, y];

    }


    $("#btnBrows").click(function () {


        var dia = dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
                { name: "Video", extensions: ['avi'] },
                { name: "Deneme", extensions: ['txt'] }
            ]
        });

        console.log(dia);

        var video_file = dia[0];
        //__dirname



     
        var args = [
            '-y',
            '-i', "C:/Users/bbekec/Desktop/file_example_AVI_1280_1_5MG.avi",
            '-frames', '1', 'c:/app/deneme.jpg'
        ];
        var proc = spawn('ffmpeg', args);




    });


});

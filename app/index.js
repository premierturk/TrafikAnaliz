const dialog = require('electron').remote.dialog
const { app } = require('electron');
var ffmpeg = require('ffmpeg');
const path = require('path');
const { spawn } = require('child_process');
var cmd = require('node-cmd');
const extractFrame = require('ffmpeg-extract-frame');
const fs = require('fs');
var sizeOf = require('image-size');
var ffmpeg = require('fluent-ffmpeg');


ffmpeg.setFfmpegPath("/usr/bin/ffmpeg");
ffmpeg.setFfprobePath("/usr/bin/ffprobe");


$(function () {




    var map = function (url, w, h) {


        var map = L.map('image-map', {
            minZoom: 1,
            maxZoom: 4,
            center: [0, 0],
            zoom: 1,
            crs: L.CRS.Simple,
        });


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
    }


    $("#btnBrows").click(async function () {

        var folder = path.join(__dirname, 'roi');
        var savedFile = folder + '/tn.png';

        try {
            fs.unlinkSync(savedFile);
        } catch (err) {
            console.error(err)
        }

        var dia = dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
                { name: "Video", extensions: ['avi'] }
            ]
        });
        var video_file = dia[0];

        // var args = [
        //     '-y',
        //     '-i', video_file,// "C:/Users/bbekec/Desktop/file_example_AVI_1280_1_5MG.avi",
        //     '-frames', '1', savedFile
        // ];

        // const child = spawn('ffmpeg', args);

        // setTimeout(function(){
        //    map(savedFile); 
        // }, 1000);


        // await extractFrame({
        //     input: video_file,
        //     output: savedFile,
        //     offset: 1000
        // });

        ffmpeg(video_file)
            .on('end', function () {
                console.log('Screenshots taken');
            })
            .on('error', function (err) {
                console.error('this error:');
                console.error(err);
            }).screenshots({
                count: 1,
                folder: folder
            });

        setTimeout(function () {
            var dimensions = sizeOf(savedFile);
            map(savedFile, dimensions.width, dimensions.height);
        }, 2000);



    });




});

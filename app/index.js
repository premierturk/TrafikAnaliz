const dialog = require('electron').remote.dialog
const { app, shell } = require('electron');
var ffmpeg = require('ffmpeg');
const path = require('path');
const { spawn } = require('child_process');
var cmd = require('node-cmd');
//const extractFrame = require('ffmpeg-extract-frame');
const fs = require('fs');
var sizeOf = require('image-size');
var ffmpeg = require('fluent-ffmpeg');
const process = require('process');
const { Loading } = require('notiflix/build/notiflix-loading-aio');
const { Confirm } = require('notiflix/build/notiflix-confirm-aio');
var ffprobe = require('ffprobe'), ffprobeStatic = require('ffprobe-static');
var moment = require('moment');
const remote = require('electron').remote;




if (process.platform == "linux") {
    ffmpeg.setFfmpegPath("/usr/bin/ffmpeg");
    ffmpeg.setFfprobePath("/usr/bin/ffprobe");
}

$(function () {


    $("#btnRapor").hide();


    var AllLoops = [];
    var videoTime = "";
    var videoDuration="";

    var map = function (url, w, h) {

        var map = L.map('image-map', {
            minZoom: 2,
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
            var newCoordinates = [];
            var latLng = layer.getLatLngs()[0];
            latLng.forEach(lat_lng => {
                var result = calculateImageCoordinate(lat_lng);
                console.log(result);
                newCoordinates.push(result);
            });
            console.log("ORGINAL");



            requestName(function (s) {
                var loopName = s;


                requestYT(function (isYatay) {

                    if (isYatay) {

                        var data = {
                            Id: loopName,
                            X: 1,
                            Y: 0,
                            Time: videoTime,
                            Points: newCoordinates
                        }

                        AllLoops.push(data);

                    } else {

                        var data = {
                            Id: loopName,
                            X: 0,
                            Y: 1,
                            Time: videoTime,
                            Points: newCoordinates
                        }

                        AllLoops.push(data);
                    }
                });

            });


        });


        var requestYT = function (result) {


            setTimeout(function () {
                Confirm.show(
                    'Yatay/Dikey',
                    'Çizilen loop araçları.....?',
                    'Yatay',
                    'Dikey',
                    function okCb() {
                        result(true);
                    },
                    function cancelCb() {
                        result(false);
                    },

                );
            }, 1000);



        }



        var requestName = function (result) {

            Confirm.prompt(
                'Loop Name',
                'Cizilen Loop isim veriniz?',
                '',
                'Tamam',
                'İptal',
                function okCb(clientAnswer) {
                    console.log('Client answer is: ' + clientAnswer);
                    result(clientAnswer);
                },
                function cancelCb(clientAnswer) {
                    console.log('Client answer was: ' + clientAnswer);
                }
            );

        }



        var calculateImageCoordinate = function (latLng) {

            var clientLatLng = map.project(latLng);
            var overlayImage = overlay._image;

            var yR = overlayImage.clientHeight / overlayImage.naturalHeight;
            var xR = overlayImage.clientWidth / overlayImage.naturalWidth;

            var x = clientLatLng.x / xR;
            var y = clientLatLng.y / yR;

            return [x, y];

        }

        $("#btnRapor").click(async function () {
            
            var from_epoch = moment(videoTime).valueOf();
            var to_epoch = moment(videoTime).add(parseInt(videoDuration+1), 'seconds').valueOf();

            var data = {
                From_Time: from_epoch,
                To_Time: to_epoch,
                Data: AllLoops
            }

            console.log(JSON.stringify(data));

            var url_total = "http://31.145.105.240:3000/d/QkVW61x7z/akiilikavsak_total?orgId=1&from=" + from_epoch + "&to="  + to_epoch+ "&kiosk"
            var url_root = "http://31.145.105.240:3000/d/uCc9qaxnz/akillikavsak_root?orgId=1&from=" + from_epoch + "&to=" + to_epoch + "&kiosk"

            // shell.openExternal(url_total);
            // shell.openExternal(url_root);


            
            const BrowserWindow = remote.BrowserWindow;
            const win_total = new BrowserWindow({
                height: 768,
                width: 1024
            });

            const win_root = new BrowserWindow({
                height: 768,
                width: 1024
            });

            win_total.loadURL(url_total);
            win_root.loadURL(url_root);


        });

    }

    var requestDateTime = function (result) {


        var date = moment().format('DD.MM.YYYY HH:mm');


        Confirm.prompt(
            'Video tarihi',
            'Video Tarih ve saatini giriniz',
            date,
            'Tamam',
            'İptal',
            function okCb(clientAnswer) {
                console.log('Client answer is: ' + clientAnswer);
                result(clientAnswer);
            },
            function cancelCb(clientAnswer) {
                console.log('Client answer was: ' + clientAnswer);
            }
        );

    }


    $("#btnBrows").click(async function () {

        requestDateTime(function (time) {
            videoTime = time;

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
                    { name: "Video", extensions: ['avi', 'mp4'] }
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

            Loading.standard('Video yükleniyor. Lütfen bekleyiniz...');




            ffprobe(video_file, { path: ffprobeStatic.path }, function (err, info) {
                if (err) return done(err);
                console.log(info);     
                
                videoDuration = info.streams[0].duration;

              });



            ffmpeg(video_file)
                .on('end', function () {
                    console.log('Screenshots taken');

                    $("#btnBrows").hide();

                    var dimensions = sizeOf(savedFile);
                    map(savedFile, dimensions.width, dimensions.height);


                    Loading.remove();

                    $("#btnRapor").show();

                })
                .on('progress', function (e) {
                    console.log(e);
                })
                .on('error', function (err) {
                    console.error('this error:');
                    console.error(err);
                }).screenshots({
                    count: 1,
                    folder: folder
                });

        });







    });




});

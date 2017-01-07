function initMap() {
//get locations
  var locations = get_locations();

  var clicked_icon = {
    url: 'styles/clicked_icon1.png',
    scaledSize: new google.maps.Size(50, 50), // scaled size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor
  };
  var unclick_icon = {
    url: 'styles/unclick_icon1.png',
    scaledSize: new google.maps.Size(50, 50), // scaled size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor
  };
  var markers = []
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 16,
    disableDefaultUI: true,
    //scrollwheel: false,
    center: {lat: 25.0130679, lng: 121.5416515}
  });


//search box
  var input = document.getElementById('pac-input');
  var search_box = document.getElementById('searchbox');
  // var searchBox = new google.maps.places.SearchBox(input);
  // map.controls[google.maps.ControlPosition.TOP_LEFT].push(search_box);



  var infowindow = new google.maps.InfoWindow();

 if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infowindow.setPosition(pos);
      infowindow.setContent('Location found.');
      map.setCenter(pos);

    }, function() {
      handleLocationError(true, infowindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infowindow, map.getCenter());
  }

  var marker , i;
  for (var key in locations) {
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(parseFloat(locations[key].lat),parseFloat(locations[key].lng)),
      id: key,
      icon: unclick_icon,
      map: map
    });
    markers.push(marker);
    google.maps.event.addListener(marker, 'click' , (function(marker,i){
      return function(){
        $.ajax({
          method : 'get',
          url : '/api/get_info',
          data : {
            location_id : marker.id,
          },
          success : function(response) {
            var time_index = 0;
            $('#content').show();
            $('#location_name').text(locations[marker.id].sname);
            $('#location_addr').text(response['station_info'].addr);
            $('.total_bike').text("/"+response['station_info'].total+"台");
            $('.avaliable_bike').text(response['current'].count);
            $('.weather_value').text(response['current'].temp+"°C");
            switch(response['current'].status) {
              case 'Overcast':
              case 'Mostly Cloudy':
                  $('.weather_img > img').attr('src' , 'styles/mostly_cloudy.png')
              break;
              case 'Heavy Rain Showers':
              case 'Light Drizzle':
              case 'Rain':
              case 'Rain Showers':
              case 'Light Rain Showers':
                $('.weather_img > img').attr('src' , 'styles/raining.png')
              break;
              case 'Partly Cloudy':
              case 'Scattered Clouds':
                $('.weather_img > img').attr('src' , 'styles/scatterd_clouds.png')
              break;
              case 'Light Thunderstorms and Rain':
              case 'Heavy Thunderstorms and Rain':
              case 'Thunderstorm':
              case 'Thunderstorms and Rain':
                $('.weather_img > img').attr('src' , 'styles/thunderstorm.png')
              break;
              default:
                  $('.weather_img > img').attr('src' , 'styles/blank_sunny.png')
            }
            if(response['current'].count < 5){
                $('.bike_img > img').attr('src','styles/cond_bad.png')
              }else if(response['current'].count < 15){
                $('.bike_img > img').attr('src','styles/cond_mid.png')
              }else{
                $('.bike_img > img').attr('src','styles/cond_good.png')
            }


            for (var j = 0; j < markers.length; j++) {
              markers[j].setIcon(unclick_icon);
            }
            marker.setIcon(clicked_icon);
            $('#range').data('clock','mins');
              var slider = $("#range").data("ionRangeSlider");
                slider.update({
                  min: 0,
                  max: 60,
                  postfix: " 分鐘後",
                  from: 0,
                  step: 5,
                });
            $("#range").off("change");
            $("#range").on("change", function () {
              from = $(this).data("from");
              $('.avaliable_bike').text(response['predict_info'][(from/5)].count);
              $('.datetime').text(moment(response['time_now']).add(from,'minutes').calendar());
              if(response['predict_info'][(from/5)].count < 5){
                $('.bike_img > img').attr('src','styles/cond_bad.png')
              }else if(response['predict_info'][(from/5)].count < 15){
                $('.bike_img > img').attr('src','styles/cond_mid.png')
              }else{
                $('.bike_img > img').attr('src','styles/cond_good.png')
              }
            });


            //切換小時分鐘
            $('.mins').on('click',function(){
              time_index = $('#range').data("from")*12;
              console.log(time_index);
              $('.hurs').removeClass('tabe_active');
              $(this).addClass('tabe_active');
              $('#range').data('clock','mins');
              var slider = $("#range").data("ionRangeSlider");
                slider.update({
                  min: 0,
                  max: 60,
                  postfix: " 分鐘後",
                  from: 0,
                  step: 5,
                });
              $("#range").off("change");
              $('.datetime').text(moment(response['time_now']).add(time_index/12,'hours').add(from,'minutes').calendar());
              $("#range").on("change", function () {
                from = $(this).data("from");
                $('.avaliable_bike').text(response['predict_info'][time_index+(from/5)].count);
                $('.datetime').text(moment(response['time_now']).add(time_index/12,'hours').add(from,'minutes').calendar());
                if(response['predict_info'][time_index+(from/5)].count < 5){
                  $('.bike_img > img').attr('src','styles/cond_bad.png')
                }else if(response['predict_info'][time_index+(from/5)].count < 15){
                  $('.bike_img > img').attr('src','styles/cond_mid.png')
                }else{
                  $('.bike_img > img').attr('src','styles/cond_good.png')
                }
              });
            });
            $('.hurs').on('click',function(){
              time_index = $('#range').data("from")/5;
              console.log(time_index);
              $('.mins').removeClass('tabe_active');
              $(this).addClass('tabe_active');
              $('#range').data('clock','hour');
              var slider = $("#range").data("ionRangeSlider");
              slider.update({
                min: 0,
                max: 22,
                postfix: " 小時後",
                from: 0,
                step: 1
              });
              $("#range").off("change");
              $("#range").on("change", function () {
                  from = $(this).data("from");
                  $('.avaliable_bike').text(response['predict_info'][time_index+(from*12)].count)
                  $('.datetime').text(moment(response['time_now']).add(from,'hours').calendar());
                  if(response['predict_info'][time_index+(from*12)].count < 5){
                    $('.bike_img > img').attr('src','styles/cond_bad.png')
                  }else if(response['predict_info'][time_index+(from*12)].count < 15){
                    $('.bike_img > img').attr('src','styles/con_mid.png')
                  }else{
                    $('.bike_img > img').attr('src','styles/cond_good.png')
                  }
              });
            });
          }
      });


      }
    })(marker,i));

  }
  //叢集縮放點圖案
    var clusterStyles = [
      {
        textColor: '#FFB600',
        url: 'styles/cluster.png',
        height: 50,
        width: 50,
        textSize: 14
      },
     {
        textColor: '#FFB600',
        url: 'styles/cluster.png',
        height: 50,
        width: 50,
        textSize: 14
      },
     {
        textColor: '#FFB600',
        url: 'styles/cluster.png',
        height: 50,
        width: 50,
        textSize: 14
      }
    ];
    var mcOptions = {gridSize: 50, maxZoom: 15,styles:clusterStyles};
    var markerclusterer = new MarkerClusterer(map, markers,mcOptions);
    //

  //map rwd
  google.maps.event.addDomListener(window, "resize", function() {
   var center = map.getCenter();
   google.maps.event.trigger(map, "resize");
   map.setCenter(center);
  });


}
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}

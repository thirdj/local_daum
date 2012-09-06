var roadview = new daum.maps.Roadview(document.getElementById('roadview'));
//alert(roadview);
var roadviewclient = new daum.maps.RoadviewClient;
var circle;

daum.maps.event.addListener(roadview, 'position_changed', function() {
  var position = roadview.getPosition();
  if (circle) {
    circle.setMap(null);
  }
  circle = new daum.maps.Circle({
    zIndex: 1,
    center: position,
    radius: 100,
    strokeColor: '#0066ff',
    strokeWeight: 1,
    strokeOpacity: 1,
    fillColor: '#0066ff',
    fillOpacity: 0.2
  });
  circle.setMap(map);
});

daum.maps.event.addListener(roadview, 'viewpoint_changed', function() {
//console.log(roadview.getViewpoint());
});

var map = new daum.maps.Map(document.getElementById('map'), {
//center: new daum.maps.LatLng(37.53701, 127.005163)
  center: new daum.maps.LatLng(35.45069191302365, 126.57070965505325),
  level: 14
});
daum.maps.event.addListener(map, 'click', function(event) {
  $('#langText').html(event.latLng);
});
//map.addControl(new daum.maps.MapTypeControl);
//map.addControl(new daum.maps.ZoomControl);
document.getElementById('b1').onclick = function() {
  map.setMapTypeId(daum.maps.MapTypeId.ROADMAP);
};
document.getElementById('b2').onclick = function() {
  //map.setMapTypeId(daum.maps.MapTypeId.SKYVIEW);
  map.setMapTypeId(daum.maps.MapTypeId.HYBRID);
};
document.getElementById('b3').onclick = function() {
  map.setLevel(map.getLevel() - 1);
};
document.getElementById('b4').onclick = function() {
  map.setLevel(map.getLevel() + 1);
};
document.getElementById('b5').onclick = function() {
  map.setLevel(map.getLevel() + 14);
};

var branches = [
/*
{
  name: '다음커뮤니케이션 제주 본사',
  position: new daum.maps.LatLng(33.45069191302365, 126.57070965505325),
  viewpoint: { pan: 28.2, tilt: -5.5, zoom: -3 }
},
{
  name: '다음커뮤니케이션 한남오피스',
  position: new daum.maps.LatLng(37.53701, 127.005163),
  viewpoint: { pan: 63.25677419354838, tilt: -22.826666666666657, zoom: -3 }
},
*/
{
  name: '순천만',
  position: new daum.maps.LatLng(34.885645, 127.509407),
  viewpoint: { pan: 28.2, tilt: -5.5, zoom: -3 }
},
{
  name: '순천 낙성읍성 민속마을',
  position: new daum.maps.LatLng(34.907139,127.340284),
  viewpoint: { pan: 28.2, tilt: -5.5, zoom: -3 }
},
{
  name: '우포늪',
  position: new daum.maps.LatLng(35.54633,128.430047),
  viewpoint: { pan: 28.2, tilt: -5.5, zoom: -3 }
},
{
  name: '담양 죽녹원',
  position: new daum.maps.LatLng(35.325849,126.986319),
  viewpoint: { pan: 28.2, tilt: -5.5, zoom: -3 }
},
{
  name: '청산도',  // 해남 밑에 있는 완도에서 배타고 다도해상 국립공원으로 가야함... OTL
  position: new daum.maps.LatLng(34.182199,126.886597),
  viewpoint: { pan: 28.2, tilt: -5.5, zoom: -3 }
},
{
  name: '세량제',
  position: new daum.maps.LatLng(35.078736,126.920108),
  viewpoint: { pan: 28.2, tilt: -5.5, zoom: -3 }
},
{
  name: '함양 다락논', // http://blog.daum.net/fishingdiary/2818545
  position: new daum.maps.LatLng(35.514623,127.759323),
  viewpoint: { pan: 28.2, tilt: -5.5, zoom: -3 }
}];

for (var i = 0, j = branches.length; i < j; ++i) {
  var item = branches[i];
  makeMarker(item);
}

var infowindow;

function makeMarker(item) {

  var image = new daum.maps.MarkerImage(
  'http://i1.daumcdn.net/localimg/localimages/07/2012/img/marker_normal.png',
  new daum.maps.Size(30, 40), {
    spriteSize: new daum.maps.Size(644, 946),
    spriteOrigin: new daum.maps.Point(5, 5)
  });

  var marker = new daum.maps.Marker({
    zIndex: 2,
    image: image,
    title: item.name,
    position: item.position
  });
  marker.setMap(map);

  daum.maps.event.addListener(marker, 'click', function() {
    map.setCenter(marker.getPosition());
    map.setLevel(3);

    if (infowindow) {
      infowindow.close();
    }

    infowindow = new daum.maps.InfoWindow({
      zIndex: 3,
      content: '<strong>' + item.name + '</strong>'
    });
    infowindow.open(map, marker);

    roadviewclient.getNearestPanoId(item.position, 100, function(panoId) {
      roadview.setPanoId(panoId, item.position);
      roadview.setViewpoint(item.viewpoint);
    });
  });
}

function SimpleTextMarker(position, text) {
  this.position_ = position;
  this.node_ = document.createElement('div');
  this.node_.appendChild(document.createTextNode(text));
}

SimpleTextMarker.prototype = new daum.maps.AbstractOverlay;

SimpleTextMarker.prototype.onAdd = function() {
  var panel = this.getPanels().overlayLayer;
  panel.appendChild(this.node_);
};

SimpleTextMarker.prototype.onRemove = function() {
  this.node_.parentNode.removeChild(this.node_);
};

SimpleTextMarker.prototype.draw = function() {
  var projection = this.getProjection();
  var point = projection.pointFromCoords(this.position_);
  var width = this.node_.offsetWidth;
  var height = this.node_.offsetHeight;
  this.node_.style.cssText = 'position: absolute; white-space: nowrap; left: ' +
          (point.x - width / 2) + 'px; top: ' +
          (point.y - height / 2) + 'px';
};

var marker = new SimpleTextMarker(map.getCenter(), 'You just activated my trap card!');
marker.setMap(map);
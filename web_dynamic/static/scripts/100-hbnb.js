// jquery onclick function to handler filter amenities
$(document).ready(function () {
  const amenityDict = {};
  const stateDict = {};
  const citiesDict = {};


  $('.locations input[type="checkbox"]').click(function () {
    if ($(this).is(':checked')) {
      if ($(this).attr('data-city-id')) {
        citiesDict[$(this).attr('data-city-id')] = $(this).attr('data-city-name');
      } else {
        stateDict[$(this).attr('data-id')] = $(this).attr('data-name');
      }
    } else {
      if ($(this).attr('data-city-id')) {
        delete citiesDict[$(this).attr('data-city-id')];
      } else {
        delete stateDict[$(this).attr('data-id')];
      }
    }
    const stateList = Object.values(stateDict);
    const cityList = Object.values(citiesDict);
    const locationList = stateList.concat(cityList);
    if (locationList.length > 0) {
      $('.locations h4').text(Object.values(locationList).join(', '));
    } else {
      $('.locations h4').html('&nbsp;');
    }
  });

  $('.amenities input[type="checkbox"]').click(function () {
    if ($(this).is(':checked')) {
      amenityDict[$(this).attr('data-id')] = $(this).attr('data-name');;
    } else {
      delete amenityDict[$(this).attr('data-id')];
    }
    const amenityList = Object.values(amenityDict);
    if (amenityList.length > 0) {
      $('.amenities h4').text(Object.values(amenityDict).join(', '));
    } else {
      $('.amenities h4').html('&nbsp;');
    }
  });

  // check api status
  $.get('http://localhost:5001/api/v1/status/', function (data, status) {
    if (status === 'success') {
      if (data.status === 'OK') {
        $('#api_status').addClass('available');
      }
    } else {
      $('#api_status').removeClass('available');
    }
  });
  // set initial setup
  do_place_search(stateDict, citiesDict, amenityDict);
  // search request on request button click
  $('button').click(function () {
    do_place_search(stateDict, citiesDict, amenityDict);
  });
});

function do_place_search(stateDict, citiesDict, amenityDict) {
  jsonData = JSON.stringify({ 
    states: Object.keys(stateDict),
    cities: Object.keys(citiesDict),
    amenities: Object.keys(amenityDict)
  });

  $.ajax({
    type: 'POST',
    url: 'http://localhost:5001/api/v1/places_search/',
    data: jsonData,
    contentType: 'application/json',
    dataType: 'json',
    success: function (data) {
      $('section.places').empty();
      for (const place of data) {
        $('section.places').append(
          `<article>
            <div class="title_box">
              <h2>${place.name}</h2>
              <div class="price_by_night">$${place.price_by_night}</div>
            </div>
            <div class="information">
              <div class="max_guest">${place.max_guest} Guests</div>
              <div class="number_rooms">${place.number_rooms} Bedrooms</div>
              <div class="number_bathrooms">${place.number_bathrooms} Bathrooms</div>
            </div>
            <div class="description">
              ${place.description}
            </div>
          </article>`
        );
      }
    }
  });
}

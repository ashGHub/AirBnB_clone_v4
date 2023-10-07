// jquery onclick function to handler filter amenities
$(document).ready(function () {
  const amenityDict = {};
  $('input[type="checkbox"]').click(function () {
    if ($(this).is(':checked')) {
      amenityDict[$(this).attr('data-id')] = $(this).attr('data-name');
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
});
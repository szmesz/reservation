/**
 * Script to handle placing reservations.
 */

"use strict";

(function() {
  
  function collectFormInput() {
    
    var reservationFormValues = {};
    $.each($('#reservationForm').serializeArray(), function(i, field) {
      reservationFormValues[field.name] = field.value;
    });
    
    return reservationFormValues;
  }
  
  function alertMessageAccordingToStatusCode(status) {
	   
	  switch (status) { 
	  case 400:
	      alert("Reservation failed - please check if you input valid values into the input fields " +
	         "such as only numbers greater than 0 into the Facility Id field " +
	         "and correct form of date to the date fields such as dd/mm/yyyy or yyyy-mm-dd " +
	         "and the Start Date preceeds the End Date " +
	         "Please make sure you filled all the fields")
	      break;   
	  case 405: 
		  alert("Reservation failed -please check your input for completeness.")
		  break;
	  case 409: 
		  alert('The room is already reserved for this period, please choose a different period.');
		  break;
	  case 500: 
		  alert('Reservation failed - please try again later.');
		  break;  
		}
	}
  
  	function alertSuccess(reservationId) {
  		alert("Your reservation has been successfully processed. Your reservation id is: " + reservationId);
  	}
  		

$(document).ready(function() {

  $("#submitReservation").click(function(e) {     
    e.preventDefault();           

    $('.message').hide();
    
    var reservationRequest = collectFormInput();
    var fromDateInMillis=Date.parse(reservationRequest.fromDate);
    var toDateInMillis=Date.parse(reservationRequest.toDate);
    if (reservationRequest.resourceId < 1) { 
        alert("Reservation failed - Facility Id: must be a number greater than 0"); 
    } else if (isNaN(fromDateInMillis)==false && isNaN(toDateInMillis) == false) { 
      if (fromDateInMillis > toDateInMillis) {
      alert("Please make sure the Start Date preceeds the End Date");
      } else {
    	  var reservationUrl = 
    	      '/api/reservations/' + encodeURIComponent(reservationRequest.resourceId) 
    	      + '/from-' + encodeURIComponent(reservationRequest.fromDate) 
    	      + '/to-' + encodeURIComponent(reservationRequest.toDate)
    	      + '/?owner=' + encodeURIComponent(reservationRequest.owner);

    	    $.ajax({
    	      url : reservationUrl,                    
    	      method: 'POST',                           
    	      async : true,                          
    	      cache : false,                         
    	      timeout : 5000,                     

    	      data : {},                               

    	      success : function(data, statusText, response) {          
    	        var reservationId = response.getResponseHeader('reservation-id');
    	        $('#reservationId').text(reservationId);
    	        alertSuccess(reservationId);
    	      },
    	                                                
    	      error : function(XMLHttpRequest, textStatus, errorThrown) {   
    	        console.log("reservation request failed ... HTTP status code: " + XMLHttpRequest.status + ' message ' + XMLHttpRequest.responseText);
    	        alertMessageAccordingToStatusCode(XMLHttpRequest.status);
    	    
    	      }
    	    });    
      }
    }        
  }); 
});
})();
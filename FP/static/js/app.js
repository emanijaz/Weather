var table_show = 0;          // global var for weather table hide
var icon=[];         // global icons array containing all of icon elements 
var ficon;           // global var for first day icon
var wind;

// (function($, document, window){
	

	$(document).ready(function(){
     
		// Cloning main navigation for mobile menu
		$(".mobile-navigation").append($(".main-navigation .menu").clone());

		// Mobile menu toggle 
		$(".menu-toggle").click(function(){
			$(".mobile-navigation").slideToggle();
		});

		var map = $(".map");
		var latitude = map.data("latitude");
		var longitude = map.data("longitude");
		if( map.length ){
			
			map.gmap3({
				map:{
					options:{
						center: [latitude,longitude],
						zoom: 15,
						scrollwheel: false
					}
				},
				marker:{
					latLng: [latitude,longitude],
				}
			});
			
		}
	   
		    


	});         // document.ready ends
	$(window).load(function(){
	 
        $("#preloader").fadeOut("slow",function(){$(this).remove();});
        
  
	});

// (jQuery, document, window);



$(function() {
    $("#table").hide();
    searchbar();
   
    console.log("in anonymous");
});

function search(query, syncResults, asyncResults)
{
    // get places matching query (asynchronously)
    var parameters = {
        q: query
    };
    $.getJSON(Flask.url_for("search"), parameters)
    .done(function(data, textStatus, jqXHR) {
     
        // call typeahead's callback with search results (i.e., places)
        asyncResults(data);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {

        // log error to browser's console
        console.log(errorThrown.toString());

        // call typeahead's callback with no results
        asyncResults([]);
    });
}

function searchbar()
{
    // console.log("in search function");
     
    $("#q").typeahead({
        highlight: false,
        minLength: 1
    },
    {
        display: function(suggestion) { return null; },
        // display: block,
        limit: 10,
        source: search,
        templates: {
            suggestion: Handlebars.compile(
                "<div style= border: 3px solid black> " +
                 "<h5>" + "{{place_name}}" + "</h5>"+
                "</div>"
            )
        }
    });
  
    $("#q").on("typeahead:selected", function(eventObject, suggestion, name) {
        
        if( table_show == 1)     // if table is already opened / visible
        {
            for (var i=0; i<icon.length; i++)
            {
                icon[i].innerHTML ="";        // removing content // removing icons 
            }
            ficon.innerHTML ="";
            wind.innerHTML="";
            table_show=0;
        }
        $("#table").show();
        table_show = 1;      // table is visible
        showinfo(suggestion);
    });
    
    // $("#q").focus(function(eventData) {
    //     info.close();
    // });
    
    // document.addEventListener("contextmenu", function(event) {
    //     event.returnValue = true; 
    //     event.stopPropagation && event.stopPropagation(); 
    //     event.cancelBubble && event.cancelBubble();
    // }, true);
    
    // $("#q").focus();
}


function showinfo(suggestion){
    
    ficon = document.getElementById("curr_ficon");
    var loc = document.getElementById("loc");
    var deg = document.getElementById("curr_deg");
    var ficon1 = document.getElementById("ficon1");
    var ficon2 = document.getElementById("ficon2");
    var ficon3 = document.getElementById("ficon3");
    var ficon4 = document.getElementById("ficon4");
    var ficon5 = document.getElementById("ficon5");
    var ficon6 = document.getElementById("ficon6");
    var deg1 = document.getElementById("deg1");
    var deg2 = document.getElementById("deg2");
    var deg3 = document.getElementById("deg3");
    var deg4 = document.getElementById("deg4");
    var deg5 = document.getElementById("deg5");
    var deg6 = document.getElementById("deg6");
    wind = document.getElementById("wind");
    
    
    
    
    var deg_arr=[deg1, deg2, deg3, deg4, deg5, deg6];
    icon =[ ficon1, ficon2, ficon3, ficon4, ficon5, ficon6];
    var icons_desc =["partly-cloudy-day","clear-day","rain","snow","sleet","cloudy","wind","fog","partly-cloudy-night","clear-night"];
    var icons_img=[
         "static/images/icons/icon-3.svg",
         "static/images/icons/icon-2.svg",
          "static/images/icons/icon-10.svg",
          "static/images/icons/icon-14.svg",
          "static/images/icons/icon-13.svg",
          "static/images/icons/icon-6.svg",
          "static/images/icons/icon-8.svg",
          "static/images/icons/icon-7.svg",
          "static/images/icons/icon-5.svg",
          "static/images/icons/icon-5.svg"
        ];
        
    
    
    var parameters = {
        lat:suggestion["latitude"],
        lng:suggestion["longitude"]
    };
$.getJSON(Flask.url_for("getinfo"),parameters)
    .done(function(data, textStatus, jqXHR) {
   
        
        console.log(data);       // printiing data on screen
        setAllDays(data);                      // calling function which set all days
        loc.innerHTML =suggestion["place_name"] +"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" + data["currently"]["icon"];             // print location name
        temp = parseFloat(data["currently"]["temperature"]);
        temp = (temp- 32.0)*(5.0/9.0);
        deg.innerHTML= temp.toFixed(2) +"<sup>o</sup>C";         // print temp (current)
        
                            // setting wind speed and its icon
        var wind_img = document.createElement("IMG");
        wind_img.setAttribute( "src", "static/images/icon-wind.png");
        wind.appendChild(wind_img);
        var wind_speed = document.createTextNode(data["currently"]["windSpeed"]+ "m/s");
        wind.appendChild(wind_speed);
       
        
        for( var k=0; k< icons_desc.length; k++)          // set today or current icon
        {
            if (data["currently"]["icon"] == icons_desc[k])
            {
                 var z = document.createElement("IMG");
                 img_path = icons_img[k];
                 z.setAttribute("src", img_path);
                 z.setAttribute("width", "90");
                 ficon.appendChild(z);
                      
            }
        }
       
        for (var i=0; i<icon.length; i++)            // set daily icons
        {
             for( var j=0; j< icons_desc.length;j++)
             {
                  if( data["daily"]["data"][i+1]["icon"] == icons_desc[j])
                  {
                      var a = document.createElement("IMG");
                      img_path = icons_img[j];
                      a.setAttribute("src", img_path);
                      a.setAttribute("width", "48");
                      icon[i].appendChild(a);
                      
                  }
             }
            
        }
        for(var d=0; d< deg_arr.length; d++)     // setting daily temperatures
        {
             temp_max = parseFloat(data["daily"]["data"][d+1]["temperatureMax"]);
             temp_min = parseFloat(data["daily"]["data"][d+1]["temperatureMin"]);
             avg_temp = (temp_max + temp_min)/2.0;
             
             avg_temp = (avg_temp- 32.0)*(5.0/9.0);  // converting to celsius from farenheit
           
            deg_arr[d].innerHTML= avg_temp.toFixed(2) +"<br><sup>o</sup>C";
        }
          // daily summary
        var daily_summary = document.getElementById("daily_summary");
        daily_summary.innerHTML= "<h3>SUMMARY: </h3> <br>" +data["daily"]["summary"] + "<br><br><input type=\"submit\" value=\"More details\" id=\"MoreDet\" >"+
        "<div id=\"full_detail\"> </div> ";
       
          var showFullDetail = 0;
                    // function shows all detail when More Detail link is clicked
            $("#MoreDet").click(function($e){
           
           
            $e.preventDefault();
          
            if(showFullDetail== 1)         // already shown now delete it / hide 
            {
                $('#full_detail').empty();
                showFullDetail=0;
                return;
            }
            var text="";
            for( daily in data["daily"]["data"][0])
            {
                if(daily =="apparentTemperatureMaxTime" || daily =="apparentTemperatureMinTime" || daily=="precipIntensityMaxTime:" ||
                 daily =="sunriseTime" || daily == "sunsetTime" || daily=="temperatureMaxTime" || daily=="temperatureMinTime" ||daily =="time"
                 || daily =="uvIndexTime" || daily =="windGustTime" || daily =="precipIntensityMaxTime")
                 {
                      var d =new Date(data["daily"]["data"][0][daily] * 1000);
                    //   console.log(d.getDay());
                    //   console.log(d.toDateString());
                      d=d.toTimeString();
                      text += daily +":   " +d +"<br>" ;
                 }
                 else if(daily == "visibility")
                 {
                      text += daily +":   " + data["daily"]["data"][0][daily]+" km "+"<br>" ;
                 }
                 else if(daily == "windBearing" || daily=="windGust" || daily =="windSpeed")
                 {
                     text += daily +":   " + data["daily"]["data"][0][daily]+" miles/h "+"<br>" ;
                 }
                 else if(daily == "pressure")
                 {
                     text += daily +":   " + data["daily"]["data"][0][daily]+"  hPa"+"<br>" ;
                 }
                 else if(daily== "apparentTemperatureMax" ||daily =="apparentTemperatureMin" ||daily =="dewPoint"|| daily =="temperatureMax"
                 || daily =="temperatureMin")
                 {
                     text += daily +":   " + data["daily"]["data"][0][daily]+"  Farenheit"+"<br>" ;
                 }
                 else if(daily =="precipIntensity" || daily =="precipIntensityMax")
                 {
                     text += daily +":   " + data["daily"]["data"][0][daily]+"  mm/s"+"<br>" ;
                 }
                 else if( daily =="ozone")
                 {
                     text += daily +":   " + data["daily"]["data"][0][daily]+"  DU"+"<br>" ;
                 }
                 else{ 
                    text += daily +":   " + data["daily"]["data"][0][daily] +"<br>" ;}
        

            }
   
            var full_detail = document.getElementById("full_detail");
            full_detail.innerHTML ="<div class=\"fullwidth-block\" > <div class = \"container\" >" +text+ "</div></div>";
            showFullDetail = 1;
 
        })  ; 
        
       
       
    })
    .fail(function(jqXHR, textStatus, errorThrown) {

        // log error to browser's console
        console.log(errorThrown.toString());
    });
    
   
}

function setAllDays(data)
{
    days =["Sunday", "Monday", "Tuesday", "Wednesday" ,"Thursday" , "Friday", "Saturday"];
    month= ["Jan", "Feb", "March", "April", "May", "June", "July", "August", "Sep", "oct", "Nov", "Dec"];
    for(var i=0; i<7; i++ )
    {
        var day="day";
        
        day += i;
        setDay= document.getElementById(day);
        var d= new Date(data["daily"]["data"][i]["time"]*1000);
        // console.log(d);
        day_no = parseInt(d.getDay());
        setDay.innerHTML = days[day_no];
        
    }
    var date= document.getElementById("curr_date");
    var m = new Date(data["currently"]["time"]*1000);

    date.innerHTML = m.getDate()+ " "+ month[m.getUTCMonth()];        // set month and date

}
function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
function submitfun()
{
    var v = document.getElementById("validation");
    var check =0;
    $('#validation').empty();
    // display.empty();
    $('#display_sub').empty();
    $('#name').css('border-color', '#393c48');
    $('#email').css('border-color', '#393c48');
    $('#Cname').css('border-color', '#393c48');
    $('#web').css('border-color', '#393c48');
    
    if($('#name').val() == "" )
    {
       
        $('#name').css('border-color', 'red');
       
        v.innerHTML = "<h3 style=\"color: red \">provide all information correctly! </h3>";
        check=1;
        
    }
    if( $('#email').val() == "" || !validateEmail($('#email').val()) )
    {
        $('#email').css('border-color', 'red');  
       
        v.innerHTML = "<h3 style=\"color: red \">provide all information correctly! </h3>";check=1;
    }
    if($('#Cname').val()=="" )
    {
        $('#Cname').css('border-color', 'red');
       
        v.innerHTML = "<h3 style=\"color: red \">provide all information correctly! </h3>";check=1;
        
    }
    if( $('#web').val()=="")
    {
        $('#web').css('border-color', 'red');  
 
        v.innerHTML = "<h3 style=\"color: red \">provide all information correctly! </h3>";check=1;
    }
    
    if(check ==0){
    
     toastr.options.showMethod = 'slideDown';
      toastr.success('Submitted!');
    
    }
}



// function sendMail() {
//     console.log("inmail fun");
//     var e_link = "mailto:" +$('#subscribe_email').val();
    
//     var link = e_link;
//              + "?cc=myCCaddress@example.com"
//              + "&subject=" + escape("This is my subject")
//              + "&body=" + escape("Thanks for showing interest !.")
//     ;

//     window.location.href = link;
//     var display = document.getElementById("display_sub"); 
//       display.innerHTML = "<h3 style=\"background:black\">	Email has sent!. Thank You.  </h3>";
// }


$(document).ready(function() {
  $("#version").html("v0.14");
  
  $("#searchbutton").click( function (e) {
    displayModal();
  });
  
  $("#searchfield").keydown( function (e) {
    if(e.keyCode == 13) {
      displayModal();
    }	
  });
  
  function displayModal() {
    let search= ($("#searchfield").val()).split(" ");
    $("#myModal").modal('show');
    $("#status").html("Searching...");
    $("#dialogtitle").html("Search for: "+$("#searchfield").val());
    $("#previous").hide();
    $("#next").hide();
    
    imagesUrl = [];
    totalPages = 1;
    currentPage =1;
    numResults=0;

    for(let i=0; i<search.length;i++){
      $.getJSON('/search/' + search[i], function(data) {
        renderQueryResults(data);
      });
    }
    
  }
  
  $("#next").click( function(e) {
    if(currentPage < totalPages){
      currentPage++;
      renderImages(pageImages[currentPage-1]);
    }
  });
  
  $("#previous").click( function(e) {
    if(currentPage > 1){
      currentPage--;
      renderImages(pageImages[currentPage-1]);
    }
    
  });
  
  function renderQueryResults(data) {
    if (data.error != undefined) {
      $("#status").html("Error: "+data.error);
    } else {
      showResults(data.results);
    }
  }
  
   function showResults(results){
     imagesUrl.push(results);

    //  if((imagesUrl.length/4)>1){
    //    totalPages = (imagesUrl.length/4)+1;

    //    let ix=0;
    //    for(let i=0; i<totalPages;i++){
    //     pageImages[i] = imagesUrl.slice(ix,4);
    //     ix=ix+4;
    //    }
    //    renderImages(pageImages);
    //  }else
      renderImages(imagesUrl);

   }

   function renderImages(images){
    //$("#status").html(""+images.length+" result(s)");
    if(images.length>4){
      $("#next").show();
      $("#previous").show();
    }
     let img;
     for(let i = 0; i<4; i++){
       if(images[i]){
           img = document.createElement("img");
           img.src = images[i];
           img.width = 200;
         }
         else{
           img="";
         }
         let photo = "#photo"+i;
         $(photo).html(img);
     }
     }
   
});

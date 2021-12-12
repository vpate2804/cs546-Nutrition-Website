filterSelection("all");
function filterSelection(c) {
  var x, i;
  x = document.getElementsByClassName("filterDiv");
  if (c == "all") c = "";
  // Add the "show" class (display:block) to the filtered elements, and remove the "show" class from the elements that are not selected
  for (i = 0; i < x.length; i++) {
    w3RemoveClass(x[i], "show");
    if (x[i].className.indexOf(c) > -1) w3AddClass(x[i], "show");
  }
}

// Show filtered elements
function w3AddClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) {
      element.className += " " + arr2[i];
    }
  }
}

// Hide elements that are not selected
function w3RemoveClass(element, name) {
  var i, arr1, arr2;
  console.log(element, name);
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1);
    }
  }
  element.className = arr1.join(" ");
}

// Add active class to the current control button (highlight it)
var btnContainer = document.getElementById("myBtnContainer");
var btns = btnContainer.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function () {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}
(function ($) {
  $(document).ready(function () {
    $("#search-input").keyup(function (e) {
      //e.preventDefault();
      //console.log("clicked");
      var search = $("#search-input").val();
      if (search == "") {
        $(".message").empty();
        $(".error").empty();
      }
      console.log("search term=" + search);
      $.get("/all/search?search=" + search, function (data) {
        $(".container").empty();
        $(".error").empty();
        $(".message").empty();
        if (data.length === 0)
          $(".error").append(`No search results found for ${search}`);
        else {
          data.forEach((recipe) => {
            console.log(recipe);
            $(".container").append(`
        <div class="filterDiv ${recipe.recipeType} ${recipe.season}">
        <a href="/all/${recipe._id}">${recipe.name}</a>
        <br>
        Recipe Type: ${recipe.recipeType}
        <br>
        Season: ${recipe.season}
        <br>
        Cooking Time: ${recipe.cookTime}
        minutes
        <br>
        Rating: ${recipe.overallrating}/5
        <br>
        <div id="favResult">
          <form action="/user/addfavorite" method="post" class="favbutton">
          <input type="hidden" name="recipeId" value="${recipe._id}" />
          <input type="submit" value="Add to Favorites" />
        </form>
        </div>
        </div>
        `);
          });
          $("#all-btn").click();
        }
      });
    });
  });
})(jQuery);

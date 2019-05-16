/*

 ### Basic Reqs
- [ ] Where to store data? (localstorage)
- [ ] How to caputure data? (web form)
- [ ] How to modify data? (update action, delete action)
- [ ] How to view data? (style?)
- [ ] UI/UX considerations (how are we going to use this)

*/

//localStorage interaction function
//get item
var getItem = function(key) {
  return window.localStorage.getItem(key);
}

//create
var createItem = function(key, value) {
  return window.localStorage.setItem(key, value);
}

//update
var updateItem = function(key, value) {
  return window.localStorage.setItem(key, value);
}

//delete
var deleteItem = function(key) {
  return window.localStorage.removeItem(key);
}

//clear everything
var clearEverything = function() {
  return window.localStorage.clear();
}

var keyExists = function(key) {
  var currentValue = getItem(key);
  return currentValue !== null;
}

//add form field
var addInput = (event) => {
  event.preventDefault();
  console.log(event.target.id);
  if (event.target.id === 'add-ingredient'){
    let $ingredientDiv = $(`<div class="ingredient"></div>`);
    let $ingredient = $(`<input type="text" placeholder="Ingredient"></input>`);
    let $quantity = $(`<input type="text" placeholder="Quantity"></input>`);
    let $clearBtn = $(`<button class="clear-btn" id="clear-ingredient">X</button>`);
    let $addBtn = $(`<button class="add-btn" id="add-ingredient">+</button>`);
    $ingredientDiv.append($ingredient).append($quantity).append($clearBtn).append($addBtn).append($(`.ingredients-wrapper`));

  }
  if (event.target.id === 'add-step'){
    console.log('bing')
  }
  if (event.target.id === 'add-use'){
    console.log('bing')
  }
  if (event.target.id === 'add-type'){
    console.log('bing')
  }

}


///////////////////////////////////////////
//event handlers for the buttons and ... possibly the inputboxes
  //preventdefault on button clicks
$(document).ready(function() {
  $('#createButton').click(function(event) {
    event.preventDefault();

    var currentKey = $("#keyInput").val();
    var currentValue = $("#valueInput").val();
    if (keyExists(currentKey)) {
      //current key exists, do something error-handle-y
    } else {
      createItem(currentKey, currentValue);
    }
  });

  $('#updateButton').click(function(event) {
    event.preventDefault();

    var currentKey = $("#keyInput").val();
    var currentValue = $("#valueInput").val();
    if (keyExists(currentKey)) {
      updateItem(currentKey, currentValue);
    } else {
      //current key doesnt exist, do stuff
    }
  });
  $(".add-btn").click(addInput);

});
























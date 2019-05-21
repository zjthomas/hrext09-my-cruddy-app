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
  //console.log(event);
  event.preventDefault();
  //console.log(event.currentTarget.classList[1]);
  if (event.currentTarget.id === 'add-ingredient'){
    $(`.ingredient:first`).clone(true).find(`:input`).val(``).end().appendTo($(`.ingredients-wrapper`));
  }
  if (event.currentTarget.id === `add-step`){
    $(`.step:first`).clone(true).find(`:input`).val(``).end().appendTo($(`.directions-wrapper`));
  }
  if (event.currentTarget.id === `add-use`){
    if ($(`.use`).length < 10){
      $(`.use:first`).clone(true).find(`:input`).val(``).end().appendTo($(`.uses-wrapper`));
    }
    
  }
  if (event.currentTarget.id === `add-type`){
    if ($(`.type`).length < 3){
      $(`.type:first`).clone(true).find(`:input`).val(``).end().appendTo($(`.type-wrapper`));
    }
  }
}

//remove form field
var removeInput = (event) => {
  console.log(event);
  event.preventDefault();
  console.log(event.currentTarget.id);
  if (event.currentTarget.id === 'remove-ingredient'){
    if ($(`.ingredient`).length > 1){
      $(`.ingredient:last`).remove();
    }    
  }
  if (event.currentTarget.id === `remove-step`){
    if ($(`.step`).length > 1){
      $(`.step:last`).remove();
    }
  }
  if (event.currentTarget.id === `remove-use`){
    if ($(`.use`).length > 1){
      $(`.use:last`).remove();
    }
  }
  if (event.currentTarget.id === `remove-type`){
    if ($(`.type`).length > 1){
      $(`.type:last`).remove();
    }
  }
}

//handle submition and store data
var makeSauce = (event) => {
  event.preventDefault();
  //console.log(event.target.form);
  //console.log($('form').serializeArray())
  let data = $(`form`).serializeArray();
  let sauce = {
    ingredients: {},
    directions: {},
    uses: [],
    types: []
  };
  let stepCount = 0;
  for (let i = 0; i < data.length; i++){
    if (data[i][`name`] === `ingredient`){
      sauce.ingredients[data[i][`value`]] = data[++i][`value`];
    }else if (data[i][`name`] === `step`){
      sauce.directions[`Step ${++stepCount}`] = data[i][`value`];
    }else if (data[i][`name`] === `use`){
      sauce.uses.push(data[i][`value`]);
    }else if (data[i][`name`] === `type`){
      sauce.types.push(data[i][`value`]);
    }else{
      sauce[data[i][`name`]] = data[i][`value`];
    } 
  }
  //console.log(sauce)
  archiveSauceName(sauce.name);
  addSauceToSelector(sauce.name);
  createItem(sauce.name, JSON.stringify(sauce));
  document.getElementById("createSauce").reset();
  sauceForm();
}
//toggle between display elements and sauce form
var form = false;
var sauceForm = (event) => {
  if (event){
    event.preventDefault();
  }
  if (form){
    document.getElementById("createSauce").style.display = "none" ;
    document.getElementById("displaySauce").style.display = "block";
    $(`.create-sauce`).text(`Create Sauce`); 
    form = false;
  }else{
    document.getElementById("displaySauce").style.display = "none" ;
    document.getElementById("createSauce").style.display = "block";
    $(`.create-sauce`).text(`Display Sauce`);  
    form = true;
  }
}

//add sauce to selector
var addSauceToSelector = (sauce) => {
  $(`<option value="${sauce}"">${sauce}</option>`).appendTo($(`.select-sauce`))
}

var loadSelector = () => {
  let sauces = getItem(`sauceArray`);
  sauces = JSON.parse(sauces);
  sauces.forEach((val) => {
    addSauceToSelector(val);
  });
}
var archiveSauceName = (sauce) => {
  let sauces = getItem(`sauceArray`);
  sauces = JSON.parse(sauces);
  sauces.push(sauce);
  updateItem(`sauceArray`, JSON.stringify(sauces));
}

//display sauce
var displaySauce = (event) => {
  event.preventDefault();
  if (form){
    sauceForm();
  }
  //console.log(event)
  let sauce = JSON.parse(getItem(event.target.form[0].value));
  //console.log(sauce);
  //display sauce name
  let $displayName = $(`.display-name`);
  $displayName.html("");
  let $name = $(`<h1 class="name">${sauce.name}</h1>`);
  $name.appendTo($displayName);

  // display description 
  let $displayDescription = $(`.display-description`);
  $displayDescription.html("");
  let $sauceDescription = $(`<div class="sauceDescription"></div>`);
  let $descriptionHeading = $(`<h3>Description</h3>`);
  $sauceDescription.append($descriptionHeading);
  let $description = $(`<div class="descriptionBox">${sauce.description}</div>`);
  $sauceDescription.append($description);
  let $sauceDescription2 = $(`<div class="sauceDescription"></div>`);
  let useString = sauce.uses.reduce((acc, val) => `${acc}, ${val}`)
  let $uses = $(`<div class="useBox"><b>Uses:</b> ${useString}</div>`);
  let $spice = $(`<div class="spicyBox"><b>Spicyness:</b> ${sauce.spicyness}</div>`);
  let $prep = $(`<div class="prepTime"><b>Prep Time:</b> ${sauce.time}</div>`)
  $sauceDescription2.append($uses).append($spice).append($prep);
  $displayDescription.append($sauceDescription).append($sauceDescription2);
  /*
  $sauceDescription.appendTo($displayDescription);
  sauceDescription2.appendTo($displayDescription);
  */

  // display ingredients
  let $displayIngredients = $(`.display-ingredients`);
  $displayIngredients.html("");
  let $ingredientsHeading = $(`<h3>Ingredients:</h3>`);
  $displayIngredients.append($ingredientsHeading);
  let $sauceIngredients = $(`<div class="sauceIngredients"></div>`);
  for (let key in sauce.ingredients){
    let $ingredient = $(`<div class="ingredientBox">${key}: ${sauce.ingredients[key]}</div>`)
    $sauceIngredients.append($ingredient);
  }
  $sauceIngredients.appendTo($displayIngredients);

  //display directions
  let $displayDirections = $(`.display-directions`);
  $displayDirections.html("");
  let $directionsHeading = $(`<h3>Directions:</h3>`)
  $displayDirections.append($directionsHeading);
  let $sauceDirections = $(`<div class="sauceDirections"></div>`);
  for (let key in sauce.directions){
    let $step = $(`<div class="directionBox"><b>${key}:</b> ${sauce.directions[key]}</div>`)
    $sauceDirections.append($step);
  }
  $sauceDirections.appendTo($displayDirections);
}

  


///////////////////////////////////////////
//event handlers for the buttons and ... possibly the inputboxes
  //preventdefault on button clicks
$(document).ready(function() {
  document.getElementById("createSauce").style.display = "none";

  if (keyExists(`sauceArray`) && Array.isArray(JSON.parse(getItem(`sauceArray`)))){
    loadSelector()
  }else {
    createItem(`sauceArray`, JSON.stringify([]));
  }


  $(`.add-btn`).click(addInput);
  $(`.remove-btn`).click(removeInput);
  $(`#createButton`).click(makeSauce);
  $(`.create-sauce`).click(sauceForm);
  $(`#load-sauce`).click(displaySauce);


});
























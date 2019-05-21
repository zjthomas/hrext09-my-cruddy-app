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
    if (data[i][`value`]){
      if (data[i][`name`] === `ingredient`){
        let ingredient = capitalizeFirst(data[i][`value`]);
        sauce.ingredients[ingredient] = data[++i][`value`];
      }else if (data[i][`name`] === `step`){
        let step = `${capitalizeFirst(data[i][`value`])}.`
        sauce.directions[`Step ${++stepCount}`] = step;
      }else if (data[i][`name`] === `use`){
        let use = capitalizeFirst(data[i][`value`])
        sauce.uses.push(use);
      }else if (data[i][`name`] === `type`){
        let type = data[i][`value`].toLowerCase();
        sauce.types.push(type);
      }else if (data[i][`name`] === `spicyness`){
        if (data[i][`value`] < 0){
          data[i][`value`] = 0;
        }
        if (data[i][`value`] > 11){
          data[i][`value`] = 11;
        }
        sauce[data[i][`name`]] = data[i][`value`]
      }else{
        sauce[data[i][`name`]] = data[i][`value`];
      } 
    }
    
  }
  if (!keyExists(sauce.name)){
    archiveSauceName(sauce.name);
    addSauceToSelector(sauce.name);
  }
  //console.log(sauce)
  createItem(sauce.name, JSON.stringify(sauce));
  document.getElementById("create-sauce").reset();
  changePage(`display`);
}
var capitalizeFirst = (str) =>{
    return `${str[0].toUpperCase()}${str.slice(1)}`  
}

//toggle between display elements and sauce form
var page = `home`;
var sauceForm = (event) => {
  event.preventDefault();
  //console.log(event.currentTarget.innerText);
  if (event.currentTarget.innerText === `Create Sauce`){
    changePage(`create`);
  }else{
    changePage(`display`)
  }
  
}
let changePage = (desiredPage) => {
  if (desiredPage === `display`){
    document.getElementById("create-sauce").style.display = "none" ;
    document.getElementById("home-page").style.display = "none" ;
    document.getElementById("display-sauce").style.display = "block";
    $(`.create-sauce`).text(`Create Sauce`); 
    page = `display`;
  }else if (desiredPage === `create`){
    document.getElementById("display-sauce").style.display = "none" ;
    document.getElementById("home-page").style.display = "none" ;
    document.getElementById("create-sauce").style.display = "block";
    $(`.create-sauce`).text(`Display Sauce`);  
    page = `create`;
  }else if (desiredPage === `home`){
    document.getElementById("create-sauce").style.display = "none" ;
    document.getElementById("display-sauce").style.display = "none";
    document.getElementById("home-page").style.display = "block" ;
    $(`.create-sauce`).text(`Create Sauce`); 
    page = `home`;
  }else{
    console.log(`changePage called on invalid page name: ${desiredPage}`)
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

var removeFromSelector = (sauce) => {
  $(`.select-sauce option[value="${sauce}"]`).remove();
  console.log(`removed ${sauce} from selector`)
}
//add sauce to sauceArray
var archiveSauceName = (sauce) => {
  let sauces = getItem(`sauceArray`);
  sauces = JSON.parse(sauces);
  sauces.push(sauce);
  updateItem(`sauceArray`, JSON.stringify(sauces));
}
//remove Sauce from SauceArray
var unarchiveSauceName = (sauce) => {
  let sauces = getItem(`sauceArray`);
  sauces = JSON.parse(sauces);
  let index = sauces.indexOf(sauce);
  sauces.splice(index,1);
  updateItem(`sauceArray`, JSON.stringify(sauces));
  console.log(`removed ${sauce} from archive`)
}


//display sauce
var displaySauce = (event) => {
  event.preventDefault();
  if (page !== `display`){
    changePage(`display`);
  }
  //console.log(event)
  let sauce = JSON.parse(getItem(event.target.form[0].value));
  //console.log(sauce);
  //display sauce name
  // let $displayName = $(`.display-name`);
  // $displayName.html("");
  // let $name = $(`<h1 class="name">${sauce.name}</h1>`);
  // $name.appendTo($displayName);
  $(`.title`).text(`${sauce.name}`);

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
  let $spice = $(`<div class="spicyBox"><b>Spicyness:</b> ${sauce.spicyness}/10</div>`);
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
  let $sauceIngredients = $(`<ul class="sauceIngredients"></ul>`);
  for (let key in sauce.ingredients){
    let $ingredient = $(`<li class="ingredientBox">${key}${(sauce.ingredients[key]) ? 
                                                          `: ${sauce.ingredients[key]}` : ``}</li>`)
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

//delete Sauce
let deleteSauce = (event) =>{
  //console.log(event)
  let sauce = $(`h1`).text();
  //console.log(sauce)
  if (keyExists(sauce)){
    if (confirm(`Are you sure you want to delete ${sauce} from your sauces?`)){
      deleteItem(sauce);
      unarchiveSauceName(sauce);
      removeFromSelector(sauce);
      removeSauceFromSauceList(sauce);
      changePage(`home`);//make take to home page once implemented
      console.log(`deleted ${sauce}`)
    }
  }else{
    alert(`${sauce} is not a sauce`)
    console.log(`${sauce} is not a sauce`)
  }
}

//load sauces onto frontPage
let loadSauceList = () => {
  console.log(`start loadSauceList`)
  let sauces = getItem(`sauceArray`);
  sauces = JSON.parse(sauces);
  sauces.forEach((val) => {
    addSauceToSauceList(val);
  });
  console.log(`finish loadSauceList`)
}
//add sauces to sauce list
let addSauceToSauceList = (sauce) => {
  let $sauceList = $(`.sauce-list`);
  $(`<li class="sauce-list-element" id="${sauce}">${sauce}</li>`).appendTo($sauceList)
}
//remove sauces from sauce list
let removeSauceFromSauceList = (sauce) => {
  $(`#${sauce}`).remove();
}


  


///////////////////////////////////////////
//event handlers for the buttons and ... possibly the inputboxes
  //preventdefault on button clicks
$(document).ready(function() {
  // document.getElementById("display-sauce").style.display = "none";
  // document.getElementById("create-sauce").style.display = "none";
  loadSauceList();
  if (keyExists(`sauceArray`) && Array.isArray(JSON.parse(getItem(`sauceArray`)))){
    loadSelector()
  }else {
    createItem(`sauceArray`, JSON.stringify([]));
  }


  $(`.add-btn`).click(addInput);
  $(`.remove-btn`).click(removeInput);
  $(`#createButton`).click(makeSauce);
  $(`.create-sauce`).click(sauceForm);
  $(`#select-sauce`).click(displaySauce);
  $(`.delete-btn`).click(deleteSauce);
  $(`.home-btn`).click((event) => changePage(`home`));


});
























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
  if (event.currentTarget.classList[1] === 'add-ingredient'){
    $(`.ingredient:first`).clone(true).find(`:input`).val(``).end().appendTo($(`.ingredients-wrapper`));
  }
  if (event.currentTarget.classList[1] === `add-step`){
    $(`.step:first`).clone(true).find(`:input`).val(``).end().find(`label`).text(`Step ${++state.stepNumber}:`).end().appendTo($(`.directions-wrapper`));
  }
  if (event.currentTarget.classList[1] === `add-use`){
    if ($(`.use`).length < 10){
      $(`.use:first`).clone(true).find(`:input`).val(``).end().appendTo($(`.uses-wrapper`));
    }
  }
  if (event.currentTarget.classList[1] === `add-type`){
    if ($(`.type`).length < 3){
      $(`.type:first`).clone(true).find(`:input`).val(``).end().appendTo($(`.type-wrapper`));
    }
  }
}

//remove form field
var removeInput = (event) => {
  //console.log(event);
  event.preventDefault();
  //console.log(event.currentTarget.id);
  if (event.currentTarget.classList[1] === 'remove-ingredient'){
    if ($(`.ingredient`).length > 1){
      $(`.ingredient:last`).remove();
    }    
  }
  if (event.currentTarget.classList[1] === `remove-step`){
    if ($(`.step`).length > 1){
      $(`.step:last`).remove();
      state.stepNumber--;
    }
  }
  if (event.currentTarget.classList[1] === `remove-use`){
    if ($(`.use`).length > 1){
      $(`.use:last`).remove();
    }
  }
  if (event.currentTarget.classList[1] === `remove-type`){
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
  //console.log(data);
  let sauce = {
    ingredients: {},
    directions: {},
    uses: [],
    types: []
  };
  // data = [{name:... ,value:... }....]
  let stepCount = 0;
  for (let i = 0; i < data.length; i++){
    if (data[i][`value`]){
      if (data[i][`name`] === `ingredient`){
        let ingredient = capitalizeFirst(data[i][`value`]);
        sauce.ingredients[ingredient] = data[++i][`value`];
      }else if (data[i][`name`] === `step`){
        let step = `${capitalizeFirst(data[i][`value`])}`
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
  //console.log(sauce);
  if (keyExists(sauce.name)){
    if(confirm(`Are you sure you want to overwrite and existing Sauce?`)){
      saveSauce(sauce);
      resetForm();
    }
  }else{
    saveSauce(sauce);
    resetForm();
  }
  
}

let saveSauce = (sauce) => {
  if (sauce.name){
    if (!keyExists(sauce.name)){
      archiveSauceName(sauce.name);
      addSauceToSelector(sauce.name);
      addSauceToSauceList(sauce.name);
    }
    //console.log(sauce)
    createItem(sauce.name, JSON.stringify(sauce));
    displaySauce(sauce.name);
    console.log(`Sauce Saved`); 
  }else{
    alert(`No Sauce Name!`)
  }
}

var capitalizeFirst = (str) =>{
    return `${str[0].toUpperCase()}${str.slice(1)}`  
}

//toggle between display elements and sauce form
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
  if (state.page === `display`){toggleEditing(false);}
  if (desiredPage === `display`){
    $(`.title`).text(`${state.currentSauce}`);
    document.getElementById("create-sauce").style.display = "none" ;
    document.getElementById("home-page").style.display = "none" ;
    document.getElementById("display-sauce").style.display = "flex";
    $(`.create-sauce`).text(`Create Sauce`); 
    state.page = `display`;
  }else if (desiredPage === `create`){
    $(`.title`).text(`Make a New Sauce!`);
    document.getElementById("display-sauce").style.display = "none" ;
    document.getElementById("home-page").style.display = "none" ;
    document.getElementById("create-sauce").style.display = "flex";
    $(`.create-sauce`).text(`Display Sauce`);  
    state.page = `create`;
  }else if (desiredPage === `home`){
    $(`.title`).text(`Sauces!`);
    document.getElementById("create-sauce").style.display = "none" ;
    document.getElementById("display-sauce").style.display = "none";
    document.getElementById("home-page").style.display = "flex" ;
    $(`.create-sauce`).text(`Create Sauce`); 
    state.page = `home`;
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

//handle select sauce event
let selectSauce = (event) => {
  event.preventDefault();
  displaySauce(event.target.form[0].value);
}


//display sauce
var displaySauce = (sauceName) => {
  
  if (state.page !== `display`){
    changePage(`display`);
  }
  //console.log(event)
  let sauce = JSON.parse(getItem(sauceName));
  //console.log(sauce);
  //display sauce name
  $(`.title`).html(`<u>${sauce.name}</u>`);
  state.currentSauce = sauce.name;

  // display description 
  let $displayDescription = $(`.display-description`);
  $displayDescription.html("");
  let $sauceDescription = $(`<div class="sauce-description"></div>`);
  let $descriptionHeading = $(`<h3>Description</h3>`);
  $sauceDescription.append($descriptionHeading);
  let $description = $(`<div class="description-box">${(sauce.description) ? `${sauce.description}` : ``}</div>`);
  $sauceDescription.append($description);
  let $sauceDescription2 = $(`<div class="sauce-description"></div>`);
  let useString = ``;
  if (sauce.uses.length > 0){
    let temp = sauce.uses.map((val) => `<span class="use-span">${val}</span>`)
    useString = temp.reduce((acc, val) => `${acc}, ${val}`)
  } 
  let $uses = $(`<div class="use-box"><b>Uses:</b> ${useString}</div>`);
  let $spice = $(`<div class="spicy-box"><b>Spicyness: </b>${(sauce.spicyness) ? 
                  `<span class="spice-span">${sauce.spicyness}</span>/10` : `<span class="spice-span"></span>`}</div>`);
  let $prep = $(`<div class="time-box"><b>Prep Time: </b>${(sauce.time) ? 
                  `<span class="time-span">${sauce.time}</span> minutes` : `<span class="time-span"></span>`}</div>`)
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
  let $sauceIngredients = $(`<ul class="sauce-ingredients"></ul>`);
  for (let key in sauce.ingredients){
    let $ingredient = $(`<li class="ingredient-box"><span class="ingredient-span">${key}</span>: 
      <span class="quantity-span">${(sauce.ingredients[key]) ? `${sauce.ingredients[key]}` : ``}</span></li>`)
    $sauceIngredients.append($ingredient);
  }
  $sauceIngredients.appendTo($displayIngredients);

  //display directions
  let $displayDirections = $(`.display-directions`);
  $displayDirections.html("");
  let $directionsHeading = $(`<h3>Directions:</h3>`)
  $displayDirections.append($directionsHeading);
  let $sauceDirections = $(`<ol class="sauce-directions"></ol>`);
  for (let key in sauce.directions){
    let $step = $(`<li class="direction-box">${sauce.directions[key]}</li>`)
    $sauceDirections.append($step);
  }
  $sauceDirections.appendTo($displayDirections);
}

//delete Sauce
let deleteSauce = (event) =>{
  //console.log(event)
  let sauce = $(`.title`).text();
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

//resets form to orignial state
let resetForm = () => {

  let $ingredientsWrapper = $(`.ingredients-wrapper`);
  let $ingredient = $(`.ingredient:first`).clone(true).find(`:input`).val(``).end();
  $ingredientsWrapper.html(``);
  $ingredientsWrapper.text(`Ingredients:`);
  $ingredient.appendTo($ingredientsWrapper);

  let $directionsWrapper = $(`.directions-wrapper`);
  let $step = $(`.step:first`).clone(true).find(`:input`).val(``).end();
  $directionsWrapper.html(``);
  $directionsWrapper.text(`Directions:`);
  $step.appendTo($directionsWrapper);
  state.stepNumber = 1;

  let $usesWrapper = $(`.uses-wrapper`);
  let $use = $(`.use:first`).clone(true).find(`:input`).val(``).end();
  $usesWrapper.html(``);
  $usesWrapper.text(`Uses:`)
  $use.appendTo($usesWrapper);

  let $typeWrapper = $(`.type-wrapper`);
  let $type = $(`.type:first`).clone(true).find(`:input`).val(``).end();
  $typeWrapper.html(``);
  $typeWrapper.text(`Type:`);
  $type.appendTo($typeWrapper);

  document.getElementById("create-sauce").reset();
}



// edit sauces
let toggleEditing = (overRide) => {
  let editables = [`title`, `description-box`, `use-span`, `spice-span`, 
                  `time-span`, `ingredient-span`,`quantity-span`, `direction-box`];

  // [`title`, `description-box`, `use-box`, `spicy-box`, 
  //                   `time-box`, `sauce-ingredients`, `sauce-directions`];
  //console.log(editables.map((val) => document.getElementsByClassName(val)));
  editables = editables.map((val) => document.getElementsByClassName(val));
  //console.log(editables[0][0])
  //console.log(editables[0][0].contentEditable)
  if (editables[0][0].contentEditable == "true" || overRide === false){
    for (let collection of editables){
      for (let element of collection){
        disableEditing(element);
      }
    }
    console.log(`uneditable`);
    getContent();
  }else{
    for (let collection of editables){
      for (let element of collection){
        enableEditing(element);
      }
    }
    console.log(`editable`);
  }
}

//turn editing on
let enableEditing = (element) => {
  //console.log(element);
  element.contentEditable = "true";
  element.style.backgroundColor = "#D3D3D3";
  //element.style.opacity = "0.5"
  //element.style.backgroundColor = "white";
}
//turn editing off
let disableEditing = (element) => {
  element.style.backgroundColor = "transparent";
  element.contentEditable = "false";
  
}

let getContent = () => {
  //console.log(document.getElementsByClassName(`ingredient-box`))
  //toggleEditing(false);
  let pageCollection = [`title`, `description-box`, `use-span`, `spice-span`, 
                  `time-span`, `ingredient-span`,`quantity-span`, `direction-box`];
  pageCollection = pageCollection.map((val) => document.getElementsByClassName(val));
  //console.log(pageCollection);
  let uglyData = []
  for (let itemCollection of pageCollection){
    for (let content of itemCollection){
      uglyData.push({name: content.className, value: content.textContent});
      
    }
  }
  //console.log(uglyData)
  //return uglyData;
  handleUglyData(uglyData);
}

//convert content data to sauce object
let handleUglyData = (data) =>{
  let sauce = {
    rawIngredients: {ingredient:[], quantity:[]},
    ingredients: {},
    directions: {},
    uses: [],
    types: []
  };
  let stepCount = 0;
  for (let i = 0; i < data.length; i++){
    //if (data[i][`value`]){
      data[i][`value`] = data[i][`value`] || ` `;
      if(data[i][`name`] === `title`){
        sauce.name = data[i][`value`];
      }else if (data[i][`name`] === `description-box`){
        sauce.description = data[i][`value`];
      }else if (data[i][`name`] === `use-span`){
        sauce.uses.push(capitalizeFirst(data[i][`value`]));
      }else if (data[i][`name`] === `spice-span`){
        let spice = data[i][`value`]
        if (spice < 0){
          spice = 0;
        }
        if (spice > 11){
          spice = 11;
        }
        sauce.spicyness = spice;
      }else if (data[i][`name`] === `time-span`){
        let time = Number(data[i][`value`])
        sauce.time = time;
      }else if (data[i][`name`] === `ingredient-span`){
        sauce.rawIngredients.ingredient.push(data[i][`value`]);
      }else if (data[i][`name`] === `quantity-span`){
        sauce.rawIngredients.quantity.push(data[i][`value`]);
      } if (data[i][`name`] === `direction-box`){
        let step = `${capitalizeFirst(data[i][`value`])}`
        sauce.directions[`Step ${++stepCount}`] = step;
      }
    //} 
  }
  sauce.rawIngredients.ingredient.forEach((val, i) => {
    sauce.ingredients[val] = sauce.rawIngredients.quantity[i];
  });
  delete sauce.rawIngredients;
  //console.log(sauce);
  if (sauce.name !== ` `){
    //return sauce;
    saveSauce(sauce);
  }else{
    //alert(`invalid sauce name`);
  }
  
}

// utilities for dealing with bugs
let getRidOfGarbage = () => {
  let array = JSON.parse(getItem(`sauceArray`))
  let newArray = []
  array.forEach((val) => {
    if (val !== `` && val !== ` `){
      newArray.push(val);
    }
  });

  updateItem(`sauceArray`,JSON.stringify(newArray));
}
let addSauce = (sauceNames) => {
  if (typeof sauceNames === `string`){
    sauceNames = [sauceNames];
  }
  let array = JSON.parse(getItem(`sauceArray`));
  sauceNames.forEach((val) => array.push(sauceName));
  updateItem(`sauceArray`,JSON.stringify(array));
}




  
let state = {
  page: `home`,
  currentSauce: ``,
  stepNumber: 1
}

///////////////////////////////////////////
//event handlers for the buttons and ... possibly the inputboxes
  //preventdefault on button clicks
$(document).ready(function() {
  if (keyExists(`sauceArray`) && Array.isArray(JSON.parse(getItem(`sauceArray`)))){
    loadSelector()
    loadSauceList();
  }else {
    createItem(`sauceArray`, JSON.stringify([]));
  }



  $(`.add-btn`).click(addInput);
  $(`.remove-btn`).click(removeInput);
  $(`#submit-sauce`).click(makeSauce);
  $(`.create-sauce`).click(sauceForm);
  $(`#select-sauce`).click(selectSauce);
  $(`.delete-btn`).click(deleteSauce);
  $(`.home-btn`).click((event) => changePage(`home`));
  $(`h1`).click((event) => changePage(`home`));
  //$(`.sauce-list-element`).click((event) => displaySauce(event.currentTarget.id));//for some reason this wasnt working with newly added buttons
  $(document).on(`click`,`.sauce-list-element`, (event) => displaySauce(event.currentTarget.id));
  //$(`.edit-btn`).click(toggleEditing);
  $(document).on(`click`,`.edit-btn`, toggleEditing);
});
























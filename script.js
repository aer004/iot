/* PROF NOTE: Updated to be an array of all dragItem class objects */
var dragItems;
var container;
var startLink;

/* PROF NOTE: Now that we have multiple draggable items we need a way to
              store their modified position properties. We can use ann array of JSON */
var draggableData = [];

var active = false;
var currentX;
var currentY;
var initialX;
var initialY;
var xOffset = 0;
var yOffset = 0;

/* PROF NOTE: The "drag" listener will fire on all overlapping elements simultaneously,
              so we need a way to check which our initially clicked element was */
var initialDragElem;

var macTemplate = {
  "class": "draggableItem",
  "id": "item",
  "header": {
    "header-class": "draggableItemHeader",
    "header-id": "itemHeader",
    "header-text": ".mac",
    "header-padding": "10px",
    "header-cursor": "move",
    "header-z-index": "10",
    "header-background-color": "#FFFFFF",
    "header-border": "#000000",
    "header-border-style": "none none double none",
    "header-border-width": "none none medium none",
    "header-color": "#000000",
    "header-pointer-events": "none"
  },
  "img": "mac.jpg",
  "img-pointer-events": "none",
  "img-padding": "10px",
  "footer": {
    "footer-class": "draggableItemFooter",
    "footer-id": "itemFooter",
    "footer-border": "#000000",
    "footer-background-color": "#FFFFFF",
    "footer-z-index": "10",
    "footer-padding": "10px",
    "footer-border-style": "solid none none none",
    "footer-border-top-width": "medium",
    "footer-color": "#000000"
  },
  "touch-action": "none",
  "user-select": "none",
  "margin": "20px",
  "background-color": "#FFFFFF",
  "border": "solid #000000",
  "border-width": "medium thick thick medium",
  "text-align": "center",
  "clip-path": "polygon(0 0, 0 0, 98% 0, 100% 2%, 100% 100%, 100% 100%, 2% 100%, 0% 98%, 0% 0%)"
}

document.addEventListener("DOMContentLoaded", function(){
  container = document.querySelector("#container");
  startLink = document.querySelector("#startlink");
  startLink.addEventListener("mouseup", function(){
    console.log("MOUSE UP!!");
    addMacElements(macTemplate, 4);
    dragItems = document.getElementsByClassName("draggableItem");

    /*Adds addEventListeners to all items with class "draggableItem"*/
    for (item of dragItems) {
      item.addEventListener("touchstart", dragStart, false); //calls dragStart
      item.addEventListener("touchend", dragEnd, false); //calls dragEnd
      item.addEventListener("touchmove", drag, false); //calls drag

      item.addEventListener("mousedown", dragStart, false);
      item.addEventListener("mouseup", dragEnd, false);
      item.addEventListener("mousemove", drag, false);

      /* Adding an entry to our draggableData storage */
      var newDraggableData = {
        "elementReference": item,
        "offset_x": 0,
        "offset_y": 0,
      };
      draggableData.push(newDraggableData);
    };
  });
  window.addEventListener("click", print);
});

function addMacElements(template, num){
  for (let i = 1; i <= num; i++) {
    let newMacElement = document.createElement("DIV");
    newMacElement.classList.add(template['class']);
    newId = template['id'] + i.toString();
    newMacElement.setAttribute("id", newId);
    newMacElement.style.touchAction = template['touch-action'];
    newMacElement.style.userSelect = template['user-select'];
    newMacElement.style.margin = template['margin'];
    newMacElement.style.backgroundColor = template['background-color'];
    newMacElement.style.border = template['border'];
    newMacElement.style.borderWidth = template['border-width'];
    newMacElement.style.textAlign = template['text-align'];
    newMacElement.style.clipPath = template['clip-path'];

    let newMacHeader = document.createElement("DIV");
    newMacHeader.classList.add(template['header']['header-class']);
    newHeaderId = template['header']['header-id'] + i.toString();
    newMacHeader.setAttribute("id", newHeaderId);
    newMacHeader.innerText = template['header']['header-text'] + i.toString();
    console.log(newMacHeader);
    newMacHeader.style.padding = template['header']['header-padding'];
    newMacHeader.style.cursor = template['header']['header-cursor'];
    newMacHeader.style.zIndex = template['header']['header-z-index'];
    newMacHeader.style.backgroundColor = template['header']['header-background-color'];
    newMacHeader.style.border = template['header']['header-border'];
    newMacHeader.style.borderStyle = template['header']['header-border-style'];
    newMacHeader.style.borderWidth = template['header']['header-border-width'];
    newMacHeader.style.color = template['header']['header-color'];
    newMacHeader.style.pointerEvents = template['header']['header-pointer-events'];
    newMacElement.appendChild(newMacHeader);

    let newMacImage = document.createElement("IMG");
    newMacImage.src = template['img'];
    //newClassoverImg = document.querySelector("draggableItem > img");
    newMacImage.pointerEvents = template['img-pointer-events'];
    newMacImage.style.padding = template['img-padding'];
    newMacElement.appendChild(newMacImage);

    let newMacFooter = document.createElement("DIV");
    newMacFooter.classList.add(template['footer']['footer-class']);
    newFooterId = template['footer']['footer-id'] + i.toString();
    newMacFooter.setAttribute("id", newFooterId);
    newMacFooter.style.border = template['footer']['footer-border'];
    newMacFooter.style.backgroundColor = template['footer']['footer-background-color'];
    newMacFooter.style.zIndex = template['footer']['footer-z-index'];
    newMacFooter.style.padding = template['footer']['footer-padding'];
    newMacFooter.style.borderStyle = template['footer']['footer-border-style'];
    newMacFooter.style.borderTopWidth = template['footer']['footer-border-top-width'];
    newMacFooter.style.color = template['footer']['footer-color'];
    newMacElement.appendChild(newMacFooter);

    container.appendChild(newMacElement);
  }
}

function print(){
  console.log("HELLLLLLLLLLLO)");
}

function dragStart(e) {

  console.log("Drag START on: " + e.target.id);

  if (!active) {
    initialDragElem = e.target;
    console.log("Set initial drag element to: " + initialDragElem.id);
  }

/* PROF NOTE: When you drag things around they maintain their original Z-index "layer"–
              This is a quick fix to ensure that the one currently being dragged
              "pops" to the top of the stack. This is a simplified approach that
              does create one visual bug because it resets all of them to "0", meaning
              that it doesn't maintain the layer stack for previously clicked items.*/
  for (item of dragItems) {
    if (item == e.target) {
      item.style.zIndex = "+99";
    }
    else {
      item.style.zIndex = "0";
    }
  }

  /* Get the matching element's offset from our JSON */
  var thisElementOffsetX;
  var thisElementOffsetY;

  for (dataItem of draggableData) {
    if (dataItem["elementReference"] == e.target) {
      thisElementOffsetX = dataItem["offset_x"];
      thisElementOffsetY = dataItem["offset_y"];
    }
  }

  xOffset = thisElementOffsetX;
  yOffset = thisElementOffsetY;

  if (e.type === "touchstart") {
    initialX = e.touches[0].clientX - xOffset;
    initialY = e.touches[0].clientY - yOffset;
  } else {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;
  }

/* PROF NOTE: Now that we have multiple draggable items, instead of checking if the
              e.target item is equal to the one we selected, we can just check if
              it has the "draggableItem" class to allow dragging. */
  // if (e.target === dragItem) {
  //   active = true;
  // }
  if (e.target.classList.contains("draggableItem")) {
    active = true;
  }
}

function dragEnd(e) {
  /* Set the offset position for the individual item in our JSON */
  for (dataItem of draggableData) {
    if (dataItem["elementReference"] == initialDragElem) {
      dataItem["offset_x"] = xOffset;
      dataItem["offset_y"] = yOffset;
    }
  }

  checkOverlap(e.target);

  active = false;
}

function drag(e) {
  if (active) {

    // console.log("Dragging: " + e.target.id);

    e.preventDefault();

    if (e.type === "touchmove") {
      currentX = e.touches[0].clientX - initialX;
      currentY = e.touches[0].clientY - initialY;
    } else {
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
    }

    xOffset = currentX;
    yOffset = currentY;

/* PROF NOTE: Because the "drag" event fires on whatever element we are hovered over,
              we want to make sure to translate the one we *initially* clicked on,
              rather than the one being passed through our "e" event target */
    // setTranslate(currentX, currentY, dragItem);
    setTranslate(currentX, currentY, initialDragElem);

  }
}

function setTranslate(xPos, yPos, el) {
  el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}

/*
Function checks if items with class "draggableItem" are overlapping.
dragItems element is all items that have the class "draggableItem"
Function iterates over dragItems elements, checking two by two
if items are overlapping, and sets colors occordingly.
If two items overlap, and they are supposed to, they get set with green borders
if they aren't supposed to, they get set with red borders.
Items that have no overlap have black borders.
*/
/*CHANGE TO INCLUDE GENERTAED DIVS:
  depending on the number of genearted divs (always even), create list with numbers from 1 to x
  using Fisher-Yates Shuffle (?) to shuffle list

  function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }

  Code from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

  Split list into tuples, each tuples being the 'match'
*/

function checkOverlap(el) {
  var flag_items = {
    "itemA": "False",
    "itemB": "False",
    "itemC": "False",
    "itemD": "False"
  }
  /* CHECK FOR OVERLAP */
  for (item of dragItems) {

    /* Logic to not check against itself */
    if (item != el) {
      /* Bounding box of currently dragging element */
      var rect1 = el.getBoundingClientRect();
      /* Bounding box of other elements we are looping through */
      var rect2 = item.getBoundingClientRect();

      /* Comparing the bounds of the two elements */
      var overlap = !(rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom)
      /* If item and el are not overlapping, set them to borderColor = black */
      /*
      if (!overlap) {
        console.log("Item: ", item.id);
        console.log("El: ", el.id);
        console.log("NOT OVERLAPPING");
        item.style.borderColor = "#000000";
        el.style.borderColor = "#000000";
        /* BUGGGGGGGG:
        As loop goes on, it detects if pairs are not overlapping.
        So A overlap with B
        Then B not overlap with C
        Then C not overlap with D
        Because it goes in order from A to D, even though a and b overlap,
        because B and C dont overlap, it sets both to black, changing what the first iteration did.
      }
      */
      /* PROF NOTE: Here we confirm the overlap and can fire off specific behavior based
                  on the matching IDs */
      if (overlap) {
        // console.log("Overlapping: " + item.id + " and " + e.target.id);
        if ((item.id == "itemA" && el.id == "itemB") || (item.id == "itemB" && el.id == "itemA")){
          console.log("A AND B ARE OVERLAPPING, COOL!");
          itemA.style.borderColor = "#00ee00"; //green
          itemB.style.borderColor = "#00ee00";
          flag_items["itemA"] = "True";
          flag_items["itemB"] = "True";
        }
        else if ((item.id == "itemB" && el.id == "itemC") || (item.id == "itemC" && el.id == "itemB")){
          console.log("Hey, now B and C are overlapping.");
          itemB.style.borderColor = "#dd0000"; //red
          itemC.style.borderColor = "#dd0000";
          flag_items["itemB"] = "True";
          flag_items["itemC"] = "True";
        }
        else if ((item.id == "itemA" && el.id == "itemC") || (item.id == "itemC" && el.id == "itemA")){
          console.log("And now we've got an overlap between A and C!");
          itemC.style.borderColor = "#dd0000";
          itemA.style.borderColor = "#dd0000";
          flag_items["itemA"] = "True";
          flag_items["itemC"] = "True";
        }
        else if ((item.id == "itemD" && el.id == "itemC") || (item.id == "itemC" && el.id == "itemD")){
          console.log("C D OVERLAP");
          itemC.style.borderColor = "#00ee00";
          itemD.style.borderColor = "#00ee00";
          flag_items["itemD"] = "True";
          flag_items["itemC"] = "True";
        }
        else if ((item.id == "itemD" && el.id == "itemB") || (item.id == "itemB" && el.id == "itemD")){
          console.log("B D OVERLAP");
          itemB.style.borderColor = "#dd0000";
          itemD.style.borderColor = "#dd0000";
          flag_items["itemB"] = "True";
          flag_items["itemD"] = "True";
        }
        else if ((item.id == "itemD" && el.id == "itemA") || (item.id == "itemA" && el.id == "itemD")){
          console.log("A D OVERLAP");
          itemA.style.borderColor = "#dd0000";
          itemD.style.borderColor = "#dd0000";
          flag_items["itemA"] = "True";
          flag_items["itemD"] = "True";
        }
      }
      if (!overlap) {
        console.log("NOT OVERLAPPING");

        if (flag_items[item.id] == "False"){
          item.style.borderColor = "#000000";
        }
        if (flag_items[el.id] == "False"){
          el.style.borderColor = "#000000";
        }
      }
    }
  }
}

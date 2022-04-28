/* PROF NOTE: Updated to be an array of all dragItem class objects */
// var dragItem = document.querySelector("#item");
var dragItems = document.getElementsByClassName("draggableItem");
var container = document.querySelector("#container");

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

/* PROF NOTE: Your initial code was listening for mouse events on the container,
              rather than on the items themselves */

// container.addEventListener("touchstart", dragStart, false);
// container.addEventListener("touchend", dragEnd, false);
// container.addEventListener("touchmove", drag, false);
//
// container.addEventListener("mousedown", dragStart, false);
// container.addEventListener("mouseup", dragEnd, false);
// container.addEventListener("mousemove", drag, false);

window.addEventListener("click", print);

function print(){
  console.log("HELLLLLLLLLLLO)")
}

for (item of dragItems) {
  item.addEventListener("touchstart", dragStart, false);
  item.addEventListener("touchend", dragEnd, false);
  item.addEventListener("touchmove", drag, false);

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
      // if (!overlap) {
      //   console.log("Item: ", item.id);
      //   console.log("El: ", el.id);
      //   console.log("NOT OVERLAPPING");
      //   item.style.borderColor = "#000000";
      //   el.style.borderColor = "#000000";
      //   /* BUGGGGGGGG:
      //   As loop goes on, it detects if pairs are not overlapping.
      //   So A overlap with B
      //   Then B not overlap with C
      //   Then C not overlap with D
      //   Because it goes in order from A to D, even though a and b overlap,
      //   because B and C dont overlap, it sets both to black, changing what the first iteration did.
      //   */
      // }
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

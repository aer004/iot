var dragItems;
var container;
var startLink;

var draggableData = [];

var active = false;
var currentX;
var currentY;
var initialX;
var initialY;
var xOffset = 0;
var yOffset = 0;

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
};

var articleTemplate = {
  "class": "draggableItem",
  "id": "article",
  "header": {
    "header-class": "draggableArticleHeader",
    "header-id": "articleHeader",
    "header-text": "",
    "header-padding": "15px",
    "header-cursor": "move",
    "header-z-index": "10",
    "header-background-color": "#FFFFFF",
    "header-border": "#000000",
    "header-border-style": "none none double none",
    "header-border-width": "none none medium none",
    "header-color": "#000000",
    "header-pointer-events": "none"
    },
  "footer": {
    "footer-class": "draggableArticleFooter",
    "footer-id": "articleFooter",
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
};

var articleLinks = {
  "1": {
    "title": "Insteon is down and may not be coming back",
    "link": "https://staceyoniot.com/insteon-is-down-and-may-not-be-coming-back/"
  },
  "2": {
    "link": "https://www.youtube.com/watch?v=5cWck_xcH64",
    "title": "Defcon 20 - Dan Tentler - Drinking from the caffeine firehose we know as shodan"
  },
  "3": {
    "link": "https://www.asisonline.org/security-management-magazine/articles/2017/03/outdated-protocols-and-practices-put-the-iot-revolution-at-risk/",
    "title": "Outdated Protocols and Practices Put the IoT Revolution at Risk"
  },
  "4": {
    "link": "https://www.forbes.com/sites/hodfleishman/2020/01/07/its-2020-lets-stop-saying-iot/?sh=2992663e73dd",
    "title": "It’s 2020. Let’s Stop Saying “IoT.” (Part I)"
  },
  "5": {
    "link": "https://spectrum.ieee.org/the-internet-of-trash-iot-has-a-looming-ewaste-problem",
    "title": "The Internet of Trash: IoT Has a Looming E-Waste Problem "
  },
  "6": {
    "link": "https://spectrum.ieee.org/the-iots-ewaste-problem-isnt-inevitable",
    "title": "The IoT’s E-Waste Problem Isn’t Inevitable"
  },
  "7": {
    "link": "https://spectrum.ieee.org/the-cybersecurity-of-e-waste",
    "title": "E-Waste Is a Cybersecurity Problem, Too"
  },
  "8": {
    "link": "https://dl.acm.org/doi/abs/10.1145/3393914.3395918?casa_token=G90g3ie2qTAAAAAA:hyQCcdeeBWy-Xlliclt3fm7WDfawBUzK3Ii2RQJqO8ln0VF54i5iy18L1_fP45eOluAr1vjXZQE",
    "title": "Designing for the End of Life of IoT Objects"
  }
};

//THINGS TO DO:
//* Make divs load only in area inside 'desktop'
//* Update checkOverlap function so that it matchs random tuples from list
var num_mac = Math.floor(Math.random() * (10 - 4) + 4); //min = 4 max = 8
num_mac = (Math.floor(num_mac / 2)) * 2;
var mac_print_flag = "False";
article_index = 1;
document.addEventListener("DOMContentLoaded", function(){
  container = document.querySelector("#container");
  startLink = document.querySelector("#startlink");
  startLink.addEventListener("mouseup", function(){
    // console.log("Before IF");
    // if (dragItems != null){
    //   console.log("BEFORE LOOP");
    //   perm_length = dragItems.length
    //   for (let i = 0; i < perm_length; i++){
    //     console.log("item: ", item);
    //     dragItems[i].remove();
    //     //item.remove();
    //     console.log("REMOVE");
    //     console.log("dragItems loop!!!: ", dragItems);
    //   }
    //   console.log("dragItems after!!!: ", dragItems);
    //   // for (item of dragItems){
    //   //   console.log("item: ", item);
    //   //   item.remove();
    //   //    console.log("REMOVE");
    //   // }
    // }

    while (container.hasChildNodes()) {
      container.removeChild(container.firstChild);
    }

    mac_tuple = mac_pairs(num_mac);
    addMacElements(macTemplate, num_mac);
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
    console.log("END OF LISTENER");
  });
  window.addEventListener("click", function(){
    if (mac_print_flag == "True"){
      addArticleElements(articleTemplate, articleLinks, article_index);
      let new_id = articleTemplate['id'] + article_index.toString();
      let article_item = document.getElementById(new_id);
      dragItems = document.getElementsByClassName("draggableItem");
      console.log(dragItems);
      article_index += 1;
      article_item.addEventListener("touchstart", dragStart, false); //calls dragStart
      article_item.addEventListener("touchend", dragEnd, false); //calls dragEnd
      article_item.addEventListener("touchmove", drag, false); //calls drag

      article_item.addEventListener("mousedown", dragStart, false);
      article_item.addEventListener("mouseup", dragEnd, false);
      article_item.addEventListener("mousemove", drag, false);

      /* Adding an entry to our draggableData storage */
      var newDraggableData = {
        "elementReference": article_item,
        "offset_x": 0,
        "offset_y": 0,
      };
      draggableData.push(newDraggableData);
    };
  });
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

function addArticleElements(articleTemplate, articleLinks, index){
  console.log(index);
  let newArticleElement = document.createElement("DIV");
  newArticleElement.classList.add(articleTemplate['class']);
  let newId = articleTemplate['id'] + index.toString();
  newArticleElement.setAttribute("id", newId);
  newArticleElement.style.touchAction = articleTemplate['touch-action'];
  newArticleElement.style.userSelect = articleTemplate['user-select'];
  newArticleElement.style.margin = articleTemplate['margin'];
  newArticleElement.style.backgroundColor = articleTemplate['background-color'];
  newArticleElement.style.border = articleTemplate['border'];
  newArticleElement.style.borderWidth = articleTemplate['border-width'];
  newArticleElement.style.textAlign = articleTemplate['text-align'];
  newArticleElement.style.clipPath = articleTemplate['clip-path'];

  let newArticleHeader = document.createElement("DIV");
  newArticleHeader.classList.add(articleTemplate['header']['header-class']);
  let newHeaderId = articleTemplate['header']['header-id'] + index.toString();
  newArticleHeader.setAttribute("id", newHeaderId);
  newArticleHeader.style.padding = articleTemplate['header']['header-padding'];
  newArticleHeader.style.cursor = articleTemplate['header']['header-cursor'];
  newArticleHeader.style.zIndex = articleTemplate['header']['header-z-index'];
  newArticleHeader.style.backgroundColor = articleTemplate['header']['header-background-color'];
  newArticleHeader.style.border = articleTemplate['header']['header-border'];
  newArticleHeader.style.borderStyle = articleTemplate['header']['header-border-style'];
  newArticleHeader.style.borderWidth = articleTemplate['header']['header-border-width'];
  newArticleHeader.style.color = articleTemplate['header']['header-color'];
  newArticleHeader.style.pointerEvents = articleTemplate['header']['header-pointer-events'];
  newArticleElement.appendChild(newArticleHeader);

  let newArticleBody = document.createElement("p");
  newArticleBody.innerText = articleLinks[index]['title'];
  newArticleBody.pointerEvents = 'none';
  newArticleElement.appendChild(newArticleBody);

  let newArticleLink = document.createElement("A");
  newArticleLink.setAttribute("href", articleLinks[index]['link']);
  newArticleLink.appendChild(newArticleBody);
  newArticleElement.appendChild(newArticleLink);


  let newArticleFooter = document.createElement("DIV");
  newArticleFooter.classList.add(articleTemplate['footer']['footer-class']);
  let newFooterId = articleTemplate['footer']['footer-id'] + index.toString();
  newArticleFooter.setAttribute("id", newFooterId);
  newArticleFooter.style.border = articleTemplate['footer']['footer-border'];
  newArticleFooter.style.backgroundColor = articleTemplate['footer']['footer-background-color'];
  newArticleFooter.style.zIndex = articleTemplate['footer']['footer-z-index'];
  newArticleFooter.style.padding = articleTemplate['footer']['footer-padding'];
  newArticleFooter.style.borderStyle = articleTemplate['footer']['footer-border-style'];
  newArticleFooter.style.borderTopWidth = articleTemplate['footer']['footer-border-top-width'];
  newArticleFooter.style.color = articleTemplate['footer']['footer-color'];
  newArticleElement.appendChild(newArticleFooter);

  //WHYYY dont it work???
  let x = document.body.offsetHeight-newArticleElement.clientHeight;
	let y = document.body.offsetWidth-newArticleElement.clientWidth;
	let randomX = Math.floor(Math.random()*x);
	let randomY = Math.floor(Math.random()*y);

  newArticleElement.style.transform = "translate3d(" + randomX + "px, " + randomY + "px, 0)";

  container.appendChild(newArticleElement);
}


function dragStart(e) {
  mac_print_flag = "True";
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

    console.log("Dragging: " + e.target.id);

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
var mac_index = [];
var mac_tuple = [];
var flag_items = {};
function mac_pairs(num_mac) {
  for (let i = 1; i <= num_mac; i++){
    mac_index.push('item' + i);
  }
  let curr_i = mac_index.length, rand_i;
  while (curr_i != 0){
    rand_i = Math.floor(Math.random() * curr_i);
    curr_i--;

    [mac_index[curr_i], mac_index[rand_i]] = [mac_index[rand_i], mac_index[curr_i]];
  }
  for (let i = 0; i < num_mac; i += 2){
     mac_tuple.push([mac_index[i], mac_index[i + 1]])
  }
  return mac_tuple;
}


function checkOverlap(el) {
  var flag_items = {};
  for (let i = 0; i < num_mac; i++){
    flag_items[mac_index[i]] = "False";
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
      if (overlap){
        for (let i = 0; i < mac_tuple.length; i++){
          if ((item.id == mac_tuple[i][0]) || (item.id == mac_tuple[i][1])) {
            if ((el.id == mac_tuple[i][0]) || (el.id == mac_tuple[i][1])) {
              item.style.borderColor = "#00ee00"; //green
              el.style.borderColor = "#00ee00";
              flag_items[item.id] = "True";
              flag_items[el.id] = "True";
            }
          }
          else {
            if (flag_items[item.id] == "False"){
              item.style.borderColor = "#dd0000";
              flag_items[item.id] = "True";
            }
            if (flag_items[el.id] == "False"){
              el.style.borderColor = "#dd0000"; //red
              flag_items[el.id] = "True";
            }
          }
        }
      }
      if (!overlap){
        //console.log("NOT OVERLAPPING");

        if (flag_items[item.id] == "False"){
          item.style.borderColor = "#000000";
        }
        if (flag_items[el.id] == "False"){
          el.style.borderColor = "#000000";
        }
      }
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
      // for (let i = 0; i < num_mac; i += 2){
      //   itemA = document.getElementById(mac_index[i]);
      //   itemB = document.getElementById(mac_index[i+1]);
      //   if (overlap){
      //     if ((item.id == mac_index[i] && el.id == mac_index[i + 1]) || (item.id == mac_index[i + 1] && el.id == mac_index[i])){
      //       console.log(mac_index[i], " and ",mac_index[i + 1], " ARE OVERLAPPING");
      //       itemA.style.borderColor = "#00ee00"; //green
      //       itemB.style.borderColor = "#00ee00";
      //       flag_items[mac_index[i]] = "True";
      //       flag_items[mac_index[i + 1]] = "True";
      //     }
      //     else if ((item.id == mac_index[i] && el.id != mac_index[i + 1]) || (item.id != mac_index[i + 1] || el.id == mac_index[i])){
      //       console.log(mac_index[i], " and ",mac_index[i + 1], " ARE OVERLAPPING, BUT NOT MATCHING");
      //       itemA.style.borderColor = "#dd0000"; //red
      //       itemB.style.borderColor = "#dd0000"; //red
      //       flag_items[mac_index[i]] = "True";
      //       flag_items[mac_index[i + 1]] = "True";
      //     }
      //   }
      //   if (!overlap){
      //     console.log("NOT OVERLAPPING");
      //
      //     if (flag_items[item.id] == "False"){
      //       item.style.borderColor = "#000000";
      //     }
      //     if (flag_items[el.id] == "False"){
      //       el.style.borderColor = "#000000";
      //     }
      //   }
      // }
      // if (overlap) {
      //   console.log("Overlapping: " + item.id + " and " + e.target.id);
      //   if ((item.id == "item1" && el.id == "item2") || (item.id == "item2" && el.id == "item1")){
      //     console.log("1 AND 2 ARE OVERLAPPING, COOL!");
      //     item1.style.borderColor = "#00ee00"; //green
      //     item2.style.borderColor = "#00ee00";
      //     flag_items["item1"] = "True";
      //     flag_items["item2"] = "True";
      //   }
      //   else if ((item.id == "item2" && el.id == "item3") || (item.id == "item3" && el.id == "item2")){
      //     console.log("Hey, now 2 and 3 are overlapping.");
      //     item2.style.borderColor = "#dd0000"; //red
      //     item3.style.borderColor = "#dd0000";
      //     flag_items["item2"] = "True";
      //     flag_items["item3"] = "True";
      //   }
      //   else if ((item.id == "item1" && el.id == "item3") || (item.id == "item3" && el.id == "item1")){
      //     console.log("And now we've got an overlap between A and C!");
      //     item3.style.borderColor = "#dd0000";
      //     item1.style.borderColor = "#dd0000";
      //     flag_items["item1"] = "True";
      //     flag_items["item3"] = "True";
      //   }
      //   else if ((item.id == "item4" && el.id == "item3") || (item.id == "item3" && el.id == "item4")){
      //     console.log("C D OVERLAP");
      //     item3.style.borderColor = "#00ee00";
      //     item4.style.borderColor = "#00ee00";
      //     flag_items["item4"] = "True";
      //     flag_items["item3"] = "True";
      //   }
      //   else if ((item.id == "item4" && el.id == "item2") || (item.id == "item2" && el.id == "item4")){
      //     console.log("2 4 OVERLAP");
      //     item2.style.borderColor = "#dd0000";
      //     item4.style.borderColor = "#dd0000";
      //     flag_items["item2"] = "True";
      //     flag_items["item4"] = "True";
      //   }
      //   else if ((item.id == "item4" && el.id == "item1") || (item.id == "item1" && el.id == "item4")){
      //     console.log("1 4 OVERLAP");
      //     item1.style.borderColor = "#dd0000";
      //     item4.style.borderColor = "#dd0000";
      //     flag_items["item1"] = "True";
      //     flag_items["item4"] = "True";
      //   }
      // }
      // if (!overlap) {
      //   console.log("NOT OVERLAPPING");
      //
      //   if (flag_items[item.id] == "False"){
      //     item.style.borderColor = "#000000";
      //   }
      //   if (flag_items[el.id] == "False"){
      //     el.style.borderColor = "#000000";
      //   }
      // }
    }
  }
}

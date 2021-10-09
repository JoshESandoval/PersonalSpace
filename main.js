let shelfImg = "./Icons/personalSpaceBookShelf.png";
let deskImg = "./Icons/personalSpaceDesk.png"

//*****Class and Sub-Class definitions for container*****

class Container {
    constructor(name_, type_, image_){
        this.name = name_;
        this.type = type_;
        this.image = image_;
        this.itemList = [];
    }
    getName() {
        return this.name;
    }
    getImg(){
        return this.image;
    }
    
};

class Bookshelf extends Container {
    constructor(name_,type_,image_) {
        super(name_, type_, image_);
        this.parent;
    }
}

class Desk extends Container {
    constructor(name_, type_, image_) {
        super(name_, type_, image_);
        this.parent;
    }
}


//*****Updates and Backbone

//contains all elements of type Container and Extendents for searching
let containerPool = [];

let example = new Container("Example", "Shelf", shelfImg);
containerPool.push(example);
let workingContainer = example;

updateWCV();

function updateWCV() {
    let workingCV = document.getElementById("wcvLabel");
    let workingCVImg = document.getElementById("wcvImg");
    let workingCVItems = document.getElementById("wcvItems")

    workingCV.innerHTML = workingContainer.getName();
    workingCVImg.src = workingContainer.getImg();
    workingCVItems.innerHTML = workingContainer.itemList ;
}

function findContainerWithName(aName) {
    for (let i = 0; i < containerPool.length; i++) {
        let temp = containerPool[i];
        if (temp.getName() == aName) {
            workingContainer = containerPool[i];
        }
    }
    updateWCVJSON();
}

function updateRoom() {
    let room = document.getElementById("roomTitle");
    room.innerHTML = roomSelect.value;
}

function addRoom() {
    let aRoom = '';
    aRoom = prompt("What is the name of this room?");
    let roomSelectH = document.getElementById("roomSelect");
    let aNode = document.createElement("option");
    aNode.value = aNode.id = aNode.innerHTML = aRoom;
    roomSelectH.appendChild(aNode);
     
}

function updateShelf() {

}

function addItem() {
    let submit = document.getElementById("addItem");

    workingContainer.itemList.push(submit.value);
    updateWCV();
}

function addItemJSON() {
    let submit = document.getElementById("addItem");
    let row = document.getElementById("shelfSelect");

    let temp = [{ 'row': row.value , 'name': submit.value }];

    workingContainer.itemList.push(temp);
    updateWCVJSON();
    submit.value = '';
}

/**
function addItemJSON( row , itemName) {
    let temp = [{ 'row' : row, 'name' : itemName }];
    
    workingContainer.itemList.push(temp);
    updateWCVJSON();
}
*/

function updateWCVJSON() { 
    let workingCV = document.getElementById("wcvLabel");
    let workingCVImg = document.getElementById("wcvImg");
    let workingCVItems = document.getElementById("wcvItems")

    workingCV.innerHTML = workingContainer.getName();
    workingCVImg.src = workingContainer.getImg();
    workingCVItems.innerHTML = '';
    for (let item = 0; item < workingContainer.itemList.length; item++){
        for (let items = 0; items < 1; items++) {
            workingCVItems.innerHTML += workingContainer.itemList[item][items].row + ' : ' + workingContainer.itemList[item][items].name + '<br>';
        }
    }
}

//*****Drag and Drop functions

let aList = document.querySelectorAll('.roomDisplay');

aList.forEach(item => {
    addListeners(item);
});

function addListeners(temp) {
    temp.addEventListener("dragstart", dragStart)
    temp.addEventListener("dragenter", dragEnter);
    temp.addEventListener("dragLeave", dragLeave);
    temp.addEventListener("drop", drop);
    temp.addEventListener("dragOver", dragOver);
}

function dragStart(ev) {
    ev.dataTransfer.setData('text/plain', ev.target.id); 
}

function dragEnter(ev) {
    ev.preventDefault();
}

function dragOver(ev) {
    ev.preventDefault();
}

function dragLeave(ev) {

}

function drop(ev) {
    const id = ev.dataTransfer.getData('text/plain');
    const draggable = document.getElementById(id);

    //Fixes issue where images would be deleted if dropped on another image
    if (ev.target.id == null || ev.target.id =='') {
        ev.target.appendChild(draggable);
    }
    else {
        alert("Unable to drop here :(")
    }

}

function createContainer(type) {
      
    let anId = prompt("Lable/Name for " + type);

    if (anId != '') {
        let acontainerPool = document.getElementById('roomFeatures');
        let duplicatedNode = document.createElement("img");
        //Links image to appropriate 
        if (type == 'shelf') {
            duplicatedNode.src = "./Icons/personalSpaceBookShelf.png";
            let temp = new Bookshelf(anId, type, shelfImg);
            containerPool.push(temp);
        }
        else if (type == 'desk') {
            duplicatedNode.src = "./Icons/personalSpaceDesk.png";
            let temp = new Container(anId, type, deskImg);
            containerPool.push(temp);
        }

        duplicatedNode.draggable = true;
        duplicatedNode.id = anId;
        duplicatedNode.onclick = () => { findContainerWithName(anId) };
        addListeners(duplicatedNode);

        acontainerPool.appendChild(duplicatedNode);
    }
}





/***** Java Script For Personal Space 
 -Headings
    * Global Definitions
    * Class Definitions
    * Main Logic
    * Updates / Deletions
    * Drag and Drop
 */


//***** Global Definitions *****//


let lastRoom = 'Kitchen';
let shelfImg = "./Icons/personalSpaceBookShelf.png";
let deskImg = "./Icons/personalSpaceDesk.png";


//***** Class and Child-Class definitions for Container *****//


class Container {
    constructor(name_, type_, image_) {
        this.name = name_;
        this.type = type_;
        this.image = image_;
        this.room = roomSelect.value;
        this.itemList = [];
        this.sourceParent;
    }

    getName() {
        return this.name;
    }

    getImg() {
        return this.image;
    }

    getParent() {
        return this.sourceParent;
    }

    setParent(parent) {
        this.sourceParent = parent;
    }

    getRoom() {
        return this.room;
    }
};

class Bookshelf extends Container {
    constructor(name_, type_, image_) {
        super(name_, type_, image_);
    }
}

class Desk extends Container {
    constructor(name_, type_, image_) {
        super(name_, type_, image_);
    }
}


//***** Main Logic / Structures *****//


//Contains Container Elements: Code Block sets up container view
let containerPool = [];
let example = new Container("Example", "Shelf", shelfImg);
let workingContainer = example;
containerPool.push(example);
updateWCVJSON();

function createContainer(type) {
    let anId = prompt("Lable/Name for " + type);

    //ensures Container can be 'tracked'
    if (anId != '') {
        let acontainerPool = document.getElementById('roomFeatures');
        let duplicatedNode = document.createElement("img");

        //links container type/class/img to image node created above : hope to generalize function to shorten
        if (type == 'shelf') {
            duplicatedNode.src = "./Icons/personalSpaceBookShelf.png";
            let temp = new Bookshelf(anId, type, shelfImg);
            temp.setParent(this);
            containerPool.push(temp);
        }
        else if (type == 'desk') {
            duplicatedNode.src = "./Icons/personalSpaceDesk.png";
            let temp = new Container(anId, type, deskImg);
            temp.setParent(this);
            containerPool.push(temp);
        }

        duplicatedNode.draggable = true;
        duplicatedNode.id = anId;
        duplicatedNode.onclick = () => { findContainerWithName(anId) };
        addListeners(duplicatedNode);

        acontainerPool.appendChild(duplicatedNode);
    }
    else {
        createContainer(type);
    }
}

//recreates image-container link after room change
function recreateContainer(container) {
    let anId = container.getName();
    let imageNode = document.createElement("img");

    imageNode.src = container.getImg();
    imageNode.draggable = true;
    imageNode.id = anId;
    imageNode.onclick = () => { findContainerWithName(anId) };
    addListeners(imageNode);

    let parent = container.getParent();
    parent.appendChild(imageNode);
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

//True returns element, False returns index
function findContainerToChange(aName, giveNode) {
    for (let i = 0; i < containerPool.length; i++) {
        let temp = containerPool[i];
        if (temp.getName() == aName) {
            if (giveNode) {
                return containerPool[i];
            }
            else {
                return i;
            }
        }
    }
}

function addRoom() {
    let aRoom = '';
    aRoom = prompt("What is the name of this room?");

    let roomSelectHeader = document.getElementById("roomSelect");
    let aNode = document.createElement("option");
    aNode.value = aNode.id = aNode.innerHTML = aRoom;

    roomSelectHeader.appendChild(aNode);
}

function addItemJSON() {
    if (workingContainer != example) {
        let submit = document.getElementById("addItem");
        let row = document.getElementById("shelfSelect");
        let temp = [{ 'row': row.value, 'name': submit.value }];

        workingContainer.itemList.push(temp);
        updateWCVJSON();
        submit.value = '';
    }
    else {
        alert('Cannot add items to the Example ');
    }
}


//***** Updates / Deletions *****//


function updateWCVJSON() {
    let workingCV = document.getElementById("wcvLabel");
    let workingCVImg = document.getElementById("wcvImg");
    let workingCVItems = document.getElementById("wcvItems");
    
    workingCV.innerHTML = workingContainer.getName();
    workingCVImg.src = workingContainer.getImg();
    workingCVItems.innerHTML = '';

    //Displays items attatched to Working Container
    for (let item = 0; item < workingContainer.itemList.length; item++) {
        for (let items = 0; items < 1; items++) {
            workingCVItems.innerHTML += workingContainer.itemList[item][items].row + ' : ' + workingContainer.itemList[item][items].name + '<br>';
        }
    }
}

function updateRoom() {
    if (lastRoom == roomSelect.value) {
        //Room hasn't changed : prevents 'active' nodes from being recreated
    }
    else {
        findContainerWithName('Example');

        let room = document.getElementById("roomTitle");
        room.innerHTML = roomSelect.value;

        for (let i = 0; i < containerPool.length; i++) {
            let temp = containerPool[i];
            if (temp.getName() == 'Example') {
                //Fixes 'no-parent' error : no-parent allows Example to be displayed in any room
            }
            else if (temp.getRoom() == roomSelect.value) {
                //Room has changed so 
                recreateContainer(temp);
            }
            else {
                let parent = temp.getParent();
                let child = document.getElementById(temp.getName());

                if (child == null) {
                    //unactive Container attempting to be deactivated
                }
                else {
                    parent.removeChild(child);
                }
            }
        }
        lastRoom = roomSelect.value;
    }
}

function updateShelf() {
    //will sort items relative to shelf
}

function deleteContainer(id) {
    containerPool.splice(findContainerToChange(id), false);
}


//*****Drag and Drop functions


//Sets up Drag and Drop field for table and trash
let aList = document.querySelectorAll('.roomDisplay');
addListeners(document.getElementById('trash'));
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

    if (ev.target.id == "trash") {
        deleteContainer(id);
        if (draggable != null) {
            let parent = draggable.parentNode;
            parent.removeChild(draggable);
            findContainerWithName('Example');
        }
    }
    else if (ev.target.parentNode.id == "row" || ev.target.id == '') {
        ev.target.appendChild(draggable);
        workingContainer = findContainerToChange(draggable.id, true);
        workingContainer.setParent(ev.target);
    }
    else {
        //Fixes issue where images would be deleted if dropped on another image
    }
}


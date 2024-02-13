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

let deskImg = "./Icons/Desk.png";
let shelfImg = "./Icons/Shelf.png";
let bookshelfImg = "./Icons/Bookshelf.png";
let dresserImg = "./Icons/Dresser.png";
let nightstandImg = "./Icons/Nightstand.png";
let cabinetImg = "./Icons/Cabinet.png" ;


const containerType = {
    DESK: "desk",
    SHELF: "shelf",
    BOOKSHELF: "bookshelf",
    DRESSER: "dresser",
    NIGHTSTAND: "nightstand",
    CABINET: "cabinet",
}
//***** Class and Child-Class definitions for Container *****//


class Container {
    constructor(name_, type_) {
        this.name = name_;
        this.type = type_;
        this.image = deskImg;
        this.room = roomSelect.value;
        this.itemList = []; //row name json pair
        this.sourceParent;
        this.rows = 1;
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

    getRows() {
        return this.rows;
    }

    getRoom() {
        return this.room;
    }

    sortContainer() {
        let tempList = [];
        for (let i = 1; i < this.rows + 1; i++) {
            for (let item = 0; item < this.itemList.length; item++) {
                if (this.itemList[item][0].row == i) {
                    tempList.push(this.itemList[item]);
                }
            }
        }
        this.itemList = tempList;
    }
};

class Desk extends Container {
    constructor(name_, type_) {
        super(name_, type_);
        this.image = deskImg;
        this.rows = 2;
    }
}

class Shelf extends Container {
    constructor(name_, type_) {
        super(name_, type_);
        this.image = shelfImg;
        this.rows = 1;
    }
}

class Bookshelf extends Container {
    constructor(name_, type_) {
        super(name_, type_);
        this.image = bookshelfImg;
        this.rows = 6;
    } 
}

class Dresser extends Container {
    constructor(name_, type_) {
        super(name_, type_);
        this.image = dresserImg;
        this.rows = 6; //2 X 3
    }
}

class Cabinet extends Container {
    constructor(name_,type_) {
        super(name_, type_);
        this.image = cabinetImg;
        this.rows = 4;
    }
}

class Nightstand extends Container {
    constructor(name_, type_) {
        super(name_, type_);
        this.image = nightstandImg;
        this.rows = 3;
    }
}

//***** Main Logic / Structures *****//


//Contains Container Elements: Code Block sets up container view
let containerPool = [];
let example = new Container("Example", "Shelf", bookshelfImg);
let workingContainer = example;
containerPool.push(example);
updateWCVJSON();

function createContainer(type) {
    let anId = prompt("Lable/Name for " + type);

    //ensures Container can be 'tracked'
    if (anId != '') {
        let aContainerPool = document.getElementById('roomFeatures');
        let duplicatedNode = document.createElement("img");
        let itemLabel=document.createElement('p');

        //links container type/class/img to image node created above : hope to generalize function to shorten
        makeContainer(type, anId, this, duplicatedNode);

        itemLabel.innerHTML=anId;
        itemLabel.id=anId;
        itemLabel.className='itemLabels';

        itemLabel.draggable=true;
        itemLabel.onclick = () => { findContainerWithName(anId) };
        
        duplicatedNode.draggable = true;
        duplicatedNode.id = anId;
        duplicatedNode.className='itemImages';
        duplicatedNode.onclick = () => { findContainerWithName(anId) };
        
        addListeners(itemLabel);
        addListeners(duplicatedNode);


        aContainerPool.appendChild(itemLabel)
        itemLabel.appendChild(duplicatedNode);

    }
    else {
        return 0;
    }
}

//recreates image-container link after room change
function recreateContainer(container) {
    let anId = container.getName();
    let imageNode = document.createElement("img");
    let itemLabel = document.createElement('p');

    itemLabel.innerHTML = anId;
    itemLabel.id = anId;
    itemLabel.className = 'itemLabels';
    itemLabel.draggable = true;

    imageNode.src = container.getImg();
    imageNode.id = anId;
    imageNode.className = 'itemImages';
    imageNode.draggable = true;


    imageNode.onclick = () => { findContainerWithName(anId) };

    addListeners(imageNode);
    addListeners(itemLabel);

    let parent = container.getParent();
    parent.appendChild(itemLabel);
    itemLabel.appendChild(imageNode);

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

function makeContainer(type, id, parent, duplicatedNode) {
    let temp;
    switch (type) {
        case containerType.DESK:
            temp = new Desk(id, type);
            duplicatedNode.src = deskImg;
            break;
        case containerType.SHELF:
            temp = new Shelf(id, type);
            duplicatedNode.src = shelfImg;
            break;
        case containerType.BOOKSHELF:
            temp = new Bookshelf(id, type);
            duplicatedNode.src = bookshelfImg;
            break;
        case containerType.DRESSER:
            temp = new Dresser(id, type);
            duplicatedNode.src = dresserImg;
            break;
        case containerType.CABINET:
            temp = new Cabinet(id, type);
            duplicatedNode.src = cabinetImg;
            break;
        case containerType.NIGHTSTAND:
            temp = new Nightstand(id, type);
            duplicatedNode.src = nightstandImg;
            break;
        default:
            break;
    }
    temp.setParent(parent);
    containerPool.push(temp);
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
    let submit = document.getElementById("addItem");
    //cannot track an unammed item
    if (submit.value != '') {
        if (workingContainer != example) {
            alert(submit.value);
            if (!hasInvalidChar(submit.value)) {
                submit.value = '';
                alert('invalid character used in name');
            }
            else {
                let row = document.getElementById("shelfSelect");
                let temp = [{ 'row': row.value, 'name': submit.value }];

                workingContainer.itemList.push(temp);
                workingContainer.sortContainer();
                updateWCVJSON();
                submit.value = '';
            }
        }
        else {
            alert('Cannot add items to the Example ');
        }

    }
    else {

    }
}

//makes sure that no html elements can be added through srting input/display
function hasInvalidChar(aString){
    let invalidChars = ['<', '>', '=', '{', '}'];
    for (let i = 0; i < aString.length; i++) {
        for (let j = 0; j < invalidChars.length; j++) {
            if (aString[i] == invalidChars[j]) {
                return true;
            }
                
        }
    }

    /*
    for (i in aString) {
        for (j in invalidChars) {
            if (i == j) {
                return true;
            }
        }
    }
    */
    return false;
}

//***** Updates / Deletions *****//


function updateWCVJSON() {
    let workingCV = document.getElementById("wcvLabel");
    let workingCVImg = document.getElementById("wcvImg");
    let workingCVItems = document.getElementById("wcvItems");
    
    workingCV.innerHTML = workingContainer.getName();
    workingCVImg.src = workingContainer.getImg();
    workingCVItems.innerHTML = '';

    changeOptionsTo(workingContainer.getRows());
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



function deleteContainer(id) {
    containerPool.splice(findContainerToChange(id), false);
}

function changeOptionsTo(rowNum) {
    let rowSelect = document.getElementById("shelfSelect");
    let previousRows = rowSelect.childElementCount;

    for (let i = 1; i < previousRows; i++) {
        rowSelect.removeChild(rowSelect.lastChild);
    }
    for (let j = 1; j < rowNum; j++) {
        let tempOption = document.createElement("option");
        tempOption.value = j + 1;
        tempOption.innerHTML = j + 1;
        rowSelect.appendChild(tempOption);
    }
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
    else if (ev.target.childElementCount >0) {

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


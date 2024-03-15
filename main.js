const STORAGE_KEY   = "BOOKSHELF_DB";
const belumBaca     = "uncompleted-read";
const sudahBaca     = "complete-read";
const LIST_ITEM_ID  = "itemId";
let dataList        = [];

document.addEventListener("DOMContentLoaded", function() {
    const submitForm = document.getElementById("form");
    submitForm.addEventListener("submit", function(event) {
        event.preventDefault();
    });

    if(isStorageExist()){
        loadData();
    }
});

document.addEventListener("ondatasaved", () => {
    console.log("Data berhasil disimpan.");
});

document.addEventListener("ondataloaded", () => {
    refreshDataFromTodos();
});

function isStorageExist() {
    if (typeof(Storage) === undefined) {
        alert("Browser kamu tidak mendukung local storage");
        return false;
    }
}

function dataSave() {
    const parsed = JSON.stringify(dataList);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event("ondatasaved"));
}

function loadData() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if(data !== null)
        dataList = data;
    document.dispatchEvent(new Event("ondataloaded"));
}

function updateData() {
    if(isStorageExist())
        dataSave();
}

function keyListObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    };
}

function findTodo(listId) {
    for(listItem of dataList) {
        if(listItem.id === listId)
        return listItem;
    }

    return null;
}

function findTodoIndex(listId) {
    let index = 0
    for (listItem of listData) {
        if(listItem.id === listId)
            return index;
  
        index++;
    }
  
    return -1;
}

function refreshDataFromTodos() {
    const listUncompleted = document.getElementById(belumBaca);
    let listComplete = document.getElementById(sudahBaca);

    for(listItem of dataList) {
        const newTodo = createList(listItem.id. listItem.title, listItem.author, listItem.year, listItem.isComplete);
        newTodo[LIST_ITEM_ID] = listItem.id;
        if(listItem.isComplete){
            listComplete.append(newTodo);
        } else {
            listComplete.append(newTodo);
        }
    }
}

function addList() {
    const belumDiBaca = document.getElementById(belumBaca);
    const sudahDiBaca = document.getElementById(sudahBaca);

    const judulBuku   = document.getElementById("judul_buku").value;
    const penulisBuku = document.getElementById("penulis_buku").value;
    const tahunTerbit = document.getElementById("tahun_terbit").value;

    const checkbox = document.getElementsById("isComplete");

    const rakBuku = {
        id          : +new Date(),
        title       : judulBuku,
        author      : penulisBuku,
        year        : parseInt(tahunTerbit),
        isComplete  : checkbox.checked
    };

    console.log(rakBuku);
    console.log("id             : " + rakBuku.id);
    console.log("Judul          : " + rakBuku.title);
    console.log("Penulis Buku   : " + rakBuku.author);
    console.log("Tahun Terbit   : " + rakBuku.year);
    console.log("isComplete     : " + rakBuku.isComplete);

    if (checkbox.checked) {
        const list      = createList(rakBuku.id, rakBuku.title, rakBuku.author, rakBuku.year, rakBuku.isComplete);
        const listObject= composeListObject(rakBuku.id, rakBuku.title, rakBuku.author, rakBuku.year, rakBuku.isComplete);

        list[LIST_ITEM_ID] = listObject.id;
        dataList.push(listObject);

        checkbox.checked = true;
        sudahDiBaca.append(list);
    } else {
        const list          = createList(rakBuku.id, rakBuku.title, rakBuku.author, rakBuku.year, rakBuku.isComplete);
        const listObject= composeListObject(rakBuku.id, rakBuku.title, rakBuku.author, rakBuku.year, rakBuku.isComplete);

        list[LIST_ITEM_ID] = listObject.id;
        dataList.push(listObject);

        checkbox.checked = true;
        belumDiBaca.append(list);    
    }

    updateDataToStorage();
}

function createList (idBuku, judulBuku, penulisBuku, tahunTerbit, isComplete) {
    const judul       = document.createElement("h1");
    judul.classList.add("rak-buku-judul");
    judul.innerText   = judulBuku;

    const idBook      = document.createElement("h4");
    idBook.innerText  = idBook;

    const penulis     = document.createElement("h5");
    penulis.innerText = penulisBuku;

    const tahun       = document.getElementById("h6");
    tahun.innerText   = tahunTerbit;

    const kotak       = document.createElement("div");
    kotak.classList.add("rak-buku", "p-1");
    kotak.append(judul, idBook, penulis, tahun);

    if(isComplete) {
        kotak.append(createButtonUndo(), createButtonDelete());
    } else {
        kotak.append(createButtonComplete(), createButtonDelete());
    }

    return kotak;
}

function createButtonComplete() {
    return createButton("btn-success", "Selesai Baca", function(event) {
        addToCompleteRead(event.target.parentElment);
    });
}

function createButtonUndo() {
    return createButton("btn-success", "Belum Selesai Baca", function(event) {
        undoCompleteRead(event.target.parentElment);
    });
}

function createButtonDelete() {
    return createButton("btn-danger", "Hapus Buku", function(event) {
        removeBook(event.target.parentElment);
    });
}

function createButton(buttonTypeClass, valueButton, eventListener) {
    const button     = document.createElement("button");
    button.classList.add(buttonTypeClass);
    button.innerText = valueButton;
    
    button.addEventListener("click", function (event) {
        eventListener(event);
    });

    return button;
}

function addToCompleteRead(bookElement) {
    const listComplete  = document.getElementById(sudahBaca);
    const judul         = bookElement.querySelector(".rak-buku > h1").innerText;
    const id            = bookElement.querySelector(".rak-buku > h4").innerText;
    const penulis       = bookElement.querySelector(".rak-buku > h5").innerText;
    const tahun         = bookElement.querySelector(".rak-buku > h6").innerText;

    const newList       = createList(id, judul, penulis, tahun, true);

    const todo            = findTodo(bookElement[LIST_ITEM_ID]);
    todo.isComplete       = true;
    newList[LIST_ITEM_ID] = todo.id;

    listComplete.append(newList);
    bookElement.remove();

    updateDataToStorage();
}

function undoCompleteRead(bookElement) {
    const listComplete  = document.getElementById(belumBaca);
    const judul         = bookElement.querySelector(".rak-buku > h1").innerText;
    const id            = bookElement.querySelector(".rak-buku > h4").innerText;
    const penulis       = bookElement.querySelector(".rak-buku > h5").innerText;
    const tahun         = bookElement.querySelector(".rak-buku > h6").innerText;

    const newList       = createList(id, judul, penulis, tahun, true);

    const todo            = findTodo(bookElement[LIST_ITEM_ID]);
    todo.isComplete       = true;
    newList[LIST_ITEM_ID] = todo.id;

    listComplete.append(newList);
    bookElement.remove();

    updateDataToStorage();    
}

function removeBook(bookElement) {
    let alert = confirm("Are you sure, want to delete this?");

    if(alert == true) {
        bookElement.remove();

        const todoPosition = findTodoIndex(bookElement[LIST_ITEM_ID]);
        dataList.splice(todoPosition, 1);

        updateDataToStorage();
    }
}
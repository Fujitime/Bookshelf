const buttonAdd = document.querySelector(".button-add");
const buttonClear = document.querySelector(".button-clear");
const formContainer = document.querySelector(".form-container");

buttonAdd.addEventListener("click", function() {
	buttonAdd.classList.toggle("active");
	if (formContainer.style.display == "block") {
		formContainer.style.display = "none";
	} else {
		formContainer.style.display = "block";
	}
});


// cek browser mensupport strorage
const checkSupportedStorage = () => {
	return typeof Storage !== undefined;
};

// storage
const localStorageKey = "bookshelfApp";
let bookshelfApp = [];
const saveBook = document.getElementById("saveBook");


// nyarii buku
const searchBook = (kw) => {
	const r = bookshelfApp.filter(book => book.title.toLowerCase().includes(kw.toLowerCase()));
	renderBooks(r);
};


if (checkSupportedStorage()) {
	if (localStorage.getItem(localStorageKey) === null) {
		bookshelfApp = [];
	} else {
		bookshelfApp = JSON.parse(localStorage.getItem(localStorageKey));
	}
	localStorage.setItem(localStorageKey, JSON.stringify(bookshelfApp));
}


// nambah buku
const addBook = (Obj, localStorageKey) => {
	bookshelfApp.push(Obj);
	localStorage.setItem(localStorageKey, JSON.stringify(bookshelfApp));
};

// hapus buku
const deleteBook = (book) => {
	bookshelfApp.splice(book, 1);
	localStorage.setItem(localStorageKey, JSON.stringify(bookshelfApp));
	renderBooks(bookshelfApp);
};

// buku biar pindah kalo belum dibaca
const finishedRead = (book) => {
	bookshelfApp[book].isComplete = true;
	localStorage.setItem(localStorageKey, JSON.stringify(bookshelfApp));
	renderBooks(bookshelfApp);
};

// pindah daftar buku
const unfinishedRead = (book) => {
	bookshelfApp[book].isComplete = false;
	localStorage.setItem(localStorageKey, JSON.stringify(bookshelfApp));
	renderBooks(bookshelfApp);
};

// tampil buku
const unfinishedReadId = "unfinished-read";
const finishedReadId = "finished-read";

const renderBooks = (bookshelfApp) => {
	const books = bookshelfApp;

	const listUnfinished = document.getElementById(unfinishedReadId);
	const listFinished = document.getElementById(finishedReadId);

	listUnfinished.innerHTML = "";
	listFinished.innerHTML = "";

	for (let book of books.keys()) {
		const listGroupItem = document.createElement("article");
		listGroupItem.classList.add("list-group-item");

		// detail buku
		const bookDetail = document.createElement("div");
		bookDetail.classList.add("book-detail");

		const bookTitle = document.createElement("b");
		bookTitle.innerHTML = books[book].title;

		const bookYear = document.createElement("p");
		bookYear.classList.add("small");
		bookYear.innerHTML = "Tahun: " + books[book].year;

		const bookAuthor = document.createElement("p");
		bookAuthor.classList.add("small");
		bookAuthor.innerHTML = "pengarang: " + books[book].author;

		bookDetail.append(bookTitle, bookAuthor, bookYear);
		const bookAction = document.createElement("div");
		bookAction.classList.add("book-action");

		const buttonRead = document.createElement("button");

		if (books[book].isComplete) {
			buttonRead.classList.add("button-finish");
			buttonRead.innerHTML = "Belum Dibaca";
			buttonRead.addEventListener("click", () => {
				unfinishedRead(book);
			});
		} else {
			buttonRead.classList.add("button-unfinish");
			buttonRead.innerHTML = "Sudah Dibaca";
			buttonRead.addEventListener("click", () => {
				finishedRead(book);
			});
		}
		const buttonDelete = document.createElement("button");
		buttonDelete.classList.add("button-delete");
		buttonDelete.innerHTML = "Hapus Buku";
		buttonDelete.addEventListener("click", () => {
			let confirmDelete = confirm(
				"Ingin Menghapus Buku?'" + books[book].title + "'?"
			);
			if (confirmDelete) {
				deleteBook(book);
			}
		});

		bookAction.append(buttonRead, buttonDelete);

		listGroupItem.append(bookDetail, bookAction);

		if (books[book].isComplete) {
			listFinished.append(listGroupItem);
		} else {
			listUnfinished.append(listGroupItem);
		}
	}
};



saveBook.addEventListener("click", function(event) {

	const title = document.getElementById("title");
	const author = document.getElementById("author");
	const year = document.getElementById("year");
	const isComplete = document.getElementById("isComplete");


	searchBookForm = document.getElementById("searchBook");
	searchBookForm.addEventListener("submit", (e) => {
		const kw = document.querySelector("#searchBookTitle").value;
		e.preventDefault();
		searchBook(kw);

	});

	// mengajukan
	let Obj = {
		id: +new Date(),
		title: title.value,
		author: author.value,
		year: year.value,
		isComplete: isComplete.checked,
	};

	// cecking 
	if (title.value && author.value && year.value) {
		addBook(Obj, localStorageKey);
	} else {
		return alert("engga boleh kosong");
	}

	const inputs = document.querySelectorAll("input");
	inputs.forEach((input) => (input.value = ""));

	formContainer.style.display = "none";

	renderBooks(bookshelfApp);

	alert("Oke, Bukumu Sukses Dicatat");
});

buttonClear.addEventListener("click", () => {
	let confirmClearAll = confirm(
		"Apakah kamu yakin ingin menghapus semua buku dari rak?"
	);

	if (confirmClearAll) {
		localStorage.clear();
		bookshelfApp = [];
	}
	renderBooks(bookshelfApp);
});

window.addEventListener("load", function() {
	if (checkSupportedStorage) {
		renderBooks(bookshelfApp);
	} else {
		alert("Maaf browser anda tidak mendukung penyimpanan web");
	}
});
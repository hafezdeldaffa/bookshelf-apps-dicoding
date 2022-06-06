const books = [];
const RENDER_EVENT = 'render-book';
const STORAGE_KEY = 'BOOKSHELF_APP';
const SAVED_EVENT = 'saved-book';
const DELETE_EVENT = 'delete-book';

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

function savedData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function addBook() {
  const bookTitle = document.getElementById('inputBookTitle').value;
  const bookAuthor = document.getElementById('inputBookAuthor').value;
  const bookYear = document.getElementById('inputBookYear').value;
  const booksIsComplete = document.getElementById('inputBookIsComplete');
  let checked = false;

  if (booksIsComplete.checked) {
    checked = true;
  } else {
    checked;
  }

  const generatedId = generateId();
  const bookObject = generateBookObject(
    generatedId,
    bookTitle,
    bookAuthor,
    bookYear,
    checked
  );

  books.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  savedData();
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  const data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener('DOMContentLoaded', function () {
  const submitForms = document.getElementById('inputBook');
  submitForms.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookId === bookItem.id) {
      return bookItem;
    }
  }

  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget === null) {
    return;
  }

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  savedData();
}

function unreadBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) {
    return;
  }

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  savedData();
}

function deleteBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) {
    return;
  }

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  savedData();
}

function createButton(buttonClass, textContent) {
  const button = document.createElement('button');
  button.classList.add(buttonClass);
  button.textContent = textContent;
  return button;
}

function createUnreadButton(bookId) {
  const unreadButton = createButton('green', 'Belum Dibaca!');
  unreadButton.addEventListener('click', function () {
    unreadBookFromCompleted(bookId);
  });
  return unreadButton;
}

function createReadButton(bookId) {
  const readButton = createButton('green', 'Selesai Dibaca!');
  readButton.addEventListener('click', function () {
    addBookToCompleted(bookId);
  });
  return readButton;
}

function createDeleteButton(bookId) {
  const deleteButton = createButton('red', 'Hapus Buku');
  deleteButton.addEventListener('click', function () {
    deleteBook(bookId);
  });
  return deleteButton;
}

function makeBook(bookObject) {
  const textTitle = document.createElement('h3');
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement('p');
  textAuthor.innerText = bookObject.author;

  const textYear = document.createElement('p');
  textYear.innerText = bookObject.year;

  const bookContainer = document.createElement('article');
  bookContainer.classList.add('book_item');
  bookContainer.append(textTitle, textAuthor, textYear);
  bookContainer.setAttribute('id', `book-${bookObject.id}`);

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('action');
  bookContainer.append(buttonContainer);

  if (bookObject.isCompleted) {
    const unreadButton = createUnreadButton(bookObject.id);

    const deleteButton = createDeleteButton(bookObject.id);

    buttonContainer.append(unreadButton, deleteButton);
  } else {
    const readButton = createReadButton(bookObject.id);

    const deleteButton = createDeleteButton(bookObject.id);

    buttonContainer.append(readButton, deleteButton);
  }

  return bookContainer;
}

document.addEventListener(RENDER_EVENT, function () {
  const unreadBook = document.getElementById('incompleteBookshelfList');
  unreadBook.innerHTML = '';

  const readedBook = document.getElementById('completeBookshelfList');
  readedBook.innerHTML = '';

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isCompleted) {
      unreadBook.append(bookElement);
    } else {
      readedBook.append(bookElement);
    }
  }
});

document.addEventListener(DELETE_EVENT, function () {
  alert('Data Berhasil dihapus!');
});

document.addEventListener(SAVED_EVENT, function () {
  alert('Data Berhasil disimpan!');
});

// Book Class: Represents a Book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI Class: Handle UI Tasks
class UI {
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector('#book-list');

    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
     

      <td><button type="button" class="update btn btn-warning btn-sm"><i class="fas fa-edit"></i></button></td>
        <td><button type="button"   class="delete btn btn-danger btn-sm"><i class="fas fa-trash"></i></button></td> 

    `;

    list.appendChild(row);
  }

  static deleteBook(el, selectedID) {

    el.parentElement.parentElement.remove();
    // Remove book from store
    Store.removeBook(selectedID);

    // Show success message
    UI.showAlert('Book Removed', 'success');

  }
  static updateBook(el, selectedID) {

    document.querySelector('#title').value = el.parentElement.parentElement.getElementsByTagName('td')[0].innerText;
    document.querySelector('#author').value = el.parentElement.parentElement.getElementsByTagName('td')[1].innerText;
    document.querySelector('#isbn').value = el.parentElement.parentElement.getElementsByTagName('td')[2].innerText;
    document.querySelector('#submitBtn').value = "Update Book";
    document.querySelector('#isbn').disabled = true;
  }


  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);

    // Vanish in 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 1000);
  }

  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
  }
}

// Store Class: Handles Storage
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }

  static updateBook(updatedBook, isbn) {

    const books = Store.getBooks();

    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        book.title = updatedBook.title;
        book.author = updatedBook.author;

      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}

// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
  // Prevent actual submit
  e.preventDefault();
  if (document.querySelector('#submitBtn').value === "Update Book") {


    const updated_title = document.querySelector('#title').value;
    const updated_author = document.querySelector('#author').value;
    const selectedID = document.querySelector('#isbn').value

    // Validate
    if (updated_title === '' || updated_author === '') {
      UI.showAlert('Please fill in all fields', 'danger');
    }
    else {

      const updatedBook = new Book(updated_title, updated_author, selectedID);
      //Update Book in UI


      const booklist = document.querySelector('#book-list');
      const bookRows = booklist.getElementsByTagName('tr');
      

      const bookArray = Array.from(bookRows);
      
      const row = bookArray.filter((r) => (r.getElementsByTagName('td')[2].innerText == selectedID));
     
      if (row[0].cells[0].innerText == updated_title && row[0].cells[1].innerText == updated_author) {
        UI.showAlert('No changes made', 'danger');

      }
      else {
        row[0].cells[0].innerText = updated_title;
        row[0].cells[1].innerText = updated_author;
        // Update book in store
        Store.updateBook(updatedBook, selectedID);
        // Show success message
        UI.showAlert('Book Updated', 'success');

      }
      // Clear fields
      UI.clearFields();
      document.querySelector('#submitBtn').value = "Add Book";
      document.querySelector('#isbn').disabled = false;

    }

  }



  else {
    // Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Validate
    if (title === '' || author === '' || isbn === '') {
      UI.showAlert('Please fill in all fields', 'danger');
    } else {
      // Instatiate book
      const book = new Book(title, author, isbn);

      // Add Book to UI
      UI.addBookToList(book);

      // Add book to store
      Store.addBook(book);

      // Show success message
      UI.showAlert('Book Added', 'success');

      // Clear fields
      UI.clearFields();
    }
  }
});

// Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
  let selectedID = e.target.parentElement.parentElement.parentElement.getElementsByTagName('td')[2].innerText;

  if (e.target.parentElement.classList.contains('delete')) {
    // Remove book from UI
    UI.deleteBook(e.target.parentElement, selectedID);
  }
  else if (e.target.parentElement.classList.contains('update')) {
    // Update book from UI
    UI.updateBook(e.target.parentElement, selectedID);
  }
});
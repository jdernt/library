// проверка на наличие сохраненных книг и их отображение
const books = document.querySelector('.books__container');
const favBooks = document.querySelector('.favs__container');

let titleArr = [];
let textArr = [];
let statusArr = [];
let categoryArr = [];

let bookObj= {
  title: [],
  category: [],
  status: [],
  text: []
};

let json;

function toJson() {
  json = JSON.stringify(bookObj);
  localStorage.setItem('json', json);
};

function getBooksFromStorage() {
  books.innerHTML = '';

  if (localStorage.length <= 1) {
    toJson();
  } else {
      if (localStorage.getItem('json') !== null) {
        bookObj = JSON.parse(localStorage.getItem('json'));

        for (i = 0; i < bookObj.title.length; i++) {
          if (bookObj.category[i] === 'all books') {
            books.insertAdjacentHTML('beforeend', `
            <article class="books__article" draggable="true" data-title="${bookObj.title[i]}" data-status="${bookObj.status[i]}" data-number="${i}">
              <div class="books__content">
                <h3 class="books__subtitle subtitle">
                  ${bookObj.title[i]}
                </h3>
                <div class="books__descr">
                  ${bookObj.text[i]}
                </div>
              </div>
              <div class="books__buttons">
                <button class="books__btn to-read-btn">
                  Читать
                </button>
                <button class="books__btn edit-btn">
                  Редактировать
                </button>
                <button class="books__btn complete-btn">
                  Прочитано
                </button>
                <button class="books__btn delete-btn">
                  Удалить
                </button>
              </div>
            </article>
            `)
          } else {
            const favBooks = document.querySelector('.favs__container');

            favBooks.insertAdjacentHTML('beforeend', `
            <article class="books__article" draggable="true" data-title="${bookObj.title[i]}" data-status="${bookObj.status[i]}" data-number="${i}">
              <div class="books__content">
                <h3 class="books__subtitle subtitle">
                  ${bookObj.title[i]}
                </h3>
                <div class="books__descr">
                  ${bookObj.text[i]}
                </div>
              </div>
              <div class="books__buttons">
                <button class="books__btn to-read-btn">
                  Читать
                </button>
                <button class="books__btn edit-btn">
                  Редактировать
                </button>
                <button class="books__btn complete-btn">
                  Прочитано
                </button>
                <button class="books__btn delete-btn">
                  Удалить
                </button>
              </div>
            </article>
            `)
          };
          if (bookObj.status[i] === 'read') {
            let article = document.querySelector('[data-title=\"'+bookObj.title[i]+'"\]')
            if (article.children.length < 3) {
              let finished = document.createElement('div');
              finished.classList.add('finished');

              article.appendChild(finished);
            };
          };
        };
      };
    };

  dragAndDrop();
};

getBooksFromStorage();

let booksBtns = document.querySelectorAll('.books__btn');

function createBook(fileName, fileText) {
  bookObj.title.push(fileName);
  bookObj.text.push(fileText);
  bookObj.status.push('unread');
  bookObj.category.push('all books');

  toJson();

  books.insertAdjacentHTML('beforeend', `
    <article class="books__article" draggable="true" data-title="${fileName}" data-status="unread" data-number="${bookObj.title.indexOf(fileName)}">
      <div class="books__content">
        <h3 class="books__subtitle subtitle">
          ${fileName}
        </h3>
        <div class="books__descr">
          ${fileText}
        </div>
      </div>
      <div class="books__buttons">
        <button class="books__btn to-read-btn">
          Читать
        </button>
        <button class="books__btn edit-btn">
          Редактировать
        </button>
        <button class="books__btn complete-btn">
          Прочитано
        </button>
        <button class="books__btn delete-btn">
          Удалить
        </button>
      </div>
    </article>
  `);

  booksBtns = document.querySelectorAll('.books__btn');

  booksBtns.forEach((btn) => {
    btn.onclick = libraryControls;
  });

  dragAndDrop();
};

// сортировка
const favsSelect = document.querySelector('.favs__select');
const booksSelect = document.querySelector('.books__select');

// сортировка раздела Мои книги
booksSelect.addEventListener('change', function(){
  const allBooks = books.querySelectorAll('[data-number]');
  const allBooksArr = [];

  for (i = 0; i < allBooks.length; i++) {
    allBooksArr[i] = allBooks[i];
  };

  if (booksSelect.value === 'old') {
    allBooksArr.sort(function(a, b) {
      return a.getAttribute("data-number") - b.getAttribute("data-number");
    });

    books.innerHTML = '';
    for (i = 0; i < allBooksArr.length; i++) {
      books.appendChild(allBooksArr[i]);
    };
  };

  if (booksSelect.value === 'new') {
    allBooksArr.sort(function(a, b) {
      return b.getAttribute("data-number") - a.getAttribute("data-number");
    });

    books.innerHTML = '';
    for (i = 0; i < allBooksArr.length; i++) {
      books.appendChild(allBooksArr[i]);
    };
  };

  if (booksSelect.value === 'read') {
    allBooksArr.sort(function(a, b) {
      let aStatus = a.getAttribute("data-status");
      let bStatus = b.getAttribute("data-status");
      return ((aStatus < bStatus) ? -1 : ((aStatus > bStatus) ? 1 : 0));
    });

    books.innerHTML = '';
    for (i = 0; i < allBooksArr.length; i++) {
      books.appendChild(allBooksArr[i]);
    };
  };

  if (booksSelect.value === 'unread') {
    allBooksArr.sort(function(a, b) {
      let aStatus = a.getAttribute("data-status");
      let bStatus = b.getAttribute("data-status");
      return ((bStatus < aStatus) ? -1 : ((bStatus > aStatus) ? 1 : 0));
    });

    books.innerHTML = '';
    for (i = 0; i < allBooksArr.length; i++) {
      books.appendChild(allBooksArr[i]);
    };
  };
});

// сортировка раздела Любимые книги
favsSelect.addEventListener('change', function(){
  const allBooks = favBooks.querySelectorAll('[data-number]');
  const allBooksArr = [];

  for (i = 0; i < allBooks.length; i++) {
    allBooksArr[i] = allBooks[i];
  };

  if (favsSelect.value === 'old') {
    allBooksArr.sort(function(a, b) {
      return a.getAttribute("data-number") - b.getAttribute("data-number");
    });

    favBooks.innerHTML = '';
    for (i = 0; i < allBooksArr.length; i++) {
      favBooks.appendChild(allBooksArr[i]);
    };
  };

  if (favsSelect.value === 'new') {
    allBooksArr.sort(function(a, b) {
      return b.getAttribute("data-number") - a.getAttribute("data-number");
    });

    favBooks.innerHTML = '';
    for (i = 0; i < allBooksArr.length; i++) {
      favBooks.appendChild(allBooksArr[i]);
    };
  };

  if (favsSelect.value === 'read') {
    allBooksArr.sort(function(a, b) {
      let aStatus = a.getAttribute("data-status");
      let bStatus = b.getAttribute("data-status");
      return ((aStatus < bStatus) ? -1 : ((aStatus > bStatus) ? 1 : 0));
    });

    favBooks.innerHTML = '';
    for (i = 0; i < allBooksArr.length; i++) {
      favBooks.appendChild(allBooksArr[i]);
    };
  };

  if (favsSelect.value === 'unread') {
    allBooksArr.sort(function(a, b) {
      let aStatus = a.getAttribute("data-status");
      let bStatus = b.getAttribute("data-status");
      return ((bStatus < aStatus) ? -1 : ((bStatus > aStatus) ? 1 : 0));
    });

    favBooks.innerHTML = '';
    for (i = 0; i < allBooksArr.length; i++) {
      favBooks.appendChild(allBooksArr[i]);
    };
  };
});

//управление библиотекой
const readSection = document.querySelector('.read');
const readTitle = document.querySelector('.read__title');
const readText = document.querySelector('.read__text');

const editSection = document.querySelector('.edit');
const editForm = document.querySelector('.edit__form');
const editTextarea = document.querySelector('.edit__textarea');

// закрыть превью/окно для чтения
function removeSideSections() {
  editSection.classList.add('hidden');
  readSection.classList.add('hidden');
};

let article;
let title;
let descr;

function libraryControls() {
  article = this.closest('.books__article');
  title = article.querySelector('.books__subtitle').textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim();
  descr = article.querySelector('.books__descr');

  if (this.classList.contains('delete-btn')) {
    deleteBook();
  };
  if (this.classList.contains('complete-btn')) {
    if (article.children.length <= 2) {
      completeBook();
    };
  };
  if (this.classList.contains('edit-btn')) {
    removeSideSections();

    editSection.classList.remove('hidden');
    editTextarea.value = localStorage.getItem(title);
  };
  if (this.classList.contains('to-read-btn')) {
    removeSideSections();

    readSection.classList.remove('hidden');
    readTitle.textContent = title;
    readText.textContent = localStorage.getItem(title);
  };
};

// добавить статус "прочитано"
function completeBook() {
  removeSideSections();

  let finished = document.createElement('div');
  finished.classList.add('finished');
  article.appendChild(finished);
  article.dataset.status = 'read';

  let index = bookObj.title.indexOf(title);
  bookObj.status[index] = 'read';
  toJson();
};

// удалить книгу
function deleteBook() {
  removeSideSections();

  article.remove();
  localStorage.removeItem(title);

  let index = bookObj.title.indexOf(title);

  bookObj.title.splice(index, 1);
  bookObj.text.splice(index, 1);
  bookObj.status.splice(index, 1);
  bookObj.category.splice(index, 1);

  toJson();
};

// сохранение данных формы редактирования
editForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (editTextarea.value !== '') {
    localStorage.setItem(title, editTextarea.value);
    descr.textContent = editTextarea.value;

    let index = bookObj.title.indexOf(title);
    bookObj.text[index] = editTextarea.value;
    toJson();

    editSection.classList.add('hidden');
  };
});

//
booksBtns.forEach((btn) => {
  btn.onclick = libraryControls;
});

// открыть книгу по клику на имя
const booksContent = document.querySelectorAll('.books__content');

booksContent.forEach(book => book.addEventListener('click', function(){
  const title = this.querySelector('.books__subtitle').textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim();

  readSection.classList.remove('hidden');
  readTitle.textContent = title;
  readText.textContent = localStorage.getItem(title);
}));

// отправка данных на сервер
const url = 'https://apiinterns.osora.ru/ ';
const uploadForm = document.querySelector('.upload');
const writeForm = document.querySelector('.write');

// загрузить файл
uploadForm.onsubmit = async (e) => {
  e.preventDefault();
  let fileName = document.querySelector('#upload-title');
  let file = document.querySelector('[type=file]');

  if (fileName.value !== '' && file.value !== '') {
    let response = await fetch(url, {
      method: 'POST',
      body: new FormData(uploadForm)
    });

    let result = await response.json();

    const filePreview = document.querySelector('.add__preview');
    filePreview.classList.remove('hidden');
    filePreview.innerHTML = result.text;

    localStorage.setItem(`${fileName.value}`, result.text);
    createBook(fileName.value, result.text);

    fileName.value = '';
    file.value = '';
  };
};

// написать самостоятельно
writeForm.onsubmit = async (e) => {
  e.preventDefault();

  let fileName = document.querySelector('#write-title');
  let fileDescr = document.querySelector('#write-descr');

  if (fileName.value !== '' && fileDescr.value !== '') {
    localStorage.setItem(`${fileName.value}`, fileDescr.value);
    createBook(fileName.value, fileDescr.value);

    fileName.value = '';
    fileDescr.value = '';
  };
};

// переключение между секциями добавить книгу/мои книги
const addBtn = document.querySelector('.add-book-btn');
const myBooksLink = document.querySelector('.my-books-link');
const librarySection = document.querySelector('.library');
const addSection = document.querySelector('.add');

addBtn.addEventListener('click', function(){
  librarySection.classList.add('hidden');
  addSection.classList.remove('hidden');
});

myBooksLink.addEventListener('click', function(e){
  e.preventDefault();

  librarySection.classList.remove('hidden');
  addSection.classList.add('hidden');
})

//переключение между формами загрузить файл/написать самому
const uploadCheckbox = document.querySelector('#upload-checkbox');
const writeCheckbox = document.querySelector('#write-checkbox');

function switchToUpload() {
  uploadForm.classList.remove('hidden');
  writeForm.classList.add('hidden');
};

function switchToWrite() {
  uploadForm.classList.add('hidden');
  writeForm.classList.remove('hidden');
};

uploadCheckbox.addEventListener('click', function(){
  if (uploadCheckbox.checked) {
    switchToUpload();
  } else {
    switchToWrite();
  };
});

writeCheckbox.addEventListener('click', function(){
  if (writeCheckbox.checked) {
    switchToWrite();
  } else {
    switchToUpload();
  };
});

// drag and drop
function dragAndDrop(){
  const booksArticle = document.querySelectorAll('.books__article');

  booksArticle.forEach((book) => {
    book.addEventListener('dragstart', function(){
      book.classList.add('selected');
    });

    book.addEventListener('dragend', function(){
      book.classList.remove('selected');
    });
  });

  favBooks.addEventListener('dragover', function(e){
    e.preventDefault();

    favBooks.classList.add('over');
  });

  favBooks.addEventListener('dragleave', function(){
    favBooks.classList.remove('over');
  });

  favBooks.addEventListener('drop', function(){
    favBooks.classList.remove('over');

    const activeItem = document.querySelector('.selected');
    const activeTitle = activeItem.querySelector('.books__subtitle').textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim();
    let index = bookObj.title.indexOf(activeTitle);
    bookObj.category[index] = 'favorite';

    toJson();

    favBooks.append(activeItem);
  });
};

dragAndDrop();

// проверка на наличие сохраненных книг и их отображение
const books = document.querySelector('.books__container');
let titleArr = [];
let descrArr = [];

function getBooksFromStorage() {
  books.innerHTML = '';

  for (i = 0; i < localStorage.length; i++) {
    titleArr[i] = localStorage.key(i);
    descrArr[i] = localStorage.getItem(localStorage.key(i));

    books.insertAdjacentHTML('beforeend', `
    <article class="books__article" draggable="true">
      <div class="books__content">
        <h3 class="books__subtitle subtitle">
          ${titleArr[i]}
        </h3>
        <div class="books__descr">
          ${descrArr[i]}
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
};

getBooksFromStorage();

//управление библиотекой
const booksBtns = document.querySelectorAll('.books__btn');

const readSection = document.querySelector('.read');
const readTitle = document.querySelector('.read__title');
const readText = document.querySelector('.read__text');

const editSection = document.querySelector('.edit');
const editForm = document.querySelector('.edit__form');
const editTextarea = document.querySelector('.edit__textarea');

function removeSideSections() {
  editSection.classList.add('hidden');
  readSection.classList.add('hidden');
};

function libraryControls() {
  const article = this.parentNode.parentNode;
  const title = article.childNodes[1].childNodes[1].textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim();

  if (this.classList.contains('delete-btn')) {
    removeSideSections();

    article.remove();
    localStorage.removeItem(title);
  };
  if (this.classList.contains('complete-btn')) {
    if (article.children.length <=2) {
      removeSideSections();

      let finished = document.createElement('div');
      finished.classList.add('finished');
      article.appendChild(finished);
    }

  };
  if (this.classList.contains('edit-btn')) {
    removeSideSections();

    editSection.classList.remove('hidden');
    editTextarea.value = localStorage.getItem(title);

    editForm.addEventListener('submit', function(e){
      e.preventDefault();
      if (editTextarea.value !== '') {
        localStorage.setItem(title, editTextarea.value);
        editSection.classList.add('hidden');
        getBooksFromStorage();
      };
    });
  };
  if (this.classList.contains('to-read-btn')) {
    removeSideSections();

    readSection.classList.remove('hidden');
    readTitle.textContent = title;
    readText.textContent = localStorage.getItem(title);
  };
};

booksBtns.forEach(btn => btn.addEventListener('click', libraryControls));

const booksContent = document.querySelectorAll('.books__content');

booksContent.forEach(book => book.addEventListener('click', function(){
  const title = this.childNodes[1].textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim();

  readSection.classList.remove('hidden');
  readTitle.textContent = title;
  readText.textContent = localStorage.getItem(title);
}));

// отправка данных на сервер
const url = 'https://apiinterns.osora.ru/ ';
const uploadForm = document.querySelector('.upload');
const writeForm = document.querySelector('.write');

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
    console.log(result);

    const filePreview = document.querySelector('.add__preview');
    filePreview.classList.remove('hidden');
    filePreview.innerHTML = result.text;

    localStorage.setItem(`${fileName.value}`, result.text);
    fileName.value = '';
    file.value = '';

    getBooksFromStorage();
  };
};

writeForm.onsubmit = async (e) => {
  e.preventDefault();

  let fileName = document.querySelector('#write-title');
  let fileDescr = document.querySelector('#write-descr');

  if (fileName.value !== '' && fileDescr.value !== '') {
    localStorage.setItem(`${fileName.value}`, fileDescr.value);
    fileName.value = '';
    fileDescr.value = '';
  };
};

//добавить книгу
const addBtn = document.querySelector('.add-book');
const librarySection = document.querySelector('.library');
const addSection = document.querySelector('.add');

addBtn.addEventListener('click', function(){
  librarySection.classList.add('hidden');
  addSection.classList.remove('hidden');
});

//переключение между формами
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
const favBooks = document.querySelector('.favs__container');
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

  favBooks.append(activeItem);
  activeItem.classList.remove('selected');
});

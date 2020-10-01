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
    <article class="books__article">
      <div class="books__content">
        <h3 class="books__subtitle subtitle">
          ${titleArr[i]}
        </h3>
        <div class="books__descr">
          ${descrArr[i]}
        </div>
      </div>
      <div class="books__buttons">
        <button class="books__btn to-read">
          Читать
        </button>
        <button class="books__btn edit">
          Редактировать
        </button>
        <button class="books__btn complete">
          Прочитано
        </button>
        <button class="books__btn delete">
          Удалить
        </button>
      </div>
    </article>
    `)
  };
};

getBooksFromStorage();

//функции управления библиотекой
const allBooks = document.querySelectorAll('.books__article');
const btns = document.querySelectorAll('.books__buttons');
const readBtns = document.querySelectorAll('.to-read');
const editBtns = document.querySelectorAll('.edit');
const completeBtns = document.querySelectorAll('.complete');
const deleteBtns = document.querySelectorAll('.delete');

//читать книгу
readBtns.forEach(btn => btn.addEventListener('click', function(e){


}));

//удалить книгу
deleteBtns.forEach(btn => btn.addEventListener('click', function(e){
  const target = e.target;
  const article = target.parentNode.parentNode;
  const title = article.childNodes[1].childNodes[1].textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim();

  article.remove();
  localStorage.removeItem(title);
  console.log(localStorage.getItem(title));
}))

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

// uploadForm.addEventListener('submit', (e) => {
//   e.preventDefault();

//   const fileName = document.querySelector('#upload-title').value;
//   const file = document.querySelector('[type=file]').files[0];

//   fetch(url, {
//     method: 'POST',
//     body: new FormData(uploadForm),
//   }).then((response) => {
//     console.log(response.json);
//   });

//   // let reader = new FileReader();

//   // let div = document.createElement('div');
//   // div.classList.add('file-content');

//   // reader.readAsText(file, 'utf-8');
//   // reader.onload = function() {
//   //   div.innerHTML = reader.result;
//   //   document.querySelector('.main').appendChild(div);
//   // };

//   // localStorage.setItem(`${fileName}`, );
// });

// writeForm.addEventListener('submit', (e) => {
//   e.preventDefault();

//   const fileName = document.querySelector('#write-title').value;

//   fetch(url, {
//     method: 'POST',
//     body: new FormData(writeForm),
//   }).then((response) => {
//     console.log(response);
//   });

//   // localStorage.setItem(`${fileName}`, );
// });

// Переключение между формами
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

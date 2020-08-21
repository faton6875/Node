const userForm = document.querySelector('#userForm');
const search = document.getElementsByTagName('input');
console.log(userForm);
userForm.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log(search.value);
});

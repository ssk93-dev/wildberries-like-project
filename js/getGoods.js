const getGoods = () => {
  const links = document.querySelectorAll('.navigation-link');

  const getData = () => {
    fetch('https://test-c2747-default-rtdb.firebaseio.com/db.json')
    .then((response) => response.json())
    .then((data) => localStorage.setItem('goods', JSON.stringify(data)));
  };

  links.forEach((link) => link.addEventListener('click', (e) => {
    e.preventDefault();
    getData();
  }));
}

getGoods();

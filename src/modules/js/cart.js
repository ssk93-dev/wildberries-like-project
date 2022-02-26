export const cart = function () {
  const cartBtn = document.querySelector(".button-cart");
  const cart = document.getElementById("modal-cart");
  const closeBtn = cart.querySelector(".modal-close");
  const goodsContainer = document.querySelector(".long-goods-list");
  const cartTable = document.querySelector(".cart-table__goods");
  const cartForm = document.querySelector(".modal-form");
  const totalRow = document.querySelector(".card-table__total");

  const deleteCartItem = (id) => {
    const cart = JSON.parse(localStorage.getItem("cart"));
    const newCart = cart.filter((good) => good.id !== id);
    localStorage.setItem("cart", JSON.stringify(newCart));
    renderCartGoods(JSON.parse(localStorage.getItem("cart")));
  };

  const plusCartItem = (id) => {
    const cart = JSON.parse(localStorage.getItem("cart"));
    cart.forEach((good) => {
      if (good.id === id) {
        good.count += 1;
      }
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCartGoods(JSON.parse(localStorage.getItem("cart")));
  };

  const minusCartItem = (id) => {
    const cart = JSON.parse(localStorage.getItem("cart"));
    cart.forEach((good) => {
      if (good.id === id) {
        if (good.count > 0) good.count -= 1;
      }
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCartGoods(JSON.parse(localStorage.getItem("cart")));
  };

  const renderCartGoods = (goods) => {
    const total = goods.reduce(
      (acc, good) => acc + Number(good.price) * Number(good.count),
      0
    );
    cartTable.innerHTML = "";
    totalRow.innerHTML = "0$"
    goods.forEach((good) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${good.name}</td>
        <td>${good.price}$</td>
        <td><button class="cart-btn-minus"">-</button></td>
        <td>${good.count}</td>
        <td><button class=" cart-btn-plus"">+</button></td>
        <td>${Number(good.price) * Number(good.count)}$</td>
        <td><button class="cart-btn-delete"">x</button></td>
      `;
      cartTable.append(tr);
      totalRow.innerHTML = `${total}$`;

      tr.addEventListener("click", (e) => {
        if (e.target.classList.contains("cart-btn-minus")) {
          minusCartItem(good.id);
        } else if (e.target.classList.contains("cart-btn-plus")) {
          plusCartItem(good.id);
        } else if (e.target.classList.contains("cart-btn-delete")) {
          deleteCartItem(good.id);
        }
      });
    });
  };

  const addToCart = (goodId) => {
    const goods = JSON.parse(localStorage.getItem("goods"));
    const clickedGood = goods.find((good) => good.id === goodId);
    const cart = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
    if (cart.some((good) => good.id === clickedGood.id)) {
      cart.forEach((good) => {
        if (good.id === clickedGood.id) {
          good.count += 1;
        }
      });
    } else {
      clickedGood.count = 1;
      cart.push(clickedGood);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const sendForm = () => {
    const cartArray = JSON.parse(localStorage.getItem("cart"));
    const name = cartForm.nameCustomer.value;
    const phone = cartForm.phoneCustomer.value;
    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify({ cart: cartArray, name, phone }),
    }).then(() => {
      cart.style.display = "";
      localStorage.removeItem("cart");
      cartForm.reset();
    });
  };

  cartForm.addEventListener("submit", (e) => {
    e.preventDefault();
    sendForm();
  });

  cartBtn.addEventListener("click", () => {
    const cartArray = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
    renderCartGoods(cartArray);
    cart.style.display = "flex";
  });
  closeBtn.addEventListener("click", () => (cart.style.display = ""));
  cart.addEventListener("click", (e) => {
    if (!e.target.closest(".modal") && e.target.classList.contains("overlay")) {
      cart.style.display = "";
    }
  });

  if (goodsContainer) {
    goodsContainer.addEventListener("click", (e) => {
      if (e.target.closest(".add-to-cart")) {
        const buttonToCart = e.target.closest(".add-to-cart");
        const goodId = buttonToCart.dataset.id;
        addToCart(goodId);
      }
    });
  }
};

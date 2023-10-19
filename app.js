/*DARK MODE */
var themeToggleDarkIcon = document.getElementById("theme-toggle-dark-icon");
var themeToggleLightIcon = document.getElementById("theme-toggle-light-icon");

// Change the icons inside the button based on previous settings
if (
  localStorage.getItem("color-theme") === "dark" ||
  (!("color-theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  themeToggleLightIcon.classList.remove("hidden");
} else {
  themeToggleDarkIcon.classList.remove("hidden");
}

var themeToggleBtn = document.getElementById("theme-toggle");

themeToggleBtn.addEventListener("click", function () {
  // toggle icons inside button
  themeToggleDarkIcon.classList.toggle("hidden");
  themeToggleLightIcon.classList.toggle("hidden");

  // if set via local storage previously
  if (localStorage.getItem("color-theme")) {
    if (localStorage.getItem("color-theme") === "light") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
    }

    // if NOT set via local storage previously
  } else {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
    }
  }
});

/*DATA BASE*/

//Data Base Class
class DataBase {
  constructor() {
    this.products = [];
  }
  //Bring registers from API
  async bringRegisters() {
    try {
      const response = await fetch("https://fakestoreapi.com/products");
      this.products = await response.json();
      console.log("Products fetched:", this.products);
      return this.products;
    } catch (error) {
      console.error("Error fetching products:", error);
      return alert("Error on the server, sorry");
    }
  }
  //Bring Registers Method
  registerById(id) {
    return this.products.find((product) => product.id == id);
  }
  //Bring Registers by Keyword
  registerByName(word) {
    return this.products.filter((product) =>
      product.title.toLowerCase().includes(word)
    );
  }
  //Bring Registers by Category
  registerByCategory(keyword) {
    return this.products.filter((product) =>
      product.category.includes(keyword)
    );
  }
}

/*CART*/

//Cart Class
class Cart {
  constructor() {
    const storageCart = JSON.parse(localStorage.getItem("cart"));
    this.cart = storageCart || [];
    this.total = 0;
    this.totalProducts = 0;
    this.list();
  }
  //Find products in Cart
  inCart({ id }) {
    return this.cart.find((product) => product.id === id);
  }
  //Add to Cart
  addToCart(product) {
    let productOnCart = this.inCart(product);
    !productOnCart
      ? this.cart.push({ ...product, amount: 1 })
      : productOnCart.amount++;
    localStorage.setItem("cart", JSON.stringify(this.cart));
    this.list();
  }
  //Remove from Cart
  remove(id) {
    const index = this.cart.findIndex((product) => product.id === id);
    this.cart[index].amount > 1
      ? this.cart[index].amount--
      : this.cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(this.cart));
    this.list();
  }
  //Change amount from cart
  add(id) {
    const index = this.cart.findIndex((product) => product.id === id);
    if (this.cart[index].amount >= 1) {
      this.cart[index].amount++;
    }
    localStorage.setItem("cart", JSON.stringify(this.cart));
    this.list();
  }
  //List Products on Cart
  list() {
    this.total = 0;
    this.totalProducts = 0;
    listDiv.innerHTML = "";
    for (const product of this.cart) {
      listDiv.innerHTML += `
      <li class="py-3 sm:py-4">
        <div class="flex items-center space-x-4">
          <div class="flex-shrink-0">
            <img
              class="w-8 h-8 rounded-lg"
              src="${product.image}"
              alt="${product.title}"
            />
          </div>
          <div class="flex-1 min-w-0">
            <p
              class="text-sm font-medium text-gray-900 truncate dark:text-white"
            >
              ${product.title}
            </p>
            <p
              class="text-sm text-gray-500 truncate dark:text-gray-400"
            >
              ${product.description}
            </p>
          </div>
          <div>
            <button
              type="button"
              class="removeBtn text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-1 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              data-id="${product.id}"
            >
              -
            </button>
            <span class="px-2 dark:text-white">${product.amount}</span>
            <button
              type="button"
              class="addBtn text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-1 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              data-id="${product.id}"
            >
              +
            </button>
          </div>
          <div
            class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white"
          >
            ${product.price}
          </div>
        </div>
      </li>`;
      this.total += product.price * product.amount;
      this.totalProducts += product.amount;
    }
    //Remove Buttons
    const removeButtons = document.querySelectorAll(".removeBtn");
    for (const button of removeButtons) {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        this.remove(Number(button.dataset.id));
      });
    }
    //Add Buttons
    const addButtons = document.querySelectorAll(".addBtn");
    for (const button of addButtons) {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        this.add(Number(button.dataset.id));
      });
    }
    //Refresh cart variables
    spanProductsOnCart.innerText = this.totalProducts;
    spanCartTotal.innerText = this.total;
  }

  //Empty Cart
  emptyCart() {
    this.cart = [];
    localStorage.removeItem("cart");
    this.total = 0;
    this.totalProducts = 0;
    listDiv.innerHTML = "";

    // Render HTML elements
    spanProductsOnCart.innerText = this.totalProducts;
    spanCartTotal.innerText = this.total;
  }

  // Print Ticket
  printTicket() {
    const currentDate = new Date().toLocaleDateString();
    const ticketList = document.querySelector("#ticketList");
    //Ticket products list
    for (const product of this.cart) {
      ticketList.innerHTML += `<li class="py-3 sm:py-4">
      <div class="flex items-center space-x-4">
        <div class="flex-shrink-0">
          <img
            class="w-8 h-8 rounded-lg"
            src="${product.image}"
            alt="${product.title}"
          />
        </div>
        <div class="flex-1 min-w-0">
          <p
            class="text-sm font-medium text-gray-900 truncate dark:text-white"
          >
            ${product.title}
          </p>
          <p
            class="text-sm text-gray-500 truncate dark:text-gray-400"
          >
            ${product.description}
          </p>
        </div>
        <div>
          <p class="px-2 dark:text-white">${product.amount}</p>
        </div>
        <div
          class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white"
        >
          ${product.price}
        </div>
      </div>
    </li>`;
    }

    //Get user info from form
    const userName = document.getElementById("floating_first_name").value;
    const userLastName = document.getElementById("floating_last_name").value;
    const userPhone = document.getElementById("floating_phone").value;
    const userEmail = document.getElementById("floating_email").value;

    //Generate random Order Number
    function generateRandomOrderNumber() {
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const randomLetter =
        alphabet[Math.floor(Math.random() * alphabet.length)];
      const randomNumber = Math.floor(Math.random() * 10 ** 9);
      return `${randomLetter}${randomNumber}`;
    }

    //Form validation
    const validateEmail = (email) => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(email);
    };
    const validatePhone = (phone) => {
      const phonePattern = /^\d{9}$/;
      return phonePattern.test(phone);
    };

    // Ticket info
    const ticketData = document.querySelector("#ticketData");
    const orderNumber = generateRandomOrderNumber();
    if (
      (this.cart.length > 0) &
      (userName != "") &
      validateEmail(userEmail) &
      (userLastName != "") &
      validatePhone(userPhone)
    ) {
      ticketData.innerHTML = `
    <div>Total: ${this.total} $              (${currentDate})</div>
    <h3 class="text-lg mt-2">Purchase info:</h3>
    <ul>
      <li>Name: ${userName}</li>
      <li>Last Name: ${userLastName}</li>
      <li>Phone: ${userPhone}</li>
      <li>Email: ${userEmail}</li>
      <li>Order number: ${orderNumber}</li>
    </ul>
  `;
    } else {
      ticketData.innerHTML = `
      <p class="text-xl text-center">PURCHASE NOT POSSIBLE</p>
      `;
    }
  }
}

//Manage Close ticket modal
const closeTicketModal = document.querySelector("#closeTicketModal");
closeTicketModal.addEventListener("click", () => {
  cart.emptyCart();
  ticketList.innerHTML = " ";
  ticketData.innerHTML = " ";
});

//Manage Empty Cart button
const emptyCartButton = document.querySelector(".emptyCartBtn");
emptyCartButton.addEventListener("click", () => {
  cart.emptyCart();
});

// Manage print ticket button
const checkoutSubmit = document.querySelector("#checkout-submit");
checkoutSubmit.addEventListener("click", (event) => {
  event.preventDefault();
  cart.printTicket();
});

//DB inicialization
const DB = new DataBase();

//Prints the DB registers on the HTML
function loadProducts(products) {
  productsDiv.innerHTML = "";
  for (const product of products) {
    productsDiv.innerHTML += `
    <div
          class="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
        >
            <img
              class="h-80 w-auto mx-auto p-4 object-contain rounded-xl"
              src="${product.image}"
              alt="product image"
            />
          <div class="px-5 pb-5">
            <a href="#">
              <h5
                class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white"
              >
                ${product.title}
              </h5>
            </a>
            <div class="flex items-center justify-between">
              <span class="text-3xl font-bold text-gray-900 dark:text-white"
                >$${product.price}</span
              >
              <a
                href="#"
                class="addToCartBtn text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                data-id="${product.id}"
                >Add to cart</a
              >
            </div>
          </div>
        </div>
    `;
  }
  //Add to cart buttons
  const addToCartButtons = document.querySelectorAll(".addToCartBtn");
  for (const button of addToCartButtons) {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const id = Number(button.dataset.id);
      const product = DB.registerById(id);
      cart.addToCart(product);
    });
  }
}

/*Elements*/
const listDiv = document.querySelector("#listDiv");
const spanProductsOnCart = document.querySelector("#productsOncart");
const spanCartTotal = document.querySelector("#spanCartTotal");
const productsDiv = document.querySelector("#productsDiv");
const searchNavBar = document.querySelector("#search-navbar");
const searchNavBarMobile = document.querySelector("#search-navbar-mobile");
const electronicsCategory = document.querySelector("#electronics");
const jeweleryCategory = document.querySelector("#jewelery");
const menCategory = document.querySelector("#men");
const womenCategory = document.querySelector("#women");

//Search NavBar
searchNavBar.addEventListener("input", (event) => {
  const word = event.target.value.toLowerCase();
  loadProducts(DB.registerByName(word.toLowerCase()));
});
searchNavBarMobile.addEventListener("input", (event) => {
  const word = event.target.value.toLowerCase();
  loadProducts(DB.registerByName(word.toLowerCase()));
});

//Load by Categories
//Filter by Categories
electronicsCategory.addEventListener("click", (event) => {
  event.preventDefault();
  loadProducts(DB.registerByCategory("electronics"));
});
jeweleryCategory.addEventListener("click", (event) => {
  event.preventDefault();
  loadProducts(DB.registerByCategory("jewelery"));
});
menCategory.addEventListener("click", (event) => {
  event.preventDefault();
  loadProducts(DB.registerByCategory("men"));
});
womenCategory.addEventListener("click", (event) => {
  event.preventDefault();
  loadProducts(DB.registerByCategory("women"));
});

//Cart Object
const cart = new Cart();

//Load products
DB.bringRegisters().then((products) => loadProducts(products));

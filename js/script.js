function displayWelcomeMessage() {
  /*sessionStorage, guardar nombre y apellido del usuario y si ya existe en el sessionStorage que diga bienvenido devuelta y comienzo de uso de lo aprendido en clase de DOM*/
  let firstName = sessionStorage.getItem("firstName");
  let lastName = sessionStorage.getItem("lastName");

  const welcomeMessage = document.getElementById("welcome-message");
  /*si no encuentra name y lastname en sessionstorage...*/
  if (!firstName || !lastName) {
    const button = document.getElementById("saveName");

    button.addEventListener("click", () => {
      const firstNameInput = document.getElementById("firstNameInput").value; /*tomar el "value" que ingreso el usuario*/
      const lastNameInput = document.getElementById("lastNameInput").value; /*tomar el "value" que ingreso el usuario*/

      /*si ingresa nombre y apellido lo guarda en el sessionstorage */
      if (firstNameInput && lastNameInput) {
        sessionStorage.setItem("firstName", firstNameInput);
        sessionStorage.setItem("lastName", lastNameInput);
        /*da la bienvenida al usuario con su nombre y apellido */
        welcomeMessage.innerHTML = `Welcome ${firstNameInput} ${lastNameInput} to Mr. Hyde Guitar Store!`;
      } else { /*sino solamente da la bienvenida sin nombrar al usuario*/
        welcomeMessage.innerHTML = `Welcome to Mr. Hyde Guitar Store!`;
      }
    });

  } else { /*si ya encuentra los datos en el sessionstorage da la bienvenida nuevamente*/
    welcomeMessage.innerHTML = `Welcome back, ${firstName} ${lastName}!`;
  }
}
displayWelcomeMessage();

let listProducts = [];
function getProducts(){
  const URL = "https://683f056f1cd60dca33de000c.mockapi.io/api/GuitarShopAPI/products";
  fetch(URL)
    .then(response => response.json()) /*.json pasa de objeto response a objeto js real*/
    .then(products => {
      console.log(products);
      listProducts = products;
      console.log(listProducts);
      renderProductButtons(); 
    })
    .catch(error => console.log("Something went wrong", error))
    .finally(()=> Swal.fire({
      title: "End of asynchronous process",
      icon: "success",
      confirmButtonText: "Ok"
    }));
}
function renderProductButtons() {
  listProducts.forEach(product => {
    const div = document.getElementById(product.id);
    if (div) {
      const btn = div.querySelector("button");
      if (btn) {
        btn.addEventListener("click", () => {
          addToCart(product.name, Number(product.price));
        });
      }
    }
  });
}
/* array */
let cart = [];
/*variable */
let total = 0;
/*recuperar el carrito por localstorage -getItem*/
const savedCart = localStorage.getItem("cart");
if (savedCart) {
    cart = JSON.parse(savedCart); /*aca vuelve del string a array nuevamente ya que estaba en localstorage que solo guarda strings a array nuevamente*/
}
/*arrow function*/
const addToCart = (guitarName, price) => {
    /*uso de some para ver si un producto ya esta en el carrito (x el uso de localstorage para el carrito) y se complementa con un if y un else, dado el caso de que ya este en el carrito que muestre que el producto ya se encuentra en el carrito o sino (else) lo agrega al carrito */
    const isInCart = cart.some(item => item.name === guitarName);
    if (isInCart) { 
        Swal.fire({
          title: `${guitarName} is already in the cart.`,
          icon: "info",
          confirmButtonText: "Ok"
        });
    } else {  
        cart.push({ name: guitarName, price: price });
        localStorage.setItem("cart", JSON.stringify(cart));
        Swal.fire({
           title: `${guitarName} added to the cart for $${price}.`,
          icon: "success",
          confirmButtonText: "Ok"
        });
        Toastify({
          text: "Remember to check out our discounts shown in the Home section.",
          duration: 3000,
          gravity: "top",
          position: "right",
          style: {
            background: "black",
            color: "white",
            borderRadius: "8px",
            padding: "16px 24px",
            fontSize: "38px"
          }
        }).showToast();
        console.log(`Added ${guitarName} to cart with price $${price}`);
    }
};

/*reduce*/
function calculateTotal() {
    return cart.reduce((acc, item) => acc + item.price, 0);
}

function showCart() {
    if (cart.length === 0) {  
        Swal.fire({
           title: "Your cart is empty.",
          icon: "info",
          confirmButtonText: "Ok"
        });
        console.log("Cart is empty");
        return;
    }

    let cartSummary = "Your Cart:\n";
    /*bucle for*/
    for (let i = 0; i < cart.length; i++) {
        cartSummary += `${cart[i].name} - $${cart[i].price}\n`;
    };
    
    total = calculateTotal();
    Swal.fire({
    title: 'Your Cart',
    text: cartSummary,
    icon: 'success',
    });

    console.log(cartSummary);
    } 
function clearCart() {
    if (cart.length === 0) {
        Swal.fire({
            title: "Cart is already empty.",
            icon: "info",
            confirmButtonText: "Ok"
        });
        return;
    }

    cart = [];
    total = 0;
    localStorage.removeItem("cart");

    Swal.fire({
        title: "Your cart has been cleared.",
        icon: "success",
        confirmButtonText: "Ok"
    });

    console.log("Cart cleared");
}

document.getElementById('clearCartBtn').addEventListener('click', clearCart);

function applyDiscount(total) {
    let discount = 0;
    if (total >= 30000) {
        discount = 30;
    } else if (total >= 20000) {
        discount = 20;
    } else if (total >= 10000) {
        discount = 10;
    }

    let finalPrice = total - (total * (discount / 100));  
    Swal.fire({
      title: `Your total is $${total}. Discount applied: ${discount}%. Final price: $${finalPrice}`,
      icon: "success",
      confirmButtonText: "Ok"
    }).then(() => {
      /*Limpiar el carrito luego de mostrar el mensaje*/
      cart = [];
      total = 0;
      localStorage.removeItem("cart");
      console.log("Cart cleared after purchase");
    });
    console.log(`Final price after discount: $${finalPrice}`);
}
document.getElementById('finalizePurchaseBtn').addEventListener('click', () => {
    if (cart.length === 0) {  
        Swal.fire({
          title: "Your cart is empty.",
         icon: "warning",
         confirmButtonText: "Ok"
        });
        return;
    }
    const totalAmount = calculateTotal();
    applyDiscount(totalAmount);
});
function searchGuitarByModel() {
    const searchGuitar = document.getElementById('modelSearchInput').value.trim().toUpperCase(); /*trim para eliminar espacios en blanco al principio y final*/

    /*uso de filter xq no te da un solo resultado sino todo que cumpla con la funcion*/
    const filtered = listProducts.filter(guitar => 
        guitar.name.toUpperCase().includes(searchGuitar)
    );

    if (filtered.length === 0) {  
        Swal.fire({
          title: "No guitars found matching your search.",
         icon: "warning",
         confirmButtonText: "Ok"
        });
        return;
    }

    /*uso de sort para ordenar del precio mas barato hacia el mas caro*/
    const sorted = filtered.sort((a, b) => a.price - b.price);
    /*se enumeran los resultados para poder elegir*/
    let message = "Search Results:\n";
     sorted.forEach(guitar => {
        message += `${guitar.name} - ${guitar.brand} - $${guitar.price}\n`;
    });

    Swal.fire({
      title: message,
      icon: 'success',
      confirmButtonText: 'Ok'
    });
     listProducts.forEach(product => {
        const div = document.getElementById(product.id);
        if (div) {
            if (filtered.includes(product)) {
                div.style.display = "block"; /*devuelve la guitarra encontrada*/
            } else {
                div.style.display = "none";
            }
        }
    });

}

document.getElementById('showAllBtn').addEventListener('click', () => {
  listProducts.forEach(product => {
    const div = document.getElementById(product.id);
    if (div) {
      div.style.display = "block";  /*mostrar todos los divs*/
    }
  });
});


    document.getElementById('searchBtn').addEventListener('click', searchGuitarByModel);
/*addEventListener getElementByClassName*/
const nodosBotones = document.getElementsByClassName('btn-showcart');
nodosBotones[0].addEventListener('click', ()=>{
    showCart();
})
getProducts();


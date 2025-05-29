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

/*array de productos*/
const products = [
  { id: 1, name: "Stratocaster", brand: "Fender", color: "Black", price: 4000 },
  { id: 2, name: "Telecaster", brand: "Squier", color: "Natural Wood", price: 5000 },
  { id: 3, name: "Dinky", brand: "Jackson", color: "Green", price: 6000 },
  { id: 4, name: "Sg", brand: "Gibson", color: "Red", price: 7000 },
  { id: 5, name: "Flying v", brand: "Jackson", color: "Red", price: 8000 },
  { id: 6, name: "Les Paul", brand: "LTD", color: "Black", price: 9000 },
  { id: 7, name: "Max Cavalera", brand: "LTD", color: "Black", price: 10000 },
  { id: 8, name: " Alexi Laiho", brand: "ESP", color: "Black-Green", price: 10500 },
  { id: 9, name: "Explorer", brand: "Dean", color: "Black", price: 20000 },
  { id: 10, name: "Arrow", brand: "Jackson", color: "Red-Black", price: 20500 },
  { id: 11, name: "Randy Rhoads", brand: "ESP", color: "Black", price: 30500 },
  { id: 12, name: "Prestige", brand: "Ibanez", color: "Gray", price: 40000 },
  { id: 13, name: "Soloist", brand: "Jackson", color: "Blue-Pink", price: 40500 },
  { id: 14, name: "Kiko Loureiro", brand: "Ibanez", color: "Blue", price: 50000 },
  { id: 15, name: "EC-1000", brand: "LTD", color: "Orange", price: 50500 }
];

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
        alert(`${guitarName} is already in the cart.`);
    } else {
        cart.push({ name: guitarName, price: price });
        localStorage.setItem("cart", JSON.stringify(cart));
        alert(`${guitarName} added to the cart for $${price}.`);
        console.log(`Added ${guitarName} to cart with price $${price}`);
    }
};

/*reduce*/
function calculateTotal() {
    return cart.reduce((acc, item) => acc + item.price, 0);
}

/*segunda function*/
function showCart() {
    if (cart.length === 0) {
        alert("Your cart is empty.");
        console.log("Cart is empty");
        return;
    }

    let cartSummary = "Your Cart:\n";
    /*bucle for*/
    for (let i = 0; i < cart.length; i++) {
        cartSummary += `${cart[i].name} - $${cart[i].price}\n`;
    };
    
    total = calculateTotal();
    alert(cartSummary);
    console.log(cartSummary);
    /*confirm*/
    let cleanCart = confirm("Do you want to clean the cart?");
    /*if else*/
    if (cleanCart) {
        cart = [];
        total = 0;
        /*limpiar el carrito de localstorage -removeItem*/
        localStorage.removeItem("cart");
        alert("Your cart has been cleared.");
        console.log("Cart cleared");
    } 
}
/*tercer function*/
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
    alert(`Your total is $${total}. Discount applied: ${discount}%. Final price: $${finalPrice}`);
    console.log(`Final price after discount: $${finalPrice}`);
}
document.getElementById('finalizePurchaseBtn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }
    const totalAmount = calculateTotal();
    applyDiscount(totalAmount);
});
function searchGuitarByModel() {
    const searchGuitar = document.getElementById('modelSearchInput').value.trim().toUpperCase(); /*trim para eliminar espacios en blanco al principio y final*/

    /*uso de filter xq no te da un solo resultado sino todo que cumpla con la funcion*/
    const filtered = products.filter(guitar => 
        guitar.name.toUpperCase().includes(searchGuitar)
    );

    if (filtered.length === 0) {
        alert("No guitars found matching your search.");
        return;
    }

    /*uso de sort para ordenar del precio mas barato hacia el mas caro*/
    const sorted = filtered.sort((a, b) => a.price - b.price);
    /*se enumeran los resultados para poder elegir*/
    let message = "Search Results:\n";
     sorted.forEach(guitar => {
        message += `${guitar.name} - ${guitar.brand} - $${guitar.price}\n`;
    });

    alert(message);
     products.forEach(product => {
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
  products.forEach(product => {
    const div = document.getElementById(product.id);
    if (div) {
      div.style.display = "block";  // mostrar todos los divs
    }
  });
});


    document.getElementById('searchBtn').addEventListener('click', searchGuitarByModel);
/*addEventListener getElementByClassName*/
const nodosBotones = document.getElementsByClassName('btn-showcart');
nodosBotones[0].addEventListener('click', ()=>{
    showCart();
})

/*agregar al carrito */
products.forEach(product => {  /*for each*/
  const div = document.getElementById(product.id); /*getelementbyid*/
    if (div) {
    const btn = div.querySelector('button'); /*queryselector*/
    if (btn) {
      btn.addEventListener('click', () => { 
        addToCart(product.name, product.price);
      });
    }
  }
});

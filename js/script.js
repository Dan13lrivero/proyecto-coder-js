/*funcion constructora*/
function User(firstName, lastName, showGreeting = true) {
    this.firstName = firstName;
    this.lastName = lastName;

    this.speak = function () {
        if (showGreeting) {
            alert(`Hi ${this.firstName} ${this.lastName}, welcome to the Guitar Store!`);
        }
    };

    this.speak();
}
/*sessionStorage, guardar nombre y apellido del usuario y si ya existe en el sessionStorage que diga bienvenido devuelta*/
let firstName = sessionStorage.getItem("firstName");
let lastName = sessionStorage.getItem("lastName");

if (!firstName || !lastName) {
    firstName = prompt("Enter your first name:");
    lastName = prompt("Enter your last name:");

    sessionStorage.setItem("firstName", firstName);
    sessionStorage.setItem("lastName", lastName);

    let user = new User(firstName, lastName);
} else {

    alert(`Welcome back, ${firstName} ${lastName}!`);
    let user = new User(firstName, lastName, false);
}
/*array de productos*/
const products = [
    { id: 1, name: "Flying V", brand: "Gibson", color: "Red", price: 1000 },
    { id: 2, name: "Explorer", brand: "Gibson", color: "Black", price: 2000 },
    { id: 3, name: "Warlock", brand: "B.C. Rich", color: "White", price: 3000 }
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
/* primer funcion*/
function showGuitarOptions() {
    console.clear();

       let optionsText = "Enter the number of the guitar you want to add:\n";
       /*for each*/
    products.forEach(product => {
        optionsText += `${product.id}. ${product.name} - ${product.brand} (${product.color}) - $${product.price}\n`;
    });
    optionsText += "Type 's' to search for a guitar by model.\n";
    optionsText += "Type '0' to finish.\n";
    optionsText += "10% discount over $1000\n20% over $2000\n30% over $3000";

    let guitarChoice = prompt(optionsText);

    if (guitarChoice === '0') {
        showCart();

    } else if (guitarChoice.toLowerCase() === 's') {  /*uso de "ToLowerCase" por si el usuario ingresa una "s" mayuscula*/
        searchGuitarByModel();

    } else {
    /*en este caso se usa find xq busca un solo resultado por id*/
    const selectedProduct = products.find(product => product.id === parseInt(guitarChoice)); /*parseInt para pasar el string que siempre devuelve el prompt a numero*/
    if (selectedProduct) {
        addToCart(selectedProduct.name, selectedProduct.price);
    } else {
        alert("Invalid option. Please enter a valid number or 's' to search.");
        showGuitarOptions();
    }
}
    
    /*se cambio el switch por if/else if/else ya que las guitarras estan en un const products, si se agrega una guitarra nueva se agrega en const products en lugar de sumar un case al switch, ademas de mas organizado y facil de mantener, tambien por no poder usar find en un switch */
    if (guitarChoice === '0') {
        console.log("User finished shopping");
        showCart();
    } else if (selectedProduct) {
        console.log(`User choice: ${selectedProduct.name}`);
        addToCart(selectedProduct.name, selectedProduct.price);
    } else {
        console.log("User entered invalid option:", guitarChoice);
        alert("Invalid option. Please enter a valid number.");
        showGuitarOptions();
    }
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
    showGuitarOptions();
};

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
    /*reduce*/
    total = cart.reduce((accumulator, item) => accumulator + item.price, 0);
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
    } else {
        applyDiscount();
        return;
    }
}
/*tercer function*/
function applyDiscount() {
    let discount = 0;
    if (total >= 3000) {
        discount = 30;
    } else if (total >= 2000) {
        discount = 20;
    } else if (total >= 1000) {
        discount = 10;
    }

    let finalPrice = total - (total * (discount / 100));
    alert(`Your total is $${total}. Discount applied: ${discount}%. Final price: $${finalPrice}`);
    console.log(`Final price after discount: $${finalPrice}`);
    showGuitarOptions();
}
function searchGuitarByModel() {
    const searchGuitar = prompt("Enter the guitar model to search:").toUpperCase();

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
    sorted.forEach((guitar, index) => {
        message += `${index + 1}. ${guitar.name} - ${guitar.brand} - $${guitar.price}\n`;
    });

    message += "Enter the number to add a guitar to your cart.\n";
    message += "Or type '0' to go back to the main menu.";

    const choice = prompt(message);

    if (choice === '0') {
        showGuitarOptions(); 
        return;
    }

    const index = parseInt(choice) - 1;

    if (index >= 0 && index < sorted.length) {
        const selected = sorted[index];
        addToCart(selected.name, selected.price); 
    } else {
        alert("Invalid option. Returning to main menu.");
        showGuitarOptions();
    }

    /* alert(message); */
}
/*llamada de funcion*/
showGuitarOptions();

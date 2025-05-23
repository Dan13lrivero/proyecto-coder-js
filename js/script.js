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
/* array */
let cart = [];
/*variable */
let total = 0;
/*recuperar el carrito por localstorage -getItem*/
const savedCart = localStorage.getItem("cart");
if (savedCart) {
    cart = JSON.parse(savedCart); /*aca vuelve del string ya que estaba en localstorage que solo guarda strings a array nuevamente*/
}
/* primer funcion*/
function showGuitarOptions() {
    console.clear();
    /*prompt*/
    let guitarChoice = prompt("Enter the number of the guitar you want to add:\n1. Flying V - $1000\n2. Explorer - $2000\n3. Warlock - $3000\nType '0' to finish.\n10% discount for purchases over $1000\n20% discount for purchases over $2000\n30% discount for purchases over $3000");
    /*switch*/
    switch (guitarChoice) {
        case '1':
            console.log("User choice: Flying V");
            addToCart("Flying V", 1000);
            break;
        case '2':
            console.log("User choice: Explorer");
            addToCart("Explorer", 2000);
            break;
        case '3':
            console.log("User choice: Warlock");
            addToCart("Warlock", 3000);
            break;
        case '0':
            console.log("User finished shopping");
            showCart();
            break;
        default:
            console.log("User entered invalid option:", guitarChoice);
            /*alert*/
            alert("Invalid option. Please enter a valid number.");
            showGuitarOptions();
            break;
    }
}
/*arrow function*/
const addToCart = (guitarName, price) => {
    cart.push({ name: guitarName, price: price });
    /*localStorage setItem*/
    localStorage.setItem("cart", JSON.stringify(cart)); /*convierte el array en string, xq localstorage solo guarda strings (tambien puedo guardar por id usando for of como ejemplo de clase)*/
    alert(`${guitarName} added to the cart for $${price}.`);
    console.log(`Added ${guitarName} to cart with price $${price}`);
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
        total += cart[i].price;
    };
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
}
/*llamada de funcion*/
showGuitarOptions();

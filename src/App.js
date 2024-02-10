document.addEventListener('alpine:init', () => {
    Alpine.data('products', () => ({
        items: [
            { id: 1, name: 'Baju Kaos Polos Cotton Combed 30s', img: 'Baju_6.jpg', price: 35500},
            { id: 2, name: 'Aerostreet Extra Soft T Shirt Reguler Polos Gelap', img: 'Baju_7.jpg', price: 49900},
            { id: 3, name: 'Aerostreet T Shirt Golden Samurai Navy Kaos', img: 'Baju_8.jpg', price: 69900},
            { id: 4, name: 'Kaos Bumblebee Transformers', img: 'Baju_3.jpg', price: 90000},
            { id: 5, name: 'Kaos Gun N Roses Appetite', img: 'Baju_4.jpg', price: 90000},
            { id: 6, name: 'Kaos Iron Maiden Hallowwed', img: 'Baju_5.jpg', price: 90000},
            { id: 7, name: 'GARAF KEN Baju Kemeja Lengan Pendek Pria Putih', img: 'kemeja_1.jpg', price: 52000},
            { id: 8, name: 'Kemeja - Pallete Shirt Long Sleeve - Dark Olive', img: 'kemeja_2.jpg', price: 145000},
            { id: 9, name: 'Kemeja - Pallete Shirt Long Sleeve - Navy', img: 'kemeja_3.jpg', price: 145000},
            { id: 10, name: 'Kemeja Pantai Hawai Pria Baju Hawaiian Shirt Rayon', img: 'kemeja_4.jpg', price: 59000},
            { id: 11, name: 'Kemeja Polo - Parisan Polo Long Sleeve - Deep Green', img: 'kemeja_5.jpg', price: 151000},
            { id: 12, name: 'GARAF KELVIN Baju Kemeja Lengan Panjang Pria Polos Abu-abu', img: 'kemeja_6.png', price: 49000},
        ],
            
    }));

    Alpine.store('cart', {
        items: [],
        total: 0,
        quantity: 0,
        add(newItem){
            const cartItem = this.items.find((item) => item.id === newItem.id);
            if(!cartItem){
                this.items.push({...newItem, quantity:1, total: newItem.price});
                this.quantity++;
                this.total += newItem.price;
            } else{
                this.items = this.items.map((item) => {
                    if(item.id !== newItem.id) {
                        return item;
                    } else {
                        item.quantity++;
                        item.total = item.price * item.quantity;
                        this.quantity++;
                        this.total += item.price;
                        return item;
                    }
                })
            }
        },
        remove(id) {
            const cartItem = this.items.find((item) => item.id === id);
            if(cartItem.quantity > 1) {
                this.items = this.items.map((item) => {
                    if(item.id !== id) {
                        return item;
                    } else {
                        item.quantity--;
                        item.total = item.price * item.quantity;
                        this.quantity--;
                        this.total -= item.price;
                        return item;
                    }
                })
            } else if (cartItem.quantity ===1) {
                this.items = this.items.filter((item) => item.id !== id);
                this.quantity--;
                this.total -= cartItem.price;
            }
        }
    })
});

const checkoutButton = document.querySelector('.checkout-button');
checkoutButton.disabled = true;
const form = document.querySelector('#checkoutForm');

form.addEventListener('keyup', function() {
    for(let i = 0; i < form.elements.length; i++) {
        if(form.elements[i].value.length !== 0){
            checkoutButton.classList.remove('disabled');
            checkoutButton.classList.add('disabled');
        } else {
            return false;
        }
    }
    checkoutButton.disabled = false;
    checkoutButton.classList.remove('disabled');
});

checkoutButton.addEventListener('click', function(e) {
    e.preventDefault();
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);
    const objData = Object.fromEntries(data);
    console.log(objData);
    const massage = formatMassage(objData);
    window.open('http://wa.me/6281268892290?text=' + encodeURIComponent(massage));
});

const formatMassage = (obj) => {
    return `Data Customer
    Nama : ${obj.name}
    Email : ${obj.email}
    No Hp : ${obj.phone}
    Data Pesanan
    ${JSON.parse(obj.items).map((item) => `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n`)}
    Total: ${rupiah(obj.total)}
    Terima kasih.`;
}

const rupiah = (number) => {
    return new Intl.NumberFormat('id-ID',{
        style: 'currency',
        currency:'IDR',
        //minimumFractionDigits: 0,
    }).format(number);
}
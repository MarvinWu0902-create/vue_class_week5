// import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.1/vue.esm-browser.min.js';
const { createApp } = Vue;
const {Form,Field,ErrorMessage}=VeeValidate;
import axios from 'https://cdnjs.cloudflare.com/ajax/libs/axios/1.6.5/esm/axios.js';


import productList from '/components/ProductList.js';
import productCart from '/components/ProductShopCart.js';
import productModal from '/components/ProductModal.js';
// import productValidate from '/components/ProductValidate.js'

const api = 'https://ec-course-api.hexschool.io/v2/api';
const apiPath = 'marvinapipath';
let productModalInfo = null;

Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
        VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
});

VeeValidateI18n.loadLocaleFromURL('../zh_TW.json');
VeeValidate.configure({
    generateMessage: VeeValidateI18n.localize('zh_TW'),
    validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
  });

const app = createApp({
    data() {
        return {
            productionData: [],

            cartsData: [],
            isLoadAddCart: '',
            isLoadDelCart: false,

            isLoadOpenModal: false,
            tempProduct: {},

            totalPrice: 0,
            finalPrice: 0,

            isLoading: false,
            fullPage: true,

            user: {
                email: '',
                name: '',
                phone: '',
                address: '',
                message: ''

            }
        }
    },
    methods: {
        // 先確認是否cookie上帶有token，沒有則導向LoginView.html
        checkToken() {
            return axios.post(`${api}/user/check`, null)
                .then((res) => {
                    if (!res.data.success) {
                        window.location = 'LoginView.html';
                    } else {
                        return this.getProduct('all');
                    }
                })
                .catch((err) => {
                    alert(err.response.data.message);
                    window.location = 'LoginView.html';
                })
        },
        // 設置Cookie
        setHeaderToken() {
            const token = document.cookie.split("; ")
                .find((row) => row.startsWith("hexVueToken="))
                ?.split("=")[1];
            axios.defaults.headers.common["Authorization"] = token;
        },
        // 取得產品資料
        getProduct(type, id) {

            let url = type === 'all' ? 'products' : `product/${id}`;

            return axios.get(`${api}/${apiPath}/${url}`)
                .then((res) => {

                    const { products, product } = res.data;
                    type === 'all'
                        ? this.productionData = products
                        : this.tempProduct = product;

                })
                .catch((err) => {
                    alert(err.data.message);
                })
        },
        // 取得購物車資料
        getProductCart() {
            return axios.get(`${api}/${apiPath}/cart`)
                .then((res) => {

                    const { carts, total, final_total } = res.data.data;
                    this.cartsData = carts;
                    this.totalPrice = total;
                    this.finalPrice = final_total;

                    this.isLoadAddCart = '';
                    this.isLoadDelCart = false;
                    this.isLoading = false;
                })
                .catch((err) => {
                    alert(err.data.message);
                })
        },
        addProductToCart(data) {
            
            const { id, product_id, qty, type } = data;

            if (type === 'button'||type==='modal') {    // 判斷是以用加入購物車or更改input count
                this.isLoadAddCart = product_id;
                // this.isLoading = true;
                return axios.post(`${api}/${apiPath}/cart`, {
                    data: {
                        product_id,
                        qty
                    }
                })
                    .then((res) => {
                        // alert(res.data.message);
                        if(type==='modal') this.closeProductModal();
                        
                        return this.getProductCart();

                    })
                    .catch((err) => {
                        alert(err.data.message);
                    });
            } else {

                return axios.put(`${api}/${apiPath}/cart/${id}`, {
                    data: {
                        product_id,
                        qty
                    }
                })
                    .then((res) => {
                        // alert(res.data.message);
                        return this.getProductCart()
                    })
                    .catch((err) => {
                        alert(err.data.message);
                    })
            }
        },
        delProductCart(params) {
            const { type, cartId } = params;

            let url = type === 'all' ? 'carts' : `cart/${cartId}`;

            this.isLoadDelCart = type === 'single' ? true : false;
            this.isLoading = true;
            return axios.delete(`${api}/${apiPath}/${url}`)
                .then((res) => {
                    // alert(res.data.message);
                    return this.getProductCart();
                })
                .catch((err) => {
                    alert(err.data.message);
                })
        },
        openProductModal(product_id) { ///先取得購物車id?

            this.isLoadOpenModal = product_id;

            this.getProduct('single', product_id)
                .then((res) => {
                    productModalInfo.show();
                })
                .catch((err) => {
                    alert(err.data.message);
                })
        },
        closeProductModal(){
            this.isLoadOpenModal='';
            productModalInfo.hide();
        },
        isPhone(value) {
            const phoneNumber = /^(09)[0-9]{8}$/
            return phoneNumber.test(value) ? true : '需要正確的電話號碼'
        },
        onSubmit(){
            console.log('sunmit');
        }
    },
    mounted() {
        this.setHeaderToken();
        this.checkToken();
        this.getProductCart();
        productModalInfo = new bootstrap.Modal(this.$refs.productModal.$refs.productModal);
        // 也可以用loader=this.$loading.show(); 
        // loader.hide();
    }
});
app.component('productList', productList);
app.component('productCart', productCart);
app.component('productModal', productModal);
// app.component('productValidate',productValidate)
// app.use(VueLoading.LoadingPlugin);

app.component('loading', VueLoading.Component);
app.component('VForm', Form);
app.component('VField', Field);
app.component('ErrorMessage', ErrorMessage);
app.mount('#app');


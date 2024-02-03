
export default {
    template: `
    <table class="table align-middle">
    <thead>
        <tr>
            <th>圖片</th>
            <th>商品名稱</th>
            <th>價格</th>
            <th></th>
        </tr>
    </thead>
    <tbody>
    
        <tr v-for="product of InnerProductData " :key="product.id">
            <td style="width: 200px">
                <div>
                <img style="height: 100px; background-size: cover; background-position: center" :src="product.imageUrl">
                </div>
            </td>
            <td>
                {{product.title}}
            </td>
            <td>
                <del class="h6">原價 {{product.origin_price}} 元</del>
                <div class="h5">現在只要 {{product.price}} 元</div>
            </td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button type="button" class="btn btn-outline-secondary" @click="searchInfoMore(product.id)"
                    :disabled="isLoadSearchInfo===product.id">
                        <i class="fas  fa-pulse" :class="{'fa-spinner':isLoadSearchInfo== product.id}"></i>
                        查看更多
                    </button>
                    <button type="button" class="btn btn-outline-danger" @click="addProductToCart(product.id)" 
                    :disabled="isLoadAddToCart===product.id">
                        <i class="fas fa-pulse" :class="{'fa-spinner':isLoadAddToCart===product.id}"></i>
                        加到購物車
                    </button>
                </div>
            </td>
        </tr>
    </tbody>
</table>`,
    props: ['productData', 'isLoadAdd', 'isLoadModal'],
    data() {
        return {
            InnerProductData: [],
            isLoadAddToCart: '',
            isLoadSearchInfo: '',
        }
    },
    methods: {
        addProductToCart(product_id, qty = 1) {
            // 將要加入購物車的product id 傳出去給父元件觸發
            const params = {
                product_id,
                qty,
                type: 'button'
            };
            this.$emit('addtocart', params);
        },
        searchInfoMore(product_id) {
            this.$emit('open-modal', product_id);
        }
    },
    watch: {
        productData() {
            this.InnerProductData = this.productData;
        },
        isLoadAdd() {
            this.isLoadAddToCart = this.isLoadAdd;
        },
        isLoadModal() {
            this.isLoadSearchInfo = this.isLoadModal;
        }

    },
    mounted() {

    }

};




export default {
    template: `<div class="text-end">
    <button class="btn btn-outline-danger" type="button" @click="delProductCart('all')">清空購物車</button>
</div>

<table class="table align-middle">
    <thead>
        <tr>
            <th></th>
            <th>品名</th>
            <th style="width: 150px">數量/單位</th>
            <th>單價</th>
        </tr>
    </thead>
    <tbody>
        <template v-if="innerCartData">
            <tr v-for="cartData of innerCartData" :key="cartData.id">
                <td>
                    <button type="button" class="btn btn-outline-danger btn-sm" @click="delProductCart('single',cartData.id)">
                        <i class="fas fa-pulse text-center" :class="{'fa-spinner':isLoadDelToCart && cartData.id===tempCartId}"></i>
                        x
                    </button>
                </td>
                <td>
                    {{cartData.product.title}}
                    <div class="text-success">
                        已套用優惠券
                    </div>
                </td>
                <td>
                    <div class="input-group input-group-sm">
                        <div class="input-group mb-3">
                            <input min="1" type="number" class="form-control" v-model="cartData.qty" @change="addProductCount(cartData)">
                                <span class="input-group-text" id="basic-addon2">{{cartData.product.unit}}</span>
                        </div>
                    </div>
                </td>
                <td class="text-end">
                    <small class="text-success">折扣價：</small>
                    {{cartData.final_total}}
                </td>
            </tr>
        </template>
    </tbody>
    <tfoot>
        <tr>
            <td colspan="3" class="text-end">總計</td>
            <td class="text-end">{{innerTotalPrice}}</td>
        </tr>
        <tr>
            <td colspan="3" class="text-end text-success">折扣價</td>
            <td class="text-end text-success">{{innerFinalPrice}}</td>
        </tr>
    </tfoot>
</table>`,
    props: ['cartsData', 'totalPrice', 'finalPrice', 'is-load'],
    data() {
        return {
            innerCartData: [],
            innerTotalPrice: 0,
            innerFinalPrice: 0,

            isLoadDelToCart: false,
            tempCartId: ''
        }
    },
    methods: {
        delProductCart(type, cartId) {
            const params = {
                type, cartId
            };
            if (type == 'single') this.tempCartId = cartId;

            this.$emit('del-cart', params);
        },
        addProductCount(cartData) {
            const { id, product_id, qty } = cartData;
            const params = {
                id,
                product_id,
                qty,
                type: 'input'
            };
            this.$emit('add-count', params);
        }
    },
    watch: {
        cartsData() {
            this.innerCartData = this.cartsData;
            this.innerTotalPrice = this.totalPrice;
            this.innerFinalPrice = this.finalPrice;
        },
        isLoad() {
            this.isLoadDelToCart = this.isLoad;
        }
    }

}
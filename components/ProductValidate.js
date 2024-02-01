
export default {
    template:`<div class="my-5 row justify-content-center">
    <v-form ref="form" class="col-md-6" v-slot="{ errors }" @submit="onSubmit">
        <div class="mb-3">
            <label for="email" class="form-label">Email</label>

            <v-field id="email" name="email" type="email" class="form-control" v-model="user.email"
                :class="{ 'is-invalid': errors['email'] }" placeholder="請輸入 Email" rules="email|require"></v-field>

            <error-message name="email" class="invalid-feedback"></error-message>
        </div>

        <div class="mb-3">
            <label for="name" class="form-label">收件人姓名</label>
            <v-field id="name" name="姓名" type="text" class="form-control" v-model="user.name"
                :class="{ 'is-invalid': errors['姓名'] }" placeholder="請輸入姓名" rules="required"></v-field>
            <error-message name="姓名" class="invalid-feedback"></error-message>
        </div>

        <div class="mb-3">
            <label for="tel" class="form-label">收件人電話</label>
            <v-field id="tel" name="電話" type="text" class="form-control" v-model="user.phone"
                :class="{ 'is-invalid': errors['電話'] }" placeholder="請輸入電話" :rules="isPhone"></v-field>
            <error-message name="電話" class="invalid-feedback"></error-message>
        </div>

        <div class="mb-3">
            <label for="address" class="form-label">收件人地址</label>
            <v-field id="address" name="地址" type="text" class="form-control" v-model="user.address"
                :class="{ 'is-invalid': errors['地址'] }" placeholder="請輸入地址" rules="required"></v-field>
            <error-message name="地址" class="invalid-feedback"></error-message>
        </div>

        <div class="mb-3">
            <label for="message" class="form-label">留言</label>
            <v-field id="message" name="message" type="text" class="form-control" cols="30" rows="10" v-model="user.message"
                :class="{ 'is-invalid': errors['message'] }" placeholder="請輸入留言" rules="required" as="textarea"></v-field>
            <error-message name="message" class="invalid-feedback"></error-message>
        </div>
        <div class="text-end">
            <button type="submit" class="btn btn-danger">送出訂單</button>
        </div>
    </v-form>
</div>`,
    data(){
        return {
            user:{
                email:'',
                name:'',
                phone:'',
                address:'',
                message:''

            }
        }
    },
    methods:{
        onSubmit(){

        },
        isPhone(value) {
            const phoneNumber = /^(09)[0-9]{8}$/
            return phoneNumber.test(value) ? true : '需要正確的電話號碼'
          }
    },
    mounted(){
        
        Object.keys(VeeValidateRules).forEach(rule => {
            if (rule !== 'default') {
              VeeValidate.defineRule(rule, VeeValidateRules[rule]);
            }
          });
    }

};
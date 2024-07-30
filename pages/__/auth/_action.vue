<template>
  <v-row justify="center">
    <v-snackbar v-model="snackbar" timeout="2000">{{message}}</v-snackbar>
    <v-col lg="4" md="6">
        <v-card class="py-10 px-10">
            <v-form>
                <v-text-field label="Enter new Password" v-model="newPassword"></v-text-field>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn depressed color="primary" large width="100" @click="resetPassword">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-col>
  </v-row>
</template>

<script>
import {resetUserPassword} from '../../../service/auth.service'
export default {
    name: 'action',
    data(){
        return{
            newPassword: '',
            snackbar: false,
            message: ''
        }
    },
    methods: {
        async resetPassword(){
            const code = this.$route.fullPath.split('oobCode=')[1].split('&apiKey')[0]
            const result = await resetUserPassword(code, this.newPassword)
            this.snackbar = true;
            this.message = result;
            setTimeout(() => {
                this.$router.push({
                    path: '/'
                })
                this.newPassword = ''
            }, 2000)
        }
    }
}
</script>

<style>

</style>
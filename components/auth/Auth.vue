<template>
  <v-dialog
    :value="signInFormState"
    persistent
    max-width="800px"
    min-width="400px"
    :style="{ borderRadius: '15px', 'z-index': '999999' }"
  >
    <v-card class="pa-5" rounded="lg">
      <v-row>
        <v-col md="6" class="hidden-sm-and-down">
          <v-img
            cover
            eager
            height="100%"
            lazy-src="/placeholder.jpeg"
            alt="hungry democracy image"
            src="https://images.unsplash.com/photo-1606756790138-261d2b21cd75?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="grey lighten-5"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-col>
        <v-col md="6" sm="12">
          <div class="d-flex align-center justify-space-between">
            <div class="py-3">
              <div class="text-h4 font-weight-bold py-2 px-0">
                {{ this.tabNames[this.tab] }}
              </div>
              <div class="spl-line pl-2" style="width: 75px" />
            </div>
            <v-btn class="mx-2" elevation="1" fab small @click.stop="closeForm">
              <v-icon> mdi-close</v-icon>
            </v-btn>
          </div>
          <!-- <no-ssr> -->
            <v-card-subtitle
              v-if="this.tab !== 2"
              class="font-weight-bold py-0 my-0 px-0"
              @click="toggleScreen"
            >
              {{ this.tab === 0 ? "Don't" : "Already" }} have an account?
              <span class="text-decoration-underline text--accent-1"
                >{{ this.tab === 0 ? "Sign up" : "Sign in" }}.</span
              >
            </v-card-subtitle>
          <!-- </no-ssr> -->
          <v-form
            :style="{ display: this.tab === 1 ? 'block' : 'none' }"
            ref="registerForm"
            v-model="valid"
            lazy-validation
          >
            <v-row class="mt-4">
              <v-col cols="12" sm="6" md="6" class="py-0">
                <v-text-field
                  outlined
                  v-model.trim="firstName"
                  autocomplete="fname"
                  :rules="[rules.required, rules.alphabetsOnly]"
                  label="First Name"
                  maxlength="20"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6" class="py-0">
                <v-text-field
                  outlined
                  v-model.trim="lastName"
                  autocomplete="lname"
                  :rules="[rules.required, rules.alphabetsOnly]"
                  label="Last Name"
                  maxlength="20"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="py-0">
                <v-text-field
                  outlined
                  v-model.trim="email"
                  autocomplete="email"
                  :rules="emailRules"
                  label="E-mail"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="py-0">
                <v-text-field
                  outlined
                  v-model="password"
                  autocomplete="current-password"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[rules.required, rules.min]"
                  :type="show1 ? 'text' : 'password'"
                  name="input-10-1"
                  label="Password"
                  hint="At least 8 characters"
                  counter
                  @click:append="show1 = !show1"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="py-0">
                <v-text-field
                  block
                  outlined
                  v-model="verify"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[rules.required, passwordMatch]"
                  :type="show1 ? 'text' : 'password'"
                  name="input-10-1"
                  label="Confirm Password"
                  autocomplete="current-password"
                  counter
                  @click:append="show1 = !show1"
                ></v-text-field>
              </v-col>
              <v-col sm="12" class="ml-auto">
                <p v-if="regErrorMsg" style="color: red" class="py-2">
                  {{ this.regErrorMsg }}
                </p>
                <v-btn
                  large
                  elevation="0"
                  min-width="120px"
                  block
                  :disabled="!valid"
                  color="primary"
                  class="mb-4"
                  @click="validateRegistration"
                  >Register
                </v-btn>
                <v-btn
                  large
                  elevation="2"
                  min-width="120px"
                  block
                  color="white"
                  @click="validateGoogleLogin"
                  ><img src="../../static/google-logo.png" style="height: 20px; width: 20px; margin-right: 5px;">Signup With Google
                </v-btn>
                <v-btn
                  large
                  elevation="0"
                  min-width="120px"
                  block
                  color="#1E88E5"
                  dark
                  class="mt-4"
                  ><v-icon left>mdi-facebook</v-icon> Signup With FaceBook
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
          <v-form
            :style="{ display: this.tab === 0 ? 'block' : 'none' }"
            ref="loginForm"
            v-model="valid"
            lazy-validation
          >
            <v-row class="mt-6">
              <v-col cols="12">
                <v-text-field
                  outlined
                  v-model.trim="loginEmail"
                  :rules="loginEmailRules"
                  label="E-mail"
                  required
                  autocomplete="email"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  outlined
                  v-model.trim="loginPassword"
                  autocomplete="current-password"
                  :append-icon="show1 ? 'eye' : 'eye-off'"
                  :rules="[rules.required, rules.min]"
                  :type="show1 ? 'text' : 'password'"
                  name="input-10-1"
                  label="Password"
                  hint="At least 8 characters"
                  counter
                  @click:append="show1 = !show1"
                ></v-text-field>
              </v-col>
              <v-col class="ml-auto" cols="12" sm="12">
                <p v-if="loginErrorMsg" style="color: red" class="py-2">
                  {{ this.loginErrorMsg }}
                </p>
                <v-btn
                  plain
                  text
                  class="pb-6 text-decoration-underline lighten-3 text-left"
                  @click="tab = 2"
                >
                  Forgot Password?
                </v-btn>
                <v-btn
                  large
                  elevation="0"
                  min-width="120px"
                  block
                  :disabled="!valid"
                  color="primary"
                  class="mb-4"
                  @click="validateLogin"
                  >Sign In
                </v-btn>
                <v-btn
                  large
                  elevation="2"
                  min-width="120px"
                  block
                  color="white darken-4"
                  @click="validateGoogleLogin"
                  ><img src="../../static/google-logo.png" style="height: 20px; width: 20px; margin-right: 5px;"> Login With Google
                </v-btn>
                <v-btn
                  large
                  elevation="0"
                  min-width="120px"
                  block
                  color="#1E88E5"
                  dark
                  class="mt-4"
                  @click="validateFacebookLogin"
                  ><v-icon left>mdi-facebook</v-icon> Login With FaceBook
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
          <v-form
            :style="{ display: this.tab === 2 ? 'block' : 'none' }"
            ref="forgotForm"
            v-model="valid"
            lazy-validation
          >
            <v-row class="mt-6">
              <v-col cols="12">
                <v-text-field
                  outlined
                  v-model.trim="loginEmail"
                  :rules="loginEmailRules"
                  label="E-mail"
                  required
                  autocomplete="email"
                ></v-text-field>
              </v-col>
              <v-col class="ml-auto" cols="12" sm="12">
                <p
                  v-if="loginErrorMsg"
                  style="color: red"
                  class="py-2 text-center"
                >
                  {{ this.loginErrorMsg }}
                </p>
                <p v-if="successMsg" class="py-2 text--primary text-center">
                  {{ this.successMsg }}
                </p>
                <v-btn
                  plain
                  text
                  class="pb-6 text-decoration-underline lighten-3 text-left"
                  @click="tab = 0"
                >
                  Sign in instead?
                </v-btn>
                <v-btn
                  large
                  elevation="0"
                  min-width="120px"
                  block
                  :disabled="!valid"
                  color="primary"
                  @click="validateForgotPassword"
                  >Get Password Reset Link
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    signInFormState: Boolean,
  },
  computed: {
    getUser() {
      return this.$store.getters['userStore/getUser'];
    },
    getId() {
    return this.$store.getters['useStore/getUid'];
    },
    getSignInFormState() {
      return this.$store.getters['userStore/getSignInFormState'];
    },
    passwordMatch() {
      return () => this.password === this.verify || "Password must match";
    },
    show: {
      get() {
        return this.getSignInFormState;
      },
      set() {
        this.closeForm();
      },
    },
  },
  methods: {
    closeForm() {
      this.$store.dispatch('userStore/closeForm', null, { root: true });
    },
    async validateRegistration() {
      if (this.$refs.registerForm.validate()) {
        // reset error message
        this.regErrorMsg = "";
        const result = await this.$store.dispatch('userStore/register', [ this.email, this.password, this.firstName, this.lastName ], { root: true });
        if (!result.errorMsg) {
          //const user = result.user;

          // close the dialog
          this.closeForm();
        } else {
          this.regErrorMsg = result.errorMsg;
        }
      }
    },
    async validateLogin() {
      if (this.$refs.loginForm.validate()) {
        // reset error message
        this.loginErrorMsg = "";
        const result = await this.$store.dispatch('userStore/login', [this.loginEmail, this.loginPassword], { root: true });
        if (!result.errorMsg) {
          //const user = result.user;
          // close the dialog
          this.closeForm();
        } else {
          this.loginErrorMsg = result.errorMsg;
        }
      }
    },
    async validateGoogleLogin(){
      await this.$store.dispatch('userStore/loginWithGoogle')
      this.closeForm();
    },
    async validateFacebookLogin(){
      await this.$store.dispatch('userStore/loginWithFacebook')
    },
    async validateForgotPassword() {
      if (this.$refs.forgotForm.validate()) {
        this.loginErrorMsg = "";
        const result = await this.$store.dispatch('userStore/forgotPassword', [this.loginEmail], { root: true });
        if (!result.errorMsg) {
          this.successMsg =
            "An email with reset link sent to specified email if exists";
          setTimeout(function () {
            this.tab = 0;
          }, 2000);
        } else {
          this.loginErrorMsg =
            "Couldn't find user with specified email id. Create account instead?";
        }
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    toggleScreen() {
      return (this.tab = this.tab === 0 ? 1 : 0);
    },
  },
  data: () => ({
    tabNames: ["Sign in", "Signup", "Forgot Password"],
    loginErrorMsg: "",
    successMsg: "",
    regErrorMsg: "",
    dialog: true,
    tab: 0,
    valid: true,
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    verify: "",
    loginPassword: "",
    loginEmail: "",
    loginEmailRules: [
      (v) => !!v || "Required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    emailRules: [
      (v) => !!v || "Required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    show1: false,
    rules: {
      required: (value) => !!value || "Required.",
      min: (v) => (v && v.length >= 8) || "Min 8 characters",
      alphabetsOnly: (v) =>
        /^[A-Z]+$/i.test(v.trim()) || "Please enter a valid name",
    },
  }),
};
</script>

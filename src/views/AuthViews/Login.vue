<template>
    <div class="vh-100 d-flex justify-content-center align-items-center">
        <div class="row p-3 px-1 mx-auto bg-white rounded rounded-3 w-auth-form">
            <div class="d-none d-md-block col-6">
                <div class="card border-0 d-flex justify-content-center h-100  bg-primary-subtle">
                    <img :src="image" alt="" class="image ms-5" />
                </div>
            </div>
            <div class="col-12 col-md-6 d-flex justify-content-center align-items-center">
                <div class="card border-0">
                    <div class="card-body d-flex flex-column gap-4">
                        <div class="d-flex flex-column gap-4">
                            <h1 class="fs-3 fw-bold mb-0">ចូលប្រើប្រាស់</h1>
                        </div>
                        <form action="" class="row g-4" @submit.prevent="onClickLogin">
                            <div class="col-12">
                                <div class="input-field">
                                    <input type="text" autocomplete="off" class="form-control" :class="{
                                        'is-invalid':
                                            authStore.vueValidation.email.$error || isCheckPss || isCheckRole || isCheckVendor || isCheckActive
                                    }" id="email" v-model="authStore.data.email" placeholder="" />
                                    <label for="email" class="form-label">អុីមែល</label>
                                </div>
                                <label class="text-danger small" v-if="authStore.vueValidation.email.$error">
                                    {{ authStore.vueValidation.email.$errors[0].$message }}
                                </label>
                            </div>
                            <div class="col-12">
                                <div class="input-field mb-2">
                                    <input :type="passwordFieldType" autocomplete="off" class="form-control" :class="{
                                        'is-invalid': authStore.vueValidation.password.$error || isCheckPss || isCheckRole || isCheckVendor || isCheckActive
                                    }" id="password" v-model="authStore.data.password" placeholder="" />
                                    <label for="password" class="form-label">លេខសម្ងាត់</label>
                                    <span class="eye-class"
                                        :class="{ 'd-none': authStore.vueValidation.password.$error || isCheckPss || isCheckRole || isCheckVendor || isCheckActive }"><i
                                            @click="onClickEye" :class="authStore.checkTypePassword.showPassword
                                                ? 'bi bi-eye-slash'
                                                : 'bi bi-eye'
                                                "></i></span>
                                </div>

                                <label class="text-danger small" v-if="authStore.vueValidation.password.$error">
                                    {{ authStore.vueValidation.password.$errors[0].$message }}
                                </label>
                                <label class="text-danger small" v-if="isCheckPss">
                                    អុីមែល ឬ លេខសម្ងាត់មិនត្រឹមត្រូវ សូមព្យាយាមម្តងទៀត
                                </label>
                                <label class="text-danger small" v-if="isCheckRole">
                                    សូមអភ័យទោសអ្នកមិនមានសិទ្ធក្នុងការចូលប្រើប្រាស់
                                </label>
                                <label class="text-danger small" v-if="isCheckVendor">
                                    សូមអភ័យទោសអ្នកមិនទាន់មានគណនីជាអ្នកគ្រប់គ្រងហាងទេ
                                </label>
                                <label class="text-danger small" v-if="isCheckActive">
                                    គណនីរបស់អ្នកត្រូវបានបិទ។ សូមទាក់ទងក្រុមគាំទ្ររបស់យើងដើម្បីជំនួយបន្ថែម។
                                </label>
                                <label class="text-danger small" v-if="apiError">
                                    {{ apiError }}
                                </label>
                            </div>
                            
                            <div class="d-flex justify-content-end">
                                <router-link to="/forget-password"
                                class="custom-link">ភ្លេចពាក្យសម្ងាត់មែនទេ?</router-link>
                            </div>

                            <div class="col-12">
                                <button type="submit" class="btn btn-primary w-100 rounded-4" :disabled="isLoading">
                                    <span v-if="!isLoading">ចូលប្រើប្រាស់</span>
                                    <span v-if="isLoading">កំពុងចូល...</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import image from "@/assets/img/doctor.webp";
import { useRouter } from "vue-router";
import { required, helpers, minLength } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { computed, ref } from "vue";
import { useAuthStore } from "@/stores/views/auth/auth";
import axios from "axios";

const router = useRouter();
const authStore = useAuthStore();
const isLoading = ref(false);
const passwordFieldType = ref("password");
let isCheckPss = ref("");
let isCheckRole = ref("");
let isCheckVendor = ref("");
let isCheckActive = ref("");
let apiError = ref("");

let ruleValidation = computed(() => ({
    email: {
        required: helpers.withMessage("សូមបញ្ចូលអុីមែល", required),
        email: helpers.withMessage("សូមបញ្ចូលអុីមែលត្រឹមត្រូវ", helpers.regex(/^\S+@\S+\.\S+$/))
    },
    password: {
        required: helpers.withMessage("សូមបញ្ចូលលេខសម្ងាត់", required),
        minLength: helpers.withMessage(
            "លេខសម្ងាត់ត្រូវតែមានយ៉ាងហោចណាស់ ៨ តួអក្សរ",
            minLength(8)
        )
    },
}));

authStore.vueValidation = useVuelidate(ruleValidation, authStore.data);

const onClickEye = () => {
    authStore.checkTypePassword.showPassword = !authStore.checkTypePassword.showPassword;
    passwordFieldType.value = authStore.checkTypePassword.showPassword ? "text" : "password";
};

const onClickLogin = async () => {
    // First, disable any browser extensions that might interfere
    if (window.chrome && chrome.runtime) {
        try {
            chrome.runtime.sendMessage({type: "disableDuringAuth"});
        } catch (e) {
            console.warn("Could not communicate with extensions", e);
        }
    }

    authStore.vueValidation.$validate();
    if (authStore.vueValidation.$error) {
        return;
    }

    isLoading.value = true;
    resetErrorStates();

    try {
        const response = await axios.post('/api/login', {
            email: authStore.data.email,
            password: authStore.data.password,
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            withCredentials: true // Important for session/cookie auth
        });

        if (!response.data?.result) {
            handleErrorResponse(response.data);
            return;
        }

        // Validate response structure
        if (!response.data.data || !response.data.data.user || !response.data.data.token) {
            throw new Error("Invalid API response structure");
        }

        const userData = prepareUserData(response.data.data.user);
        await authStore.login(userData, response.data.data.token);
        
        // Clear form fields
        authStore.data.email = "";
        authStore.data.password = "";
        
        // Redirect based on role
        redirectBasedOnRole(response.data.data.user.role.id);

    } catch (error) {
        console.error("Login error:", error);
        handleLoginError(error);
        
        // Specific handling for 403 errors
        if (error.response?.status === 403) {
            if (error.response.data?.message?.includes("CSRF token mismatch")) {
                // Handle CSRF token issues
                window.location.reload(); // Force refresh to get new CSRF token
            } else {
                apiError.value = "សិទ្ធិបដិសេធ៖ អ្នកមិនមានសិទ្ធិចូលប្រើប្រាស់ប្រព័ន្ធនេះទេ";
            }
        }
    } finally {
        isLoading.value = false;
    }
};

function resetErrorStates() {
    isCheckPss.value = false;
    isCheckRole.value = false;
    isCheckVendor.value = false;
    isCheckActive.value = false;
    apiError.value = "";
}

function redirectBasedOnRole(roleId) {
    switch(roleId) {
        case 1: // Admin
            router.push('/');
            break;
        case 2: // Doctor
            router.push('/doctor-dashboard');
            break;
        case 3: // Staff
            router.push('/staff-dashboard');
            break;
        case 4: // Patient
            router.push('/patient-dashboard');
            break;
        default:
            router.push('/');
    }
}

function handleErrorResponse(data) {
    if (data.message?.includes("Vendor information is missing")) {
        isCheckVendor.value = true;
    } else if (data.message?.includes("Your account is inactive")) {
        isCheckActive.value = true;
    } else if (data.data?.role?.id === 4 || data.data?.role?.id === 3) {
        isCheckRole.value = true;
    } else {
        isCheckPss.value = true;
    }
}

function prepareUserData(user) {
    const defaultProfile = {
        first_name: '',
        last_name: '',
        phone: '',
        gender_id: null,
        photo: null
    };

    return {
        profile: {
            id: user.id || null,
            ...defaultProfile,
            ...(user.profile || {}),
        },
        email: user.email || '',
        teletegram_id: user.teletegram_id || null,
        role: {
            id: user.role?.id || null,
            name: user.role?.name || '',
        }
    };
}

function handleLoginError(error) {
    if (error.response) {
        // Handle HTTP errors
        if (error.response.status === 422) {
            apiError.value = "ទម្រង់អុីមែល ឬ លេខសម្ងាត់មិនត្រឹមត្រូវ";
        } else if (error.response.status === 403) {
            apiError.value = "សិទ្ធិបដិសេធ៖ អ្នកមិនមានសិទ្ធិចូលប្រើប្រាស់ប្រព័ន្ធនេះទេ";
        } else if (error.response.data?.message) {
            apiError.value = error.response.data.message;
        } else {
            apiError.value = "កំហុសម៉ាស៊ីនបម្រើ៖ សូមព្យាយាមម្តងទៀត";
        }
    } else if (error.message) {
        // Handle other errors
        apiError.value = error.message;
    } else {
        apiError.value = "កំហុសមិនស្គាល់៖ សូមព្យាយាមម្តងទៀត";
    }
}
</script>
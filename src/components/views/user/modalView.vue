<template>
  <div class="modal fade" id="mdl-view" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border-0 p-3 rounded-4">
        <div class="modal-header border-0 d-flex align-items-center justify-content-between">
          <div class="text-dark-emphasis h5 fw-semibold">ព័ត៌មានលម្អិតអ្នកប្រើប្រាស់</div>
          <a role="button" class="btn-exit bg-light" data-bs-dismiss="modal" aria-label="Close">
            <i class="bi bi-x fs-4 text-primary"></i>
          </a>
        </div>
        <div class="modal-body">
          <div>
            <div>
              <div class="d-flex align-items-center gap-3 mb-4 ">
                <div class="user-photo rounded-circle bg-light overflow-auto">
                  <img :src="userStore.crop.avatar" class="card-img object-fit-cover" alt="">
                </div>
                <div class="lh-1">
                  <h6 class="text-dark fw-semibold">{{ userStore.frm.first_name + ' ' + userStore.frm.last_name }}</h6>
                  <span class="text-dark-emphasis fs-14">
                    {{
                      userStore.frm.role_id == 4 ? 'អតិថិជន' : userStore.frm.role_id == 3 ? 'អ្នកដឹកជញ្ជូន' : userStore.frm.role_id == 2 ? 'អ្នកគ្រប់គ្រងហាង':'អ្នកគ្រប់គ្រងជាន់ខ្ពស់'
                    }}
                  </span>
                </div>
              </div>
              <div>
                
                <h6 class="border-dash mb-3">ទិន្នន័យផ្ទាល់ខ្លួនអ្នកប្រប្រាស់</h6>
                <div class="d-flex align-items-center gap-2 mb-3">
                  <div class="bg-icon"><i class="bi bi-gender-trans text-primary"></i></div>
                  {{ userStore.frm.gender === 1 ? 'ប្រុស':'ស្រី' }}
                </div>
                <div class="d-flex align-items-center gap-2 mb-3">
                  <div class="bg-icon"><i class="bi bi-telephone text-primary"></i></div>
                  {{ userStore.frm.phone }}
                </div>
                <div class="d-flex align-items-center gap-2 mb-3">
                  <div class="bg-icon"><i class="bi bi-envelope text-primary"></i></div>
                  {{ userStore.frm.email }}
                </div>
              
                <h6 class="border-dash mb-3">កាលបរិច្ឆេត</h6>
                <div class="d-flex flex-column">
                  <div class="d-flex align-items-center gap-2 mb-3">
                    <div class="bg-icon"><i class="bi bi-person-add text-primary"></i></div>
                    <span>Created At &nbsp;:  {{ userStore.frm.created_at }}</span>
                  </div>
                  <div class="d-flex align-items-center gap-2 mb-3">
                    <div class="bg-icon"><i class="bi bi-pencil-square text-primary"></i></div>
                    <span>Updated At : {{ userStore.frm.updated_at }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { Modal } from 'bootstrap';
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/views/user_store';
import { useAuthStore } from "@/stores/views/auth/auth";
import { helpers, required, maxLength, minLength, email } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import axios from 'axios';

const userStore = useUserStore();
const authStore = useAuthStore();
const isLoading = ref(false);
const isEmailTaken = ref(false);
const isPhoneTaken = ref(false);
const backendErrors = ref({});
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Validation rules
const rules = computed(() => ({
  first_name: {
    required: helpers.withMessage("សូមបញ្ចូលនាមត្រកូល", required),
    maxLength: helpers.withMessage("សូមបញ្ចូលនាមត្រកូលមិនអាចលើសពី 50 តួអក្សរ", maxLength(50))
  },
  last_name: {
    required: helpers.withMessage("សូមបញ្ចូលនាមខ្លួន", required),
    maxLength: helpers.withMessage("សូមបញ្ចូលនាមខ្លួនមិនអាចលើសពី 50 តួអក្សរ", maxLength(50))
  },
  gender: {
    required: helpers.withMessage("សូមជ្រើសរើសភេទ", required)
  },
  role_id: {
    required: helpers.withMessage("សូមជ្រើសរើសតួនាទី", required)
  },
  phone: {
    required: helpers.withMessage("សូមបញ្ចូលលេខទូរស័ព្ទ", required),
    minLength: helpers.withMessage("សូមបញ្ចូលលេខទូរស័ព្ទនៅចន្លោះ 9 ទៅ 10 តួអក្សរ", minLength(9)),
    maxLength: helpers.withMessage("សូមបញ្ចូលលេខទូរស័ព្ទនៅចន្លោះ 9 ទៅ 10 តួអក្សរ", maxLength(10)),
    startsWithZero: helpers.withMessage(
      "លេខទូរស័ព្ទត្រូវចាប់ផ្តើមដោយលេខ 0",
      (value) => /^0\d{8,9}$/.test(value)
    ),
    takenPhone: helpers.withMessage('លេខទូរស័ព្ទនេះត្រូវបានប្រើរួចហើយ', () => !isPhoneTaken.value)
  },
  email: {
    required: helpers.withMessage("សូមបញ្ចូលអ៊ីម៉ែល", required),
    email: helpers.withMessage("អ៊ីម៉ែលមិនត្រឹមត្រូវទេ", email),
    maxLength: helpers.withMessage("សូមបញ្ចូលអ៊ីម៉ែលមិនអាចលើសពី 50 តួអក្សរ", maxLength(50)),
    taken: helpers.withMessage('អ៊ីម៉ែលនេះត្រូវបានប្រើរួចហើយ', () => !isEmailTaken.value)
  },
  address: {
    required: helpers.withMessage("សូមបញ្ចូលអាស័យដ្ឋាន", required),
    maxLength: helpers.withMessage("សូមបញ្ចូលអាស័យដ្ឋានមិនអាចលើសពី 255 តួអក្សរ", maxLength(255))
  },
  pass: userStore.selectedId == 0 ? {
    required: helpers.withMessage("សូមបញ្ចូលពាក្យសម្ងាត់", required),
    minLength: helpers.withMessage("សូមបញ្ចូលពាក្យសម្ងាត់យ៉ាងតិច 6 តួអក្សរ", minLength(6))
  } : {},
  con_pass: userStore.selectedId == 0 ? {
    required: helpers.withMessage("សូមបញ្ចូលបញ្ចាក់ពាក្យសម្ងាត់", required),
    minLength: helpers.withMessage("សូមបញ្ចូលបញ្ចាក់ពាក្យសម្ងាត់យ៉ាងតិច 6 តួអក្សរ", minLength(6)),
    sameAsPassword: helpers.withMessage("ពាក្យសម្ងាត់មិនដូចគ្នាទេ", 
      (value) => value === userStore.frm.pass)
  } : {}
}));

userStore.v_validate = useVuelidate(rules, userStore.frm);

const togglePasswordVisibility = (field) => {
  if (field === 'password') showPassword.value = !showPassword.value;
  if (field === 'confirm') showConfirmPassword.value = !showConfirmPassword.value;
};

const chooseFileImage = () => {
  document.getElementById('file_img').value = '';
  document.getElementById('file_img').click();
};

const onSelectedImage = (e) => {
  if (e.currentTarget.files.length === 0) return;
  
  const file = e.currentTarget.files[0];
  const maxSize = 1 * 1024 * 1024;
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

  if (!allowedTypes.includes(file.type)) {
    userStore.error_Message = 'អ្នកអាចប្រើរូបភាពប្រភេទ JPEG, PNG និង GIF';
    userStore.mdl_errorTypeImage.show();
    userStore.mdl_add.hide();
    return;
  }

  if (file.size > maxSize) {
    userStore.error_Message = 'ទំហំរូបភាពមិនត្រូវលើស 1MB';
    userStore.mdl_errorTypeImage.show();
    userStore.mdl_add.hide();
    return;
  }

  userStore.frm.is_remove = 0;
  userStore.crop.img = URL.createObjectURL(file);
  userStore.crop.blob = file; // Store the actual file object
  userStore.mdl_add.hide();
  userStore.mdl_crop.show();
};

const removeImage = () => {
  userStore.crop.avatar = '/default.png';
  userStore.crop.blob = null;
  userStore.frm.is_remove = 1;
};

const resetFormErrors = () => {
  backendErrors.value = {};
  isEmailTaken.value = false;
  isPhoneTaken.value = false;
  if (userStore.v_validate) {
    userStore.v_validate.$reset();
  }
};

const onclickSaveUser = async () => {
  resetFormErrors();
  
  // Validate form
  const isValid = await userStore.v_validate.$validate();
  if (!isValid) return;

  isLoading.value = true;
  
  try {
    const formData = new FormData();
    
    // Required fields
    formData.append('email', userStore.frm.email);
    formData.append('role_id', userStore.frm.role_id);
    formData.append('first_name', userStore.frm.first_name);
    formData.append('last_name', userStore.frm.last_name || '');
    formData.append('phone', userStore.frm.phone);
    formData.append('gender', userStore.frm.gender === 1 ? 'male' : 'female');
    formData.append('address', userStore.frm.address || '');

    // Handle password for new users
    if (userStore.selectedId == 0) {
      formData.append('password', userStore.frm.pass);
      formData.append('password_confirmation', userStore.frm.con_pass);
    }

    // Handle photo upload
    if (userStore.crop.blob) {
      formData.append('photo', userStore.crop.blob);
    } else if (userStore.frm.is_remove) {
      formData.append('remove_photo', '1');
    }

    // Determine endpoint and method
    const url = userStore.selectedId == 0 
      ? '/api/users' 
      : `/api/users/${userStore.selectedId}`;
    
    const method = userStore.selectedId == 0 ? 'post' : 'put';

    // Make API request
    const response = await axios({
      method: userStore.selectedId == 0 ? 'post' : 'post', // Always use POST for file uploads
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      params: userStore.selectedId != 0 ? { _method: 'PUT' } : {}
    });

    if (response.data.result) {
      userStore.mdl_add.hide();
      userStore.onloadUser();
      userStore.resetForm();
    }
  } catch (error) {
    console.error('API Error:', error.response?.data);
    
    if (error.response?.status === 422) {
      const errors = error.response.data.errors || {};
      
      // Handle specific field errors
      if (errors.email) {
        isEmailTaken.value = errors.email.some(msg => msg.includes('taken'));
        backendErrors.value.email = errors.email[0];
      }
      
      if (errors.phone) {
        isPhoneTaken.value = errors.phone.some(msg => msg.includes('taken'));
        backendErrors.value.phone = errors.phone[0];
      }
      
      // Handle other validation errors
      for (const [field, messages] of Object.entries(errors)) {
        if (!['email', 'phone'].includes(field)) {
          backendErrors.value[field] = messages[0];
        }
      }
    } else if (error.response?.status === 500) {
      backendErrors.value.general = 'Database error occurred. Please check your data.';
    } else {
      backendErrors.value.general = error.response?.data?.message || 
        'An error occurred. Please try again.';
    }
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  userStore.mdl_add = Modal.getOrCreateInstance(document.getElementById('mdl-add'));
});
</script>
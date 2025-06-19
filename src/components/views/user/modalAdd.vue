<template>
  <div class="modal fade" id="mdl-add" data-bs-backdrop="static" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content p-3 rounded-4">
        <form action="" @submit.prevent>
          <div class="modal-header border-0">
            <h5 class="modal-title">
              {{
                userStore.selectedId == 0
                  ? "បន្ថែមអ្នកប្រើប្រាស់"
                  : "កែប្រែអ្នកប្រើប្រាស់"
              }}
            </h5>
          </div>
          <div class="modal-body">
            <div class="d-flex align-items-center gap-3 mb-4">
              <div class="form-photo bg-light rounded-circle overflow-auto">
                <img
                  :src="
                    userStore.crop.avatar &&
                    userStore.crop.avatar.startsWith('blob:')
                      ? userStore.crop.avatar
                      : userStore.crop.avatar
                      ? `http://clinic-management-system.test/${userStore.crop.avatar}?${userStore.crop.avatar}`
                      : '/default.png'
                  "
                  class="card-img object-fit-cover"
                  alt=""
                />
              </div>
              <div>
                <div class="d-flex flex-column mb-3">
                  <span class="fw-medium mb-1"
                    >បញ្ចូលរូបភាព​អ្នកប្រើប្រាស់</span
                  >
                  <span class="fs-13">ទំហំនៃរូបភាព​ 1 MB</span>
                </div>
                <div class="d-flex align-items-center gap-4">
                  <a
                    role="button"
                    class="text-decoration-none text-primary fs-14"
                    @click="chooseFileImage()"
                  >
                    <i class="bi bi-upload"></i> ជ្រើសរើស
                  </a>
                  <a
                    role="button"
                    class="text-decoration-none text-danger fs-14"
                    @click="removeImage()"
                  >
                    <i class="bi bi-trash"></i> លុប
                  </a>
                </div>
                <input
                  type="file"
                  @change="onSelectedImage($event)"
                  class="form-control d-none"
                  id="file_img"
                  accept="image/jpeg, image/png, image/gif"
                />
              </div>
            </div>

            <div>
              <div class="d-flex flex-wrap flex-md-nowrap gap-3">
                <div class="mb-0 mb-md-3 w-100">
                  <div class="input-field">
                    <input
                      type="text"
                      class="form-control rounded-5"
                      id="Fname"
                      v-model="userStore.frm.first_name"
                      placeholder=""
                      autocomplete="off"
                      :class="{
                        'is-invalid':
                          userStore.v_validate.first_name.$error ||
                          backendErrors.first_name,
                      }"
                    />
                    <label for="fname" class="form-label">នាមត្រកូល</label>
                  </div>
                  <div
                    class="invalid-feedback d-block ps-2"
                    v-if="
                      userStore.v_validate.first_name.$error ||
                      backendErrors.first_name
                    "
                  >
                    {{
                      backendErrors.first_name ||
                      userStore.v_validate.first_name.$errors[0]?.$message
                    }}
                  </div>
                </div>
                <div class="mb-3 w-100">
                  <div class="input-field">
                    <input
                      type="text"
                      class="form-control rounded-5"
                      id="lname"
                      v-model="userStore.frm.last_name"
                      placeholder=""
                      autocomplete="off"
                      :class="{
                        'is-invalid': userStore.v_validate.last_name.$error,
                      }"
                    />
                    <label for="lname" class="form-label">នាមខ្លូន</label>
                  </div>
                  <div
                    class="invalid-feedback d-block ps-2"
                    v-if="userStore.v_validate.last_name.$error"
                  >
                    {{ userStore.v_validate.last_name.$errors[0].$message }}
                  </div>
                </div>
              </div>

              <div class="d-flex flex-wrap flex-md-nowrap gap-3">
                <div class="mb-0 mb-md-3 w-100">
                  <div class="input-field">
                    <input
                      type="text"
                      @input="resetTaken()"
                      class="form-control rounded-5"
                      id="email"
                      v-model="userStore.frm.email"
                      placeholder=""
                      autocomplete="off"
                      :class="{
                        'is-invalid': userStore.v_validate.email.$error,
                      }"
                    />
                    <label for="email" class="form-label">អ៊ីម៉ែល</label>
                  </div>
                  <div
                    class="invalid-feedback d-block ps-2"
                    v-if="userStore.v_validate.email.$error"
                  >
                    {{ userStore.v_validate.email.$errors[0].$message }}
                  </div>
                </div>
                <div class="mb-3 w-100">
                  <div class="input-field">
                    <input
                      type="text"
                      class="form-control rounded-5"
                      id="phone"
                      v-model="userStore.frm.phone"
                      placeholder=""
                      @input="resetTaken()"
                      autocomplete="off"
                      :class="{
                        'is-invalid': userStore.v_validate.phone.$error,
                      }"
                    />
                    <label for="phone" class="form-label">លេខទូរស័ព្ទ</label>
                  </div>
                  <div
                    class="invalid-feedback d-block ps-2"
                    v-if="userStore.v_validate.phone.$error"
                  >
                    {{ userStore.v_validate.phone.$errors[0].$message }}
                  </div>
                </div>
              </div>

              <div class="mb-3 w-100">
                <div class="input-field">
                  <input
                    type="text"
                    class="form-control rounded-5"
                    id="telegram_id"
                    v-model="userStore.frm.telegram_id"
                    placeholder=""
                    autocomplete="off"
                  />
                  <label for="telegram_id" class="form-label"
                    >Telegram ID</label
                  >
                </div>
              </div>

              <div class="mb-3 w-100">
                <label for="role" class="form-label">តួនាទី</label>
                <select
                  class="form-select rounded-5"
                  id="role"
                  v-model="userStore.frm.role_id"
                  :class="{ 'is-invalid': userStore.v_validate.role_id.$error }"
                >
                  <option value="">ជ្រើសរើសតួនាទី</option>
                  <option value="1">អ្នកគ្រប់គ្រង​ជាន់ខ្ពស់</option>
                  <option value="2">អ្វេជ្ជបណ្ឌិត</option>
                  <option value="3">អ្បុគ្គលិក</option>
                  <option value="4">អ្នកជំងឺ</option>
                </select>
                <div
                  class="invalid-feedback d-block ps-2"
                  v-if="userStore.v_validate.role_id.$error"
                >
                  {{ userStore.v_validate.role_id.$errors[0].$message }}
                </div>
              </div>

              <div
                class="flex-wrap flex-md-nowrap gap-3"
                :class="{
                  'd-flex': userStore.selectedId == 0,
                  'd-none': userStore.selectedId != 0,
                }"
              >
                <div class="mb-0 mb-md-3 w-100 position-relative">
                  <div class="input-field">
                    <input
                      :type="showPassword ? 'text' : 'password'"
                      class="form-control rounded-5 pe-5"
                      id="password"
                      v-model="userStore.frm.pass"
                      placeholder=""
                      autocomplete="off"
                      :class="{
                        'is-invalid': userStore.v_validate.pass.$error,
                      }"
                    />
                    <label for="password" class="form-label"
                      >ពាក្យសម្ងាត់</label
                    >
                    <i
                      v-if="!userStore.v_validate.pass.$error"
                      class="eye-pass bi"
                      :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"
                      @click="togglePasswordVisibility('password')"
                    >
                    </i>
                  </div>
                  <div
                    class="invalid-feedback d-block ps-2"
                    v-if="userStore.v_validate.pass.$error"
                  >
                    {{ userStore.v_validate.pass.$errors[0].$message }}
                  </div>
                </div>
                <div class="mb-3 w-100 position-relative">
                  <div class="input-field">
                    <input
                      :type="showConfirmPassword ? 'text' : 'password'"
                      class="form-control rounded-5 pe-5"
                      id="confirm_password"
                      v-model="userStore.frm.con_pass"
                      placeholder=""
                      autocomplete="off"
                      :class="{
                        'is-invalid': userStore.v_validate.con_pass.$error,
                      }"
                    />
                    <label for="confirm_password" class="form-label"
                      >បញ្ចាក់ពាក្យសម្ងាត់</label
                    >
                    <i
                      v-if="!userStore.v_validate.con_pass.$error"
                      class="eye-pass bi"
                      :class="showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'"
                      @click="togglePasswordVisibility('confirm')"
                    >
                    </i>
                  </div>
                  <div
                    class="invalid-feedback d-block ps-2"
                    v-if="userStore.v_validate.con_pass.$error"
                  >
                    {{ userStore.v_validate.con_pass.$errors[0].$message }}
                  </div>
                </div>
              </div>

              <div class="mb-3 w-100">
                <div class="input-field">
                  <input
                    type="text"
                    class="form-control rounded-5"
                    id="address"
                    v-model="userStore.frm.address"
                    placeholder=""
                    autocomplete="off"
                    :class="{
                      'is-invalid': userStore.v_validate.address.$error,
                    }"
                  />
                  <label for="address" class="form-label">អាស័យដ្ឋាន</label>
                </div>
                <div
                  class="invalid-feedback d-block ps-2"
                  v-if="userStore.v_validate.address.$error"
                >
                  {{ userStore.v_validate.address.$errors[0].$message }}
                </div>
              </div>

              <div class="d-flex align-items-center gap-3">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    checked
                    type="radio"
                    id="male"
                    value="0"
                    v-model="userStore.frm.gender_id"
                  />
                  <label class="form-check-label" for="male"> ប្រុស </label>
                </div>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    id="fmale"
                    value="1"
                    v-model="userStore.frm.gender_id"
                  />
                  <label class="form-check-label" for="fmale"> ស្រី </label>
                </div>
              </div>

              <div class="form-check form-switch mt-3">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="is_active"
                  v-model="userStore.frm.is_active"
                  :true-value="1"
                  :false-value="0"
                />
                <label class="form-check-label" for="is_active">សកម្ម</label>
              </div>
            </div>
          </div>
          <div class="modal-footer border-0">
            <button
              type="button"
              class="btn btn-light rounded-5 btn-150 text-cancel"
              data-bs-dismiss="modal"
            >
              បោះបង់
            </button>
            <button
              :disabled="isLoading"
              type="submit"
              @click="onclickSaveUser()"
              class="btn btn-primary rounded-5 btn-150"
            >
              <span v-if="!isLoading" role="status">
                {{ userStore.selectedId == 0 ? "បញ្ជូន" : "កែប្រែ" }}</span
              >
              <span
                v-if="isLoading"
                class="spinner-border spinner-border-sm"
                aria-hidden="true"
              ></span>
              <span v-if="isLoading" role="status">
                {{
                  userStore.selectedId == 0 ? " កំពុងបញ្ជូន" : " កំពុងកែប្រែ"
                }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Modal } from "bootstrap";
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "@/stores/views/user_store";
import { useAuthStore } from "@/stores/views/auth/auth";
import {
  helpers,
  required,
  maxLength,
  minLength,
  email,
} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import axios from "axios";

const userStore = useUserStore();
const authStore = useAuthStore();
const isLoading = ref(false);
const isEmailTaken = ref(false);
const isPhoneTaken = ref(false);
const backendErrors = ref({});
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const rules = computed(() => ({
  first_name: {
    required: helpers.withMessage("សូមបញ្ចូលនាមត្រកូល", required),
    maxLength: helpers.withMessage(
      "សូមបញ្ចូលនាមត្រកូលមិនអាចលើសពី 50 តួអក្សរ",
      maxLength(50)
    ),
  },
  last_name: {
    required: helpers.withMessage("សូមបញ្ចូលនាមខ្លួន", required),
    maxLength: helpers.withMessage(
      "សូមបញ្ចូលនាមខ្លួនមិនអាចលើសពី 50 តួអក្សរ",
      maxLength(50)
    ),
  },
  gender_id: {
    required: helpers.withMessage("សូមជ្រើសរើសភេទ", required),
  },
  role_id: {
    required: helpers.withMessage("សូមជ្រើសរើសតួនាទី", required),
  },
  phone: {
    required: helpers.withMessage("សូមបញ្ចូលលេខទូរស័ព្ទ", required),
    minLength: helpers.withMessage(
      "សូមបញ្ចូលលេខទូរស័ព្ទនៅចន្លោះ 9 ទៅ 10 តួអក្សរ",
      minLength(9)
    ),
    maxLength: helpers.withMessage(
      "សូមបញ្ចូលលេខទូរស័ព្ទនៅចន្លោះ 9 ទៅ 10 តួអក្សរ",
      maxLength(10)
    ),
    startsWithZero: helpers.withMessage(
      "លេខទូរស័ព្ទត្រូវចាប់ផ្តើមដោយលេខ 0",
      (value) => /^0\d{8,9}$/.test(value)
    ),
    takenPhone: helpers.withMessage(
      "លេខទូរស័ព្ទនេះត្រូវបានប្រើរួចហើយ",
      () => !isPhoneTaken.value
    ),
  },
  email: {
    required: helpers.withMessage("សូមបញ្ចូលអ៊ីម៉ែល", required),
    email: helpers.withMessage("អ៊ីម៉ែលមិនត្រឹមត្រូវទេ", email),
    maxLength: helpers.withMessage(
      "សូមបញ្ចូលអ៊ីម៉ែលមិនអាចលើសពី 50 តួអក្សរ",
      maxLength(50)
    ),
    taken: helpers.withMessage(
      "អ៊ីម៉ែលនេះត្រូវបានប្រើរួចហើយ",
      () => !isEmailTaken.value
    ),
  },
  address: {
    required: helpers.withMessage("សូមបញ្ចូលអាស័យដ្ឋាន", required),
    maxLength: helpers.withMessage(
      "សូមបញ្ចូលអាស័យដ្ឋានមិនអាចលើសពី 255 តួអក្សរ",
      maxLength(255)
    ),
  },
  pass:
    userStore.selectedId == 0
      ? {
          required: helpers.withMessage("សូមបញ្ចូលពាក្យសម្ងាត់", required),
          minLength: helpers.withMessage(
            "សូមបញ្ចូលពាក្យសម្ងាត់យ៉ាងតិច 6 តួអក្សរ",
            minLength(6)
          ),
        }
      : {},
  con_pass:
    userStore.selectedId == 0
      ? {
          required: helpers.withMessage(
            "សូមបញ្ចូលបញ្ចាក់ពាក្យសម្ងាត់",
            required
          ),
          minLength: helpers.withMessage(
            "សូមបញ្ចូលបញ្ចាក់ពាក្យសម្ងាត់យ៉ាងតិច 6 តួអក្សរ",
            minLength(6)
          ),
          sameAsPassword: helpers.withMessage(
            "ពាក្យសម្ងាត់មិនដូចគ្នាទេ",
            (value) => value === userStore.frm.pass
          ),
        }
      : {},
}));

userStore.v_validate = useVuelidate(rules, userStore.frm);

const togglePasswordVisibility = (field) => {
  if (field === "password") showPassword.value = !showPassword.value;
  if (field === "confirm")
    showConfirmPassword.value = !showConfirmPassword.value;
};

const chooseFileImage = () => {
  document.getElementById("file_img").value = "";
  document.getElementById("file_img").click();
};

const onSelectedImage = (e) => {
  if (e.currentTarget.files.length === 0) return;

  const file = e.currentTarget.files[0];
  const maxSize = 1 * 1024 * 1024;
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

  if (!allowedTypes.includes(file.type)) {
    userStore.error_Message = "អ្នកអាចប្រើរូបភាពប្រភេទ JPEG, PNG និង GIF";
    userStore.mdl_errorTypeImage.show();
    userStore.mdl_add.hide();
    return;
  }

  if (file.size > maxSize) {
    userStore.error_Message = "ទំហំរូបភាពមិនត្រូវលើស 1MB";
    userStore.mdl_errorTypeImage.show();
    userStore.mdl_add.hide();
    return;
  }

  userStore.frm.is_remove = 0;
  userStore.crop.img = URL.createObjectURL(file);
  userStore.mdl_add.hide();
  userStore.mdl_crop.show();
};

const removeImage = () => {
  userStore.crop.avatar = "/default.png";
  userStore.crop.blob = null;
  userStore.frm.is_remove = 1;
};

const resetTaken = () => {
  isEmailTaken.value = false;
  isPhoneTaken.value = false;
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

  const isValid = await userStore.v_validate.$validate();
  if (!isValid) return;

  isLoading.value = true;

  try {
    const formData = new FormData();

    formData.append("email", userStore.frm.email);
    formData.append("role_id", userStore.frm.role_id);
    formData.append("first_name", userStore.frm.first_name);
    formData.append("last_name", userStore.frm.last_name || "");
    formData.append("phone", userStore.frm.phone);
    formData.append("gender_id", userStore.frm.gender_id);
    formData.append("address", userStore.frm.address || "");
    formData.append("telegram_id", userStore.frm.telegram_id || "");
    formData.append("is_active", userStore.frm.is_active || 1);

    if (userStore.selectedId == 0) {
      formData.append("password", userStore.frm.pass);
      formData.append("password_confirmation", userStore.frm.con_pass);
    }

    if (userStore.crop.blob) {
      formData.append("photo", userStore.crop.blob);
    } else if (userStore.frm.is_remove) {
      formData.append("photo", "");
    }
    const url =
      userStore.selectedId == 0
        ? "/api/users"
        : `/api/users/${userStore.selectedId}`;
    const method = userStore.selectedId == 0 ? "post" : "put";

    const response = await axios({
      method,
      url,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    if (response.data.result) {
      userStore.mdl_add.hide();
      userStore.onloadUser();
      userStore.resetForm();
    }
  } catch (error) {
    handleApiError(error);
  } finally {
    isLoading.value = false;
  }
};

const handleApiError = (error) => {
  console.error("API Error:", error.response?.data);

  if (error.response?.status === 422) {
    const errors = error.response.data.errors || {};

    // Handle specific field errors
    if (errors.email) {
      isEmailTaken.value = errors.email.some((msg) => msg.includes("taken"));
      backendErrors.value.email = errors.email[0];
    }

    if (errors.phone) {
      isPhoneTaken.value = errors.phone.some((msg) => msg.includes("taken"));
      backendErrors.value.phone = errors.phone[0];
    }

    // Handle other validation errors
    for (const [field, messages] of Object.entries(errors)) {
      if (!["email", "phone"].includes(field)) {
        backendErrors.value[field] = messages[0];
      }
    }
  } else if (error.response?.status === 500) {
    backendErrors.value.general =
      "Database error occurred. Please check your data.";
  } else {
    backendErrors.value.general =
      error.response?.data?.message || "An error occurred. Please try again.";
  }
};

onMounted(() => {
  userStore.mdl_add = Modal.getOrCreateInstance(
    document.getElementById("mdl-add")
  );
});
</script>

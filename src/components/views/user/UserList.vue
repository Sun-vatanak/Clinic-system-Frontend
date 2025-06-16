<template>
  <div class="row bg-white section-spacing rounded-4">
    <div class="table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th class="text-dark-emphasis" scope="col">ល.រ</th>
            <th class="text-dark-emphasis" scope="col">ឈ្មោះ</th>
            <th class="text-dark-emphasis" scope="col">លេខទូរស័ព្ទ</th>
            <th class="text-dark-emphasis" scope="col">តួនាទី</th>
            <th class="text-dark-emphasis" scope="col">ស្ថានភាព</th>
            <th class="text-dark-emphasis" scope="col">មុខងារ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="userStore.isLoading">
            <td colspan="6" class="border-none">
              <Loading />
            </td>
          </tr>
          <tr v-if="
            userStore.data_users.length === 0 &&
            !userStore.isLoading
          ">
            <td colspan="6" class="text-center py-3">គ្មាននិន្នន័យ</td>
          </tr>
          <template v-if="!userStore.isLoading">
            <tr v-for="(user, i) in userStore.data_users" :key="user.id" class="align-middle">
              <td>
                {{
                  i +
                  1 +
                  (userStore.currentPage - 1) *
                  userStore.itemsPerPage
                }}
              </td>
              <td>
                <div class="d-flex align-items-center gap-2">
                  <div class="profile_user bg-light overflow-hidden">
                 <img :src="'/user-photos/' + user.profile?.photo" class="card-img" alt="" />
                  </div>
                  <div class="d-flex flex-column justify-content-center">
                    <span>
                      {{ user.profile?.first_name || '' }} {{ user.profile?.last_name || '' }}
                    </span>
                    <span class="fs-12">{{ user.email }}</span>
                  </div>
                </div>
              </td>
              <td>{{ user.profile?.phone || '' }}</td>
              <td>
                {{ user.role?.name || '' }}
              </td>
              <td class="fs-4 text-primary">
                <i class="bi-toggle-on status-user" v-if="user.is_active" @click="onclickStatus(user)"></i>
                <i class="bi-toggle-off status-user" v-else @click="onclickStatus(user)"></i>
              </td>
              <td>
                <div class="d-flex gap-3">
                  <a role="button" class="btn-action btn-views" @click="onclickViewsUser(user)" title="មើលលម្អិត">
                    <i class="bi bi-eye"></i>
                  </a>
                  <a role="button" class="btn-update btn-action" @click="onclickEditUser(user)" title="កែប្រែ">
                    <i class="bi bi-pencil-square"></i>
                  </a>
                  <a role="button" class="btn-delete btn-action" @click="onclickDeleteUser(user)" title="លុប">
                    <i class="bi bi-trash"></i>
                  </a>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div v-if="!userStore.isLoading && userStore.totalPages > 1">
      <Pagination />
    </div>
  </div>
</template>

<script setup>
  import Pagination from "@/components/views/user/Pagination.vue";
  import { useUserStore } from "@/stores/views/user_store";
  import { onMounted } from "vue";
  import axios from "axios";
  import Loading from "../reusable/loading.vue";

  const userStore = useUserStore();

  onMounted(() => {
    userStore.onloadUser();
  });
  // console.log(user.profile?.photo); // Should output just the filename "TnL6CMu2WIisHaukNlCw1zUlvf7HoU46yEr1vxxY.png"

  const onclickEditUser = (user) => {
    userStore.selectedId = user.id;
    userStore.frm.first_name = user.profile?.first_name || '';
    userStore.frm.last_name = user.profile?.last_name || '';
    userStore.frm.email = user.email;
    userStore.frm.phone = user.profile?.phone || '';
    userStore.frm.pass = "";
    userStore.frm.con_pass = "";
    userStore.frm.address = user.profile?.address || '';
    userStore.frm.gender = user.profile?.gender_id || 1;
    userStore.frm.role_id = user.role?.id || '';
    userStore.crop.img = "";
    userStore.crop.avatar = user.profile?.photo || "/default.png";

    if (userStore.v_validate?.$error) {
      userStore.v_validate.$reset();
    }
    userStore.mdl_add?.show();
  };

  const onclickDeleteUser = (user) => {
    userStore.selectedId = user.id;
    userStore.frm.first_name = user.profile?.first_name || '';
    userStore.frm.last_name = user.profile?.last_name || '';
    userStore.mdl_delete?.show();
  };

  const onclickViewsUser = (user) => {
    userStore.frm.id = user.id;
    userStore.frm.email = user.email;
    userStore.frm.phone = user.profile?.phone || '';
    userStore.frm.first_name = user.profile?.first_name || '';
    userStore.frm.last_name = user.profile?.last_name || '';
    userStore.frm.address = user.profile?.address || '';
    userStore.frm.gender = user.profile?.gender_id || '';
    userStore.frm.role_id = user.role?.id || '';
    userStore.frm.created_at = user.created_at;
    userStore.frm.updated_at = user.updated_at;
    userStore.crop.avatar = user.profile?.photo || "/default.png";
    userStore.mdl_view?.show();
  };

  const onclickStatus = async (user) => {
    try {
      if (user.is_active) {
        await axios.put(`/api/users/disable/${user.id}`);
      } else {
        await axios.put(`/api/users/enable/${user.id}`);
      }
      user.is_active = !user.is_active;
    } catch (error) {
      console.error("Error toggling user status:", error);
    }
  };
</script>
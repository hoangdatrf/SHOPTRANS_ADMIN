<template>
  <div class="h-screen">
    <!-- Navbar -->
    <a-spin :spinning="loadingStore.isLoading" tip="Đang tải...">
      <a-layout-header class="header">
        <div class="logo flex items-center">
          <!-- <img src="/logo.png" alt="Logo" class="h-8 mr-2" /> -->
          <span class="text-gray-100 text-xl font-medium cursor-pointer" @click="naviDashboard">EAM VIMICO</span>
        </div>

        <!-- Navigation Menu -->
        <a-menu v-model:selectedKeys="selectedKeys" mode="horizontal" class="main-menu" theme="dark"
          @click="handleMenuClick">
          <!-- <a-sub-menu key="dashboard">
            <template #title>Dashboard</template>
<a-menu-item key="dashboard-1">Dashboard</a-menu-item>
</a-sub-menu> -->
          <a-sub-menu key="equipment" class="main-menu font-semibold">
            <template #title>Quản Lý Thiết Bị</template>
            <a-menu-item key="equipment-1">Thiết bị</a-menu-item>
            <a-menu-item key="equipment-2">Hệ thống</a-menu-item>
            <a-menu-item key="equipment-3">Bộ phận</a-menu-item>
            <!-- <a-menu-item key="equipment-3">Vị trí</a-menu-item> -->
          </a-sub-menu>
          <!-- <a-sub-menu key="vehicle" class="main-menu font-semibold">
            <template #title>Quản Lý Phương tiện vận tải</template>
            <a-sub-menu key="vehicle-setup">
              <template #title>Thiết lập</template>
              <a-menu-item key="vehicle-1">Định mức cung độ vận chuyển</a-menu-item>
              <a-menu-item key="vehicle-2">Định mức nhiên liệu</a-menu-item>
              <a-menu-item key="vehicle-6">Danh mục khách hàng</a-menu-item>
            </a-sub-menu>
            <a-menu-item key="vehicle-3">Quản lý phương tiện</a-menu-item>
            <a-menu-item key="vehicle-4">Lệnh điều vận</a-menu-item>
            <a-menu-item key="vehicle-5">Phiếu nhật trình</a-menu-item>
          </a-sub-menu> -->
          <a-sub-menu key="work" class="main-menu font-semibold">
            <template #title>Quản Lý Công Việc</template>
            <a-menu-item key="work-1">Danh sách phiếu công việc</a-menu-item>
            <!-- <a-menu-item key="work-2">Lịch bảo trì</a-menu-item> -->
            <a-menu-item key="work-3">Yêu cầu sửa chữa</a-menu-item>
          </a-sub-menu>

          <a-sub-menu key="materials" class="main-menu font-semibold">
            <template #title>Quản Lý Vật Tư</template>
            <a-menu-item key="materials-1">Vật tư</a-menu-item>
            <a-menu-item key="materials-2">Yêu cầu sử dụng</a-menu-item>
            <a-menu-item key="store-1">Danh mục kho</a-menu-item>
          </a-sub-menu>

          <a-sub-menu key="permits" class="main-menu font-semibold">
            <template #title>Quản Lý An Toàn</template>
            <a-menu-item key="permit-1">Giấy phép làm việc</a-menu-item>
          </a-sub-menu>

          <!-- <a-sub-menu key="safety" class="main-menu font-semibold">
            <template #title>Quản Lý An Toàn</template>
            <a-menu-item key="safety-1">Biên bản</a-menu-item>
            <a-menu-item key="safety-2">Permit to Work Setup</a-menu-item>
            <a-menu-item key="safety-3">Permits</a-menu-item>
            <a-menu-item key="safety-4">Hazards</a-menu-item>
            <a-menu-item key="safety-5">Precautions</a-menu-item>
            <a-menu-item key="safety-6">Isolation Points</a-menu-item>
            <a-menu-item key="safety-7">Nhân sự nhà thầu</a-menu-item>
            <a-menu-item key="safety-8">Permit to Work</a-menu-item>
          </a-sub-menu> -->

          <a-sub-menu key="documentation" class="main-menu font-semibold">
            <template #title>Tài liệu</template>
            <a-menu-item key="doc-1">Tài liệu</a-menu-item>
            <!-- <a-menu-item key="doc-2">Hướng dẫn</a-menu-item> -->
          </a-sub-menu>

          <!-- <a-sub-menu key="setting" class="main-menu font-semibold">
            <template #title>Cài đặt</template>
            <a-menu-item key="setting-1">Cài đặt hệ thống</a-menu-item>
            <a-menu-item key="setting-2">Cấu hình</a-menu-item>
          </a-sub-menu> -->

          <!-- <a-sub-menu key="report" class="main-menu font-semibold">
            <template #title>Báo cáo</template>
            <a-menu-item key="report-1">Báo cáo thiết bị</a-menu-item>
            <a-menu-item key="report-2">Báo cáo bảo trì</a-menu-item>
          </a-sub-menu> -->

          <a-sub-menu key="administration" class="main-menu font-semibold">
            <template #title>Quản trị</template>
            <a-menu-item key="admin-1">Quản lý người dùng</a-menu-item>
            <!-- <a-sub-menu key="admin-setting-1">
              <template #title>Thiết lập</template>
              <a-menu-item key="admin-setting-1">Group</a-menu-item>
              <a-menu-item key="admin-setting-2">Role</a-menu-item>
            </a-sub-menu> -->
            <a-sub-menu key="admin-setting">
              <template #title>Thiết lập</template>
              <a-menu-item key="admin-setting-1">Dataspy</a-menu-item>
              <!-- <a-menu-item key="admin-setting-2">System</a-menu-item> -->
            </a-sub-menu>
          </a-sub-menu>
        </a-menu>

        <!-- User Profile Section -->
        <div class="user-profile flex items-center ml-auto">
          <div class="user-info mr-4 text-right">
            <div class="text-gray-100 font-medium">
              {{ userStore.user.PER_DESC }}
            </div>
            <div class="text-gray-100 text-sm">
              {{ userStore.user.PER_JOBTITLE }}
            </div>
          </div>
          <a-dropdown>
            <a class="ant-dropdown-link" @click.prevent>
              <a-avatar :size="40" class="cursor-pointer">
                {{ userStore.user.PER_DESC?.[0] || "N" }}
              </a-avatar>
            </a>
            <template #overlay>
              <a-menu theme="light">
                <a-menu-item key="profile" @click="navigateTo('/auth/profile')">
                  <UserOutlined />
                  Thông tin tài khoản
                </a-menu-item>
                <!-- <a-menu-item key="admin" @click="navigateTo('/admin/user')">
                  <SettingOutlined />
                  Quản trị
                </a-menu-item> -->
                <!-- <a-menu-item key="documents" @click="navigateTo('/documents')">
                  <UserOutlined />
                  Tài liệu
                </a-menu-item> -->
                <a-menu-divider />
                <a-menu-item key="logout" @click="handleLogout">
                  <LogoutOutlined />
                  Đăng xuất
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>

      <!-- Main Content -->
      <a-layout-content class="flex h-[calc(100vh-4rem)] p-[10px] overflow-hidden bg-gray-100">
        <slot />
      </a-layout-content>
    </a-spin>
    <!-- Add FloatingAIChat -->
    <HelperFloatingAIChat />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { MenuInfo } from "ant-design-vue/es/menu/src/interface";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons-vue";
import { useLoadingStore } from "~/store/loading";
import { useUserStore } from "~/store/user";
import { useAssetStore } from "~/store/asset";
import { useSettingStore } from "~/store/setting";
import { useDashboardStore } from "~/store/dashboard";
const dashboardStore = useDashboardStore();
const assetStore = useAssetStore();
const userStore = useUserStore();
const loadingStore = useLoadingStore();
const settingStore = useSettingStore();
const selectedKeys = ref<string[]>(["safety"]);

// Mock user data - replace with actual user data from your auth system
const userName = ref("Nguyễn Văn A");
const userDepartment = ref("Phòng Kỹ thuật");
const userInitials = ref("NA");

const handleMenuClick = (menuInfo: MenuInfo) => {
  const key = menuInfo.key as string;
  switch (key) {
    case 'dashboard-1':
      navigateTo('/')
      break
    case 'equipment-1':
      navigateTo('/asset')
      break
    case 'equipment-2':
      navigateTo('/system')
      break
    case 'equipment-3':
      navigateTo('/department')
      break
    case 'work-1':
      navigateTo('/work')
      break
    case 'work-2':
      navigateTo('/document')
      break
    case 'work-3':
      navigateTo('/workrequest')
      break
    case 'materials-1':
      navigateTo('/part')
      break
    case 'materials-2':
      navigateTo('/YCVT')
      break
    case 'safety-1':
      navigateTo('/safety/reports')
      break
    case 'safety-2':
      navigateTo('/safety/ptw-setup')
      break
    case 'safety-3':
      navigateTo('/safety/permits')
      break
    case 'safety-4':
      navigateTo('/safety/hazards')
      break
    case 'safety-5':
      navigateTo('/safety/precautions')
      break
    case 'safety-6':
      navigateTo('/safety/isolation-points')
      break
    case 'safety-7':
      navigateTo('/safety/contractors')
      break
    case 'safety-8':
      navigateTo('/safety/ptw')
      break
    case 'doc-1':
      navigateTo('/document')
      break
    case 'doc-2':
      navigateTo('/guides')
      break
    case 'setting-1':
      navigateTo('/settings/system')
      break
    case 'setting-2':
      navigateTo('/settings/config')
      break
    case 'report-1':
      navigateTo('/reports/assets')
      break
    case 'report-2':
      navigateTo('/reports/maintenance')
      break
    case 'admin-1':
      navigateTo('/admin/user')
      break
    case 'admin-2':
      navigateTo('/admin/roles')
      break
    case 'admin-3':
      navigateTo('/admin/system')
      break
    case 'vehicle-3':
      navigateTo('/vehicle')
      break
    case 'vehicle-1':
      navigateTo('/route')
      break
    case 'vehicle-2':
      navigateTo('/fuel')
      break
    case 'vehicle-4':
      navigateTo('/LDV')
      break
    case 'vehicle-5':
      navigateTo('/PNT')
      break
    case 'vehicle-6':
      navigateTo('/DMKH')
      break
    case 'admin-setting-1':
      navigateTo('/admin/dataspy')
      break
    case 'store-1':
      navigateTo('/store')
      break
    case 'permit-1':
      navigateTo('/permit')
      break
  }
};

const naviDashboard = () => {
  selectedKeys.value = [];
  navigateTo("/");
};

const handleLogout = () => {
  // Implement logout logic here
  userStore.logout();
  console.log("Logout clicked");
  navigateTo("/auth/login");
};

onMounted(async () => {
  await assetStore.fetchOrg();
  await settingStore.fetchOrg();
  await dashboardStore.getDepts();
  await dashboardStore.getOrgs();
});
</script>

<style scoped>
.header {
  height: 4rem;
  padding: 0 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2);
  background-color: #0097b8;
}

.logo {
  height: 64px;
  margin-right: 48px;
}

.main-menu {
  line-height: 64px;
  background: transparent;
  border-bottom: none;
  flex: 1;
}

.main-menu .ant-menu-item,
.main-menu .ant-menu-submenu-title {
  font-weight: 600;
  /* Đậm hơn mặc định (thường là 400) */
  font-family: "Geist", Arial, Helvetica, sans-serif;
  /* Nếu muốn dùng font này */
  font-size: 15px;
}

:deep(.ant-menu-item-selected) {
  /* background-color: #00c0eb !important; */
}

:deep(.ant-menu-submenu-selected) {
  background-color: #00c0eb !important;
}

:deep(.ant-menu-item:hover),
:deep(.ant-menu-submenu-title:hover) {
  color: #d6ebff !important;
}

:deep(.ant-menu-horizontal) {
  border-bottom: none;
}

:deep(.ant-menu-dark) {
  background: transparent;
}

:deep(.ant-menu-dark .ant-menu-item),
:deep(.ant-menu-dark .ant-menu-submenu-title) {
  color: rgba(255, 255, 255, 0.85);
}

:deep(.ant-menu-dark .ant-menu-item:hover),
:deep(.ant-menu-dark .ant-menu-submenu-title:hover) {
  color: #ffffff !important;
}

.user-profile {
  height: 64px;
  padding: 0 20px;
}

:deep(.ant-dropdown-menu) {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

:deep(.ant-dropdown-menu-item) {
  color: rgba(0, 0, 0, 0.85);
}

:deep(.ant-dropdown-menu-item:hover) {
  background: #f5f5f5;
}

:deep(.ant-dropdown-menu-item-selected) {
  background: #e6f7ff;
}

:deep(.ant-dropdown-menu-divider) {
  background: #f0f0f0;
}

:deep(.ant-spin-nested-loading) {
  height: 100%;
}

:deep(.ant-spin-container) {
  height: 100vh;
  width: 100vw;
  align-self: center;
}
</style>

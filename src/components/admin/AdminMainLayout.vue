<template>
  <div>
    <h1>Admin Main Layout</h1>
    <admin-header></admin-header>
    <admin-sidebar></admin-sidebar>
  </div>
</template>

<script>
import AdminHeader from './admin-header/AdminHeader.vue';
import AdminSidebar from './AdminSidebar.vue';
export default {
  components: { AdminHeader, AdminSidebar },
  name: 'AdminMainLayout',
};
</script>
import { defineNuxtPlugin } from '#app';
import { abilitiesPlugin } from '@casl/vue';
import { defineAbilityFor } from '~/casl/ability';
import { useUserStore } from '~/store/user';

export default defineNuxtPlugin((nuxtApp) => {
  const userStore = useUserStore();
  
  // Tạo ability rules dựa trên user hiện tại
  const ability = defineAbilityFor(userStore.user);

  // Đăng ký CASL plugin
  nuxtApp.vueApp.use(abilitiesPlugin, ability, {
    useGlobalProperties: true
  });

  return {
    provide: {
      ability
    }
  };
}); 
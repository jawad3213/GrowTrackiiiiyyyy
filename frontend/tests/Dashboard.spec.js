import { shallowMount } from '@vue/test-utils';
import Dashboard from '@/components/dashboard.vue';
import { SidebarSymbol } from '@/composables/useSidebar';

describe('Dashboard.vue', () => {
  it('se monte sans erreur', () => {
    const wrapper = shallowMount(Dashboard, {
      global: {
        provide: { [SidebarSymbol]: { isOpen: false, toggle: () => {} } },
        stubs: ['router-link', 'apexchart']
      }
    });
    expect(wrapper.exists()).toBe(true);
  });
});

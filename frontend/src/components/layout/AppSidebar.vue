<template>
  <aside
    :class="[
      'fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-99999 border-r border-gray-200',
      {
        'lg:w-[290px]': isExpanded || isMobileOpen || isHovered,
        'lg:w-[90px]': !isExpanded && !isHovered,
        'translate-x-0 w-[290px]': isMobileOpen,
        '-translate-x-full': !isMobileOpen,
        'lg:translate-x-0': true,
      },
    ]"
    @mouseenter="!isExpanded && (isHovered = true)"
    @mouseleave="isHovered = false"
  >
    <div class="py-8 flex flex-col items-center">
      <router-link to="/">
        <img
          v-if="isExpanded || isHovered || isMobileOpen"
          class="dark:hidden"
          src="@/assets/logo.png"
          alt="Logo"
          width="220"
          height="80"
        />
        <img
          v-if="isExpanded || isHovered || isMobileOpen"
          class="hidden dark:block"
          src="@/assets/logo.png"
          alt="Logo"
          width="220"
          height="80"
        />
        <img
          v-else
          src="@/assets/logo4.png"
          alt="Logo"
          width="150"
          height="150"
        />
      </router-link>
    </div>
    <div class="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
      <nav class="mb-6">
        <div class="flex flex-col gap-4">
          <div v-for="(menuGroup, groupIndex) in menuGroups" :key="groupIndex">
            <h2
              :class="['mb-4 text-xs uppercase flex leading-[20px] text-gray-400', !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start']"
            >
              <template v-if="isExpanded || isHovered || isMobileOpen">
                {{ menuGroup.title }}
              </template>
              <HorizontalDots v-else />
            </h2>
            <ul class="flex flex-col gap-4">
              <li v-for="(item, index) in menuGroup.items" :key="item.name">
                <!-- Button with submenu -->
                <button
  v-if="item.subItems"
  @click="toggleSubmenu(groupIndex, index)"
  :class="[ 
    'menu-item group w-full flex items-center justify-between',
    {
      'menu-item-active': isSubmenuOpen(groupIndex, index),
      'menu-item-inactive': !isSubmenuOpen(groupIndex, index),
    },
    !isExpanded && !isHovered ? 'lg:justify-center' : ''
  ]"
>
  <!-- Left part: Icon + Label -->
  <span
    :class="[ 
      'flex items-center gap-3',
      isExpanded || isHovered || isMobileOpen ? 'justify-start' : 'flex-col'
    ]"
  >
    <component :is="item.icon" class="w-10 h-10" />
    <span
      v-if="isExpanded || isHovered || isMobileOpen"
      class="menu-item-text"
    >{{ item.name }}</span>
  </span>

  <!-- Right part: Arrow icon -->
  <ChevronDownIcon
    v-if="isExpanded || isHovered || isMobileOpen"
    :class="[
      'w-5 h-5 transition-transform duration-200',
      {
        'rotate-180 text-brand-500': isSubmenuOpen(groupIndex, index),
      }
    ]"
  />
</button>


                <!-- Router-link item without submenu -->
                <router-link
                  v-else-if="item.path"
                  :to="item.path"
                  :class="[
                    'menu-item group',
                    {
                      'menu-item-active': isActive(item.path),
                      'menu-item-inactive': !isActive(item.path),
                    },
                  ]"
                >
                  <span
                    :class="[
                      'transition-all',
                      isExpanded || isHovered || isMobileOpen
                        ? 'flex items-center gap-3 justify-start'
                        : 'flex flex-col items-center justify-center'
                    ]"
                  >
                    <component :is="item.icon" class="w-10 h-10" />
                    <span
                      v-if="isExpanded || isHovered || isMobileOpen"
                      class="menu-item-text"
                    >{{ item.name }}</span>
                  </span>
                </router-link>

                <!-- Submenu content -->
                <transition @enter="startTransition" @after-enter="endTransition" @before-leave="startTransition" @after-leave="endTransition">
                  <div
                    v-show="
                      isSubmenuOpen(groupIndex, index) &&
                      (isExpanded || isHovered || isMobileOpen)
                    "
                  >
                    <ul class="mt-2 space-y-1 ml-25 text-md">
                      <li v-for="subItem in item.subItems" :key="subItem.name">
                        <router-link
                          :to="subItem.path"
                          :class="[
                            'menu-dropdown-item flex justify-between items-center',
                            {
                              'menu-dropdown-item-active': isActive(subItem.path),
                              'menu-dropdown-item-inactive': !isActive(subItem.path),
                            },
                          ]"
                        >
                          {{ subItem.name }}
                          <span class="flex items-center gap-1 ml-auto">
                            <span v-if="subItem.new" class="menu-dropdown-badge">new</span>
                            <span v-if="subItem.pro" class="menu-dropdown-badge">pro</span>
                          </span>
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </transition>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <SidebarWidget v-if="isExpanded || isHovered || isMobileOpen" />
    </div>
  </aside>
</template>


<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

import {
  UserSittings,
  UserAdd,
  GridIcon,
  CalenderIcon,
  UserCircleIcon,
  ChatIcon,
  MailIcon,
  DocsIcon,
  PieChartIcon,
  ChevronDownIcon,
  HorizontalDots,
  PageIcon,
  TableIcon,
  ListIcon,
  PlugInIcon,
} from "@/components/icons";
import { useSidebar } from "@/composables/useSidebar";

const route = useRoute();

const { isExpanded, isMobileOpen, isHovered, openSubmenu } = useSidebar();

const menuGroups = [
  {
    title: "Menu",
    items: [
      {
        icon: GridIcon,
        name: "Dashboard",
        path: "/dashboard", 
      },
      {
        icon: CalenderIcon,
        name: "Calendar",
        path: "/Calendar",
      },
      {
        icon: UserCircleIcon,
        name: "Profile",
        path: "/UserProfile",
      },
      {
        icon: UserAdd,
        name: "UserMangement",
        subItems: [
          { name: "Students ", path: "/Student", pro: false },
          { name: "Professors ", path: "/Professor", pro: false },
          { name: "Supervisors ", path: "/Supervisor", pro: false },
        ],
      },
      {
        name: "Skills ",
        icon: UserSittings,
         path: "/Skills",
      },
      {
        name: "Evaluations",
        icon: PageIcon,
        subItems: [
          { name: "GlobalOverview", path: "/GlobalOverview", pro: false },
          { name: "Signals", path: "/Signals", pro: false },
        ],
      },
      {
        name: "Institution Settings",
        icon: PageIcon,
        subItems: [
          { name: "Fields & Groups", path: "/Group", pro: false },
          { name: "Coach ", path: "/Coach", pro: false },
        ],
      },
    ],
  },
 
];

const isActive = (path) => route.path === path;

const toggleSubmenu = (groupIndex, itemIndex) => {
  const key = `${groupIndex}-${itemIndex}`;
  openSubmenu.value = openSubmenu.value === key ? null : key;
};

const isAnySubmenuRouteActive = computed(() => {
  return menuGroups.some((group) =>
    group.items.some(
      (item) =>
        item.subItems && item.subItems.some((subItem) => isActive(subItem.path))
    )
  );
});

const isSubmenuOpen = (groupIndex, itemIndex) => {
  const key = `${groupIndex}-${itemIndex}`;
  return (
    openSubmenu.value === key ||
    (isAnySubmenuRouteActive.value &&
      menuGroups[groupIndex].items[itemIndex].subItems?.some((subItem) =>
        isActive(subItem.path)
      ))
  );
};

const startTransition = (el) => {
  el.style.height = "auto";
  const height = el.scrollHeight;
  el.style.height = "0px";
  el.offsetHeight; // force reflow
  el.style.height = height + "px";
};

const endTransition = (el) => {
  el.style.height = "";
};
</script>

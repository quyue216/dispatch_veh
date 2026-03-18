import type { MenuDataItem } from '@ant-design/pro-components';

/**
 * 将后端菜单数据转换为 ProLayout 需要的格式
 */
export const convertBackendMenus = (menus: any[]): MenuDataItem[] => {
  if (!menus || !Array.isArray(menus)) {
    return [];
  }

  return menus.map((menu) => {
    const item: MenuDataItem = {
      path: menu.path,
      name: menu.name,
      icon: menu.icon,
      hideInMenu: menu.hideInMenu,
      hideChildrenInMenu: menu.hideChildrenInMenu,
      flatMenu: menu.flatMenu,
      target: menu.target,
    };

    if (menu.children && menu.children.length > 0) {
      item.children = convertBackendMenus(menu.children);
    }

    return item;
  });
};

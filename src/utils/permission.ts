import  routes  from '@/router';

interface TreeNode {
  title: string;
  key: string;
  children?: TreeNode[];
}

export function generatePermissionTree(): TreeNode[] {
  const generatePermissions = (route: any, parentKey = ''): TreeNode[] => {
    if (!route) return [];

    const permissions: TreeNode[] = [];
    const routeKey = parentKey ? `${parentKey}:${route.path}` : route.path;

    if (route.title) {
      const node: TreeNode = {
        title: route.title,
        key: routeKey,
        children: [
          { title: '查看', key: `${routeKey}:view` },
          { title: '新增', key: `${routeKey}:create` },
          { title: '编辑', key: `${routeKey}:edit` },
          { title: '删除', key: `${routeKey}:delete` }
        ]
      };

      if (route.children) {
        route.children.forEach((child: any) => {
          const childPermissions = generatePermissions(child, routeKey);
          if (childPermissions.length) {
            node.children = [...(node.children || []), ...childPermissions];
          }
        });
      }

      permissions.push(node);
    }

    return permissions;
  };

  return routes
    .filter(route => route.title)
    .map(route => generatePermissions(route)[0])
    .filter(Boolean);
} 
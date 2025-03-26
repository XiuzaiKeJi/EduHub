# 组件文档

## 布局组件

### Layout
主布局组件，包含页面的基本结构。

**属性**：
```typescript
{
  children: React.ReactNode;
}
```

### Header
页面头部组件，包含导航和用户信息。

**属性**：无

## UI 组件

### Card
卡片组件，用于展示内容块。

**属性**：
```typescript
{
  className?: string;
  bordered?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}
```

**子组件**：
- `CardTitle`: 卡片标题
- `CardContent`: 卡片内容
- `CardCover`: 卡片封面
- `CardActions`: 卡片操作区

## 使用示例

```tsx
import Card from '@/components/display/Card';

export default function Example() {
  return (
    <Card bordered>
      <CardTitle>标题</CardTitle>
      <CardContent>内容</CardContent>
      <CardActions>
        <button>操作</button>
      </CardActions>
    </Card>
  );
}
```

## 最佳实践

1. 组件命名
   - 使用 PascalCase
   - 文件名与组件名一致
   - 组件文件使用 .tsx 扩展名

2. 属性定义
   - 使用 TypeScript 接口定义属性
   - 为可选属性提供默认值
   - 使用 JSDoc 注释说明属性用途

3. 样式管理
   - 使用 Tailwind CSS 类名
   - 使用 class-variance-authority 管理样式变体
   - 避免内联样式

4. 性能优化
   - 使用 React.memo() 优化渲染
   - 使用 useCallback 和 useMemo 缓存函数和值
   - 避免不必要的重渲染 
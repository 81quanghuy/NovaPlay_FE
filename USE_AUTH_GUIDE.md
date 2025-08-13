# Hướng dẫn sử dụng Hook useAuth

## Tổng quan

Hook `useAuth` cung cấp một interface đơn giản và dễ sử dụng để quản lý xác thực người dùng trong ứng dụng NovaPlay. Hook này sử dụng Keycloak làm backend xác thực và cung cấp các method cần thiết cho việc đăng nhập, đăng xuất và quản lý token.

## Cài đặt và Import

```typescript
import { useAuth } from '../hooks/useAuth';
```

## Cách sử dụng cơ bản

```typescript
function MyComponent() {
  const { user, isLoading, isAuthenticated, login, logout } = useAuth();

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Xin chào, {user?.name}!</p>
          <button onClick={logout}>Đăng xuất</button>
        </div>
      ) : (
        <button onClick={login}>Đăng nhập</button>
      )}
    </div>
  );
}
```

## Các thuộc tính và method có sẵn

### Thuộc tính

| Thuộc tính | Kiểu dữ liệu | Mô tả |
|------------|---------------|-------|
| `user` | `User \| null` | Thông tin người dùng đã đăng nhập |
| `isLoading` | `boolean` | Trạng thái đang tải |
| `isAuthenticated` | `boolean` | Trạng thái đã xác thực |

### Method

| Method | Tham số | Kiểu trả về | Mô tả |
|--------|---------|--------------|-------|
| `login()` | Không có | `void` | Chuyển hướng đến trang đăng nhập |
| `logout()` | Không có | `void` | Đăng xuất và chuyển về trang chủ |
| `getToken()` | Không có | `Promise<string>` | Lấy token hiện tại (tự động cập nhật) |
| `updateToken()` | Không có | `Promise<void>` | Cập nhật token |

### Thông tin người dùng (User object)

```typescript
interface User {
  id: string;        // ID người dùng từ Keycloak
  email: string;     // Email người dùng
  name: string;      // Tên người dùng (hoặc username)
}
```

## Ví dụ sử dụng chi tiết

### 1. Component với xác thực

```typescript
import React from 'react';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedComponent() {
  const { user, isLoading, isAuthenticated, login } = useAuth();

  if (isLoading) {
    return <div>Đang kiểm tra trạng thái đăng nhập...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div>
        <p>Bạn cần đăng nhập để xem nội dung này</p>
        <button onClick={login}>Đăng nhập</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Chào mừng, {user?.name}!</h1>
      <p>Email: {user?.email}</p>
      {/* Nội dung được bảo vệ */}
    </div>
  );
}
```

### 2. Sử dụng với API calls

```typescript
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useApi } from '../api';

export default function DataComponent() {
  const { isAuthenticated, getToken } = useAuth();
  const { getSecure } = useApi();
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const result = await getSecure();
      setData(result);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <div>Vui lòng đăng nhập để xem dữ liệu</div>;
  }

  return (
    <div>
      <h2>Dữ liệu bảo mật</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
```

### 3. Custom hook với useAuth

```typescript
import { useAuth } from '../hooks/useAuth';

export const useUserProfile = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  const isAdmin = user?.email?.includes('admin');
  const isPremium = user?.email?.includes('premium');
  
  return {
    user,
    isAuthenticated,
    isLoading,
    isAdmin,
    isPremium,
  };
};
```

## Xử lý lỗi

```typescript
function MyComponent() {
  const { getToken } = useAuth();
  const [error, setError] = useState('');

  const handleSecureAction = async () => {
    try {
      const token = await getToken();
      // Thực hiện hành động với token
    } catch (err: any) {
      setError('Lỗi xác thực: ' + (err?.message || 'Unknown error'));
    }
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <button onClick={handleSecureAction}>Thực hiện hành động</button>
    </div>
  );
}
```

## Lưu ý quan trọng

1. **Hook chỉ hoạt động trong components**: `useAuth` chỉ có thể được sử dụng trong React components hoặc custom hooks.

2. **Tự động cập nhật token**: Method `getToken()` sẽ tự động cập nhật token nếu cần thiết.

3. **Redirect tự động**: `login()` và `logout()` sẽ tự động chuyển hướng người dùng.

4. **Trạng thái loading**: Luôn kiểm tra `isLoading` trước khi render nội dung để tránh lỗi.

5. **Sử dụng với useApi**: Để gọi API một cách an toàn, hãy sử dụng hook `useApi` thay vì gọi trực tiếp các API functions.

## Troubleshooting

### Lỗi "Please use useApi() hook in components"

Nếu bạn gặp lỗi này, có nghĩa là bạn đang cố gắng gọi các API functions cũ (`getPublic`, `getSecure`) bên ngoài components. Hãy sử dụng hook `useApi` thay thế:

```typescript
// ❌ Sai - gọi trực tiếp
import { getPublic } from '../api';
const data = await getPublic();

// ✅ Đúng - sử dụng hook
import { useApi } from '../api';
const { getPublic } = useApi();
const data = await getPublic();
```

### Token không được cập nhật

Nếu token không được cập nhật tự động, hãy đảm bảo rằng bạn đang sử dụng `getToken()` thay vì truy cập trực tiếp `keycloak.token`.

## Ví dụ hoàn chỉnh

Xem file `src/components/ExampleUsage.tsx` để có ví dụ hoàn chỉnh về cách sử dụng tất cả các tính năng của hook `useAuth`.

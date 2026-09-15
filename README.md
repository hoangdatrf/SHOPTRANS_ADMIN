# SHOPTRANS Admin

Project Nuxt 3 độc lập dành riêng cho trang quản trị SHOPTRANS. Source được tách từ
project `SHOPTRANS`; project cũ vẫn được giữ nguyên để có thể dùng làm bản dự phòng.

## Chạy local

```bash
npm install
npm run dev
```

Admin chạy tại `http://localhost:5002/admin` và trang `/` tự chuyển đến `/admin`.

## Kết nối backend cũ

Thiết lập trong `.env`:

```dotenv
NUXT_PUBLIC_API_BASE_URL=
NUXT_PUBLIC_API_PORT=5001
SHOPTRANS_BACKEND_URL=http://127.0.0.1:5001
```

- Khi để trống `NUXT_PUBLIC_API_BASE_URL`, chạy local sẽ gọi backend cùng hostname ở
  cổng `5001`.
- Khi deploy, đặt `NUXT_PUBLIC_API_BASE_URL` thành URL backend hiện tại, ví dụ
  `https://api.shoptrans.net`.
- Không cần tạo hoặc sao chép backend sang project này.
- `/api/admin-console/**` được proxy từ frontend Admin sang backend cũ để dùng chung
  dữ liệu và tránh lỗi CORS giữa cổng `5002` và `5001`.

## Lệnh kiểm tra/deploy

```bash
npm run build
npm run preview
```

Preview mặc định chạy ở cổng `5002`.

## Lưu ý bảo trì

Hai frontend hiện là hai bản source độc lập. Thay đổi Admin mới nên thực hiện trong
project này. Admin trong project `SHOPTRANS` không bị xóa hay chỉnh sửa và chỉ đóng
vai trò bản dự phòng; các thay đổi về sau sẽ không tự đồng bộ giữa hai project.
"# SHOPTRANS_ADMIN" 

# Kiến Trúc Hệ Thống - PDF 3D Flipbook

Tài liệu này trình bày chi tiết về cấu trúc component, luồng hoạt động (flow), kỹ thuật SEO và xử lý render của dự án Next.js PDF 3D Flipbook.

---

## 1. Component `FlipbookClient` được gọi ở đâu?

`FlipbookClient` **không được gọi trực tiếp** từ trang chính (`app/page.tsx`). Thay vào đó, nó được gọi gián tiếp thông qua component `FlipbookWrapper.tsx`. 

- **Đường dẫn**: `app/page.tsx` ➔ `<FlipbookWrapper />` ➔ `<FlipbookClient />`

Lý do của việc này là để cô lập hoàn toàn môi trường Client-side cho thư viện `react-pageflip` và `react-pdf`, giúp tránh lỗi `window is not defined` trong quá trình Next.js render trên server.

---

## 2. Nhiệm vụ của từng Component

Hệ thống được chia thành 4 lớp component chính để đảm bảo Clean Code và tối ưu hiệu năng:

1. **`src/app/page.tsx` (Trang chủ / Server Component)**:
   - Đóng vai trò là entry point của ứng dụng.
   - Định nghĩa Layout tổng thể, Header, Footer và truyền URL của file PDF vào trong hệ thống.
   - Chịu trách nhiệm khai báo **SEO Metadata** cho toàn bộ trang web.

2. **`src/components/FlipbookWrapper.tsx` (Dynamic Loading Wrapper)**:
   - Nhiệm vụ duy nhất là bọc `FlipbookClient` và load nó bằng kỹ thuật **Dynamic Import** của Next.js (`next/dynamic`) với tuỳ chọn `ssr: false`.
   - Hiển thị giao diện Loading (Spinner) đẹp mắt trong lúc chờ trình duyệt tải mã nguồn của component PDF.

3. **`src/components/FlipbookClient.tsx` (Core Logic Component)**:
   - Đây là bộ não của ứng dụng.
   - Khởi tạo Web Worker của PDF.js để parse file PDF mà không làm đơ trình duyệt.
   - Quản lý logic tương tác: Click, Tap, Swipe, Zoom (kéo thả), Mute âm thanh, và Fullscreen.
   - Render từng trang PDF ra `<canvas>` thông qua `<Page>` của `react-pdf`.
   - Cung cấp dữ liệu và điều khiển cho `<HTMLFlipBook>`.

4. **`src/components/FlipbookControls.tsx` (UI Controls Component)**:
   - Component giao diện thuần tuý (Dumb Component).
   - Hiển thị thanh công cụ kính mờ (Glassmorphism) nổi trên màn hình (Zoom in/out, Mute, Fullscreen, Download, Next/Prev).
   - Nhận các hàm callback từ `FlipbookClient` để thực thi hành động.

---

## 3. Flow hoạt động (Luồng thực thi)

1. **Bước 1: Server Rendering (SSR)**
   - Khi user truy cập web, Next.js server ngay lập tức trả về file HTML có chứa các thẻ SEO (`<meta>`, `<title>`) và giao diện tĩnh của `page.tsx` cùng với giao diện Loading của `FlipbookWrapper`.
   - Trình duyệt hiển thị vòng xoay Loading ngay lập tức, user không bị màn hình trắng.

2. **Bước 2: Client Hydration & Dynamic Import**
   - Trình duyệt tải xong React và Next.js Javascript.
   - Trình duyệt bắt đầu tải ngầm (lazy-load) cục JS chứa `FlipbookClient`, `react-pdf`, và `react-pageflip`.

3. **Bước 3: Tải và Parse PDF**
   - Khi `FlipbookClient` load xong, nó kích hoạt PDF.js Worker.
   - Worker tiến hành fetch file PDF từ URL và đếm số lượng trang.

4. **Bước 4: Khởi tạo 3D Flipbook**
   - `<HTMLFlipBook>` được render với số lượng `<div className="page-wrapper">` tương ứng.
   - Ở mỗi thẻ div, `react-pdf` sẽ vẽ nội dung trang lên `<canvas>`.
   - `react-pageflip` thêm hiệu ứng đổ bóng, tính toán vật lý lật trang và hoàn tất hiển thị quyển sách.

---

## 4. Kỹ thuật Render & Syntax SEO

### Kỹ thuật Render: Hybrid Rendering (SSR + CSR)
Dự án sử dụng cơ chế kết hợp thông minh của Next.js 16:
- **Server-Side Rendering (SSR)** cho trang tĩnh và SEO.
- **Client-Side Rendering (CSR)** với `ssr: false` cho khối 3D Flipbook. Giải pháp Dynamic Import này vừa đảm bảo ứng dụng không bị crash trên server do gọi các API của trình duyệt (DOM, Window, Canvas), vừa giảm dung lượng bundle ban đầu.

### Syntax SEO
Trong `src/app/page.tsx` hoặc `layout.tsx`, dự án sử dụng API Metadata chuẩn của Next.js App Router:
```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interactive 3D Flipbook',
  description: 'A premium PDF flipbook experience built with Next.js',
  openGraph: {
    title: 'Interactive 3D Flipbook',
    images: ['/thumbnail.jpg'],
  }
};
```
Nhờ sử dụng Server Component, các thẻ này được Google Bot đọc được 100% trong mã nguồn HTML gốc mà không cần phải chạy Javascript.

---

## 5. File `src/types/page-flip.d.ts` dùng để làm gì?

Trong TypeScript, nếu bạn cài một thư viện Javascript cũ hoặc không có file khai báo kiểu dữ liệu (Type Definitions), TypeScript sẽ báo lỗi màu đỏ (ví dụ: `Could not find a declaration file for module 'react-pageflip'`).

Thư viện `page-flip` và `react-pageflip` hiện tại chưa cung cấp package `@types/react-pageflip` chính thức. Do đó:

1. **Định nghĩa Module**: File `.d.ts` này nói với TypeScript compiler rằng *"Hãy coi 'react-pageflip' và 'page-flip' là các module hợp lệ, đừng báo lỗi import"*.
2. **Khai báo Props**: Nó định nghĩa rõ ràng các thuộc tính (Props) truyền vào `<HTMLFlipBook>` (ví dụ: `width`, `height`, `showCover`, `useMouseEvents`,...).
3. **Khai báo Methods**: Nó định nghĩa các hàm tích hợp sẵn của object page-flip như `flipNext()`, `flipPrev()`, giúp các IDE (như VSCode) có thể **Gợi ý code (Autocomplete)** một cách chính xác và an toàn.

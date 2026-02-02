# 🎵 TikTok OAuth Test Interface

Giao diện test đăng nhập TikTok và lấy Access Token sử dụng TikTok OAuth 2.0 API.

## ✨ Tính năng

- ✅ Đăng nhập TikTok qua OAuth 2.0
- ✅ Lấy Access Token & Refresh Token
- ✅ Hỗ trợ đầy đủ các scopes (user info, video, comments, insights, etc.)
- ✅ Test API với token nhận được
- ✅ Giao diện đẹp, thân thiện, dễ sử dụng

## 📋 Yêu cầu

- Node.js (phiên bản 14 trở lên)
- npm hoặc yarn
- TikTok Developer Account

## 🚀 Cài đặt

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình TikTok App

Truy cập [TikTok Developer Portal](https://developers.tiktok.com/) và:

1. Tạo một ứng dụng mới (hoặc sử dụng app hiện có)
2. Lấy **Client Key** và **Client Secret**
3. Cấu hình **Redirect URI**:
   - Môi trường local: `http://localhost:3000/callback`
   - Production: `https://yourdomain.com/callback`

### 3. Tạo file .env

Sao chép file `.env.example` thành `.env`:

```bash
copy .env.example .env
```

Sau đó mở file `.env` và điền thông tin:

```env
TIKTOK_CLIENT_KEY=your_client_key_here
TIKTOK_CLIENT_SECRET=your_client_secret_here
PORT=3000
REDIRECT_URI=http://localhost:3000/callback
```

## 🎯 Sử dụng

### Khởi động server

```bash
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

### Các bước test

1. Mở trình duyệt và truy cập: `http://localhost:3000`
2. Click vào nút **"Đăng nhập với TikTok"**
3. Đăng nhập vào TikTok và cấp quyền cho ứng dụng
4. Bạn sẽ được chuyển về trang kết quả với Access Token
5. Copy Access Token để sử dụng
6. (Tùy chọn) Test API bằng cách paste token vào form "Test API với Access Token"

## 📁 Cấu trúc thư mục

```
TikTok test/
├── public/
│   └── index.html          # Giao diện frontend
├── server.js               # Backend Express server
├── package.json            # Dependencies
├── .env.example            # Template file cấu hình
├── .env                    # File cấu hình (không commit)
├── .gitignore             # Git ignore rules
└── README.md              # Tài liệu này
```

## 🔧 API Endpoints

### `GET /`
Trang chủ - giao diện đăng nhập

### `GET /auth/url`
Lấy URL để redirect đến trang xác thực TikTok

**Response:**
```json
{
  "authUrl": "https://www.tiktok.com/v2/auth/authorize?...",
  "state": "csrf_token"
}
```

### `GET /callback`
Xử lý callback từ TikTok sau khi user xác thực thành công

**Query Parameters:**
- `code`: Authorization code từ TikTok
- `state`: CSRF token

### `POST /api/user-info`
Test endpoint để lấy thông tin user

**Request Body:**
```json
{
  "access_token": "your_access_token"
}
```

## 🎨 Scopes được hỗ trợ

Ứng dụng yêu cầu các quyền sau:

- `user.info.basic` - Thông tin cơ bản
- `user.info.username` - Username
- `user.info.stats` - Thống kê user
- `user.info.profile` - Profile
- `user.account.type` - Loại tài khoản
- `user.insights` - Insights
- `video.list` - Danh sách video
- `video.insights` - Video insights
- `comment.list` - Danh sách comments
- `comment.list.manage` - Quản lý comments
- `video.publish` - Đăng video
- `video.upload` - Upload video
- `biz.spark.auth` - Spark ads
- `discovery.search.words` - Từ khóa search
- `message.list.read` - Đọc tin nhắn
- `message.list.send` - Gửi tin nhắn
- `message.list.manage` - Quản lý tin nhắn

## ⚠️ Lưu ý

- Đây là môi trường **TEST**, không sử dụng trong production trực tiếp
- Không chia sẻ Access Token với người khác
- Access Token có thời hạn, sử dụng Refresh Token để gia hạn
- Đảm bảo file `.env` không được commit vào Git
- Redirect URI phải khớp chính xác với cấu hình trong TikTok Developer Portal

## 🐛 Troubleshooting

### Lỗi "Invalid redirect_uri"
- Kiểm tra lại Redirect URI trong file `.env` có khớp với TikTok Developer Portal không
- Đảm bảo không có khoảng trắng thừa

### Lỗi "Invalid client_key"
- Kiểm tra lại Client Key và Client Secret trong file `.env`
- Đảm bảo app TikTok đang ở trạng thái active

### Không nhận được Access Token
- Mở Developer Console (F12) để xem log lỗi
- Kiểm tra network tab để xem request/response

## 📚 Tài liệu tham khảo

- [TikTok for Developers](https://developers.tiktok.com/)
- [TikTok API Documentation](https://developers.tiktok.com/doc/overview)
- [OAuth 2.0 Guide](https://developers.tiktok.com/doc/oauth-user-access-token-management)

## 📄 License

MIT

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy tạo issue hoặc pull request.

---

Made with ❤️ for testing TikTok OAuth

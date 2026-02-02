# 🚀 Hướng dẫn Deploy miễn phí

## Phương án 1: Render.com (Khuyên dùng ⭐)

### Ưu điểm:
- ✅ Hoàn toàn miễn phí
- ✅ HTTPS tự động
- ✅ Hỗ trợ Node.js tốt
- ✅ Deploy tự động từ GitHub
- ✅ Subdomain miễn phí: `yourapp.onrender.com`

### Các bước deploy:

#### 1. Đăng ký Render.com
- Truy cập: https://render.com
- Đăng ký tài khoản (có thể dùng GitHub)

#### 2. Tạo Repository GitHub
```bash
# Khởi tạo git repository
cd "d:\TikTok test"
git init
git add .
git commit -m "Initial commit: TikTok OAuth app"

# Tạo repository trên GitHub và push
# Sau đó push code lên
git remote add origin https://github.com/your-username/tiktok-oauth-test.git
git branch -M main
git push -u origin main
```

#### 3. Tạo Web Service trên Render
1. Đăng nhập vào Render Dashboard
2. Click **"New +"** → **"Web Service"**
3. Kết nối GitHub repository của bạn
4. Cấu hình:
   - **Name**: `tiktok-oauth-test` (hoặc tên bạn muốn)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: `Free`

#### 4. Thêm Environment Variables
Trong phần **Environment** của Render:
- `TIKTOK_CLIENT_KEY`: `7574739294556798977`
- `TIKTOK_CLIENT_SECRET`: `6c3ab664090a9e559e159da3cbb2a5f1a94b5dc9`
- `PORT`: `3000`
- `REDIRECT_URI`: `https://your-app-name.onrender.com/callback`

⚠️ **Lưu ý**: Thay `your-app-name` bằng tên app thực tế của bạn

#### 5. Deploy
- Click **"Create Web Service"**
- Render sẽ tự động build và deploy
- Chờ 2-3 phút để hoàn tất

#### 6. Cập nhật TikTok Developer Portal
1. Truy cập https://developers.tiktok.com/
2. Vào app của bạn
3. Thêm Redirect URI: `https://your-app-name.onrender.com/callback`
4. Save

#### 7. Kiểm tra
- Truy cập: `https://your-app-name.onrender.com`
- Test đăng nhập TikTok

---

## Phương án 2: Railway.app

### Ưu điểm:
- ✅ Free $5/tháng credit
- ✅ HTTPS tự động
- ✅ Deploy nhanh
- ✅ Hỗ trợ database miễn phí

### Các bước:

1. **Đăng ký Railway.app**
   - Truy cập: https://railway.app
   - Đăng ký với GitHub

2. **Deploy từ GitHub**
   - Click **"New Project"**
   - Chọn **"Deploy from GitHub repo"**
   - Chọn repository của bạn

3. **Thêm Environment Variables**
   ```
   TIKTOK_CLIENT_KEY=7574739294556798977
   TIKTOK_CLIENT_SECRET=6c3ab664090a9e559e159da3cbb2a5f1a94b5dc9
   PORT=3000
   REDIRECT_URI=https://yourapp.up.railway.app/callback
   ```

4. **Generate Domain**
   - Vào **Settings** → **Generate Domain**
   - Lấy URL và cập nhật `REDIRECT_URI`

5. **Cập nhật TikTok Developer Portal** với redirect URI mới

---

## Phương án 3: Fly.io

### Ưu điểm:
- ✅ Free tier tốt
- ✅ Global edge network
- ✅ HTTPS tự động

### Các bước:

1. **Cài đặt Fly CLI**
   ```powershell
   # Trên Windows
   iwr https://fly.io/install.ps1 -useb | iex
   ```

2. **Đăng nhập**
   ```bash
   fly auth signup
   # hoặc
   fly auth login
   ```

3. **Deploy**
   ```bash
   cd "d:\TikTok test"
   fly launch
   # Trả lời các câu hỏi:
   # - App name: tiktok-oauth-test
   # - Region: Singapore hoặc Tokyo (gần VN)
   # - Database: No
   # - Deploy now: Yes
   ```

4. **Set Environment Variables**
   ```bash
   fly secrets set TIKTOK_CLIENT_KEY=7574739294556798977
   fly secrets set TIKTOK_CLIENT_SECRET=6c3ab664090a9e559e159da3cbb2a5f1a94b5dc9
   fly secrets set REDIRECT_URI=https://tiktok-oauth-test.fly.dev/callback
   ```

5. **Cập nhật TikTok Developer Portal**

---

## Phương án 4: Vercel (Serverless)

⚠️ **Lưu ý**: Cần chuyển sang serverless functions

### Các bước:

1. **Cài Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd "d:\TikTok test"
   vercel
   ```

3. **Set Environment Variables**
   ```bash
   vercel env add TIKTOK_CLIENT_KEY
   vercel env add TIKTOK_CLIENT_SECRET
   vercel env add REDIRECT_URI
   ```

4. **Deploy production**
   ```bash
   vercel --prod
   ```

---

## So sánh các phương án

| Platform | Free Tier | HTTPS | Custom Domain | Khó khăn |
|----------|-----------|-------|---------------|----------|
| **Render** | ✅ Không giới hạn | ✅ | ✅ | ⭐ Dễ |
| **Railway** | $5/tháng | ✅ | ✅ | ⭐ Dễ |
| **Fly.io** | 3 apps | ✅ | ✅ | ⭐⭐ Trung bình |
| **Vercel** | Không giới hạn | ✅ | ✅ | ⭐⭐⭐ Khó (cần refactor) |

---

## ✅ Khuyến nghị

**Dùng Render.com** vì:
1. Hoàn toàn miễn phí, không giới hạn thời gian
2. Không cần cài đặt CLI
3. Deploy tự động từ GitHub
4. HTTPS tự động
5. Dễ dùng nhất

---

## 🆘 Hỗ trợ thêm

Nếu bạn gặp khó khăn trong quá trình deploy, hãy cho tôi biết:
- Bạn đã tạo GitHub repository chưa?
- Bạn muốn deploy lên platform nào?
- Có lỗi gì xuất hiện không?

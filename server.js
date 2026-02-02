require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// TikTok OAuth Configuration
const TIKTOK_CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY;
const TIKTOK_CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI || `http://localhost:${PORT}/callback`;

// Scopes
const SCOPES = [
  'user.info.basic',
  'user.info.username',
  'user.info.stats',
  'user.info.profile',
  'user.account.type',
  'user.insights',
  'video.list',
  'video.insights',
  'comment.list',
  'comment.list.manage',
  'video.publish',
  'video.upload',
  'biz.spark.auth',
  'discovery.search.words',
  'message.list.read',
  'message.list.send',
  'message.list.manage'
].join(',');

// Store code verifiers temporarily (in production, use Redis or database)
const codeVerifiers = new Map();

// Generate code verifier and challenge for PKCE
function generatePKCE() {
  const codeVerifier = crypto.randomBytes(32).toString('base64url');
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');
  
  return { codeVerifier, codeChallenge };
}

// Root route - serve HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get authorization URL
app.get('/auth/url', (req, res) => {
  const csrfState = Math.random().toString(36).substring(2);
  const { codeVerifier, codeChallenge } = generatePKCE();
  
  // Store code verifier with state as key
  codeVerifiers.set(csrfState, codeVerifier);
  
  // Clean up old verifiers after 10 minutes
  setTimeout(() => codeVerifiers.delete(csrfState), 10 * 60 * 1000);
  
  const authUrl = `https://www.tiktok.com/v2/auth/authorize?client_key=${TIKTOK_CLIENT_KEY}&scope=${encodeURIComponent(SCOPES)}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${csrfState}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
  
  res.json({ 
    authUrl,
    state: csrfState 
  });
});

// OAuth callback
app.get('/callback', async (req, res) => {
  const { code, state } = req.query;

  if (!code) {
    return res.send(`
      <html>
        <body>
          <h1>❌ Lỗi xác thực</h1>
          <p>Không nhận được authorization code từ TikTok</p>
          <a href="/">Thử lại</a>
        </body>
      </html>
    `);
  }

  // Get code verifier from storage
  const codeVerifier = codeVerifiers.get(state);
  if (!codeVerifier) {
    return res.send(`
      <html>
        <body>
          <h1>❌ Lỗi xác thực</h1>
          <p>Session đã hết hạn hoặc không hợp lệ. Vui lòng thử lại.</p>
          <a href="/">Thử lại</a>
        </body>
      </html>
    `);
  }

  try {
    // Exchange code for access token with code_verifier
    const tokenResponse = await axios.post('https://open.tiktokapis.com/v2/oauth/token/', {
      client_key: TIKTOK_CLIENT_KEY,
      client_secret: TIKTOK_CLIENT_SECRET,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    // Clean up used code verifier
    codeVerifiers.delete(state);

    const { access_token, refresh_token, expires_in, open_id, scope, token_type } = tokenResponse.data;

    // Display the token information
    res.send(`
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>TikTok OAuth - Thành công</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
          }
          .container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            max-width: 800px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          }
          h1 {
            color: #00f2ea;
            text-align: center;
            margin-bottom: 10px;
            font-size: 32px;
          }
          .success-icon {
            text-align: center;
            font-size: 48px;
            margin-bottom: 20px;
          }
          .info-box {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
            border-left: 4px solid #00f2ea;
          }
          .info-label {
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
            font-size: 14px;
          }
          .info-value {
            background: white;
            padding: 12px;
            border-radius: 5px;
            word-break: break-all;
            font-family: monospace;
            font-size: 13px;
            color: #666;
            margin-bottom: 10px;
          }
          .copy-btn {
            background: #00f2ea;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
            transition: background 0.3s;
          }
          .copy-btn:hover {
            background: #00d4cc;
          }
          .back-btn {
            display: block;
            text-align: center;
            background: #667eea;
            color: white;
            padding: 12px 24px;
            border-radius: 10px;
            text-decoration: none;
            margin-top: 30px;
            transition: background 0.3s;
          }
          .back-btn:hover {
            background: #5568d3;
          }
          .warning {
            background: #fff3cd;
            border-left-color: #ffc107;
            color: #856404;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="success-icon">✅</div>
          <h1>Đăng nhập thành công!</h1>
          
          <div class="info-box">
            <div class="info-label">Access Token:</div>
            <div class="info-value" id="access-token">${access_token}</div>
            <button class="copy-btn" onclick="copyToClipboard('access-token')">📋 Copy</button>
          </div>

          ${refresh_token ? `
          <div class="info-box">
            <div class="info-label">Refresh Token:</div>
            <div class="info-value" id="refresh-token">${refresh_token}</div>
            <button class="copy-btn" onclick="copyToClipboard('refresh-token')">📋 Copy</button>
          </div>
          ` : ''}

          <div class="info-box">
            <div class="info-label">Open ID:</div>
            <div class="info-value">${open_id || 'N/A'}</div>
          </div>

          <div class="info-box">
            <div class="info-label">Token Type:</div>
            <div class="info-value">${token_type || 'Bearer'}</div>
          </div>

          <div class="info-box">
            <div class="info-label">Expires In:</div>
            <div class="info-value">${expires_in ? `${expires_in} giây (${Math.floor(expires_in / 3600)} giờ)` : 'N/A'}</div>
          </div>

          <div class="info-box">
            <div class="info-label">Scopes:</div>
            <div class="info-value">${scope || SCOPES}</div>
          </div>

          <div class="warning">
            <strong>⚠️ Lưu ý:</strong> Đây là môi trường test. Không chia sẻ access token này với người khác!
          </div>

          <a href="/" class="back-btn">🏠 Quay về trang chủ</a>
        </div>

        <script>
          function copyToClipboard(elementId) {
            const element = document.getElementById(elementId);
            const text = element.textContent;
            navigator.clipboard.writeText(text).then(() => {
              const btn = element.nextElementSibling;
              const originalText = btn.textContent;
              btn.textContent = '✓ Đã copy!';
              setTimeout(() => {
                btn.textContent = originalText;
              }, 2000);
            });
          }
        </script>
      </body>
      </html>
    `);

  } catch (error) {
    console.error('Error exchanging code for token:', error.response?.data || error.message);
    res.send(`
      <html>
        <body style="font-family: Arial; padding: 40px; background: #f5f5f5;">
          <div style="background: white; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #ff4444;">❌ Lỗi lấy Access Token</h1>
            <p style="margin: 20px 0;"><strong>Chi tiết lỗi:</strong></p>
            <pre style="background: #f8f9fa; padding: 15px; border-radius: 5px; overflow-x: auto;">${JSON.stringify(error.response?.data || error.message, null, 2)}</pre>
            <a href="/" style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 20px;">Thử lại</a>
          </div>
        </body>
      </html>
    `);
  }
});

// API endpoint to get user info (for testing with access token)
app.post('/api/user-info', async (req, res) => {
  const { access_token } = req.body;

  if (!access_token) {
    return res.status(400).json({ error: 'Access token is required' });
  }

  try {
    const response = await axios.get('https://open.tiktokapis.com/v2/user/info/', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      },
      params: {
        fields: 'open_id,union_id,avatar_url,display_name,bio_description,profile_deep_link,is_verified,follower_count,following_count,likes_count,video_count'
      }
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch user info',
      details: error.response?.data || error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║         🎵 TikTok OAuth Test Server                       ║
╠════════════════════════════════════════════════════════════╣
║  Server đang chạy tại: http://localhost:${PORT}              ║
║                                                            ║
║  📝 Hãy đảm bảo bạn đã:                                   ║
║     1. Tạo file .env với TIKTOK_CLIENT_KEY và SECRET     ║
║     2. Cấu hình redirect URI trong TikTok Developer      ║
║        Dashboard: http://localhost:${PORT}/callback         ║
║                                                            ║
║  🚀 Mở trình duyệt và truy cập URL trên để bắt đầu!      ║
╚════════════════════════════════════════════════════════════╝
  `);
});

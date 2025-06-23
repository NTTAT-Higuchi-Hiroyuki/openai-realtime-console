import express from "express";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.OPENAI_API_KEY;

// セキュリティ: APIキーの存在確認
if (!apiKey) {
  console.error('❌ OPENAI_API_KEY is required. Please set it in your environment variables.');
  console.error('💡 Create a .env file with: OPENAI_API_KEY=your_api_key_here');
  process.exit(1);
}

// セキュリティミドルウェアの設定
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      connectSrc: ["'self'", "https://api.openai.com", "wss://api.openai.com"],
      imgSrc: ["'self'", "data:"],
    },
  },
}));

// CORS設定
app.use(cors({
  origin: process.env.CLIENT_URL || ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// レート制限設定
const tokenRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 10, // 15分間に最大10リクエスト
  message: {
    error: 'Too many token requests from this IP, please try again after 15 minutes.',
    retryAfter: 15 * 60,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 一般的なレート制限
const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 100, // 15分間に最大100リクエスト
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(generalRateLimit);

// Configure Vite middleware for React client
const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: "custom",
});
app.use(vite.middlewares);

// API route for token generation
app.get("/token", tokenRateLimit, async (req, res) => {
  try {
    const response = await fetch(
      "https://api.openai.com/v1/realtime/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-realtime-preview-2024-12-17",
          voice: "verse",
        }),
      },
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Token generation error:", error);
    
    // エラーの詳細は本番環境では隠す
    const isDevelopment = process.env.NODE_ENV === 'development';
    const errorResponse = {
      error: "Failed to generate token",
      ...(isDevelopment && { details: error.message }),
    };
    
    res.status(500).json(errorResponse);
  }
});

// Render the React client
app.use("*", async (req, res, next) => {
  const url = req.originalUrl;

  try {
    const template = await vite.transformIndexHtml(
      url,
      fs.readFileSync("./client/index.html", "utf-8"),
    );
    const { render } = await vite.ssrLoadModule("./client/entry-server.jsx");
    const appHtml = await render(url);
    const html = template.replace(`<!--ssr-outlet-->`, appHtml?.html);
    res.status(200).set({ "Content-Type": "text/html" }).end(html);
  } catch (e) {
    vite.ssrFixStacktrace(e);
    next(e);
  }
});

app.listen(port, () => {
  console.log(`✅ Express server running on *:${port}`);
  console.log(`🔒 Security features enabled: CORS, Rate Limiting, Helmet`);
  console.log(`🔑 OpenAI API key: ${apiKey ? '✅ Configured' : '❌ Missing'}`);
});

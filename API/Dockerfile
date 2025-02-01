FROM debian:bookworm-slim AS base
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    gnupg \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

FROM base AS chrome
RUN curl -fsSL https://dl.google.com/linux/linux_signing_key.pub | \
    gpg --dearmor | tee /usr/share/keyrings/google-chrome.gpg > /dev/null && \
    echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-chrome.gpg] http://dl.google.com/linux/chrome/deb/ stable main" | \
    tee /etc/apt/sources.list.d/google-chrome.list

FROM chrome AS final
RUN apt-get update && apt-get install -y --no-install-recommends \
    google-chrome-stable \
    fonts-liberation \
    libappindicator3-1 \
    xdg-utils \
    libnss3 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpangocairo-1.0-0 \
    libgdk-pixbuf2.0-0 \
    libxshmfence1 \
    libgles2 \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/hello || exit 1

CMD ["npm", "start"]
# Scoring proxy: Node 20 + ffmpeg (converts Android audio to WAV). No npm packages needed.
FROM node:20-slim
RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY score-proxy.mjs ./
ENV PORT=8787
EXPOSE 8787
USER node
CMD ["node", "score-proxy.mjs"]

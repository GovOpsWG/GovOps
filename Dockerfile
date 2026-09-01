# Build context is the repository root, not site/: the content pipeline reads the Markdown in
# docs/ at build time, and those files are the single source of truth for the site.

FROM node:24.19.0-alpine@sha256:2a49bdf71e9fd965a58c1703fd9ddd205b34e5782b692a72dd1d248abb0beb43 AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /workspace

FROM base AS dependencies

COPY site/package.json site/pnpm-lock.yaml site/pnpm-workspace.yaml site/.npmrc ./site/
COPY site/apps/web/package.json ./site/apps/web/package.json
COPY site/packages/content/package.json ./site/packages/content/package.json

RUN cd site && pnpm install --frozen-lockfile

FROM dependencies AS build

COPY docs ./docs
COPY site ./site

RUN cd site && pnpm typecheck && pnpm build

FROM base AS production-dependencies

COPY site/package.json site/pnpm-lock.yaml site/pnpm-workspace.yaml site/.npmrc ./site/
COPY site/apps/web/package.json ./site/apps/web/package.json
COPY site/packages/content/package.json ./site/packages/content/package.json

RUN cd site && pnpm --filter @govops/web... install --frozen-lockfile --prod

FROM node:24.19.0-alpine@sha256:2a49bdf71e9fd965a58c1703fd9ddd205b34e5782b692a72dd1d248abb0beb43 AS runtime

ENV NODE_ENV=production
ENV PORT=8080
ENV HOST=0.0.0.0

WORKDIR /workspace/site/apps/web

COPY --from=production-dependencies /workspace/site/node_modules /workspace/site/node_modules
COPY --from=production-dependencies /workspace/site/apps/web/node_modules ./node_modules
COPY --from=build /workspace/site/apps/web/build ./build
COPY --from=build /workspace/site/apps/web/server.js ./server.js
COPY --from=build /workspace/site/apps/web/security-headers.js ./security-headers.js

RUN chown -R node:node /workspace
USER node

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:8080/health').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "server.js"]

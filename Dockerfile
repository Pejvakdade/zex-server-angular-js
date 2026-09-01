# ######################################################################################################################
# ======================================================================================================================
# Deps -----------------------------------------------------------------------------------------------------------------
FROM oven/bun:1-alpine AS deps
WORKDIR /app
ENV BUN_CONFIG_REGISTRY=https://registry.npmjs.org
COPY package.json bun.lock bunfig.toml ./
RUN bun install --frozen-lockfile

# ######################################################################################################################
# ======================================================================================================================
# Builder --------------------------------------------------------------------------------------------------------------
# @note unlike Miveh's Next.js frontend this stage runs on node, not bun: the Angular CLI rejects
#       Bun's reported Node version. Bun is still the package manager (see the deps stage).
FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN ./node_modules/.bin/ng build --configuration production

# ######################################################################################################################
# ======================================================================================================================
# Runner ---------------------------------------------------------------------------------------------------------------
FROM nginx:1.27-alpine AS runner

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/ZexServer-angular/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

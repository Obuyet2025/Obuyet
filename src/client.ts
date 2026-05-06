import type { ShopifyClientConfig, ShopifyApiError } from "./types/index.js";

const DEFAULT_API_VERSION = "2024-10";
const DEFAULT_TIMEOUT = 30_000;
const DEFAULT_RETRY_LIMIT = 3;

function buildShopifyError(
  status: number,
  body: Record<string, unknown>
): ShopifyApiError {
  const err = new Error() as ShopifyApiError;
  err.status = status;
  err.errors = [];

  if (body.errors) {
    if (typeof body.errors === "string") {
      err.message = body.errors;
      err.errors = [{ message: body.errors }];
    } else if (typeof body.errors === "object") {
      const entries = Object.entries(body.errors as Record<string, unknown>);
      err.errors = entries.map(([field, messages]) => ({
        message: Array.isArray(messages) ? messages.join(", ") : String(messages),
        field: [field],
      }));
      err.message = err.errors.map((e) => e.message).join("; ");
    }
  } else {
    err.message = `Shopify API error: ${status}`;
    err.errors = [{ message: err.message, code: String(status) }];
  }

  return err;
}

export class ShopifyClient {
  private readonly baseUrl: string;
  private readonly headers: Record<string, string>;
  private readonly timeout: number;
  private readonly retryLimit: number;

  constructor(config: ShopifyClientConfig) {
    const shop = config.shop.replace(/^https?:\/\//, "").replace(/\/$/, "");
    const version = config.apiVersion ?? DEFAULT_API_VERSION;
    this.baseUrl = `https://${shop}/admin/api/${version}`;
    this.headers = {
      "X-Shopify-Access-Token": config.accessToken,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    this.timeout = config.timeout ?? DEFAULT_TIMEOUT;
    this.retryLimit = config.retryLimit ?? DEFAULT_RETRY_LIMIT;
  }

  async request<T>(
    method: string,
    path: string,
    options: { body?: unknown; params?: Record<string, unknown> } = {}
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`);

    if (options.params) {
      for (const [key, value] of Object.entries(options.params)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    let attempt = 0;

    while (attempt <= this.retryLimit) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeout);

      try {
        const res = await fetch(url.toString(), {
          method,
          headers: this.headers,
          body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timer);

        // Retry on 429 (rate limit) and 5xx
        if (res.status === 429 || (res.status >= 500 && attempt < this.retryLimit)) {
          const retryAfter = res.headers.get("Retry-After");
          const delay = retryAfter ? parseFloat(retryAfter) * 1000 : 2 ** attempt * 500;
          await sleep(delay);
          attempt++;
          continue;
        }

        if (!res.ok) {
          let body: Record<string, unknown> = {};
          try {
            body = (await res.json()) as Record<string, unknown>;
          } catch {
            // ignore parse errors
          }
          throw buildShopifyError(res.status, body);
        }

        if (res.status === 204) {
          return undefined as T;
        }

        return (await res.json()) as T;
      } catch (err) {
        clearTimeout(timer);
        if ((err as ShopifyApiError).status !== undefined) throw err;
        if (attempt >= this.retryLimit) throw err;
        await sleep(2 ** attempt * 500);
        attempt++;
      }
    }

    throw new Error("Exceeded retry limit");
  }

  get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    return this.request<T>("GET", path, { params });
  }

  post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("POST", path, { body });
  }

  put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("PUT", path, { body });
  }

  delete<T = void>(path: string): Promise<T> {
    return this.request<T>("DELETE", path);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export type FreshdeskTicket = {
  id: number;
  subject: string | null;
  description_text: string | null;
  description: string | null;
  status: number;
  priority: number;
  type: string | null;
  tags: string[] | null;
  requester_id: number | null;
  responder_id: number | null;
  created_at: string;
  updated_at: string;
  due_by: string | null;
};

export type FreshdeskContact = {
  id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  mobile: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
};

export type FreshdeskConversation = {
  id: number;
  body_text: string | null;
  body: string | null;
  incoming: boolean;
  private: boolean;
  user_id: number | null;
  support_email: string | null;
  created_at: string;
};

export type FreshdeskAgent = {
  id: number;
  contact?: { email?: string | null; name?: string | null };
  email?: string | null;
  type?: string | null;
  occasional?: boolean;
};

export class FreshdeskApiError extends Error {
  status: number;
  retryAfterMs: number | null;

  constructor(message: string, status: number, retryAfterMs: number | null = null) {
    super(message);
    this.name = "FreshdeskApiError";
    this.status = status;
    this.retryAfterMs = retryAfterMs;
  }
}

export function normalizeFreshdeskBaseUrl(input: string) {
  let value = input.trim().replace(/\/+$/, "");
  if (!value) throw new Error("Freshdesk URL is required");
  if (!/^https?:\/\//i.test(value)) value = `https://${value}`;
  const url = new URL(value);
  if (!url.hostname.includes(".")) {
    throw new Error("Freshdesk URL must look like https://yourcompany.freshdesk.com");
  }
  return `${url.protocol}//${url.host}`;
}

/** Strip copy/paste noise so we send the raw API key as Basic username. */
export function normalizeFreshdeskApiKey(input: string) {
  let value = input.trim().replace(/^\uFEFF/, "").replace(/\r/g, "");
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1).trim();
  }
  if (/^basic\s+/i.test(value)) {
    value = value.replace(/^basic\s+/i, "").trim();
  }
  if (value.endsWith(":X") || value.endsWith(":x")) {
    value = value.slice(0, -2).trim();
  }
  return value;
}

function authHeader(apiKey: string) {
  const token = Buffer.from(`${apiKey}:X`, "utf8").toString("base64");
  return `Basic ${token}`;
}

function isFreshdeskApiHost(hostname: string) {
  const host = hostname.toLowerCase();
  return (
    host.endsWith(".freshdesk.com") ||
    host === "freshdesk.com" ||
    host.endsWith(".freshworks.com")
  );
}

function isSafeApiRedirect(from: URL, to: URL) {
  if (to.protocol !== "https:" && to.protocol !== "http:") return false;
  if (to.origin === from.origin) return true;
  if (isFreshdeskApiHost(to.hostname)) return true;
  // Custom helpdesk domains (support.example.com) still serve /api/v2/*.
  return to.pathname.includes("/api/v2/");
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseRetryAfter(header: string | null) {
  if (!header) return null;
  const asNumber = Number(header);
  if (Number.isFinite(asNumber) && asNumber >= 0) return Math.ceil(asNumber * 1000);
  const asDate = Date.parse(header);
  if (Number.isFinite(asDate)) return Math.max(0, asDate - Date.now());
  return null;
}

export type FreshdeskClientOptions = {
  /** Minimum delay between successful API calls (default 100ms). */
  minIntervalMs?: number;
};

export class FreshdeskClient {
  private lastCallAt = 0;
  private readonly minIntervalMs: number;
  private baseUrl: string;

  constructor(
    baseUrl: string,
    private readonly apiKey: string,
    options: FreshdeskClientOptions = {},
  ) {
    this.baseUrl = baseUrl;
    this.minIntervalMs = options.minIntervalMs ?? 100;
  }

  private async throttle() {
    const elapsed = Date.now() - this.lastCallAt;
    if (elapsed < this.minIntervalMs) {
      await sleep(this.minIntervalMs - elapsed);
    }
  }

  /**
   * Follow redirects ourselves. Node `fetch` strips Authorization on a
   * cross-origin hop, and Freshdesk often 301s *.freshdesk.com → a custom domain,
   * which then 401s as invalid_credentials.
   */
  private async fetchWithAuth(url: string, init: RequestInit | undefined, hops = 0): Promise<Response> {
    if (hops > 6) {
      throw new FreshdeskApiError(`Freshdesk redirected too many times (${url})`, 0);
    }

    const headers = new Headers(init?.headers);
    headers.set("Authorization", authHeader(this.apiKey));
    headers.set("Accept", "application/json");
    const method = (init?.method ?? "GET").toUpperCase();
    if (method !== "GET" && method !== "HEAD" && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    const response = await fetch(url, {
      ...init,
      method,
      headers,
      redirect: "manual",
      cache: "no-store",
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      await response.arrayBuffer().catch(() => undefined);
      if (!location) {
        throw new FreshdeskApiError(`Freshdesk ${response.status} redirect with no Location`, response.status);
      }
      const next = new URL(location, url);
      const from = new URL(url);
      if (!isSafeApiRedirect(from, next)) {
        throw new FreshdeskApiError(
          `Freshdesk redirected to unexpected URL ${next.origin}${next.pathname}. Use the hostname shown in Freshdesk (often yourcompany.freshdesk.com).`,
          response.status,
        );
      }
      if (next.origin !== from.origin) {
        this.baseUrl = `${next.protocol}//${next.host}`;
      }
      return this.fetchWithAuth(next.toString(), init, hops + 1);
    }

    return response;
  }

  async request<T>(path: string, init?: RequestInit, attempt = 1): Promise<T> {
    await this.throttle();
    this.lastCallAt = Date.now();

    const response = await this.fetchWithAuth(`${this.baseUrl}${path}`, init);

    const remaining = Number(response.headers.get("x-ratelimit-remaining") ?? "NaN");
    if (Number.isFinite(remaining) && remaining <= 0) {
      await sleep(1000);
    }

    if (response.status === 429) {
      const retryAfterMs = parseRetryAfter(response.headers.get("retry-after")) ?? attempt * 2000;
      if (attempt >= 8) {
        throw new FreshdeskApiError(
          `Freshdesk rate limit exceeded after ${attempt} retries`,
          429,
          retryAfterMs,
        );
      }
      await sleep(Math.min(retryAfterMs + 250, 60_000));
      return this.request<T>(path, init, attempt + 1);
    }

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      if (response.status === 401) {
        throw new FreshdeskApiError(
          `Freshdesk 401 at ${this.baseUrl}${path} (API key length ${this.apiKey.length}). Check FRESHDESK_API_KEY in .env.`,
          401,
        );
      }
      throw new FreshdeskApiError(
        `Freshdesk ${response.status}: ${text.slice(0, 300) || response.statusText}`,
        response.status,
      );
    }

    if (response.status === 204) return undefined as T;
    return (await response.json()) as T;
  }

  async verify() {
    await this.request<unknown>("/api/v2/tickets?per_page=1&page=1");
  }

  listContacts(page: number, perPage = 100) {
    return this.request<FreshdeskContact[]>(
      `/api/v2/contacts?per_page=${perPage}&page=${page}`,
    );
  }

  listTickets(page: number, perPage = 100, updatedSince = "2010-01-01T00:00:00Z") {
    const since = encodeURIComponent(updatedSince);
    return this.request<FreshdeskTicket[]>(
      `/api/v2/tickets?per_page=${perPage}&page=${page}&order_by=created_at&order_type=asc&updated_since=${since}`,
    );
  }

  getTicket(id: number) {
    return this.request<FreshdeskTicket>(`/api/v2/tickets/${id}`);
  }

  listConversations(ticketId: number, page = 1, perPage = 100) {
    return this.request<FreshdeskConversation[]>(
      `/api/v2/tickets/${ticketId}/conversations?per_page=${perPage}&page=${page}`,
    );
  }

  listAgents(page = 1, perPage = 100) {
    return this.request<FreshdeskAgent[]>(`/api/v2/agents?per_page=${perPage}&page=${page}`);
  }

  getContact(id: number) {
    return this.request<FreshdeskContact>(`/api/v2/contacts/${id}`);
  }
}

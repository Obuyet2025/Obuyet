import { describe, it, expect, vi, beforeEach } from "vitest";
import { ShopifyClient } from "../src/client.js";
import { ThemesResource } from "../src/resources/themes.js";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

function ok(body: unknown) {
  return { ok: true, status: 200, headers: new Headers(), json: async () => body };
}

describe("ThemesResource", () => {
  let themes: ThemesResource;

  beforeEach(() => {
    const client = new ShopifyClient({ shop: "test.myshopify.com", accessToken: "t", retryLimit: 0 });
    themes = new ThemesResource(client);
    mockFetch.mockReset();
  });

  it("list returns themes", async () => {
    const fixture = [
      { id: 1, name: "Dawn", role: "main" },
      { id: 2, name: "Craft", role: "unpublished" },
    ];
    mockFetch.mockResolvedValueOnce(ok({ themes: fixture }));

    const result = await themes.list();
    expect(result).toHaveLength(2);
  });

  it("getActive returns the main theme", async () => {
    mockFetch.mockResolvedValueOnce(ok({
      themes: [
        { id: 1, name: "Dawn", role: "main" },
        { id: 2, name: "Craft", role: "unpublished" },
      ],
    }));

    const active = await themes.getActive();
    expect(active?.name).toBe("Dawn");
  });

  it("publish calls update with role=main", async () => {
    const fixture = { id: 2, name: "Craft", role: "main" };
    mockFetch.mockResolvedValueOnce(ok({ theme: fixture }));

    const result = await themes.publish(2);
    expect(result.role).toBe("main");

    const [, init] = mockFetch.mock.calls[0];
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body.theme.role).toBe("main");
  });

  it("upsertAsset sends PUT to assets endpoint", async () => {
    const fixture = { key: "templates/index.liquid", value: "{{ content_for_layout }}" };
    mockFetch.mockResolvedValueOnce(ok({ asset: fixture }));

    await themes.upsertAsset(1, { key: "templates/index.liquid", value: "{{ content_for_layout }}" });

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toContain("/themes/1/assets.json");
    expect((init as RequestInit).method).toBe("PUT");
  });
});

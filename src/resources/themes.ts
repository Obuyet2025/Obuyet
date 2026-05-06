import type { ShopifyClient } from "../client.js";
import type {
  Theme,
  ThemeAsset,
  CreateThemeInput,
  UpdateThemeInput,
  UpsertThemeAssetInput,
} from "../types/index.js";

export class ThemesResource {
  constructor(private readonly client: ShopifyClient) {}

  async list(): Promise<Theme[]> {
    const res = await this.client.get<{ themes: Theme[] }>("/themes.json");
    return res.themes;
  }

  async get(id: number): Promise<Theme> {
    const res = await this.client.get<{ theme: Theme }>(`/themes/${id}.json`);
    return res.theme;
  }

  async getActive(): Promise<Theme | undefined> {
    const themes = await this.list();
    return themes.find((t) => t.role === "main");
  }

  async create(input: CreateThemeInput): Promise<Theme> {
    const res = await this.client.post<{ theme: Theme }>("/themes.json", {
      theme: input,
    });
    return res.theme;
  }

  async update(id: number, input: UpdateThemeInput): Promise<Theme> {
    const res = await this.client.put<{ theme: Theme }>(`/themes/${id}.json`, {
      theme: input,
    });
    return res.theme;
  }

  async publish(id: number): Promise<Theme> {
    return this.update(id, { role: "main" });
  }

  async delete(id: number): Promise<void> {
    await this.client.delete(`/themes/${id}.json`);
  }

  // --- Assets ---

  async listAssets(themeId: number): Promise<ThemeAsset[]> {
    const res = await this.client.get<{ assets: ThemeAsset[] }>(
      `/themes/${themeId}/assets.json`
    );
    return res.assets;
  }

  async getAsset(themeId: number, key: string): Promise<ThemeAsset> {
    const res = await this.client.get<{ asset: ThemeAsset }>(
      `/themes/${themeId}/assets.json`,
      { "asset[key]": key }
    );
    return res.asset;
  }

  async upsertAsset(themeId: number, asset: UpsertThemeAssetInput): Promise<ThemeAsset> {
    const res = await this.client.put<{ asset: ThemeAsset }>(
      `/themes/${themeId}/assets.json`,
      { asset }
    );
    return res.asset;
  }

  async deleteAsset(themeId: number, key: string): Promise<void> {
    await this.client.request("DELETE", `/themes/${themeId}/assets.json`, {
      params: { "asset[key]": key },
    });
  }

  async copyAsset(themeId: number, sourceKey: string, destKey: string): Promise<ThemeAsset> {
    return this.upsertAsset(themeId, { key: destKey, source_key: sourceKey });
  }
}

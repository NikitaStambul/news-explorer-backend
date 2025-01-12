import { Article } from "#types/newsapi";
import { NEWS_API_KEY, NEWS_API_URL } from "#utils/config";

class NewsApi {
  private static shared: NewsApi;
  private _APIkey: string = NEWS_API_KEY;
  private _baseUrl: string = NEWS_API_URL;

  constructor() {
    if (NewsApi.shared) {
      return NewsApi.shared;
    }

    NewsApi.shared = this;
  }

  async getArticles(query: string = "apple"): Promise<Article[]> {
    const url = new URL(`${this._baseUrl}/everything`);
    url.searchParams.set("apiKey", this._APIkey);
    url.searchParams.set("sortBy", "relevancy");
    url.searchParams.set("q", query);

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 7);
    const fromDateFormatted = fromDate.toISOString().split("T")[0];
    url.searchParams.set("from", fromDateFormatted);

    const response = await this._request<{ articles: Article[] }>(
      url.toString()
    );

    return response.articles;
  }

  private async _request<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, options);

    return this._checkResponse<T>(response);
  }

  private _checkResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
      return Promise.reject(new Error(`Error: ${res.status}`));
    }

    return res.json();
  }
}

export default new NewsApi();

class StoreService {
  constructor() {
    this.api = "https://fakestoreapi.com";
  }

  async fetchData(url) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Request was not successful.");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("An error occurred while making the request:", error);
      return [];
    }
  }

  async getProducts(dataLimit = 3) {
    const url = `${this.api}/products?limit=${dataLimit}`;
    return await this.fetchData(url);
  }

  async getUser(userId) {
    const url = `${this.api}/users/${userId}`;
    return await this.fetchData(url);
  }

  async getCategories() {
    const url = `${this.api}/products/categories`;
    return await this.fetchData(url);
  }
}

export default StoreService;

  
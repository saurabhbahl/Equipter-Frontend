// import { SfTargetUrl } from "./useEnv";

// export class ApiService {
//     private baseUrl: string;

//     constructor(baseUrl: string = SfTargetUrl) {
//       this.baseUrl = baseUrl;
//     }

//     async get(endpoint: string) {
//       const response = await fetch(`${this.baseUrl}${endpoint}`);
//       return this.handleResponse(response);
//     }

//     async post(endpoint: string, data: any) {
//       const response = await fetch(`${this.baseUrl}${endpoint}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//       });
//       return this.handleResponse(response);
//     }

//     async put(endpoint: string, data: any) {
//       const response = await fetch(`${this.baseUrl}${endpoint}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//       });
//       return this.handleResponse(response);
//     }

//     async delete(endpoint: string) {
//       const response = await fetch(`${this.baseUrl}${endpoint}`, {
//         method: 'DELETE'
//       });
//       return this.handleResponse(response);
//     }

//     private async handleResponse(response: Response) {
//       if (!response.ok) {
//         const error = await response.text();
//         throw new Error(error || response.statusText);
//       }
//       return response.json();
//     }
//   }

import { SfAccessToken, SfTargetUrl } from "./useEnv";

export class ApiService {
  private baseUrl: string;
  private accessToken: string;

  constructor(baseUrl: string = SfTargetUrl,accessToken: string =SfAccessToken) 
  {
    this.baseUrl = baseUrl;this.accessToken = accessToken;
  }

  async get(endpoint: string) {
    console.log(endpoint)
    const response = await fetch(`${endpoint}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return this.handleResponse(response);
  }

  async post(endpoint: string, data: any) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async put(endpoint: string, data: any) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async delete(endpoint: string) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
    return this.handleResponse(response);
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || response.statusText);
    }
    return response.json();
  }
}

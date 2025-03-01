import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  
  private API_URL = 'http://192.168.96.189:7000/get-employee';

  constructor(private http: HttpClient) {}

  async getResponse(question: string): Promise<string> {
    try {
      const response: any = await firstValueFrom(this.http.post(this.API_URL, { question }));
      return response.data.map((item: any) => item.name).join(', ') || "No response";
    } catch (error) {
      console.error("API Error:", error);
      return "API error";
    }
  }
}

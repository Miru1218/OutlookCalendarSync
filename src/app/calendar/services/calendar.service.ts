import { Injectable } from '@angular/core';
import { Client } from '@microsoft/microsoft-graph-client';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  // 用於存儲原始的行事曆事件數據
  rawCalendarEvents: any[] = [];
  // Microsoft Graph API 的訪問令牌
  private token = "Microsoft Graph API";

  constructor() { }

  // 獲取日曆事件列表
  getCalendarEvents(): Promise<any[]> {
    // 初始化 Microsoft Graph API 客戶端
    const graphClient = Client.init({
      authProvider: (done) => {
        done(null, this.token);
      }
    });

    return graphClient
      .api('/me/events')
      .header('Prefer', `outlook.timezone="Asia/Taipei"`)// 請求設定使用亞洲/台北時區
      .get()
      .then((response) => {
        // 將原始行事曆事件數據存儲並轉換為應用所需的格式
        this.rawCalendarEvents = response.value
        return response.value.map((event: any) => ({
          id: event.id,
          title: event.subject,
          start: event.start.dateTime,
          end: event.end.dateTime,
          body: event.bodyPreview
        }));
      })
      .catch((error) => {
        console.error('Error fetching calendar events:', error);
        return [];
      });
  }
  // 更新指定 ID 的日曆事件

  async updateCalendarEvent(id: string, eventData: any): Promise<void> {
    // 初始化 Microsoft Graph API 客戶端
    const graphClient = Client.init({
      authProvider: (done) => {
        done(null, this.token);
      }
    });

    try {
      // 使用 Microsoft Graph API 更新日曆事件

      await graphClient
        .api(`/me/events/${id}`)
        .update(eventData);
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw error;
    }
  }
  // 獲取 Microsoft Graph API 的訪問令牌
  getToken() {
    return this.token;
  }

}

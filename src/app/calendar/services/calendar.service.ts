import { Injectable } from '@angular/core';
import { Client } from '@microsoft/microsoft-graph-client';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  // 用於存儲原始的行事曆事件數據
  rawCalendarEvents: any[] = [];
  // Microsoft Graph API 的訪問令牌
  private token = "eyJ0eXAiOiJKV1QiLCJub25jZSI6IjFJWVY3ZnE4WTdFTlJtUkIzWVc3T1M2MnExSmtpYUFJWVRqVGl6TkMzX1UiLCJhbGciOiJSUzI1NiIsIng1dCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCIsImtpZCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9lNzJmNmRlMC1lYTExLTQ5NTktYTcwZS0xMzZhYWNkM2NmNGYvIiwiaWF0IjoxNzE1NjQ1NTgzLCJuYmYiOjE3MTU2NDU1ODMsImV4cCI6MTcxNTczMjI4MywiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhXQUFBQXRXOVh2QmdkRUgycDdjdEVYVmhXTEdLcDllZTBBSm83WDlLU0JTYjIyb0c3OWZuKysxS2V4a0hxY0FKMnNXU0k2ZXQxVElENG1RbnB6VEtkamF4c1JCeWxKMjV0VGJRSzBuYkRhYkVhM05zPSIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwX2Rpc3BsYXluYW1lIjoiR3JhcGggRXhwbG9yZXIiLCJhcHBpZCI6ImRlOGJjOGI1LWQ5ZjktNDhiMS1hOGFkLWI3NDhkYTcyNTA2NCIsImFwcGlkYWNyIjoiMCIsImZhbWlseV9uYW1lIjoi6JSh5rOT5ZOyIiwiZ2l2ZW5fbmFtZSI6IuiUoeazk-WTsiIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjExOC4xNjMuNzUuMjM1IiwibmFtZSI6IktldmluIFRzYWkt6JSh5rOT5ZOyLeeyvuiqoC3ou5_pq5TmnI3li5nkuovmpa3omZUiLCJvaWQiOiJhYTBiN2U1ZS05NjIwLTRmODItYWQyMi1jMWVkMTI5MmQxYWMiLCJvbnByZW1fc2lkIjoiUy0xLTUtMjEtMTg0MDgzNjIwLTY4MTcxMDQ2MC0zNzg4OTEyNjQ2LTEzNjQ3MSIsInBsYXRmIjoiMyIsInB1aWQiOiIxMDAzMjAwMzVENTc1MDBCIiwicmgiOiIwLkFVa0E0RzB2NXhIcVdVbW5EaE5xck5QUFR3TUFBQUFBQUFBQXdBQUFBQUFBQUFCSkFBSS4iLCJzY3AiOiJDYWxlbmRhcnMuUmVhZFdyaXRlIENvbnRhY3RzLlJlYWRXcml0ZSBEZXZpY2VNYW5hZ2VtZW50QXBwcy5SZWFkV3JpdGUuQWxsIERldmljZU1hbmFnZW1lbnRDb25maWd1cmF0aW9uLlJlYWQuQWxsIERldmljZU1hbmFnZW1lbnRDb25maWd1cmF0aW9uLlJlYWRXcml0ZS5BbGwgRGV2aWNlTWFuYWdlbWVudE1hbmFnZWREZXZpY2VzLlByaXZpbGVnZWRPcGVyYXRpb25zLkFsbCBEZXZpY2VNYW5hZ2VtZW50TWFuYWdlZERldmljZXMuUmVhZC5BbGwgRGV2aWNlTWFuYWdlbWVudE1hbmFnZWREZXZpY2VzLlJlYWRXcml0ZS5BbGwgRGV2aWNlTWFuYWdlbWVudFJCQUMuUmVhZC5BbGwgRGV2aWNlTWFuYWdlbWVudFJCQUMuUmVhZFdyaXRlLkFsbCBEZXZpY2VNYW5hZ2VtZW50U2VydmljZUNvbmZpZy5SZWFkLkFsbCBEZXZpY2VNYW5hZ2VtZW50U2VydmljZUNvbmZpZy5SZWFkV3JpdGUuQWxsIERpcmVjdG9yeS5BY2Nlc3NBc1VzZXIuQWxsIERpcmVjdG9yeS5SZWFkLkFsbCBEaXJlY3RvcnkuUmVhZFdyaXRlLkFsbCBGaWxlcy5SZWFkV3JpdGUuQWxsIEdyb3VwLlJlYWRXcml0ZS5BbGwgSWRlbnRpdHlSaXNrRXZlbnQuUmVhZC5BbGwgTWFpbC5SZWFkV3JpdGUgTWFpbGJveFNldHRpbmdzLlJlYWRXcml0ZSBOb3Rlcy5SZWFkV3JpdGUuQWxsIG9wZW5pZCBQZW9wbGUuUmVhZCBwcm9maWxlIFJlcG9ydHMuUmVhZC5BbGwgU2VjdXJpdHlFdmVudHMuUmVhZFdyaXRlLkFsbCBTaXRlcy5SZWFkV3JpdGUuQWxsIFRhc2tzLlJlYWRXcml0ZSBVc2VyLlJlYWQgVXNlci5SZWFkQmFzaWMuQWxsIFVzZXIuUmVhZFdyaXRlIFVzZXIuUmVhZFdyaXRlLkFsbCBlbWFpbCIsInNpZ25pbl9zdGF0ZSI6WyJrbXNpIl0sInN1YiI6Ingtc3lPLU9BTmNXZ19qbGVoaUs4OHBwYUc1ekpiQXU0d2RmckVPcVBtOWciLCJ0ZW5hbnRfcmVnaW9uX3Njb3BlIjoiQVMiLCJ0aWQiOiJlNzJmNmRlMC1lYTExLTQ5NTktYTcwZS0xMzZhYWNkM2NmNGYiLCJ1bmlxdWVfbmFtZSI6IjI0MDAxNzJAc3lzdGV4LmNvbS50dyIsInVwbiI6IjI0MDAxNzJAc3lzdGV4LmNvbS50dyIsInV0aSI6ImlKT3c0dTc5aTAyeDh0VURBX0FTQUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfY2MiOlsiQ1AxIl0sInhtc19zc20iOiIxIiwieG1zX3N0Ijp7InN1YiI6ImFkMjNPNGcwWk5FU1p5NjFrWUZQU3VqbmxwVENibm9UbmZySnNLZWZvMjAifSwieG1zX3RjZHQiOjEzMjI4MTUxNDV9.eaJZ-hrwQ9_Nviy58U5X0ZUG4f-CoyKUxE3at9QRb5WnetEUACGoXCFB94z9HWa-Mca8SucqWl7W2t46hQC0C_ojLWXzn7p5IhMfUxBa9bR7-SGC6fI4wDOxMkoV2PwUJtAr3i4nzsASOEw-wpXz918AQBHF4ZxZZHfS8ICUD-h1Agzd0_zMOvIeQwbhmtdYIq9eeG5LA5tdbvAin-sysa62ZgAtv9uzca69o0UTN5v4HLRuotfdqTZIUQrLTpcE7Gpjm_tmTf9LGehvPQEQV7LjjXH2srSGsyXsREOYpMW_ONm11glF6exDbWo2COIfjIq6GkMWDzdjztYtpjVjGw";

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

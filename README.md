# FullCalendar 連接 Outlook
## 簡介
本項目旨在使用 FullCalendar 和 Microsoft Graph API 將日曆應用程序與 Outlook 整合，以便使用者可以查看、創建、編輯和刪除 Outlook 日曆事件。
## 環境設置
1.  確保已設置好 Angular 16 開發環境。
2.  前往 [Microsoft 開發人員門戶](https://developer.microsoft.com/en-us/graph/graph-explorer)，註冊並創獲取Access token。
3. 安裝Microsoft 插件
`npm install msal`
`npm install @microsoft/microsoft-graph-client`
4.  安裝 FullCalendar 插件。
`npm install @fullcalendar/angular @fullcalendar/core @fullcalendar/daygrid @fullcalendar/interaction @fullcalendar/list @fullcalendar/multimonth @fullcalendar/timegrid`
5.  安裝PrimeNG插件。
`npm install --save primeng@16`
如果無法順利安裝注意幾個原因可能是 Angular 版本問題，需要將 Angular 版本升級到 16 版以上。
`ng update @angular/core@16 @angular/cli@16 --force`
## 步驟

1.  **認證與授權**
    
    使用 Microsoft Graph API 需要進行 OAuth 認證。在 Angular 應用程式中，通常在服務中處理認證和授權。請參考 Microsoft Graph API 文檔以了解如何使用 OAuth 進行認證。
    
2.  **獲取日曆事件**
    
    通過調用 Microsoft Graph API，您可以獲取 Outlook 中的日曆事件。使用 `HttpClient` 或相應的庫發送 GET 請求到 `https://graph.microsoft.com/v1.0/me/events`。
    
3.  **顯示日曆**
    
    使用 FullCalendar 將獲取的日曆事件顯示在您的 Angular 應用程式中。設置 FullCalendar 的選項以符合您的需求，例如事件顯示格式、時間範圍等。
    
4.  **創建、編輯和刪除事件**
    
    -   創建事件：通過 FullCalendar 提供的界面創建新事件。將新事件數據發送到 Microsoft Graph API 的 `POST /me/events` 端點以創建新事件。
    -   編輯事件：使用 FullCalendar 提供的界面編輯現有事件。將編輯後的事件數據發送到 Microsoft Graph API 的 `PATCH /me/events/{id}` 端點以更新事件。
    -   刪除事件：使用 FullCalendar 提供的界面刪除現有事件。發送 DELETE 請求到 Microsoft Graph API 的 `DELETE /me/events/{id}` 端點以刪除事件。

## 注意事項

-   請確保對 Microsoft Graph API 的調用具有適當的權限和範圍。
-   考慮到 OAuth 的安全性，儲存和管理用於認證的憑證應遵循最佳實踐。
-   請妥善處理可能的錯誤和異常情況，例如 API 請求失敗、用戶授權被拒絕等。

## 參考資源

-   [Microsoft Graph API 文檔](https://docs.microsoft.com/zh-tw/graph/)
-   [FullCalendar 官方文檔](https://fullcalendar.io/docs)
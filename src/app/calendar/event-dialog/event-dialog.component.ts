import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CalendarService } from '../services/calendar.service';
@Component({
  selector: 'app-event-dialog',
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.css']
})
export class EventDialogComponent {
  selectedDate: Date | undefined;
  formGroup: FormGroup;

  event = {
    subject: '',
    startTime: new Date(), // 添加 startTime
    endTime: new Date(), // 添加 endTime
    start: {
      dateTime: '',
      timeZone: 'Asia/Taipei' // 請根據您的時區調整
    },
    end: {
      dateTime: '',
      timeZone: 'Asia/Taipei' // 請根據您的時區調整
    },
    body: {
      contentType: 'text',
      content: ''
    },
    description: '' // 添加 description 屬性
  };

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private http: HttpClient, private datePipe: DatePipe, private formBuilder: FormBuilder, private calendarService: CalendarService) {
    this.selectedDate = this.config.data.event;//儲存從對話框配置中傳遞過來的選擇日期的
    this.formGroup = this.formBuilder.group({
      subject: [this.config.data?.event?.title],
      start: [this.config.data?.event?.start?.slice(0, -4)], // 添加 ?. 避免 undefined
      end: [this.config.data?.event?.end?.slice(0, -4)], // 添加 ?. 避免 undefined
      body: [this.config.data?.event?.body],
    });
  }

  // onSaveEvent()：保存事件到 Outlook 日曆，並且針對成功和失敗的情況給出了相應的處理
  onSaveEvent(): void {
    // 從Service獲取Token
    const token = this.calendarService.getToken();

    // DatePipe是用來格式化日期時間的 Angular 內建的管道之一，將 startTime 和 endTime 轉換為 ISO 8601 格式的日期時間字符串
    this.event.start.dateTime = this.datePipe.transform(this.event.startTime, 'yyyy-MM-ddTHH:mm:ss') ?? '';
    this.event.end.dateTime = this.datePipe.transform(this.event.endTime, 'yyyy-MM-ddTHH:mm:ss') ?? '';

    // newEventData：保存事件所需的所有資料，包括主題、開始時間、結束時間和描述
    const newEventData = {
      subject: this.event.subject,// 事件主題
      start: this.event.start,// 事件開始時間
      end: this.event.end, // 事件結束時間
      body: {
        contentType: 'text',
        content: this.event.description// 事件描述
      }
    };

    // 設置 HTTP 請求的標頭，包括授權憑證
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,// 添加身份驗證憑證
      'Content-Type': 'application/json'// 指定請求的內容類型為 JSON
    });
    // 發送請求保存事件到 Outlook 日歷
    this.http.post('https://graph.microsoft.com/v1.0/me/events', newEventData, { headers }).subscribe({
      next: (response) => {
        console.log('Event saved successfully:', response);
        // 可以關閉對話框或者執行其他操作
        this.ref.close();
      },
      error: (error) => {
        console.error('Error saving event:', error);
        // 可以提示用戶保存失敗
      }
    });

  }
  // 編輯事件
  onEditEvent() {
    // 關閉對話框，並返回編輯後的事件數據
    this.ref.close({
      event: {
        subject: this.formGroup.get('subject')?.value,
        start: { dateTime: this.formGroup.get('start')?.value, timeZone: 'Asia/Taipei' },
        end: { dateTime: this.formGroup.get('end')?.value, timeZone: 'Asia/Taipei' },
        body: { content: this.formGroup.get('body')?.value, contentType: "html" },
      }
    });
  }

  // 刪除行程事件
  onDeleteEvent() {
    // 從Service獲取Token
    const token = this.calendarService.getToken();

    // 獲取要刪除的行程事件的唯一標識符 (ID)
    const eventId = this.config.data.event.id;
    console.log(eventId);
    // 設置 HTTP 請求的標頭，包括授權憑證
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    // 發送刪除事件的 HTTP DELETE 請求到 Microsoft Graph API
    this.http.delete(`https://graph.microsoft.com/v1.0/me/events/${eventId}`, { headers }).subscribe({
      next: (response) => {
        console.log('Event deleted successfully:', response);

        // 可以關閉對話框或者執行其他操作
        this.ref.close();
      },
      error: (error) => {
        console.error('Error deleting event:', error);
        // 可以提示用戶刪除失敗
      }
    });

  }
}

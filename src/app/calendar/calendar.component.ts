import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { DialogService } from 'primeng/dynamicdialog';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { CalendarService } from './services/calendar.service';
import { EventDialogComponent } from './event-dialog/event-dialog.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  rawCalendarEvents: any[] = [];
  calendarEvents: any[] = [];// 存放從日曆獲取的事件
  dialogRef!: any;
  // 日曆選項設定
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth', // 設定初始視圖為月視圖
    locale: 'zh-tw',  // 設置語言為繁體中文
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin], // 包括插件
    dateClick: this.onHandleDateClick.bind(this), // 綁定事件處理函數
    // editable: true, // 啟用事件的拖拽和調整大小功能
    eventDrop: this.handleEventDrop.bind(this), // 綁定事件拖拽事件處理函數
    eventClick: this.handleEventClick.bind(this) // 綁定事件點擊的處理函數
  };

  constructor(private dialogService: DialogService, private calendarService: CalendarService) { }

  ngOnInit(): void {
    this.getCalendarEvents();// 在初始化時獲取日曆事件
  }
  // 從 Microsoft Graph API 獲取日曆事件
  async getCalendarEvents(): Promise<void> {
    try {
      this.calendarEvents = await this.calendarService.getCalendarEvents();
      this.rawCalendarEvents = [...this.calendarEvents];
    } catch (error) {
      console.error('Error fetching calendar events:', error);
    }
  }

  // 處理用戶點擊日期的事件
  onHandleDateClick(info: any): void {
    // 打開對話框
    this.openDialog();
  }
  // 新增對話框
  openDialog() {
    this.dialogService.open(EventDialogComponent, {
      width: "100vw",
      height: "100vh",
      data: {}
    }).onClose.subscribe(() => {
      this.getCalendarEvents();
    });

  }
  // 處理事件拖拽
  handleEventDrop(info: any) {
    // info.event contains the dropped event object
    // Implement logic to update the event in your data source (e.g., Microsoft Graph API)
    console.log('Event dropped:', info.event);
  }
  // eventClick 處理函數
  handleEventClick(info: any): void {
    // 在這裡處理事件點擊的操作，info 包含了被點擊的事件相關信息

    this.editDialog(info.event._def.publicId)
  }

  // 編輯
  async editDialog(id: any): Promise<void> {

    const index = this.rawCalendarEvents.findIndex(item => item.id === id);
    const event = this.rawCalendarEvents[index];

    const dialogRef = this.dialogService.open(EventDialogComponent, {
      width: '100vw',
      height: '100vh',
      data: { isEdit: true, id: id, event: event }
    });

    dialogRef.onClose.subscribe((data: any) => {
      if (data) {
        this.calendarService.updateCalendarEvent(id, data.event).then(() => { this.getCalendarEvents() });
      }
      this.getCalendarEvents();
    });
  }

}

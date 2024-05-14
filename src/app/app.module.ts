import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarComponent } from './calendar/calendar.component';
import { EventDialogComponent } from './calendar/event-dialog/event-dialog.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { DialogService } from 'primeng/dynamicdialog';
import { DatePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';



@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    EventDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FullCalendarModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    TabViewModule,
    ReactiveFormsModule,
  ],
  providers: [DialogService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }

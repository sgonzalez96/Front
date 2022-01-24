import { Component, OnInit } from '@angular/core';
import { alertData } from './data';

import { AlertColor } from './notification.model';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})

/**
 * Notification Component
 */
export class NotificationComponent implements OnInit {

  alertData: AlertColor[] = [];
  // bread crumb items
  breadCrumbItems!: Array<{}>;

  constructor() { }

  ngOnInit(): void {

    //BreadCrumb 
    this.breadCrumbItems = [
      { label: 'UI Elements' },
      { label: 'Notifications', active: true }
    ];

    /***
     * Data Get 
    */
    this._fetchData();
  }

  /***
   * Notification Data Get
   */
  private _fetchData() {
    this.alertData = alertData;
  }

  /***
   * Notification remove
   */
  close(alert: AlertColor, alertData: AlertColor[]) {
    alertData.splice(alertData.indexOf(alert), 1);
  }

}

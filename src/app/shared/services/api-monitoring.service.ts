import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MonitoringLogList } from '../models/monitoring-log-list.dto';
import { MonitoringEndpoint } from '../models/monitoring-endpoint.model';
import { LogsQuery } from '../models/logs-query.model';
import { Utils } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class ApiMonitoringService {
  private readonly http = inject(HttpClient);

  private apiUrl = '';
  private httpOptions!: { headers: HttpHeaders };

  public setEndpoint(endpoint: MonitoringEndpoint) {
    this.apiUrl = endpoint.url + '/monitoring';
    const headers = new HttpHeaders().set(endpoint.keyHeaderName, endpoint.key);
    this.httpOptions = { headers };
  }

  public getLogs(query: LogsQuery): Observable<MonitoringLogList> {
    const params = Utils.toHttpParams(query);
    const options = { ...this.httpOptions, params };
    return this.http.get<MonitoringLogList>(this.apiUrl + '/logs', options);
  }
}

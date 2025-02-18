import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MonitoringLogList } from '../models/monitoring-log-list.dto';
import { LogsQuery } from '../models/logs-query.model';
import { Utils } from './utils.service';
import { MonitoringEndpointService } from './monitoring-endpoint.service';

@Injectable({
  providedIn: 'root',
})
export class ApiMonitoringService {
  private http = inject(HttpClient);
  private monitoringEndpointService = inject(MonitoringEndpointService);

  private apiUrl = '';
  private httpOptions!: { headers: HttpHeaders };

  private setHttpData() {
    const endpoint = this.monitoringEndpointService.currentEndpoint();
    if (!endpoint) return;
    const headers = new HttpHeaders().set(endpoint.keyHeaderName, endpoint.key);
    this.httpOptions = { headers };
    this.apiUrl = endpoint.url + '/monitoring';
  }

  public getLogs(query: LogsQuery): Observable<MonitoringLogList> {
    this.setHttpData();
    const params = Utils.toHttpParams(query);
    const options = { ...this.httpOptions, params };
    return this.http.get<MonitoringLogList>(this.apiUrl + '/logs', options);
  }
}

import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MonitoringLogList } from '../models/monitoring-log-list.dto';
import { LogsQuery } from '../models/logs-query.model';
import { Utils } from './utils.service';
import { MonitoringEndpoint } from '../models/monitoring-endpoint.model';
import { MonitoringLogListFilters } from '../models/monitoring-log-list-filters.dto';
import { MonitoringGeneral } from '../models/monitoring-general.dto';

@Injectable({
  providedIn: 'root',
})
export class ApiMonitoringService {
  private http = inject(HttpClient);

  private apiUrl = '';
  private httpOptions!: { headers: HttpHeaders };

  public setEndpoint(endpoint: MonitoringEndpoint) {
    const headers = new HttpHeaders().set(endpoint.keyHeaderName, endpoint.key);
    this.httpOptions = { headers };
    this.apiUrl = endpoint.url + '/monitoring';
  }

  public getLogs(query: LogsQuery): Observable<MonitoringLogList> {
    const params = Utils.toHttpParams(query);
    const options = { ...this.httpOptions, params };
    return this.http.get<MonitoringLogList>(this.apiUrl + '/logs', options);
  }

  public getLogsFilters(): Observable<MonitoringLogListFilters> {
    return this.http.get<MonitoringLogListFilters>(
      this.apiUrl + '/logs-filters',
      this.httpOptions,
    );
  }

  public getGeneral(): Observable<MonitoringGeneral> {
    return this.http.get<MonitoringGeneral>(
      this.apiUrl + '/general',
      this.httpOptions,
    );
  }
}

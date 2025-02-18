import { HttpParams } from '@angular/common/http';

export class Utils {
  /**
   * Converts an object into HttpParams.
   *
   * @param query The object to be converted to HttpParams.
   * @returns HttpParams instance with the query parameters.
   */
  static toHttpParams(query: any): HttpParams {
    let params = new HttpParams();

    for (const key in query) {
      if (query.hasOwnProperty(key)) {
        const value = query[key];

        if (Array.isArray(value)) {
          value.forEach((val) => {
            params = params.append(key, val.toString());
          });
        } else if (value !== null && value !== undefined) {
          params = params.set(key, value.toString());
        }
      }
    }

    return params;
  }
}

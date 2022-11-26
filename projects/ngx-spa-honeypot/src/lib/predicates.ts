import { HttpHeaders } from '@angular/common/http';

export function hasHttpHeaders(object: any): object is { headers: HttpHeaders } {
  return object
    && typeof object === 'object'
    && 'headers' in object
    && object.headers instanceof HttpHeaders;
}

import { TestBed } from '@angular/core/testing';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
} from '@angular/common/http';
import { of } from 'rxjs';

import { httpInterceptorInterceptor } from './http.interceptor';
import { AuthService } from '../services/auth.service';

class FakeAuth {
  constructor(private token: string | null = 'abc') {}
  getToken(): string | null {
    return this.token;
  }
}

describe('httpInterceptorInterceptor', () => {
  function runInterceptor(req: HttpRequest<any>, next: HttpHandlerFn) {
    return TestBed.runInInjectionContext(() =>
      httpInterceptorInterceptor(req, next)
    );
  }

  beforeEach(() => {
    // default provide with token
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: new FakeAuth('abc') }],
    });
  });

  it('should be created', function () {
    const fn = runInterceptor;
    expect(fn).toBeTruthy();
  });

  it('adds Authorization header when token present', function () {
    const req = new HttpRequest('GET', '/');
    const next: HttpHandlerFn = (r: HttpRequest<any>) => {
      expect(r.headers.get('Authorization')).toBe('Bearer abc');
      return of({} as HttpEvent<any>);
    };

    runInterceptor(req, next).subscribe();
  });

  it('does not modify request when no token', function () {
    // reconfigure with no token
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: new FakeAuth(null) }],
    });

    const req = new HttpRequest('GET', '/');
    const next: HttpHandlerFn = (r: HttpRequest<any>) => {
      expect(r.headers.has('Authorization')).toBeFalsy();
      return of({} as HttpEvent<any>);
    };

    runInterceptor(req, next).subscribe();
  });
});

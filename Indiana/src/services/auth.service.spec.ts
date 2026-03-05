import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  it('should store token on login', () => {
    const dummyToken = 'header.payload.signature';
    service.login('user', 'pass').subscribe();
    const req = http.expectOne('/api/login');
    req.flush({ token: dummyToken });
    expect(localStorage.getItem('jwt_token')).toBe(dummyToken);
  });

  it('should compute logged in status based on exp', () => {
    // create token with exp field a few seconds in future
    const payload = { exp: Math.floor(Date.now() / 1000) + 10 };
    const b64 = btoa(JSON.stringify(payload));
    const token = `a.${b64}.c`;
    localStorage.setItem('jwt_token', token);
    expect(service.isLoggedIn()).toBeTruthy();
    // expired
    const payload2 = { exp: Math.floor(Date.now() / 1000) - 10 };
    const token2 = `a.${btoa(JSON.stringify(payload2))}.c`;
    localStorage.setItem('jwt_token', token2);
    expect(service.isLoggedIn()).toBeFalsy();
  });
});
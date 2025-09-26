import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { unAuthorizedGuard } from './un-authorized-guard';

describe('unAuthorizedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => unAuthorizedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

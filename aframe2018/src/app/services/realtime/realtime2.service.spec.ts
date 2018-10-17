import { TestBed, inject } from '@angular/core/testing';

import { Realtime2Service } from './realtime2.service';

describe('Realtime2Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Realtime2Service]
    });
  });

  it('should be created', inject([Realtime2Service], (service: Realtime2Service) => {
    expect(service).toBeTruthy();
  }));
});

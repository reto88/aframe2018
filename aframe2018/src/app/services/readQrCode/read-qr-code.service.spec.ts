import { TestBed, inject } from '@angular/core/testing';

import { ReadQrCodeService } from './read-qr-code.service';

describe('ReadQrCodeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReadQrCodeService]
    });
  });

  it('should be created', inject([ReadQrCodeService], (service: ReadQrCodeService) => {
    expect(service).toBeTruthy();
  }));
});

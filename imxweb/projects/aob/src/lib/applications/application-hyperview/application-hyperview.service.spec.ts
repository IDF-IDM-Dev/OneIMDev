/*
 * ONE IDENTITY LLC. PROPRIETARY INFORMATION
 *
 * This software is confidential.  One Identity, LLC. or one of its affiliates or
 * subsidiaries, has supplied this software to you under terms of a
 * license agreement, nondisclosure agreement or both.
 *
 * You may not copy, disclose, or use this software except in accordance with
 * those terms.
 *
 *
 * Copyright 2021 One Identity LLC.
 * ALL RIGHTS RESERVED.
 *
 * ONE IDENTITY LLC. MAKES NO REPRESENTATIONS OR
 * WARRANTIES ABOUT THE SUITABILITY OF THE SOFTWARE,
 * EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE IMPLIED WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE, OR
 * NON-INFRINGEMENT.  ONE IDENTITY LLC. SHALL NOT BE
 * LIABLE FOR ANY DAMAGES SUFFERED BY LICENSEE
 * AS A RESULT OF USING, MODIFYING OR DISTRIBUTING
 * THIS SOFTWARE OR ITS DERIVATIVES.
 *
 */

import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';

import { ApplicationHyperviewService } from './application-hyperview.service';
import { AppConfigService, ClassloggerService } from 'qbm';
import { QerApiService } from 'qer';

describe('HyperViewService', () => {

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AppConfigService,
          useValue: {}
        },
        {
          provide: ClassloggerService,
          useValue: {
            debug: jasmine.createSpy('debug').and.callThrough()
          }
        },
        {
          provide: QerApiService,
          useValue: {
            client: {
              portal_hyperview_get: jasmine.createSpy('portal_hyperview_get').and.callFake(() => Promise.resolve([1, 2, 3]))
            },
          }
        }
      ]
    });
  });

  it('fetches data', async () => {
    const service: ApplicationHyperviewService = TestBed.get(ApplicationHyperviewService);
    const data = await service.get('someUID');

    expect(data.length).toEqual(3);
  });
});

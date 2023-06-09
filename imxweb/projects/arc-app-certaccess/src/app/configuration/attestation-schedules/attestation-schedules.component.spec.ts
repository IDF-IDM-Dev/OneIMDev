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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HELPER_ALERT_KEY_PREFIX, StorageService } from 'qbm';
import { RequestsService } from '../requests.service';
import { RequestsConfigurationCommonMocks } from '../test/requests-configuration-mocks';
import { RequestsConfigurationTestBed } from '../test/requests-configuration-test-bed';
import { AttestationSchedulesComponent } from './attestation-schedules.component';

describe('AttestationSchedulesComponent', () => {
  let component: AttestationSchedulesComponent;
  let fixture: ComponentFixture<AttestationSchedulesComponent>;

  let viewAttestationScheduleSpy: jasmine.Spy;

  RequestsConfigurationTestBed.configureTestingModule({
    declarations: [ AttestationSchedulesComponent ],
    providers: [
      {
        provide: RequestsService,
        useValue: RequestsConfigurationCommonMocks.mockRequestsService
      },
      {
        provide: StorageService,
        useValue: RequestsConfigurationCommonMocks.mockStorageService
      },
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttestationSchedulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    viewAttestationScheduleSpy = spyOn<any>(component, 'viewAttestationSchedule');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit() tests', () => {
    it('should setup the displayedColumns', async () => {
      await component.ngOnInit();
      expect(component['displayedColumns'].length).toEqual(4);
      expect(component['displayedColumns'][0].ColumnName).toEqual('__Display');
      expect(component['displayedColumns'][1].ColumnName).toEqual('LastRun');
      expect(component['displayedColumns'][2].ColumnName).toEqual('NextRun');
      expect(component['displayedColumns'][3].ColumnName).toEqual('FrequencyType');
    });
  });

  it('should change navigation state', async () => {
    await component.onNavigationStateChanged(RequestsConfigurationCommonMocks.navigationState);
    expect(component.navigationState).toEqual(RequestsConfigurationCommonMocks.navigationState);
  });

  it('should search and reset start index ', async () => {
    await component.onSearch(RequestsConfigurationCommonMocks.keyword);
    expect(component.navigationState.StartIndex).toEqual(0);
  });

  it('should search for keyword ', async () => {
    await component.onSearch(RequestsConfigurationCommonMocks.keyword);
    expect(component.navigationState.search).toEqual(RequestsConfigurationCommonMocks.keyword);
  });

  describe('onAttestationScheduleSelected() tests', () => {
    it('should call `viewAttestationSchedule` with the selected attestation schedule', () => {
      component.onAttestationScheduleSelected(RequestsConfigurationCommonMocks.mockAttSchedule);
      expect(viewAttestationScheduleSpy).toHaveBeenCalledWith(RequestsConfigurationCommonMocks.mockAttSchedule);
    });
  });

  describe('onHelperDismissed() tests', () => {
    it('should make a call to store the dismissal of the helper alert', () => {
      RequestsConfigurationCommonMocks.mockStorageService.storeHelperAlertDismissal.calls.reset();

      expect(component.showHelperAlert).toEqual(true);
      component.onHelperDismissed();
      const expectedHelperKey = `${HELPER_ALERT_KEY_PREFIX}_attestationSchedules`;
      expect(RequestsConfigurationCommonMocks.mockStorageService.storeHelperAlertDismissal).toHaveBeenCalledWith(expectedHelperKey);
      expect(component.showHelperAlert).toEqual(false);
    });
  });
});

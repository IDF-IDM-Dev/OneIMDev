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

import { OverlayRef } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EuiLoadingService } from '@elemental-ui/core';

import { PendingItemsType, UserModelService } from 'qer';
import { AttestationFeatureGuardService } from '../attestation-feature-guard.service';

@Component({
  templateUrl: './dashboard-plugin.component.html'
})
export class DashboardPluginComponent implements OnInit {

  public pendingItems: PendingItemsType;
  public attEnabled: boolean;

  constructor(
    public readonly router: Router,
    private readonly busyService: EuiLoadingService,
    private readonly userModelSvc: UserModelService,
    private readonly attFeatureGuard: AttestationFeatureGuardService
  ) { }

  public async ngOnInit(): Promise<void> {

    let overlayRef: OverlayRef;
    setTimeout(() => overlayRef = this.busyService.show());

    try {
      this.pendingItems = await this.userModelSvc.getPendingItems();
      this.attEnabled = (await this.attFeatureGuard.getAttestationConfig()).IsAttestationEnabled;
    } finally {
      setTimeout(() => this.busyService.hide(overlayRef));
    }
  }
}

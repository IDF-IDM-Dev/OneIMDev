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

import { Component, ErrorHandler, OnInit } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { Router } from '@angular/router';
import { EuiLoadingService, EuiSidesheetService } from '@elemental-ui/core';
import { UserModelService } from '../../user/user-model.service';
import { OwnershipInformation, PortalPersonReports, PortalPersonReportsInteractive, ProjectConfig } from 'imx-api-qer';
import { QerApiService } from '../../qer-api-client.service';
import { ProjectConfigurationService } from '../../project-configuration/project-configuration.service';
import { IdentitySidesheetComponent } from '../../identities/identity-sidesheet/identity-sidesheet.component';
import { QerPermissionsService } from '../../admin/qer-permissions.service';

@Component({
  templateUrl: './businessowner-chartsummary.component.html',
  selector: 'imx-businessowner-chartsummary',
  styleUrls: ['./businessowner-chartsummary.component.scss']
})
export class BusinessOwnerChartSummaryComponent implements OnInit {
  public reports: PortalPersonReports[];
  public ownerships: OwnershipInformation[];
  public viewReady: boolean;

  private projectConfig: ProjectConfig;

  constructor(
    private readonly router: Router,
    private readonly qerClient: QerApiService,
    private readonly busyService: EuiLoadingService,
    private readonly sideSheet: EuiSidesheetService,
    private readonly errorHandler: ErrorHandler,
    private readonly configService: ProjectConfigurationService,
    private readonly userModelService: UserModelService,
    private readonly qerPermissions: QerPermissionsService
  ) { }

  public async ngOnInit(): Promise<void> {
    let overlayRef: OverlayRef;
    setTimeout(() => overlayRef = this.busyService.show());
    try {
      const userConfig = await this.userModelService.getUserConfig();
      this.ownerships = userConfig.Ownerships;

      this.projectConfig = await this.configService.getConfig();

      await this.loadDirectReports();

      this.viewReady = true;
    } finally {
      setTimeout(() => this.busyService.hide(overlayRef));
    }
  }

  public openIdentitiesOverview(): void {
    this.router.navigate(['resp', 'identities']);
  }

  public async openIdentitySidesheet(identity: PortalPersonReports): Promise<void> {

    const uid = identity.GetEntity().GetKeys()[0];
    let selectedIdentity: PortalPersonReportsInteractive;

    let overlayRef: OverlayRef;
    setTimeout(() => overlayRef = this.busyService.show());
    try {
      const identityCollection = await this.qerClient.typedClient.PortalPersonReportsInteractive_byid.Get_byid(uid);
      selectedIdentity = identityCollection?.Data?.[0];
    } finally {
      setTimeout(() => this.busyService.hide(overlayRef));
    }

    if (!selectedIdentity) {
      this.errorHandler.handleError('Identity could not be loaded.');
      return;
    }

    await this.sideSheet.open(IdentitySidesheetComponent, {
      title: selectedIdentity.GetEntity().GetDisplay(),
      headerColour: 'iris-blue',
      padding: '0px',
      disableClose: true,
      width: 'max(700px, 70%)',
      icon: 'contactinfo',
      testId: 'identity-sidesheet',
      data: {
        isAdmin: false,
        projectConfig: this.projectConfig,
        selectedIdentity,
      }
    }).afterClosed().toPromise();

    await this.loadDirectReports();
  }

  public openOwnership(ownerShip: OwnershipInformation): void {
    this.router.navigate(['resp', ownerShip.TableName]);
  }

  private async loadDirectReports(): Promise<void> {
    let overlayRef: OverlayRef;
    setTimeout(() => overlayRef = this.busyService.show());
    try {
      if (await this.qerPermissions.isPersonManager()) {
        this.reports = (await this.qerClient.typedClient.PortalPersonReports.Get({
          OnlyDirect: true, // direct reports only
          PageSize: 10000
        })).Data;
      }
    } finally {
      setTimeout(() => this.busyService.hide(overlayRef));
    }
  }
}

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

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { OwnershipInformation } from 'imx-api-qer';
import { IEntity } from 'imx-qbm-dbts';
import { RoleService } from '../role.service';

@Component({
  selector: 'imx-role-memberships',
  templateUrl: './role-memberships.component.html',
  styleUrls: ['./role-memberships.component.scss', '../sidesheet.scss']
})
export class RoleMembershipsComponent implements OnChanges {
  public selectedView: 'primary' | 'secondary' | 'exclusions' | 'dynamicgroup' = 'primary';

  @Input() public entity: IEntity;
  @Input() public isAdmin: boolean;
  @Input() public ownershipInfo: OwnershipInformation;

  constructor(private readonly roleService: RoleService) { }

  public onToggleChanged(change: MatButtonToggleChange): void {
    this.selectedView = change.value;
  }

  public get canBeDynamic() {
    return this.entity && this.roleService.canHaveDynamicMemberships(this.entity.TypeName);
  }

  public get isDynamic() {
    return this.entity && this.entity.GetSchema().Columns["UID_DynamicGroup"] && this.entity.GetColumn("UID_DynamicGroup").GetValue();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.ownershipInfo && !this.canHavePrimaryMemberships()) {
      this.selectedView = 'secondary';
    }
  }

  public canHavePrimaryMemberships(): boolean {
    return this.ownershipInfo
      && this.roleService.targetMap.get(this.ownershipInfo.TableName).membership.hasPrimaryMemberships();
  }

  public get uidDynamicGroup() {
    return this.entity.GetColumn("UID_DynamicGroup").GetValue();
  }
}

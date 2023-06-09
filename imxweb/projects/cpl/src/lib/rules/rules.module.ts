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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';

import { RulesComponent } from './rules.component';
import { CdrModule, DataSourceToolbarModule, DataTableModule } from 'qbm';
import { RulesSidesheetComponent } from './rules-sidesheet/rules-sidesheet.component';
import { MatCardModule } from '@angular/material/card';
import { EuiCoreModule } from '@elemental-ui/core';



@NgModule({
  declarations: [
    RulesComponent,
    RulesSidesheetComponent
  ],
  imports: [
    CommonModule,
    EuiCoreModule,
    TranslateModule,
    CdrModule,
    DataTableModule,
    DataSourceToolbarModule,
    MatButtonModule,
    MatCardModule
  ]
})
export class RulesModule { }

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

import { Injectable } from '@angular/core';
import { DefaultUrlSerializer } from '@angular/router';

import { imx_SessionService } from '../session/imx-session.service';
import { AppConfigService } from '../appConfig/appConfig.service';

@Injectable()
export class OAuthService {
  constructor(private sessionService: imx_SessionService, private readonly config: AppConfigService) { }

  public async GetProviderUrl(authentifier: string): Promise<string> {
    const module = '?Module=' + authentifier;
    return this.sessionService.Client.imx_oauth_get(authentifier, this.config.Config.WebAppIndex, window.location.pathname + module);
  }

  public IsOAuthParameter(name: string): boolean {
    return name === 'Module' || name === 'code' || name === 'Code' || name === 'state';
  }

  public convertToOAuthLoginData(loginData: { [key: string]: any }): {
    Module: string,
    Code: string
  } {
    const moduleName = loginData.Module || (new DefaultUrlSerializer()).parse(loginData.state).queryParamMap.get('Module');
    const code = loginData.Code || loginData.code;

    return moduleName && code ? {
      Module: moduleName,
      Code: code
    } : undefined;
  }
}

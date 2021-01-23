import { HttpClient } from '@angular/common/http';
import {
  Translation,
  TRANSLOCO_CONFIG,
  TRANSLOCO_LOADER,
  translocoConfig,
  TranslocoLoader,
  TranslocoModule,
  TranslocoService
} from '@ngneat/transloco';
import { APP_INITIALIZER, Injectable, NgModule } from '@angular/core';
import { environment } from '../environments/environment';
import { UserService } from 'src/app/user.service';


export function preloadUser(userService: UserService, transloco: TranslocoService) {
  return () => {
    transloco.setActiveLang('sq');
    return transloco.load('sq').toPromise();
  };
}


export const preLoad = {
  provide: APP_INITIALIZER,
  multi: true,
  useFactory: preloadUser,
  deps: [UserService, TranslocoService]
};


@Injectable({providedIn: 'root'})
export class TranslocoHttpLoader implements TranslocoLoader {
  constructor(private http: HttpClient) {
  }


  getTranslation(lang: string) {
    return this.http.get<Translation>(`/assets/i18n/${lang}.json`);
  }
}


@NgModule({
  exports: [TranslocoModule],
  providers: [
    {
      provide: TRANSLOCO_CONFIG,
      useValue: translocoConfig({
        availableLangs: ['en', 'sq', 'tr'],
        defaultLang: 'sq',
        fallbackLang: 'sq',
        failedRetries: 3,
        prodMode: environment.production,
        reRenderOnLangChange: true
      })
    },
    {provide: TRANSLOCO_LOADER, useClass: TranslocoHttpLoader}
  ]
})
export class TranslocoRootModule {
}

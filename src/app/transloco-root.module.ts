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


const countryCodeLanguageMapping = {
  al: 'sq',
  tr: 'tr'
};

const getActiveLanguageFromCountryCode = (countryCode: string) => {
  if (countryCodeLanguageMapping[countryCode.toLowerCase()]) {
    return countryCodeLanguageMapping[countryCode.toLowerCase()];
  }
  return 'en';
};


export function preloadUser(userService: UserService, transloco: TranslocoService) {
  return () => {
    return userService.ipLookUp().subscribe(
      (res: { countryCode: string }) => {
        const activeLanguage = getActiveLanguageFromCountryCode(res.countryCode);
        transloco.setActiveLang(activeLanguage);
        return transloco.load(activeLanguage).toPromise();
      });
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
        defaultLang: 'en',
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: environment.production,
      })
    },
    {provide: TRANSLOCO_LOADER, useClass: TranslocoHttpLoader}
  ]
})
export class TranslocoRootModule {
}

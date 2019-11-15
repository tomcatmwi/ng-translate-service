import { Injectable } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  languages = require('~/app/assets/i18n/languages.json');
  currentLang: string;
  defaultLang: string;
  currentLangData = {}

  constructor() {
    this._loadLanguages();
  }

  private _loadLanguages() {
    this.defaultLang = Object.keys(this.languages)[0];
    this.changeLanguage(this.defaultLang);
  }

  changeLanguage(code: string): void {
    this.currentLang = (Object.keys(this.languages).findIndex(x => x === code) === -1) ? this.defaultLang : code;
    this.currentLangData = this.languages[this.currentLang];
  }

  translate(token: string, values: object = {}): string {
    let retval = token;

    //  find translation
    let translation = this.currentLangData;
    token.split('.').forEach(key => {
      if (!!translation && !!translation[key]) {
        translation = translation[key];
      } else {
        translation = null;
      }
    });

    if (translation && typeof translation === 'string') {
      retval = translation;

      //  replace value placeholders
      if (values) {
        Object.keys(values).forEach(key => {
          const rx = new RegExp('{{\\s*' + key + '\\s*}}', 'gm');
          retval = retval.replace(rx, values[key]);
        });
      }
    }

    return retval;
  }

  translateBatch(input: Array<any>, values: object | null, nodes?: string | Array<string>): Array<any> {
    const output = [];

    input.forEach(e => {
      if (!!nodes) {
        const temp = Object.assign(e);
        if (Array.isArray(nodes)) {
          nodes.forEach(node => {
            if (temp[node] && typeof temp[node] === 'string') {
              temp[node] = this.translate(temp[node], values);
            }
          });
        } else {
          temp[nodes] = this.translate(temp[nodes], values);
        }
        output.push(temp);
      } else {
        output.push(this.translate(e, values));
      }
    });

    return output;
  }
}

@Pipe({
  name: 'translate',
  pure: false
})
export class TranslatePipe implements PipeTransform {
  constructor(private _translateService: TranslateService) { }

  transform(value: string, args: object): string {
    return this._translateService.translate(value, args);
  }
}
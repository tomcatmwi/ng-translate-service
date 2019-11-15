# ng-translate-service
Simple localization service for Angular projects.

# Localization file
First create a localization file under `~/app/assets/i18n/languages.json` which contains all your strings. Example:

```
{
  "en": {
          "welcome": "Welcome to my app!",
          "exit": "Are you sure?"
  },
  
  "hu": {
          "welcome": "Szevasz, majom!",
          "exit": "Magadnál vagy, faszikám?"
  }
}
```

The service will automatically find and read the JSON file and assume all node keys on the top level to be language codes. In this case we have `en` and `hu` for English and Hungarian. The first one will be the default language.

If you have to insert dynamically generated values into localization strings, you can use Angular binding syntax:

```
  "welcome": "Welcome to my app, {{ username }}!",
```

If you have a lot of strings (which is probably the case) you can divide them into groups:

```
{
  "en": {
          login: {
            "welcome": "Welcome to my app!",
            "exit": "Are you sure?"
          },
          settings: {
            "background": "Background color",
            "color": "Character color",
            "volume": "Volume"
          }
  },
  
  "hu": {
          login: {
            "welcome": "Szevasz, majom!",
            "exit": "Magadnál vagy, faszikám?"
          },
          settings: {
            "background": "Háttérszín",
            "color": "Betűszín",
            "volume": "Hangerő"
          }
  }
}
```

You can quickly and efficiently create and maintain localization files with plenty of online and offline services. I can recommend [localize.biz](https://localize.biz).

# How to use the service
After injecting the translation service into your component like any other service, you can use the following methods:

# `changeLanguage(code: string)`
Changes the current language to the selected one. If the language code isn't in `languages.json`, the service will fall back to the default language. Example:
```
changeLanguage('fr');
```

# `translate(token: string, values: object)`
Returns the translation of a single string. The `values` object specifies the dynamic values to replace placeholders. Example:

```
translate('login.welcome', { username: 'John Doe' });
```

# `translateBatch(input: Array<any>, values: object | null, nodes: string | Array<string>)`
Translates multiple strings at once, passed as an array. There are multiple ways to use this function.

If you have an array of strings:

```
const source = ['text-1', 'text-2', 'text-3', 'text-4'];
console.log(translateService.translateBatch(source, null));
```

Dynamic values can be passed as an object in the `values` parameter.

```
const source = ['text-1', 'text-2', 'text-3', 'text-4'];
console.log(translateService.translateBatch(source, { name: 'John Doe', car: 'Toyota', city: 'New York' }));
```

If you have an array of identically structured objects, you can specify which nodes are to be translated. The `nodes` parameter can be a string if there's only one node, or an array of strings if more. Example:

```
const source = [
                  { id: 32, buttonActive: 'button32-active', buttonDisabled: 'button32-disabled' },
                  { id: 46, buttonActive: 'button46-active', buttonDisabled: 'button48-disabled' },
                  { id: 58, buttonActive: 'buttons.active-default', buttonDisabled: 'buttons.passive-default' },
               ];
               
//  translates both fields
console.log(translateService.translateBatch(source, null, ['buttonActive', 'buttonDisabled']);
               
//  translates just one field
console.log(translateService.translateBatch(source, null, 'buttonActive');

```

# Using the `translate` pipe

By using the `translate` pipe you can quickly translate any string in the HTML template, without having to inject and use the service.

```
<div [innerHtml]="'login.welcome' | translate:{ name: 'John Doe' }"></div>
```

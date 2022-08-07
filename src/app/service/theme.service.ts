import { Injectable } from '@angular/core';
import {Platform} from '@ionic/angular';
import {Storage} from '@ionic/storage';
const THEME_KEY = 'selected-app-theme';
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
 darkMode = false;
  constructor(private platform: Platform,private storage: Storage) {
    this.storage.create();
    this.platform.ready().then(() => {
      this.storage.get(THEME_KEY).then(theme => {
        this.setAppDarkTheme(theme);
      });
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      prefersDark.addListener(e => {
        console.log('matches: ', e);
        this.setAppDarkTheme(e.matches);
      });
    });
  }

  toggleAppTheme() {
    this.darkMode = !this.darkMode;
    this.setAppDarkTheme(this.darkMode);
  }
  setAppDarkTheme(dark) {
      this.darkMode = dark;

      if(this.darkMode) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
      this.storage.set(THEME_KEY, this.darkMode);
  }
}

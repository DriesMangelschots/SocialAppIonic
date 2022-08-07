import {Component, Renderer2} from '@angular/core';
import {NavController, Platform} from '@ionic/angular';
import { DataHelperService } from './service/data-helper.service';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import {Router} from '@angular/router';
import { Storage } from '@ionic/storage';
import {ThemeService} from './service/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  // darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  //
  // iconMoon = true;
  // modeText ='Lichte mode';
  //
  // darkmode: 'Darkmode';
  public appPages = [
    { title: 'Home', url: '/folder', icon: 'home' },
    { title: 'Profile', url: '/profile', icon: 'person' },
    { title: 'Logout', url: '/login', icon: 'log-out' },
  ];
  constructor(public navCtrl: NavController, public dataHelper: DataHelperService,
  public router: Router,private renderer: Renderer2,
              private storage: Storage,
              private themeService: ThemeService) {


  }
  logout(title) {
    if (title === 'Logout') {
      localStorage.clear();
      this.storage.clear();
      this.dataHelper.currentUser = null;
    }
  }
  toggleDarkMode() {
    this.themeService.toggleAppTheme();
  }
  // toggleDarkMode = () => {
  //
  //   this.changeNameMode();
  //   if (this.darkMode) {
  //     this.renderer.addClass(document.body,'dark');
  //     console.log('enable darkmode');
  //
  //   } else {
  //     this.renderer.removeClass(document.body,'dark');
  //     console.log('enable lightmode');
  //   }
  //
  // };
  // toggleIcon = (): void => {
  //   this.darkMode = !this.darkMode;
  //   this.toggleDarkMode();
  //   this.iconMoon = !this.iconMoon;
  //
  //
  // };
  // changeNameMode= () => {
  //
  //   if (this.darkMode) {
  //     this.modeText = 'Donkere mode';
  //
  //   } else {
  //     this.modeText = 'Lichte mode';
  //
  //   }
  // };
  homeRedirect() {
    if (this.dataHelper.currentUser === null) {
     return this.router.navigate(['/Logout']);
    } else {
      return this.router.navigate(['/Home']);
    }
  }
}

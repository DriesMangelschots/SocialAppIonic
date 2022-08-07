import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import firebase from 'firebase';
import {IonicStorageModule} from '@ionic/storage-angular';
var firebaseConfig = {
  apiKey: 'AIzaSyCznROGZw9KIsJcMTG9aRRCHZTaaRivw1A',
  authDomain: 'socialposts-df217.firebaseapp.com',
  projectId: 'socialposts-df217',
  storageBucket: 'socialposts-df217.appspot.com',
  messagingSenderId: '413729714515',
  appId: '1:413729714515:web:4c14e261e613863e2271a6',
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,HttpClientModule,
  IonicStorageModule.forRoot()],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },Camera,Keyboard],
  bootstrap: [AppComponent],
})
export class AppModule {}

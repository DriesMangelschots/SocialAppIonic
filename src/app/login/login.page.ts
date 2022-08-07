import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import firebase from 'firebase';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DataHelperService } from '../service/data-helper.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public loginForm: FormGroup;
  constructor(
    public router: Router,
    public alertController: AlertController,
    public _fb: FormBuilder,
    public navCtrl: NavController,
    public service: DataHelperService) {
    if (service.currentUser && service.currentUser.uid) {
      this.navCtrl.navigateRoot('folder');
    }
  }

  ngOnInit() {
    this.loginForm = this._fb.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'),
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(15)
      ])],
    });
  }

  loginAccount(data) {

    var self = this;
    self.service.presentLoading();
    firebase.auth().signInWithEmailAndPassword(data.email, data.password).then((user) => {
      if (user) {
        self.getUsersData(user.user.uid);
      }
    }).catch((e) => {
      self.service.stopLoading();
      self.service.createToast(e.message);
    });
  }

  async getUsersData(uid) {
    var self = this;
    await firebase.database().ref().child(`users/${uid}`)
      .once('value', (snapshot) => {
        var data = snapshot.val();
        var isBlock: boolean;
        if (data) {
            isBlock = data.isBlock;
            if (!isBlock) {
              self.service.setCurrentUserData(data);
              self.service.createToast("You have logged in Successfully");
              self.navCtrl.navigateRoot('/folder');
              self.service.stopLoading();
            }
            else {
              self.service.createToast("User is blocked");
              self.service.stopLoading();
            }
          }

      }).catch(err => {
        console.log(err);
      })

  }

}

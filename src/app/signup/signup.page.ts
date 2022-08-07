import { Component, NgZone, OnInit } from '@angular/core';
import firebase from 'firebase';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { DataHelperService } from '../service/data-helper.service';
declare var google: any;
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  public signupForm: FormGroup;
  public autocompleteItems: any[];
  public placeid: any;
  public GoogleAutocomplete: any;
  lat: any;
  lng: any;
  uid: string;
  constructor(public router: Router,
    public alertController: AlertController,
    public _fb: FormBuilder,
    public zone: NgZone,
    public navCtrl: NavController,
    public service: DataHelperService) {

    if (service.currentUser && service.currentUser.uid) {
      this.navCtrl.navigateRoot('/tabs/tab1');
    }

  }


  ngOnInit() {
    
    this.signupForm = this._fb.group({
      fullName: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)
      ])],
      email: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'),
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(15)
      ])],
      cPassword: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(15)
      ])],

    });

  }

  createAccount(data) {

    if (data.password != data.cPassword) {
      alert("Password and Confirm Password mismatch");
      return;
    }

    var self = this;
    self.service.presentLoading();
    firebase.auth().createUserWithEmailAndPassword(data.email, data.password).then((user) => {
      if (firebase.auth().currentUser) {
        self.uid = firebase.auth().currentUser.uid;
      }
      self.saveDatatoUserTableAfterRegister(data);
    }).catch((error) => {
      self.service.stopLoading();
      alert(error.message);
    });
  }

  saveDatatoUserTableAfterRegister(data) {
    var self = this;
    data.password = null;
    data.cPassword = null;
    data.uid = self.uid
    data.timestamp = Number(new Date());
    data.isBlock = false;
    var updates = {};
    updates['/users/' + self.uid] = data;
    firebase.database().ref().update(updates).then(() => {
      self.service.stopLoading();
      self.service.createToast("Account Created Successfully");
      self.service.setCurrentUserData(data);
      self.navCtrl.navigateRoot('/folder');
    }).catch(err => {
      self.service.stopLoading();
      console.log(err);
    })
  }

}

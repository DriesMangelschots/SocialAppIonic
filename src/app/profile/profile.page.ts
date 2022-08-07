import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DataHelperService } from '../service/data-helper.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  grid: any = 'true'
  constructor(public navCtrl: NavController, public dataHelper: DataHelperService,
              public router: Router) { }
  imagesArray: any = ["../../assets/Images/a.jpg", "../../assets/Images/a.jpg", "../../assets/Images/a.jpg", "../../assets/Images/a.jpg", "../../assets/Images/a.jpg", "../../assets/Images/a.jpg", "../../assets/Images/a.jpg", "../../assets/Images/a.jpg", "../../assets/Images/a.jpg", "../../assets/Images/a.jpg", "../../assets/Images/a.jpg", "../../assets/Images/a.jpg"]
  ngOnInit() {
  }
  back() {
    return this.router.navigate(['/']);
  }

  async changeProfileImage() {
    const image = await this.dataHelper.getCameraImage();
    if (!image) {
      return;
    }
    this.dataHelper.presentLoading();
    const imageProfileUrl = await this.dataHelper.uploadImage(image.img);
    const userData = this.dataHelper.currentUser;
    userData.imageProfile = imageProfileUrl;
    this.dataHelper.updateUserProfile(userData).then((res) => {
      this.dataHelper.createToast(`The profile was successfully updated!`);
      this.dataHelper.getUsers();
    }).catch((err) => {
      this.dataHelper.createToast(`Couldn't update the profile, please try again later!`);
    }).finally(()=>{
      this.dataHelper.stopLoading();
    });
  }

}

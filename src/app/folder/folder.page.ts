import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, NavController } from '@ionic/angular';
import { DataHelperService } from '../service/data-helper.service';
// import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { Camera, CameraResultType } from '@capacitor/camera';
@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  addPostTab: any = 'posts';
  public images = [];
  postEnableDisable: any = '';
  text: any;
  disableDelete = false;
  constructor(public dataHelper: DataHelperService,
    // private camera: Camera,
    public actionSheetController: ActionSheetController,
    public navCtrl: NavController) {
  }
  navigate(user) {
    this.navCtrl.navigateForward('profile');
  }
  ngOnInit() {
  }

  imagepop(index) {
    this.images.splice(index, 1);
  }
  async chooseCameraOptions() {
    if (this.images?.length < 1) {
      const actionSheet = await this.actionSheetController.create({
        header: 'Upload Picture',
        cssClass: 'customClass',
        buttons: [{
          text: 'Camera',
          icon: 'camera',
          handler: async () => {
            const image = await this.dataHelper.getCameraImage();
            this.images.push(image);
            if (this.images.length != 0) {
              this.postEnableDisable = this.images;
            }
          }
        }, {
          text: 'Gallery',
          icon: 'images',
          handler: () => {
            this.getGalleryImage();
          }
        }, {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel'
        }]
      });
      await actionSheet.present();
    }
    else {
      this.dataHelper.createToast('Can\'t Add more than 1 Image');
    }
  }
  toComments(post) {
    this.dataHelper.selectedPost = post;
    this.dataHelper.viewActiveTab = 'comments';
    this.navCtrl.navigateForward(['/post-details']);
  }

  onChangeTime(event) {
    if (this.text.length > 0) {
      this.postEnableDisable = this.text;
    }
    else {
      if (this.images.length == 0) {
        this.postEnableDisable = '';
      }
      else {
        this.postEnableDisable = this.images;
      }
    }
  }

  async addPost() {
    this.dataHelper.postText = this.text || '';
    if (this.images.length != 0) {
      this.dataHelper.presentLoading('Creating Post');
      for (const image of this.images) {
        const url = await this.dataHelper.uploadImage(image.img);
        this.dataHelper.images.push(url);
      }
    }
    this.dataHelper.addPost();
    this.text = '';
    this.images = [];
    this.postEnableDisable = '';
  }

  getGalleryImage() {
    Camera.pickImages({ limit: 1 }).then((data) => {
      this.getBase64ImageFromUrl(data.photos[0].webPath).then((base64string: any) => {
          if (base64string.length) {
            const image = { img: base64string };
            this.images.push(image);
            if (this.images.length != 0) {
              this.postEnableDisable = this.images;
            }
          }
        })
        .catch(err => console.error(err));
    });
  }



  async getBase64ImageFromUrl(imageUrl) {
    const res = await fetch(imageUrl);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        resolve(reader.result);
      }, false);
      reader.onerror = () => reject(this);
      reader.readAsDataURL(blob);
    });
  }

  deletePost(post) {
    this.dataHelper.deletePost(post);
  }

}

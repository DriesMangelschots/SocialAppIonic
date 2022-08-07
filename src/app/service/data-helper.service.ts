import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  LoadingController,
  ToastController,
  AlertController,
  NavController,
  ModalController,
} from '@ionic/angular';
import { ImageViewerPage } from '../image-viewer/image-viewer.page';
import firebase from 'firebase';
import { Camera, CameraResultType } from '@capacitor/camera';
@Injectable({
  providedIn: 'root',
})
export class DataHelperService {
  public currentUser;
  public loader: any;
  users: any;
  postText: any;
  images: any = [];
  posts: any[];
  postsAvailable: any;
  selectedPost: any;
  viewActiveTab: string;
  newComment: any;
  constructor(
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public modalController: ModalController,
    public alertController: AlertController,
    public navCtrl: NavController
  ) {
    if (
      (!this.currentUser || !this.currentUser.uid) &&
      localStorage.getItem('currentUser')
    ) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    } else {
      this.navCtrl.navigateRoot('/login');
    }
    this.getUsers();
    this.getPosts();
  }

  async presentLoading(message?) {
    if (!this.loader) {
      this.loader = await this.loadingCtrl.create({
        message: message || '',
      });
      await this.loader.present();
      const { role, data } = await this.loader.onDidDismiss();
    }
  }

  async imageViewer(array, index) {
    const modal = await this.modalController.create({
      component: ImageViewerPage,
      componentProps: {
        array,
        index,
        type: 'array',
      },
    });
    await modal.present();
  }

  stopLoading() {
    if (this.loader) {
      this.loader.dismiss();
      this.loader = null;
    }
  }

  async createToast(mess) {
    const toast = await this.toastCtrl.create({
      message: mess,
      duration: 3000,
    });
    toast.present();
  }
  setCurrentUserData(userData) {
    this.currentUser = null;
    this.currentUser = userData;
    localStorage.setItem('currentUser', JSON.stringify(userData));
  }
  addPost() {
    let data: any = {};
    const postkey = firebase.database().ref('post').push().key;
    if (this.images) {
      data = {
        text: this.postText,
        postImages: this.images,
        key: postkey,
        timeStamp: Number(new Date()),
        uid: this.currentUser.uid,
      };
    } else {
      data = {
        text: this.postText,
        key: postkey,
        timeStamp: Number(new Date()),
        uid: this.currentUser.uid,
      };
    }

    firebase.database().ref('post/' + postkey).update(data).then(() => {
      this.getPosts().then().finally(() => {
        this.images = [];
        this.stopLoading();
      });
    });
  }

  async uploadImage(image) {
    const storageRef = firebase.storage().ref();
    const filename = Math.floor(Date.now() / 1000);
    const imageRef = storageRef.child(
      `${this.currentUser.uid}/${filename}.jpg`
    );
    return await imageRef.putString(image, firebase.storage.StringFormat.DATA_URL)
      .then((snapshot) => firebase.storage().ref(`${this.currentUser.uid}/${snapshot.metadata.name}`).getDownloadURL());
  }

  getUsers() {
    firebase.database().ref('users').once('value', (userSnapshot) => {
      this.users = userSnapshot.val();
    });

  }

  getPosts() {
    return new Promise((resolve) => {
      firebase.database().ref('post').once('value', (postSnapshot) => {
        const allPosts = postSnapshot.val();
        this.posts = [];
        for (const key in allPosts) {
          this.posts.push(allPosts[key]);
        }
        this.posts.sort((a, b) => b.timeStamp - a.timeStamp);
        this.postsAvailable = true;
        resolve(true);
      });
    });
  }
  addLike(key) {
    const self = this;
    firebase
      .database()
      .ref('post/' + key)
      .once('value', (snapshot) => {
        const post = snapshot.val();
        const i = this.posts.findIndex((posts) => posts.key == post.key);
        this.posts[i] = post;
        if (!this.posts[i].likes?.includes(self.currentUser.uid)) {
          if (!this.posts[i].likes) {
            this.posts[i].likes = [];
          }
          this.posts[i].likes.push(self.currentUser.uid);
          console.log(this.posts[i]);
          firebase
            .database()
            .ref('post/' + post.key)
            .child('likes')
            .update(this.posts[i].likes)
            .then(() => {
              console.log('Liked');
            });
        } else {
          const index = this.posts[i].likes.findIndex(
            (uid) => uid == self.currentUser.uid
          );
          this.posts[i].likes.splice(index, 1);
          firebase
            .database()
            .ref('post/' + post.key)
            .child('likes/' + index)
            .remove();
        }
      });
  }
  addComment(comment) {
    let data = {};
    data = {
      text: comment.text,
      timeStamp: Number(new Date()),
      uid: this.currentUser.uid,
    };
    firebase
      .database()
      .ref('post/' + this.selectedPost.key)
      .once('value', (snapshot) => {
        this.selectedPost = snapshot.val();
        const x = this.users[this.selectedPost.uid];
        if (!this.selectedPost.comments) {
          this.selectedPost.comments = [];
        }
        this.selectedPost.comments.push(data);
        const key = this.posts.findIndex(
          (post) => post.key == this.selectedPost.key
        );
        this.posts[key] = this.selectedPost;

        firebase
          .database()
          .ref('post/' + this.selectedPost.key)
          .child('comments')
          .update(this.selectedPost.comments)
          .then(() => {
          });
      });
  }

  deletePost(post) {
    firebase.database().ref('post/' + post.key).remove().then(() => {
      this.getPosts().then(() => {
        this.stopLoading();
        this.images = [];
        this.createToast('Post was successfully deleted!');
      });
    });
  }

  async getCameraImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64
    }) as any;
    if (image) {
      image.img = 'data:image/png;base64,' + image.base64String;
    }
    return image;
  }

  updateUserProfile(userData) {
    return new Promise((resolve, reject) => {
      const data = {};
      data['/users/' + this.currentUser.uid] = userData;
      firebase.database().ref().update(data).then(() => {
        this.currentUser = userData;
        localStorage.setItem('currentUser', JSON.stringify(userData));
        resolve(true);
      }).catch(err => {
        reject(err);
        console.log(err);
      });
    });
  }
}

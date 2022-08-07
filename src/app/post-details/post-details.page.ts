import { Component, OnInit, } from '@angular/core';
import { ImageViewerPage } from '../image-viewer/image-viewer.page';
import { ActionSheetController, NavController, ModalController } from '@ionic/angular';
import { DataHelperService } from '../service/data-helper.service';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';
@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.page.html',
  styleUrls: ['./post-details.page.scss'],
})
export class PostDetailsPage implements OnInit {
  public activeTab: string ;
  comment = { text: '', image: null, uid: null };
  post: any;
  load = false;
  viewMore = false;
  images: any;
  constructor(public dataHelper: DataHelperService,
    public navCtrl: NavController,
    public modalController: ModalController,
    public actionSheetController: ActionSheetController,private keyboard: Keyboard,) {


    }

  ngOnInit() {
    //console.log(this.dataHelper.selectedPost , "POST")
    if(this.dataHelper.viewActiveTab != ''){
      this.activeTab = this.dataHelper.viewActiveTab;
      //console.log("viewtab",this.activeTab );
      console.log(this.dataHelper.users);
    }
    if (this.dataHelper.selectedPost?.comments?.length > 8) {
      this.viewMore = true;
    }
    const div = document.getElementById('scrollableDiv');
    // this.scrollToBottom();

    this.keyboard.onKeyboardShow().subscribe(() => {
      this.scrollToBottom();

      div.setAttribute('style', 'margin-bottom: 35px;');
    });
    this.keyboard.onKeyboardHide().subscribe(() => {
      this.scrollToBottom();
      div.setAttribute('style', 'margin-bottom: 5px;');
    });

    this.keyboard.onKeyboardDidShow().subscribe(() => {
      this.scrollToBottom();
      div.setAttribute('style', 'margin-bottom: 35px;');
    });
    this.keyboard.onKeyboardDidHide().subscribe(() => {
      this.scrollToBottom();
      div.setAttribute('style', 'margin-bottom: 5px;');
    });
  }
  async imageViewer(image) {
    const modal = await this.modalController.create({
      component: ImageViewerPage,
      componentProps: {
        image,
        type: 'image'
      }
    });
    await modal.present();
  }
  scrollToBottom() {
    setTimeout(() => {
      const div = document.getElementById('scrollableDiv');
      div.scrollTop = div.scrollHeight;
    }, 300);
  }
  async addComment() {
    this.viewAll();
    this.load = true;
    this.comment.uid = this.dataHelper.currentUser.uid;
    let tempObj = this.comment;
    this.dataHelper.addComment(tempObj);
    tempObj=null;
    this.comment = { text: '', image: null, uid: null };
    this.load = false;
    setTimeout(()=>{
      this.scrollToBottom();
    },300);
  }


  viewAll() {
    this.viewMore = false;
    // this.scrollToBottom();
  }


  ngOnDestroy() {
    this.activeTab =  'comments';
  }
  ionViewWillLeave(){
    console.log('leave the page');
    this.activeTab =  'comments';
  }

  setSegment(){
    console.log(this.activeTab , 'click tab');
  }


}

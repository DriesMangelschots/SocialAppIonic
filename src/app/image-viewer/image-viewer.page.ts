import { Component, OnInit, ViewChild } from '@angular/core';
import { NavParams, ModalController, IonSlides } from '@ionic/angular';
@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.page.html',
  styleUrls: ['./image-viewer.page.scss'],
})
export class ImageViewerPage implements OnInit {
  imagesArray = []
  slideOptions = null;

  // ===> Get the reference on the slides here <===
  @ViewChild('slides', { static: true }) slides: IonSlides;
  index: any;
  type: any;
  oneimage: any;
  constructor(public navParams: NavParams,
    public modalController: ModalController) {
    this.type = navParams.get("type");
    if(this.type=="array"){
      this.imagesArray = navParams.get("array");
      this.index = navParams.get("index")
    }else{
      this.oneimage = navParams.get("image");
    }
  } 
  ngOnInit() {
    let initialSlide = this.index;
    let slidesPerView = 1;
    this.slideOptions = { initialSlide, slidesPerView };
    this.slides?.update();
  }

  dismiss() {
    this.imagesArray=[];
    this.index=null;
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}

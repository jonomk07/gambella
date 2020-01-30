import { Component  , ViewChild} from '@angular/core';
import {  NavController, NavParams, Events,ModalController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { SignupPage } from '../signup/signup';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';

import * as WC from 'woocommerce-api';
import { ProductsByCategoryPage } from '../products-by-category/products-by-category';
import { CartPage } from '../cart/cart';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  homePage: any;
  WooCommerce: any;
  categories: any[];
  @ViewChild('content') childNavCtrl: NavController;
  loggedIn: boolean;
  user: any;

 
  constructor(public navCtrl: NavController, public navParams: NavParams ,private events: Events ,public storage: Storage, public modalCtrl: ModalController) {
    
    this.homePage = HomePage;
    this.categories = [];
    this.user = {};

    this.WooCommerce = WC ({
      url: "https://jonomuamba.co.za/gambela",
      consumerKey: "ck_91bc756ea629eba127864ab553bad0d0e91f8b1d",
      consumerSecret: "cs_b4f22356538a316ffb7d952c61c61c1f6c90f7d4",
      wpAPI: true,
      verifySsl: false,
      queryStringAuth: true,
      version: 'wc/v3'
    });

    this.WooCommerce.getAsync("products/categories").then((data) => {
      console.log(JSON.parse(data.body).product_categories);

      let temp: any[] = JSON.parse(data.body).product_categories;

      for (let i = 0; i < temp.length; i++) {
        if (temp[i].parent == 0) {

          temp[i].subCategories = [];

          if (temp[i].slug == "accessories") {
            temp[i].icon = "card";
          }
          if (temp[i].slug == "hoodies") {
            temp[i].icon = "shirt";
          }
          if (temp[i].slug == "tshirts") {
            temp[i].icon = "shirt";
          }
          if (temp[i].slug == "uncategorised") {
            temp[i].icon = "basket";
          }

          this.categories.push(temp[i]);
        } 
      }

    }, (err) => {
      console.log(err)
    });
  
    this.events.subscribe("updateMenu", () => {
      this.storage.ready().then(() => {
        this.storage.get("userLoginInfo").then((userLoginInfo) => {

          if (userLoginInfo != null) {

            console.log("User logged in...");
            this.user = userLoginInfo.user;
            console.log(this.user);
            this.loggedIn = true;
          }
          else {
            console.log("No user found.");
            this.user = {};
            this.loggedIn = false;
          }

        })
      });


    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
  }

  openCategoryPage(category) {
    this.childNavCtrl.setRoot(ProductsByCategoryPage, { "category": category });
  }

  openPage(pageName: string) {
    if (pageName == "signup") {
      this.navCtrl.push(SignupPage);
    }
    if (pageName == "home") {
      this.navCtrl.push(HomePage);
    }
    if (pageName == "login") {
      this.navCtrl.push(LoginPage);
    }
    if (pageName == 'logout') {
      this.storage.remove("userLoginInfo").then(() => {
        this.user = {};
        this.loggedIn = false;
      })
    }
    if (pageName == 'cart') {
      let modal = this.modalCtrl.create(CartPage);
      modal.present();
    }
  }

}

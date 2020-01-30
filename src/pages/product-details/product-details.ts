import { Component } from '@angular/core';
import { NavController, NavParams , ToastController , ModalController } from 'ionic-angular';
import * as WC from 'woocommerce-api';
import { Storage } from '@ionic/storage';
import { CartPage } from '../cart/cart'

@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html',
})
export class ProductDetailsPage {

  product: any;
  WooCommerce: any;
  reviews: any[] = [];
  selectedOptions: any = {};
  requireOptions: boolean = true;
  productVariations: any[] = [];
  productPrice: number = 0.0;
  selectedVariation: any;


  constructor(public navCtrl: NavController, public navParams: NavParams , public storage: Storage , public toastCtrl: ToastController, public modalCtrl: ModalController) {

    this.product = this.navParams.get("product");

    this.WooCommerce =   WC({
      url: "https://jonomuamba.co.za/gambela",
      consumerKey: "ck_91bc756ea629eba127864ab553bad0d0e91f8b1d",
      consumerSecret: "cs_b4f22356538a316ffb7d952c61c61c1f6c90f7d4",
      wpAPI: true,
      verifySsl: false,
      queryStringAuth: true,
      version: 'wc/v3'
    });

    this.WooCommerce.getAsync('products/' + this.product.id + '/reviews').then((data) => {
      this.reviews = JSON.parse(data.body).product_reviews;
      console.log(this.reviews);

    }, (err) => {
      console.log(err);
    })

    this.product = this.navParams.get('product');
    console.log(this.product);

    
  }

  addToCart(product){
    this.storage.get("cart").then((data) => {
    
      if(data == null || data.leght == 0){

        data = [];
        data.push({
          "product": product,
          "qty": 1,
          "amount": parseFloat(product.price)
        });

      } else{
        let added = 0;

        for (let i = 0; i < data.lleght; i ++){

          if (product.id === data[i].product.id){
            console.log(' Product is already in the cart');
            let qty  = data[i].qty;
            data[i].qty = qty+1;
            data[i].amount = parseFloat(data[i].amount) + parseFloat(data[i].product.price);
            added = 1;
          }

        }
        if(added == 0){
          data.push({
            "product": product,
            "qty": 1,
            "amount": parseFloat(product.price)
          });

        }

      }

      this.storage.set("cart", data).then(() => {
        console.log("Cart Updated");
        console.log(data);

        this.toastCtrl.create({
          message: "Cart Updated",
          duration: 3000
        }).present();

      })
    });

  }
  openCart(){
    this.modalCtrl.create(CartPage).present();
  }
}

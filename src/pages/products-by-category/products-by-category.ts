import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import * as WC from 'woocommerce-api';
import { ProductDetailsPage } from '../product-details/product-details'

@Component({
  selector: 'page-products-by-category',
  templateUrl: 'products-by-category.html',
})
export class ProductsByCategoryPage {

  WooCommerce: any;
  products: any[];
  page: number;
  category: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  
    this.page = 1;
    this.category = this.navParams.get("category");

    this.WooCommerce = WC({
      url: "https://jonomuamba.co.za/gambela",
      consumerKey: "ck_91bc756ea629eba127864ab553bad0d0e91f8b1d",
        consumerSecret: "cs_b4f22356538a316ffb7d952c61c61c1f6c90f7d4",
      wpAPI: true,
      verifySsl: false,
      queryStringAuth: true,
      version: 'wc/v3'
    });

    this.WooCommerce.getAsync("products?filter[category]=" + this.category.slug).then((data) => {
      console.log(JSON.parse(data.body));
      this.products = JSON.parse(data.body).products;
    }, (err) => {
      console.log(err)
    })
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsByCategoryPage');
  }

  loadMoreProducts(event) {

    this.page++;

    console.log("Getting page " + this.page);
    
    this.WooCommerce.getAsync("products?filter[category]=" + this.category.slug + "&page=" + this.page).then((data) => {
      let temp = (JSON.parse(data.body).products);

      this.products = this.products.concat(JSON.parse(data.body).products)
      console.log(this.products);
      event.complete();

      if (temp.length < 10)
        event.enable(false);
    })
  }



  openProductPage(product){
    this.navCtrl.push( ProductDetailsPage, {"product": product});
  }

}

import { Component } from '@angular/core';
//import { IonicPage, NavController, NavParams, DateTime } from 'ionic-angular';
import { IonicPage, NavController, NavParams, AlertController  } from 'ionic-angular';

import {FirebaseListObservable} from 'angularfire2/database';
import {CartService} from '../../providers/cart.service';
import {AuthService} from '../../providers/auth.service';

@IonicPage()
@Component({
  selector: 'page-orders',
  templateUrl: 'orders.html',
  providers: [CartService,AuthService]
})
export class OrdersPage {
  orders :FirebaseListObservable<any>;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public cartService: CartService,
              public authService: AuthService,
              public alertCtrl: AlertController
             ) {
    cartService.loadOrders(this.authService.getLoggedUID());
    this.orders = this.cartService.orderItems;
    console.log(this.orders)
  }

CancelOrder(product)
{

  let confirm = this.alertCtrl.create({
    title: 'Do you want to cancel this order',
    buttons: [
      {
        text: 'No',
      },
      {
        text: 'Yes',
        handler: () => {
          this.cartService.cancelorder(this.authService.getLoggedUID(),product);
        }
      }
    ]
  });
  confirm.present();
}



  compareDate(date:string)
  {
    let date1 =Date.now()
    //let date2 = date
    //let time = Date.now() - parseInt(date);  //msec
    var t = Date.now() - +(new Date(date));
    //var diff = date1.valueOf() - date2.valueOf();
    //var date1 = new Date("6 Apr, 2015 14:45").getTime() / 1000;

//var date2 = new Date("7 May, 2015 02:45").getTime() / 1000;

//var difference = (date2 - date1)/60/60;
    let hoursDiff = t / (3600 * 1000)
    console.log("hours diff:" ,hoursDiff)
    if (hoursDiff>6 )
    return false
    else
    return true
    
  }

}

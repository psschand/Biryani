import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController  } from 'ionic-angular';
import {FirebaseListObservable} from 'angularfire2/database';

import {CartService} from '../../providers/cart.service';
import {AuthService} from '../../providers/auth.service';
import {CustomerService} from '../../providers/customer.service';
import {SharedService} from '../../providers/shared.service';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';

import { Config } from '../../config';
import {OrdersPage} from '../orders/orders'

@IonicPage()
@Component({
  selector: 'page-billing',
  templateUrl: 'billing.html',
  providers: [CartService,AuthService,CustomerService,SharedService,PayPal]
})
export class BillingPage {
  addresses :  any;
  delivery_details: string;
  payment_mode : string;
  //amount:string;
  
  cart: FirebaseListObservable<any>;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,

              public alertCtrl: AlertController,

              public cartService: CartService,
              public authService: AuthService,
              public custService: CustomerService,
              public sharedService: SharedService,
              private payPal: PayPal
             ) {
        this.payment_mode="paypal";
        this.delivery_details="";
        this.custService.loadDeliveyAddress(this.authService.getLoggedUID());
        this.addresses = this.custService.deliveryAddresses;
        cartService.loadCartList(this.authService.getLoggedUID());
        this.cart = this.cartService.cartItems;
  }



  //amount:string=this.cartService.cartAmount.toString(this.amount);
 // numTxt:string=''+this.amount;
 amount:string=this.cartService.cartAmount.toString();  
 payment: PayPalPayment = new PayPalPayment(this.amount, 'GBP', 'Biryani', 'sale');
 currencies = ['EUR', 'GBP'];
 payPalEnvironment: string = 'payPalEnvironmentSandbox';

  pay() : void{
    if(this.payment_mode == "cod"){
      
      if(this.delivery_details == "" || this.delivery_details==undefined || this.delivery_details==null){
        this.sharedService.showToast("Select/Add Adress!");
      }else{
        this.cartService.checkout(this.authService.getLoggedUID() ,this.delivery_details);
        this.navCtrl.setRoot(OrdersPage);
      }
    
    }else if(this.payment_mode=="paypal"){
      //handle this 
      if(this.delivery_details == "" || this.delivery_details==undefined || this.delivery_details==null){
        this.sharedService.showToast("Select/Add Adress!");
      }else{
        this.makePayment();
        //this.cartService.checkout(this.authService.getLoggedUID() ,this.delivery_details);
        //this.navCtrl.setRoot(OrdersPage);
      }
    }
    
  }

  addAddress() : void{
    this.addressManipulation(false,null);
  }

  editAddress(address: any) : void{
    this.addressManipulation(true, address);
  }
  deleteAddress(address:any) : void{
    let confirm = this.alertCtrl.create({
      title: 'Delete this Address',
      buttons: [
        {
          text: 'No',
        },
        {
          text: 'Yes',
          handler: () => {
            this.custService.removeAddress(this.authService.getLoggedUID(),address.$key);
          }
        }
      ]
    });
    confirm.present();
  }

  addressManipulation(edit:boolean, address :any) : any {
    var popup_title = "Edit Address"
    if(edit == false){
      popup_title = "Add Address";
      address = { 
        nickname:'',
        address:'',
        pincode:'',
        phone:''
      }
    }

    let prompt = this.alertCtrl.create({
      title: popup_title,
      inputs: [
        {
          name: 'nickname',
          placeholder: 'Nick Name',
          value :address.nickname
        },
        {
          name: 'address',
          placeholder: 'Address',
          value :address.address
        },
        {
          name: 'pincode',
          placeholder: 'Pincode',
          type: 'string',
          value :address.pincode
        },
        {
          name: 'phone',
          placeholder: 'Phone',
          type: 'number',
          value :address.phone
        }
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            if (!data.nickname || !data.address || !data.pincode || !data.phone ) {
              this.sharedService.showToast("Invalid Data!");
              event.stopPropagation(); //TODO
            } else {
              
              if(edit){
                  this.custService.updateAddress(this.authService.getLoggedUID(), data, address.$key);
              }else{
                  this.custService.addAddress(this.authService.getLoggedUID(),data);
              }


            }
          }
        }
      ]
    });
    prompt.present();
    
  }


  
	makePayment() {
    this.amount=this.cartService.cartAmount.toString();  
    //alert(this.amount);
    this.payment = new PayPalPayment(this.amount, 'GBP', 'Biryani', 'sale');
    this.currencies = ['EUR', 'GBP'];
    this.payPalEnvironment= 'payPalEnvironmentSandbox';
		this.payPal.init({
			PayPalEnvironmentProduction: Config.payPalEnvironmentProduction,
			PayPalEnvironmentSandbox: Config.payPalEnvironmentSandbox
		}).then(() => {
			this.payPal.prepareToRender(this.payPalEnvironment, new PayPalConfiguration({})).then(() => {
				this.payPal.renderSinglePaymentUI(this.payment).then((response) => {

          alert(`Successfully paid. Status = ${response.response.state}`);
          alert(response);
          //console.log(response);
          this.cartService.checkout(this.authService.getLoggedUID() ,this.delivery_details);
          this.navCtrl.setRoot(OrdersPage);
					
				}, () => {
					console.error('Error or render dialog closed without being successful');
				});
			}, () => {
				console.error('Error in configuration');
			});
		}, () => {
			console.error('Error in initialization, maybe PayPal isn\'t supported or something else');
		});
	}






  
}

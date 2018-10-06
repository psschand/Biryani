import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,AlertController  } from 'ionic-angular';
import { EmailValidator } from '../../validators/email';
import { FormControl, FormGroup,FormBuilder, Validators } from '@angular/forms';

import { ProductsPage } from '../products/products';
import { RegisterPage } from '../register/register';
import { ForgotPassPage } from '../forgot-pass/forgot-pass';

import {AuthService} from '../../providers/auth.service';
import {SharedService} from '../../providers/shared.service';



import { ResetPassword } from '../reset-password/reset-password';
import { Signup } from '../signup/signup';

//import { FormBuilder, Control, ControlGroup, Validators, FORM_DIRECTIVES } from '@angular/common';
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [AuthService,SharedService]
})
export class LoginPage  {
  email1 : string; 
  password1 : string; 
  public loginForm;
  loading: any;


  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public authService: AuthService,
              public sharedService: SharedService,
              public formBuilder: FormBuilder,
              public alertCtrl: AlertController, 
              public loadingCtrl: LoadingController,
               
              public nav: NavController
             ) {
        this.authService.logout();
        this.loginForm = formBuilder.group({
          email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
          password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
      });
  }

 
  ionViewDidLoad() {
    if(this.authService.isLoggedIn()){
      this.navCtrl.setRoot(ProductsPage);
    }
  }

  login(){
    this.sharedService.showLoading(); // start loading

    // this.authService.login(this.email1,this.password1).then(value => {
    //   this.sharedService.hideLoading(); // stop loading
    //   this.navCtrl.setRoot(ProductsPage);
    //   console.log(this.email1,this.password1)
    // })
    // .catch(err => {
    //  // this.sharedService.hideLoading();
    //  console.log(err)
    //   this.sharedService.showToast("Something went wrong!")
    //   //this.navCtrl.setRoot(LoginPage);
    // });

  if (!this.loginForm.valid) {
      console.log(this.loginForm.value);
  } else {
  this.authService.login(this.email1,this.password1).then((user) => {
    this.sharedService.hideLoading(); // stop loading
    this.navCtrl.setRoot(ProductsPage);
  
  }, (error) => {
    var errorMessage: string = error.message;
    let errorAlert = this.alertCtrl.create({
        message: errorMessage,
        buttons: [
            {
                text: "Ok",
                role: 'cancel'
            }
        ]
    });
    errorAlert.present();
  });
  }
  
  
  
  }
  



  
  createAccount(): void{
    this.navCtrl.push(RegisterPage);
  }

  resetPassword():void{
    this.navCtrl.push(ForgotPassPage);
  }

// //--------------------------------------------------------------------------------------------------------------
// loginUser(): void {
//   if (!this.loginForm.valid) {
//       console.log(this.loginForm.value);
//   } else {
//       this.authService.loginUser(this.loginForm.value.email, this.loginForm.value.password).then(authData => {
//           this.loading.dismiss().then(() => {
//               this.nav.setRoot(LoginPage);
//           });
//       }, error => {
//           this.loading.dismiss().then(() => {
//               let alert = this.alertCtrl.create({
//                   message: error.message,
//                   buttons: [
//                       {
//                           text: "Ok",
//                           role: 'cancel'
//                       }
//                   ]
//               });
//               alert.present();
//           });
//       });

//       this.loading = this.loadingCtrl.create();
//       this.loading.present();
//   }
// }

// goToSignup(): void {
//   this.nav.push(Signup);
//  //this.navCtrl.push(Signup);
// }

// goToResetPassword(): void {
//   this.nav.push(ResetPassword);
//  // this.navCtrl.push(ResetPassword);
// }





}

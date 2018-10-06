import { Component } from '@angular/core';
//import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { IonicPage, NavController, NavParams,LoadingController,AlertController  } from 'ionic-angular';
import { ProductsPage } from '../products/products';
import { LoginPage } from '../login/login';
import { FormControl, FormGroup,FormBuilder, Validators } from '@angular/forms';
import { EmailValidator } from '../../validators/email';
import {AuthService} from '../../providers/auth.service';
import {SharedService} from '../../providers/shared.service';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
  providers: [AuthService,SharedService]
})
export class RegisterPage {
  email : string; 
  email1 : string; 
  password : string; 
  password1 : string; 
  public registerForm;
  loading: any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public authService: AuthService,
              public sharedService: SharedService,
              public formBuilder: FormBuilder,
              public alertCtrl: AlertController, 
              public loadingCtrl: LoadingController
             ) {
      this.authService.logout();
      this.registerForm = formBuilder.group({
        email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
        password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });
  }

  ionViewDidLoad() {
    if(this.authService.isLoggedIn()){
      this.navCtrl.setRoot(ProductsPage);
    }
  }


  register(){
    this.sharedService.showLoading();

  //   this.authService.signup(this.email1,this.password1).then(value => {
  //     this.sharedService.hideLoading();
  //     this.navCtrl.setRoot(ProductsPage);
  //   })
  //   .catch(err => {
  //     this.sharedService.hideLoading();
  //     this.sharedService.showToast("Something went wrong!")
  //     console.log(err)
  //     alert(err)
  //   });
  // }
  if (!this.registerForm.valid) {
    console.log(this.registerForm.value);
} else {
this.authService.signup(this.email1,this.password1).then((user) => {
  let alert = this.alertCtrl.create({
      message: "Account created",
      buttons: [
          {
              text: "Ok",
              role: 'cancel',
              handler: () => {
                  this.navCtrl.pop();
              }
          }
      ]
  });
  alert.present();

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
//alert("password reset email sent to your email id")


}


}

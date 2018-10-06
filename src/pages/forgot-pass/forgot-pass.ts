import { Component } from '@angular/core';
//import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { IonicPage, NavController, NavParams,LoadingController,AlertController  } from 'ionic-angular';
import { FormControl, FormGroup,FormBuilder, Validators } from '@angular/forms';
import { EmailValidator } from '../../validators/email';
import {AuthService} from '../../providers/auth.service';

@IonicPage()
@Component({
  selector: 'page-forgot-pass',
  templateUrl: 'forgot-pass.html',
  providers: [AuthService]
})
export class ForgotPassPage {
  email : string;
  email1 : string;
  ForgotPasswordForm:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthService,
              public formBuilder: FormBuilder,
              public alertCtrl: AlertController, 
              public loadingCtrl: LoadingController,public nav: NavController) {

                this.ForgotPasswordForm = formBuilder.group({
                  email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
                  password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
              });
  }

  recover(){

    this.authService.resetPassword(this.email1).then((user) => {
      let alert = this.alertCtrl.create({
          message: "We just sent you a reset link to your email",
          buttons: [
              {
                  text: "Ok",
                  role: 'cancel',
                  handler: () => {
                      this.nav.pop();
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

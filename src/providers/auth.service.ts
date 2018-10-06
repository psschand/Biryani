import {Injectable} from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {

  constructor(public firebaseAuth: AngularFireAuth) {
  }

  signup(email: string, password: string): firebase.Promise<any> {
    return this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password)
  }

  login(email: string, password: string) : firebase.Promise<any>{
    return this.firebaseAuth.auth.signInWithEmailAndPassword(email, password)
  }

  logout() {
    this.firebaseAuth.auth.signOut();
  }

  isLoggedIn(){
    if(this.firebaseAuth.auth.currentUser != null){
      return true;
    }else{
      return false;;
    }
  }

  getLoggedUID() : string{
    return this.firebaseAuth.auth.currentUser.uid;
  }
  
  recover(email){
    this.firebaseAuth.auth.sendPasswordResetEmail(email);
  }

//---------------------------------------------------------


  /**
   * [loginUser We'll take an email and password and log the user into the firebase app]
   * @param  {string} email    [User's email address]
   * @param  {string} password [User's password]
   */
  loginUser(email: string, password: string): firebase.Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
    
  }

  /**
   * [signupUser description]
   * This function will take the user's email and password and create a new account on the Firebase app, once it does
   * it's going to log the user in and create a node on userProfile/uid with the user's email address, you can use
   * that node to store the profile information.
   * @param  {string} email    [User's email address]
   * @param  {string} password [User's password]
   */
  signupUser(email: string, password: string): firebase.Promise<any> {
      return firebase.auth().createUserWithEmailAndPassword(email, password).then((newUser) => {
         // firebase.database().ref('/users').child(email).set({
          //    firstName: "anonymous",
           //   id:newUser.uid,
         // });
        firebase.database().ref('/userProfile').child(newUser.uid).set({
            firstName: "anonymous",
             email: email
      });
    });
  }

  /**
   * [resetPassword description]
   * This function will take the user's email address and send a password reset link, then Firebase will handle the
   * email reset part, you won't have to do anything else.
   *
   * @param  {string} email    [User's email address]
   */
  resetPassword(email: string): firebase.Promise<any> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  /**
   * This function doesn't take any params, it just logs the current user out of the app.
   */
  logoutUser(): firebase.Promise<any> {
    return firebase.auth().signOut();
  }










}
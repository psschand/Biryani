import { DateTime } from 'ionic-angular';
import {Injectable} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/take';
import { SharedService } from './shared.service';
import { stringify } from '@angular/core/src/util';
@Injectable()
export class CartService {
  items: any;
  odata:any;
  cnt:number;
  amount:any;
  cartItems : FirebaseListObservable<any>;
  orderItems: FirebaseListObservable<any>;
  del_address:any="vodafoneHQ,rg145nf"
  cartAmount : number  = 0;
  constructor(public db: AngularFireDatabase,
              private sharedService: SharedService
  ) {}
  
  loadCartList(userid : string)  {
     this.cartItems = this.db.list('cart/'+userid);

     this.cartItems.subscribe(
        (rows) => {
          this.cartAmount  = 0;
          rows.forEach(row => { 
            this.cartAmount = this.cartAmount + (row.quantity*row.price);
          });
        },
        (err) => {
          console.log('not authenticated');
        },
        () => { 
          console.log('done.');
        }
	  );

  };

  addCartItem(userid : string, product: any){
   

    this.loadCartList(userid);
    
    this.db.object(`cart/${userid}/${product.$key}`, {preserveSnapshot:true} ).first().subscribe(data => {
      if(data.val() !== null) {
        this.incrementCartItem(userid,product);
      } else {
        
        this.db.object('products/'+product.$key, { preserveSnapshot: true }).first().subscribe(productData =>{
        //%%%%%%%%%%%%%%%%

          if( productData.val().stock!=0 && productData.val().available == true){ 
       
            var cartItem : any =  {   
                image: product.image,
                name:  product.name,
                price: product.price,
                quantity:1
            }
            this.cartItems.update(product.$key , cartItem);
            this.sharedService.showToast("Item Added!");
          }else{
            this.sharedService.showToast("Item not Available");
          }
        //%%%%%%%%%%%%%%%%
        });

      }
    });


  };

  removeCartItem(userid : string, productId : string){
    this.loadCartList(userid);
    this.cartItems.remove(productId).then(_ => this.sharedService.showToast("Item removed!") );
  };

  decrementCartItem(userid : string, product : any){
    this.loadCartList(userid);
    
    this.db.object(`cart/${userid}/${product.$key}`, {preserveSnapshot:true} ).first().subscribe(data => {
      if(data.val() !== null) {

        if(data.val().quantity-1 > 0){
            this.cartItems.update(product.$key , {quantity: data.val().quantity - 1 });
        }else{
            this.removeCartItem(userid,product.$key);
        }

      }else{
          this.sharedService.showToast("No such element!");
      } 
    });
  };

  incrementCartItem(userid : string, product : any){
    
   

    this.loadCartList(userid);
    
    this.db.object(`cart/${userid}/${product.$key}`, {preserveSnapshot:true} ).first().subscribe(cartItem => {
      if(cartItem.val() !== null) {

        this.db.object('products/'+product.$key, { preserveSnapshot: true }).first().subscribe(productData =>{
        //%%%%%%%%%%%%%%%%

          if(cartItem.val().quantity+1 <= productData.val().stock && productData.val().available == true){ // checking cart stock
              console.log('Incremented Quantity Successfully');
              this.cartItems.update(product.$key , {quantity: cartItem.val().quantity + 1 });
          }else{
              this.sharedService.showToast('Quality exceeds the Stock!');
          }
          
        //%%%%%%%%%%%%%%%%
        });

      }else{
        this.sharedService.showToast('No such element to increment quantity!');
      } 
    });

  };
  





  // Order services
  checkout(userid: string, deliveryDetails : string ){

    // Loads the subscribed cart list
    this.loadCartList(userid);

    // loads the unsubscribed cart list
    var cartItemUnsubscribed = this.db.list('cart/'+userid).take(1);

    // Add items to orders
    var orderItem : FirebaseListObservable<any> = this.db.list('orders/'+userid);

    // Add items to orders
    var om : FirebaseListObservable<any> = this.db.list('om/');
    
   // create a list of items in an order
   this.items=[]
   this.odata=[]
   this.cnt=0
   this.amount=0
    
    // Because subscribed cart list would prevent adding items to cart after an order is created.
    cartItemUnsubscribed.forEach(rows => {
      console.log(rows)
      rows.forEach(cartItem => { 
        console.log(cartItem)
        cartItem.status = 1;
        cartItem.delivery = deliveryDetails;
        console.log(cartItem)
        // check if product is available
        this.db.object('products/'+cartItem.$key, { preserveSnapshot: true }).first().subscribe(productData =>{
        //%%%%%%%%%%%%%%%%
          if(cartItem.quantity <= productData.val().stock && productData.val().available== true){
            
            //get the push key value
            // var key = om.push().getKey();

            //then you can write in that node in this way
           // mDatabase.child("posts").child(key).setValue(yourValue)
           //-----------------------------
          //   var insertData = om.push(cartItem).then(ca=>{      
          //   var insertedKey = ca.getKey(); // last inserted key
          //   console.log("inserted key",insertedKey);
          //   cartItem.orderid=insertedKey;
          //   orderItem.push(cartItem); // add the item to orders
          // }   );
          //------------------------------------
          
          this.items[this.cnt]={ image:cartItem.image,name: cartItem.name,price:cartItem.price,quantity: cartItem.quantity}
          this.cnt=this.cnt+1
          this.amount=Number(this.amount)+(Number(cartItem.price)*Number(cartItem.quantity));
          var delverytime=Number(this.nextDate(5));
          console.log("delvertdate",delverytime)
          console.log("Actual cart amount",this.cartAmount)
          console.log("calculated amount",this.amount)
          this.odata={delivery:cartItem.delivery,status:cartItem.status,cartAmount:this.amount,deliveryDate:delverytime,createdtAt:Date.now()}

            this.cartItems.remove(cartItem.$key); // remove the item from the cart

            // decrement the item qty
            this.db.object('products/'+cartItem.$key+'/stock').set(productData.val().stock - cartItem.quantity);
       

          }
          
        //%%%%%%%%%%%%%%%%
        });
        
      });
    });
            this.odata.items= this.items
            //this.odata.cartAmount=this.cartAmount
            var insertData = om.push(this.odata).then(ca=>{      
            var insertedKey = ca.getKey(); // last inserted key
            console.log("inserted key",insertedKey);
            this.odata.orderid=insertedKey;
            orderItem.push(this.odata); // add the item to orders
          }   );
          console.log("odata",this.odata)

  }
  
//takes dayIndex from sunday(0) to saturday(6)

  nextDate(dayIndex):Date {
    var today = new Date();
    today.setDate(today.getDate() + (dayIndex - 1 - today.getDay() + 7) % 7 + 1);
    today.setHours(14,0,0)
    return today;
}

  loadOrders(userid: string){
    this.orderItems = this.db.list('orders/'+userid);
  };

  // Cancel services
cancelorder(userid: string, product : any ){
  this.db.object(`orders/${userid}/${product.$key}/status`).set('cancelled');
  this.db.object(`om/${product.orderid}/status`).set('cancelled');
  //var oid=  this.db.list(`orders/${userid}/${product.$key}/orderid`).take(1);
  // //console.log("userid:",userid,"/product:",product.$key,"/oid:",oid,"oid.orderid",oid.orderid)
  // this.db.object(`orders/${userid}/${product.$key}/status`).set('cancelled');
  console.log("orderid from ui:",product.orderid,product);


}


updateApp():any{

  this.db.object(`app/config/android/version`, {preserveSnapshot:true} ).first().subscribe(data => { 
      var str =data.val()
      return str ;
    
});
}



}

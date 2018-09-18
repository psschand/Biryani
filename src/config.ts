import { Injectable } from '@angular/core';

@Injectable()
export class Config {
	//public wordpressApiUrl = 'http://demo.titaniumtemplates.com/wordpress/?json=1';
    // Paypal
    //access_token$sandbox$dh23zq6gr2rvz4g6$5e450eb549597fc22d83cc9fa3136641
    //access_token$production$cyfwgfh8vjnzvttc$4103208df17accbdc745b490164f433d
    //sophia shop
    //AXg409-ZD7lFcgk2JdHkLkggX8u7LnT7cfkGL2AG0y7bx5OAvOmErpKKz5D68kzXRxbfe_KRlFf681rk
    //restaurent
    //Ab-aLex56H9Yy_uCUhcjwq_jUq9zJBnEGS62jZEYwGPgstRVlnRFvqV1XUFS2GXh6DZOXu2F2a2NEcxR
	static payPalEnvironmentSandbox = 'Ab-aLex56H9Yy_uCUhcjwq_jUq9zJBnEGS62jZEYwGPgstRVlnRFvqV1XUFS2GXh6DZOXu2F2a2NEcxR';
	static payPalEnvironmentProduction = '';
}

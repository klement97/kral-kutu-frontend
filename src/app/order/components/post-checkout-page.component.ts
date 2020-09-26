import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/order/services/order.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-post-checkout-page',
  template: `
      <p>
          post-checkout-page works!
      </p>
  `,
  styles: []
})
export class PostCheckoutPageComponent implements OnInit {

  orderID: number;


  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute
  ) {
    this.orderID = +route.snapshot.paramMap.get('order_id');
  }


  ngOnInit(): void {
  }


  getOrder() {}

}

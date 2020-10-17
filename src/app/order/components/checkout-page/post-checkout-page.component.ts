import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/order/services/order.service';
import { ActivatedRoute } from '@angular/router';
import { Order } from 'src/app/order/order.model';


@Component({
  selector: 'app-post-checkout-page',
  template: `
      <p>
          post-checkout-page works!
      </p>
      <p>
          Order ID: {{orderID}}
      </p>
      <pre>
          {{order}}
      </pre>
  `,
  styles: []
})
export class PostCheckoutPageComponent implements OnInit {

  orderID: number;
  order: Order;


  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute
  ) {
    this.orderID = +route.snapshot.paramMap.get('order_id');
  }


  ngOnInit(): void {
  }


  getOrder() {
    this.orderService.getOrder(this.orderID).subscribe((order) => this.order = order);
  }

}

import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/order/services/order.service';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-checkout',
  template: `
      <p>
          checkout works!
      </p>
  `,
  styles: []
})
export class CheckoutComponent implements OnInit {

  productsInCart: BehaviorSubject<any[]>;

  constructor(
    private orderService: OrderService
  ) {
    this.productsInCart = orderService.productsInCart;
  }

  ngOnInit(): void {
  }

}

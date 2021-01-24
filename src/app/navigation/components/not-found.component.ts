import { Component, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-not-found',
  template: `
      <ng-container *transloco="let t">
          <div class="wrapper">
              <div class="image">
                  <img id="img" src="../../../assets/images/404.jpg" alt="not found image">
              </div>
              <button mat-raised-button routerLink="/" queryParamsHandling="preserve">
                  {{t('return home')}}
              </button>
          </div>
      </ng-container>
  `,
  styles: [`
      .wrapper {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
      }

      .image {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 80vh;
      }

      img {
          width: 65%;
      }

      button {
          background-color: rgba(50, 50, 50, 1);
          color: white;
      }

      @media only screen and (max-width: 950px) {
          img {
              width: 75%;
          }
      }

      @media only screen and (max-width: 800px) {
          img {
              width: 80%;
          }
      }

      @media only screen and (max-width: 600px) {
          img {
              width: 100%;
          }
      }

      @media only screen and (max-width: 400px) {
          img {
              width: 110%;
          }
      }
  `]
})
export class NotFoundComponent implements OnInit {

  constructor() { }


  ngOnInit(): void {
  }

}

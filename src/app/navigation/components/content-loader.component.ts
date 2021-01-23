import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-content-loader',
  template: `
      <div style="height: 10px">
          <mat-progress-bar color="primary" mode="indeterminate"></mat-progress-bar>
      </div>
  `,
  styles: []
})
export class ContentLoaderComponent implements OnInit {

  constructor() { }


  ngOnInit(): void {
  }

}

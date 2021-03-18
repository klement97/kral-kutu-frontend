import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';


// tslint:disable-next-line:directive-selector
@Directive({selector: 'img'})
export class LazyImageDirective implements AfterViewInit {
  @Input() src: string;
  el: HTMLImageElement;


  static hasLoadAttributeSupport() {
    return 'loading' in HTMLImageElement.prototype;
  }


  static hasIntersectionObserverSupport() {
    return window && 'IntersectionObserver' in window;
  }


  constructor({nativeElement}: ElementRef<HTMLImageElement>) {
    this.el = nativeElement;
  }


  ngAfterViewInit() {
    if (LazyImageDirective.hasLoadAttributeSupport()) {
      this.el.setAttribute('loading', 'lazy');
      this.loadImage();
    } else if (LazyImageDirective.hasIntersectionObserverSupport()) {
      this.lazyLoadImage();
    } else {
      this.loadImage();
    }
  }


  private lazyLoadImage() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(({isIntersecting}) => {
        if (isIntersecting) {
          this.loadImage();
          obs.unobserve(this.el);
        }
      });
    });
    obs.observe(this.el);
  }


  private loadImage() {
    this.el.src = this.src;
  }

}

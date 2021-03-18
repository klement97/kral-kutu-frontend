import { LazyImageDirective } from 'src/app/common/lazy-image.directive';

describe('LazyImageDirective', () => {
  it('should create an instance', () => {
    const directive = new LazyImageDirective(null);
    expect(directive).toBeTruthy();
  });
});

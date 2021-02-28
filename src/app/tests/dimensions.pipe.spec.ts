import { DimensionsPipe } from 'src/app/common/dimensions.pipe';


describe('DimensionsPipe', () => {
  const pipe = new DimensionsPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string if one of dimensions are missing', () => {
    const product = {width: null, height: 10.2, length: ''};
    expect(pipe.transform(product)).toBe('');
  });

  it('should return dimensions separated by `x` ', () => {
    const product = {width: 24.56, height: 10.2, length: '10'};

    expect(pipe.transform(product)).toContain('x');
  });

  it('should return dimension in a certain order', () => {
    const product = {width: 24.56, height: 10.2, length: '10'};
    const expected = `${product.width} x ${product.length} x ${product.height}`;

    expect(pipe.transform(product)).toBe(expected);
  });
});

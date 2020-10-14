import { IfNotNullPipe } from 'src/app/common/if-not-null.pipe';


describe('IfNotNullPipe', () => {
  const pipe = new IfNotNullPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return `--` when the last property in the list is not found', () => {
    const value = {obj: {product: {code: '123'}}};
    const output = pipe.transform(value, 'obj.product.width');

    expect(output).toBe('--');
  });

  it('should NOT prefix/suffix the output if no prefix/suffix provided', () => {
    const value = {obj: {product: {code: '123', width: '10'}}};
    const output = pipe.transform(value, 'obj.product.width');

    expect(output).toBe('10');
  });

  it('should prefix the output with second args value', () => {
    const value = {obj: {product: {code: '123', width: '10'}}};
    const prefix = 'width is: ';
    const output = pipe.transform(value, 'obj.product.width', prefix);

    expect(output).toBe(`${prefix}10`);
  });

  it('should suffix the output with the third args value', () => {
    const value = {obj: {product: {code: '123', width: '10'}}};
    const suffix = 'cm';
    const output = pipe.transform(value, 'obj.product.width', '', suffix);

    expect(output).toBe(`10${suffix}`);
  });
});

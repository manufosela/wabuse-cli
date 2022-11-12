import chai from 'chai';
import wabuse from '../lib/wabuse.cjs';

const { expect } = chai;


describe('wabuse', () => {
  it('init method', async () => {
    expect(wabuse).to.haveOwnProperty('init').to.be.a('function');
  });
});
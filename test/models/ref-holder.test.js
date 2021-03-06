import RefHolder from '../../lib/models/ref-holder';

describe('RefHolder', function() {
  let sub;

  afterEach(function() {
    if (sub) { sub.dispose(); }
  });

  it('begins empty', function() {
    const h = new RefHolder();
    assert.isTrue(h.isEmpty());
    assert.throws(() => h.get(), /empty/);
  });

  it('does not become populated when assigned null', function() {
    const h = new RefHolder();
    h.setter(null);
    assert.isTrue(h.isEmpty());
  });

  it('provides synchronous access to its current value', function() {
    const h = new RefHolder();
    h.setter(1234);
    assert.isFalse(h.isEmpty());
    assert.strictEqual(h.get(), 1234);
  });

  it('notifies subscribers when it becomes available', function() {
    const h = new RefHolder();
    const callback = sinon.spy();
    sub = h.observe(callback);

    h.setter(1);
    assert.isTrue(callback.calledWith(1));

    h.setter(2);
    assert.isTrue(callback.calledWith(2));

    sub.dispose();

    h.setter(3);
    assert.isFalse(callback.calledWith(3));
  });

  it('immediately notifies new subscribers if it is already available', function() {
    const h = new RefHolder();
    h.setter(12);

    const callback = sinon.spy();
    sub = h.observe(callback);
    assert.isTrue(callback.calledWith(12));
  });

  describe('.on()', function() {
    it('returns an existing RefHolder as-is', function() {
      const original = new RefHolder();
      const wrapped = RefHolder.on(original);
      assert.strictEqual(original, wrapped);
    });

    it('wraps a non-RefHolder value with a RefHolder set to it', function() {
      const wrapped = RefHolder.on(9000);
      assert.isFalse(wrapped.isEmpty());
      assert.strictEqual(wrapped.get(), 9000);
    });
  });
});

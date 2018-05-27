/**
 * @typedef {Object} el
 * @property{Function} dispatchEvent
 * @property {Function} [el.fireEvent]
 */
function eventFire(el, eventType) {
    if (el.fireEvent) {
        el.fireEvent('on' + eventType);
    } else {
        const evObj = document.createEvent('Events');
        evObj.initEvent(eventType, true, false);
        el.dispatchEvent(evObj);
    }
}

describe('CHIMDoc, CHIMNode, & CHIMList', () => {
    after(() => {
        testStatus.text('Complete!');
    });

    const testStatus = chim('#test-status');

    it('creates a CHIMDoc given a document object', (done) => {
        testStatus.text('Starting DOM tests...');
        testStatus.text('Creating CHIMDoc...');
        const chimDoc = chim(document);
        assert.isDefined(chimDoc.onReady);
        done();
    });

    it('creates a CHIMNode given an ID', (done) => {
        testStatus.text('Creating CHIMNode with ID...');
        const chimNode = chim('#test-id-1');
        assert.isDefined(chimNode._node);
        assert.isTrue(chimNode._node instanceof HTMLElement);
        done();
    });

    it('creates a CHIMNode given a class name', (done) => {
        testStatus.text('Creating CHIMNode with class name...');
        const chimNode = chim('.test-class');
        assert.isDefined(chimNode._list);
        assert.isTrue(chimNode._list[0] instanceof HTMLElement);
        done();
    });

    it('creates a CHIMNode given a tag name', (done) => {
        testStatus.text('Creating CHIMNode with tag name...');
        const chimNode = chim('div');
        assert.isDefined(chimNode._list);
        assert.isTrue(chimNode._list[0] instanceof HTMLElement);
        done()
    });

    it('modifies a CHIMList', (done) => {
        const testClass = chim('.test-class');
        const txt = 'Initializing chimification';

        testClass.text(txt);
        assert.deepEqual([txt, txt], testClass.text());
        done();
    });

    it('modifies the attributes of a CHIMNode', (done) => {
        testStatus.text('Modifying text of title and subtitle CHIMNodes...');
        const title = chim('#test-id-1');
        const titleText = 'Age of Chim';
        title.text(titleText);
        assert.equal(title._node.innerHTML, titleText);

        const subtitle = chim('#test-id-2');
        const subtitleText = 'Adventure Awaits!';
        subtitle.text(subtitleText);
        assert.equal(subtitle._node.innerHTML, subtitleText);

        const testClass = chim('.test-class');
        assert.deepEqual([titleText, subtitleText], testClass.text());
        done();
    });


    it('modifies the styles of a CHIMNode', (done) => {
        testStatus.text('Modifying styles / displaying title and subtitle CHIMNodes...');
        const title = chim('#test-id-1');
        title.applyCss('font-family', 'Rayman Adventures');
        title.applyCss('color', 'rgb(255, 187, 0)');
        title.applyCss('font-size', '75px');

        assert.equal(title._node.style.fontSize, '75px');

        title.applyCss('display', 'block');

        const subtitle = chim('#test-id-2');
        subtitle.applyCss('font-family', 'Impact');
        subtitle.applyCss('display', 'block');
        done();
    });

    it('adds, removes, and toggles a CSS class', (done) => {
        testStatus.text('Inverting colors...');
        const testDiv = chim('#dom-test');
        testDiv.addClass('invert');
        testDiv.removeClass('invert');
        testDiv.toggleClass('invert', true);
        done();
    });

    it('adds multiple CSS classes', (done) => {
        testStatus.text('Adding borders...');
        const testDiv = chim('#dom-test');
        testDiv.addClasses('bb', 'rb', 'lb', 'tb');
        done();
    });

    it('appends and removes a CHIMNode to the DOM', (done) => {
        testStatus.text('Replacing subtitle with input...');
        const subtitle = chim('#test-id-2');
        subtitle.remove();

        const input = document.createElement('input');
        input.id = 'change-input';
        const subtitleInput = chim(input);
        subtitleInput.appendTo(chim('#dom-test'));
        done();
    });

    it('focuses on a CHIMNode', (done) => {
        testStatus.text('Adding text to input...');
        const subtitleInput = chim('#change-input');
        subtitleInput.focus();

        const newSubtitle = 'Heroes Only!';
        subtitleInput.prop('value', newSubtitle);
        subtitleInput.prop('disabled', false);
        assert.equal(newSubtitle, subtitleInput.value());
        done();
    });

    it('responds to keyboard, mouse, and form events', (done) => {
        const subtitleInput = chim('#change-input');
        const btn = chim('#test-btn');

        btn.onClick((e) => {
            btn.remove();
            assert.isDefined(e);
            assert.equal(e.type, 'click');

            const value = subtitleInput.value();
            subtitleInput.remove();
            const div = document.createElement('div');
            div.id = 'test-id-2';
            const subtitle = chim(div);
            subtitle.addClass('test-class');
            subtitle.text(value);
            subtitle.applyCss('font-family', 'Impact');
            subtitle.applyCss('display', 'block');
            subtitle.appendTo(chim('#dom-test'));
        });

        // assert other listeners are defined
        assert.isDefined(subtitleInput.onKeydown);
        assert.isDefined(subtitleInput.onKeypress);
        assert.isDefined(subtitleInput.onSubmit);

        testStatus.text('Testing click event...');
        eventFire(btn._node, 'click');
        done();
    });
});

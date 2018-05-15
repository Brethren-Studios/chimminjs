describe('CHIMNode', () => {
    const testStatus = chim('#test-status');

    it('creates a CHIMDoc given a document object', (done) => {
        testStatus.text('Starting DOM tests...');
        testStatus.text('Creating CHIMDoc...');
        setTimeout(() => {
            const chimDoc = chim(document);
            assert.isDefined(chimDoc.onReady);
            done();
        }, 1000);
    });

    it('creates a CHIMNode given an ID', (done) => {
        testStatus.text('Creating CHIMNode with ID...');
        setTimeout(() => {
            const chimNode = chim('#test-id-1');
            assert.isDefined(chimNode._node);
            assert.isTrue(chimNode._node instanceof HTMLElement);
            assert.isFalse(chimNode._isNodeList);
            done();
        }, 1000);
    });

    it('creates a CHIMNode given a class name', (done) => {
        testStatus.text('Creating CHIMNode with class name...');
        setTimeout(() => {
            const chimNode = chim('.test-class');
            assert.isDefined(chimNode._node);
            assert.isTrue(chimNode._node[0] instanceof HTMLElement);
            assert.isTrue(chimNode._isNodeList);
            done();
        }, 500);
    });

    it('creates a CHIMNode given a tag name', (done) => {
        testStatus.text('Creating CHIMNode with tag name...');
        setTimeout(()=> {
            const chimNode = chim('div');
            assert.isDefined(chimNode._node);
            assert.isTrue(chimNode._node[0] instanceof HTMLElement);
            assert.isTrue(chimNode._isNodeList);
            done()
        }, 500);
    });

    it('modifies the attributes of a CHIMNode', (done) => {
        testStatus.text('Modifying text of title and subtitle CHIMNodes...');
        setTimeout(()=> {
            const title = chim('#test-id-1');
            const titleText = 'Age of Chim';
            title.text(titleText);
            assert.equal(title._node.innerHTML, titleText);

            const subtitle = chim('#test-id-2');
            const subtitleText = 'Adventure Awaits!';
            subtitle.text(subtitleText);
            assert.equal(subtitle._node.innerHTML, subtitleText);
            done();
        }, 500);
    });

    it('modifies the styles of a CHIMNode', (done) => {
        testStatus.text('Modifying styles / displaying title and subtitle CHIMNodes...');
        setTimeout(() => {
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
        }, 500);
    });

    it('adds, removes, and toggles CSS classes', (done) => {
        testStatus.text('Inverting colors...');
        const testDiv = chim('#dom-test');
        setTimeout(() => {
            testDiv.addClass('invert');
        }, 500);
        setTimeout(() => {
            testDiv.removeClass('invert');
        }, 1000);
        setTimeout(() => {
            testDiv.toggleClass('invert', true);
            done();
        }, 1500);
    });

    it('appends and removes a CHIMNode to the DOM', (done) => {
        testStatus.text('Replacing subtitle with input...');
        setTimeout(() => {
            const subtitle = chim('#test-id-2');
            subtitle.remove();

            const input = document.createElement('input');
            input.id = 'change-input';
            const subtitleInput = chim(input);
            subtitleInput.appendTo(chim('#dom-test'));
            done();
        }, 500);
    });

    it('modifies the attributes of a CHIMNode', (done) => {
        testStatus.text('Adding text to input...');
        setTimeout(() => {
            const subtitleInput = chim('#change-input');
            const newSubtitle = 'Heroes Only!';
            subtitleInput.prop('value', newSubtitle);
            assert.equal(newSubtitle, subtitleInput.value());
            done();
        }, 500);
    });

    it('responds to keyboard, mouse, and form events', (done) => {
        const subtitleInput = chim('#change-input');
        const btn = chim('#test-btn');

        function eventFire(el, etype){
            if (el.fireEvent) {
                el.fireEvent('on' + etype);
            } else {
                const evObj = document.createEvent('Events');
                evObj.initEvent(etype, true, false);
                el.dispatchEvent(evObj);
            }
        }

        btn.onClick((e) => {
            btn.remove();
            assert.isDefined(e);
            assert.equal(e.type, 'click');

            const value = subtitleInput.value();
            subtitleInput.remove();
            const div = document.createElement('div');
            div.id = 'test-id-2';
            const subtitle = chim(div);
            subtitle.text(value);
            subtitle.applyCss('display', 'block');
            subtitle.appendTo(chim('#dom-test'));
        });

        testStatus.text('Testing click event...');
        setTimeout(() => {
            eventFire(btn._node, 'click');
            done();
        }, 500);
    });
});

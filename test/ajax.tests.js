const assert = chai.assert;

describe('CHIMAjax Service', () => {
    const formData = [
        { name: 'field1', value: 'value1'},
        { name: 'field2', value: 'value2'}
    ];

    const jsonData = {
        field1: 'value1',
        field2: 'value2'
    };

    it('sends a GET request', (done) => {
        chim.go.get('http://httpbin.org/get', (response) => {
            assert.isDefined(response);
            assert.isDefined(response.args);
            assert.isEmpty(response.args);
            done();
        });
    });

    it('fails to send a GET request if no URL is provided', (done) => {
        try {
            chim.go.get();
        } catch (err) {
            assert.isDefined(err);
            done();
        }
    });

    it('sends a GET request with data url-encoded', (done) => {
       chim.go.get('http://httpbin.org/get', formData, (response) => {
           assert.isDefined(response);
           assert.hasAllKeys(response.args, ['field1', 'field2']);
           done();
       });
    });

    it('sends a POST request with form data URL-encoded', (done) => {
       chim.go.post('http://httpbin.org/post', formData, (response) => {
           assert.isDefined(response);
           assert.hasAllKeys(response.args, ['field1', 'field2']);
           done();
       });
    });

    it('sends a POST request with data in JSON format', (done) => {
        chim.go.post('http://httpbin.org/post', jsonData, (response) => {
            assert.isDefined(response);
            assert.hasAllKeys(JSON.parse(response.data), ['field1', 'field2']);
            done();
        });
    });

    it('sends a PUT request with data in JSON format', (done) => {
       chim.go.put('http://httpbin.org/put', jsonData, (response) => {
           assert.isDefined(response);
           assert.hasAllKeys(JSON.parse(response.data), ['field1', 'field2']);
           done();
       });
    });
});
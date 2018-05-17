const assert = chai.assert;

describe('CHIMAjax Service', () => {
    let field1 = 'field1',
        field2 = 'field2',
        value1 = 'value1',
        value2 = 'value2';
    const formData = [
        { name: field1, value: value1 },
        { name: field2, value: value2 }
    ];

    const jsonData = {
        field1: value1,
        field2: value2
    };

    /**
     * http.bin.org/VERB sends back your VERB as the response data
     */

    it('sends a GET request', (done) => {
        chim.go.get('http://httpbin.org/get', (response) => {
            const getRequest = response;
            assert.isDefined(getRequest);
            assert.isDefined(getRequest);
            assert.isEmpty(getRequest.args);
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

    it('sends a GET request with data URL-encoded', (done) => {
       chim.go.get('http://httpbin.org/get', formData, (response) => {
           const getRequest = response;
           assert.isDefined(getRequest);
           assert.hasAllKeys(getRequest.args, [field1, field2]);
           done();
       });
    });

    it('sends a GET request for a plain text file', (done) => {
       chim.go.get('http://httpbin.org/robots.txt', (textFileContents) => {
           assert.isDefined(textFileContents);
           done();
       });
    });

    it('sends a GET request for an HTML document', (done) => {
        chim.go.get('http://httpbin.org/html', (html) => {
           assert.isDefined(html);
           assert.isTrue(html instanceof HTMLDocument);
           done();
        }, 'document');
    });

    it('sends a GET request for an image in binary format (blob)', (done) => {
        chim.go.get('http://httpbin.org/image/png', (image) => {
            assert.isDefined(image);
            done();
        });
    });

    it('sends a POST request with form data URL-encoded', (done) => {
       chim.go.post('http://httpbin.org/post', formData, (response) => {
           const postRequest = response;
           assert.isDefined(postRequest);
           assert.hasAllKeys(postRequest.args, [field1, field2]);
           done();
       });
    });

    it('sends a POST request with data in JSON format', (done) => {
        chim.go.post('http://httpbin.org/post', jsonData, (response) => {
            const postRequestWithData = response;
            assert.isDefined(postRequestWithData);
            assert.hasAllKeys(JSON.parse(postRequestWithData.data), [field1, field2]);
            done();
        });
    });

    it('sends a PUT request with data in JSON format', (done) => {
       chim.go.put('http://httpbin.org/put', jsonData, (response) => {
           const putRequest = response;
           assert.isDefined(putRequest);
           assert.hasAllKeys(JSON.parse(putRequest.data), [field1, field2]);
           done();
       });
    });
});
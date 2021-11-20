const request = require('supertest');
const app = require('../index');

let show_ID = 101;
let item_ID =  1231

describe('API Routes Test', function(){
	it('should create or update inventory', async () => {
	    const res = await request(app)
	      .post('/inventory')
	      .send({
	      	stock: [{"itemID":item_ID,"itemName":"test", "quantity":4}]
	      });

	    expect(res.statusCode).toEqual(201);

	    expect(res.body).toHaveProperty('error');
	});

	it('should purchase item', async () => {
	    const res = await request(app)
	      .post(`/show/${show_ID}/buy_item/${item_ID}`)
	      .send({});

	    expect(res.statusCode).toEqual(200);
	});

	it('should fetch all sold items', async () => {
	    const res = await request(app).get(`/show/${show_ID}/sold_items/${item_ID}`);
	    expect(res.statusCode).toEqual(200);
	});
});
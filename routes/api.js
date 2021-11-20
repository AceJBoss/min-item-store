/**
|----------------------------------
| Api Route
|----------------------------------
*/

const express = require("express");
const router = express.Router();
	
var inventoryDB= [];
var soldItemsDB  =  [];

/**
 * @swagger
 * /inventory:
 *   post:
 *     tags:
 *       - API
 *     name: Create New Inventory
 *     summary: Create New Inventory
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             stock:
 *               type: list
 *         required:
 *           - stock
 *     responses:
 *       '201':
 *         description: Inventory created successfully
 *       '203':
 *         description: Failed to create Inventory
 *       '403':
 *         description: No auth token
 *       '500':
 *         description: Internal server error
 */
// create inventory
router.post("/inventory", (req, res)=>{
	// collect data
	let { stock }  =  req.body
	// var itemIDV = 123;
	var itemName,id,quantity,obj;


	stock.forEach((item)=>{

		id = parseInt(item.itemID);
		itemName= item.itemName;
		quantity= item.quantity;

		// check if record exist
		var checkRecord = inventoryDB.find(({itemID}) => itemID === id)
		if(checkRecord != undefined){
			// get index
			var getIndex =  inventoryDB.findIndex(({itemID}) => itemID === id);
			// update already exisiting record
			obj = {
				itemID:id,
				itemName:itemName,
				quantity:quantity
			}

			inventoryDB[getIndex] = obj;
		}else{

			// proceed to create record
			obj =  {
				itemID:id,
				itemName:itemName,
				quantity:quantity
			}

			inventoryDB.push(obj);

		}
	})
	console.log("InventoryDB==>", inventoryDB);

	return res.status(201).json({
		error:false,
		message:"Inventory added successfully."
	});
});


/**
* @swagger
* /show/{show_ID}/buy_item/{item_ID}:
*   post:
*     tags:
*       - API
*     name: Buy item
*     summary: Buy Item
*     security:
*       - bearerAuth: []
*     consumes:
*       - application/json
*     produces:
*       - application/json
*     parameters:
*       - in: path
*         name: show_ID
*         schema:
*           type: integer
*         required:
*           - show_ID
*       - in: path
*         name: item_ID
*         schema:
*           type: integer
*         required:
*           - item_ID
*     responses:
*       200:
*         description: display success message
*       500:
*         description: Internal server error
*/
// buy inventory
router.post("/show/:show_ID/buy_item/:item_ID", (req, res)=>{
	// collect data
	var show_ID = req.params.show_ID;
	var item_ID = req.params.item_ID;

	item_ID = parseInt(item_ID);

	// fetch record
	var fetchRecord = inventoryDB.find(({itemID}) => itemID === item_ID);

	if(fetchRecord == undefined){
		return res.status(204).json({
			error:true,
			message:"No record found"
		});
	}


	// check quantity
	if(fetchRecord.quantity < 1){
		return res.status(203).json({
			error:true,
			message:"All inventory has been sold out."
		});
	}
	
	// get index
	var getIndex =  inventoryDB.findIndex(({itemID}) => itemID === item_ID);

	// update quantity to effect sold
	inventoryDB[getIndex].quantity =  parseInt(fetchRecord.quantity) - 1;

	//  check for sold item
	var getSoldItems = soldItemsDB.filter(data => data.itemID == item_ID && data.show_ID == show_ID)

	if(getSoldItems.length  == 1){
		getSoldItems.forEach((item, index)=>{
			// update quantity
			soldItemsDB[index].quantity = parseInt(item.quantity) + 1;
		});
	}else{

		// save sold item;
		var obj = {
			show_ID:show_ID,
			itemID:fetchRecord.itemID,
			itemName:fetchRecord.itemName,
			quantity:1
		}


		soldItemsDB.push(obj);
	}

	console.log("SoldItemsDB===>", soldItemsDB);

	return res.status(200).json({
		error:false,
		message:"Item purchased successfully."
	});
});

/**
* @swagger
* /show/{show_ID}/sold_items/{item_id}:
*   post:
*     tags:
*       - API
*     name: Display sold items
*     summary: Display sold items
*     security:
*       - bearerAuth: []
*     consumes:
*       - application/json
*     produces:
*       - application/json
*     parameters:
*       - in: path
*         name: show_ID
*         schema:
*           type: integer
*         required:
*           - show_ID
*       - in: path
*         name: item_ID
*         schema:
*           type: integer
*         required:
*           - item_ID
*     responses:
*       200:
*         description: display sold items
*       500:
*         description: Internal server error
*/
// fetch sold items
router.get('/show/:show_ID/sold_items/:item_id', (req, res)=>{
	// collect data
	var show_ID = req.params.show_ID;
	var item_id = req.params.item_id;
	var soldItems;

	if(item_id == undefined){	
		soldItems = soldItemsDB.filter(data => data.show_ID == show_ID);
	}else{
		soldItems = soldItemsDB.filter(data => data.itemID == item_id && data.show_ID == show_ID);

		if(soldItems.length == 1){
			delete soldItems[0].show_ID;
			soldItems =  soldItems[0];
		}
	}

	return res.status(200).json({
		error:false,
		data:soldItems
	});
});

module.exports = router;
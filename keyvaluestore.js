  var AWS = require('aws-sdk');
  AWS.config.loadFromPath('./config.json');

  var db = new AWS.DynamoDB();

  function keyvaluestore(table) {
    this.LRU = require("lru-cache");
    this.cache = new this.LRU({ max: 500 });
    this.tableName = table;
  };

  /**
   * Initialize the tables
   * 
   */
  keyvaluestore.prototype.init = function(whendone) {
    var tableName = this.tableName;
    var self = this;
    var params = {
      TableName: tableName /* required */
    };
    db.waitFor('tableExists', params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else 
        whendone();
    });
    

  };

  /**
   * Get result(s) by key
   * 
   * @param search
   * 
   * Callback returns a list of objects with keys "inx" and "value"
   */
  
keyvaluestore.prototype.get = function(search, callback) {
    var self = this;
    if (self.cache.get(search))
          callback(null, self.cache.get(search));
    else {
      var items =[];
      var params = {
			  ExpressionAttributeValues: {
			   ":v1": {
				 S: search
				}
			  }, 
			  KeyConditionExpression: "keyword = :v1", 
			  //ProjectionExpression: "SongTitle", 
			  TableName: this.tableName
		 };
		 db.query(params, function(err, data) {
		   if (err) console.log(err, err.stack); // an error occurred
		   else{
         data.Items.forEach((item) => {
           if(item['inx']!= undefined && item['inx']!=null){
             items.push({'inx': parseInt(item['inx']['N']), 'value': item['url']['S'] , 'key': item['keyword']['S'] })
           }
           else{
            items.push({'value': item['url']['S'],  'key':  item['keyword']['S']})
          }
      // items.push({'inx': item['inx']['N'], 'value': item['url']['S'], 'key': item['keyword']['S']})
          self.cache.set(search, items);
          callback(err,items);
    });
      }
		});       
    }
  };


  module.exports = keyvaluestore;

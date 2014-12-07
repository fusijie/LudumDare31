/**
 * Created by Jacky on 14/12/7.
 */

var CONST_ITEM_TIME = 3;
var CONST_ITEM_RANDOM_FACTOR = 0.5;

ItemController = function(){

    this.scheduleTime = 5;
    this.update = function(dt) {
        this.scheduleTime -= dt;
        if(this.scheduleTime <= 0){
            //show item
            //var random_item_index = Math.ceil(Math.random()*5);
            var random_item_index = 0;
            var item = new Item(random_item_index);
            currentLayer.addChild(item,100);
            this.scheduleTime = CONST_ITEM_TIME*(1+CONST_ITEM_RANDOM_FACTOR*Math.random());
        }
    };


};
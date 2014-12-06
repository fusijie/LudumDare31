GameController = function(blue, red){
    //if(blue == undefined || red == undefined) return;

    this.blue = blue;
    this.red = red;
    this.update = function(dt) {//TODO:要加入dt
        this.borderCross(dt);
    };
    this.borderCross = function(dt)
    {
        //border cross.
        this.checkBorderCross(this.blue);
        this.checkBorderCross(this.red);

        //check collision
    };
    this.checkBorderCross = function(obj)
    {
        var obj_pos = obj.getPosition();
        if(obj_pos.x<0)
        {
            obj.setPositionX(cc.winSize.width);
        }
        else if(obj_pos.x>cc.winSize.width)
        {
            obj.setPositionX(0);
        }
        else if(obj_pos.y<0)
        {
            obj.setPositionY(cc.winSize.height);
        }
        else if(obj_pos.y>cc.winSize.height)
        {
            obj.setPositionY(0);
        }
    };
    this.checkHeroCollisiojn = function()
    {

    };

};
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
        var blue_pos = this.blue.getPosition();
        if(blue_pos.x<0)
        {
            this.blue.setPositionX(cc.winSize.width);
        }
        else if(blue_pos.x>cc.winSize.width)
        {
            this.blue.setPositionX(0);
        }
        else if(blue_pos.y<0)
        {
            this.blue.setPositionY(cc.winSize.height);
        }
        else if(blue_pos.y>cc.winSize.height)
        {
            this.blue.setPositionY(0);
        }

        var red_pos = this.red.getPosition();
        if(red_pos.x<0)
        {
            this.red.setPositionX(cc.winSize.width);
        }
        else if(red_pos.x>cc.winSize.width)
        {
            this.red.setPositionX(0);
        }
        else if(red_pos.y<0)
        {
            this.red.setPositionY(cc.winSize.height);
        }
        else if(red_pos.y>cc.winSize.height)
        {
            this.red.setPositionY(0);
        }

        //check collision
    }

};
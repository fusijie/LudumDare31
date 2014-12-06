GameController = function(blue, red){
    //if(blue == undefined || red == undefined) return;

    this.blue = blue;
    this.red = red;
    this.update = function(dt) {//TODO:要加入dt
        this.borderCross(dt);
        this.checkHeroCollision(dt);
    };
    this.borderCross = function(dt)
    {
        //border cross.
        this.checkBorderCross(this.blue);
        this.checkBorderCross(this.red);

        //check collision
        this.checkHeroCollision(dt);
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
    this.checkHeroCollision = function(dt)
    {
        var miniDistance = this.blue.radius + this.red.radius;
        var blue_Pos = this.blue.getPosition();
        var red_Pos = this.red.getPosition();
        var tempDistance = cc.pDistance(blue_Pos,red_Pos);

        if(tempDistance < miniDistance)
        {
            var angel = cc.pToAngle(cc.pSub(blue_Pos,red_Pos));
            var distance = miniDistance - tempDistance + 1;
            var distance1 = (1-this.blue.mass/(this.blue.mass+this.red.mass))*distance;
            var distance2 = distance - distance1;
            this.blue.setPosition(cc.pRotateByAngle(cc.pAdd(cc.p(distance1,0),blue_Pos),blue_Pos,angel));
            this.red.setPosition(cc.pRotateByAngle(cc.pAdd(cc.p(-distance2,0),red_Pos),red_Pos,angel));
        }
    };

};
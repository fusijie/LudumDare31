/**
 * Created by Jacky on 14/12/6.
 */

var CONST_MOVE_SPEED = 50;
var CONST_INCREASE_BASE_ANGEL = 1;
var CONST_INCREASE_TOWER_ANGEL = 3;
var STATUS =  {IDLE: "idle", MOVE: "move", ROLL: "roll", SHOOT: "shoot", DEAD: "dead", WIN: "win"};

var Hero = cc.Node.extend({
    colortype: null,
    base: null,
    tower: null,
    aimer: null,
    initPos: null,
    base_angel:0,
    tower_angel: 0,
    status: STATUS.IDLE,
    ctor: function(colortype) {
        this._super();

        this.colortype = colortype;

        //add entity
        var spriteFrameName = "";
        var aimerFrameName = "";
        if(this.colortype == g_ColorType.blue)
        {
            spriteFrameName = res.Blue;
            aimerFrameName = res.Blue;
            this.initPos = cc.p(200,cc.winSize.height/2);
            this.tower_angel = -90;
            this.base_angel = -90;
        }
        else if(this.colortype == g_ColorType.red)
        {
            spriteFrameName = res.Red;
            aimerFrameName = res.Red;
            this.initPos = cc.p(cc.winSize.width-200, cc.winSize.height/2);
            this.tower_angel = -135;
            this.base_angel = -135;
        }
        else
            cc.log("error character color");
        this.base  = new cc.Sprite(spriteFrameName);
        this.addChild(this.base,1);

        this.tower = new cc.Sprite(spriteFrameName);
        this.tower.setScale(0.3);
        this.addChild(this.tower,2);

        this.setPosition(this.initPos);
        this.setScale(0.3);
        this.base.setRotation(this.base_angel);
        this.tower.setRotation(this.tower_angel);

    },
    setStatus: function(status){
        this.status = status;
    },
    shoot: function()
    {
        var mask;
        if(this.colortype == g_ColorType.blue) mask =1;
        else mask =2;
        cc.log(this.tower_angel);
        bulletController.spawnBullet(mask,this.getPosition(),cc.degreesToRadians(this.tower_angel));
    },
    updateMove: function(dt){
        var cur_pos = this.getPosition();
        var base_angel_degrees = cc.degreesToRadians(this.base_angel);
        var new_pos = cc.p(cur_pos.x + CONST_MOVE_SPEED * Math.sin(base_angel_degrees)*dt,cur_pos.y + CONST_MOVE_SPEED * Math.cos(base_angel_degrees)*dt);
        this.setPosition(new_pos);
    },
    updateTowerRoll: function(dt){
        var new_angel = (this.tower_angel + CONST_INCREASE_TOWER_ANGEL)%360;
        this.tower_angel = new_angel;
        //this.aimer.setRotation(new_angel);
        this.tower.setRotation(new_angel);
    },
    updateBaseRoll: function(dt){
        var new_angel = (this.base_angel + CONST_INCREASE_BASE_ANGEL)%360;
        this.base_angel = new_angel;
        cc.log(this.base_angel);
        //this.aimer.setRotation(new_angel);
        this.base.setRotation(new_angel);
    },
    update: function(dt){
        switch(this.status)
        {
            case STATUS.IDLE:
                break;
            case STATUS.MOVE:
                this.updateMove(dt);
                break;
            case STATUS.ROLL:
                this.updateBaseRoll(dt);
                this.updateMove(dt);
                break;
            case STATUS.SHOOT:
                this.updateTowerRoll(dt);
                break;
        }
    }


});

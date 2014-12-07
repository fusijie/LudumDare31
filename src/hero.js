/**
 * Created by Jacky on 14/12/6.
 */

var CONST_MOVE_SPEED = 100;
var CONST_INCREASE_BASE_ANGEL = 3;
var CONST_INCREASE_TOWER_ANGEL = 3;
var CONST_CD_TIME = 3;
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
    radius: 25,
    mass: 100,
    isClockWise: true,
    isCDing: false,
    lastCDTime: 0,
    ctor: function(colortype) {
        this._super();

        this.colortype = colortype;

        //add entity
        var baseFrameName = "";
        var aimerFrameName = "";
        var towerFramName = "";
        if(this.colortype == g_ColorType.blue)
        {
            baseFrameName = res.blue_base;
            towerFramName = res.blue_tower;
            aimerFrameName = res.blue_aimer;
            this.initPos = cc.p(200,cc.winSize.height/2);
            this.tower_angel = -90;
            this.base_angel = -90;
        }
        else if(this.colortype == g_ColorType.red)
        {
            baseFrameName = res.red_base;
            towerFramName = res.red_tower;
            aimerFrameName = res.red_aimer;
            this.initPos = cc.p(cc.winSize.width-200, cc.winSize.height/2);
            this.tower_angel = -135;
            this.base_angel = -135;
        }
        else
            cc.log("error character color");
        this.base  = new cc.Sprite(baseFrameName);
        this.addChild(this.base,1);

        this.tower = new cc.Sprite(towerFramName);
        this.addChild(this.tower,2);

        this.aimer = new cc.Sprite(aimerFrameName);
        this.addChild(this.aimer,3);
        this.aimer.setVisible(false);
        this.aimer.setScale(1.5);

        this.setPosition(this.initPos);
        this.tower.setRotation(this.tower_angel);
        this.aimer.setRotation(this.base_angel);
    },
    setStatus: function(status){
        this.status = status;
    },
    shoot: function()
    {
        if(!this.isCDing) {
            var mask;
            if (this.colortype == g_ColorType.blue) mask = 1;
            else mask = 2;
            bulletController.spawnBullet(1, mask, this.getPosition(), cc.degreesToRadians(this.tower_angel));
            this.lastCDTime = CONST_CD_TIME;
            this.isCDing = true;
        }
    },
    updateMove: function(dt){
        var cur_pos = this.getPosition();
        var base_angel_degrees = cc.degreesToRadians(this.base_angel);
        var new_pos = cc.p(cur_pos.x + CONST_MOVE_SPEED * Math.sin(base_angel_degrees)*dt,cur_pos.y + CONST_MOVE_SPEED * Math.cos(base_angel_degrees)*dt);
        this.setPosition(new_pos);
    },
    updateTowerRoll: function(dt){
        var new_angel;
        if(this.isClockWise)
            new_angel = (this.tower_angel + CONST_INCREASE_TOWER_ANGEL)%360;
        else
            new_angel = (this.tower_angel - CONST_INCREASE_BASE_ANGEL)%360;
        this.tower_angel = new_angel;
        this.tower.setRotation(new_angel);
    },
    updateBaseRoll: function(dt){
        var new_angel;
        if(this.isClockWise)
            new_angel = (this.base_angel + CONST_INCREASE_BASE_ANGEL)%360;
        else
            new_angel = (this.base_angel - CONST_INCREASE_BASE_ANGEL)%360;
        this.base_angel = new_angel;
        this.aimer.setRotation(new_angel);

    },
    update: function(dt){
        if(this.isCDing)
        {
            this.lastCDTime -= dt;
            if(this.lastCDTime<=0) {
                this.isCDing = false;
                this.lastCDTime = 0;
            }
        }
        switch(this.status)
        {
            case STATUS.IDLE:
                break;
            case STATUS.MOVE:
                this.updateMove(dt);
                break;
            case STATUS.ROLL:
                this.updateBaseRoll(dt);
                this.updateTowerRoll(dt);
                this.updateMove(dt);
                break;
            case STATUS.SHOOT:
                break;
        }
    }


});

/**
 * Created by Jacky on 14/12/6.
 */

var GameSceneLayer = cc.Layer.extend({
    sprite:null,
    blue: null,
    red: null,
    temp_90_pressed: false,
    temp_88_pressed: false,
    temp_190_pressed: false,
    temp_191_pressed: false,
    ctor:function () {

        this._super();

        //add Bk
        var bk =new cc.Sprite(res.game_bk);
        bk.attr({
            x: cc.winSize.width/2,
            y: cc.winSize.height/2
        });
        this.addChild(bk,1);

        //add Hero
        this.blue = new Hero(g_ColorType.blue);
        this.addChild(this.blue,2);
        this.red = new Hero(g_ColorType.red);
        this.addChild(this.red,2);

        //add Border
        var border = new cc.Sprite(res.game_border);
        border.attr({
            x: cc.winSize.width/2,
            y: cc.winSize.height/2
        });
        this.addChild(border,3)

        //after tips.
        this.blue.setStatus(STATUS.MOVE);
        this.red.setStatus(STATUS.MOVE);

        //add GameController
        var gc = new GameController(this.blue,this.red);

        //add ItemController
        var ic = new ItemController();

        //enable AI?
        //gc.setAIEnable(true);

        //add Update
        this.schedule(function(dt){
            this.blue.update(dt);
            this.red.update(dt);
            bulletController.attacks(dt);
            gc.update(dt);
            ic.update(dt);
        },0);

        this.initKeyBoardControl();
        return true;
    },
    initKeyBoardControl: function()
    {
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed:  function(keyCode, event){
                var target = event.getCurrentTarget();
                if(keyCode == 90)
                {
                    if(!target.temp_90_pressed && !target.temp_88_pressed)
                    {
                        target.temp_90_pressed = true;
                        target.blue.setStatus(STATUS.ROLL);
                        target.blue.aimer.setVisible(true);
                        cc.log("Key " + keyCode.toString() + " was pressed!");
                    }
                }
                else if(keyCode == 88)
                {
                    if(!target.temp_88_pressed && !target.temp_90_pressed)
                    {
                        target.temp_88_pressed = true;
                        if(!target.blue.isCDing) target.blue.shoot();
                        cc.log("Key " + keyCode.toString() + " was pressed!");
                    }
                }
                else if(keyCode == 190 && !g_IsAIEnable)
                {
                    if(!target.temp_190_pressed && !target.temp_191_pressed)
                    {
                        target.temp_190_pressed = true;
                        target.red.setStatus(STATUS.ROLL);
                        target.red.aimer.setVisible(true);
                        cc.log("Key " + keyCode.toString() + " was pressed!");
                    }
                }
                else if(keyCode == 191 && !g_IsAIEnable)
                {
                    if(!target.temp_191_pressed && !target.temp_190_pressed)
                    {
                        target.temp_191_pressed = true;
                        if(!target.red.isCDing) target.red.shoot();
                        cc.log("Key " + keyCode.toString() + " was pressed!");
                    }
                }
            },
            onKeyReleased: function(keyCode, event){
                var target = event.getCurrentTarget();
                if(keyCode == 90)
                {
                    if(target.temp_90_pressed)
                    {
                        target.temp_90_pressed = false;
                        target.blue.isClockWise = !target.blue.isClockWise;
                        target.blue.setStatus(STATUS.MOVE);
                        target.blue.aimer.setVisible(false);
                        cc.log("Key " + keyCode.toString() + " was released!");
                    }
                }
                else if(keyCode == 88)
                {
                    if(target.temp_88_pressed)
                    {
                        target.temp_88_pressed = false;
                        target.blue.setStatus(STATUS.MOVE);
                        cc.log("Key " + keyCode.toString() + " was released!");
                    }
                }
                else if(keyCode == 190 && !g_IsAIEnable)
                {
                    if(target.temp_190_pressed)
                    {
                        target.temp_190_pressed = false;
                        target.red.isClockWise = !target.red.isClockWise;
                        target.red.setStatus(STATUS.MOVE);
                        target.red.aimer.setVisible(false);
                        cc.log("Key " + keyCode.toString() + " was released!");
                    }
                }
                else if(keyCode == 191 && !g_IsAIEnable)
                {
                    if(target.temp_191_pressed)
                    {
                        target.temp_191_pressed = false;
                        target.red.setStatus(STATUS.MOVE);
                        cc.log("Key " + keyCode.toString() + " was released!");
                    }
                }
            }
        }, this);
    }
});

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameSceneLayer();
        this.addChild(layer);
        currentLayer = layer;
    }
});


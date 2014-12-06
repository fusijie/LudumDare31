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

        this.blue = new Hero(g_ColorType.blue);
        this.addChild(this.blue);
        this.red = new Hero(g_ColorType.red);
        this.addChild(this.red);

        //after tips.
        this.blue.setStatus(STATUS.MOVE);
        this.red.setStatus(STATUS.MOVE);

        var gc = new GameController(this.blue,this.red,this.blue_copy,this.red_copy);
        this.schedule(function(dt){
            this.blue.update(dt);
            this.red.update(dt);
            bulletController.attacks(dt);
            gc.update(dt);
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
                        target.blue.setStatus(STATUS.SHOOT);
                        cc.log("Key " + keyCode.toString() + " was pressed!");
                    }
                }
                else if(keyCode == 88)
                {
                    if(!target.temp_88_pressed && !target.temp_90_pressed)
                    {
                        target.temp_88_pressed = true;
                        target.blue.setStatus(STATUS.ROLL);
                        cc.log("Key " + keyCode.toString() + " was pressed!");
                    }
                }
                else if(keyCode == 190)
                {
                    if(!target.temp_190_pressed && !target.temp_191_pressed)
                    {
                        target.temp_190_pressed = true;
                        target.red.setStatus(STATUS.SHOOT);
                        cc.log("Key " + keyCode.toString() + " was pressed!");
                    }
                }
                else if(keyCode == 191)
                {
                    if(!target.temp_191_pressed && !target.temp_190_pressed)
                    {
                        target.temp_191_pressed = true;
                        target.red.setStatus(STATUS.ROLL);
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
                        target.blue.shoot();
                        target.blue.setStatus(STATUS.MOVE);
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
                else if(keyCode == 190)
                {
                    if(target.temp_190_pressed)
                    {
                        target.temp_190_pressed = false;
                        target.red.shoot();
                        target.red.setStatus(STATUS.MOVE);
                        cc.log("Key " + keyCode.toString() + " was released!");
                    }
                }
                else if(keyCode == 191)
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


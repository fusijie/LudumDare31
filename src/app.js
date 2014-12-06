
var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();


        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        // add a "close" icon to exit the progress. it's an autorelease object
        var closeItem = new cc.MenuItemImage(
            res.CloseNormal_png,
            res.CloseSelected_png,
            function () {
                cc.log("Menu is clicked!");
            }, this);
        closeItem.attr({
            x: size.width - 20,
            y: 20,
            anchorX: 0.5,
            anchorY: 0.5
        });

        var menu = new cc.Menu(closeItem);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 1);

        // add "HelloWorld" splash screen"
        this.sprite = new cc.Sprite(res.HelloWorld_png);
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2,
        });
        this.addChild(this.sprite, 0);

        this.schedule(this.loop, 1);
        this.scheduleUpdate();

        return true;
    },
    loop: function(){
        bulletController.spawnBullet(1, cc.p(cc.winSize.width/4, cc.winSize.height/4), cc.PI+(cc.random0To1()*10));
        bulletController.spawnBullet(2, cc.p(cc.winSize.width*3/4, cc.winSize.height*3/4), cc.PI+(cc.random0To1()*10));
    },
    update: function(dt){
        bulletController.attacks(dt);
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        currentLayer = layer;
        this.addChild(layer);
    }
});


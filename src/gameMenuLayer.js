/**
 * Created by Jacky on 14/12/6.
 */

var GameMenuLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        this.initMenuLayer();
    },
    initMenuLayer: function(){
        var baselayer = new cc.LayerColor.create(cc.color(0,0,0,50));
        baselayer.ignoreAnchorPointForPosition(false);
        baselayer.setAnchorPoint(cc.p(0.5,0.5));
        baselayer.setContentSize(cc.size(cc.winSize.width * 3/4, cc.winSize.height/2));
        baselayer.setPosition(cc.winSize.width/2,cc.winSize.height);
        this.addChild(baselayer);
        baselayer.runAction(cc.moveBy(0.8,cc.p(0,-cc.winSize.height/2)).easing(cc.easeBackOut()));

        //add logo and key tip

        //add start
        var startlabel = new cc.LabelTTF("Start", "", 32);
        var startitem = new cc.MenuItemLabel(startlabel,function(pSender){
            this.runAction(cc.sequence(cc.moveBy(0.8,cc.p(0,cc.winSize.height*3/4)).easing(cc.easeBackOut()),cc.callFunc(function(sender){
                currentLayer.onStartGame();
            })));
        },this);
        var starMenu = new cc.Menu(startitem);
        starMenu.setPosition(baselayer.getContentSize().width/2,50);
        baselayer.addChild(starMenu);
    }
});


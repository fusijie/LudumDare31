/**
 * Created by Jacky on 14/12/6.
 */
var GameOverLayer = cc.Layer.extend({
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

        //add refresh tip
        var refreshlabel = new cc.LabelTTF("Please press F5 to restart game", "", 32);
        refreshlabel.setPosition(baselayer.getContentSize().width/2,baselayer.getContentSize().height/2);
        baselayer.addChild(refreshlabel);
    }
});
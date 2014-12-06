/**
 * Created by calf on 14/12/6.
 */
var currentLayer;

var bulletController = {
    bullets: [],

    spawnBullet: function (mask, pos, angle) {
        BasicBullet.create(mask, pos, angle);
    },
    attacks: function(dt){
        for(var i = this.bullets.length-1; i >= 0; i--){
            var bullet =  this.bullets[i];
            if (bullet.mask == 1){
                //Role A attack, then lets check Role B
            }
            else{
                //Role B attack, then lets check Role A

            }

            bullet.curDuration = bullet.curDuration + dt;
            if(bullet.curDuration > bullet.duration){
                bullet.onTimeOut();
                this.bullets.splice(i, 1);
            }
            else{
                bullet.onUpdate(dt);
            }
        }
    }
};

var BasicBullet = cc.Sprite.extend({
    mask: 0,   //1 is Role A, 2 is Role B, 0 is nobody
    angle: 120, //arc of attack, in radians
    speed: 10, //traveling speed
    duration: 10,
    curDuration: 0,
    ctor: function(){
        this._super(res.bubble_png)
    },
    onTimeOut: function(){
        this.runAction(cc.sequence(cc.fadeOut(1), cc.removeSelf()));
    },
    onCollide: function(target){
        //this.hurtEffect(target);
        //this.playHitAudio();
        //target.hurt(this);
    },
    onUpdate: function(dt){
        var selfPos = this.getPosition();
        var nextPos = cc.pRotateByAngle(cc.pAdd(cc.p(x = this.speed*dt, y = this.speed*dt), selfPos), selfPos, this.angle);
        this.setPosition(nextPos)
    }
});

BasicBullet.create = function(mask, pos, angle){
    var sprite = new BasicBullet();
    sprite.mask = mask;
    sprite.angle = angle;
    sprite.setPosition(pos);
    bulletController.bullets.push(sprite);
    currentLayer.addChild(sprite, 1)
};
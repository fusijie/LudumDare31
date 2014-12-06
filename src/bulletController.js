/**
 * Created by calf on 14/12/6.
 */
var currentLayer;

var bulletController = {
    bulletsA: [],
    bulletsB: [],
    proccessArray: function(bullets, mask, dt){
        for(var i = bullets.length-1; i >= 0; i--){
            var bullet =  bullets[i];

            //Role mask is attacking, then let's check the other role and bullets
            var bulletsX = mask === 1? this.bulletsB: this.bulletsA;
            for(var k = bulletsX.length-1; k >= 0; k--) {
                var bulletX =  bulletsX[k];
                var dist = cc.pDistance(bullet.getPosition(), bulletX.getPosition());
                if(dist < bullet.radius*bullet.getScale() + bulletX.radius*bulletX.getScale()){
                    bullet.onCollide(bulletX);
                    if(bullet.curDuration < bulletX.curDuration){
                        //if bullet is younger than bulletX, bulletX dead
                        //otherwise bullet dead
                        bulletsX.splice(k, 1);

                        bullet.runAction(cc.scaleBy(0.3, 1.5));
                        var tempAction = cc.spawn(cc.scaleTo(0.2, 0.1), cc.fadeOut(0.2));
                        bulletX.runAction(cc.sequence(tempAction, cc.removeSelf()));

                    }
                    else{
                        bullets.splice(i, 1);

                        bulletX.runAction(cc.scaleBy(0.3, 1.5));
                        var tempAction = cc.spawn(cc.scaleTo(0.2, 0.1), cc.fadeOut(0.2));
                        bullet.runAction(cc.sequence(tempAction, cc.removeSelf()));

                        continue;
                    }
                }
            }

            bullet.curDuration = bullet.curDuration + dt;
            if(bullet.curDuration > bullet.duration){
                bullets.splice(i, 1);
                bullet.onTimeOut();
            }
            else{
                bullet.onUpdate(dt);
            }
        }
    },

    attacks: function(dt){
        this.proccessArray(this.bulletsA, 1, dt);
        this.proccessArray(this.bulletsB, 2, dt);
    }
};

bulletController.spawnBullet = function (mask, pos, angle) {
    BasicBullet.create(mask, pos, angle);
};

var BasicBullet = cc.Sprite.extend({
    mask: 0,   //1 is Role A, 2 is Role B, 0 is nobody
    angle: 0, //arc of attack, in radians
    speed: 50, //traveling speed
    duration: 10,
    curDuration: 0,
    radius: 20,
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
    if(sprite.mask == 2)
    {
        sprite.setColor(cc.color(0,125,0));
        bulletController.bulletsA.push(sprite);
    }
    else
    {
        bulletController.bulletsB.push(sprite);
    }
    currentLayer.addChild(sprite, 1)
};
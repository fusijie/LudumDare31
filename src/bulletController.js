/**
 * Created by calf on 14/12/6.
 */
var currentLayer;

var bulletController = {
    bulletsA: [],
    bulletsB: [],
    //conservationOfMomentum: function(obj1, obj2){
    //    var obj1Pos = obj1.getPosition();
    //    var obj2Pos = obj2.getPosition();
    //    var angle = cc.pToAngle(cc.pSub(obj1Pos, obj2Pos));
    //    local distance = miniDistance - tempDistance + 1 // Add extra 1 to avoid 'tempDistance < miniDistance' is always true
    //    local distance1 = (1 - object1._mass / (object1._mass + object2._mass) ) * distance
    //    local distance2 = distance - distance1
    //
    //    object1:setPosition(cc.pRotateByAngle(cc.pAdd(cc.p(distance1,0),obj1Pos), obj1Pos, angle))
    //    object2:setPosition(cc.pRotateByAngle(cc.pAdd(cc.p(-distance2,0),obj2Pos), obj2Pos, angle))
    //},
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
                    if(bullet.mass >= bulletX.mass){
                        //if bullet is younger than bulletX, bulletX dead
                        //otherwise bullet dead
                        bullet.runAction(cc.scaleBy(0.3, 1.5));

                        bulletsX.splice(k, 1);
                        var tempAction = cc.spawn(cc.scaleTo(0.2, 0.1), cc.fadeOut(0.2));
                        bulletX.runAction(cc.sequence(tempAction, cc.removeSelf()));

                    }
                    else{
                        bulletX.runAction(cc.scaleBy(0.3, 1.5));

                        bullets.splice(i, 1);
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
    ctor: function(){
        this._super(res.bubble_png)
        this.mask = 0;  //1 is Role A, 2 is Role B, 0 is nobody
        this.angle = 0; //arc of attack, in radians
        this.speed = {x: 100, y: 100}; //traveling speed
        this.duration = 10;
        this.curDuration = 0;
        this.radius = 20;
        this.mass = 5;
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
        var nextPos = cc.p(selfPos.x + this.speed.x*dt, selfPos.y + this.speed.y*dt);
        //var nextPos = cc.pRotateByAngle(cc.pAdd(cc.p(x = this.speed.x*dt, y = this.speed.y*dt), selfPos), selfPos, this.angle);
        this.setPosition(nextPos)
    }
});

BasicBullet.create = function(mask, pos, angle){
    var sprite = new BasicBullet();
    sprite.mask = mask;
    sprite.angle = angle;

    sprite.speed.x *= Math.sin(angle);
    sprite.speed.y *= Math.cos(angle);

    var random = cc.random0To1() + 0.5;
    sprite.mass = random*100;
    sprite.setScale(random);
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
/**
 * Created by calf on 14/12/6.
 */
var currentLayer;
var BULLET_SPEED = 300;
var BULLET_RADUIS = 20;

var bulletController = {
    bulletsA: [],
    bulletsB: [],
    conservationOfMomentum: function(obj1, obj2){
        var obj1Momentum = {x:obj1.speed.x * obj1.mass, y:obj1.speed.y * obj1.mass};
        var obj2Momentum = {x:obj2.speed.x * obj2.mass, y:obj2.speed.y * obj2.mass};

        if(obj1Momentum.x * obj2Momentum.x > 0){
            obj1.speed.x = (obj1Momentum.x - obj2Momentum.x) / obj1.mass;
            obj2.speed.x = (obj2Momentum.x - obj1Momentum.x) / obj2.mass;
        }
        else{
            obj1.speed.x = (obj1Momentum.x + obj2Momentum.x) / obj1.mass;
            obj2.speed.x = (obj2Momentum.x + obj1Momentum.x) / obj2.mass;
        }

        if(obj1Momentum.y * obj2Momentum.y > 0){
            obj1.speed.y = (obj1Momentum.y - obj2Momentum.y) / obj1.mass;
            obj2.speed.y = (obj2Momentum.y - obj1Momentum.y) / obj2.mass;
        }
        else{
            obj1.speed.y = (obj1Momentum.y + obj2Momentum.y) / obj1.mass;
            obj2.speed.y = (obj2Momentum.y + obj1Momentum.y) / obj2.mass;
        }
        audioEngine.playEffect(res.audio_collision);
    },
    proccessArray: function(bullets, mask, dt){
        for(var i = bullets.length-1; i >= 0; i--){
            var bullet =  bullets[i];

            //Role mask is attacking, then let's check the other role and bullets
            var bulletsX = mask === 1? this.bulletsB: this.bulletsA;
            for(var k = bulletsX.length-1; k >= 0; k--) {
                var bulletX =  bulletsX[k];
                var dist = cc.pDistance(bullet.getPosition(), bulletX.getPosition());
                if(dist < bullet.radius + bulletX.radius){
                    this.conservationOfMomentum(bullet, bulletX);
                }
            }

            if(mask === 1) {
                var target = currentLayer.blue;
                var dist = cc.pDistance(bullet.getPosition(), target.getPosition());
                if (dist < bullet.radius  + target.radius) {
                    bullet.onCollide(target);
                    bullet.curDuration = bullet.duration + 1;

                }
            }
            else if(mask ===2){
                var target = currentLayer.red;
                var dist = cc.pDistance(bullet.getPosition(), target.getPosition());
                if (dist < bullet.radius + target.radius) {
                    bullet.onCollide(target);
                    bullet.curDuration = bullet.duration + 1;
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

bulletController.changeAngle = function(mask){
    var bulletsX = mask === 1? this.bulletsA: this.bulletsB;
    var pos = mask === 1? currentLayer.blue.getPosition(): currentLayer.red.getPosition();
    for(var k = bulletsX.length-1; k >= 0; k--) {
        var bullet =  bulletsX[k];
        angle = cc.pToAngle(cc.pSub(pos, bullet.getPosition()));
        angle = cc.PI/2 - angle;
        bullet.speed.x = BULLET_SPEED *Math.sin(angle);
        bullet.speed.y = BULLET_SPEED *Math.cos(angle);
    }
};

bulletController.weakBullet = function(mask){
    var bulletsX = mask === 1? this.bulletsA: this.bulletsB;
    for(var k = bulletsX.length-1; k >= 0; k--) {
        var bullet =  bulletsX[k];
        bullet.curDuration += bullet.duration/2;
    }
};


bulletController.spawnBullet = function (type, mask, pos, angle) {
    if(type === 1){
        BasicBullet.create(mask, pos, angle);
    }
    else if(type === 2){
        scatterBullet.create(mask, pos, angle);
    }
};

var BasicBullet = cc.Sprite.extend({
    ctor: function(mask){
        var bubblefilename;
        if(mask == 1)
            bubblefilename = res.blue_bubble;
        else
            bubblefilename = res.red_bubble;
        this._super(bubblefilename);
        this.mask = 0;  //1 is Role A, 2 is Role B, 0 is nobody
        this.speed = {x: BULLET_SPEED, y: BULLET_SPEED}; //traveling speed
        this.duration = 10;
        this.curDuration = 0;
        this.radius = BULLET_RADUIS;
        this.mass = 5;
    },
    onTimeOut: function(){
        this.runAction(cc.sequence(cc.fadeOut(1), cc.removeSelf()));
    },
    onCollide: function(target){
        target.losslife();
        audioEngine.playEffect(res.audio_explosion);
    },
    onUpdate: function(dt){
        var selfPos = this.getPosition();
        var nextPos = cc.p(selfPos.x + this.speed.x*dt, selfPos.y + this.speed.y*dt);
        this.setPosition(nextPos);
        this.checkBorder();
        this.setOpacity(255*(1-this.curDuration/this.duration));
    },
    checkBorder: function() {
        var obj_pos = this.getPosition();
        if (obj_pos.x < 0) {
            this.setPositionX(cc.winSize.width);
        }
        else if (obj_pos.x > cc.winSize.width) {
            this.setPositionX(0);
        }
        else if (obj_pos.y < 0) {
            this.setPositionY(cc.winSize.height);
        }
        else if (obj_pos.y > cc.winSize.height) {
            this.setPositionY(0);
        }
    }
});

BasicBullet.create = function(mask, pos, angle){
    var sprite = new BasicBullet(mask);
    sprite.mask = mask;
    sprite.speed.x *= Math.sin(angle);
    sprite.speed.y *= Math.cos(angle);

    var random = cc.random0To1() + 0.5;
    sprite.mass = random*100;
    sprite.setPosition(pos);
    if(sprite.mask == 2)
    {
        bulletController.bulletsA.push(sprite);
    }
    else
    {
        bulletController.bulletsB.push(sprite);
    }
    currentLayer.addChild(sprite, 1);

    audioEngine.playEffect(res.audio_shoot_1);
    return sprite;
};

var scatterBullet = BasicBullet.extend({
});

scatterBullet.create = function(mask, pos, angle){
    for(var i = 0; i < 6; i++){
        BasicBullet.create(mask, pos, angle);
        angle += cc.PI/3;
    }
};
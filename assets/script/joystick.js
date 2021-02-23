import joystickEnum from "./joystickEnum";
cc.Class({
    extends: cc.Component,

    properties: {

        ring: {
            default: null,
            type: cc.Node,
        },
        dot: {
            default: null,
            type: cc.Node,
        },
        plane: {
            default: null,
            type: cc.Node,
        },
        joystickType: {
            default: joystickEnum.stickType.FIXED,
            type: joystickEnum.stickType,
            displayName: "joystickType",
            tooltip: "遥杆类型",
        },
        btn1: {
            default: null,
            type: cc.Button,
        },
        btn2: {
            default: null,
            type: cc.Button,
        },



    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {



        this._radius = this.ring.width / 2;
        this.node.on("touchmove", this.touch_move, this);
        this.node.on("touchstart", this.touch_start, this);
        this.node.on("touchend", this.touch_end, this);
        this.node.on("touchcancel", this.touch_end, this);

    },
    btnCallBack(e, cus) {
        if (cus == "btn1") {
            this.btn1.interactable = false;
            this.btn2.interactable = true;
            this.node.opacity = 255;
            this.joystickType = joystickEnum.stickType.FIXED;
            this.ring.setPosition(200, 200);
            this.dot.setPosition(200, 200);
        } else if (cus == "btn2") {
            this.btn2.interactable = false;
            this.btn1.interactable = true;
            this.node.opacity = 0;
            this.joystickType = joystickEnum.stickType.FOLLOW;



        }
    },
    touch_start(e) {
        if (this.joystickType === joystickEnum.stickType.FOLLOW) {

            this.touchStartPos = e.getLocation();
            cc.log("touchstartPos", this.touchStartPos)
            this.ring.setPosition(this.node.convertToNodeSpaceAR(this.touchStartPos));
            this.dot.setPosition(this.node.convertToNodeSpaceAR(this.touchStartPos));
            this.node.opacity = 255;

        }

    },
    getAngle(start, end) {    
        var  x  =  end.x  -  start.x    
        var  y  =  end.y  -  start.y    
        var  hypotenuse  =  Math.sqrt(x * x  +  y * y)

            
        var  cos  =  x  /  hypotenuse    
        var  radian  =  Math.acos(cos)

             //求出弧度
            
        var  angle  =  180  /  (Math.PI  /  radian)     //用弧度算出角度
                 if (y  <  0) {         angle  =  0 - angle     } else 
        if (y  ==  0  &&  x  <  0) {         angle  =  180     }    
        return  90 - angle
    },
    touch_end() {
        this.dot.setPosition(this.ring.getPosition());
        this.isMoving = false;

        if (this.joystickType === joystickEnum.stickType.FOLLOW) {

            this.node.opacity = 0;

        }

    },
    touch_move(e) {
        this.isMoving = true;
        let currentPos = e.getLocation();
        let touchPos = this.ring.convertToNodeSpaceAR(currentPos);
        cc.log("以ring为父节点的点击坐标", touchPos.x, touchPos.y);
        let ringPosWorld = this.ring.convertToWorldSpaceAR(cc.v2(0, 0));

        let vector = currentPos.sub(ringPosWorld);
        cc.log(vector)
        this.vectorLength = vector.mag();
        cc.log("距离dot的长度", this.vectorLength)
        cc.log(currentPos.x, currentPos.y);
        // let posX = touchPos.x + this.ring.x;
        // let posY = touchPos.y + this.ring.y;
        let pos = this.ring.convertToWorldSpaceAR(touchPos)
        this.p = cc.v2(pos.x, pos.y).sub(this.ring.getPosition()).normalize();
        cc.log("点击坐标到ring的向量", cc.v2(pos.x, pos.y).sub(this.ring.getPosition()).x, cc.v2(pos.x, pos.y).sub(this.ring.getPosition()).y)
        cc.log("p", this.p)
        if (this._radius > this.vectorLength) {
            this.dot.setPosition(this.node.convertToNodeSpaceAR(currentPos))


        } else {
            let x = this.ring.x + this.p.x * this._radius;
            let y = this.ring.y + this.p.y * this._radius;
            this.dot.setPosition(x, y)

        }

        this.plane.angle = -this.getAngle(this.ring.getPosition(), currentPos);
    },
    start() {

    },

    update(dt) {
        if (this.isMoving) {
            if (this._radius > this.vectorLength) {
                this.plane.x += this.p.x;
                this.plane.y += this.p.y;
            } else {
                this.plane.x += this.p.x * 3;
                this.plane.y += this.p.y * 3;
            }

        }


    },
});
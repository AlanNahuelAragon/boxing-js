class Sprite {
    constructor({
      position,
      imageSrc,
      scale = 1,
      framesMax = 1,
      offset = { x: 0, y: 0 }
    }) {
      this.position = position
      this.width = 50
      this.height = 150
      this.image = new Image()
      this.image.src = imageSrc
      this.scale = scale
      this.framesMax = framesMax
      this.framesCurrent = 0
      this.framesElapsed = 0
      this.framesHold = 5
      this.offset = offset
    }
  
    draw() {
      c.drawImage(
        this.image,
        this.framesCurrent * (this.image.width / this.framesMax),
        0,
        this.image.width / this.framesMax,
        this.image.height,
        this.position.x - this.offset.x,
        this.position.y - this.offset.y,
        (this.image.width / this.framesMax) * this.scale,
        this.image.height * this.scale
      )
    }
  
    animateFrames() {
      this.framesElapsed++
  
      if (this.framesElapsed % this.framesHold === 0) {
        if (this.framesCurrent < this.framesMax - 1) {
          this.framesCurrent++
        } else {
          this.framesCurrent = 0
        }
      }
    }
  
    update() {
      this.draw()
      this.animateFrames()
    }
  }
  
  class Fighter extends Sprite {
    constructor({
      position,
      velocity,
      color = 'red',
      imageSrc,
      scale = 1,
      framesMax = 1,
      offset = { x: 0, y: 0 },
      isfacingRight,
      sprites,
      attackBox = { offset: {}, width: undefined, height: undefined }
    }) {
      super({
        position,
        imageSrc,
        scale,
        framesMax,
        offset
      })
  
      this.velocity = velocity
      this.width = 50
      this.height = 150
      this.lastKey
      this.attackBox = {
        position: {
          x: this.position.x,
          y: this.position.y
        },
        offset: attackBox.offset,
        width: attackBox.width,
        height: attackBox.height
      }
      this.color = color
      this.isAttacking
      this.health = 100
      this.framesCurrent = 0
      this.framesElapsed = 0
      this.framesHold = 5
      this.sprites = sprites
      this.dead = false
      this.stuned = false
      this.isfacingRight = isfacingRight
  
      for (const sprite in this.sprites) {
        sprites[sprite].image = new Image()
        sprites[sprite].image.src = sprites[sprite].imageSrc
        //console.log(sprite, " : ", sprites[sprite].image.src)
      }
    }
  
    update() {
      this.draw()
      if (!this.dead) this.animateFrames()
  
      // attack boxes
      this.attackBox.position.x = this.position.x + this.attackBox.offset.x
      this.attackBox.position.y = this.position.y + this.attackBox.offset.y
  
      // draw the attack box
      /*
      c.fillStyle='red'
      c.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      )
      */
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y
  
      // gravity function
      if (this.position.y + this.height + this.velocity.y >= canvas.height - 140) {
        this.velocity.y = 0
        //this.position.y = 330
      } else this.velocity.y += gravity
    }
  
    attack() {
      //console.log('pos: ',this.position.x)
      let numeroEntero = Math.round(Math.random());
      //console.log(numeroEntero)
      if(numeroEntero === 0){
        numeroEntero = Math.round(Math.random());
        if(numeroEntero===0){
          this.switchSprite('attack1')
        }else{this.switchSprite('attack3')}
        
      }else{
        numeroEntero = Math.round(Math.random());
        if(numeroEntero===0){
          this.switchSprite('attack2')
        }else{this.switchSprite('attack4')}
      }
      
      this.isAttacking = true
    }
  
    takeHit() {
      
      if(!this.dead){
        if(this.isAttacking){
          this.framesCurrent = 12
        }
        this.health -= 5
        if(this.isfacingRight){
          this.velocity.x = -10
        }else{ this.velocity.x = 10}
        this.velocity.y = -5
      }

  
      if (this.health <= 0) {
        this.switchSprite('death')
      } else {
        let intNum = Math.round(Math.random());
        console.log(intNum)
        if(intNum === 0){
          this.switchSprite('takeHit2')
          //console.log('h1')
        }else{
          this.switchSprite('takeHit1'); 
          //console.log('h2');
        }
      }
    }
  
    switchSprite(sprite) {
      if (this.image === this.sprites.death.image) {
        if (this.framesCurrent === this.sprites.death.framesMax - 1)
          this.dead = true
        
        return
      }
      if (
        (this.image === this.sprites.takeHit1.image && this.framesCurrent < this.sprites.takeHit1.framesMax - 1)||
        (this.image === this.sprites.takeHit2.image && this.framesCurrent < this.sprites.takeHit2.framesMax - 1)
      )
        return
      if (
        (this.image === this.sprites.attack1.image && this.framesCurrent < this.sprites.attack1.framesMax - 1 ) ||
        (this.image === this.sprites.attack2.image && this.framesCurrent < this.sprites.attack2.framesMax - 1 ) ||
        (this.image === this.sprites.attack3.image && this.framesCurrent < this.sprites.attack3.framesMax - 1 ) ||
        (this.image === this.sprites.attack4.image && this.framesCurrent < this.sprites.attack4.framesMax - 1 )
      )
        return
      switch (sprite) {
        case 'idle':
          if (this.image !== this.sprites.idle.image) {
            this.image = this.sprites.idle.image
            this.framesMax = this.sprites.idle.framesMax
            this.framesCurrent = 0
            this.stuned= false
          }
          break
        case 'run':
          if (this.image !== this.sprites.run.image) {
            this.image = this.sprites.run.image
            this.framesMax = this.sprites.run.framesMax
            this.framesCurrent = 0
          }
          break
        case 'attack1':
          if (this.image !== this.sprites.attack1.image) {
            this.image = this.sprites.attack1.image
            this.framesMax = this.sprites.attack1.framesMax
            this.framesCurrent = 0
          }
          break
        case 'attack2':
          if (this.image !== this.sprites.attack2.image ) {
            this.image = this.sprites.attack2.image
            this.framesMax = this.sprites.attack2.framesMax
            this.framesCurrent = 0
          }
          break
        case 'attack3':
          if (this.image !== this.sprites.attack3.image ) {
            this.image = this.sprites.attack3.image
            this.framesMax = this.sprites.attack3.framesMax
            this.framesCurrent = 0
          }
          break
        case 'attack4':
          if (this.image !== this.sprites.attack4.image ) {
            this.image = this.sprites.attack4.image
            this.framesMax = this.sprites.attack4.framesMax
            this.framesCurrent = 0
          }
          break
        case 'takeHit1':
          if (this.image !== this.sprites.takeHit1.image) {
            this.image = this.sprites.takeHit1.image
            this.framesMax = this.sprites.takeHit1.framesMax
            this.framesCurrent = 0
          }
          break
        case 'takeHit2':
          if (this.image !== this.sprites.takeHit2.image) {
            this.image = this.sprites.takeHit2.image
            this.framesMax = this.sprites.takeHit2.framesMax
            this.framesCurrent = 0
          }
          break
        case 'death':
          if (this.image !== this.sprites.death.image) {
            this.image = this.sprites.death.image
            this.framesMax = this.sprites.death.framesMax
            this.framesCurrent = 0
          }
          break
        case 'victory':
          if (this.image !== this.sprites.victory.image) {
            this.image = this.sprites.victory.image
            this.framesMax = this.sprites.victory.framesMax
            this.framesCurrent = 0
          }
          break
        case 'tie':
          if (this.image !== this.sprites.tie.image) {
            this.image = this.sprites.tie.image
            this.framesMax = this.sprites.tie.framesMax
            this.framesCurrent = 0
          }
          break
      }
    }
  }
  
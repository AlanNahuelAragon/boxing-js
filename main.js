const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = 576
canvas.height = 576
c.fillRect(0, 0, canvas.width, canvas.height)
const gravity = 0.7

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './assets/img/background.png'
})

const flashes = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './assets/img/Flashes.png',
  framesMax: 6
})

const player = new Fighter({
  position: {
    x: 57,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
  },
  imageSrc: './assets/img/Player1/Idle.png',
  framesMax: 6,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157
  },
  isfacingRight: true,
  sprites: {
    idle: {
      imageSrc: './assets/img/Player1/Idle.png',
      framesMax: 6
    },
    run: {
      imageSrc: './assets/img/Player1/Run.png',
      framesMax: 6
    },
    attack1: {
      imageSrc: './assets/img/Player1/Attack1.png',
      framesMax: 12
    },
    attack2: {
      imageSrc: './assets/img/Player1/Attack2.png',
      framesMax: 12
    },
    attack3: {
      imageSrc: './assets/img/Player1/Attack3.png',
      framesMax: 12
    },
    attack4: {
      imageSrc: './assets/img/Player1/Attack4.png',
      framesMax: 12
    },
    takeHit1: {
      imageSrc: './assets/img/Player1/TakeHit1.png',
      framesMax: 6
    },
    takeHit2: {
      imageSrc: './assets/img/Player1/TakeHit2.png',
      framesMax: 6
    },
    death: {
      imageSrc: './assets/img/Player1/Death.png',
      framesMax: 6
    },
    victory: {
      imageSrc: './assets/img/Player1/Victory.png',
      framesMax: 6
    },
    tie: {
      imageSrc: './assets/img/Player1/Tie.png',
      framesMax: 1
    }
  },
  attackBox: {
    offset: {
      x: 40,
      y: 70
    },
    width: 80,
    height: 20
  }
})

const enemy = new Fighter({
  position: {
    x: 457,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'blue',
  offset: {
    x: -50,
    y: 0
  },
  imageSrc: './assets/img/Player2/Idle.png',
  framesMax: 6,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157
  },
  isfacingRight: false,
  sprites: {
    idle: {
      imageSrc: './assets/img/Player2/Idle.png',
      framesMax: 6
    },
    run: {
      imageSrc: './assets/img/Player2/Run.png',
      framesMax: 6
    },
    attack1: {
      imageSrc: './assets/img/Player2/Attack1.png',
      framesMax: 12
    },
    attack2: {
      imageSrc: './assets/img/Player2/Attack2.png',
      framesMax: 12
    },
    attack3: {
      imageSrc: './assets/img/Player2/Attack3.png',
      framesMax: 12
    },
    attack4: {
      imageSrc: './assets/img/Player2/Attack4.png',
      framesMax: 12
    },
    takeHit1: {
      imageSrc: './assets/img/Player2/TakeHit1.png',
      framesMax: 6
    },
    takeHit2: {
      imageSrc: './assets/img/Player2/TakeHit2.png',
      framesMax: 6
    },
    death: {
      imageSrc: './assets/img/Player2/Death.png',
      framesMax: 6
    },
    victory: {
      imageSrc: './assets/img/Player2/Victory.png',
      framesMax: 6
    },
    tie: {
      imageSrc: './assets/img/Player2/Tie.png',
      framesMax: 1
    }
  },
  attackBox: {
    offset: {
      x: -70,
      y: 50
    },
    width: 80,
    height: 20
  }
})

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  }
}

function resetControlsPlayer(){
  keys.a.pressed=false;
  keys.d.pressed=false;
  player.stuned = true
}

function resetControlsEnemy(){
  keys.ArrowLeft.pressed=false;
  keys.ArrowRight.pressed=false;
  enemy.stuned = true
}

decreaseTimer()

function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  background.update()
  if(player.dead || enemy.dead){
    flashes.update()
  }
  c.fillStyle = 'rgba(255, 255, 255, 0.01)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  enemy.update()
  player.velocity.x = 0
  enemy.velocity.x = 0
  if (keys.a.pressed && player.lastKey === 'a') {
    if( player.position.x > 0){
      player.velocity.x = -6
      player.switchSprite('run')
    }
    
  } else if (keys.d.pressed && player.lastKey === 'd') {
    if(player.position.x <337){
      player.velocity.x = 6
      player.switchSprite('run')
    }
  } else {
    if(enemy.dead){
      player.switchSprite('victory')
    }else if(timer<=0){
      player.switchSprite('tie')
    }else{
      player.switchSprite('idle')
    }
  }
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    if(enemy.position.x >176){
      enemy.velocity.x = -6
      enemy.switchSprite('run')
    }
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    if(enemy.position.x <510){
      enemy.velocity.x = 6
      enemy.switchSprite('run')
    }
  } else {
    if(player.dead){
      enemy.switchSprite('victory')
    }else if(timer<=0){
      enemy.switchSprite('tie')
    }else{
      enemy.switchSprite('idle')
    }
  }
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    }) &&
    player.isAttacking &&
    player.framesCurrent === 6
  ) {
    resetControlsEnemy()
    resetControlsPlayer()
    enemy.takeHit()
    player.isAttacking = false
    player.framesCurrent=12

    gsap.to('#enemyHealth', {
      width: enemy.health + '%'
    })
  }
  if (player.isAttacking && player.framesCurrent === 6)
  { 
    player.isAttacking = false
  }
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 6
  ) {
    resetControlsPlayer()
    resetControlsEnemy()
    player.takeHit()
    enemy.isAttacking = false
    enemy.framesCurrent=12
    gsap.to('#playerHealth', {
      width: player.health + '%'
    })
  }
  if (enemy.isAttacking && enemy.framesCurrent === 6) {
    enemy.isAttacking = false
  }
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId })
  }
}

animate()

window.addEventListener('keydown', (event) => {
  if(timer > 0){
    if (!enemy.dead && !player.dead && !player.stuned) {
      switch (event.key) {
        case 'd':
          keys.d.pressed = true
          player.lastKey = 'd'
          break
        case 'a':
          keys.a.pressed = true
          player.lastKey = 'a'
          break
        case 's':
          player.stuned=true
          player.attack()
          
          break
      }
    }
    if (!player.dead && !enemy.dead && !enemy.stuned) {
      switch (event.key) {
        case 'ArrowRight':
          keys.ArrowRight.pressed = true
          enemy.lastKey = 'ArrowRight'
          break
        case 'ArrowLeft':
          keys.ArrowLeft.pressed = true
          enemy.lastKey = 'ArrowLeft'
          break
        case 'ArrowDown':
          enemy.stuned=true
          enemy.attack()
          
          break
      }
    }
  }

})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
  }
  switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
  }
})

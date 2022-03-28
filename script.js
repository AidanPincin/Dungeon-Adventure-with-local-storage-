class Character{
    #id;
    #state = {};
    #eventHandlers = [];
    #defaultMoveN = 10;
   
    constructor(id){
      this.#id = id ? id : crypto.randomUUID()
    }
  
    get id() {
      return this.#id;
    }
  
    get coords() {
      const { x, y } = this.getState()
      return { x, y }
    }
  
    setState(state){
      this.#state = Object.assign(this.#state, state)
      this.emit('state:change', this.getState())
    }
  
    getState() {
      return this.#state
    }
  
    on(event, fn) {
      this.#eventHandlers.push({ event, fn })
    }
  
    emit(event, data) {
      this.#eventHandlers
        .filter(handler => handler.event === event)
        .forEach(handler => handler.fn(data))
    }
  
    toJSON() {
      return {
        id: this.#id,
        state: this.getState(),
      }
    }
  
    static fromJSON(data) {
      const d = typeof data === 'string' 
        ? JSON.parse(data) 
        : data;
      const c = new Character(d.id);
      c.setState(d.state);
      return c;
    }

    moveUp(n = this.#defaultMoveN) {
        if(this.#state.y>0){this.setState({ y: this.#state.y - n })}
    }

    moveDown(n = this.#defaultMoveN) {
        if(this.#state.y<525){this.setState({ y: this.#state.y + n })}
    }

    moveRight(n = this.#defaultMoveN) {
        if(this.#state.x<925){this.setState({ x: this.#state.x + n })}
    }

    moveLeft(n = this.#defaultMoveN) {
        if(this.#state.x>0){this.setState({ x: this.#state.x - n })}
    }
    assignAttr(attr,value){
        this.setState({ [attr]: value})
    }
}
class Controls {
    #controlMap = {
        'w': 'up',
        's': 'down',
        'a': 'left',
        'd': 'right',
    }
    #controlsActive = {}
    #eventHandlers = []

    constructor() {
        for (const [key, control] of Object.entries(this.#controlMap)) {
            this.#controlsActive[control] = false;
        }
    }

    keyChange(key, isActive) {
        const control = this.#controlMap[key];
        if (control)
            this.changeControl(control, isActive)
    }

    changeControl(control, isActive) {
        this.#controlsActive[control] = isActive
    }

    getActiveControls() {
        return Object.keys(this.#controlsActive)
            .filter(c => this.#controlsActive[c])
    }

    processInputs() {
        const cs = this.getActiveControls()
        for (const c of cs) this.emit(c)
    }

    on(event, fn) {
        this.#eventHandlers.push({ event, fn })
    }
    
    emit(event, data) {
        this.#eventHandlers
            .filter(handler => handler.event === event)
            .forEach(handler => handler.fn(data))
    }  
}

const data = window.localStorage

class Storage {
    #store = data
    #playerKey = 'playerData'
    
    savePlayer(player) {
        const playerData = typeof player === 'string'
            ? player
            : JSON.stringify(player)
        this.#store.setItem(this.#playerKey, playerData)
    }

    loadPlayer() {
        const playerData = this.#store.getItem(this.#playerKey)
        return JSON.parse(playerData)
    }

    saveText(text){
        const textData = typeof text === 'string'
            ? text
            : JSON.stringify(text)
        this.#store.setItem('mainText',textData)
    }

    saveRoll(roll){
        const rollData = typeof roll === 'string'
            ? roll
            : JSON.stringify(roll)
        this.#store.setItem('roll',rollData)
    }

    load(Data){
        const Dat = data.getItem(Data)
        const d = typeof Dat === 'string' 
            ? JSON.parse(Dat) 
            : Dat;
        return d;
    }

    saveStatButtons(buttons){
        const buttonData = typeof buttons === 'string'
            ? buttons
            : JSON.stringify(buttons)
        this.#store.setItem('statButtons',buttonData)
    }
}
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
class Button{
    constructor(x,y,text,width=100,height=30,fontSize=24){
        this.text = text
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.font = fontSize+'px Arial'
        ctx.font = this.font
        this.txtWidth = ctx.measureText(text).width
        this.txtHeight = fontSize
    }
    draw(){
        ctx.fillStyle = '#0000ff'
        ctx.fillRect(this.x,this.y,this.width,this.height)
        ctx.fillStyle = '#000000'
        ctx.font = this.font
        ctx.fillText(this.text,this.x+this.width/2-this.txtWidth/2,this.y+this.height/2+this.txtHeight/3)
    }
    wasClicked(e){
        const { pageX: x, pageY: y } = e
        if (x>=this.x+10 && x<=this.x+this.width+10 && y>=this.y+10 && y<=this.y+this.height+10){
            return true
        }
    }
}
class Txt{
    constructor(text,x,y,color='#000000',fontSize=24){
        this.x = x
        this.y = y
        this.text = text
        this.color = color
        this.font = fontSize+"px Arial"
        ctx.font = this.font
        this.width = ctx.measureText(text).width
        this.height = fontSize
        this.fontSize = fontSize
    }
    draw(){
        ctx.fillStyle = this.color
        ctx.font = this.font
        ctx.fillText(this.text,this.x-this.width/2,this.y+this.height)
    }
}
class CanvasRenderer {
    constructor() {
        this.mainMenuButtons = [new Button(500,250,'Play'), new Button(500,290,'Instructions',125), new Button(500,330,'Settings')]
        this.playerImg = new Image()
        this.playerImg.src = 'hero.png'
        this.shopImg = new Image()
        this.shopImg.src = 'shop.png'
        this.manImg = new Image()
        this.manImg.src = 'man.png'
        this.moneyBagImg = new Image()
        this.moneyBagImg.src = 'money-bag.png'
        this.chatImg = new Image()
        this.chatImg.src = 'chat.png'
        this.title = new Txt('Welcome to Dungeon Adventure!',500,0,'#000000',48)
        this.step1 = [new Txt("Before we begin let's create your character",500,0), new Txt('First we will assign each of your attributes by rolling 4 6-sided dice',500,60),
        new Txt('and adding the 3 highest rolls together',500,90),
        new Txt('which will result in getting a number from 3 to 18(higher numbers better)',500,120),
        new Txt('After that we will then determine your starting hitpoints',500,180),
        new Txt('by taking your constitution multiplied by 2 and then adding the rolls of 3 6-sided dice',500,210),
        new Txt('Finally we will determine your starting gold by rolling and adding 20 6-sided dice',500,270)]
        this.nextButton = new Button(450,500,'Next')
        this.statButtons = storage.load('statButtons')
        if (this.statButtons == null){
            this.statButtons = [new Button(180,300,'Strength',150),new Button(340,300,'Intelligence',150),new Button(500,300,'Dexterity',150),
            new Button(660,300,'Constitution',150),new Button(255,340,'Wisdom',150),new Button(415,340,'Perception',150),new Button(575,340,'Charisma',150)]
            storage.saveStatButtons(this.statButtons)
        }
        else{
            const array = []
            for (let i=0; i<this.statButtons.length; i++){
                const button = new Button(this.statButtons[i].x,this.statButtons[i].y,this.statButtons[i].text,150,30,24)
                array.push(button)
            }
            this.statButtons = array
        }
    }

    drawTown({ x, y }) {
        ctx.fillStyle = '#007d00'
        ctx.fillRect(0,0,1000,600)
        ctx.drawImage(this.playerImg,x,y)
        ctx.drawImage(this.shopImg,0,300)
        ctx.drawImage(this.manImg,75,440)
        ctx.drawImage(this.chatImg,100,400)
        ctx.drawImage(this.moneyBagImg,105,400)
    }
    drawMainMenu(){
        ctx.fillStyle = '#007d00'
        ctx.fillRect(0,0,1000,600)
        for (let i=0; i<this.mainMenuButtons.length; i++){this.mainMenuButtons[i].draw()}
        this.title.draw()
    }
    drawSetup(){
        ctx.fillStyle = '#007d00'
        ctx.fillRect(0,0,1000,600)
        if (step == 1){
            for (let i=0; i<this.step1.length; i++){
                this.step1[i].draw()
            }
            this.nextButton.draw()
        }
        else if (step == 2){
            for (let i=0; i<this.statButtons.length; i++){
                this.statButtons[i].draw()
            }
            for (let i=0; i<mainText.length; i++){
                mainText[i].draw()
            }
        }
        else{
            this.nextButton.draw()
            for (let i=0; i<mainText.length; i++){
                mainText[i].draw()
            }
        }
    }
}
class MainLoop {
    #controls;
    constructor({ controls }) {
        this.#controls = controls
    }

    run() {
        this.#controls.processInputs()
    }
}

function Roll(dice,min=false,sides=6){
    const rolls = []
    var total = 0
    for (let i=0;i<dice;i++){
        const roll = Math.round(Math.random()*(sides-1)+1)
        rolls.push(roll)
        total += roll
    }
    if (min==true){
        const min = Math.min(rolls[0],rolls[1],rolls[2],rolls[3])
        total -= min
    }
    return {'rolls':rolls, 'total':total}
}

const storage = new Storage()

const playerData = storage.loadPlayer()
  
const player = playerData 
    ? Character.fromJSON(playerData) 
    : new Character()

var page = data.getItem('page')
if (page == null){
    page = 'start'
    data.setItem('page','start')
}

var step = data.getItem('step')
if (step == null){
    step = 1
    data.setItem('step',1)
}

var roll = storage.load('roll')
if (roll == null){
    roll = Roll(4,true)
    storage.saveRoll(roll)
}

var mainText = storage.load('mainText')
console.log(mainText)
if (mainText == null){
    mainText = [new Txt("You rolled "+roll.rolls,500,0), new Txt("So the 3 highest numbers added together comes to "+roll.total,500,30),
    new Txt('Where would you like to assign your value of '+roll.total,500,60)]
    storage.saveText(mainText)
}

else{
    const array = []
    for (let i=0; i<mainText.length; i++){
        const txt = new Txt(mainText[i].text,mainText[i].x,mainText[i].y,mainText[i].color,mainText[i].fontSize)
        array.push(txt)
        console.log(txt)
    }
    mainText = array
}

if (!player.coords.x || !player.coords.y) {
    player.setState({ x: 550, y: 350 });
}
storage.savePlayer(player)

// Setup controls
const controls = new Controls()
controls.on('up', () => player.moveUp())
controls.on('down', () => player.moveDown())
controls.on('left', () => player.moveLeft())
controls.on('right', () => player.moveRight())

// Setup graphics renderer & animation events
const renderer = new CanvasRenderer()
player.on('state:change', (state) => {
    const { x, y } = state
    renderer.drawTown({ x, y })
})

window.addEventListener('keydown', (e) => {
    if (page == 'town'){controls.keyChange(e.key, true)}
})
window.addEventListener('keyup', (e) => {
    if (page == 'town'){controls.keyChange(e.key, false)}
})
window.addEventListener('click',function(e){
    if(page == 'start'){
        const clicked = renderer.mainMenuButtons.find((b) => b.wasClicked(e))
        if (clicked != undefined){
            if (clicked.text == 'Play'){
                page = 'character setup'
                data.setItem('page',page)
                renderer.drawSetup()
            }
        }
    }
    if(page == 'character setup'){
        if(step != 2){
            const clicked = renderer.nextButton.wasClicked(e)
            if (clicked == true){
                if (step == 1){
                    step = 2
                    data.setItem('step',2)
                    renderer.drawSetup()
                }
                else if (step == 3){
                    step = 4
                    data.setItem('step',4)
                    roll = Roll(20)
                    storage.saveRoll(roll)
                    player.assignAttr('gold',roll.total)
                    mainText = [new Txt('Rolling for your gold you got a total of '+roll.total,500,0), new Txt('So you get '+roll.total+' gold to start with',500,30)]
                    storage.saveText(mainText)
                    storage.savePlayer(player)
                    renderer.drawSetup()
                }
                else if (step == 4){
                    step = 5
                    data.setItem('step',5)
                    mainText = [new Txt("Congratulations you have finished creating your character!",500,0,'#000000',36),
                    new Txt("Here are your stats:",500,50), new Txt("Strength -- "+player.getState().strength,500,100),
                    new Txt("Intelligence -- "+player.getState().intelligence,500,130), new Txt("Dexterity -- "+player.getState().dexterity,500,160),
                    new Txt("Constitution -- "+player.getState().constitution,500,190), new Txt("Wisdom -- "+player.getState().wisdom,500,220),
                    new Txt("Perception -- "+player.getState().perception,500,250), new Txt("Charisma -- "+player.getState().charisma,500,280),
                    new Txt("HP -- "+player.getState().hp+"/"+player.getState().max_hp,500,310),new Txt("Gold -- "+player.getState().gold,500,340)]
                    renderer.nextButton.text = 'Begin'
                    storage.saveText(mainText)
                    renderer.drawSetup()
                }
                else if (step == 5){
                    page = 'town'
                    data.setItem('page','town')
                    renderer.drawTown({x:player.getState().x,y:player.getState().y})
                }
            }
        }
        else{
            const clicked = renderer.statButtons.find((b) => b.wasClicked(e))
            if (clicked != undefined){
                player.assignAttr(clicked.text.toLowerCase(), roll.total)
                roll = Roll(4,true)
                storage.saveRoll(roll)
                mainText = [new Txt("You rolled "+roll.rolls,500,0), new Txt("So the 3 highest numbers added together comes to "+roll.total,500,30),
                new Txt('Where would you like to assign your value of '+roll.total,500,60)]
                storage.saveText(mainText)
                const index = renderer.statButtons.indexOf(clicked)
                renderer.statButtons.splice(index,1)
                storage.savePlayer(player)
                storage.saveStatButtons(renderer.statButtons)
                if (renderer.statButtons.length==0){
                    step = 3
                    data.setItem('step',3)
                    roll = Roll(3)
                    storage.saveRoll(roll)
                    player.assignAttr('hp',roll.total+player.getState().constitution*2)
                    player.assignAttr('max_hp',player.getState().hp)
                    mainText = [new Txt("Rolling for your starting hitpoints you got "+roll.rolls+" for a sum of "+roll.total,500,0), 
                    new Txt('plus your constitution of '+player.getState().constitution+' multiplied by 2('+player.getState().constitution*2+')',500,30),
                    new Txt('gives you a total of '+player.hp,500,60),new Txt("So your starting hitpoints is "+player.getState().max_hp,500,90)]
                    storage.savePlayer(player)
                    storage.saveText(mainText)
                }
                renderer.drawSetup()
            }
        }
    }
})

if (page == 'start'){
    renderer.drawMainMenu()
}
if (page == 'character setup'){
    if (step == 5){
        renderer.nextButton.text = 'Begin'
    }
    renderer.drawSetup()
}
setInterval(() => {
    if (page == 'town' || page == 'dungeon'){
        storage.savePlayer(player)
    }
}, 3000)
const mainLoop = new MainLoop({ controls })
function Run(){
    mainLoop.run()
    requestAnimationFrame(Run)
}
Run()
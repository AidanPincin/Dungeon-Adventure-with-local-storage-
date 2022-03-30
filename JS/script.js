import { heroImg, moneyBagImg, manImg, shopImg, chatImg, armorImg, battleAxeImg, chainMailArmorImg, clothArmorImg, daggerImg, fistImg, greatSwordImg, healthPotionImg,
leatherArmorImg, longSwordImg, morningstarImg, plateMailArmorImg, scaleMailArmorImg, sharpSwordImg, studdedLeatherArmorImg, pathImg } from './images.js'
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
        if (page == 'town'){
            if(this.#state.y>0){this.setState({ y: this.#state.y - n })}
            if(this.#state.x<=190 && this.#state.y<=490 && this.#state.y>=230){
                this.setState({ y: this.#state.y + n })
            }
            if (this.#state.x<=250 && this.#state.y>=180){
                new Txt("press 'e'",this.#state.x+30,this.#state.y-30).draw()
            }
        }
        else{
            if(this.#state.y>0){this.setState({ y: this.#state.y - n })}
        }
    }

    moveDown(n = this.#defaultMoveN) {
        if (page == 'town'){
            if(this.#state.y<525){this.setState({ y: this.#state.y + n })}
            if(this.#state.x<=190 && this.#state.y<=490 && this.#state.y>=230){
                this.setState({ y: this.#state.y - n })
            }
            if (this.#state.x<=250 && this.#state.y>=180){
                new Txt("press 'e'",this.#state.x+30,this.#state.y-30).draw()
            }
        }
        else{
            if(this.#state.y<525){this.setState({ y: this.#state.y + n })}
        }
    }

    moveRight(n = this.#defaultMoveN) {
        if (page == 'town'){
            if(this.#state.x<925){this.setState({ x: this.#state.x + n })}
            if (this.#state.x<=250 && this.#state.y>=180){
                new Txt("press 'e'",this.#state.x+30,this.#state.y-30).draw()
            }
        }
        else{
            if(this.#state.x<925){this.setState({ x: this.#state.x + n })}
        }
    }

    moveLeft(n = this.#defaultMoveN) {
        if (page == 'town'){
            if(this.#state.x>0){this.setState({ x: this.#state.x - n })}
            if(this.#state.x<=190 && this.#state.y<=490 && this.#state.y>=230){
                this.setState({ x: this.#state.x + n })
            }
            if (this.#state.x<=250 && this.#state.y>=180){
                new Txt("press 'e'",this.#state.x+30,this.#state.y-30).draw()
            }
        }
        else{
            if(this.#state.x>0){this.setState({ x: this.#state.x - n })} 
        }
    }
    interact(){
        if (page == 'town'){
            const { x: x, y: y } = this.getState()
            if (x<=250 && y>=180){
                page = 'shop'
                data.setItem('page','shop')
                renderer.drawShop()
            }
        }
    }
    assignAttr(attr,value){
        const bonus = attr+'Bonus'
        this.setState({ [attr]: value})
        if (value<=5){this.setState({ [bonus]: -3})}
        else if(value<=7){this.setState({ [bonus]: -2})}
        else if(value<=9){this.setState({ [bonus]: -1})}
        else if(value<=11){this.setState({ [bonus]: 0})}
        else if(value<=13){this.setState({ [bonus]: 1})}
        else if(value<=15){this.setState({ [bonus]: 2})}
        else if(value<=18){this.setState({ [bonus]: 3})}
    }
}
class Controls {
    #controlMap = {
        'w': 'up',
        's': 'down',
        'a': 'left',
        'd': 'right',
        'e': 'interact'
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
function drawRect(color,x,y,width,height){
    ctx.fillStyle = color
    ctx.fillRect(x,y,width,height)
}
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

    saveRooms(rooms){
        const roomData = typeof rooms === 'string'
            ? rooms
            : JSON.stringify(rooms)
        this.#store.setItem('rooms',roomData)
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
        this.title = new Txt('Welcome to Dungeon Adventure!',500,0,'#000000',48)
        this.step1 = [new Txt("Before we begin let's create your character",500,0), new Txt('First we will assign each of your attributes by rolling 4 6-sided dice',500,60),
        new Txt('and adding the 3 highest rolls together',500,90),
        new Txt('which will result in getting a number from 3 to 18(higher numbers better)',500,120),
        new Txt('After that we will then determine your starting hitpoints',500,180),
        new Txt('by taking your constitution multiplied by 2 and then adding the rolls of 3 6-sided dice',500,210),
        new Txt('Finally we will determine your starting gold by rolling and adding 20 6-sided dice',500,270)]
        this.nextButton = new Button(450,500,'Next')
        this.statButtons = storage.load('statButtons')
        this.displayedShopItems = data.getItem('displayedShopItems')
        if (this.displayedShopItems == null){
            this.displayedShopItems = 'weapons'
            data.setItem('displayedShopItems','weapons')
        }
        this.weaponInfo = [new ShopItemInfo(145,75,'Dagger','Damage','1-6',5,daggerImg()), new ShopItemInfo(445,75,"Sharp Sword",'Damage','1-10',10,sharpSwordImg()),
        new ShopItemInfo(745,75,"Morningstar",'Damage','2-12',20,morningstarImg()), new ShopItemInfo(145,350,"Long Sword","Damage","3-18",50,longSwordImg()),
        new ShopItemInfo(445,350,"Battle Axe",'Damage','4-24',125,battleAxeImg()), new ShopItemInfo(745,350,'Great Sword','Damage','5-30',250,greatSwordImg())]
        this.potionInfo = [new ShopItemInfo(145,75,"Healing Potion(3)","Heals","5-30HP",15,healthPotionImg())]
        this.armorInfo = [new ShopItemInfo(145,75,'Cloth Armor','Armor Class',10,30,clothArmorImg()), new ShopItemInfo(445,75,'Leather Armor','Armor Class',11,60,leatherArmorImg()),
        new ShopItemInfo(745,75,'Studded Leather Armor','Armor Class',12,90,studdedLeatherArmorImg()), new ShopItemInfo(145,350,"Scale Mail Armor","Armor Class",13,200,scaleMailArmorImg()),
        new ShopItemInfo(445,350,"Chain Mail Armor","Armor Class",14,400,chainMailArmorImg()), new ShopItemInfo(745,350,'Plate Mail Armor','Armor Class',15,800,plateMailArmorImg())]
        this.mainButtons = [new Button(250,5,"Menu",70,30), new Button(330,5,"Inventory",110)]
        this.backButton = new Button(470,500,'Back',60)
        this.menuButtons = [new Button(450,210,"Resume"), new Button(437.5,250,"Instructions",125), new Button(450,290,"Settings")]
        this.shopButtons = [new Button(890,240,"Weapons"), new Button(890,280,"Potions"), new Button(890,320,"Armors"), new Button(890,360,"Back")]
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
        drawRect('#007d00',0,0,1000,600)
        drawRect('#ffffff',5,5,150,20)
        drawRect('#ff0000',5,5,(player.getState().hp/player.getState().max_hp)*150,20)
        ctx.drawImage(shopImg(),0,300)
        ctx.drawImage(manImg(),75,440)
        ctx.drawImage(chatImg(),100,400)
        ctx.drawImage(moneyBagImg(),105,400)
        new Txt(player.getState().hp+"/"+player.getState().max_hp,185,2,'#000000',20).draw()
        new Txt("Gold -- "+player.getState().gold,60,30).draw()
        for (let i=0; i<this.mainButtons.length; i++){this.mainButtons[i].draw()}
        ctx.drawImage(pathImg(),800,0)
        ctx.drawImage(pathImg(),800,200)
        ctx.beginPath()
        ctx.moveTo(875,75)
        ctx.arc(875,75,75,0,Math.PI*2,false)
        ctx.fillStyle = '#000000'
        ctx.fill()
        ctx.drawImage(heroImg(),x,y)
        if(x>=725 && y<=150){
            page = 'dungeon'
            data.setItem('page','dungeon')
            player.getState().x = 462.5
            player.getState().y = 400
            this.drawDungeon()
        }
    }
    drawMainMenu(){
        drawRect('#007d00',0,0,1000,600)
        for (let i=0; i<this.mainMenuButtons.length; i++){this.mainMenuButtons[i].draw()}
        this.title.draw()
    }
    drawSetup(){
        drawRect('#007d00',0,0,1000,600)
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
    drawInstructions(){
        drawRect('#007d00',0,0,1000,600)
        this.backButton.draw()
    }
    drawMenu(){
        drawRect('#007d00',0,0,1000,600)
        drawRect('#7d7d7d',432.5,200,135,200)
        for (let i=0;i<this.menuButtons.length;i++){this.menuButtons[i].draw()}
    }
    drawSettings(){
        drawRect('#007d00',0,0,1000,600)
        this.backButton.draw()
    }
    drawInventory(){
        drawRect('#007d00',0,0,1000,600)
        this.backButton.draw()
        for (let i=0; i<player.getState().items.length; i++){
            player.getState().items[i].draw()
        }
        for (let i=0; i<6; i++){
            drawRect('#000000',i*90+90,0,1,450)
            drawRect('#000000',90,i*90,450,1)
        }
        drawRect('#000000',540,0,370,1)
        drawRect('#000000',910,0,1,450)
        drawRect('#000000',540,450,370,1)
        drawRect('#000000',820,90,90,1)
        drawRect('#000000',820,0,1,90)
        drawRect('#000000',540,90,90,1)
        drawRect('#000000',630,0,1,90)
        if (player.getState().weapon == 'fists'){
            ctx.drawImage(fistImg(),820,0)
        }
        if (player.getState().armor == 'none'){
            ctx.drawImage(armorImg(),540,0)
        }
    }
    drawShop(){
        drawRect('#007d00',0,0,1000,600)
        for (let i=0; i<this.shopButtons.length; i++){this.shopButtons[i].draw()}
        const info = this.displayedShopItems.toLowerCase().slice(0,this.displayedShopItems.length-1)+'Info'
        for (let i=0; i<this[info].length; i++){
            this[info][i].draw()
        }
        new Txt("Gold -- "+player.getState().gold,850,0).draw()
    }
    drawDungeon(){
        drawRect('#000000',0,0,1000,600)
        rooms[room].draw()
        const { x: x, y: y} = player.getState()
        ctx.drawImage(heroImg(),x,y)
        drawRect('#ffffff',5,5,150,20)
        new Txt(player.getState().hp+"/"+player.getState().max_hp,185,2,'#ffffff',20).draw()
        new Txt("Gold -- "+player.getState().gold,60,30,'#ffffff').draw()
        drawRect('#ff0000',5,5,(player.getState().hp/player.getState().max_hp)*150,20)
        for (let i=0; i<this.mainButtons.length; i++){this.mainButtons[i].draw()}
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
class ShopItemInfo{
    constructor(x,y,name,type,range,cost,img){
        this.x = x
        this.y = y
        this.img = img
        this.info = [new Txt(name,x,y-40,'#000000',30),new Txt(type+" -- "+range,x,y+100),new Txt("Cost -- "+cost,x,y+130)]
        this.cost = cost
        this.buyButton = new Button(x-30,y+160,'Buy',60)
        this.name = name
        this.type = type
        this.range = range
    }
    draw(){
        for (let i=0;i<this.info.length;i++){this.info[i].draw()}
        this.buyButton.draw()
        ctx.drawImage(this.img,this.x-45,this.y)
    }
}
function getSlot(e){
    const { pageX: x, pageY: y } = e
    for (let i=0; i<5; i++){
        for (let g=0; g<5; g++){
            if (x>=100+i*90 && x<=190+i*90 && y>=10+g*90 && y<=100+g*90){
                return {'slotX':i, 'slotY':g}
            }
        }
    }
    if (x>=550 && x<=640 && y>=10 && y<=100){
        return {'slotX':'armor', 'slotY':'armor'}
    }
    if (x>=830 && x<=920 && y>=10 && y<=100){
        return {'slotX':'weapon', 'slotY':'weapon'}
    }

}
class Item{
    constructor(name,type,range,img,slot){
        this.name = name
        this.type = type
        this.range = range
        this.img = img
        this.move = false
        if (slot == undefined){
            const possibleSlots = [...Array(25).keys()].filter(i => player.getState().items.every(item => item.slot !== i))
            console.log(possibleSlots)
            this.slot = Math.min(...possibleSlots)
        }
        else{
            this.slot = slot
        }
        this.slotX = this.slot
        this.slotY = 0
        while (this.slotX>4){
            this.slotX -= 5
            this.slotY += 1
        }
        if (this.type == 'Damage'){
            this.minDmg = JSON.parse(this.range.slice(0,1))
            this.maxDmg = JSON.parse(this.range.slice(2,4))
        }
        if (this.type == 'Heals'){
            this.minHeal = JSON.parse(this.range.slice(0,1))
            this.maxHeal = JSON.parse(this.range.slice(2,4))
        }
        if (this.type == 'Armor Class'){
            this.armorClass = this.range
        }
    }
    draw(){
        if (this.move == true){
            ctx.drawImage(this.img,mouseX-45,mouseY-45)
        }
        else{
            if (this.slot != 'weapon' && this.slot != 'armor'){
                ctx.drawImage(this.img,90+this.slotX*90,this.slotY*90)
            }
            if (this.slot == 'weapon'){
                ctx.drawImage(this.img,820,0)
            }
            if (this.slot == 'armor'){
                ctx.drawImage(this.img,540,0)
            }
        }
    }
    wasClicked(e){
        if (this.move == false){
            const { pageX: x, pageY: y } = e
            if (this.slot != 'weapon' && this.slot != 'armor'){
                if (x>=100+this.slotX*90 && x<=190+this.slotX*90 && y>=this.slotY*90 && y<=this.slotY*90+90){
                    return true
                }
            }
            if (this.slot == 'weapon'){
                if (x>=830 && x<=920 && y>=10 && y<=100){
                    player.getState().weapon = 'fists'
                    return true
                }
            }
            if (this.slot == 'armor'){
                if (x>=550 && x<=640 && y>=10 && y<=100){
                    player.getState().armor = 'none'
                    return true
                }
            }
        }
        else{
            var slots = getSlot(e)
            if (slots.slotX != 'weapon' && slots.slotX != 'armor'){
                this.slotX = slots.slotX
                this.slotY = slots.slotY
                this.move = false
                this.slot = this.slotX+this.slotY*5
            }
            if (slots.slotX == 'weapon' && this.type == 'Damage'){
                this.slot = 'weapon'
                this.move = false
                setTimeout(() => {player.getState().weapon = this.name},0)
            }
            if (slots.slotX == 'armor' && this.type == 'Armor Class'){
                this.slot = 'armor'
                this.move = false
                setTimeout(() => {player.getState().armor = this.name},0)
            }
            setTimeout(() => {renderer.drawInventory()},0)
        }
        storage.savePlayer(player)
    }
}
class Room{
    constructor(north,south,west,east,northRoom = undefined, southRoom = undefined, westRoom = undefined, eastRoom = undefined, monster = undefined){
        this.north = north
        this.south = south
        this.west = west
        this.east = east
        this.northRoom = northRoom
        this.southRoom = southRoom
        this.westRoom = westRoom
        this.eastRoom = eastRoom
        this.monster = monster
    }
    draw(){
        drawRect('#7d7d7d',150,125,700,350)
        var { x: x, y: y } = player.getState()
        if (this.south == true){
            console.log('yes')
            drawRect('#7d7d7d',462.5,475,75,125)
            if (y>400 && (x<=442.5 || x>=482.5)){
                player.getState().y -= 10
                y -= 10
            }
            if (y>400){
                player.getState().x = 465
            }
            if (y>520){
                console.log('yes')
                if(this.southRoom == 'town'){
                    page = 'town'
                    data.setItem('page','town')
                    player.getState().x = 837.5
                    player.getState().y = 300
                    renderer.drawTown({ x: 837.5, y: 300})
                }
                else{
                    room = this.southRoom
                    data.setItem('room',room)
                    player.getState().y = 125
                    renderer.drawDungeon()
                }
            }
        }
        else{
            if (y>400){
                player.getState().y -= 10
            }
        }
        if (this.north == true){
            drawRect('#7d7d7d',462.5,0,75,125)
            if (y<125 && (x<=442.5 || x>=482.5)){
                player.getState().y += 10
                y += 10
            }
            if (y<125){
                player.getState().x = 465
            }
            if (y<20){
                room = this.northRoom
                data.setItem('room',room)
                player.getState().y = 400
                renderer.drawDungeon()
            }
        }
        else{
            if (y<125){
                player.getState().y += 10
            }
        }
        if (this.west == true){
            drawRect('#7d7d7d',0,262.5,150,75)
            if (x<150 && (y<=242.5 || y>=282.5)){
                player.getState().x += 10
                x += 10
            }
            if (x<150){
                player.getState().y = 262.5
            }
            if (x<20){
                room = this.westRoom
                data.setItem('room',room)
                player.getState().x = 775
                renderer.drawDungeon()
            }
        }
        else{
            if (x<150){
                player.getState().x += 10
            }
        }
        if (this.east == true){
            drawRect('#7d7d7d',850,262.5,150,75)
            if (x>775 && (y<=242.5 || y>=282.5)){
                player.getState().x -= 10
                x -= 10
            }
            if (x>775){
                player.getState().y = 262.5
            }
            if (x>920){
                room = this.eastRoom
                data.setItem('room',room)
                player.getState().x = 150
                renderer.drawDungeon()
            }
        }
        else{
            if (x>775){
                player.getState().x -= 10
            }
        }

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
    }
    mainText = array
}
try{
    const array = []
    for (let i=0; i<player.getState().items.length; i++){
        const info = player.getState().items[i]
        var img = undefined
        if(info.name == 'Dagger'){img = daggerImg()}
        if(info.name == 'Sharp Sword'){img = sharpSwordImg()}
        if(info.name == 'Morningstar'){img = morningstarImg()}
        if(info.name == 'Healing Potion(3)'){img = healthPotionImg()}
        if(info.name == 'Long Sword'){img = longSwordImg()}
        if(info.name == 'Battle Axe'){img = battleAxeImg()}
        if(info.name == 'Great Sword'){img = greatSwordImg()}
        const item = new Item(info.name,info.type,info.range,img,info.slot)
        array.push(item)
    
    }
    player.getState().items = array
}
catch{}

var inInstructions = JSON.parse(data.getItem('inInstructions'))
var inMenu = JSON.parse(data.getItem('inMenu'))
var inSettings = JSON.parse(data.getItem('inSettings'))
var inInventory = JSON.parse(data.getItem('inInventory'))
var room = data.getItem('room')
if (inInstructions == null){
    inInstructions = false
    inMenu = false
    inSettings = false
    inInventory = false
    room = 0
    data.setItem('inInstructions',false)
    data.setItem('inSettings', false)
    data.setItem('inMenu',false)
    data.setItem('inInventory',false)
    data.setItem('room',0)
}
console.log(room)

var rooms = storage.load(room)
if (rooms == null){
    rooms = [new Room(true,true,false,false,1,'town',undefined,undefined), new Room(true,true,true,false,2,0,3,undefined), new Room(true,true,true,true,12,1,7,8),
    new Room(false,false,true,true,undefined,undefined,4,1), new Room(true,false,true,true,6,undefined,5,3), //4
    new Room(false,false,false,true,undefined,undefined,undefined,4), new Room(true,true,false,true,20,4,undefined,7), //6
    new Room(false,false,true,true,undefined,undefined,6,2), new Room(false,false,true,true,undefined,undefined,2,9), //8
    new Room(false,true,true,true,undefined,10,8,15), new Room(true,true,false,false,9,11), //10
    new Room(true,false,false,false,10,undefined,undefined,undefined), new Room(true,true,false,true,37,2,undefined,13), //12
    new Room(false,false,true,true,undefined,undefined,12,14), new Room(true,true,true,true,44,15,13,19), //14
    new Room(true,true,true,true,14,16,9,18), new Room(true,false,false,true,15,undefined,undefined,17), //16
    new Room(false,false,true,false,undefined,undefined,16,undefined), new Room(false,false,true,false,undefined,undefined,15), //18
    new Room(true,false,true,false,45,undefined,14,undefined), new Room(true,true,false,false,21,6),  //20
    new Room(true,true,true,false,23,20,22), new Room(false,false,false,true,undefined,undefined,undefined,21),  //22
    new Room(true,true,false,false,24,21), new Room(true,true,false,true,25,23,undefined,35), //24
    new Room(true,true,false,false,26,24), new Room(false,true,false,true,undefined,25,undefined,27),  //26
    new Room(false,false,true,true,undefined,undefined,26,28), new Room(false,true,true,false,undefined,29,27,undefined),  //28
    new Room(true,true,true,true,28,34,32,30), new Room(false,false,true,true,undefined,undefined,29,31),  //30
    new Room(false,false,true,false,undefined,undefined,30), new Room(false,false,true,true,undefined,undefined,33,29), //32
    new Room(false,false,false,true,undefined,undefined,undefined,32), new Room(true,true,true,true,29,37,35,38),  //34
    new Room(false,true,true,true,undefined,36,24,34), new Room(true,false,false,false,35), //36
    new Room(true,true,false,false,34,12), new Room(false,true,true,true,undefined,39,34,41),   //38
    new Room(true,true,false,false,38,40), new Room(true,false,false,false,39,undefined,undefined,undefined),  //40
    new Room(false,true,true,true,undefined,42,38,48), new Room(true,true,false,false,41,43),  //42
    new Room(true,true,false,false,42,44), new Room(true,true,false,false,43,14,undefined,undefined),  //44
    new Room(true,true,false,false,46,19), new Room(true,true,false,false,47,45),   //46
    new Room(true,true,true,false,49,46,48), new Room(false,false,true,true,undefined,undefined,41,47),   //48
    new Room(true,true,false,false,50,47), new Room(false,true,true,true,undefined,49,52,51),  //50
    new Room(false,false,true,false,undefined,undefined,50), new Room(true,false,false,true,53,undefined,undefined,50),   //52
    new Room(true,true,true,true,57,52,58,54), new Room(true,false,true,true,56,undefined,53,55),   //54
    new Room(false,false,true,false,undefined,undefined,54,undefined), new Room(false,true,false,false,undefined,54),   //56
    new Room(false,true,false,false,undefined,53), new Room(true,false,true,true,59,undefined,60,53),    //58
    new Room(false,true,false,false,undefined,58), new Room(true,false,false,true,61,undefined,undefined,58),   //60
    new Room(false,true,false,false,undefined,60,undefined,undefined)]  //61
    storage.saveRooms(rooms)
}
else{

}

if (!player.coords.x || !player.coords.y || !player.getState().items || !player.getState().weapon || !player.getState().armor) {
    player.setState({ x: 550, y: 350, items:[], weapon:'fists', armor:'none' });
}
storage.savePlayer(player)

const controls = new Controls()
controls.on('up', () => player.moveUp())
controls.on('down', () => player.moveDown())
controls.on('left', () => player.moveLeft())
controls.on('right', () => player.moveRight())
controls.on('interact', () => player.interact())

const renderer = new CanvasRenderer()
player.on('state:change', (state) => {
    const { x, y } = state
    if (page == 'town'){
        renderer.drawTown({ x, y })
    }
    else{
        renderer.drawDungeon()
    }
    storage.savePlayer(player)
})

window.addEventListener('keydown', (e) => {
    if (page == 'town' || page == 'dungeon'){controls.keyChange(e.key, true)}
})
window.addEventListener('keyup', (e) => {
    if (page == 'town' || page == 'shop' || page == 'dungeon'){controls.keyChange(e.key, false)}
})
var mouseX = 0
var mouseY = 0
window.addEventListener('mousemove',function(e){
    mouseX = e.pageX
    mouseY = e.pageY
    if (inInventory == true){
        renderer.drawInventory()
    }
})
window.addEventListener('click',function(e){
    if (inSettings == true){
        const clicked = renderer.backButton.wasClicked(e)
        if (clicked == true){
            inSettings = false
            data.setItem('inSettings',false)
            if (page == 'town'){renderer.drawMenu()}
            else{renderer.drawMainMenu()}
        }
    }
    else if (inInstructions == true){
        const clicked = renderer.backButton.wasClicked(e)
        if (clicked == true){
            inInstructions = false
            data.setItem('inInstructions',false)
            if (page == 'town'){renderer.drawMenu()}
            else{renderer.drawMainMenu()}
        }
    }
    else if (inMenu == true){
        const clicked = renderer.menuButtons.find((b) => b.wasClicked(e))
        if (clicked != undefined){
            if (clicked.text == 'Resume'){
                inMenu = false
                data.setItem("inMenu",false)
                if (page == 'town'){renderer.drawTown({x:player.getState().x, y:player.getState().y})}
                else{renderer.drawDungeon()}
            }
            if (clicked.text == 'Instructions'){
                inInstructions = true
                data.setItem('inInstructions',true)
                renderer.drawInstructions()
            }
            if (clicked.text == 'Settings'){
                inSettings = true
                data.setItem('inSettings',true)
                renderer.drawSettings()
            }
        }
    }
    else if (inInventory == true){
        const clicked = renderer.backButton.wasClicked(e)
        if (clicked == true){
            inInventory = false
            data.setItem('inInventory',false)
            if (page == 'town'){renderer.drawTown({x: player.getState().x, y: player.getState().y})}
            else{renderer.drawDungeon()}
        }
        const click = player.getState().items.find((i) => i.wasClicked(e))
        if (click != undefined){
            click.move = true
            renderer.drawInventory()
        }
    }
    else if(page == 'start'){
        const clicked = renderer.mainMenuButtons.find((b) => b.wasClicked(e))
        if (clicked != undefined){
            if (clicked.text == 'Play'){
                page = 'character setup'
                data.setItem('page',page)
                renderer.drawSetup()
            }
            if (clicked.text == 'Instructions'){
                inInstructions = true
                data.setItem('inInstructions',true)
                renderer.drawInstructions()
            }
            if (clicked.text == 'Settings'){
                inSettings = true
                data.setItem('inSettings',true)
                renderer.drawSettings()
            }
        }
    }
    else if(page == 'character setup'){
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
    else if (page == 'shop'){
        const clicked = renderer.shopButtons.find((b) => b.wasClicked(e))
        if (clicked != undefined){
            if (clicked.text == 'Back'){
                page = 'town'
                data.setItem('page','town')
                renderer.drawTown({x: player.getState().x, y: player.getState().y })
            }
            else{
                renderer.displayedShopItems = clicked.text.toLowerCase()
                data.setItem('displayedShopItems',clicked.text.toLowerCase())
                renderer.drawShop()
            }
        }
        var click = undefined
        if (renderer.displayedShopItems == 'weapons'){
            click = renderer.weaponInfo.find((b) => b.buyButton.wasClicked(e))
        }
        if (renderer.displayedShopItems == 'potions'){
            click = renderer.potionInfo.find((b) => b.buyButton.wasClicked(e))
        }
        if (renderer.displayedShopItems == 'armors'){
            click = renderer.armorInfo.find((b) => b.buyButton.wasClicked(e))
        }
        if (click != undefined){
            if (player.getState().gold>=click.cost){
                player.getState().gold -= click.cost
                renderer.drawShop()
                player.getState().items.push(new Item(click.name,click.type,click.range,click.img))
                storage.savePlayer(player)
            }
        }
    }
    else if (page == 'town'){
        const clicked = renderer.mainButtons.find((b) => b.wasClicked(e))
        if (clicked != undefined){
            if (clicked.text == 'Menu'){
                inMenu = true
                data.setItem('inMenu',true)
                renderer.drawMenu()
            }
            if (clicked.text == 'Inventory'){
                inInventory = true
                data.setItem('inInventory',true)
                renderer.drawInventory()
            }
        }
    }
    else if (page == 'dungeon'){
        const clicked = renderer.mainButtons.find((b) => b.wasClicked(e))
        if (clicked != undefined){
            if (clicked.text == 'Menu'){
                inMenu = true
                data.setItem('inMenu',true)
                renderer.drawMenu()
            }
            if (clicked.text == 'Inventory'){
                inInventory = true
                data.setItem('inInventory',true)
                renderer.drawInventory()
            }
        }
    }
})
if (inInstructions == true){
    renderer.drawInstructions()
}
else if (inSettings == true){
    renderer.drawSettings()
}
else if (inInventory == true){
    renderer.drawInventory()
    for (let i=0; i<100; i++){
        setTimeout(() => {renderer.drawInventory()},i*10)
    }
}
else if(inMenu == true){
    renderer.drawMenu()
}
else if (page == 'start'){
    renderer.drawMainMenu()
}
else if (page == 'character setup'){
    if (step == 5){
        renderer.nextButton.text = 'Begin'
    }
    renderer.drawSetup()
}
else if (page == 'town'){
    renderer.drawTown({x:player.getState().x,y:player.getState().y})
    for (let i=0; i<100; i++){
        setTimeout(() => {renderer.drawTown({x:player.getState().x,y:player.getState().y})},i*10)
    }
}
else if (page == 'shop'){
    renderer.drawShop()
    for (let i=0; i<100; i++){
        setTimeout(() => {renderer.drawShop()},i*10)
    }
}
else if (page == 'dungeon'){
    renderer.drawDungeon()
    for (let i=0; i<100; i++){
        setTimeout(() => {renderer.drawDungeon()},i*10)
    }
}
const mainLoop = new MainLoop({ controls })
function Run(){
    mainLoop.run()
    requestAnimationFrame(Run)
}
Run()

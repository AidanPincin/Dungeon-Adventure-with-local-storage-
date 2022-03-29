function image(src){
    const img = new Image()
    img.src = src
    return img
}
const HeroImg = image('Images/hero.png')
const ChatImg = image('Images/chat.png')
const ShopImg = image('Images/shop.png')
const ManImg = image('Images/man.png')
const MoneyBagImage = image('Images/money-bag.png')
export function heroImg(){return HeroImg}
export function chatImg(){return ChatImg}
export function shopImg(){return ShopImg}
export function manImg(){return ManImg}
export function moneyBagImg(){return MoneyBagImage}

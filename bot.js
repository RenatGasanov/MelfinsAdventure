require("dotenv").config();
const { Bot, GrammyError, HttpError, Keyboard, InputFile } = require("grammy");
const bot = new Bot(process.env.BOT_API_KEY);

const regexMat = /(бля|сука|пизда|пиздец|ебать|нахуй|хуй|уебак|уебище|Шариф|пидарас|пидор|блядь|блять)/i;
const text = require("./text.js");
const picture0 = new InputFile("./pictures/picture0.png"),
picture1 = new InputFile("./pictures/picture1.png"),
picture2 = new InputFile("./pictures/picture2.png"),
picture3 = new InputFile("./pictures/picture3.png"),
picture4 = new InputFile("./pictures/picture4.png"),
picture5 = new InputFile("./pictures/picture5.png"),
picture6 = new InputFile("./pictures/picture6.png"),
picture7 = new InputFile("./pictures/picture7.png"),
picture8 = new InputFile("./pictures/picture8.png"),
picture9 = new InputFile("./pictures/picture9.png"),
picture10 = new InputFile("./pictures/picture10.png");

let objCarmaPoints = {}; // очки кармы и инвентарь работают по принципе: добавляем в объект свойство номера чата со значением 0
let objBag = {}; // аналогично добавляем в объект свойство номера чата с пустым массивом, затем в него добавляем вещи (стринги)

bot.api.setMyCommands([
    { command: "start", description: "Начать игру/перезапустить игру" },
    { command: "bag", description: "Показать что сейчас в сумке " },
]);

bot.catch((err) => {
    const ctx = err.ctx; //обработчик ошибок, чтобы бот не падал
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError) {
        console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
        console.error("Could not contact Telegram:", e);
    } else {
        console.error("Unknown error:", e);
    }
});

bot.command("start", async (ctx) => {    
    objCarmaPoints[ctx.chatId] = 0;
    objBag[ctx.chatId] = [];
    console.log('carmaPoints on start : ',objCarmaPoints);
    console.log('Bag on start: ',objBag);
    
    const keyboardStart = new Keyboard().text(text.buttonStageStartText).resized();
    await ctx.reply(
        "Привет! Это бот 🤖 - игра. В этом боте ты сможешь окунуться в увлекательное приключение Мелфи. \n Чтобы перезапустить игру/бота, ты можешь написать /start или нажать эту команду в меню слева от ввода сообщения.\n Чтобы посмотреть, что у тебя находится в сумке - нажми /bag. Ну что, Ты готов начать приключение???\n \nНажми первую кнопку снизу, чтобы начать :)",
        { reply_markup: keyboardStart }
    );
});

bot.command("bag", async (ctx) => {
    const chatId = ctx.chatId;
    if (objBag[chatId].length == 0) {
        await ctx.reply(`Сейчас в сумке 👜 ничего не лежит 😔`);
    } else await ctx.reply(`Сейчас в сумке 👜 лежит :`);
    for (let i = 0; i < objBag[chatId].length; i++) {
        await ctx.reply(`${i + 1}) ${objBag[chatId][i]}`);
    }
});

bot.hears(regexMat, async (ctx) => {
    await ctx.reply("Так так так...Давай ка без мата!");
});

bot.hears(text.buttonStageStartText, async (ctx) => {
    const keyboard0 = new Keyboard().text(text.buttonStage0Text).resized();
    await ctx.reply(text.arrStageTexts[0], { reply_markup: keyboard0 });
    await ctx.replyWithPhoto(picture0);
});

bot.hears(text.buttonStage0Text, async (ctx) => {
    const keyboard1 = new Keyboard()
    .resized()
    .text(text.buttonStage1Text[0])
    .row()
    .text(text.buttonStage1Text[1])
    .row();
    await ctx.reply(text.arrStageTexts[1], { reply_markup: keyboard1 });
    await ctx.replyWithPhoto(picture1);
});

bot.hears(text.buttonStage1Text[0], async (ctx) => {
    const keyboard2 = new Keyboard()
    .resized()
    .text(text.buttonStage2Text[0])
    .row()
    .text(text.buttonStage2Text[1])
    .row()
    .text(text.buttonStage2Text[2])
    .row();
    await ctx.reply(text.arrStageTexts[2], { reply_markup: keyboard2 });
    await ctx.replyWithPhoto(picture2);
});

bot.hears(
    [text.buttonStage2Text[0], text.buttonStage2Text[1], text.buttonStage2Text[2], text.buttonStage1Text[1]],
    async (ctx) => {
        const chatId = ctx.chatId;
        
        const keyboard3 = new Keyboard().resized().text(text.buttonStage3Text).row();
        
        switch (ctx.message.text) {
            case text.buttonStage2Text[0]:
            objBag[chatId].push("Сушеное крыло Лисмагена 🪽");
            break;
            case text.buttonStage2Text[1]:
            objBag[chatId].push("Зелье из чешуи Змероноса 🧪");
            break;
        }
        await ctx.reply(text.arrStageTexts[3], { reply_markup: keyboard3 });
        await ctx.replyWithPhoto(picture3);
    }
);

bot.hears(
    text.buttonStage3Text,
    async (ctx) => {
        const chatId = ctx.chatId;
        const keyboard4 = new Keyboard().resized().text(text.buttonStage4Text[0]).row().text(text.buttonStage4Text[1]).row();
        
        await ctx.reply(text.arrStageTexts[4], { reply_markup: keyboard4 });
        await ctx.replyWithPhoto(picture4);
    }
);

bot.hears(
    [text.buttonStage4Text[0],text.buttonStage4Text[1]],
    async (ctx) => {
        const chatId = ctx.chatId;
        const keyboard5 = new Keyboard().resized().text(text.buttonStage5Text).row()
        
        switch (ctx.message.text) {
            case text.buttonStage4Text[0]:
            await ctx.reply(text.arrStageTexts[5],{ reply_markup: keyboard5 }); break
            case text.buttonStage4Text[1]:
            await ctx.reply(text.arrStageTexts[6], { reply_markup: keyboard5 }); 
            --objCarmaPoints[chatId]
            console.log(`carma point on Jonim answer ${objCarmaPoints[chatId]}`) 
            break
        }
        
    }
);

bot.hears(
    text.buttonStage5Text,
    async (ctx) => {
        const chatId = ctx.chatId;
        const keyboard6 = new Keyboard().resized().text(text.buttonStage6Text[0]).row().text(text.buttonStage6Text[1]).row();
        
        await ctx.reply(text.arrStageTexts[7], { reply_markup: keyboard6 });
        await ctx.replyWithPhoto(picture5);
    }
);

bot.hears(
    [text.buttonStage6Text[0],text.buttonStage6Text[1]],
    async (ctx) => {
        const chatId = ctx.chatId;
        const keyboard7 = new Keyboard().resized().text(text.buttonStage7Text).row();
        
        if(ctx.message.text == text.buttonStage6Text[0]){
            objCarmaPoints[ctx.chatId]++; // надо будет удалить. Это чисто для проверки работы
            console.log(`${objCarmaPoints[chatId]}`) }
            
            await ctx.reply(text.arrStageTexts[8], { reply_markup: keyboard7 });
            await ctx.replyWithPhoto(picture6);
        }
    );
    
    bot.hears(
        text.buttonStage7Text,
        async (ctx) => {
            const chatId = ctx.chatId;
            const keyboard8 = new Keyboard().resized().text(text.buttonStage8Text).row();
            
            
            await ctx.reply(text.arrStageTexts[9], { reply_markup: keyboard8 });
            await ctx.replyWithPhoto(picture7);
        }
    );
    
    bot.hears(
        text.buttonStage8Text,
        async (ctx) => {
            const chatId = ctx.chatId;
            const keyboard9 = new Keyboard().resized().text(text.buttonStage9Text).row();
            
            
            await ctx.reply(text.arrStageTexts[10], { reply_markup: keyboard9 });
            await ctx.replyWithPhoto(picture8);
        }
    );
    
    bot.hears(
        text.buttonStage9Text,
        async (ctx) => {
            const chatId = ctx.chatId;
            const keyboard10 = new Keyboard().resized().text(text.buttonStage10Text[0]).row().text(text.buttonStage10Text[1]).row();
            
            
            await ctx.reply(text.arrStageTexts[11], { reply_markup: keyboard10 });
            await ctx.replyWithPhoto(picture9);
        }
    );
    
    bot.hears(
        text.buttonStage10Text[0],
        async (ctx) => {
            const chatId = ctx.chatId;
            const keyboard11 = new Keyboard().resized().text(text.buttonStage11Text[0]).row().text(text.buttonStage11Text[1]).row();
            
            
            await ctx.reply(text.arrStageTexts[12], { reply_markup: keyboard11 });
            await ctx.replyWithPhoto(picture10);
        }
    );
    
    bot.hears(
        text.buttonStage11Text[0],
        async (ctx) => {
            const chatId = ctx.chatId;
            const keyboard12 = new Keyboard().resized().text(text.buttonStage12Text[0]).row().text(text.buttonStage12Text[1]).row();
            
            if(ctx.message.text == text.buttonStage11Text[0]){
                objBag[chatId].push("Амулет 💠")
            }
            await ctx.reply(text.arrStageTexts[13], { reply_markup: keyboard12 });
        }
    );
        

        bot.hears(
        [text.buttonStage12Text[0],text.buttonStage12Text[1]],
        async (ctx) => {
            const chatId = ctx.chatId;
            const keyboard13 = new Keyboard().resized().text(text.buttonStage13Text[0]).row().text(text.buttonStage13Text[1]).row();
            
            
            
            await ctx.reply(text.arrStageTexts[14], { reply_markup: keyboard13 });
        }
    );
    




    
    bot.start();
    
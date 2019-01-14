# Создайте виджет просто так

```
git clone https://github.com/swaponline/swap.react.git
cd swap.react
git submodule update
npm i
npm run build:testnet-widget 0x9E4AD79049282F942c1b4c9b418F0357A0637017 noxon 0 NOXON
```


# Swap Online Button
Генератор и загрузчик кнопки моментального обмена криптовалюты
Для получения кода кнопки, который можно установить на вашем сайте перейдите по ссылке [Генератор Swap.Button](https://swaponline.github.io/swap.button/generator/build/index.html)
Генератор поддерживает следующие стили кнопок
* Inline
* Vertical Fixed Left
* Vertical Fixed Right
* Fixed Left-Top
* Fixed Right-Top
* Fixed Left-Bottom
* Fixed Right-Bottom

**Inline** кнопка предназначена для сквозного размещения в тексте, Остальные кнопки являются фиксированными (находятся постоянно в поле зрения посетителя сайта).
Вариации стилей кнопки схематично изображены ниже

![Вариации стилей кнопки](https://raw.githubusercontent.com/swaponline/swap.button/master/Button%20Style.png)
## Генерация кода кнопки и установка кнопки на сайт
Чтобы получить код кнопки, перейдите по ссылке генератора, настройте направления обмена и стиль кнопки. По завершению генератор предоставит вам код, который вы должны разместить на своем сайте в нужном для вас месте.
Обратите внимание на то, что сам обмен происходит на стороне пользователя и использует шифрование, которое доступно только для сайтов с установленным SSL сертификатом (HTTPS протокол). Если ваш сайт работает по протоколу HTTP без SSL, то ваши посетители не смогут использовать кнопку.
Ниже вы можете просмотреть видео демонстрации процесса генерации кода и установки его на сайт.


фичиЖ
- Срочный. Форс-мажор
- Режимы работы
- Контракт с возможностью указать адрес назначения
- Режимы работы
-- Ордербук
-- Эмулятор бота
- Покупка токенов
- Прямое пополнение адреса btc скрипта (направление btc->token)
- Режим покупки токенов при нулевом балансе (транзакции за счет продавца)
-- Не безопастный режим (продавцу сообщается ключ снятия средств с контракта)
--- Только для продавцов-роботов
-- Наглый режим - продавец пополняет счет покупателю на сумму, нужную для транзакции снятия
-- Режим работы задается при создании свапа. По умолчанию режим "Ошибка - не достаточно средств"
Генератор
- Выбор режима кнопки
-- OrderBook (список ордеров на покупку)
-- BuyRequest (форма запроса на покупку)
-- Bot (эмулятор бота, который отвечает на BuyRequest)

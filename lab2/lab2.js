const fs = require('fs');
const path = require('path');

// Перечислитель для цветов
const Color = {
    RED: '\x1b[31m',
    GREEN: '\x1b[32m',
    YELLOW: '\x1b[33m',
    BLUE: '\x1b[34m',
    MAGENTA: '\x1b[35m',
    CYAN: '\x1b[36m',
    WHITE: '\x1b[37m',
    RESET: '\x1b[0m'
};

class Printer {
    /**
     * @param {Object} options - Опции принтера
     * @param {Color} options.color - Цвет текста
     * @param {[number, number]} options.position - Позиция [x, y]
     * @param {string} options.symbol - Символ для псевдошрифта
     * @param {string} options.fontFile - Путь к файлу с описанием шрифта
     */
    constructor({ color, position, symbol, fontFile }) {
        this.color = color || Color.WHITE;
        this.position = position || [0, 0];
        this.symbol = symbol || '*';
        
        // Получаем абсолютный путь к файлу шрифта
        this.fontPath = fontFile ? path.join(__dirname, fontFile) : null;
        this.fontData = this.fontPath ? this.loadFont(this.fontPath) : null;
    }

    /**
     * Загружает шрифт из файла
     * @param {string} fontFile - Путь к файлу с описанием шрифта
     * @returns {Object} Объект с описанием символов шрифта
     */
    loadFont(fontPath) {
        try {
            if (!fs.existsSync(fontPath)) {
                console.error(`Font file not found at: ${fontPath}`);
                return null;
            }
            const data = fs.readFileSync(fontPath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error loading font file:', error.message);
            return null;
        }
    }

    /**
     * Устанавливает позицию курсора
     * @param {number} x 
     * @param {number} y 
     */
    setPosition(x, y) {
        process.stdout.write(`\x1b[${y};${x}H`);
    }

    /**
     * Сбрасывает настройки цвета
     */
    resetColor() {
        process.stdout.write(Color.RESET);
    }

    /**
     * Выводит текст с использованием псевдошрифта
     * @param {string} text 
     */
    printWithFont(text) {
        if (!this.fontData) {
            this.print(text);
            return;
        }

        const lines = {};
        const upperText = text.toUpperCase();

        // Собираем все линии для каждого символа
        for (const char of upperText) {
            if (this.fontData[char]) {
                const charLines = this.fontData[char].split('\n');
                for (let i = 0; i < charLines.length; i++) {
                    if (!lines[i]) lines[i] = '';
                    lines[i] += charLines[i].replace(/\*/g, this.symbol) + ' ';
                }
            } else if (char === ' ') {
                // Обработка пробела
                for (let i = 0; i < 5; i++) {
                    if (!lines[i]) lines[i] = '';
                    lines[i] += '     '; // 5 пробелов для пробела
                }
            }
        }

        // Выводим построчно
        let [x, y] = this.position;
        for (const line in lines) {
            this.setPosition(x, y + parseInt(line));
            process.stdout.write(this.color + lines[line] + Color.RESET);
        }
    }

    /**
     * Выводит текст
     * @param {string} text 
     */
    print(text) {
        this.setPosition(...this.position);
        process.stdout.write(this.color + text + Color.RESET);
    }

    /**
     * Статический метод для вывода текста
     * @param {string} text - Текст для вывода
     * @param {Color} color - Цвет текста
     * @param {[number, number]} position - Позиция [x, y]
     * @param {string} symbol - Символ для псевдошрифта
     * @param {string} fontFile - Путь к файлу с описанием шрифта
     */
    static print(text, color = Color.WHITE, position = [0, 0], symbol = '*', fontFile = null) {
        const printer = new Printer({ color, position, symbol, fontFile });
        if (fontFile) {
            printer.printWithFont(text);
        } else {
            printer.print(text);
        }
    }

    /**
     * Восстанавливает оригинальные настройки консоли
     */
    dispose() {
        this.resetColor();
        // Не можем восстановить позицию, так как не отслеживаем изменения
    }
}

// Демонстрация работы
function demo() {
    // Очищаем консоль
    console.clear();

    // Статическое использование
    Printer.print("Hello static!", Color.GREEN, [5, 5]);
    Printer.print("Big text!", Color.CYAN, [10, 10], '#', 'font.json');

    // Использование с контекстом
    const printer = new Printer({ 
        color: Color.MAGENTA, 
        position: [15, 15], 
        symbol: '@', 
        fontFile: 'font.json' 
    });
    
    try {
        printer.printWithFont("HELLO");
        printer.printWithFont("WORLD");
    } finally {
        printer.dispose();
    }

    // После выхода из блока
    console.log("\nBack to normal console output");
}

demo();
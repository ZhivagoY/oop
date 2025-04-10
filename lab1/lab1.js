// Определение констант для ограничения координат точек
const WIDTH = 800;
const HEIGHT = 600;

// Класс для представления точки на плоскости
class Point2d {
    /**
     * Конструктор для создания точки с проверкой ограничений.
     * @param {number} x - Координата X.
     * @param {number} y - Координата Y.
     */
    constructor(x, y) {
        // Проверка ограничений для координаты X
        if (x < 0 || x > WIDTH) {
            throw new Error(`x must be between 0 and ${WIDTH}`);
        }
        // Проверка ограничений для координаты Y
        if (y < 0 || y > HEIGHT) {
            throw new Error(`y must be between 0 and ${HEIGHT}`);
        }
        this.x = x;
        this.y = y;
    }

    /**
     * Метод для сравнения двух точек на эквивалентность.
     * @param {Point2d} other - Другая точка для сравнения.
     * @returns {boolean} - True, если точки эквивалентны.
     */
    eq(other) {
        return this.x === other.x && this.y === other.y;
    }

    /**
     * Метод для получения строкового представления точки.
     * @returns {string} - Строковое представление точки.
     */
    toString() {
        return `(${this.x}, ${this.y})`;
    }

    /**
     * Метод для получения представления точки в формате repr.
     * @returns {string} - Представление точки в формате repr.
     */
    repr() {
        return `Point2d(${this.x}, ${this.y})`;
    }
}

// Класс для представления вектора на плоскости
class Vector2d {
    /**
     * Конструктор для создания вектора из координат.
     * @param {number} x - Координата X.
     * @param {number} y - Координата Y.
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Статический метод для создания вектора из двух точек.
     * @param {Point2d} start - Начальная точка.
     * @param {Point2d} end - Конечная точка.
     * @returns {Vector2d} - Вектор из двух точек.
     */
    static fromPoints(start, end) {
        return new Vector2d(end.x - start.x, end.y - start.y);
    }

    /**
     * Метод для доступа к компонентам вектора по индексу.
     * @param {number} index - Индекс компоненты (0 для X, 1 для Y).
     * @returns {number} - Значение компоненты.
     */
    get(index) {
        if (index === 0) return this.x;
        if (index === 1) return this.y;
        throw new Error("Index out of bounds");
    }

    /**
     * Метод для установки значения компоненты вектора по индексу.
     * @param {number} index - Индекс компоненты.
     * @param {number} value - Новое значение компоненты.
     */
    set(index, value) {
        if (index === 0) this.x = value;
        else if (index === 1) this.y = value;
        else throw new Error("Index out of bounds");
    }

    /**
     * Метод для итерации по компонентам вектора.
     * @returns {Iterator} - Итератор по компонентам.
     */
    *[Symbol.iterator]() {
        yield this.x;
        yield this.y;
    }

    /**
     * Свойство для получения количества компонент вектора.
     * @returns {number} - Количество компонент (всегда 2).
     */
    get length() {
        return 2;
    }

    /**
     * Метод для сравнения двух векторов на эквивалентность.
     * @param {Vector2d} other - Другой вектор для сравнения.
     * @returns {boolean} - True, если векторы эквивалентны.
     */
    eq(other) {
        return this.x === other.x && this.y === other.y;
    }

    /**
     * Метод для получения строкового представления вектора.
     * @returns {string} - Строковое представление вектора.
     */
    toString() {
        return `(${this.x}, ${this.y})`;
    }

    /**
     * Метод для получения представления вектора в формате repr.
     * @returns {string} - Представление вектора в формате repr.
     */
    repr() {
        return `Vector2d(${this.x}, ${this.y})`;
    }

    /**
     * Метод для вычисления модуля (длины) вектора.
     * @returns {number} - Длина вектора.
     */
    abs() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    /**
     * Метод для сложения двух векторов.
     * @param {Vector2d} other - Другой вектор для сложения.
     * @returns {Vector2d} - Сумма двух векторов.
     */
    add(other) {
        return new Vector2d(this.x + other.x, this.y + other.y);
    }

    /**
     * Метод для вычитания двух векторов.
     * @param {Vector2d} other - Другой вектор для вычитания.
     * @returns {Vector2d} - Разность двух векторов.
     */
    sub(other) {
        return new Vector2d(this.x - other.x, this.y - other.y);
    }

    /**
     * Метод для умножения вектора на скаляр.
     * @param {number} scalar - Скаляр для умножения.
     * @returns {Vector2d} - Вектор, умноженный на скаляр.
     */
    mul(scalar) {
        return new Vector2d(this.x * scalar, this.y * scalar);
    }

    /**
     * Метод для деления вектора на скаляр.
     * @param {number} scalar - Скаляр для деления.
     * @returns {Vector2d} - Вектор, разделенный на скаляр.
     */
    div(scalar) {
        if (scalar === 0) throw new Error("Division by zero");
        return new Vector2d(this.x / scalar, this.y / scalar);
    }

    /**
     * Метод для вычисления скалярного произведения двух векторов.
     * @param {Vector2d} other - Другой вектор для скалярного произведения.
     * @returns {number} - Скалярное произведение двух векторов.
     */
    dot(other) {
        return this.x * other.x + this.y * other.y;
    }

    /**
     * Статический метод для вычисления скалярного произведения двух векторов.
     * @param {Vector2d} v1 - Первый вектор.
     * @param {Vector2d} v2 - Второй вектор.
     * @returns {number} - Скалярное произведение двух векторов.
     */
    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    }

    /**
     * Метод для вычисления векторного произведения двух векторов.
     * @param {Vector2d} other - Другой вектор для векторного произведения.
     * @returns {number} - Векторное произведение двух векторов.
     */
    cross(other) {
        return this.x * other.y - this.y * other.x;
    }

    /**
     * Статический метод для вычисления векторного произведения двух векторов.
     * @param {Vector2d} v1 - Первый вектор.
     * @param {Vector2d} v2 - Второй вектор.
     * @returns {number} - Векторное произведение двух векторов.
     */
    static cross(v1, v2) {
        return v1.x * v2.y - v1.y * v2.x;
    }

    /**
     * Метод для вычисления смешанного произведения трех векторов.
     * @param {Vector2d} other1 - Первый вектор.
     * @param {Vector2d} other2 - Второй вектор.
     * @returns {number} - Смешанное произведение трех векторов.
     */
    mixedProduct(other1, other2) {
        return Vector2d.cross(other1, other2);
    }

    /**
     * Статический метод для вычисления смешанного произведения трех векторов.
     * @param {Vector2d} v1 - Первый вектор.
     * @param {Vector2d} v2 - Второй вектор.
     * @param {Vector2d} v3 - Третий вектор.
     * @returns {number} - Смешанное произведение трех векторов.
     */
    static mixedProduct(v1, v2, v3) {
        return Vector2d.cross(v2, v3);
    }
}

// Пример использования
const point1 = new Point2d(10, 20);
const point2 = new Point2d(30, 40);

const vector1 = new Vector2d(5, 10);
const vector2 = Vector2d.fromPoints(point1, point2);

console.log(point1.toString()); // (10, 20)
console.log(point1.repr()); // Point2d(10, 20)

console.log(vector1.toString()); // (5, 10)
console.log(vector1.repr()); // Vector2d(5, 10)
console.log(vector1.abs()); // Модуль вектора
console.log(vector1.add(vector2).toString()); // Сложение векторов
console.log(Vector2d.dot(vector1, vector2)); // Скалярное произведение
console.log(vector1.cross(vector2)); // Векторное произведение
console.log(Vector2d.mixedProduct(vector1, vector2)); // Смешанное произведение

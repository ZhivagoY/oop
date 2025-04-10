// 1. Интерфейс фильтра
class LogFilterProtocol {
    match(text) {
      throw new Error("Method not implemented");
    }
  }
  
  // 2. Реализации фильтров
  class SimpleLogFilter extends LogFilterProtocol {
    constructor(pattern) {
      super();
      this.pattern = pattern;
    }
  
    match(text) {
      return text.includes(this.pattern);
    }
  }
  
  class ReLogFilter extends LogFilterProtocol {
    constructor(regex) {
      super();
      this.regex = regex;
    }
  
    match(text) {
      return this.regex.test(text);
    }
  }
  
  // 3. Интерфейс обработчика
  class LogHandlerProtocol {
    handle(text) {
      throw new Error("Method not implemented");
    }
  }
  
  // 4. Реализации обработчиков
  class ConsoleHandler extends LogHandlerProtocol {
    handle(text) {
      console.log(text);
    }
  }
  
  class FileHandler extends LogHandlerProtocol {
    constructor(filename) {
      super();
      const fs = require("fs");
      this.fs = fs;
      this.filename = filename;
    }
  
    handle(text) {
      this.fs.appendFileSync(this.filename, `${text}\n`);
    }
  }
  
  class SocketHandler extends LogHandlerProtocol {
    constructor(host, port) {
      super();
      const net = require("net");
      this.client = new net.Socket();
      this.client.connect(port, host);
    }
  
    handle(text) {
      this.client.write(text);
    }
  }
  
  class SyslogHandler extends LogHandlerProtocol {
    constructor() {
      super();
      // Реализация для системных логов
    }
  
    handle(text) {
      // Запись в системные логи
    }
  }
  
  // 5. Основной класс Logger
  class Logger {
    constructor(filters = [], handlers = []) {
      this.filters = filters;
      this.handlers = handlers;
    }
  
    log(text) {
      const shouldLog = this.filters.every(filter => filter.match(text));
      
      if (shouldLog) {
        this.handlers.forEach(handler => handler.handle(text));
      }
    }
  }
  
  // 6. Демонстрация работы
  // Создаем фильтры
  const filters = [
    new SimpleLogFilter("ERROR"),
    new ReLogFilter(/critical/i)
  ];
  
  // Создаем обработчики
  const handlers = [
    new ConsoleHandler(),
    new FileHandler("app.log"),
    new SocketHandler("localhost", 514)
  ];
  
  // Инициализируем логгер
  const logger = new Logger(filters, handlers);
  
  // Примеры логирования
  logger.log("INFO: Application started");
  logger.log("ERROR: Critical system failure");
  logger.log("CRITICAL: Server down");

  // Конфигурация для разработки
  const devLogger = new Logger(
    [new SimpleLogFilter("DEBUG")],
    [new ConsoleHandler()]
  );
  
  // Конфигурация для продакшена
  const prodLogger = new Logger(
    [new ReLogFilter(/ERROR|WARNING/)],
    [
      new FileHandler("production.log"),
      new SyslogHandler()
    ]
  );
  
  // Использование
  devLogger.log("DEBUG: User logged in");
  prodLogger.log("ERROR: Database connection failed");
    
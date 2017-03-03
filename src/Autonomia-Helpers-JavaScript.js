var Autonomia;
(function (Autonomia) {
    var Helpers;
    (function (Helpers) {
        var Events;
        (function (Events) {
            var Event = (function () {
                function Event() {
                    this._delegates = [];
                }
                Event.prototype.OnHappen = function (delegate) {
                    this._delegates.push(delegate);
                };
                Event.prototype.Notify = function (data) {
                    this._delegates.slice(0).forEach(function (d) { return d(data); });
                };
                Event.prototype.RemoveHandler = function (delegate) {
                    this._delegates = this._delegates.filter(function (d) { return d !== delegate; });
                };
                return Event;
            }());
            Events.Event = Event;
        })(Events = Helpers.Events || (Helpers.Events = {}));
    })(Helpers = Autonomia.Helpers || (Autonomia.Helpers = {}));
})(Autonomia || (Autonomia = {}));
var Autonomia;
(function (Autonomia) {
    var Helpers;
    (function (Helpers) {
        var GetPost;
        (function (GetPost) {
            function DoGetCall(url, headers, onSuccess, onError) {
                fetch(url, {
                    method: "get",
                    mode: "cors",
                    headers: headers
                })
                    .then(function (response) {
                    if (response.status !== 200) {
                        if (onError) {
                            onError(response.statusText + " [HTTP ErrorCode: ]" + response.status);
                        }
                    }
                    else if (onSuccess) {
                        response.text().then(function (data) {
                            onSuccess(data);
                        });
                    }
                })["catch"](function (error) {
                    if (onError) {
                        onError(error);
                    }
                });
            }
            GetPost.DoGetCall = DoGetCall;
            function DoPostCall(url, headers, data, onSuccess, onError) {
                fetch(url, {
                    method: "post",
                    headers: headers,
                    body: data
                })
                    .then(function (response) {
                    if (response.status !== 200) {
                        if (onError) {
                            onError(response.statusText + " [HTTP ErrorCode: ]" + response.status);
                        }
                    }
                    else if (onSuccess) {
                        response.text().then(function (data) {
                            onSuccess(data);
                        });
                    }
                })["catch"](function (error) {
                    if (onError) {
                        onError(error);
                    }
                });
            }
            GetPost.DoPostCall = DoPostCall;
        })(GetPost = Helpers.GetPost || (Helpers.GetPost = {}));
    })(Helpers = Autonomia.Helpers || (Autonomia.Helpers = {}));
})(Autonomia || (Autonomia = {}));
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Autonomia;
(function (Autonomia) {
    var Helpers;
    (function (Helpers) {
        var Logging;
        (function (Logging) {
            var LogType;
            (function (LogType) {
                LogType[LogType["Error"] = 0] = "Error";
                LogType[LogType["Warning"] = 1] = "Warning";
                LogType[LogType["Info"] = 2] = "Info";
                LogType[LogType["Debug"] = 3] = "Debug";
            })(LogType = Logging.LogType || (Logging.LogType = {}));
            var LogTypeAsString = [
                "Error  ",
                "Warning",
                "Info   ",
                "Debug  "
            ];
            var LogEntity = (function () {
                function LogEntity(type, message, executionInitialEpoch) {
                    if (executionInitialEpoch === void 0) { executionInitialEpoch = null; }
                    this.Type = type;
                    this.Message = message;
                    this.ExecutionInitialEpoch = executionInitialEpoch;
                }
                return LogEntity;
            }());
            Logging.LogEntity = LogEntity;
            var SimpleLogFormatter = (function () {
                function SimpleLogFormatter() {
                }
                SimpleLogFormatter.prototype.Format = function (logEntity) {
                    var time = new Date();
                    var executionTime = "";
                    if (logEntity.ExecutionInitialEpoch !== null) {
                        executionTime = "[Time: " + (time.getTime() - logEntity.ExecutionInitialEpoch) + "]";
                    }
                    var formattedLog = "[" + time.toLocaleString() + "]"
                        + "[" + LogTypeAsString[logEntity.Type] + "]"
                        + logEntity.Message
                        + executionTime;
                    return formattedLog;
                };
                return SimpleLogFormatter;
            }());
            Logging.SimpleLogFormatter = SimpleLogFormatter;
            var NoLogger = (function () {
                function NoLogger() {
                }
                NoLogger.prototype.Log = function (logEntity) { };
                return NoLogger;
            }());
            Logging.NoLogger = NoLogger;
            var AbstractLogger = (function () {
                function AbstractLogger(logFormatter) {
                    this._logFormatter = logFormatter;
                }
                AbstractLogger.prototype.Log = function (logEntity) {
                    this.DoTheLogging(this._logFormatter.Format(logEntity), logEntity);
                };
                return AbstractLogger;
            }());
            Logging.AbstractLogger = AbstractLogger;
            var ConsoleLogger = (function (_super) {
                __extends(ConsoleLogger, _super);
                function ConsoleLogger() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                ConsoleLogger.prototype.DoTheLogging = function (log, logEntity) {
                    if (logEntity.Type == LogType.Error) {
                        console.error(log);
                    }
                    else if (logEntity.Type == LogType.Warning) {
                        console.warn(log);
                    }
                    else if (logEntity.Type == LogType.Info) {
                        console.info(log);
                    }
                    else if (logEntity.Type == LogType.Debug) {
                        console.debug(log);
                    }
                    else {
                        console.log(log);
                    }
                };
                return ConsoleLogger;
            }(AbstractLogger));
            Logging.ConsoleLogger = ConsoleLogger;
            var _defaultLogger = new ConsoleLogger(new SimpleLogFormatter());
            function Console() {
                return _defaultLogger;
            }
            Logging.Console = Console;
        })(Logging = Helpers.Logging || (Helpers.Logging = {}));
    })(Helpers = Autonomia.Helpers || (Autonomia.Helpers = {}));
})(Autonomia || (Autonomia = {}));
var Autonomia;
(function (Autonomia) {
    var Helpers;
    (function (Helpers) {
        var Persisters;
        (function (Persisters) {
            var LocalStoragePersister = (function () {
                function LocalStoragePersister(key) {
                    this._key = "";
                    this._key = key;
                }
                LocalStoragePersister.prototype.Save = function (data, done) {
                    try {
                        var dataAsString = JSON.stringify(data);
                        localStorage.setItem(this._key, dataAsString);
                        done();
                    }
                    catch (ex) {
                        done.fail(ex);
                    }
                };
                LocalStoragePersister.prototype.Read = function (dataContainer, done) {
                    var dataAsString = localStorage.getItem(this._key);
                    if (Helpers.IsNullOrEmpty(dataAsString)) {
                        dataContainer.data = null;
                        done();
                    }
                    else {
                        try {
                            dataContainer.data = JSON.parse(dataAsString);
                        }
                        catch (ex) {
                            dataContainer.data = null;
                        }
                        done();
                    }
                };
                return LocalStoragePersister;
            }());
            Persisters.LocalStoragePersister = LocalStoragePersister;
        })(Persisters = Helpers.Persisters || (Helpers.Persisters = {}));
    })(Helpers = Autonomia.Helpers || (Autonomia.Helpers = {}));
})(Autonomia || (Autonomia = {}));
var Autonomia;
(function (Autonomia) {
    var Helpers;
    (function (Helpers) {
        function IsNullOrEmpty(object) {
            if ((object === null)
                || (object === undefined)
                || (object === "undefined"))
                return true;
            if (object.constructor === Array || object.constructor === String)
                return (object.length === 0);
            if (object.constructor === Object) {
                var propertiesCount = 0;
                for (var propertyName in object) {
                    propertiesCount++;
                    break;
                }
                return (propertiesCount === 0);
            }
            return false;
        }
        Helpers.IsNullOrEmpty = IsNullOrEmpty;
        function NewGuid() {
            return uuid.v4();
        }
        Helpers.NewGuid = NewGuid;
        function CloneObject(object) {
            return JSON.parse(JSON.stringify(object));
        }
        Helpers.CloneObject = CloneObject;
    })(Helpers = Autonomia.Helpers || (Autonomia.Helpers = {}));
})(Autonomia || (Autonomia = {}));
var Autonomia;
(function (Autonomia) {
    var Helpers;
    (function (Helpers) {
        var Strings;
        (function (Strings) {
            function ReplaceAll(originalString, stringToFind, replacingString) {
                if (Helpers.IsNullOrEmpty(originalString)) {
                    return "";
                }
                stringToFind = stringToFind.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                return originalString.replace(new RegExp(stringToFind, 'g'), replacingString);
            }
            Strings.ReplaceAll = ReplaceAll;
            function ReplaceAllInArray(originalString, stringsToFind, replacingString) {
                var result = originalString;
                for (var i = 0; i < stringsToFind.length; i++) {
                    result = ReplaceAll(result, stringsToFind[i], replacingString);
                }
                return result;
            }
            Strings.ReplaceAllInArray = ReplaceAllInArray;
            function RemoveIfExistsAtEnd(originalString, stringToFind) {
                if (Helpers.IsNullOrEmpty(originalString)) {
                    return "";
                }
                var newSubstringLength = (originalString.length - stringToFind.length);
                if (originalString.lastIndexOf(stringToFind) === newSubstringLength) {
                    return originalString.substring(0, newSubstringLength);
                }
                return originalString;
            }
            Strings.RemoveIfExistsAtEnd = RemoveIfExistsAtEnd;
            function StartsWith(originalString, stringToFind) {
                if (Helpers.IsNullOrEmpty(originalString)) {
                    return false;
                }
                if (originalString.indexOf(stringToFind) === 0) {
                    return true;
                }
                return false;
            }
            Strings.StartsWith = StartsWith;
            function EndsWith(originalString, stringToFind) {
                if (Helpers.IsNullOrEmpty(originalString)) {
                    return false;
                }
                var newSubstringLength = (originalString.length - stringToFind.length);
                if (originalString.lastIndexOf(stringToFind) === newSubstringLength) {
                    return true;
                }
                return false;
            }
            Strings.EndsWith = EndsWith;
            function Contains(originalString, stringToFind) {
                if (Helpers.IsNullOrEmpty(originalString)
                    || Helpers.IsNullOrEmpty(stringToFind)) {
                    return false;
                }
                return (originalString.indexOf(stringToFind) !== -1);
            }
            Strings.Contains = Contains;
        })(Strings = Helpers.Strings || (Helpers.Strings = {}));
    })(Helpers = Autonomia.Helpers || (Autonomia.Helpers = {}));
})(Autonomia || (Autonomia = {}));
var Autonomia;
(function (Autonomia) {
    var Helpers;
    (function (Helpers) {
        var Tasks;
        (function (Tasks) {
            ASQ.extend("Parallel", function __build__(api, internals) {
                return api.gate;
            });
            ASQ.extend("This", function __build__(api, internals) {
                return api.then;
            });
            ASQ.extend("Then", function __build__(api, internals) {
                return api.then;
            });
            ASQ.extend("OnError", function __build__(api, internals) {
                return api.or;
            });
            var TaskRunner = (function () {
                function TaskRunner() {
                    this._asq = ASQ();
                    return this._asq;
                }
                TaskRunner.prototype.Parallel = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return this;
                };
                TaskRunner.prototype.This = function (p) {
                    return this;
                };
                TaskRunner.prototype.Then = function (p) {
                    return this;
                };
                TaskRunner.prototype.OnError = function (p) {
                    return this;
                };
                return TaskRunner;
            }());
            Tasks.TaskRunner = TaskRunner;
            function Run() {
                return new TaskRunner();
            }
            Tasks.Run = Run;
        })(Tasks = Helpers.Tasks || (Helpers.Tasks = {}));
    })(Helpers = Autonomia.Helpers || (Autonomia.Helpers = {}));
})(Autonomia || (Autonomia = {}));
var Autonomia;
(function (Autonomia) {
    var Helpers;
    (function (Helpers) {
        var Threading;
        (function (Threading) {
            var PeriodicalThread = (function () {
                function PeriodicalThread(threadedCode, period) {
                    this._threadId = 0;
                    this._threadedCode = threadedCode;
                    this._period = period;
                }
                PeriodicalThread.prototype.Start = function () {
                    var thisRef = this;
                    if (Helpers.IsNullOrEmpty(thisRef._threadedCode) || thisRef.IsRunning()) {
                        return;
                    }
                    thisRef._threadId = setInterval(function () {
                        thisRef._threadedCode();
                    }, thisRef._period);
                };
                PeriodicalThread.prototype.Stop = function () {
                    var thisRef = this;
                    clearInterval(thisRef._threadId);
                    thisRef._threadId = 0;
                };
                PeriodicalThread.prototype.IsRunning = function () {
                    return (this._threadId !== 0);
                };
                return PeriodicalThread;
            }());
            Threading.PeriodicalThread = PeriodicalThread;
            var Semaphore = (function () {
                function Semaphore() {
                    this.WhenAllThreadsFinsihed = new Helpers.Events.Event();
                    var thisRef = this;
                    thisRef._count = 0;
                    thisRef._monitoringThread = new PeriodicalThread(function () {
                        if (thisRef._count <= 0) {
                            thisRef.WhenAllThreadsFinsihed.Notify();
                            thisRef._monitoringThread.Stop();
                        }
                    }, 2000);
                }
                Semaphore.prototype.ThreadStarted = function () {
                    var thisRef = this;
                    thisRef._count++;
                    thisRef._monitoringThread.Start();
                };
                Semaphore.prototype.ThreadFinished = function () {
                    var thisRef = this;
                    thisRef._count--;
                };
                return Semaphore;
            }());
            Threading.Semaphore = Semaphore;
        })(Threading = Helpers.Threading || (Helpers.Threading = {}));
    })(Helpers = Autonomia.Helpers || (Autonomia.Helpers = {}));
})(Autonomia || (Autonomia = {}));
var Autonomia;
(function (Autonomia) {
    var Helpers;
    (function (Helpers) {
        var Uris;
        (function (Uris) {
            var Uri = (function () {
                function Uri() {
                }
                Uri.prototype.ToHref = function () {
                    return;
                };
                return Uri;
            }());
            Uris.Uri = Uri;
            function Parse(url) {
                var parser = document.createElement("a");
                parser.href = url;
                var uri = new Uri();
                uri.Protocol = parser.protocol;
                uri.Host = parser.host;
                uri.Hostname = parser.hostname;
                uri.Port = parser.port;
                uri.Pathname = parser.pathname;
                uri.Hash = parser.hash;
                uri.Search = parser.search;
                return uri;
            }
            Uris.Parse = Parse;
        })(Uris = Helpers.Uris || (Helpers.Uris = {}));
    })(Helpers = Autonomia.Helpers || (Autonomia.Helpers = {}));
})(Autonomia || (Autonomia = {}));
//# sourceMappingURL=Autonomia-Helpers-JavaScript.js.map
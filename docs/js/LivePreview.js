/**
 * @version 1.0.0.0
 * @copyright Copyright ©  2020
 * @compiler Bridge.NET 17.10.1
 */
Bridge.assembly("LivePreview", function ($asm, globals) {
    "use strict";

    Bridge.define("ExpressionStack.RusticExpression.DebugExtension", {
        statics: {
            methods: {
                PrintDebug: function (expression) {
                    var $t, $t1, $t2, $t3, $t4;
                    var stacks = expression.stacks;
                    for (var r = (stacks.Count - 1) | 0; r >= 0; r = (r - 1) | 0) {
                        System.Console.WriteLine((System.String.alignString(System.String.format("R{0} [P={1}]:", Bridge.box(r, System.Int32), Bridge.box(stacks.getItem(r).priority, System.Int32)), -30) || "") + (stacks.getItem(r).ToExpressionString() || ""));
                        if (stacks.getItem(r).operations.Count === 0) {
                            System.Console.WriteLine(System.String.format("No operations found.", null));
                        } else {
                            var prevType = null;
                            for (var i = 0; i < stacks.getItem(r).operations.Count; i = (i + 1) | 0) {
                                var operation = stacks.getItem(r).operations.getItem(i);
                                System.Console.WriteLine((System.String.alignString(System.String.format("  {0} RX{1}", Bridge.Reflection.getTypeName(Bridge.getType(operation)), (operation.parameter == null ? "" : System.String.concat(", ", operation.parameter))), -30) || "") + (System.String.format("  # {0}({1}, {2}): {3}", Bridge.Reflection.getTypeName(Bridge.getType(operation)), ($t = (prevType != null ? Bridge.Reflection.getTypeName(prevType) : null), $t != null ? $t : "null"), ($t1 = (($t2 = operation.parameterType) != null ? Bridge.Reflection.getTypeName($t2) : null), $t1 != null ? $t1 : "null"), Bridge.Reflection.getTypeName(operation.PreviewResultType(prevType))) || ""));
                                prevType = operation.PreviewResultType(prevType);
                            }
                        }

                        if (stacks.getItem(r).executed) {
                            System.Console.WriteLine((System.String.alignString(System.String.format("  ResultValue {0}", [stacks.getItem(r).ResultValue]), -30) || "") + (System.String.format("  # {0}", [($t3 = (($t4 = stacks.getItem(r).ResultValue) != null ? Bridge.Reflection.getTypeName(Bridge.getType($t4)) : null), $t3 != null ? $t3 : "null")]) || ""));
                        }
                        System.Console.WriteLine();
                    }
                }
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.RusticValueEvaluator", {
        methods: {
            GetValue: function (T) {
                return Bridge.cast(Bridge.unbox(this.GetValue$1(), T), T);
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.RusticOperation", {
        statics: {
            fields: {
                FirstPriority: 0
            },
            ctors: {
                init: function () {
                    this.FirstPriority = 1;
                }
            }
        },
        fields: {
            parameter: null,
            priorityOffset: 0
        },
        props: {
            parameterValue: {
                get: function () {
                    return this.parameter.GetValue$1();
                }
            },
            parameterType: {
                get: function () {
                    var $t;
                    return ($t = this.parameter) != null ? $t.GetValueType() : null;
                }
            },
            IsLeftUnary: {
                get: function () {
                    return this.GetPriority() === ExpressionStack.RusticExpression.RusticOperation.Priority.PrefixUnary;
                }
            }
        },
        methods: {
            GetPriorityWithOffset: function () {
                return ((this.GetPriority() + this.priorityOffset) | 0);
            },
            HasIncreasedPriority: function () {
                return (this.parameter != null) && (Bridge.is(this.parameter, ExpressionStack.RusticExpression.Evaluators.StackReference));
            },
            toString: function () {
                return System.String.format("{0}{1}", Bridge.Reflection.getTypeName(Bridge.getType(this)), (this.parameter != null ? Bridge.Reflection.getTypeName(Bridge.getType(this.parameter)) : ""));
            },
            ToExpressionString: function () {
                return System.String.format(" {0}{1}", Bridge.Reflection.getTypeName(Bridge.getType(this)), (this.parameter != null ? System.String.concat(" ", this.parameterValue) : ""));
            },
            HasRightToLeftPrecedence: function () {
                return false;
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.Operations.Providers.CommonMath", {
        statics: {
            fields: {
                Negative: null,
                Positive: null,
                Add: null,
                Sub: null,
                Mul: null,
                Div: null,
                Mod: null
            },
            ctors: {
                init: function () {
                    this.Negative = function (_o1) {
                            _o1.add(System.Single, ExpressionStack.RusticExpression.Operations.Providers.CommonMath.NegativeSingle);
                            _o1.add(System.Double, ExpressionStack.RusticExpression.Operations.Providers.CommonMath.NegativeDouble);
                            _o1.add(System.Int32, ExpressionStack.RusticExpression.Operations.Providers.CommonMath.NegativeInt32);
                            return _o1;
                        }(new (System.Collections.Generic.Dictionary$2(System.Type,Function)).ctor());
                    this.Positive = function (_o2) {
                            _o2.add(System.Single, ExpressionStack.RusticExpression.Operations.Providers.CommonMath.PositiveSingle);
                            _o2.add(System.Double, ExpressionStack.RusticExpression.Operations.Providers.CommonMath.PositiveDouble);
                            _o2.add(System.Int32, ExpressionStack.RusticExpression.Operations.Providers.CommonMath.PositiveInt32);
                            return _o2;
                        }(new (System.Collections.Generic.Dictionary$2(System.Type,Function)).ctor());
                    this.Add = function (_o3) {
                            _o3.add(System.Single, ExpressionStack.RusticExpression.Operations.Providers.CommonMath.AddSingle);
                            _o3.add(System.Double, ExpressionStack.RusticExpression.Operations.Providers.CommonMath.AddDouble);
                            _o3.add(System.Int32, ExpressionStack.RusticExpression.Operations.Providers.CommonMath.AddInt32);
                            return _o3;
                        }(new (System.Collections.Generic.Dictionary$2(System.Type,Function)).ctor());
                    this.Sub = function (_o4) {
                            _o4.add(System.Single, ExpressionStack.RusticExpression.Operations.Providers.CommonMath.SubSingle);
                            _o4.add(System.Double, ExpressionStack.RusticExpression.Operations.Providers.CommonMath.SubDouble);
                            _o4.add(System.Int32, ExpressionStack.RusticExpression.Operations.Providers.CommonMath.SubInt32);
                            return _o4;
                        }(new (System.Collections.Generic.Dictionary$2(System.Type,Function)).ctor());
                    this.Mul = function (_o5) {
                            _o5.add(System.Single, ExpressionStack.RusticExpression.Operations.Providers.CommonMath.MulSingle);
                            _o5.add(System.Double, ExpressionStack.RusticExpression.Operations.Providers.CommonMath.MulDouble);
                            _o5.add(System.Int32, ExpressionStack.RusticExpression.Operations.Providers.CommonMath.MulInt32);
                            return _o5;
                        }(new (System.Collections.Generic.Dictionary$2(System.Type,Function)).ctor());
                    this.Div = function (_o6) {
                            _o6.add(System.Single, ExpressionStack.RusticExpression.Operations.Providers.CommonMath.DivSingle);
                            _o6.add(System.Double, ExpressionStack.RusticExpression.Operations.Providers.CommonMath.DivDouble);
                            _o6.add(System.Int32, ExpressionStack.RusticExpression.Operations.Providers.CommonMath.DivInt32);
                            return _o6;
                        }(new (System.Collections.Generic.Dictionary$2(System.Type,Function)).ctor());
                    this.Mod = function (_o7) {
                            _o7.add(System.Single, ExpressionStack.RusticExpression.Operations.Providers.CommonMath.ModSingle);
                            _o7.add(System.Double, ExpressionStack.RusticExpression.Operations.Providers.CommonMath.ModDouble);
                            _o7.add(System.Int32, ExpressionStack.RusticExpression.Operations.Providers.CommonMath.ModInt32);
                            return _o7;
                        }(new (System.Collections.Generic.Dictionary$2(System.Type,Function)).ctor());
                }
            },
            methods: {
                NegativeSingle: function (a, b) {
                    return Bridge.box(-System.Convert.toSingle(a), System.Single, System.Single.format, System.Single.getHashCode);
                },
                NegativeDouble: function (a, b) {
                    return Bridge.box(-System.Convert.toDouble(a), System.Double, System.Double.format, System.Double.getHashCode);
                },
                NegativeInt32: function (a, b) {
                    return Bridge.box(((-System.Convert.toInt32(a)) | 0), System.Int32);
                },
                PositiveSingle: function (a, b) {
                    return Bridge.box(System.Convert.toSingle(a), System.Single, System.Single.format, System.Single.getHashCode);
                },
                PositiveDouble: function (a, b) {
                    return Bridge.box(System.Convert.toDouble(a), System.Double, System.Double.format, System.Double.getHashCode);
                },
                PositiveInt32: function (a, b) {
                    return Bridge.box(System.Convert.toInt32(a), System.Int32);
                },
                AddSingle: function (a, b) {
                    return Bridge.box(System.Convert.toSingle(a) + System.Convert.toSingle(b), System.Single, System.Single.format, System.Single.getHashCode);
                },
                AddDouble: function (a, b) {
                    return Bridge.box(System.Convert.toDouble(a) + System.Convert.toDouble(b), System.Double, System.Double.format, System.Double.getHashCode);
                },
                AddInt32: function (a, b) {
                    return Bridge.box(((System.Convert.toInt32(a) + System.Convert.toInt32(b)) | 0), System.Int32);
                },
                SubSingle: function (a, b) {
                    return Bridge.box(System.Convert.toSingle(a) - System.Convert.toSingle(b), System.Single, System.Single.format, System.Single.getHashCode);
                },
                SubDouble: function (a, b) {
                    return Bridge.box(System.Convert.toDouble(a) - System.Convert.toDouble(b), System.Double, System.Double.format, System.Double.getHashCode);
                },
                SubInt32: function (a, b) {
                    return Bridge.box(((System.Convert.toInt32(a) - System.Convert.toInt32(b)) | 0), System.Int32);
                },
                MulSingle: function (a, b) {
                    return Bridge.box(System.Convert.toSingle(a) * System.Convert.toSingle(b), System.Single, System.Single.format, System.Single.getHashCode);
                },
                MulDouble: function (a, b) {
                    return Bridge.box(System.Convert.toDouble(a) * System.Convert.toDouble(b), System.Double, System.Double.format, System.Double.getHashCode);
                },
                MulInt32: function (a, b) {
                    return Bridge.box(Bridge.Int.mul(System.Convert.toInt32(a), System.Convert.toInt32(b)), System.Int32);
                },
                DivSingle: function (a, b) {
                    return Bridge.box(System.Convert.toSingle(a) / System.Convert.toSingle(b), System.Single, System.Single.format, System.Single.getHashCode);
                },
                DivDouble: function (a, b) {
                    return Bridge.box(System.Convert.toDouble(a) / System.Convert.toDouble(b), System.Double, System.Double.format, System.Double.getHashCode);
                },
                DivInt32: function (a, b) {
                    return Bridge.box(((Bridge.Int.div(System.Convert.toInt32(a), System.Convert.toInt32(b))) | 0), System.Int32);
                },
                IntDiv: function (a, b) {
                    return Bridge.box(((Bridge.Int.div(System.Convert.toInt32(a), System.Convert.toInt32(b))) | 0), System.Int32);
                },
                ModSingle: function (a, b) {
                    return Bridge.box(System.Convert.toSingle(a) % System.Convert.toSingle(b), System.Single, System.Single.format, System.Single.getHashCode);
                },
                ModDouble: function (a, b) {
                    return Bridge.box(System.Convert.toDouble(a) % System.Convert.toDouble(b), System.Double, System.Double.format, System.Double.getHashCode);
                },
                ModInt32: function (a, b) {
                    return Bridge.box(System.Convert.toInt32(a) % System.Convert.toInt32(b), System.Int32);
                }
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.RusticContext", {
        fields: {
            expression: null,
            variables: null
        },
        props: {
            stack: {
                get: function () {
                    return this.expression.stacks;
                }
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.RusticExpr", {
        statics: {
            fields: {
                PreferSimplifiedExpression: false
            },
            ctors: {
                init: function () {
                    this.PreferSimplifiedExpression = false;
                }
            },
            methods: {
                GetVariableID: function (name) {
                    return Bridge.getHashCode(name);
                }
            }
        },
        fields: {
            stacks: null,
            context: null
        },
        ctors: {
            init: function () {
                this.stacks = new (System.Collections.Generic.List$1(ExpressionStack.RusticExpression.RusticStack)).ctor();
            },
            ctor: function () {
                this.$initialize();
                this.ResetExpression();
            },
            $ctor1: function (expression) {
                ExpressionStack.RusticExpression.RusticExpr.ctor.call(this);
                this.SetExpression(expression);
            }
        },
        methods: {
            ResetExpression: function () {
                this.stacks.clear();
                this.context = new ExpressionStack.RusticExpression.RusticContext();
            },
            SetExpression: function (expression) {
                if (ExpressionStack.RusticExpression.RusticExpr.PreferSimplifiedExpression) {
                    new ExpressionStack.RusticExpression.RusticExprBuilder.$ctor3(this, this.context, expression).FinalizeAndSimplify();
                } else {
                    new ExpressionStack.RusticExpression.RusticExprBuilder.$ctor3(this, this.context, expression).FinalizeExpression();
                }
            },
            Execute: function () {
                for (var r = (this.stacks.Count - 1) | 0; r >= 0; r = (r - 1) | 0) {
                    this.stacks.getItem(r).Execute();
                }

                return this.stacks.getItem(0).ResultValue;
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.RusticExprBuilder", {
        statics: {
            methods: {
                SimplifyExpression: function (expression) {
                    var builder = new ExpressionStack.RusticExpression.RusticExprBuilder.ctor();
                    builder.expression = expression;
                    builder.SimplifyExpression();
                }
            }
        },
        fields: {
            expression: null,
            context: null,
            nextOperation: null,
            currentStack: null,
            priorityOffset: 0
        },
        props: {
            stacks: {
                get: function () {
                    return this.expression != null ? this.expression.stacks : null;
                }
            }
        },
        ctors: {
            ctor: function () {
                ExpressionStack.RusticExpression.RusticExprBuilder.$ctor1.call(this, null, null);
            },
            $ctor1: function (expression, context) {
                var $t, $t1;
                this.$initialize();
                if (System.Nullable.gt((expression != null ? expression.stacks.Count : null), 0)) {
                    throw new System.Exception("RusticExpr instance was already built and should not be built again. Did you intend to ResetExpression?");
                }

                this.expression = expression;
                this.context = context;
                this.nextOperation = new ExpressionStack.RusticExpression.Operations.Set();
                this.priorityOffset = 0;
                ($t = this.stacks) != null ? $t.add(new ExpressionStack.RusticExpression.RusticStack(0, null, 1)) : null;
                this.currentStack = ($t1 = this.stacks) != null ? $t1.getItem(0) : null;
            },
            $ctor3: function (expression, context, expressionLine) {
                ExpressionStack.RusticExpression.RusticExprBuilder.$ctor1.call(this, expression, context);
                this.ParseAndPutTokens(expressionLine);
            },
            $ctor2: function (expression, context, tokenList) {
                ExpressionStack.RusticExpression.RusticExprBuilder.$ctor1.call(this, expression, context);
                this.PutTokens(tokenList);
            }
        },
        methods: {
            ParseAndPutTokens: function (expression) {
                var $t;
                var parser = new ExpressionStack.RusticExpression.RusticParser(this.context);
                this.PutTokens(($t = ExpressionStack.RusticExpression.RusticToken, System.Linq.Enumerable.from(parser.GetTokenList(expression), $t).ToArray($t)));
            },
            PutTokens: function (tokens) {
                var $t;
                if (tokens === void 0) { tokens = []; }
                $t = Bridge.getEnumerator(tokens);
                try {
                    while ($t.moveNext()) {
                        var token = $t.Current;
                        this.PutToken(token);
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
            },
            PutToken: function (token) {
                switch (token.mode) {
                    case ExpressionStack.RusticExpression.RusticTokenMode.Literal: 
                        this.PutValueToken(token.value);
                        break;
                    case ExpressionStack.RusticExpression.RusticTokenMode.VariableName: 
                        this.PutVariableToken(Bridge.toString(token.value));
                        break;
                    case ExpressionStack.RusticExpression.RusticTokenMode.Operation: 
                        this.PutOperationToken(Bridge.cast(token.value, ExpressionStack.RusticExpression.RusticOperation));
                        break;
                    case ExpressionStack.RusticExpression.RusticTokenMode.PriorityOffset: 
                        this.ChangePriority(System.Nullable.getValue(Bridge.cast(Bridge.unbox(token.value, System.Int32), System.Int32)));
                        break;
                    default: 
                        throw new System.NotImplementedException.ctor();
                }
            },
            PutCustomValueToken: function (value) {
                if (this.nextOperation == null) {
                    throw new System.Exception(System.String.format("Expecting operator, but received operand ({0})", [Bridge.Reflection.getTypeName(Bridge.getType(value))]));
                }
                this.nextOperation.parameter = value;
                this.currentStack.operations.add(this.nextOperation);
                this.nextOperation = null;
            },
            PutValueToken: function (value) {
                this.PutCustomValueToken(new ExpressionStack.RusticExpression.Evaluators.Literal(value));
            },
            PutVariableToken: function (variableName) {
                this.PutCustomValueToken(new ExpressionStack.RusticExpression.Evaluators.Variable(this.context, variableName));
            },
            ChangePriority: function (addition) {
                this.priorityOffset = (this.priorityOffset + addition) | 0;
                if (addition > 0) {
                    var newStack = new ExpressionStack.RusticExpression.RusticStack(this.stacks.Count, this.currentStack, ((this.priorityOffset + ExpressionStack.RusticExpression.RusticOperation.FirstPriority) | 0));
                    this.nextOperation.parameter = new ExpressionStack.RusticExpression.Evaluators.StackReference(newStack);
                    this.currentStack.operations.add(this.nextOperation);
                    var index = this.stacks.indexOf(this.currentStack);
                    this.stacks.insert(((index + 1) | 0), newStack);
                    this.currentStack = newStack;
                    this.nextOperation = new ExpressionStack.RusticExpression.Operations.Set();
                }
            },
            PutOperationToken: function (operation) {
                if (this.nextOperation != null) {
                    if (operation.IsLeftUnary) {
                        this.PutLeftOperationToken(operation);
                        return;
                    } else {
                        throw new System.Exception("Unexpected operator found");
                    }
                }

                operation.priorityOffset = this.priorityOffset;
                if (operation.GetPriorityWithOffset() <= ExpressionStack.RusticExpression.RusticOperation.Priority.Ignored) {
                    this.PutOperationOfEqualOrIgnoredPriority(operation);
                } else {
                    if ((operation.HasRightToLeftPrecedence() && this.currentStack.priority <= operation.GetPriorityWithOffset()) || this.currentStack.priority < operation.GetPriorityWithOffset()) {
                        this.PutOperationOfHigherPriority(operation);
                    } else {
                        if (this.currentStack.priority > operation.GetPriorityWithOffset()) {
                            this.PutOperationOfLowerPriority(operation);
                        } else {
                            this.PutOperationOfEqualOrIgnoredPriority(operation);
                        }
                    }
                }
            },
            PutLeftOperationToken: function (operation) {
                if (this.currentStack.priority === operation.GetPriorityWithOffset()) {
                    this.currentStack.operations.add(operation);
                } else {
                    var newStack = new ExpressionStack.RusticExpression.RusticStack(this.stacks.Count, this.currentStack, operation.GetPriorityWithOffset());
                    newStack.operations.add(operation);
                    var index = this.stacks.indexOf(this.currentStack);
                    this.stacks.insert(((index + 1) | 0), newStack);

                    this.PutCustomValueToken(new ExpressionStack.RusticExpression.Evaluators.StackReference(newStack));
                    this.currentStack = newStack;
                    this.nextOperation = new ExpressionStack.RusticExpression.Operations.Set();
                }
            },
            PutOperationOfHigherPriority: function (operation) {
                this.nextOperation = operation;
                var lastOperationFromStack = this.currentStack.operations.getItem(((this.currentStack.operations.Count - 1) | 0));
                var lastOperationValue = lastOperationFromStack.parameter;
                var newStack = new ExpressionStack.RusticExpression.RusticStack(this.stacks.Count, this.currentStack, operation.GetPriorityWithOffset());
                lastOperationFromStack.parameter = new ExpressionStack.RusticExpression.Evaluators.StackReference(newStack);
                var newSetOperation = new ExpressionStack.RusticExpression.Operations.Set();
                newSetOperation.parameter = lastOperationValue;
                newStack.operations.add(newSetOperation);
                var index = this.stacks.indexOf(this.currentStack);
                this.stacks.insert(((index + 1) | 0), newStack);
                this.currentStack = newStack;
            },
            PutOperationOfLowerPriority: function (operation) {
                this.nextOperation = operation;
                while (this.currentStack.priority > operation.GetPriorityWithOffset()) {
                    this.currentStack = this.currentStack.parent;
                }

                if (this.currentStack.priority < operation.GetPriorityWithOffset()) {
                    this.PutOperationOfHigherPriority(operation);
                }
            },
            PutOperationOfEqualOrIgnoredPriority: function (operation) {
                this.nextOperation = operation;
            },
            FinalizeExpression: function () {
                var $t;
                var index = 0;

                $t = Bridge.getEnumerator(this.stacks);
                try {
                    while ($t.moveNext()) {
                        var stack = $t.Current;
                        stack.displayId = Bridge.identity(index, ((index = (index + 1) | 0)));
                        stack.Prepare();
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
            },
            SimplifyExpression: function () {
                var $t, $t1, $t2;
                var discard = null;
                $t = Bridge.getEnumerator(this.stacks);
                try {
                    while ($t.moveNext()) {
                        var stack = $t.Current;
                        $t1 = Bridge.getEnumerator(stack.operations);
                        try {
                            while ($t1.moveNext()) {
                                var operation = $t1.Current;
                                var reference = null;
                                var hasRefParam = operation.parameter != null && ((reference = Bridge.as(operation.parameter, ExpressionStack.RusticExpression.Evaluators.StackReference))) != null;
                                var canBeSimplified = hasRefParam && reference.stack.CanBeSimplified;
                                if (canBeSimplified) {
                                    operation.parameter = reference.stack.operations.getItem(0).parameter;
                                    discard = discard || new (System.Collections.Generic.HashSet$1(ExpressionStack.RusticExpression.RusticStack)).ctor();
                                    discard.add(reference.stack);
                                }
                            }
                        } finally {
                            if (Bridge.is($t1, System.IDisposable)) {
                                $t1.System$IDisposable$Dispose();
                            }
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }

                if (discard != null) {
                    $t2 = Bridge.getEnumerator(discard);
                    try {
                        while ($t2.moveNext()) {
                            var item = $t2.Current;
                            this.stacks.remove(item);
                        }
                    } finally {
                        if (Bridge.is($t2, System.IDisposable)) {
                            $t2.System$IDisposable$Dispose();
                        }
                    }
                }

                if (this.stacks.Count > 0 && this.stacks.getItem(0).operations.Count === 1) {
                    var set;
                    if (((set = Bridge.as(this.stacks.getItem(0).operations.getItem(0), ExpressionStack.RusticExpression.Operations.Set))) != null) {
                        this.stacks.getItem(0).operations.clear();
                        var stack1 = Bridge.cast(set.parameter, ExpressionStack.RusticExpression.Evaluators.StackReference).stack;
                        this.stacks.getItem(0).operations.AddRange(stack1.operations);
                        this.stacks.getItem(0).priority = stack1.priority;
                        this.stacks.remove(stack1);
                    }
                }
                this.FinalizeExpression();
            },
            FinalizeAndSimplify: function () {
                this.FinalizeExpression();
                this.SimplifyExpression();
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.RusticOperation.Priority", {
        $kind: "nested enum",
        statics: {
            fields: {
                Ignored: -999999,
                AddSub: 1,
                MulDiv: 2,
                Pow: 3,
                PrefixUnary: 4,
                Parenthesis: 20
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.RusticParser", {
        statics: {
            methods: {
                StringToInt32: function (value, trimChars) {
                    if (trimChars === void 0) { trimChars = []; }
                    var intValue = System.Convert.toInt32(System.String.trimEnd(value, trimChars));
                    if (System.String.endsWith(value, "%")) {
                        return Bridge.box(intValue / 100.0, System.Single, System.Single.format, System.Single.getHashCode);
                    }
                    return Bridge.box(System.Convert.toInt32(Bridge.box(intValue, System.Int32)), System.Int32);
                },
                StringToFloat: function (value, trimChars) {
                    if (trimChars === void 0) { trimChars = []; }
                    var floatValue = System.Convert.toSingle(((System.String.startsWith(value, ".") ? "0" : "") || "") + (System.String.trimEnd(value, trimChars) || ""));
                    if (System.String.endsWith(value, "%")) {
                        return Bridge.box(floatValue / 100.0, System.Single, System.Single.format, System.Single.getHashCode);
                    }
                    return Bridge.box(floatValue, System.Single, System.Single.format, System.Single.getHashCode);
                },
                StringToDouble: function (value, trimChars) {
                    if (trimChars === void 0) { trimChars = []; }
                    var doubleValue = System.Convert.toSingle(System.String.trimEnd(value, trimChars));
                    if (System.String.endsWith(value, "%")) {
                        return Bridge.box(doubleValue / 100.0, System.Double, System.Double.format, System.Double.getHashCode);
                    }
                    return Bridge.box(doubleValue, System.Double, System.Double.format, System.Double.getHashCode);
                },
                StickyMatch: function (regex, input, index) {
                    var match = regex.match(input, index.v);
                    if (match.getIndex() !== index.v) {
                        return System.Text.RegularExpressions.Match.getEmpty();
                    }

                    index.v = (match.getIndex() + match.getLength()) | 0;
                    return match;
                },
                FindSuccededGroupIndex: function (match) {
                    if (match.getSuccess() === false) {
                        return -1;
                    }

                    for (var i = 1; i < match.getGroups().getCount(); i = (i + 1) | 0) {
                        if (match.getGroups().get(i).getSuccess()) {
                            return i;
                        }
                    }

                    return 0;
                }
            }
        },
        fields: {
            OpenGroupPattern: null,
            CloseGroupPattern: null,
            MiddleOperators: null,
            LeftOperators: null,
            ValuePattern: null,
            IgnoredPattern: null,
            initialized: false,
            context: null,
            valueExpr: null,
            leftOpExpr: null,
            midOpExpr: null,
            ignoredExpr: null,
            openGroupExpr: null,
            closeGroupExpr: null,
            unexpectedTokenExpr: null,
            currentState: null
        },
        ctors: {
            init: function () {
                this.OpenGroupPattern = function (_o1) {
                        _o1.add(new ExpressionStack.RusticExpression.RusticParser.GenericCapture("[(]", ExpressionStack.RusticExpression.RusticTokenMode.PriorityOffset, function (p, s) {
                            return Bridge.box(100, System.Int32);
                        }));
                        return _o1;
                    }(new (System.Collections.Generic.List$1(ExpressionStack.RusticExpression.RusticParser.GenericCapture)).ctor());
                this.CloseGroupPattern = function (_o2) {
                        _o2.add(new ExpressionStack.RusticExpression.RusticParser.GenericCapture("[)]", ExpressionStack.RusticExpression.RusticTokenMode.PriorityOffset, function (p, s) {
                            return Bridge.box(-100, System.Int32);
                        }));
                        return _o2;
                    }(new (System.Collections.Generic.List$1(ExpressionStack.RusticExpression.RusticParser.GenericCapture)).ctor());
                this.MiddleOperators = function (_o3) {
                        _o3.add(new ExpressionStack.RusticExpression.RusticParser.OperationCapture("[*][*]", new ExpressionStack.RusticExpression.Operations.Pow()));
                        _o3.add(new ExpressionStack.RusticExpression.RusticParser.OperationCapture("[+]", new ExpressionStack.RusticExpression.Operations.Add()));
                        _o3.add(new ExpressionStack.RusticExpression.RusticParser.OperationCapture("[-]", new ExpressionStack.RusticExpression.Operations.Sub()));
                        _o3.add(new ExpressionStack.RusticExpression.RusticParser.OperationCapture("[*]", new ExpressionStack.RusticExpression.Operations.Mul()));
                        _o3.add(new ExpressionStack.RusticExpression.RusticParser.OperationCapture("[/]", new ExpressionStack.RusticExpression.Operations.Div()));
                        return _o3;
                    }(new (System.Collections.Generic.List$1(ExpressionStack.RusticExpression.RusticParser.OperationCapture)).ctor());
                this.LeftOperators = function (_o4) {
                        _o4.add(new ExpressionStack.RusticExpression.RusticParser.OperationCapture("[+](?![.0-9])", new ExpressionStack.RusticExpression.Operations.PrefixUnary.Positive()));
                        _o4.add(new ExpressionStack.RusticExpression.RusticParser.OperationCapture("[-](?![.0-9])", new ExpressionStack.RusticExpression.Operations.PrefixUnary.Negative()));
                        return _o4;
                    }(new (System.Collections.Generic.List$1(ExpressionStack.RusticExpression.RusticParser.OperationCapture)).ctor());
                this.ValuePattern = function (_o5) {
                        _o5.add(new ExpressionStack.RusticExpression.RusticParser.GenericCapture("[-+]?[0-9]+[Xx%]?(?![.]\\d|\\w)", ExpressionStack.RusticExpression.RusticTokenMode.Literal, function (parser, value) {
                            return ExpressionStack.RusticExpression.RusticParser.StringToInt32(value, [88, 120, 37]);
                        }));
                        _o5.add(new ExpressionStack.RusticExpression.RusticParser.GenericCapture("[-+]?[0-9]+(?:[.][0-9]+)?(?:[Ee][-+]?[0-9]+)?[FfXx%](?!\\w)", ExpressionStack.RusticExpression.RusticTokenMode.Literal, function (parser, value) {
                            return ExpressionStack.RusticExpression.RusticParser.StringToFloat(value, [70, 102, 88, 120, 37]);
                        }));
                        _o5.add(new ExpressionStack.RusticExpression.RusticParser.GenericCapture("[-+]?[0-9]*[.][0-9]+(?:[Ee][-+]?[0-9]+)?[FfXx%](?!\\w)", ExpressionStack.RusticExpression.RusticTokenMode.Literal, function (parser, value) {
                            return ExpressionStack.RusticExpression.RusticParser.StringToFloat(value, [70, 102, 88, 120, 37]);
                        }));
                        _o5.add(new ExpressionStack.RusticExpression.RusticParser.GenericCapture("[-+]?[0-9]+(?:[.][0-9]+)?(?:[Ee][-+]?[0-9]+)?[Dd]?(?!\\w)", ExpressionStack.RusticExpression.RusticTokenMode.Literal, function (parser, value) {
                            return ExpressionStack.RusticExpression.RusticParser.StringToDouble(value, [68, 100]);
                        }));
                        _o5.add(new ExpressionStack.RusticExpression.RusticParser.GenericCapture("[-+]?[0-9]*[.][0-9]+(?:[Ee][-+]?[0-9]+)?[Dd]?(?!\\w)", ExpressionStack.RusticExpression.RusticTokenMode.Literal, function (parser, value) {
                            return ExpressionStack.RusticExpression.RusticParser.StringToDouble(value, [68, 100]);
                        }));
                        _o5.add(new ExpressionStack.RusticExpression.RusticParser.GenericCapture("[A-Za-z_]\\w*", ExpressionStack.RusticExpression.RusticTokenMode.VariableName, function (parser, value) {
                            return new ExpressionStack.RusticExpression.Evaluators.Variable(parser.context, value);
                        }));
                        return _o5;
                    }(new (System.Collections.Generic.List$1(ExpressionStack.RusticExpression.RusticParser.GenericCapture)).ctor());
                this.IgnoredPattern = function (_o6) {
                        _o6.add("\\s+");
                        return _o6;
                    }(new (System.Collections.Generic.List$1(System.String)).ctor());
                this.initialized = false;
                this.unexpectedTokenExpr = new System.Text.RegularExpressions.Regex.ctor("\\s*([-$.\\w]+|[^\\w\\s])");
                this.currentState = new (System.Collections.Generic.Stack$1(ExpressionStack.RusticExpression.RusticParser.ParsingState)).ctor();
            },
            ctor: function (context) {
                this.$initialize();
                this.context = context;
            }
        },
        methods: {
            Initialize: function () {
                var options = 0;
                this.valueExpr = new System.Text.RegularExpressions.Regex.ctor(System.String.format("({0})", [Bridge.toArray(this.ValuePattern.ConvertAll(System.String, function (v) {
                            return v.pattern;
                        })).join(")|(")]), options);
                this.leftOpExpr = new System.Text.RegularExpressions.Regex.ctor(System.String.format("({0})", [Bridge.toArray(this.LeftOperators.ConvertAll(System.String, function (v) {
                            return v.pattern;
                        })).join(")|(")]), options);
                this.midOpExpr = new System.Text.RegularExpressions.Regex.ctor(System.String.format("({0})", [Bridge.toArray(this.MiddleOperators.ConvertAll(System.String, function (v) {
                            return v.pattern;
                        })).join(")|(")]), options);
                this.openGroupExpr = new System.Text.RegularExpressions.Regex.ctor(System.String.format("({0})", [Bridge.toArray(this.OpenGroupPattern.ConvertAll(System.String, function (v) {
                            return v.pattern;
                        })).join(")|(")]), options);
                this.closeGroupExpr = new System.Text.RegularExpressions.Regex.ctor(System.String.format("({0})", [Bridge.toArray(this.CloseGroupPattern.ConvertAll(System.String, function (v) {
                            return v.pattern;
                        })).join(")|(")]), options);
                this.ignoredExpr = new System.Text.RegularExpressions.Regex.ctor(System.String.format("({0})", [Bridge.toArray(this.IgnoredPattern).join(")|(")]), options);
            },
            GetTokenList: function (expression) {
                return new (Bridge.GeneratorEnumerable$1(ExpressionStack.RusticExpression.RusticToken))(Bridge.fn.bind(this, function (expression) {
                    var $step = 0,
                        $jumpFromFinally,
                        $returnValue,
                        index,
                        result,
                        $async_e;

                    var $enumerator = new (Bridge.GeneratorEnumerator$1(ExpressionStack.RusticExpression.RusticToken))(Bridge.fn.bind(this, function () {
                        try {
                            for (;;) {
                                switch ($step) {
                                    case 0: {
                                        if (this.initialized === false) {
                                                this.Initialize();
                                            }

                                            index = { v : 0 };
                                            expression.trim();
                                            this.currentState.Clear();
                                            this.currentState.Push(ExpressionStack.RusticExpression.RusticParser.ParsingState.ValueOrLeftOperatorOrEnd);

                                            
                                        $step = 1;
                                        continue;
                                    }
                                    case 1: {
                                        if ( this.currentState.Count > 0 ) {
                                                $step = 2;
                                                continue;
                                            } 
                                            $step = 6;
                                            continue;
                                    }
                                    case 2: {
                                        this.TryCaptureIgnoredPattern(expression, index);

                                            result = null;
                                            switch (this.currentState.Pop()) {
                                                case ExpressionStack.RusticExpression.RusticParser.ParsingState.ValueOrLeftOperatorOrEnd: 
                                                    result = this.TryCaptureValueOrLeftOperator(expression, index);
                                                    break;
                                                case ExpressionStack.RusticExpression.RusticParser.ParsingState.ValueOrLeftOperatorExpected: 
                                                    result = this.CaptureValueOrLeftOperator(expression, index);
                                                    break;
                                                case ExpressionStack.RusticExpression.RusticParser.ParsingState.MiddleOperatorOrEnd: 
                                                    result = this.TryCaptureMiddleOperator(expression, index);
                                                    break;
                                            }

                                            if (result != null) {
                                                $step = 3;
                                                continue;
                                            } 
                                            $step = 5;
                                            continue;
                                    }
                                    case 3: {
                                        $enumerator.current = result;
                                            $step = 4;
                                            return true;
                                    }
                                    case 4: {
                                        $step = 5;
                                        continue;
                                    }
                                    case 5: {
                                        
                                            $step = 1;
                                            continue;
                                    }
                                    case 6: {
                                        this.TryCaptureIgnoredPattern(expression, index);
                                            if (index.v < expression.length) {
                                                throw new System.Exception(System.String.format("Unexpected sequence of characters: {0}", [expression.substr(index.v)]));
                                            }

                                    }
                                    default: {
                                        return false;
                                    }
                                }
                            }
                        } catch($async_e1) {
                            $async_e = System.Exception.create($async_e1);
                            throw $async_e;
                        }
                    }));
                    return $enumerator;
                }, arguments));
            },
            TryCaptureValueOrLeftOperator: function (expression, index, canEndGroups) {
                if (canEndGroups === void 0) { canEndGroups = true; }
                var match;
                if (((match = ExpressionStack.RusticExpression.RusticParser.StickyMatch(this.openGroupExpr, expression, index))).getSuccess()) {
                    this.currentState.Push(ExpressionStack.RusticExpression.RusticParser.ParsingState.ValueOrLeftOperatorOrEnd);
                    return this.OpenGroupPattern.getItem(((ExpressionStack.RusticExpression.RusticParser.FindSuccededGroupIndex(match) - 1) | 0)).ToToken(this, match.getValue());
                }

                if (((match = ExpressionStack.RusticExpression.RusticParser.StickyMatch(this.leftOpExpr, expression, index))).getSuccess()) {
                    this.currentState.Push(ExpressionStack.RusticExpression.RusticParser.ParsingState.ValueOrLeftOperatorExpected);
                    return this.LeftOperators.getItem(((ExpressionStack.RusticExpression.RusticParser.FindSuccededGroupIndex(match) - 1) | 0)).ToToken();
                }

                if (((match = ExpressionStack.RusticExpression.RusticParser.StickyMatch(this.valueExpr, expression, index))).getSuccess()) {
                    this.currentState.Push(ExpressionStack.RusticExpression.RusticParser.ParsingState.MiddleOperatorOrEnd);
                    return this.ValuePattern.getItem(((ExpressionStack.RusticExpression.RusticParser.FindSuccededGroupIndex(match) - 1) | 0)).ToToken(this, match.getValue());
                }

                if (canEndGroups && ((match = ExpressionStack.RusticExpression.RusticParser.StickyMatch(this.closeGroupExpr, expression, index))).getSuccess()) {
                    this.currentState.Push(ExpressionStack.RusticExpression.RusticParser.ParsingState.MiddleOperatorOrEnd);
                    return this.CloseGroupPattern.getItem(((ExpressionStack.RusticExpression.RusticParser.FindSuccededGroupIndex(match) - 1) | 0)).ToToken(this, match.getValue());
                }

                return null;
            },
            CaptureValueOrLeftOperator: function (expression, index) {
                var result = this.TryCaptureValueOrLeftOperator(expression, index, false);
                if (result == null) {
                    throw new System.Exception(System.String.concat("Unexpected token: ", this.unexpectedTokenExpr.match(expression, index.v)));
                }
                return result;
            },
            TryCaptureMiddleOperator: function (expression, index, canEndGroups) {
                if (canEndGroups === void 0) { canEndGroups = true; }
                var match;
                if (((match = ExpressionStack.RusticExpression.RusticParser.StickyMatch(this.midOpExpr, expression, index))).getSuccess()) {
                    this.currentState.Push(ExpressionStack.RusticExpression.RusticParser.ParsingState.ValueOrLeftOperatorExpected);
                    return this.MiddleOperators.getItem(((ExpressionStack.RusticExpression.RusticParser.FindSuccededGroupIndex(match) - 1) | 0)).ToToken();
                }

                if (canEndGroups && ((match = ExpressionStack.RusticExpression.RusticParser.StickyMatch(this.closeGroupExpr, expression, index))).getSuccess()) {
                    this.currentState.Push(ExpressionStack.RusticExpression.RusticParser.ParsingState.MiddleOperatorOrEnd);
                    return this.CloseGroupPattern.getItem(((ExpressionStack.RusticExpression.RusticParser.FindSuccededGroupIndex(match) - 1) | 0)).ToToken(this, match.getValue());
                }

                return null;
            },
            TryCaptureIgnoredPattern: function (expression, index) {
                ExpressionStack.RusticExpression.RusticParser.StickyMatch(this.ignoredExpr, expression, index);
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.RusticParser.GenericCapture", {
        $kind: "nested class",
        fields: {
            pattern: null,
            value: null,
            mode: 0
        },
        ctors: {
            ctor: function (pattern, mode, value) {
                this.$initialize();
                this.pattern = pattern;
                this.value = value;
                this.mode = mode;
            }
        },
        methods: {
            ToToken: function (parser, captured) {
                var result = this.value(parser, captured);
                var token;
                return ((token = Bridge.as(result, ExpressionStack.RusticExpression.RusticToken))) != null ? token : new ExpressionStack.RusticExpression.RusticToken(this.mode, result);
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.RusticParser.OperationCapture", {
        $kind: "nested class",
        fields: {
            pattern: null,
            operation: null
        },
        ctors: {
            ctor: function (pattern, operation) {
                this.$initialize();
                this.pattern = pattern;
                this.operation = operation;
            }
        },
        methods: {
            ToToken: function () {
                return new ExpressionStack.RusticExpression.RusticToken(ExpressionStack.RusticExpression.RusticTokenMode.Operation, Bridge.createInstance(Bridge.getType(this.operation)));
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.RusticParser.ParsingState", {
        $kind: "nested enum",
        statics: {
            fields: {
                /**
                 * The expression expects a value or may be empty, like in ( )
                 <p>Next state:<br />
                   - On value found: {@link }.<br />
                   - On left operator found: {@link }<br /></p>
                 *
                 * @static
                 * @public
                 * @memberof number
                 * @constant
                 * @default 0
                 * @type number
                 */
                ValueOrLeftOperatorOrEnd: 0,
                /**
                 * The expression expects a value, like in A + B + ?
                 <p>Next state:<br />
                   - On value found: {@link }.<br />
                   - On left operator found: {@link }<br /></p>
                 *
                 * @static
                 * @public
                 * @memberof number
                 * @constant
                 * @default 1
                 * @type number
                 */
                ValueOrLeftOperatorExpected: 1,
                /**
                 * The expression expects a middle operator or the end of the expression, like in A + B ?
                 <p>Next state:<br />
                   - On operator found: {@link }.<br /></p>
                 *
                 * @static
                 * @public
                 * @memberof number
                 * @constant
                 * @default 2
                 * @type number
                 */
                MiddleOperatorOrEnd: 2
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.RusticStack", {
        fields: {
            displayId: 0,
            priority: 0,
            parent: null,
            operations: null,
            executed: false,
            result: null,
            resultType: null
        },
        props: {
            CanBeSimplified: {
                get: function () {
                    return this.operations.Count === 1 && Bridge.is(this.operations.getItem(0), ExpressionStack.RusticExpression.Operations.Set) && this.operations.getItem(0).parameter != null;
                }
            },
            ResultValue: {
                get: function () {
                    if (this.executed) {
                        return this.result;
                    } else {
                        throw new System.Exception("This stack did not execute yet");
                    }
                }
            }
        },
        ctors: {
            init: function () {
                this.operations = new (System.Collections.Generic.List$1(ExpressionStack.RusticExpression.RusticOperation)).ctor();
                this.executed = false;
            },
            ctor: function (id, parent, priority) {
                this.$initialize();
                this.displayId = id;
                this.parent = parent;
                this.priority = priority;
            }
        },
        methods: {
            Prepare: function () {
                var $t;
                var moveLeftUnaryOperations = new (System.Collections.Generic.List$1(ExpressionStack.RusticExpression.RusticOperation)).ctor();
                $t = Bridge.getEnumerator(this.operations);
                try {
                    while ($t.moveNext()) {
                        var operation = $t.Current;
                        if (operation.IsLeftUnary) {
                            moveLeftUnaryOperations.add(operation);
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }

                for (var i = (moveLeftUnaryOperations.Count - 1) | 0; i >= 0; i = (i - 1) | 0) {
                    var operation1 = moveLeftUnaryOperations.getItem(i);
                    this.operations.remove(operation1);
                    this.operations.add(operation1);
                }

                this.PreviewResultType();
            },
            Execute: function () {
                this.result = Bridge.box(0.0, System.Single, System.Single.format, System.Single.getHashCode);
                for (var i = 0; i < this.operations.Count; i = (i + 1) | 0) {
                    this.result = this.operations.getItem(i).Execute(this.result);
                }
                this.executed = true;
            },
            PreviewResultType: function () {
                if (this.resultType == null) {
                    for (var i = 0; i < this.operations.Count; i = (i + 1) | 0) {
                        this.resultType = this.operations.getItem(i).PreviewResultType(this.resultType);
                    }
                }

                return this.resultType;
            },
            ToExpressionString: function () {
                var str = " (";
                var first = this.operations.FindIndex$2(function (op) {
                    return op.IsLeftUnary;
                });

                if (first >= 0) {
                    for (var i = first; i < this.operations.Count; i = (i + 1) | 0) {
                        str = (str || "") + ((this.operations.getItem(i).ToExpressionString()) || "");
                    }
                }

                for (var i1 = 0; i1 < this.operations.Count; i1 = (i1 + 1) | 0) {
                    if (this.operations.getItem(i1).IsLeftUnary) {
                        break;
                    }
                    str = (str || "") + ((this.operations.getItem(i1).ToExpressionString()) || "");
                }

                str = (str || "") + " )";
                return str;
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.RusticToken", {
        fields: {
            mode: 0,
            value: null
        },
        ctors: {
            ctor: function (mode, value) {
                this.$initialize();
                this.mode = mode;
                this.value = value;
            }
        },
        methods: {
            toString: function () {
                return System.String.format("RusticToken({0}, \"{1}\")", Bridge.box(this.mode, ExpressionStack.RusticExpression.RusticTokenMode, System.Enum.toStringFn(ExpressionStack.RusticExpression.RusticTokenMode)), this.value);
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.RusticTokenMode", {
        $kind: "enum",
        statics: {
            fields: {
                Ignored: 0,
                Literal: 1,
                VariableName: 2,
                Operation: 3,
                PriorityOffset: 4
            }
        }
    });

    Bridge.define("LivePreview.App", {
        main: function Main () {
            LivePreview.App.ResultBox = document.getElementById("expr-resultbox");
            LivePreview.App.InputExpression = document.getElementById("tExpression");

            LivePreview.App.InputExpression.oninput = LivePreview.App.OnInputExpression;

            LivePreview.App.OnInputExpression(null);


        },
        statics: {
            fields: {
                ResultBox: null,
                InputExpression: null
            },
            methods: {
                OnInputExpression: function (ev) {
                    try {
                        var expr = new ExpressionStack.RusticExpression.RusticExpr.$ctor1(LivePreview.App.InputExpression.value);
                        expr.Execute();
                        LivePreview.App.ResultBox.innerHTML = LivePreview.BridgePrintHtml.PrintToHtml(expr);
                    } catch (e) {
                        e = System.Exception.create(e);
                        LivePreview.App.ResultBox.innerHTML = System.String.format("Fix your formula: {0}", [e.Message]);
                    }
                }
            }
        }
    });

    Bridge.define("LivePreview.BridgePrintHtml", {
        statics: {
            methods: {
                PrintToHtml: function (expr) {
                    var $t, $t1, $t2, $t3, $t4, $t5;
                    var html = System.String.format("<div class=\"expr-result\">Result: {0}</div>", [expr.stacks.getItem(0).ResultValue]);
                    html = (html || "") + "<table width=100%>";

                    html = (html || "") + "<thead>";
                    html = (html || "") + "<tr>";
                    html = (html || "") + "<th>Stack Register</th>";
                    html = (html || "") + "<th width=50%>Operation</th>";
                    html = (html || "") + "<th width=20%>Result</th>";
                    html = (html || "") + "<th>Type</th>";
                    html = (html || "") + "</tr>";
                    html = (html || "") + "</thead>";

                    html = (html || "") + "<tbody>";

                    $t = Bridge.getEnumerator(expr.stacks);
                    try {
                        while ($t.moveNext()) {
                            var stack = $t.Current;
                            var isFirst = true;
                            var prevType = null;
                            var resultValue = null;
                            $t1 = Bridge.getEnumerator(stack.operations);
                            try {
                                while ($t1.moveNext()) {
                                    var operation = $t1.Current;
                                    html = (html || "") + "<tr>";
                                    if (isFirst) {
                                        html = (html || "") + ((System.String.format("<td rowspan='{0}'>R{1}</td>", Bridge.box(((stack.operations.Count + 1) | 0), System.Int32), Bridge.box(stack.displayId, System.Int32))) || "");
                                    }

                                    var opResultType = operation.PreviewResultType(prevType);
                                    resultValue = operation.Execute(resultValue);

                                    html = (html || "") + ((System.String.format("<td>{0}{1}</td>", Bridge.Reflection.getTypeName(Bridge.getType(operation)), (operation.parameter != null ? System.String.concat(" ", operation.parameter) : ""))) || "");

                                    html = (html || "") + ((System.String.format("<td>R{0}: {1}</td>", Bridge.box(stack.displayId, System.Int32), resultValue)) || "");

                                    html = (html || "") + ((System.String.format("<td style='white-space: nowrap'>{0}({1}, {2}): {3}</td>", Bridge.Reflection.getTypeName(Bridge.getType(operation)), ($t2 = (prevType != null ? Bridge.Reflection.getTypeName(prevType) : null), $t2 != null ? $t2 : "null"), (operation.parameter != null ? " " + (Bridge.Reflection.getTypeName(operation.parameterType) || "") : "null"), Bridge.Reflection.getTypeName(opResultType))) || "");

                                    html = (html || "") + "</tr>";
                                    isFirst = false;
                                    prevType = opResultType;
                                }
                            } finally {
                                if (Bridge.is($t1, System.IDisposable)) {
                                    $t1.System$IDisposable$Dispose();
                                }
                            }

                            html = (html || "") + ((System.String.format("<tr style='font-weight:bold'><td>Return</td><td>R{0}: {1}</td><td>{2}</td></tr>", Bridge.box(stack.displayId, System.Int32), ($t3 = stack.ResultValue, $t3 != null ? $t3 : "null"), ($t4 = (($t5 = stack.ResultValue) != null ? Bridge.Reflection.getTypeName(Bridge.getType($t5)) : null), $t4 != null ? $t4 : "null"))) || "");

                            html = (html || "") + "</tr>";
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$Dispose();
                        }
                    }

                    html = (html || "") + "</tbody>";
                    html = (html || "") + "</table>";
                    return html;
                }
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.Evaluators.Literal", {
        inherits: [ExpressionStack.RusticExpression.RusticValueEvaluator],
        fields: {
            value: null
        },
        ctors: {
            ctor: function (value) {
                this.$initialize();
                ExpressionStack.RusticExpression.RusticValueEvaluator.ctor.call(this);
                this.value = value;
            }
        },
        methods: {
            GetValue$1: function () {
                return this.value;
            },
            GetValueType: function () {
                return Bridge.getType(this.value);
            },
            toString: function () {
                return System.String.format("{0}", [this.value]);
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.Evaluators.StackReference", {
        inherits: [ExpressionStack.RusticExpression.RusticValueEvaluator],
        fields: {
            stack: null
        },
        ctors: {
            ctor: function (stack) {
                this.$initialize();
                ExpressionStack.RusticExpression.RusticValueEvaluator.ctor.call(this);
                this.stack = stack;
            }
        },
        methods: {
            GetValue$1: function () {
                return this.stack.ResultValue;
            },
            GetValueType: function () {
                return this.stack.PreviewResultType();
            },
            toString: function () {
                return System.String.format("R{0}", [Bridge.box(this.stack.displayId, System.Int32)]);
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.Evaluators.Variable", {
        inherits: [ExpressionStack.RusticExpression.RusticValueEvaluator],
        fields: {
            context: null,
            variableName: null,
            variableType: null
        },
        ctors: {
            ctor: function (context, variableId) {
                var $t;
                this.$initialize();
                ExpressionStack.RusticExpression.RusticValueEvaluator.ctor.call(this);
                this.context = context;
                this.variableName = variableId;
                this.variableType = ($t = this.GetValue$1()) != null ? Bridge.getType($t) : null;
            }
        },
        methods: {
            GetValue$1: function () {
                var value = { v : null };
                if (System.Nullable.eq((this.context != null ? this.context.variables.tryGetValue(this.variableName, value) : null), true)) {
                    return value.v;
                } else {
                    return null;
                }
            },
            GetValueType: function () {
                return this.variableType;
            },
            toString: function () {
                return this.variableName;
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.Operations.Add", {
        inherits: [ExpressionStack.RusticExpression.RusticOperation],
        fields: {
            func: null
        },
        methods: {
            Execute: function (stored) {
                return this.func(stored, this.parameterValue);
            },
            GetPriority: function () {
                return ExpressionStack.RusticExpression.RusticOperation.Priority.AddSub;
            },
            PreviewResultType: function (incomingStoredType) {
                if (Bridge.referenceEquals(incomingStoredType, System.Double) || Bridge.referenceEquals(this.parameterType, System.Double)) {
                    this.func = ExpressionStack.RusticExpression.Operations.Providers.CommonMath.Add.getItem(System.Double);
                    return System.Double;
                } else if (Bridge.referenceEquals(incomingStoredType, System.Single) || Bridge.referenceEquals(this.parameterType, System.Single)) {
                    this.func = ExpressionStack.RusticExpression.Operations.Providers.CommonMath.Add.getItem(System.Single);
                    return System.Single;
                } else if (Bridge.referenceEquals(incomingStoredType, System.Int32) && Bridge.referenceEquals(this.parameterType, System.Int32)) {
                    this.func = ExpressionStack.RusticExpression.Operations.Providers.CommonMath.Add.getItem(System.Int32);
                    return System.Int32;
                } else {
                    throw new System.NotImplementedException.$ctor1("Could not infer the resulting type");
                }
            },
            ToExpressionString: function () {
                var $t;
                return System.String.format(" + {0}", [($t = this.parameter) != null ? Bridge.toString($t) : null]);
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.Operations.Div", {
        inherits: [ExpressionStack.RusticExpression.RusticOperation],
        fields: {
            func: null
        },
        methods: {
            Execute: function (stored) {
                return this.func(stored, this.parameterValue);
            },
            GetPriority: function () {
                return ExpressionStack.RusticExpression.RusticOperation.Priority.MulDiv;
            },
            PreviewResultType: function (incomingStoredType) {
                if (Bridge.referenceEquals(incomingStoredType, System.Double) || Bridge.referenceEquals(this.parameterType, System.Double)) {
                    this.func = ExpressionStack.RusticExpression.Operations.Providers.CommonMath.Div.getItem(System.Double);
                    return System.Double;
                } else if (Bridge.referenceEquals(incomingStoredType, System.Single) || Bridge.referenceEquals(this.parameterType, System.Single)) {
                    this.func = ExpressionStack.RusticExpression.Operations.Providers.CommonMath.Div.getItem(System.Single);
                    return System.Single;
                } else if (Bridge.referenceEquals(incomingStoredType, System.Int32) && Bridge.referenceEquals(this.parameterType, System.Int32)) {
                    this.func = ExpressionStack.RusticExpression.Operations.Providers.CommonMath.Div.getItem(System.Int32);
                    return System.Int32;
                } else {
                    throw new System.NotImplementedException.$ctor1("Could not infer the resulting type");
                }
            },
            ToExpressionString: function () {
                var $t;
                return System.String.format(" / {0}", [($t = this.parameter) != null ? Bridge.toString($t) : null]);
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.Operations.Mul", {
        inherits: [ExpressionStack.RusticExpression.RusticOperation],
        fields: {
            func: null
        },
        methods: {
            Execute: function (stored) {
                return this.func(stored, this.parameterValue);
            },
            GetPriority: function () {
                return ExpressionStack.RusticExpression.RusticOperation.Priority.MulDiv;
            },
            PreviewResultType: function (incomingStoredType) {
                if (Bridge.referenceEquals(incomingStoredType, System.Double) || Bridge.referenceEquals(this.parameterType, System.Double)) {
                    this.func = ExpressionStack.RusticExpression.Operations.Providers.CommonMath.Mul.getItem(System.Double);
                    return System.Double;
                } else if (Bridge.referenceEquals(incomingStoredType, System.Single) || Bridge.referenceEquals(this.parameterType, System.Single)) {
                    this.func = ExpressionStack.RusticExpression.Operations.Providers.CommonMath.Mul.getItem(System.Single);
                    return System.Single;
                } else if (Bridge.referenceEquals(incomingStoredType, System.Int32) && Bridge.referenceEquals(this.parameterType, System.Int32)) {
                    this.func = ExpressionStack.RusticExpression.Operations.Providers.CommonMath.Mul.getItem(System.Int32);
                    return System.Int32;
                } else {
                    throw new System.NotImplementedException.$ctor1("Could not infer the resulting type");
                }
            },
            ToExpressionString: function () {
                var $t;
                return System.String.format(" * {0}", [($t = this.parameter) != null ? Bridge.toString($t) : null]);
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.Operations.Pow", {
        inherits: [ExpressionStack.RusticExpression.RusticOperation],
        methods: {
            Execute: function (stored) {
                return Bridge.box(Math.pow(System.Convert.toDouble(stored), System.Convert.toDouble(this.parameterValue)), System.Double, System.Double.format, System.Double.getHashCode);
            },
            GetPriority: function () {
                return ExpressionStack.RusticExpression.RusticOperation.Priority.Pow;
            },
            PreviewResultType: function (incomingStoredType) {
                return System.Double;
            },
            HasRightToLeftPrecedence: function () {
                return true;
            },
            ToExpressionString: function () {
                var $t;
                return System.String.format(" ** ({0})", [($t = this.parameter) != null ? Bridge.toString($t) : null]);
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.Operations.PrefixUnary.Negative", {
        inherits: [ExpressionStack.RusticExpression.RusticOperation],
        fields: {
            func: null
        },
        methods: {
            Execute: function (stored) {
                return this.func(stored, null);
            },
            GetPriority: function () {
                return ExpressionStack.RusticExpression.RusticOperation.Priority.PrefixUnary;
            },
            PreviewResultType: function (incomingStoredType) {
                if (Bridge.referenceEquals(incomingStoredType, System.Double) || Bridge.referenceEquals(this.parameterType, System.Double)) {
                    this.func = ExpressionStack.RusticExpression.Operations.Providers.CommonMath.Negative.getItem(System.Double);
                    return System.Double;
                } else if (Bridge.referenceEquals(incomingStoredType, System.Single) || Bridge.referenceEquals(this.parameterType, System.Single)) {
                    this.func = ExpressionStack.RusticExpression.Operations.Providers.CommonMath.Negative.getItem(System.Single);
                    return System.Single;
                } else {
                    this.func = ExpressionStack.RusticExpression.Operations.Providers.CommonMath.Negative.getItem(System.Int32);
                    return System.Int32;
                }
            },
            ToExpressionString: function () {
                return System.String.format(" -", null);
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.Operations.PrefixUnary.Positive", {
        inherits: [ExpressionStack.RusticExpression.RusticOperation],
        fields: {
            func: null
        },
        methods: {
            Execute: function (stored) {
                return this.func(stored, null);
            },
            GetPriority: function () {
                return ExpressionStack.RusticExpression.RusticOperation.Priority.PrefixUnary;
            },
            PreviewResultType: function (incomingStoredType) {
                if (Bridge.referenceEquals(incomingStoredType, System.Double) || Bridge.referenceEquals(this.parameterType, System.Double)) {
                    this.func = ExpressionStack.RusticExpression.Operations.Providers.CommonMath.Positive.getItem(System.Double);
                    return System.Double;
                } else if (Bridge.referenceEquals(incomingStoredType, System.Single) || Bridge.referenceEquals(this.parameterType, System.Single)) {
                    this.func = ExpressionStack.RusticExpression.Operations.Providers.CommonMath.Positive.getItem(System.Single);
                    return System.Single;
                } else {
                    this.func = ExpressionStack.RusticExpression.Operations.Providers.CommonMath.Positive.getItem(System.Int32);
                    return System.Int32;
                }
            },
            ToExpressionString: function () {
                return System.String.format(" +", null);
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.Operations.Set", {
        inherits: [ExpressionStack.RusticExpression.RusticOperation],
        methods: {
            Execute: function (stored) {
                return this.parameterValue;
            },
            GetPriority: function () {
                return ExpressionStack.RusticExpression.RusticOperation.Priority.Ignored;
            },
            PreviewResultType: function (incomingStoredType) {
                return this.parameterType;
            },
            HasRightToLeftPrecedence: function () {
                return true;
            },
            ToExpressionString: function () {
                var $t;
                return System.String.format(" {0}", [($t = this.parameter) != null ? Bridge.toString($t) : null]);
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.Operations.Sub", {
        inherits: [ExpressionStack.RusticExpression.RusticOperation],
        fields: {
            func: null
        },
        methods: {
            Execute: function (stored) {
                return this.func(stored, this.parameterValue);
            },
            GetPriority: function () {
                return ExpressionStack.RusticExpression.RusticOperation.Priority.AddSub;
            },
            PreviewResultType: function (incomingStoredType) {
                if (Bridge.referenceEquals(incomingStoredType, System.Double) || Bridge.referenceEquals(this.parameterType, System.Double)) {
                    this.func = ExpressionStack.RusticExpression.Operations.Providers.CommonMath.Sub.getItem(System.Double);
                    return System.Double;
                } else if (Bridge.referenceEquals(incomingStoredType, System.Single) || Bridge.referenceEquals(this.parameterType, System.Single)) {
                    this.func = ExpressionStack.RusticExpression.Operations.Providers.CommonMath.Sub.getItem(System.Single);
                    return System.Single;
                } else if (Bridge.referenceEquals(incomingStoredType, System.Int32) && Bridge.referenceEquals(this.parameterType, System.Int32)) {
                    this.func = ExpressionStack.RusticExpression.Operations.Providers.CommonMath.Sub.getItem(System.Int32);
                    return System.Int32;
                } else {
                    throw new System.NotImplementedException.$ctor1("Could not infer the resulting type");
                }
            },
            ToExpressionString: function () {
                var $t;
                return System.String.format(" - {0}", [($t = this.parameter) != null ? Bridge.toString($t) : null]);
            }
        }
    });
});

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJMaXZlUHJldmlldy5qcyIsCiAgInNvdXJjZVJvb3QiOiAiIiwKICAic291cmNlcyI6IFsiUnVzdGljRXhwcmVzc2lvbi9EZWJ1Z0V4dGVuc2lvbi5jcyIsIlJ1c3RpY0V4cHJlc3Npb24vUnVzdGljVmFsdWVFdmFsdWF0b3IuY3MiLCJSdXN0aWNFeHByZXNzaW9uL1J1c3RpY09wZXJhdGlvbi5jcyIsIlJ1c3RpY0V4cHJlc3Npb24vT3BlcmF0aW9ucy9Qcm92aWRlcnMvQ29tbW9uTWF0aC5jcyIsIlJ1c3RpY0V4cHJlc3Npb24vUnVzdGljQ29udGV4dC5jcyIsIlJ1c3RpY0V4cHJlc3Npb24vUnVzdGljRXhwci5jcyIsIlJ1c3RpY0V4cHJlc3Npb24vUnVzdGljRXhwckJ1aWxkZXIuY3MiLCJSdXN0aWNFeHByZXNzaW9uL1J1c3RpY1BhcnNlci5jcyIsIlJ1c3RpY0V4cHJlc3Npb24vUnVzdGljU3RhY2suY3MiLCJSdXN0aWNFeHByZXNzaW9uL1J1c3RpY1Rva2VuLmNzIiwiQXBwLmNzIiwiQnJpZGdlUHJpbnRIdG1sLmNzIiwiUnVzdGljRXhwcmVzc2lvbi9FdmFsdWF0b3JzL0xpdGVyYWwuY3MiLCJSdXN0aWNFeHByZXNzaW9uL0V2YWx1YXRvcnMvU3RhY2tSZWZlcmVuY2UuY3MiLCJSdXN0aWNFeHByZXNzaW9uL0V2YWx1YXRvcnMvVmFyaWFibGUuY3MiLCJSdXN0aWNFeHByZXNzaW9uL09wZXJhdGlvbnMvQWRkLmNzIiwiUnVzdGljRXhwcmVzc2lvbi9PcGVyYXRpb25zL0Rpdi5jcyIsIlJ1c3RpY0V4cHJlc3Npb24vT3BlcmF0aW9ucy9NdWwuY3MiLCJSdXN0aWNFeHByZXNzaW9uL09wZXJhdGlvbnMvUG93LmNzIiwiUnVzdGljRXhwcmVzc2lvbi9PcGVyYXRpb25zL1ByZWZpeFVuYXJ5L05lZ2F0aXZlLmNzIiwiUnVzdGljRXhwcmVzc2lvbi9PcGVyYXRpb25zL1ByZWZpeFVuYXJ5L1Bvc2l0aXZlLmNzIiwiUnVzdGljRXhwcmVzc2lvbi9PcGVyYXRpb25zL1NldC5jcyIsIlJ1c3RpY0V4cHJlc3Npb24vT3BlcmF0aW9ucy9TdWIuY3MiXSwKICAibmFtZXMiOiBbIiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7O3NDQVVzQ0E7O29CQUUxQkEsYUFBMkJBO29CQUMzQkEsS0FBS0EsUUFBUUEsd0JBQWtCQSxRQUFRQTt3QkFHbkNBLHlCQUFrQkEsaUVBQThCQSw2QkFBRUEsMEJBQU9BLDRDQUE0QkEsZUFBT0E7d0JBQzVGQSxJQUFJQSxlQUFPQTs0QkFFUEEseUJBQWtCQTs7NEJBSWxCQSxlQUFnQkE7NEJBQ2hCQSxLQUFLQSxXQUFXQSxJQUFJQSxlQUFPQSxxQkFBcUJBO2dDQUU1Q0EsZ0JBQTRCQSxlQUFPQSxzQkFBY0E7Z0NBQ2pEQSx5QkFBa0JBLCtEQUE0QkEsMERBQXlCQSxDQUFDQSx1QkFBdUJBLFlBQVlBLDJCQUFPQSx1Q0FBcUNBLCtDQUF1Q0EsMERBQXlCQSxPQUFDQSxZQUFVQSxPQUFLQSwwQ0FBY0EsQUFBUUEsb0JBQXRDQSxjQUFzREEsUUFBQ0EsT0FBb0NBLDRCQUEwQkEsT0FBS0EscUNBQWtEQSxBQUFRQSxxQkFBOUhBLGVBQThJQSwwREFBNEJBO2dDQUN2YkEsV0FBV0EsNEJBQTRCQTs7Ozt3QkFJL0NBLElBQUlBLGVBQU9BOzRCQUVQQSx5QkFBa0JBLHNFQUFrQ0EsZUFBT0EsaUNBQStCQSxpQ0FBd0JBLFFBQUNBLE9BQW9DQSxlQUFPQSxtQkFBaUJBLE9BQUtBLHFEQUE4REEsQUFBUUEscUJBQXhJQTs7d0JBRXRIQTs7Ozs7Ozs7O2dDQzVCRUE7Z0JBRWRBLE9BQU9BLFlBQUdBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkNLTkEsT0FBT0E7Ozs7OztvQkFNUEEsT0FBT0EsTUFBb0NBLG1CQUFZQSxPQUFLQSxvQkFBNEVBLEFBQU1BOzs7OztvQkE2QjlJQSxPQUFPQSx1QkFBaUJBOzs7Ozs7Z0JBakI1QkEsT0FBT0EsRUFBS0EscUJBQWdCQTs7O2dCQUc1QkEsT0FBT0EsQ0FBQ0Esa0JBQWFBLFNBQVNBLENBQUNB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QUFPQSxpQkFBUUEsMkNBQWlCQSxBQUFPQTtvQkFFbEVBLFlBQU9BLDZFQUF5QkEsQUFBT0E7b0JBQ3ZDQSxPQUFPQSxBQUFPQTs7b0JBR2RBLE1BQU1BLElBQUlBOzs7OztnQkFJdEJBLE9BQU9BLGdDQUF1QkEsTUFBb0NBLG1CQUFZQSxPQUFLQSxzQkFBd0VBLEFBQVFBIiwKICAic291cmNlc0NvbnRlbnQiOiBbInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBFeHByZXNzaW9uU3RhY2suUnVzdGljRXhwcmVzc2lvblxyXG57XHJcbiAgICBzdGF0aWMgY2xhc3MgRGVidWdFeHRlbnNpb25cclxuICAgIHtcclxuICAgICAgICBzdGF0aWMgcHVibGljIHZvaWQgUHJpbnREZWJ1Zyh0aGlzIFJ1c3RpY0V4cHIgZXhwcmVzc2lvbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIExpc3Q8UnVzdGljU3RhY2s+IHN0YWNrcyA9IGV4cHJlc3Npb24uc3RhY2tzO1xyXG4gICAgICAgICAgICBmb3IgKGludCByID0gc3RhY2tzLkNvdW50IC0gMTsgciA+PSAwOyByLS0pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vIFwicjk5W3A9OTldOiAgXCJcclxuICAgICAgICAgICAgICAgIENvbnNvbGUuV3JpdGVMaW5lKHN0cmluZy5Gb3JtYXQoXCJSezB9IFtQPXsxfV06XCIscixzdGFja3Nbcl0ucHJpb3JpdHkpLlBhZFJpZ2h0KDMwKSArIHN0YWNrc1tyXS5Ub0V4cHJlc3Npb25TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhY2tzW3JdLm9wZXJhdGlvbnMuQ291bnQgPT0gMClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBDb25zb2xlLldyaXRlTGluZShzdHJpbmcuRm9ybWF0KFwiTm8gb3BlcmF0aW9ucyBmb3VuZC5cIikpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFR5cGUgcHJldlR5cGUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaW50IGkgPSAwOyBpIDwgc3RhY2tzW3JdLm9wZXJhdGlvbnMuQ291bnQ7IGkrKylcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJ1c3RpY09wZXJhdGlvbiBvcGVyYXRpb24gPSBzdGFja3Nbcl0ub3BlcmF0aW9uc1tpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQ29uc29sZS5Xcml0ZUxpbmUoc3RyaW5nLkZvcm1hdChcIiAgezB9IFJYezF9XCIsb3BlcmF0aW9uLkdldFR5cGUoKS5OYW1lLChvcGVyYXRpb24ucGFyYW1ldGVyID09IG51bGwgPyBcIlwiIDogXCIsIFwiICsgb3BlcmF0aW9uLnBhcmFtZXRlcikpLlBhZFJpZ2h0KDMwKSArIHN0cmluZy5Gb3JtYXQoXCIgICMgezB9KHsxfSwgezJ9KTogezN9XCIsb3BlcmF0aW9uLkdldFR5cGUoKS5OYW1lLChwcmV2VHlwZSE9bnVsbD9wcmV2VHlwZS5OYW1lOihzdHJpbmcpbnVsbCkgPz8gXCJudWxsXCIsKGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5Ub1RlbXAoXCJrZXkxXCIsb3BlcmF0aW9uLnBhcmFtZXRlclR5cGUpIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tVGVtcDxUeXBlPihcImtleTFcIikuTmFtZTooc3RyaW5nKW51bGwpID8/IFwibnVsbFwiLG9wZXJhdGlvbi5QcmV2aWV3UmVzdWx0VHlwZShwcmV2VHlwZSkuTmFtZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmV2VHlwZSA9IG9wZXJhdGlvbi5QcmV2aWV3UmVzdWx0VHlwZShwcmV2VHlwZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChzdGFja3Nbcl0uZXhlY3V0ZWQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgQ29uc29sZS5Xcml0ZUxpbmUoc3RyaW5nLkZvcm1hdChcIiAgUmVzdWx0VmFsdWUgezB9XCIsc3RhY2tzW3JdLlJlc3VsdFZhbHVlKS5QYWRSaWdodCgzMCkgKyBzdHJpbmcuRm9ybWF0KFwiICAjIHswfVwiLChnbG9iYWw6OkJyaWRnZS5TY3JpcHQuVG9UZW1wKFwia2V5MlwiLHN0YWNrc1tyXS5SZXN1bHRWYWx1ZSkhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21UZW1wPG9iamVjdD4oXCJrZXkyXCIpLkdldFR5cGUoKS5OYW1lOihzdHJpbmcpbnVsbCkgPz8gXCJudWxsXCIpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIENvbnNvbGUuV3JpdGVMaW5lKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG5cclxubmFtZXNwYWNlIEV4cHJlc3Npb25TdGFjay5SdXN0aWNFeHByZXNzaW9uXG57XG4gICAgYWJzdHJhY3QgY2xhc3MgUnVzdGljVmFsdWVFdmFsdWF0b3JcbiAgICB7XG4gICAgICAgIGFic3RyYWN0IHB1YmxpYyBvYmplY3QgR2V0VmFsdWUoKTtcbiAgICAgICAgYWJzdHJhY3QgcHVibGljIFR5cGUgR2V0VmFsdWVUeXBlKCk7XG5wdWJsaWMgVCBHZXRWYWx1ZTxUPigpXHJcbntcclxuICAgIHJldHVybiAoVClHZXRWYWx1ZSgpO1xyXG59ICAgIH1cbn1cbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBFeHByZXNzaW9uU3RhY2suUnVzdGljRXhwcmVzc2lvblxyXG57XHJcbiAgICBhYnN0cmFjdCBjbGFzcyBSdXN0aWNPcGVyYXRpb25cclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgUnVzdGljVmFsdWVFdmFsdWF0b3IgcGFyYW1ldGVyIHsgZ2V0OyBzZXQ7IH1cclxucHVibGljIG9iamVjdCBwYXJhbWV0ZXJWYWx1ZVxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gcGFyYW1ldGVyLkdldFZhbHVlKCk7XHJcbiAgICB9XHJcbn1wdWJsaWMgVHlwZSBwYXJhbWV0ZXJUeXBlXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBnbG9iYWw6OkJyaWRnZS5TY3JpcHQuVG9UZW1wKFwia2V5MVwiLHBhcmFtZXRlcikhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21UZW1wPFJ1c3RpY1ZhbHVlRXZhbHVhdG9yPihcImtleTFcIikuR2V0VmFsdWVUeXBlKCk6KFR5cGUpbnVsbDtcclxuICAgIH1cclxufSAgICAgICAgXHJcbiAgICAgICAgcHVibGljIGludCBwcmlvcml0eU9mZnNldDtcclxuICAgICAgICBcclxuICAgICAgICBhYnN0cmFjdCBwdWJsaWMgb2JqZWN0IEV4ZWN1dGUob2JqZWN0IHN0b3JlZCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgYWJzdHJhY3QgcHVibGljIFR5cGUgUHJldmlld1Jlc3VsdFR5cGUoVHlwZSBpbmNvbWluZ1N0b3JlZFR5cGUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHByb3RlY3RlZCBhYnN0cmFjdCBQcmlvcml0eSBHZXRQcmlvcml0eSgpO1xyXG5wdWJsaWMgaW50IEdldFByaW9yaXR5V2l0aE9mZnNldCgpXHJcbntcclxuICAgIHJldHVybiAoaW50KUdldFByaW9yaXR5KCkgKyBwcmlvcml0eU9mZnNldDtcclxufXB1YmxpYyBib29sIEhhc0luY3JlYXNlZFByaW9yaXR5KClcclxue1xyXG4gICAgcmV0dXJuIChwYXJhbWV0ZXIgIT0gbnVsbCkgJiYgKHBhcmFtZXRlciBpcyBFdmFsdWF0b3JzLlN0YWNrUmVmZXJlbmNlKTtcclxufXB1YmxpYyBvdmVycmlkZSBzdHJpbmcgVG9TdHJpbmcoKVxyXG57XHJcbiAgICByZXR1cm4gc3RyaW5nLkZvcm1hdChcInswfXsxfVwiLEdldFR5cGUoKS5OYW1lLChwYXJhbWV0ZXIgIT0gbnVsbCA/IHBhcmFtZXRlci5HZXRUeXBlKCkuTmFtZSA6IFwiXCIpKTtcclxufXB1YmxpYyB2aXJ0dWFsIHN0cmluZyBUb0V4cHJlc3Npb25TdHJpbmcoKVxyXG57XHJcbiAgICByZXR1cm4gc3RyaW5nLkZvcm1hdChcIiB7MH17MX1cIixHZXRUeXBlKCkuTmFtZSwocGFyYW1ldGVyICE9IG51bGwgPyBcIiBcIiArIHBhcmFtZXRlclZhbHVlIDogXCJcIikpO1xyXG59cHVibGljIHZpcnR1YWwgYm9vbCBIYXNSaWdodFRvTGVmdFByZWNlZGVuY2UoKVxyXG57XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn1wdWJsaWMgdmlydHVhbCBib29sIElzTGVmdFVuYXJ5XHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBHZXRQcmlvcml0eSgpID09IFByaW9yaXR5LlByZWZpeFVuYXJ5O1xyXG4gICAgfVxyXG59XHJcbiAgICAgICAgcHVibGljIGNvbnN0IGludCBGaXJzdFByaW9yaXR5ID0gMTsgLy8gVGhpcyBpcyB0aGUgdmFsdWUgb2YgdGhlIGxvd2VyIHByaW9yaXR5IG9wZXJhdGlvbiAoZXhjZXB0IHRob3NlIHRoYXQgZG9lc24ndCBoYXZlIHByaW9yaXR5IGFuZCBhcmUgc2V0IHRvIC05OTk5OTkgb3Igc29tZXRoaW5nIGxpa2UgdGhhdCkuXHJcblxyXG4gICAgICAgIHB1YmxpYyBlbnVtIFByaW9yaXR5XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBJZ25vcmVkID0gLTk5OTk5OSxcclxuICAgICAgICAgICAgQWRkU3ViID0gMSxcclxuICAgICAgICAgICAgTXVsRGl2ID0gMixcclxuICAgICAgICAgICAgUG93ID0gMyxcclxuICAgICAgICAgICAgUHJlZml4VW5hcnkgPSA0LFxyXG5cclxuICAgICAgICAgICAgUGFyZW50aGVzaXMgPSAyMCxcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG5cclxubmFtZXNwYWNlIEV4cHJlc3Npb25TdGFjay5SdXN0aWNFeHByZXNzaW9uLk9wZXJhdGlvbnMuUHJvdmlkZXJzXHJcbntcclxuICAgIHN0YXRpYyBjbGFzcyBDb21tb25NYXRoXHJcbiAgICB7XHJcbiAgICAgICAgc3RhdGljIHB1YmxpYyBEaWN0aW9uYXJ5PFR5cGUsIEZ1bmM8b2JqZWN0LCBvYmplY3QsIG9iamVjdD4+IE5lZ2F0aXZlID0gZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IERpY3Rpb25hcnk8VHlwZSwgRnVuYzxvYmplY3QsIG9iamVjdCwgb2JqZWN0Pj4oKSwoX28xKT0+e19vMS5BZGQodHlwZW9mKGZsb2F0KSxOZWdhdGl2ZVNpbmdsZSk7X28xLkFkZCh0eXBlb2YoZG91YmxlKSxOZWdhdGl2ZURvdWJsZSk7X28xLkFkZCh0eXBlb2YoaW50KSxOZWdhdGl2ZUludDMyKTtyZXR1cm4gX28xO30pO1xyXG5zdGF0aWMgb2JqZWN0IE5lZ2F0aXZlU2luZ2xlKG9iamVjdCBhLCBvYmplY3QgYilcclxue1xyXG4gICAgcmV0dXJuIC1Db252ZXJ0LlRvU2luZ2xlKGEpO1xyXG59c3RhdGljIG9iamVjdCBOZWdhdGl2ZURvdWJsZShvYmplY3QgYSwgb2JqZWN0IGIpXHJcbntcclxuICAgIHJldHVybiAtQ29udmVydC5Ub0RvdWJsZShhKTtcclxufXN0YXRpYyBvYmplY3QgTmVnYXRpdmVJbnQzMihvYmplY3QgYSwgb2JqZWN0IGIpXHJcbntcclxuICAgIHJldHVybiAtQ29udmVydC5Ub0ludDMyKGEpO1xyXG59XHJcbiAgICAgICAgc3RhdGljIHB1YmxpYyBEaWN0aW9uYXJ5PFR5cGUsIEZ1bmM8b2JqZWN0LCBvYmplY3QsIG9iamVjdD4+IFBvc2l0aXZlID0gZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IERpY3Rpb25hcnk8VHlwZSwgRnVuYzxvYmplY3QsIG9iamVjdCwgb2JqZWN0Pj4oKSwoX28yKT0+e19vMi5BZGQodHlwZW9mKGZsb2F0KSxQb3NpdGl2ZVNpbmdsZSk7X28yLkFkZCh0eXBlb2YoZG91YmxlKSxQb3NpdGl2ZURvdWJsZSk7X28yLkFkZCh0eXBlb2YoaW50KSxQb3NpdGl2ZUludDMyKTtyZXR1cm4gX28yO30pO1xyXG5zdGF0aWMgb2JqZWN0IFBvc2l0aXZlU2luZ2xlKG9iamVjdCBhLCBvYmplY3QgYilcclxue1xyXG4gICAgcmV0dXJuIENvbnZlcnQuVG9TaW5nbGUoYSk7XHJcbn1zdGF0aWMgb2JqZWN0IFBvc2l0aXZlRG91YmxlKG9iamVjdCBhLCBvYmplY3QgYilcclxue1xyXG4gICAgcmV0dXJuIENvbnZlcnQuVG9Eb3VibGUoYSk7XHJcbn1zdGF0aWMgb2JqZWN0IFBvc2l0aXZlSW50MzIob2JqZWN0IGEsIG9iamVjdCBiKVxyXG57XHJcbiAgICByZXR1cm4gQ29udmVydC5Ub0ludDMyKGEpO1xyXG59XHJcbiAgICAgICAgc3RhdGljIHB1YmxpYyBEaWN0aW9uYXJ5PFR5cGUsIEZ1bmM8b2JqZWN0LCBvYmplY3QsIG9iamVjdD4+IEFkZCA9IGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5DYWxsRm9yKG5ldyBEaWN0aW9uYXJ5PFR5cGUsIEZ1bmM8b2JqZWN0LCBvYmplY3QsIG9iamVjdD4+KCksKF9vMyk9PntfbzMuQWRkKHR5cGVvZihmbG9hdCksQWRkU2luZ2xlKTtfbzMuQWRkKHR5cGVvZihkb3VibGUpLEFkZERvdWJsZSk7X28zLkFkZCh0eXBlb2YoaW50KSxBZGRJbnQzMik7cmV0dXJuIF9vMzt9KTtcclxuc3RhdGljIG9iamVjdCBBZGRTaW5nbGUob2JqZWN0IGEsIG9iamVjdCBiKVxyXG57XHJcbiAgICByZXR1cm4gQ29udmVydC5Ub1NpbmdsZShhKSArIENvbnZlcnQuVG9TaW5nbGUoYik7XHJcbn1zdGF0aWMgb2JqZWN0IEFkZERvdWJsZShvYmplY3QgYSwgb2JqZWN0IGIpXHJcbntcclxuICAgIHJldHVybiBDb252ZXJ0LlRvRG91YmxlKGEpICsgQ29udmVydC5Ub0RvdWJsZShiKTtcclxufXN0YXRpYyBvYmplY3QgQWRkSW50MzIob2JqZWN0IGEsIG9iamVjdCBiKVxyXG57XHJcbiAgICByZXR1cm4gQ29udmVydC5Ub0ludDMyKGEpICsgQ29udmVydC5Ub0ludDMyKGIpO1xyXG59XHJcbiAgICAgICAgc3RhdGljIHB1YmxpYyBEaWN0aW9uYXJ5PFR5cGUsIEZ1bmM8b2JqZWN0LCBvYmplY3QsIG9iamVjdD4+IFN1YiA9IGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5DYWxsRm9yKG5ldyBEaWN0aW9uYXJ5PFR5cGUsIEZ1bmM8b2JqZWN0LCBvYmplY3QsIG9iamVjdD4+KCksKF9vNCk9PntfbzQuQWRkKHR5cGVvZihmbG9hdCksU3ViU2luZ2xlKTtfbzQuQWRkKHR5cGVvZihkb3VibGUpLFN1YkRvdWJsZSk7X280LkFkZCh0eXBlb2YoaW50KSxTdWJJbnQzMik7cmV0dXJuIF9vNDt9KTtcclxuc3RhdGljIG9iamVjdCBTdWJTaW5nbGUob2JqZWN0IGEsIG9iamVjdCBiKVxyXG57XHJcbiAgICByZXR1cm4gQ29udmVydC5Ub1NpbmdsZShhKSAtIENvbnZlcnQuVG9TaW5nbGUoYik7XHJcbn1zdGF0aWMgb2JqZWN0IFN1YkRvdWJsZShvYmplY3QgYSwgb2JqZWN0IGIpXHJcbntcclxuICAgIHJldHVybiBDb252ZXJ0LlRvRG91YmxlKGEpIC0gQ29udmVydC5Ub0RvdWJsZShiKTtcclxufXN0YXRpYyBvYmplY3QgU3ViSW50MzIob2JqZWN0IGEsIG9iamVjdCBiKVxyXG57XHJcbiAgICByZXR1cm4gQ29udmVydC5Ub0ludDMyKGEpIC0gQ29udmVydC5Ub0ludDMyKGIpO1xyXG59XHJcbiAgICAgICAgc3RhdGljIHB1YmxpYyBEaWN0aW9uYXJ5PFR5cGUsIEZ1bmM8b2JqZWN0LCBvYmplY3QsIG9iamVjdD4+IE11bCA9IGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5DYWxsRm9yKG5ldyBEaWN0aW9uYXJ5PFR5cGUsIEZ1bmM8b2JqZWN0LCBvYmplY3QsIG9iamVjdD4+KCksKF9vNSk9PntfbzUuQWRkKHR5cGVvZihmbG9hdCksTXVsU2luZ2xlKTtfbzUuQWRkKHR5cGVvZihkb3VibGUpLE11bERvdWJsZSk7X281LkFkZCh0eXBlb2YoaW50KSxNdWxJbnQzMik7cmV0dXJuIF9vNTt9KTtcclxuc3RhdGljIG9iamVjdCBNdWxTaW5nbGUob2JqZWN0IGEsIG9iamVjdCBiKVxyXG57XHJcbiAgICByZXR1cm4gQ29udmVydC5Ub1NpbmdsZShhKSAqIENvbnZlcnQuVG9TaW5nbGUoYik7XHJcbn1zdGF0aWMgb2JqZWN0IE11bERvdWJsZShvYmplY3QgYSwgb2JqZWN0IGIpXHJcbntcclxuICAgIHJldHVybiBDb252ZXJ0LlRvRG91YmxlKGEpICogQ29udmVydC5Ub0RvdWJsZShiKTtcclxufXN0YXRpYyBvYmplY3QgTXVsSW50MzIob2JqZWN0IGEsIG9iamVjdCBiKVxyXG57XHJcbiAgICByZXR1cm4gQ29udmVydC5Ub0ludDMyKGEpICogQ29udmVydC5Ub0ludDMyKGIpO1xyXG59XHJcbiAgICAgICAgc3RhdGljIHB1YmxpYyBEaWN0aW9uYXJ5PFR5cGUsIEZ1bmM8b2JqZWN0LCBvYmplY3QsIG9iamVjdD4+IERpdiA9IGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5DYWxsRm9yKG5ldyBEaWN0aW9uYXJ5PFR5cGUsIEZ1bmM8b2JqZWN0LCBvYmplY3QsIG9iamVjdD4+KCksKF9vNik9PntfbzYuQWRkKHR5cGVvZihmbG9hdCksRGl2U2luZ2xlKTtfbzYuQWRkKHR5cGVvZihkb3VibGUpLERpdkRvdWJsZSk7X282LkFkZCh0eXBlb2YoaW50KSxEaXZJbnQzMik7cmV0dXJuIF9vNjt9KTtcclxuc3RhdGljIG9iamVjdCBEaXZTaW5nbGUob2JqZWN0IGEsIG9iamVjdCBiKVxyXG57XHJcbiAgICByZXR1cm4gQ29udmVydC5Ub1NpbmdsZShhKSAvIENvbnZlcnQuVG9TaW5nbGUoYik7XHJcbn1zdGF0aWMgb2JqZWN0IERpdkRvdWJsZShvYmplY3QgYSwgb2JqZWN0IGIpXHJcbntcclxuICAgIHJldHVybiBDb252ZXJ0LlRvRG91YmxlKGEpIC8gQ29udmVydC5Ub0RvdWJsZShiKTtcclxufXN0YXRpYyBvYmplY3QgRGl2SW50MzIob2JqZWN0IGEsIG9iamVjdCBiKVxyXG57XHJcbiAgICByZXR1cm4gQ29udmVydC5Ub0ludDMyKGEpIC8gQ29udmVydC5Ub0ludDMyKGIpO1xyXG59c3RhdGljIHB1YmxpYyBvYmplY3QgSW50RGl2KG9iamVjdCBhLCBvYmplY3QgYilcclxue1xyXG4gICAgcmV0dXJuIENvbnZlcnQuVG9JbnQzMihhKSAvIENvbnZlcnQuVG9JbnQzMihiKTtcclxufVxyXG4gICAgICAgIHN0YXRpYyBwdWJsaWMgRGljdGlvbmFyeTxUeXBlLCBGdW5jPG9iamVjdCwgb2JqZWN0LCBvYmplY3Q+PiBNb2QgPSBnbG9iYWw6OkJyaWRnZS5TY3JpcHQuQ2FsbEZvcihuZXcgRGljdGlvbmFyeTxUeXBlLCBGdW5jPG9iamVjdCwgb2JqZWN0LCBvYmplY3Q+PigpLChfbzcpPT57X283LkFkZCh0eXBlb2YoZmxvYXQpLE1vZFNpbmdsZSk7X283LkFkZCh0eXBlb2YoZG91YmxlKSxNb2REb3VibGUpO19vNy5BZGQodHlwZW9mKGludCksTW9kSW50MzIpO3JldHVybiBfbzc7fSk7XHJcbnN0YXRpYyBvYmplY3QgTW9kU2luZ2xlKG9iamVjdCBhLCBvYmplY3QgYilcclxue1xyXG4gICAgcmV0dXJuIENvbnZlcnQuVG9TaW5nbGUoYSkgJSBDb252ZXJ0LlRvU2luZ2xlKGIpO1xyXG59c3RhdGljIG9iamVjdCBNb2REb3VibGUob2JqZWN0IGEsIG9iamVjdCBiKVxyXG57XHJcbiAgICByZXR1cm4gQ29udmVydC5Ub0RvdWJsZShhKSAlIENvbnZlcnQuVG9Eb3VibGUoYik7XHJcbn1zdGF0aWMgb2JqZWN0IE1vZEludDMyKG9iamVjdCBhLCBvYmplY3QgYilcclxue1xyXG4gICAgcmV0dXJuIENvbnZlcnQuVG9JbnQzMihhKSAlIENvbnZlcnQuVG9JbnQzMihiKTtcclxufSAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcblxyXG5uYW1lc3BhY2UgRXhwcmVzc2lvblN0YWNrLlJ1c3RpY0V4cHJlc3Npb25cclxue1xyXG4gICAgY2xhc3MgUnVzdGljQ29udGV4dFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBSdXN0aWNFeHByIGV4cHJlc3Npb24geyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcbnB1YmxpYyBJUmVhZE9ubHlMaXN0PFJ1c3RpY1N0YWNrPiBzdGFja1xyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gZXhwcmVzc2lvbi5zdGFja3M7XHJcbiAgICB9XHJcbn0gICAgICAgIHB1YmxpYyBEaWN0aW9uYXJ5PHN0cmluZywgb2JqZWN0PiB2YXJpYWJsZXMgeyBnZXQ7IHNldDsgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xudXNpbmcgU3lzdGVtLkxpbnE7XG51c2luZyBTeXN0ZW0uVGV4dDtcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XG5cbm5hbWVzcGFjZSBFeHByZXNzaW9uU3RhY2suUnVzdGljRXhwcmVzc2lvblxue1xuICAgIGNsYXNzIFJ1c3RpY0V4cHJcbiAgICB7XG4gICAgICAgIHN0YXRpYyBib29sIFByZWZlclNpbXBsaWZpZWRFeHByZXNzaW9uID0gZmFsc2U7XG5zdGF0aWMgcHVibGljIGludCBHZXRWYXJpYWJsZUlEKHN0cmluZyBuYW1lKVxyXG57XHJcbiAgICByZXR1cm4gbmFtZS5HZXRIYXNoQ29kZSgpO1xyXG59XG4gICAgICAgIHB1YmxpYyByZWFkb25seSBMaXN0PFJ1c3RpY1N0YWNrPiBzdGFja3MgPSBuZXcgTGlzdDxSdXN0aWNTdGFjaz4oKTtcblxuICAgICAgICBSdXN0aWNDb250ZXh0IGNvbnRleHQ7XG5wdWJsaWMgUnVzdGljRXhwcigpXHJcbntcclxuICAgIFJlc2V0RXhwcmVzc2lvbigpO1xyXG59cHVibGljIFJ1c3RpY0V4cHIoc3RyaW5nIGV4cHJlc3Npb24pOiB0aGlzKClcclxue1xyXG4gICAgU2V0RXhwcmVzc2lvbihleHByZXNzaW9uKTtcclxufVxuICAgICAgICBwdWJsaWMgdm9pZCBSZXNldEV4cHJlc3Npb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc3RhY2tzLkNsZWFyKCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQgPSBuZXcgUnVzdGljQ29udGV4dCgpO1xyXG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdm9pZCBTZXRFeHByZXNzaW9uKHN0cmluZyBleHByZXNzaW9uKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKFByZWZlclNpbXBsaWZpZWRFeHByZXNzaW9uKVxyXG4gICAgICAgICAgICAgICAgbmV3IFJ1c3RpY0V4cHJCdWlsZGVyKHRoaXMsIGNvbnRleHQsIGV4cHJlc3Npb24pLkZpbmFsaXplQW5kU2ltcGxpZnkoKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgbmV3IFJ1c3RpY0V4cHJCdWlsZGVyKHRoaXMsIGNvbnRleHQsIGV4cHJlc3Npb24pLkZpbmFsaXplRXhwcmVzc2lvbigpO1xyXG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgb2JqZWN0IEV4ZWN1dGUoKVxuICAgICAgICB7XG4gICAgICAgICAgICBmb3IgKGludCByID0gc3RhY2tzLkNvdW50IC0gMTsgciA+PSAwOyByLS0pXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhY2tzW3JdLkV4ZWN1dGUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHN0YWNrc1swXS5SZXN1bHRWYWx1ZTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG5cclxubmFtZXNwYWNlIEV4cHJlc3Npb25TdGFjay5SdXN0aWNFeHByZXNzaW9uXHJcbntcclxuICAgIGNsYXNzIFJ1c3RpY0V4cHJCdWlsZGVyXHJcbiAgICB7XHJcbiAgICAgICAgcHJvdGVjdGVkIFJ1c3RpY0V4cHIgZXhwcmVzc2lvbjtcclxuICAgICAgICBwcm90ZWN0ZWQgUnVzdGljQ29udGV4dCBjb250ZXh0O1xyXG4gICAgICAgIHByb3RlY3RlZCBSdXN0aWNPcGVyYXRpb24gbmV4dE9wZXJhdGlvbjtcclxuICAgICAgICBwcm90ZWN0ZWQgUnVzdGljU3RhY2sgY3VycmVudFN0YWNrO1xyXG4gICAgICAgIHByb3RlY3RlZCBpbnQgcHJpb3JpdHlPZmZzZXQ7XHJcbnByb3RlY3RlZCBMaXN0PFJ1c3RpY1N0YWNrPiBzdGFja3Ncclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIGV4cHJlc3Npb24hPW51bGw/ZXhwcmVzc2lvbi5zdGFja3M6KExpc3Q8UnVzdGljU3RhY2s+KW51bGw7XHJcbiAgICB9XHJcbn1cclxuICAgICAgICBwcm90ZWN0ZWQgUnVzdGljRXhwckJ1aWxkZXIoKSA6IHRoaXMobnVsbCwgbnVsbCkgeyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBSdXN0aWNFeHByQnVpbGRlcihSdXN0aWNFeHByIGV4cHJlc3Npb24sIFJ1c3RpY0NvbnRleHQgY29udGV4dClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICgoZXhwcmVzc2lvbiE9bnVsbD9leHByZXNzaW9uLnN0YWNrcy5Db3VudDooaW50PyludWxsKSA+IDApXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiUnVzdGljRXhwciBpbnN0YW5jZSB3YXMgYWxyZWFkeSBidWlsdCBhbmQgc2hvdWxkIG5vdCBiZSBidWlsdCBhZ2Fpbi4gRGlkIHlvdSBpbnRlbmQgdG8gUmVzZXRFeHByZXNzaW9uP1wiKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZXhwcmVzc2lvbiA9IGV4cHJlc3Npb247XHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XHJcbiAgICAgICAgICAgIG5leHRPcGVyYXRpb24gPSBuZXcgT3BlcmF0aW9ucy5TZXQoKTtcclxuICAgICAgICAgICAgcHJpb3JpdHlPZmZzZXQgPSAwO1xyXG4gICAgICAgICAgICBnbG9iYWw6OkJyaWRnZS5TY3JpcHQuVG9UZW1wKFwia2V5MVwiLHN0YWNrcykhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9Pmdsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tVGVtcDxMaXN0PFJ1c3RpY1N0YWNrPj4oXCJrZXkxXCIpLkFkZChuZXcgUnVzdGljU3RhY2soMCwgbnVsbCwgMSkpKTpudWxsO1xyXG4gICAgICAgICAgICBjdXJyZW50U3RhY2sgPSBnbG9iYWw6OkJyaWRnZS5TY3JpcHQuVG9UZW1wKFwia2V5MlwiLHN0YWNrcykhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21UZW1wPExpc3Q8UnVzdGljU3RhY2s+PihcImtleTJcIilbMF06KFJ1c3RpY1N0YWNrKW51bGw7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgUnVzdGljRXhwckJ1aWxkZXIoUnVzdGljRXhwciBleHByZXNzaW9uLCBSdXN0aWNDb250ZXh0IGNvbnRleHQsIHN0cmluZyBleHByZXNzaW9uTGluZSk6IHRoaXMoZXhwcmVzc2lvbiwgY29udGV4dClcclxue1xyXG4gICAgUGFyc2VBbmRQdXRUb2tlbnMoZXhwcmVzc2lvbkxpbmUpO1xyXG59cHVibGljIFJ1c3RpY0V4cHJCdWlsZGVyKFJ1c3RpY0V4cHIgZXhwcmVzc2lvbiwgUnVzdGljQ29udGV4dCBjb250ZXh0LCBSdXN0aWNUb2tlbltdIHRva2VuTGlzdCk6IHRoaXMoZXhwcmVzc2lvbiwgY29udGV4dClcclxue1xyXG4gICAgUHV0VG9rZW5zKHRva2VuTGlzdCk7XHJcbn1cclxuICAgICAgICBwdWJsaWMgdm9pZCBQYXJzZUFuZFB1dFRva2VucyhzdHJpbmcgZXhwcmVzc2lvbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFJ1c3RpY1BhcnNlciBwYXJzZXIgPSBuZXcgUnVzdGljUGFyc2VyKGNvbnRleHQpO1xyXG4gICAgICAgICAgICBQdXRUb2tlbnMoRW51bWVyYWJsZS5Ub0FycmF5PFJ1c3RpY1Rva2VuPihwYXJzZXIuR2V0VG9rZW5MaXN0KGV4cHJlc3Npb24pKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBQdXRUb2tlbnMocGFyYW1zIFJ1c3RpY1Rva2VuW10gdG9rZW5zKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9yZWFjaCAodmFyIHRva2VuIGluIHRva2VucylcclxuICAgICAgICAgICAgICAgIFB1dFRva2VuKHRva2VuKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFB1dFRva2VuKFJ1c3RpY1Rva2VuIHRva2VuKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc3dpdGNoICh0b2tlbi5tb2RlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFJ1c3RpY1Rva2VuTW9kZS5MaXRlcmFsOiBQdXRWYWx1ZVRva2VuKHRva2VuLnZhbHVlKTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFJ1c3RpY1Rva2VuTW9kZS5WYXJpYWJsZU5hbWU6IFB1dFZhcmlhYmxlVG9rZW4odG9rZW4udmFsdWUuVG9TdHJpbmcoKSk7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBSdXN0aWNUb2tlbk1vZGUuT3BlcmF0aW9uOiBQdXRPcGVyYXRpb25Ub2tlbigoUnVzdGljT3BlcmF0aW9uKXRva2VuLnZhbHVlKTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFJ1c3RpY1Rva2VuTW9kZS5Qcmlvcml0eU9mZnNldDogQ2hhbmdlUHJpb3JpdHkoKGludCl0b2tlbi52YWx1ZSk7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogdGhyb3cgbmV3IE5vdEltcGxlbWVudGVkRXhjZXB0aW9uKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBQdXRDdXN0b21WYWx1ZVRva2VuKFJ1c3RpY1ZhbHVlRXZhbHVhdG9yIHZhbHVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKG5leHRPcGVyYXRpb24gPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oc3RyaW5nLkZvcm1hdChcIkV4cGVjdGluZyBvcGVyYXRvciwgYnV0IHJlY2VpdmVkIG9wZXJhbmQgKHswfSlcIix2YWx1ZS5HZXRUeXBlKCkuTmFtZSkpO1xyXG4gICAgICAgICAgICBuZXh0T3BlcmF0aW9uLnBhcmFtZXRlciA9IHZhbHVlO1xyXG4gICAgICAgICAgICBjdXJyZW50U3RhY2sub3BlcmF0aW9ucy5BZGQobmV4dE9wZXJhdGlvbik7XHJcbiAgICAgICAgICAgIG5leHRPcGVyYXRpb24gPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIFB1dFZhbHVlVG9rZW4ob2JqZWN0IHZhbHVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgUHV0Q3VzdG9tVmFsdWVUb2tlbihuZXcgRXZhbHVhdG9ycy5MaXRlcmFsKHZhbHVlKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgUHV0VmFyaWFibGVUb2tlbihzdHJpbmcgdmFyaWFibGVOYW1lKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgUHV0Q3VzdG9tVmFsdWVUb2tlbihuZXcgRXZhbHVhdG9ycy5WYXJpYWJsZShjb250ZXh0LCB2YXJpYWJsZU5hbWUpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBDaGFuZ2VQcmlvcml0eShpbnQgYWRkaXRpb24pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwcmlvcml0eU9mZnNldCArPSBhZGRpdGlvbjtcclxuICAgICAgICAgICAgaWYgKGFkZGl0aW9uID4gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUnVzdGljU3RhY2sgbmV3U3RhY2sgPSBuZXcgUnVzdGljU3RhY2soc3RhY2tzLkNvdW50LCBjdXJyZW50U3RhY2ssIHByaW9yaXR5T2Zmc2V0ICsgUnVzdGljT3BlcmF0aW9uLkZpcnN0UHJpb3JpdHkpO1xyXG4gICAgICAgICAgICAgICAgbmV4dE9wZXJhdGlvbi5wYXJhbWV0ZXIgPSBuZXcgRXZhbHVhdG9ycy5TdGFja1JlZmVyZW5jZShuZXdTdGFjayk7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50U3RhY2sub3BlcmF0aW9ucy5BZGQobmV4dE9wZXJhdGlvbik7XHJcbiAgICAgICAgICAgICAgICBpbnQgaW5kZXggPSBzdGFja3MuSW5kZXhPZihjdXJyZW50U3RhY2spO1xyXG4gICAgICAgICAgICAgICAgc3RhY2tzLkluc2VydChpbmRleCArIDEsIG5ld1N0YWNrKTtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRTdGFjayA9IG5ld1N0YWNrO1xyXG4gICAgICAgICAgICAgICAgbmV4dE9wZXJhdGlvbiA9IG5ldyBPcGVyYXRpb25zLlNldCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgUHV0T3BlcmF0aW9uVG9rZW4oUnVzdGljT3BlcmF0aW9uIG9wZXJhdGlvbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChuZXh0T3BlcmF0aW9uICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChvcGVyYXRpb24uSXNMZWZ0VW5hcnkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgUHV0TGVmdE9wZXJhdGlvblRva2VuKG9wZXJhdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJVbmV4cGVjdGVkIG9wZXJhdG9yIGZvdW5kXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBvcGVyYXRpb24ucHJpb3JpdHlPZmZzZXQgPSBwcmlvcml0eU9mZnNldDtcclxuICAgICAgICAgICAgaWYgKG9wZXJhdGlvbi5HZXRQcmlvcml0eVdpdGhPZmZzZXQoKSA8PSAoaW50KVJ1c3RpY09wZXJhdGlvbi5Qcmlvcml0eS5JZ25vcmVkKVxyXG4gICAgICAgICAgICAgICAgUHV0T3BlcmF0aW9uT2ZFcXVhbE9ySWdub3JlZFByaW9yaXR5KG9wZXJhdGlvbik7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgaWYgKChvcGVyYXRpb24uSGFzUmlnaHRUb0xlZnRQcmVjZWRlbmNlKCkgJiYgY3VycmVudFN0YWNrLnByaW9yaXR5IDw9IG9wZXJhdGlvbi5HZXRQcmlvcml0eVdpdGhPZmZzZXQoKSkgfHwgY3VycmVudFN0YWNrLnByaW9yaXR5IDwgb3BlcmF0aW9uLkdldFByaW9yaXR5V2l0aE9mZnNldCgpKSAvLyBUTy1ETzogQWx0ZXJhciBwYXJhIGluc2VyaXIgb3BlcmFkb3JlcyBSVExcclxuICAgICAgICAgICAgICAgIFB1dE9wZXJhdGlvbk9mSGlnaGVyUHJpb3JpdHkob3BlcmF0aW9uKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBpZiAoY3VycmVudFN0YWNrLnByaW9yaXR5ID4gb3BlcmF0aW9uLkdldFByaW9yaXR5V2l0aE9mZnNldCgpKVxyXG4gICAgICAgICAgICAgICAgUHV0T3BlcmF0aW9uT2ZMb3dlclByaW9yaXR5KG9wZXJhdGlvbik7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIFB1dE9wZXJhdGlvbk9mRXF1YWxPcklnbm9yZWRQcmlvcml0eShvcGVyYXRpb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIFB1dExlZnRPcGVyYXRpb25Ub2tlbihSdXN0aWNPcGVyYXRpb24gb3BlcmF0aW9uKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRTdGFjay5wcmlvcml0eSA9PSBvcGVyYXRpb24uR2V0UHJpb3JpdHlXaXRoT2Zmc2V0KCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRTdGFjay5vcGVyYXRpb25zLkFkZChvcGVyYXRpb24pO1xyXG4gICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUnVzdGljU3RhY2sgbmV3U3RhY2sgPSBuZXcgUnVzdGljU3RhY2soc3RhY2tzLkNvdW50LCBjdXJyZW50U3RhY2ssIG9wZXJhdGlvbi5HZXRQcmlvcml0eVdpdGhPZmZzZXQoKSk7XHJcbiAgICAgICAgICAgICAgICBuZXdTdGFjay5vcGVyYXRpb25zLkFkZChvcGVyYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgaW50IGluZGV4ID0gc3RhY2tzLkluZGV4T2YoY3VycmVudFN0YWNrKTtcclxuICAgICAgICAgICAgICAgIHN0YWNrcy5JbnNlcnQoaW5kZXggKyAxLCBuZXdTdGFjayk7XHJcblxyXG4gICAgICAgICAgICAgICAgUHV0Q3VzdG9tVmFsdWVUb2tlbihuZXcgRXZhbHVhdG9ycy5TdGFja1JlZmVyZW5jZShuZXdTdGFjaykpO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudFN0YWNrID0gbmV3U3RhY2s7XHJcbiAgICAgICAgICAgICAgICBuZXh0T3BlcmF0aW9uID0gbmV3IE9wZXJhdGlvbnMuU2V0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBQdXRPcGVyYXRpb25PZkhpZ2hlclByaW9yaXR5KFJ1c3RpY09wZXJhdGlvbiBvcGVyYXRpb24pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuZXh0T3BlcmF0aW9uID0gb3BlcmF0aW9uO1xyXG4gICAgICAgICAgICBSdXN0aWNPcGVyYXRpb24gbGFzdE9wZXJhdGlvbkZyb21TdGFjayA9IGN1cnJlbnRTdGFjay5vcGVyYXRpb25zW2N1cnJlbnRTdGFjay5vcGVyYXRpb25zLkNvdW50IC0gMV07XHJcbiAgICAgICAgICAgIFJ1c3RpY1ZhbHVlRXZhbHVhdG9yIGxhc3RPcGVyYXRpb25WYWx1ZSA9IGxhc3RPcGVyYXRpb25Gcm9tU3RhY2sucGFyYW1ldGVyO1xyXG4gICAgICAgICAgICBSdXN0aWNTdGFjayBuZXdTdGFjayA9IG5ldyBSdXN0aWNTdGFjayhzdGFja3MuQ291bnQsIGN1cnJlbnRTdGFjaywgb3BlcmF0aW9uLkdldFByaW9yaXR5V2l0aE9mZnNldCgpKTtcclxuICAgICAgICAgICAgbGFzdE9wZXJhdGlvbkZyb21TdGFjay5wYXJhbWV0ZXIgPSBuZXcgRXZhbHVhdG9ycy5TdGFja1JlZmVyZW5jZShuZXdTdGFjayk7XHJcbiAgICAgICAgICAgIFJ1c3RpY09wZXJhdGlvbiBuZXdTZXRPcGVyYXRpb24gPSBuZXcgT3BlcmF0aW9ucy5TZXQoKTtcclxuICAgICAgICAgICAgbmV3U2V0T3BlcmF0aW9uLnBhcmFtZXRlciA9IGxhc3RPcGVyYXRpb25WYWx1ZTtcclxuICAgICAgICAgICAgbmV3U3RhY2sub3BlcmF0aW9ucy5BZGQobmV3U2V0T3BlcmF0aW9uKTtcclxuICAgICAgICAgICAgaW50IGluZGV4ID0gc3RhY2tzLkluZGV4T2YoY3VycmVudFN0YWNrKTtcclxuICAgICAgICAgICAgc3RhY2tzLkluc2VydChpbmRleCArIDEsIG5ld1N0YWNrKTtcclxuICAgICAgICAgICAgY3VycmVudFN0YWNrID0gbmV3U3RhY2s7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgUHV0T3BlcmF0aW9uT2ZMb3dlclByaW9yaXR5KFJ1c3RpY09wZXJhdGlvbiBvcGVyYXRpb24pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuZXh0T3BlcmF0aW9uID0gb3BlcmF0aW9uO1xyXG4gICAgICAgICAgICB3aGlsZSAoY3VycmVudFN0YWNrLnByaW9yaXR5ID4gb3BlcmF0aW9uLkdldFByaW9yaXR5V2l0aE9mZnNldCgpKVxyXG4gICAgICAgICAgICAgICAgY3VycmVudFN0YWNrID0gY3VycmVudFN0YWNrLnBhcmVudDtcclxuXHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50U3RhY2sucHJpb3JpdHkgPCBvcGVyYXRpb24uR2V0UHJpb3JpdHlXaXRoT2Zmc2V0KCkpXHJcbiAgICAgICAgICAgICAgICBQdXRPcGVyYXRpb25PZkhpZ2hlclByaW9yaXR5KG9wZXJhdGlvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgUHV0T3BlcmF0aW9uT2ZFcXVhbE9ySWdub3JlZFByaW9yaXR5KFJ1c3RpY09wZXJhdGlvbiBvcGVyYXRpb24pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuZXh0T3BlcmF0aW9uID0gb3BlcmF0aW9uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgRmluYWxpemVFeHByZXNzaW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGludCBpbmRleCA9IDA7XHJcblxyXG4gICAgICAgICAgICBmb3JlYWNoIChSdXN0aWNTdGFjayBzdGFjayBpbiBzdGFja3MpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHN0YWNrLmRpc3BsYXlJZCA9IGluZGV4Kys7XHJcbiAgICAgICAgICAgICAgICBzdGFjay5QcmVwYXJlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFNpbXBsaWZ5RXhwcmVzc2lvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBIYXNoU2V0PFJ1c3RpY1N0YWNrPiBkaXNjYXJkID0gbnVsbDtcclxuICAgICAgICAgICAgZm9yZWFjaCAoUnVzdGljU3RhY2sgc3RhY2sgaW4gc3RhY2tzKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmb3JlYWNoIChSdXN0aWNPcGVyYXRpb24gb3BlcmF0aW9uIGluIHN0YWNrLm9wZXJhdGlvbnMpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgRXZhbHVhdG9ycy5TdGFja1JlZmVyZW5jZSByZWZlcmVuY2UgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIGJvb2wgaGFzUmVmUGFyYW0gPSBvcGVyYXRpb24ucGFyYW1ldGVyICE9IG51bGwgJiYgKHJlZmVyZW5jZSA9IG9wZXJhdGlvbi5wYXJhbWV0ZXIgYXMgRXZhbHVhdG9ycy5TdGFja1JlZmVyZW5jZSkgIT0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBib29sIGNhbkJlU2ltcGxpZmllZCA9IGhhc1JlZlBhcmFtICYmIHJlZmVyZW5jZS5zdGFjay5DYW5CZVNpbXBsaWZpZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhbkJlU2ltcGxpZmllZClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5wYXJhbWV0ZXIgPSByZWZlcmVuY2Uuc3RhY2sub3BlcmF0aW9uc1swXS5wYXJhbWV0ZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc2NhcmQgPSBkaXNjYXJkID8/IG5ldyBIYXNoU2V0PFJ1c3RpY1N0YWNrPigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNjYXJkLkFkZChyZWZlcmVuY2Uuc3RhY2spO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGRpc2NhcmQgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgIGZvcmVhY2ggKFJ1c3RpY1N0YWNrIGl0ZW0gaW4gZGlzY2FyZClcclxuICAgICAgICAgICAgICAgICAgICBzdGFja3MuUmVtb3ZlKGl0ZW0pO1xyXG5cclxuICAgICAgICAgICAgLy8gU2ltcGxpZnkgdGhlIHN0YWNrIHJlZ2lzdGVyIFIwXHJcbiAgICAgICAgICAgIGlmIChzdGFja3MuQ291bnQgPiAwICYmIHN0YWNrc1swXS5vcGVyYXRpb25zLkNvdW50ID09IDEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJ1c3RpY09wZXJhdGlvbiBzZXQ7XHJcbiAgICAgICAgICAgICAgICBpZiAoKHNldCA9IHN0YWNrc1swXS5vcGVyYXRpb25zWzBdIGFzIE9wZXJhdGlvbnMuU2V0KSAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YWNrc1swXS5vcGVyYXRpb25zLkNsZWFyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgUnVzdGljU3RhY2sgc3RhY2sgPSAoKEV2YWx1YXRvcnMuU3RhY2tSZWZlcmVuY2Upc2V0LnBhcmFtZXRlcikuc3RhY2s7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhY2tzWzBdLm9wZXJhdGlvbnMuQWRkUmFuZ2Uoc3RhY2sub3BlcmF0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhY2tzWzBdLnByaW9yaXR5ID0gc3RhY2sucHJpb3JpdHk7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhY2tzLlJlbW92ZShzdGFjayk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgRmluYWxpemVFeHByZXNzaW9uKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBGaW5hbGl6ZUFuZFNpbXBsaWZ5KClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEZpbmFsaXplRXhwcmVzc2lvbigpO1xyXG4gICAgICAgICAgICBTaW1wbGlmeUV4cHJlc3Npb24oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXRpYyBwdWJsaWMgdm9pZCBTaW1wbGlmeUV4cHJlc3Npb24oUnVzdGljRXhwciBleHByZXNzaW9uKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgUnVzdGljRXhwckJ1aWxkZXIgYnVpbGRlciA9IG5ldyBSdXN0aWNFeHByQnVpbGRlcigpO1xyXG4gICAgICAgICAgICBidWlsZGVyLmV4cHJlc3Npb24gPSBleHByZXNzaW9uO1xyXG4gICAgICAgICAgICBidWlsZGVyLlNpbXBsaWZ5RXhwcmVzc2lvbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uVGV4dC5SZWd1bGFyRXhwcmVzc2lvbnM7XHJcblxyXG5uYW1lc3BhY2UgRXhwcmVzc2lvblN0YWNrLlJ1c3RpY0V4cHJlc3Npb25cclxue1xyXG4gICAgY2xhc3MgUnVzdGljUGFyc2VyXHJcbiAgICB7XHJcbiAgICAgICAgLy8gUHJpb3JpdHlHcm91cFxyXG4gICAgICAgIHJlYWRvbmx5IHB1YmxpYyBMaXN0PEdlbmVyaWNDYXB0dXJlPiBPcGVuR3JvdXBQYXR0ZXJuID0gZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IExpc3Q8R2VuZXJpY0NhcHR1cmU+KCksKF9vMSk9PntfbzEuQWRkKG5ldyBHZW5lcmljQ2FwdHVyZShcIlsoXVwiLCBSdXN0aWNUb2tlbk1vZGUuUHJpb3JpdHlPZmZzZXQsIChwLHMpID0+ICsxMDApKTtyZXR1cm4gX28xO30pO1xyXG5cclxuICAgICAgICByZWFkb25seSBwdWJsaWMgTGlzdDxHZW5lcmljQ2FwdHVyZT4gQ2xvc2VHcm91cFBhdHRlcm4gPSBnbG9iYWw6OkJyaWRnZS5TY3JpcHQuQ2FsbEZvcihuZXcgTGlzdDxHZW5lcmljQ2FwdHVyZT4oKSwoX28yKT0+e19vMi5BZGQobmV3IEdlbmVyaWNDYXB0dXJlKFwiWyldXCIsIFJ1c3RpY1Rva2VuTW9kZS5Qcmlvcml0eU9mZnNldCwgKHAscykgPT4gLTEwMCkpO3JldHVybiBfbzI7fSk7XHJcblxyXG4gICAgICAgIC8vIE1pZGRsZU9wZXJhdG9yc1xyXG4gICAgICAgIHJlYWRvbmx5IHB1YmxpYyBMaXN0PE9wZXJhdGlvbkNhcHR1cmU+IE1pZGRsZU9wZXJhdG9ycyA9IGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5DYWxsRm9yKG5ldyBMaXN0PE9wZXJhdGlvbkNhcHR1cmU+KCksKF9vMyk9PntfbzMuQWRkKG5ldyBPcGVyYXRpb25DYXB0dXJlKFwiWypdWypdXCIsIG5ldyBPcGVyYXRpb25zLlBvdygpKSk7X28zLkFkZChuZXcgT3BlcmF0aW9uQ2FwdHVyZShcIlsrXVwiLCBuZXcgT3BlcmF0aW9ucy5BZGQoKSkpO19vMy5BZGQobmV3IE9wZXJhdGlvbkNhcHR1cmUoXCJbLV1cIiwgbmV3IE9wZXJhdGlvbnMuU3ViKCkpKTtfbzMuQWRkKG5ldyBPcGVyYXRpb25DYXB0dXJlKFwiWypdXCIsIG5ldyBPcGVyYXRpb25zLk11bCgpKSk7X28zLkFkZChuZXcgT3BlcmF0aW9uQ2FwdHVyZShcIlsvXVwiLCBuZXcgT3BlcmF0aW9ucy5EaXYoKSkpO3JldHVybiBfbzM7fSk7XHJcblxyXG4gICAgICAgIC8vIExlZnRPcGVyYXRvcnNcclxuICAgICAgICByZWFkb25seSBwdWJsaWMgTGlzdDxPcGVyYXRpb25DYXB0dXJlPiBMZWZ0T3BlcmF0b3JzID0gZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IExpc3Q8T3BlcmF0aW9uQ2FwdHVyZT4oKSwoX280KT0+e19vNC5BZGQobmV3IE9wZXJhdGlvbkNhcHR1cmUoXCJbK10oPyFbLjAtOV0pXCIsIG5ldyBPcGVyYXRpb25zLlByZWZpeFVuYXJ5LlBvc2l0aXZlKCkpKTtfbzQuQWRkKG5ldyBPcGVyYXRpb25DYXB0dXJlKFwiWy1dKD8hWy4wLTldKVwiLCBuZXcgT3BlcmF0aW9ucy5QcmVmaXhVbmFyeS5OZWdhdGl2ZSgpKSk7cmV0dXJuIF9vNDt9KTtcclxuXHJcbiAgICAgICAgLy8gVmFsdWVQYXR0ZXJuXHJcbiAgICAgICAgcmVhZG9ubHkgcHVibGljIExpc3Q8R2VuZXJpY0NhcHR1cmU+IFZhbHVlUGF0dGVybiA9IGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5DYWxsRm9yKG5ldyBMaXN0PEdlbmVyaWNDYXB0dXJlPigpLChfbzUpPT57X281LkFkZChuZXcgR2VuZXJpY0NhcHR1cmUoQFwiWy0rXT9bMC05XStbWHglXT8oPyFbLl1cXGR8XFx3KVwiLCBSdXN0aWNUb2tlbk1vZGUuTGl0ZXJhbCwgKHBhcnNlciwgdmFsdWUpID0+IFN0cmluZ1RvSW50MzIodmFsdWUsICdYJywgJ3gnLCAnJScpKSk7X281LkFkZChuZXcgR2VuZXJpY0NhcHR1cmUoQFwiWy0rXT9bMC05XSsoPzpbLl1bMC05XSspPyg/OltFZV1bLStdP1swLTldKyk/W0ZmWHglXSg/IVxcdylcIiwgUnVzdGljVG9rZW5Nb2RlLkxpdGVyYWwsIChwYXJzZXIsIHZhbHVlKSA9PiBTdHJpbmdUb0Zsb2F0KHZhbHVlLCAnRicsICdmJywgJ1gnLCAneCcsICclJykpKTtfbzUuQWRkKG5ldyBHZW5lcmljQ2FwdHVyZShAXCJbLStdP1swLTldKlsuXVswLTldKyg/OltFZV1bLStdP1swLTldKyk/W0ZmWHglXSg/IVxcdylcIiwgUnVzdGljVG9rZW5Nb2RlLkxpdGVyYWwsIChwYXJzZXIsIHZhbHVlKSA9PiBTdHJpbmdUb0Zsb2F0KHZhbHVlLCAnRicsICdmJywgJ1gnLCAneCcsICclJykpKTtfbzUuQWRkKG5ldyBHZW5lcmljQ2FwdHVyZShAXCJbLStdP1swLTldKyg/OlsuXVswLTldKyk/KD86W0VlXVstK10/WzAtOV0rKT9bRGRdPyg/IVxcdylcIiwgUnVzdGljVG9rZW5Nb2RlLkxpdGVyYWwsIChwYXJzZXIsIHZhbHVlKSA9PiBTdHJpbmdUb0RvdWJsZSh2YWx1ZSwgJ0QnLCAnZCcpKSk7X281LkFkZChuZXcgR2VuZXJpY0NhcHR1cmUoQFwiWy0rXT9bMC05XSpbLl1bMC05XSsoPzpbRWVdWy0rXT9bMC05XSspP1tEZF0/KD8hXFx3KVwiLCBSdXN0aWNUb2tlbk1vZGUuTGl0ZXJhbCwgKHBhcnNlciwgdmFsdWUpID0+IFN0cmluZ1RvRG91YmxlKHZhbHVlLCAnRCcsICdkJykpKTtfbzUuQWRkKG5ldyBHZW5lcmljQ2FwdHVyZShAXCJbQS1aYS16X11cXHcqXCIsIFJ1c3RpY1Rva2VuTW9kZS5WYXJpYWJsZU5hbWUsIChwYXJzZXIsIHZhbHVlKSA9PiBuZXcgRXZhbHVhdG9ycy5WYXJpYWJsZShwYXJzZXIuY29udGV4dCwgdmFsdWUpKSk7cmV0dXJuIF9vNTt9KTtcclxuXHJcbiAgICAgICAgcmVhZG9ubHkgcHVibGljIExpc3Q8c3RyaW5nPiBJZ25vcmVkUGF0dGVybiA9IGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5DYWxsRm9yKG5ldyBMaXN0PHN0cmluZz4oKSwoX282KT0+e19vNi5BZGQoQFwiXFxzK1wiKTtyZXR1cm4gX282O30pO1xyXG5cclxuICAgICAgICBib29sIGluaXRpYWxpemVkID0gZmFsc2U7XHJcbiAgICAgICAgUnVzdGljQ29udGV4dCBjb250ZXh0O1xyXG4gICAgICAgIFJlZ2V4IHZhbHVlRXhwcjtcclxuICAgICAgICBSZWdleCBsZWZ0T3BFeHByO1xyXG4gICAgICAgIFJlZ2V4IG1pZE9wRXhwcjtcclxuICAgICAgICBSZWdleCBpZ25vcmVkRXhwcjtcclxuICAgICAgICBSZWdleCBvcGVuR3JvdXBFeHByO1xyXG4gICAgICAgIFJlZ2V4IGNsb3NlR3JvdXBFeHByO1xyXG4gICAgICAgIFJlZ2V4IHVuZXhwZWN0ZWRUb2tlbkV4cHIgPSBuZXcgUmVnZXgoQFwiXFxzKihbLSQuXFx3XSt8W15cXHdcXHNdKVwiKTtcclxuXHJcbiAgICAgICAgU3RhY2s8UGFyc2luZ1N0YXRlPiBjdXJyZW50U3RhdGUgPSBuZXcgU3RhY2s8UGFyc2luZ1N0YXRlPigpO1xyXG5cclxuICAgICAgICBwdWJsaWMgUnVzdGljUGFyc2VyKFJ1c3RpY0NvbnRleHQgY29udGV4dClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBJbml0aWFsaXplKClcclxuICAgICAgICB7XHJcbiNpZiBCUklER0VfTkVUXHJcbiAgICAgICAgICAgIFJlZ2V4T3B0aW9ucyBvcHRpb25zID0gUmVnZXhPcHRpb25zLk5vbmU7XHJcbiNlbHNlXHJcbiAgICAgICAgICAgIFJlZ2V4T3B0aW9ucyBvcHRpb25zID0gUmVnZXhPcHRpb25zLkNvbXBpbGVkO1xyXG4jZW5kaWZcclxuICAgICAgICAgICAgdmFsdWVFeHByID0gbmV3IFJlZ2V4KHN0cmluZy5Gb3JtYXQoXCIoezB9KVwiLHN0cmluZy5Kb2luKFwiKXwoXCIsIFZhbHVlUGF0dGVybi5Db252ZXJ0QWxsPHN0cmluZz4oKENvbnZlcnRlcjxSdXN0aWNQYXJzZXIuR2VuZXJpY0NhcHR1cmUsc3RyaW5nPikodiA9PiB2LnBhdHRlcm4pKSkgKSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIGxlZnRPcEV4cHIgPSBuZXcgUmVnZXgoc3RyaW5nLkZvcm1hdChcIih7MH0pXCIsc3RyaW5nLkpvaW4oXCIpfChcIiwgTGVmdE9wZXJhdG9ycy5Db252ZXJ0QWxsPHN0cmluZz4oKENvbnZlcnRlcjxSdXN0aWNQYXJzZXIuT3BlcmF0aW9uQ2FwdHVyZSxzdHJpbmc+KSh2ID0+IHYucGF0dGVybikpKSApLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgbWlkT3BFeHByID0gbmV3IFJlZ2V4KHN0cmluZy5Gb3JtYXQoXCIoezB9KVwiLHN0cmluZy5Kb2luKFwiKXwoXCIsIE1pZGRsZU9wZXJhdG9ycy5Db252ZXJ0QWxsPHN0cmluZz4oKENvbnZlcnRlcjxSdXN0aWNQYXJzZXIuT3BlcmF0aW9uQ2FwdHVyZSxzdHJpbmc+KSh2ID0+IHYucGF0dGVybikpKSApLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgb3Blbkdyb3VwRXhwciA9IG5ldyBSZWdleChzdHJpbmcuRm9ybWF0KFwiKHswfSlcIixzdHJpbmcuSm9pbihcIil8KFwiLCBPcGVuR3JvdXBQYXR0ZXJuLkNvbnZlcnRBbGw8c3RyaW5nPigoQ29udmVydGVyPFJ1c3RpY1BhcnNlci5HZW5lcmljQ2FwdHVyZSxzdHJpbmc+KSh2ID0+IHYucGF0dGVybikpKSksIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICBjbG9zZUdyb3VwRXhwciA9IG5ldyBSZWdleChzdHJpbmcuRm9ybWF0KFwiKHswfSlcIixzdHJpbmcuSm9pbihcIil8KFwiLCBDbG9zZUdyb3VwUGF0dGVybi5Db252ZXJ0QWxsPHN0cmluZz4oKENvbnZlcnRlcjxSdXN0aWNQYXJzZXIuR2VuZXJpY0NhcHR1cmUsc3RyaW5nPikodiA9PiB2LnBhdHRlcm4pKSkpLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgaWdub3JlZEV4cHIgPSBuZXcgUmVnZXgoc3RyaW5nLkZvcm1hdChcIih7MH0pXCIsc3RyaW5nLkpvaW4oXCIpfChcIiwgSWdub3JlZFBhdHRlcm4pKSwgb3B0aW9ucyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgSUVudW1lcmFibGU8UnVzdGljVG9rZW4+IEdldFRva2VuTGlzdChzdHJpbmcgZXhwcmVzc2lvbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChpbml0aWFsaXplZCA9PSBmYWxzZSlcclxuICAgICAgICAgICAgICAgIEluaXRpYWxpemUoKTtcclxuXHJcbiAgICAgICAgICAgIGludCBpbmRleCA9IDA7XHJcbiAgICAgICAgICAgIGV4cHJlc3Npb24uVHJpbSgpO1xyXG4gICAgICAgICAgICBjdXJyZW50U3RhdGUuQ2xlYXIoKTtcclxuICAgICAgICAgICAgY3VycmVudFN0YXRlLlB1c2goUGFyc2luZ1N0YXRlLlZhbHVlT3JMZWZ0T3BlcmF0b3JPckVuZCk7XHJcblxyXG4gICAgICAgICAgICB3aGlsZShjdXJyZW50U3RhdGUuQ291bnQgPiAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUcnlDYXB0dXJlSWdub3JlZFBhdHRlcm4oZXhwcmVzc2lvbiwgcmVmIGluZGV4KTtcclxuXHJcbiAgICAgICAgICAgICAgICBSdXN0aWNUb2tlbiByZXN1bHQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChjdXJyZW50U3RhdGUuUG9wKCkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBQYXJzaW5nU3RhdGUuVmFsdWVPckxlZnRPcGVyYXRvck9yRW5kOiByZXN1bHQgPSBUcnlDYXB0dXJlVmFsdWVPckxlZnRPcGVyYXRvcihleHByZXNzaW9uLCByZWYgaW5kZXgpOyBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFBhcnNpbmdTdGF0ZS5WYWx1ZU9yTGVmdE9wZXJhdG9yRXhwZWN0ZWQ6IHJlc3VsdCA9IENhcHR1cmVWYWx1ZU9yTGVmdE9wZXJhdG9yKGV4cHJlc3Npb24sIHJlZiBpbmRleCk7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgUGFyc2luZ1N0YXRlLk1pZGRsZU9wZXJhdG9yT3JFbmQ6IHJlc3VsdCA9IFRyeUNhcHR1cmVNaWRkbGVPcGVyYXRvcihleHByZXNzaW9uLCByZWYgaW5kZXgpOyBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0ICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgeWllbGQgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgVHJ5Q2FwdHVyZUlnbm9yZWRQYXR0ZXJuKGV4cHJlc3Npb24sIHJlZiBpbmRleCk7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA8IGV4cHJlc3Npb24uTGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihzdHJpbmcuRm9ybWF0KFwiVW5leHBlY3RlZCBzZXF1ZW5jZSBvZiBjaGFyYWN0ZXJzOiB7MH1cIixleHByZXNzaW9uLlN1YnN0cmluZyhpbmRleCkpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFJ1c3RpY1Rva2VuIFRyeUNhcHR1cmVWYWx1ZU9yTGVmdE9wZXJhdG9yKHN0cmluZyBleHByZXNzaW9uLCByZWYgaW50IGluZGV4LCBib29sIGNhbkVuZEdyb3VwcyA9IHRydWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBNYXRjaCBtYXRjaDtcclxuICAgICAgICAgICAgaWYgKChtYXRjaCA9IFN0aWNreU1hdGNoKG9wZW5Hcm91cEV4cHIsIGV4cHJlc3Npb24sIHJlZiBpbmRleCkpLlN1Y2Nlc3MpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRTdGF0ZS5QdXNoKFBhcnNpbmdTdGF0ZS5WYWx1ZU9yTGVmdE9wZXJhdG9yT3JFbmQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE9wZW5Hcm91cFBhdHRlcm5bRmluZFN1Y2NlZGVkR3JvdXBJbmRleChtYXRjaCkgLSAxXS5Ub1Rva2VuKHRoaXMsIG1hdGNoLlZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKChtYXRjaCA9IFN0aWNreU1hdGNoKGxlZnRPcEV4cHIsIGV4cHJlc3Npb24sIHJlZiBpbmRleCkpLlN1Y2Nlc3MpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRTdGF0ZS5QdXNoKFBhcnNpbmdTdGF0ZS5WYWx1ZU9yTGVmdE9wZXJhdG9yRXhwZWN0ZWQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIExlZnRPcGVyYXRvcnNbRmluZFN1Y2NlZGVkR3JvdXBJbmRleChtYXRjaCkgLSAxXS5Ub1Rva2VuKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICgobWF0Y2ggPSBTdGlja3lNYXRjaCh2YWx1ZUV4cHIsIGV4cHJlc3Npb24sIHJlZiBpbmRleCkpLlN1Y2Nlc3MpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRTdGF0ZS5QdXNoKFBhcnNpbmdTdGF0ZS5NaWRkbGVPcGVyYXRvck9yRW5kKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBWYWx1ZVBhdHRlcm5bRmluZFN1Y2NlZGVkR3JvdXBJbmRleChtYXRjaCkgLSAxXS5Ub1Rva2VuKHRoaXMsIG1hdGNoLlZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGNhbkVuZEdyb3VwcyAmJiAobWF0Y2ggPSBTdGlja3lNYXRjaChjbG9zZUdyb3VwRXhwciwgZXhwcmVzc2lvbiwgcmVmIGluZGV4KSkuU3VjY2VzcylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY3VycmVudFN0YXRlLlB1c2goUGFyc2luZ1N0YXRlLk1pZGRsZU9wZXJhdG9yT3JFbmQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIENsb3NlR3JvdXBQYXR0ZXJuW0ZpbmRTdWNjZWRlZEdyb3VwSW5kZXgobWF0Y2gpIC0gMV0uVG9Ub2tlbih0aGlzLCBtYXRjaC5WYWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBSdXN0aWNUb2tlbiBDYXB0dXJlVmFsdWVPckxlZnRPcGVyYXRvcihzdHJpbmcgZXhwcmVzc2lvbiwgcmVmIGludCBpbmRleClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFJ1c3RpY1Rva2VuIHJlc3VsdCA9IFRyeUNhcHR1cmVWYWx1ZU9yTGVmdE9wZXJhdG9yKGV4cHJlc3Npb24sIHJlZiBpbmRleCwgY2FuRW5kR3JvdXBzOiBmYWxzZSk7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJVbmV4cGVjdGVkIHRva2VuOiBcIit1bmV4cGVjdGVkVG9rZW5FeHByLk1hdGNoKGV4cHJlc3Npb24sIGluZGV4KSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBSdXN0aWNUb2tlbiBUcnlDYXB0dXJlTWlkZGxlT3BlcmF0b3Ioc3RyaW5nIGV4cHJlc3Npb24sIHJlZiBpbnQgaW5kZXgsIGJvb2wgY2FuRW5kR3JvdXBzID0gdHJ1ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIE1hdGNoIG1hdGNoO1xyXG4gICAgICAgICAgICBpZiAoKG1hdGNoID0gU3RpY2t5TWF0Y2gobWlkT3BFeHByLCBleHByZXNzaW9uLCByZWYgaW5kZXgpKS5TdWNjZXNzKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50U3RhdGUuUHVzaChQYXJzaW5nU3RhdGUuVmFsdWVPckxlZnRPcGVyYXRvckV4cGVjdGVkKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBNaWRkbGVPcGVyYXRvcnNbRmluZFN1Y2NlZGVkR3JvdXBJbmRleChtYXRjaCkgLSAxXS5Ub1Rva2VuKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChjYW5FbmRHcm91cHMgJiYgKG1hdGNoID0gU3RpY2t5TWF0Y2goY2xvc2VHcm91cEV4cHIsIGV4cHJlc3Npb24sIHJlZiBpbmRleCkpLlN1Y2Nlc3MpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRTdGF0ZS5QdXNoKFBhcnNpbmdTdGF0ZS5NaWRkbGVPcGVyYXRvck9yRW5kKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBDbG9zZUdyb3VwUGF0dGVybltGaW5kU3VjY2VkZWRHcm91cEluZGV4KG1hdGNoKSAtIDFdLlRvVG9rZW4odGhpcywgbWF0Y2guVmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbnZvaWQgVHJ5Q2FwdHVyZUlnbm9yZWRQYXR0ZXJuKHN0cmluZyBleHByZXNzaW9uLCByZWYgaW50IGluZGV4KVxyXG57XHJcbiAgICBTdGlja3lNYXRjaChpZ25vcmVkRXhwciwgZXhwcmVzc2lvbiwgcmVmIGluZGV4KTtcclxufVxyXG4gICAgICAgIHN0YXRpYyBvYmplY3QgU3RyaW5nVG9JbnQzMihzdHJpbmcgdmFsdWUsIHBhcmFtcyBjaGFyW10gdHJpbUNoYXJzKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW50IGludFZhbHVlID0gQ29udmVydC5Ub0ludDMyKHZhbHVlLlRyaW1FbmQodHJpbUNoYXJzKSk7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZS5FbmRzV2l0aChcIiVcIikpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaW50VmFsdWUgLyAxMDBmO1xyXG4gICAgICAgICAgICByZXR1cm4gQ29udmVydC5Ub0ludDMyKGludFZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXRpYyBvYmplY3QgU3RyaW5nVG9GbG9hdChzdHJpbmcgdmFsdWUsIHBhcmFtcyBjaGFyW10gdHJpbUNoYXJzKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZmxvYXQgZmxvYXRWYWx1ZSA9IENvbnZlcnQuVG9TaW5nbGUoKHZhbHVlLlN0YXJ0c1dpdGgoXCIuXCIpID8gXCIwXCIgOiBcIlwiKSArIHZhbHVlLlRyaW1FbmQodHJpbUNoYXJzKSk7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZS5FbmRzV2l0aChcIiVcIikpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmxvYXRWYWx1ZSAvIDEwMGY7XHJcbiAgICAgICAgICAgIHJldHVybiBmbG9hdFZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGljIG9iamVjdCBTdHJpbmdUb0RvdWJsZShzdHJpbmcgdmFsdWUsIHBhcmFtcyBjaGFyW10gdHJpbUNoYXJzKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZG91YmxlIGRvdWJsZVZhbHVlID0gQ29udmVydC5Ub1NpbmdsZSh2YWx1ZS5UcmltRW5kKHRyaW1DaGFycykpO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUuRW5kc1dpdGgoXCIlXCIpKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRvdWJsZVZhbHVlIC8gMTAwZDtcclxuICAgICAgICAgICAgcmV0dXJuIGRvdWJsZVZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGljIE1hdGNoIFN0aWNreU1hdGNoKFJlZ2V4IHJlZ2V4LCBzdHJpbmcgaW5wdXQsIHJlZiBpbnQgaW5kZXgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBNYXRjaCBtYXRjaCA9IHJlZ2V4Lk1hdGNoKGlucHV0LCBpbmRleCk7XHJcbiAgICAgICAgICAgIGlmIChtYXRjaC5JbmRleCAhPSBpbmRleClcclxuICAgICAgICAgICAgICAgIHJldHVybiBNYXRjaC5FbXB0eTtcclxuXHJcbiAgICAgICAgICAgIGluZGV4ID0gbWF0Y2guSW5kZXggKyBtYXRjaC5MZW5ndGg7XHJcbiAgICAgICAgICAgIHJldHVybiBtYXRjaDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXRpYyBpbnQgRmluZFN1Y2NlZGVkR3JvdXBJbmRleChNYXRjaCBtYXRjaClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChtYXRjaC5TdWNjZXNzID09IGZhbHNlKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG5cclxuICAgICAgICAgICAgZm9yIChpbnQgaSA9IDE7IGkgPCBtYXRjaC5Hcm91cHMuQ291bnQ7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoLkdyb3Vwc1tpXS5TdWNjZXNzKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBjbGFzcyBPcGVyYXRpb25DYXB0dXJlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwdWJsaWMgc3RyaW5nIHBhdHRlcm47XHJcbiAgICAgICAgICAgIHB1YmxpYyBSdXN0aWNPcGVyYXRpb24gb3BlcmF0aW9uO1xyXG4gICAgICAgICAgICBwdWJsaWMgT3BlcmF0aW9uQ2FwdHVyZShzdHJpbmcgcGF0dGVybiwgUnVzdGljT3BlcmF0aW9uIG9wZXJhdGlvbilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYXR0ZXJuID0gcGF0dGVybjtcclxuICAgICAgICAgICAgICAgIHRoaXMub3BlcmF0aW9uID0gb3BlcmF0aW9uO1xyXG4gICAgICAgICAgICB9XHJcbnB1YmxpYyBSdXN0aWNUb2tlbiBUb1Rva2VuKClcclxue1xyXG4gICAgcmV0dXJuIG5ldyBSdXN0aWNUb2tlbihSdXN0aWNUb2tlbk1vZGUuT3BlcmF0aW9uLCBBY3RpdmF0b3IuQ3JlYXRlSW5zdGFuY2Uob3BlcmF0aW9uLkdldFR5cGUoKSkpO1xyXG59ICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBjbGFzcyBHZW5lcmljQ2FwdHVyZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcHVibGljIHN0cmluZyBwYXR0ZXJuO1xyXG4gICAgICAgICAgICBwdWJsaWMgRnVuYzxSdXN0aWNQYXJzZXIsIHN0cmluZyxvYmplY3Q+IHZhbHVlO1xyXG4gICAgICAgICAgICBwdWJsaWMgUnVzdGljVG9rZW5Nb2RlIG1vZGU7XHJcbiAgICAgICAgICAgIHB1YmxpYyBHZW5lcmljQ2FwdHVyZShzdHJpbmcgcGF0dGVybiwgUnVzdGljVG9rZW5Nb2RlIG1vZGUsIEZ1bmM8UnVzdGljUGFyc2VyLCBzdHJpbmcsb2JqZWN0PiB2YWx1ZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYXR0ZXJuID0gcGF0dGVybjtcclxuICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMubW9kZSA9IG1vZGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcHVibGljIFJ1c3RpY1Rva2VuIFRvVG9rZW4oUnVzdGljUGFyc2VyIHBhcnNlciwgc3RyaW5nIGNhcHR1cmVkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBvYmplY3QgcmVzdWx0ID0gdmFsdWUocGFyc2VyLCBjYXB0dXJlZCk7XHJcblJ1c3RpY1Rva2VuIHRva2VuOyAgICAgICAgICAgICAgICByZXR1cm4gKHRva2VuID0gcmVzdWx0IGFzIFJ1c3RpY1Rva2VuKSAhPSBudWxsPyB0b2tlbiA6IG5ldyBSdXN0aWNUb2tlbihtb2RlLCByZXN1bHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZW51bSBQYXJzaW5nU3RhdGVcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIFRoZSBleHByZXNzaW9uIGV4cGVjdHMgYSB2YWx1ZSBvciBtYXkgYmUgZW1wdHksIGxpa2UgaW4gKCApXHJcbiAgICAgICAgICAgIC8vLyBcclxuICAgICAgICAgICAgLy8vIDxwYXJhPlxyXG4gICAgICAgICAgICAvLy8gTmV4dCBzdGF0ZTo8YnIgLz5cclxuICAgICAgICAgICAgLy8vICAgLSBPbiB2YWx1ZSBmb3VuZDogPHNlZSBjcmVmPVwiTWlkZGxlT3BlcmF0b3JPckVuZFwiIC8+LjxiciAvPlxyXG4gICAgICAgICAgICAvLy8gICAtIE9uIGxlZnQgb3BlcmF0b3IgZm91bmQ6IDxzZWUgY3JlZj1cIlZhbHVlT3JMZWZ0T3BlcmF0b3JFeHBlY3RlZFwiLz48YnIgLz5cclxuICAgICAgICAgICAgLy8vIDwvcGFyYT5cclxuICAgICAgICAgICAgLy8vIDwvc3VtbWFyeT5cclxuICAgICAgICAgICAgVmFsdWVPckxlZnRPcGVyYXRvck9yRW5kLFxyXG5cclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gVGhlIGV4cHJlc3Npb24gZXhwZWN0cyBhIHZhbHVlLCBsaWtlIGluIEEgKyBCICsgP1xyXG4gICAgICAgICAgICAvLy8gXHJcbiAgICAgICAgICAgIC8vLyA8cGFyYT5cclxuICAgICAgICAgICAgLy8vIE5leHQgc3RhdGU6PGJyIC8+XHJcbiAgICAgICAgICAgIC8vLyAgIC0gT24gdmFsdWUgZm91bmQ6IDxzZWUgY3JlZj1cIk1pZGRsZU9wZXJhdG9yT3JFbmRcIiAvPi48YnIgLz5cclxuICAgICAgICAgICAgLy8vICAgLSBPbiBsZWZ0IG9wZXJhdG9yIGZvdW5kOiA8c2VlIGNyZWY9XCJWYWx1ZU9yTGVmdE9wZXJhdG9yRXhwZWN0ZWRcIi8+PGJyIC8+XHJcbiAgICAgICAgICAgIC8vLyA8L3BhcmE+XHJcbiAgICAgICAgICAgIC8vLyA8L3N1bW1hcnk+XHJcbiAgICAgICAgICAgIFZhbHVlT3JMZWZ0T3BlcmF0b3JFeHBlY3RlZCxcclxuXHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIFRoZSBleHByZXNzaW9uIGV4cGVjdHMgYSBtaWRkbGUgb3BlcmF0b3Igb3IgdGhlIGVuZCBvZiB0aGUgZXhwcmVzc2lvbiwgbGlrZSBpbiBBICsgQiA/XHJcbiAgICAgICAgICAgIC8vLyBcclxuICAgICAgICAgICAgLy8vIDxwYXJhPlxyXG4gICAgICAgICAgICAvLy8gTmV4dCBzdGF0ZTo8YnIgLz5cclxuICAgICAgICAgICAgLy8vICAgLSBPbiBvcGVyYXRvciBmb3VuZDogPHNlZSBjcmVmPVwiVmFsdWVPckxlZnRPcGVyYXRvck9yRW5kXCIgLz4uPGJyIC8+XHJcbiAgICAgICAgICAgIC8vLyA8L3BhcmE+XHJcbiAgICAgICAgICAgIC8vLyA8L3N1bW1hcnk+XHJcbiAgICAgICAgICAgIE1pZGRsZU9wZXJhdG9yT3JFbmQsXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcblxyXG5uYW1lc3BhY2UgRXhwcmVzc2lvblN0YWNrLlJ1c3RpY0V4cHJlc3Npb25cclxue1xyXG4gICAgaW50ZXJuYWwgY2xhc3MgUnVzdGljU3RhY2tcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgaW50IGRpc3BsYXlJZDtcclxuICAgICAgICBwdWJsaWMgaW50IHByaW9yaXR5O1xyXG4gICAgICAgIHB1YmxpYyBSdXN0aWNTdGFjayBwYXJlbnQ7XHJcbiAgICAgICAgcHVibGljIHJlYWRvbmx5IExpc3Q8UnVzdGljT3BlcmF0aW9uPiBvcGVyYXRpb25zID0gbmV3IExpc3Q8UnVzdGljT3BlcmF0aW9uPigpO1xyXG4gICAgICAgIHB1YmxpYyBib29sIGV4ZWN1dGVkIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG5wdWJsaWMgYm9vbCBDYW5CZVNpbXBsaWZpZWRcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG9wZXJhdGlvbnMuQ291bnQgPT0gMSAmJiBvcGVyYXRpb25zWzBdIGlzIE9wZXJhdGlvbnMuU2V0ICYmIG9wZXJhdGlvbnNbMF0ucGFyYW1ldGVyICE9IG51bGw7XHJcbiAgICB9XHJcbn1cclxuICAgICAgICBwdWJsaWMgb2JqZWN0IFJlc3VsdFZhbHVlIHtcclxuICAgICAgICAgICAgZ2V0IHtcclxuICAgICAgICAgICAgICAgIGlmIChleGVjdXRlZClcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJUaGlzIHN0YWNrIGRpZCBub3QgZXhlY3V0ZSB5ZXRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG9iamVjdCByZXN1bHQgPSBudWxsO1xyXG4gICAgICAgIFR5cGUgcmVzdWx0VHlwZSA9IG51bGw7XHJcblxyXG4gICAgICAgIHB1YmxpYyBSdXN0aWNTdGFjayhpbnQgaWQsIFJ1c3RpY1N0YWNrIHBhcmVudCwgaW50IHByaW9yaXR5KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5kaXNwbGF5SWQgPSBpZDtcclxuICAgICAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XHJcbiAgICAgICAgICAgIHRoaXMucHJpb3JpdHkgPSBwcmlvcml0eTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFByZXBhcmUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgTGlzdDxSdXN0aWNPcGVyYXRpb24+IG1vdmVMZWZ0VW5hcnlPcGVyYXRpb25zID0gbmV3IExpc3Q8UnVzdGljT3BlcmF0aW9uPigpO1xyXG4gICAgICAgICAgICBmb3JlYWNoKFJ1c3RpY09wZXJhdGlvbiBvcGVyYXRpb24gaW4gb3BlcmF0aW9ucylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wZXJhdGlvbi5Jc0xlZnRVbmFyeSlcclxuICAgICAgICAgICAgICAgICAgICBtb3ZlTGVmdFVuYXJ5T3BlcmF0aW9ucy5BZGQob3BlcmF0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yIChpbnQgaSA9IG1vdmVMZWZ0VW5hcnlPcGVyYXRpb25zLkNvdW50IC0gMTsgaSA+PSAwOyBpLS0pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJ1c3RpY09wZXJhdGlvbiBvcGVyYXRpb24gPSBtb3ZlTGVmdFVuYXJ5T3BlcmF0aW9uc1tpXTtcclxuICAgICAgICAgICAgICAgIG9wZXJhdGlvbnMuUmVtb3ZlKG9wZXJhdGlvbik7XHJcbiAgICAgICAgICAgICAgICBvcGVyYXRpb25zLkFkZChvcGVyYXRpb24pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBQcmV2aWV3UmVzdWx0VHlwZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgRXhlY3V0ZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXN1bHQgPSAwZjtcclxuICAgICAgICAgICAgZm9yIChpbnQgaSA9IDA7IGkgPCBvcGVyYXRpb25zLkNvdW50OyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IG9wZXJhdGlvbnNbaV0uRXhlY3V0ZShyZXN1bHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGV4ZWN1dGVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBUeXBlIFByZXZpZXdSZXN1bHRUeXBlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHRUeXBlID09IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGZvcihpbnQgaSA9IDA7IGkgPCBvcGVyYXRpb25zLkNvdW50OyBpKyspXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0VHlwZSA9IG9wZXJhdGlvbnNbaV0uUHJldmlld1Jlc3VsdFR5cGUocmVzdWx0VHlwZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHRUeXBlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0cmluZyBUb0V4cHJlc3Npb25TdHJpbmcoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc3RyaW5nIHN0ciA9IFwiIChcIjtcclxuICAgICAgICAgICAgaW50IGZpcnN0ID0gb3BlcmF0aW9ucy5GaW5kSW5kZXgoKFByZWRpY2F0ZTxSdXN0aWNPcGVyYXRpb24+KShvcCA9PiBvcC5Jc0xlZnRVbmFyeSkpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGZpcnN0ID49IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGZvciAoaW50IGkgPSBmaXJzdDsgaSA8IG9wZXJhdGlvbnMuQ291bnQ7IGkrKylcclxuICAgICAgICAgICAgICAgICAgICBzdHIgKz0gb3BlcmF0aW9uc1tpXS5Ub0V4cHJlc3Npb25TdHJpbmcoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yKGludCBpID0gMDsgaSA8IG9wZXJhdGlvbnMuQ291bnQ7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wZXJhdGlvbnNbaV0uSXNMZWZ0VW5hcnkpXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBzdHIgKz0gb3BlcmF0aW9uc1tpXS5Ub0V4cHJlc3Npb25TdHJpbmcoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc3RyICs9IFwiIClcIjtcclxuICAgICAgICAgICAgcmV0dXJuIHN0cjtcclxuICAgICAgICB9XHJcblxuICAgIFxucHJpdmF0ZSBib29sIF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19leGVjdXRlZD1mYWxzZTt9XHJcbn0iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgRXhwcmVzc2lvblN0YWNrLlJ1c3RpY0V4cHJlc3Npb25cclxue1xyXG4gICAgcHVibGljIGNsYXNzIFJ1c3RpY1Rva2VuXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIFJ1c3RpY1Rva2VuTW9kZSBtb2RlO1xyXG4gICAgICAgIHB1YmxpYyBvYmplY3QgdmFsdWU7XHJcblxyXG4gICAgICAgIHB1YmxpYyBSdXN0aWNUb2tlbihSdXN0aWNUb2tlbk1vZGUgbW9kZSwgb2JqZWN0IHZhbHVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5tb2RlID0gbW9kZTtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxucHVibGljIG92ZXJyaWRlIHN0cmluZyBUb1N0cmluZygpXHJcbntcclxuICAgIHJldHVybiBzdHJpbmcuRm9ybWF0KFwiUnVzdGljVG9rZW4oezB9LCBcXFwiezF9XFxcIilcIixtb2RlLHZhbHVlKTtcclxufSAgICB9XHJcblxyXG4gICAgcHVibGljIGVudW0gUnVzdGljVG9rZW5Nb2RlXHJcbiAgICB7XHJcbiAgICAgICAgSWdub3JlZCxcclxuICAgICAgICBMaXRlcmFsLFxyXG4gICAgICAgIFZhcmlhYmxlTmFtZSxcclxuICAgICAgICBPcGVyYXRpb24sXHJcbiAgICAgICAgUHJpb3JpdHlPZmZzZXQsXHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgQnJpZGdlO1xyXG51c2luZyBFeHByZXNzaW9uU3RhY2suUnVzdGljRXhwcmVzc2lvbjtcclxudXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcblxyXG5uYW1lc3BhY2UgTGl2ZVByZXZpZXdcclxue1xyXG4gICAgcHVibGljIGNsYXNzIEFwcFxyXG4gICAge1xyXG4gICAgICAgIHN0YXRpYyBIVE1MRGl2RWxlbWVudCBSZXN1bHRCb3g7XHJcbiAgICAgICAgc3RhdGljIEhUTUxJbnB1dEVsZW1lbnQgSW5wdXRFeHByZXNzaW9uO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgTWFpbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvLyBIVE1MXHJcbiAgICAgICAgICAgIFJlc3VsdEJveCA9IERvY3VtZW50LkdldEVsZW1lbnRCeUlkPEhUTUxEaXZFbGVtZW50PihcImV4cHItcmVzdWx0Ym94XCIpO1xyXG4gICAgICAgICAgICBJbnB1dEV4cHJlc3Npb24gPSBEb2N1bWVudC5HZXRFbGVtZW50QnlJZDxIVE1MSW5wdXRFbGVtZW50PihcInRFeHByZXNzaW9uXCIpO1xyXG5cclxuICAgICAgICAgICAgSW5wdXRFeHByZXNzaW9uLk9uSW5wdXQgPSBPbklucHV0RXhwcmVzc2lvbjtcclxuXHJcbiAgICAgICAgICAgIE9uSW5wdXRFeHByZXNzaW9uKG51bGwpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIC8vIElOU1RSVUNUSU9OU1xyXG4gICAgICAgICAgICAvLyA9PT09PT09PT09PT09XHJcbiAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgIC8vIEFmdGVyIGJ1aWxkaW5nIChDdHJsICsgU2hpZnQgKyBCKSB0aGlzIHByb2plY3QsIFxyXG4gICAgICAgICAgICAvLyBicm93c2UgdG8gdGhlIC9iaW4vRGVidWcgb3IgL2Jpbi9SZWxlYXNlIGZvbGRlci5cclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgLy8gQSBuZXcgYnJpZGdlLyBmb2xkZXIgaGFzIGJlZW4gY3JlYXRlZCBhbmRcclxuICAgICAgICAgICAgLy8gY29udGFpbnMgeW91ciBwcm9qZWN0cyBKYXZhU2NyaXB0IGZpbGVzLiBcclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgLy8gT3BlbiB0aGUgYnJpZGdlL2luZGV4Lmh0bWwgZmlsZSBpbiBhIGJyb3dzZXIgYnlcclxuICAgICAgICAgICAgLy8gUmlnaHQtQ2xpY2sgPiBPcGVuIFdpdGguLi4sIHRoZW4gY2hvb3NlIGFcclxuICAgICAgICAgICAgLy8gd2ViIGJyb3dzZXIgZnJvbSB0aGUgbGlzdC5cclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgLy8gVGhpcyBhcHBsaWNhdGlvbiB3aWxsIHRoZW4gcnVuIGluIHRoZSBicm93c2VyXHJcbiAgICAgICAgICAgIC8vIGFuZCB5b3Ugd2lsbCBiZSBhYmxlIHRvIHRlc3QgaXQuXHJcbiAgICAgICAgICAgIC8vXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0aWMgcHVibGljIHZvaWQgT25JbnB1dEV4cHJlc3Npb24oRXZlbnQ8SFRNTElucHV0RWxlbWVudD4gZXYpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0cnlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUnVzdGljRXhwciBleHByID0gbmV3IFJ1c3RpY0V4cHIoSW5wdXRFeHByZXNzaW9uLlZhbHVlKTtcclxuICAgICAgICAgICAgICAgIGV4cHIuRXhlY3V0ZSgpO1xyXG4gICAgICAgICAgICAgICAgUmVzdWx0Qm94LklubmVySFRNTCA9IGV4cHIuUHJpbnRUb0h0bWwoKTtcclxuICAgICAgICAgICAgfSBjYXRjaChFeGNlcHRpb24gZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUmVzdWx0Qm94LklubmVySFRNTCA9IHN0cmluZy5Gb3JtYXQoXCJGaXggeW91ciBmb3JtdWxhOiB7MH1cIixlLk1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vZXhwci5QcmludERlYnVnKCk7IC8vIENvbnNvbGVcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJ1c2luZyBFeHByZXNzaW9uU3RhY2suUnVzdGljRXhwcmVzc2lvbjtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBTeXN0ZW07XHJcblxyXG5uYW1lc3BhY2UgTGl2ZVByZXZpZXdcclxue1xyXG4gICAgc3RhdGljIGNsYXNzIEJyaWRnZVByaW50SHRtbFxyXG4gICAge1xyXG4gICAgICAgIHN0YXRpYyBwdWJsaWMgc3RyaW5nIFByaW50VG9IdG1sKHRoaXMgUnVzdGljRXhwciBleHByKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc3RyaW5nIGh0bWwgPSBzdHJpbmcuRm9ybWF0KFwiPGRpdiBjbGFzcz1cXFwiZXhwci1yZXN1bHRcXFwiPlJlc3VsdDogezB9PC9kaXY+XCIsZXhwci5zdGFja3NbMF0uUmVzdWx0VmFsdWUpO1xyXG4gICAgICAgICAgICBodG1sICs9IFwiPHRhYmxlIHdpZHRoPTEwMCU+XCI7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBUYWJsZSBIZWFkXHJcbiAgICAgICAgICAgIGh0bWwgKz0gXCI8dGhlYWQ+XCI7XHJcbiAgICAgICAgICAgIGh0bWwgKz0gXCI8dHI+XCI7XHJcbiAgICAgICAgICAgIGh0bWwgKz0gXCI8dGg+U3RhY2sgUmVnaXN0ZXI8L3RoPlwiO1xyXG4gICAgICAgICAgICBodG1sICs9IFwiPHRoIHdpZHRoPTUwJT5PcGVyYXRpb248L3RoPlwiO1xyXG4gICAgICAgICAgICBodG1sICs9IFwiPHRoIHdpZHRoPTIwJT5SZXN1bHQ8L3RoPlwiO1xyXG4gICAgICAgICAgICBodG1sICs9IFwiPHRoPlR5cGU8L3RoPlwiO1xyXG4gICAgICAgICAgICBodG1sICs9IFwiPC90cj5cIjtcclxuICAgICAgICAgICAgaHRtbCArPSBcIjwvdGhlYWQ+XCI7XHJcblxyXG4gICAgICAgICAgICAvLyBUYWJsZSBCb2R5XHJcbiAgICAgICAgICAgIGh0bWwgKz0gXCI8dGJvZHk+XCI7XHJcblxyXG4gICAgICAgICAgICBmb3JlYWNoKHZhciBzdGFjayBpbiBleHByLnN0YWNrcylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYm9vbCBpc0ZpcnN0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIFR5cGUgcHJldlR5cGUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0IHJlc3VsdFZhbHVlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGZvcmVhY2godmFyIG9wZXJhdGlvbiBpbiBzdGFjay5vcGVyYXRpb25zKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGh0bWwgKz0gXCI8dHI+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzRmlyc3QpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFN0YWNrIFJlZ2lzdGVyIGNvbHVtblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBodG1sICs9IHN0cmluZy5Gb3JtYXQoXCI8dGQgcm93c3Bhbj0nezB9Jz5SezF9PC90ZD5cIixzdGFjay5vcGVyYXRpb25zLkNvdW50ICsgMSxzdGFjay5kaXNwbGF5SWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBUeXBlIG9wUmVzdWx0VHlwZSA9IG9wZXJhdGlvbi5QcmV2aWV3UmVzdWx0VHlwZShwcmV2VHlwZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0VmFsdWUgPSBvcGVyYXRpb24uRXhlY3V0ZShyZXN1bHRWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gT3BlcmF0aW9ucyBjb2x1bW5cclxuICAgICAgICAgICAgICAgICAgICBodG1sICs9IHN0cmluZy5Gb3JtYXQoXCI8dGQ+ezB9ezF9PC90ZD5cIixvcGVyYXRpb24uR2V0VHlwZSgpLk5hbWUsKG9wZXJhdGlvbi5wYXJhbWV0ZXIgIT0gbnVsbCA/IFwiIFwiICsgb3BlcmF0aW9uLnBhcmFtZXRlciA6IFwiXCIpKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAvLyBSZXN1bHQgY29sdW1uXHJcbiAgICAgICAgICAgICAgICAgICAgaHRtbCArPSBzdHJpbmcuRm9ybWF0KFwiPHRkPlJ7MH06IHsxfTwvdGQ+XCIsc3RhY2suZGlzcGxheUlkLHJlc3VsdFZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAvLyBUeXBlIGNvbHVtblxyXG4gICAgICAgICAgICAgICAgICAgIGh0bWwgKz0gc3RyaW5nLkZvcm1hdChcIjx0ZCBzdHlsZT0nd2hpdGUtc3BhY2U6IG5vd3JhcCc+ezB9KHsxfSwgezJ9KTogezN9PC90ZD5cIixvcGVyYXRpb24uR2V0VHlwZSgpLk5hbWUsKHByZXZUeXBlIT1udWxsP3ByZXZUeXBlLk5hbWU6KHN0cmluZyludWxsKSA/PyBcIm51bGxcIiwob3BlcmF0aW9uLnBhcmFtZXRlciAhPSBudWxsID8gXCIgXCIgKyBvcGVyYXRpb24ucGFyYW1ldGVyVHlwZS5OYW1lIDogXCJudWxsXCIpLG9wUmVzdWx0VHlwZS5OYW1lKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaHRtbCArPSBcIjwvdHI+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNGaXJzdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHByZXZUeXBlID0gb3BSZXN1bHRUeXBlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGh0bWwgKz0gc3RyaW5nLkZvcm1hdChcIjx0ciBzdHlsZT0nZm9udC13ZWlnaHQ6Ym9sZCc+PHRkPlJldHVybjwvdGQ+PHRkPlJ7MH06IHsxfTwvdGQ+PHRkPnsyfTwvdGQ+PC90cj5cIixzdGFjay5kaXNwbGF5SWQsc3RhY2suUmVzdWx0VmFsdWUgPz8gXCJudWxsXCIsKGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5Ub1RlbXAoXCJrZXkxXCIsc3RhY2suUmVzdWx0VmFsdWUpIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tVGVtcDxvYmplY3Q+KFwia2V5MVwiKS5HZXRUeXBlKCkuTmFtZTooc3RyaW5nKW51bGwpID8/IFwibnVsbFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBodG1sICs9IFwiPC90cj5cIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaHRtbCArPSBcIjwvdGJvZHk+XCI7XHJcbiAgICAgICAgICAgIGh0bWwgKz0gXCI8L3RhYmxlPlwiO1xyXG4gICAgICAgICAgICByZXR1cm4gaHRtbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG5cclxubmFtZXNwYWNlIEV4cHJlc3Npb25TdGFjay5SdXN0aWNFeHByZXNzaW9uLkV2YWx1YXRvcnNcbntcbiAgICBjbGFzcyBMaXRlcmFsIDogUnVzdGljVmFsdWVFdmFsdWF0b3JcbiAgICB7XG4gICAgICAgIG9iamVjdCB2YWx1ZTtcbnB1YmxpYyBMaXRlcmFsKG9iamVjdCB2YWx1ZSlcclxue1xyXG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG59cHVibGljIG92ZXJyaWRlIG9iamVjdCBHZXRWYWx1ZSgpXHJcbntcclxuICAgIHJldHVybiB2YWx1ZTtcclxufXB1YmxpYyBvdmVycmlkZSBUeXBlIEdldFZhbHVlVHlwZSgpXHJcbntcclxuICAgIHJldHVybiB2YWx1ZS5HZXRUeXBlKCk7XHJcbn1wdWJsaWMgb3ZlcnJpZGUgc3RyaW5nIFRvU3RyaW5nKClcclxue1xyXG4gICAgcmV0dXJuIHN0cmluZy5Gb3JtYXQoXCJ7MH1cIix2YWx1ZSk7XHJcbn0gICAgfVxufVxuIiwidXNpbmcgU3lzdGVtO1xyXG5cclxubmFtZXNwYWNlIEV4cHJlc3Npb25TdGFjay5SdXN0aWNFeHByZXNzaW9uLkV2YWx1YXRvcnNcclxue1xyXG4gICAgY2xhc3MgU3RhY2tSZWZlcmVuY2UgOiBSdXN0aWNWYWx1ZUV2YWx1YXRvclxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBSdXN0aWNTdGFjayBzdGFjayB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgU3RhY2tSZWZlcmVuY2UoUnVzdGljU3RhY2sgc3RhY2spXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnN0YWNrID0gc3RhY2s7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgb3ZlcnJpZGUgb2JqZWN0IEdldFZhbHVlKClcclxue1xyXG4gICAgcmV0dXJuIHN0YWNrLlJlc3VsdFZhbHVlO1xyXG59cHVibGljIG92ZXJyaWRlIFR5cGUgR2V0VmFsdWVUeXBlKClcclxue1xyXG4gICAgcmV0dXJuIHN0YWNrLlByZXZpZXdSZXN1bHRUeXBlKCk7XHJcbn1wdWJsaWMgb3ZlcnJpZGUgc3RyaW5nIFRvU3RyaW5nKClcclxue1xyXG4gICAgcmV0dXJuIHN0cmluZy5Gb3JtYXQoXCJSezB9XCIsc3RhY2suZGlzcGxheUlkKTtcclxufSAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG5cclxubmFtZXNwYWNlIEV4cHJlc3Npb25TdGFjay5SdXN0aWNFeHByZXNzaW9uLkV2YWx1YXRvcnNcbntcbiAgICBjbGFzcyBWYXJpYWJsZTogUnVzdGljVmFsdWVFdmFsdWF0b3JcbiAgICB7XG4gICAgICAgIFJ1c3RpY0NvbnRleHQgY29udGV4dDtcbiAgICAgICAgc3RyaW5nIHZhcmlhYmxlTmFtZTtcbiAgICAgICAgVHlwZSB2YXJpYWJsZVR5cGU7XG4gICAgICAgIHB1YmxpYyBWYXJpYWJsZShSdXN0aWNDb250ZXh0IGNvbnRleHQsIHN0cmluZyB2YXJpYWJsZUlkKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICAgICAgdGhpcy52YXJpYWJsZU5hbWUgPSB2YXJpYWJsZUlkO1xuICAgICAgICAgICAgdmFyaWFibGVUeXBlID0gZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LlRvVGVtcChcImtleTFcIixHZXRWYWx1ZSgpKSE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbVRlbXA8b2JqZWN0PihcImtleTFcIikuR2V0VHlwZSgpOihUeXBlKW51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcHVibGljIG92ZXJyaWRlIG9iamVjdCBHZXRWYWx1ZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBvYmplY3QgdmFsdWUgPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAoKGNvbnRleHQhPW51bGw/Y29udGV4dC52YXJpYWJsZXMuVHJ5R2V0VmFsdWUodmFyaWFibGVOYW1lLCBvdXQgdmFsdWUpOihib29sPyludWxsKSA9PSB0cnVlKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oc3RyaW5nLkZvcm1hdChcIlVuZGVmaW5lZCB2YXJpYWJsZSBcXFwiezB9XFxcIlwiLHZhcmlhYmxlTmFtZSkpO1xyXG4gICAgICAgIH1cclxucHVibGljIG92ZXJyaWRlIFR5cGUgR2V0VmFsdWVUeXBlKClcclxue1xyXG4gICAgcmV0dXJuIHZhcmlhYmxlVHlwZTtcclxufXB1YmxpYyBvdmVycmlkZSBzdHJpbmcgVG9TdHJpbmcoKVxyXG57XHJcbiAgICByZXR1cm4gdmFyaWFibGVOYW1lO1xyXG59ICAgIH1cbn1cbiIsInVzaW5nIFN5c3RlbTtcclxuXHJcbm5hbWVzcGFjZSBFeHByZXNzaW9uU3RhY2suUnVzdGljRXhwcmVzc2lvbi5PcGVyYXRpb25zXHJcbntcclxuICAgIGNsYXNzIEFkZCA6IFJ1c3RpY09wZXJhdGlvblxyXG4gICAge1xyXG4gICAgICAgIEZ1bmM8b2JqZWN0LCBvYmplY3QsIG9iamVjdD4gZnVuYztcclxucHVibGljIG92ZXJyaWRlIG9iamVjdCBFeGVjdXRlKG9iamVjdCBzdG9yZWQpXHJcbntcclxuICAgIHJldHVybiBmdW5jKHN0b3JlZCwgcGFyYW1ldGVyVmFsdWUpO1xyXG59cHJvdGVjdGVkIG92ZXJyaWRlIFByaW9yaXR5IEdldFByaW9yaXR5KClcclxue1xyXG4gICAgcmV0dXJuIEV4cHJlc3Npb25TdGFjay5SdXN0aWNFeHByZXNzaW9uLlJ1c3RpY09wZXJhdGlvbi5Qcmlvcml0eS5BZGRTdWI7XHJcbn1cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgVHlwZSBQcmV2aWV3UmVzdWx0VHlwZShUeXBlIGluY29taW5nU3RvcmVkVHlwZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChpbmNvbWluZ1N0b3JlZFR5cGUgPT0gdHlwZW9mKGRvdWJsZSkgfHwgcGFyYW1ldGVyVHlwZSA9PSB0eXBlb2YoZG91YmxlKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZnVuYyA9IFByb3ZpZGVycy5Db21tb25NYXRoLkFkZFt0eXBlb2YoZG91YmxlKV07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mKGRvdWJsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoaW5jb21pbmdTdG9yZWRUeXBlID09IHR5cGVvZihmbG9hdCkgfHwgcGFyYW1ldGVyVHlwZSA9PSB0eXBlb2YoZmxvYXQpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmdW5jID0gUHJvdmlkZXJzLkNvbW1vbk1hdGguQWRkW3R5cGVvZihmbG9hdCldO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVvZihmbG9hdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoaW5jb21pbmdTdG9yZWRUeXBlID09IHR5cGVvZihpbnQpICYmIHBhcmFtZXRlclR5cGUgPT0gdHlwZW9mKGludCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGZ1bmMgPSBQcm92aWRlcnMuQ29tbW9uTWF0aC5BZGRbdHlwZW9mKGludCldO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVvZihpbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBOb3RJbXBsZW1lbnRlZEV4Y2VwdGlvbihcIkNvdWxkIG5vdCBpbmZlciB0aGUgcmVzdWx0aW5nIHR5cGVcIik7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgb3ZlcnJpZGUgc3RyaW5nIFRvRXhwcmVzc2lvblN0cmluZygpXHJcbntcclxuICAgIHJldHVybiBzdHJpbmcuRm9ybWF0KFwiICsgezB9XCIsZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LlRvVGVtcChcImtleTFcIixwYXJhbWV0ZXIpIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tVGVtcDxSdXN0aWNWYWx1ZUV2YWx1YXRvcj4oXCJrZXkxXCIpLlRvU3RyaW5nKCk6KHN0cmluZyludWxsKTtcclxufSAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xuXG5uYW1lc3BhY2UgRXhwcmVzc2lvblN0YWNrLlJ1c3RpY0V4cHJlc3Npb24uT3BlcmF0aW9uc1xue1xuICAgIGNsYXNzIERpdiA6IFJ1c3RpY09wZXJhdGlvblxuICAgIHtcbiAgICAgICAgRnVuYzxvYmplY3QsIG9iamVjdCwgb2JqZWN0PiBmdW5jO1xucHVibGljIG92ZXJyaWRlIG9iamVjdCBFeGVjdXRlKG9iamVjdCBzdG9yZWQpXHJcbntcclxuICAgIHJldHVybiBmdW5jKHN0b3JlZCwgcGFyYW1ldGVyVmFsdWUpO1xyXG59cHJvdGVjdGVkIG92ZXJyaWRlIFByaW9yaXR5IEdldFByaW9yaXR5KClcclxue1xyXG4gICAgcmV0dXJuIEV4cHJlc3Npb25TdGFjay5SdXN0aWNFeHByZXNzaW9uLlJ1c3RpY09wZXJhdGlvbi5Qcmlvcml0eS5NdWxEaXY7XHJcbn1cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgVHlwZSBQcmV2aWV3UmVzdWx0VHlwZShUeXBlIGluY29taW5nU3RvcmVkVHlwZSlcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKGluY29taW5nU3RvcmVkVHlwZSA9PSB0eXBlb2YoZG91YmxlKSB8fCBwYXJhbWV0ZXJUeXBlID09IHR5cGVvZihkb3VibGUpKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGZ1bmMgPSBQcm92aWRlcnMuQ29tbW9uTWF0aC5EaXZbdHlwZW9mKGRvdWJsZSldO1xuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2YoZG91YmxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGluY29taW5nU3RvcmVkVHlwZSA9PSB0eXBlb2YoZmxvYXQpIHx8IHBhcmFtZXRlclR5cGUgPT0gdHlwZW9mKGZsb2F0KSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBmdW5jID0gUHJvdmlkZXJzLkNvbW1vbk1hdGguRGl2W3R5cGVvZihmbG9hdCldO1xuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2YoZmxvYXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaW5jb21pbmdTdG9yZWRUeXBlID09IHR5cGVvZihpbnQpICYmIHBhcmFtZXRlclR5cGUgPT0gdHlwZW9mKGludCkpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZnVuYyA9IFByb3ZpZGVycy5Db21tb25NYXRoLkRpdlt0eXBlb2YoaW50KV07XG4gICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVvZihpbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBOb3RJbXBsZW1lbnRlZEV4Y2VwdGlvbihcIkNvdWxkIG5vdCBpbmZlciB0aGUgcmVzdWx0aW5nIHR5cGVcIik7XG4gICAgICAgIH1cbnB1YmxpYyBvdmVycmlkZSBzdHJpbmcgVG9FeHByZXNzaW9uU3RyaW5nKClcclxue1xyXG4gICAgcmV0dXJuIHN0cmluZy5Gb3JtYXQoXCIgLyB7MH1cIixnbG9iYWw6OkJyaWRnZS5TY3JpcHQuVG9UZW1wKFwia2V5MVwiLHBhcmFtZXRlcikhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21UZW1wPFJ1c3RpY1ZhbHVlRXZhbHVhdG9yPihcImtleTFcIikuVG9TdHJpbmcoKTooc3RyaW5nKW51bGwpO1xyXG59ICAgIH1cbn1cbiIsInVzaW5nIFN5c3RlbTtcblxubmFtZXNwYWNlIEV4cHJlc3Npb25TdGFjay5SdXN0aWNFeHByZXNzaW9uLk9wZXJhdGlvbnNcbntcbiAgICBjbGFzcyBNdWwgOiBSdXN0aWNPcGVyYXRpb25cbiAgICB7XG4gICAgICAgIEZ1bmM8b2JqZWN0LCBvYmplY3QsIG9iamVjdD4gZnVuYztcbnB1YmxpYyBvdmVycmlkZSBvYmplY3QgRXhlY3V0ZShvYmplY3Qgc3RvcmVkKVxyXG57XHJcbiAgICByZXR1cm4gZnVuYyhzdG9yZWQsIHBhcmFtZXRlclZhbHVlKTtcclxufXByb3RlY3RlZCBvdmVycmlkZSBQcmlvcml0eSBHZXRQcmlvcml0eSgpXHJcbntcclxuICAgIHJldHVybiBFeHByZXNzaW9uU3RhY2suUnVzdGljRXhwcmVzc2lvbi5SdXN0aWNPcGVyYXRpb24uUHJpb3JpdHkuTXVsRGl2O1xyXG59XHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIFR5cGUgUHJldmlld1Jlc3VsdFR5cGUoVHlwZSBpbmNvbWluZ1N0b3JlZFR5cGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmIChpbmNvbWluZ1N0b3JlZFR5cGUgPT0gdHlwZW9mKGRvdWJsZSkgfHwgcGFyYW1ldGVyVHlwZSA9PSB0eXBlb2YoZG91YmxlKSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBmdW5jID0gUHJvdmlkZXJzLkNvbW1vbk1hdGguTXVsW3R5cGVvZihkb3VibGUpXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mKGRvdWJsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpbmNvbWluZ1N0b3JlZFR5cGUgPT0gdHlwZW9mKGZsb2F0KSB8fCBwYXJhbWV0ZXJUeXBlID09IHR5cGVvZihmbG9hdCkpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZnVuYyA9IFByb3ZpZGVycy5Db21tb25NYXRoLk11bFt0eXBlb2YoZmxvYXQpXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mKGZsb2F0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGluY29taW5nU3RvcmVkVHlwZSA9PSB0eXBlb2YoaW50KSAmJiBwYXJhbWV0ZXJUeXBlID09IHR5cGVvZihpbnQpKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGZ1bmMgPSBQcm92aWRlcnMuQ29tbW9uTWF0aC5NdWxbdHlwZW9mKGludCldO1xuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2YoaW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTm90SW1wbGVtZW50ZWRFeGNlcHRpb24oXCJDb3VsZCBub3QgaW5mZXIgdGhlIHJlc3VsdGluZyB0eXBlXCIpO1xuICAgICAgICB9XG5wdWJsaWMgb3ZlcnJpZGUgc3RyaW5nIFRvRXhwcmVzc2lvblN0cmluZygpXHJcbntcclxuICAgIHJldHVybiBzdHJpbmcuRm9ybWF0KFwiICogezB9XCIsZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LlRvVGVtcChcImtleTFcIixwYXJhbWV0ZXIpIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tVGVtcDxSdXN0aWNWYWx1ZUV2YWx1YXRvcj4oXCJrZXkxXCIpLlRvU3RyaW5nKCk6KHN0cmluZyludWxsKTtcclxufSAgICB9XG59XG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgRXhwcmVzc2lvblN0YWNrLlJ1c3RpY0V4cHJlc3Npb24uT3BlcmF0aW9uc1xyXG57XHJcbiAgICBjbGFzcyBQb3cgOiBSdXN0aWNPcGVyYXRpb25cclxuICAgIHtcclxucHVibGljIG92ZXJyaWRlIG9iamVjdCBFeGVjdXRlKG9iamVjdCBzdG9yZWQpXHJcbntcclxuICAgIHJldHVybiBNYXRoLlBvdyhDb252ZXJ0LlRvRG91YmxlKHN0b3JlZCksIENvbnZlcnQuVG9Eb3VibGUocGFyYW1ldGVyVmFsdWUpKTtcclxufXByb3RlY3RlZCBvdmVycmlkZSBQcmlvcml0eSBHZXRQcmlvcml0eSgpXHJcbntcclxuICAgIHJldHVybiBFeHByZXNzaW9uU3RhY2suUnVzdGljRXhwcmVzc2lvbi5SdXN0aWNPcGVyYXRpb24uUHJpb3JpdHkuUG93O1xyXG59cHVibGljIG92ZXJyaWRlIFR5cGUgUHJldmlld1Jlc3VsdFR5cGUoVHlwZSBpbmNvbWluZ1N0b3JlZFR5cGUpXHJcbntcclxuICAgIHJldHVybiB0eXBlb2YoZG91YmxlKTtcclxufSNpZiBVTklUWV9FRElUT1JcclxuICAgICAgICBQcmV2aWV3UmVzdWx0VHlwZSBzaG91bGQgY29uc2lkZXIgZmxvYXQgYW5kIGRvdWJsZSB3aXRoIE1hdGhmLlBvdy5cclxuI2VuZGlmXHJcbnB1YmxpYyBvdmVycmlkZSBib29sIEhhc1JpZ2h0VG9MZWZ0UHJlY2VkZW5jZSgpXHJcbntcclxuICAgIHJldHVybiB0cnVlO1xyXG59cHVibGljIG92ZXJyaWRlIHN0cmluZyBUb0V4cHJlc3Npb25TdHJpbmcoKVxyXG57XHJcbiAgICByZXR1cm4gc3RyaW5nLkZvcm1hdChcIiAqKiAoezB9KVwiLGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5Ub1RlbXAoXCJrZXkxXCIscGFyYW1ldGVyKSE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbVRlbXA8UnVzdGljVmFsdWVFdmFsdWF0b3I+KFwia2V5MVwiKS5Ub1N0cmluZygpOihzdHJpbmcpbnVsbCk7XHJcbn0gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcblxubmFtZXNwYWNlIEV4cHJlc3Npb25TdGFjay5SdXN0aWNFeHByZXNzaW9uLk9wZXJhdGlvbnMuUHJlZml4VW5hcnlcbntcbiAgICBjbGFzcyBOZWdhdGl2ZSA6IFJ1c3RpY09wZXJhdGlvblxuICAgIHtcbiAgICAgICAgRnVuYzxvYmplY3QsIG9iamVjdCwgb2JqZWN0PiBmdW5jO1xucHVibGljIG92ZXJyaWRlIG9iamVjdCBFeGVjdXRlKG9iamVjdCBzdG9yZWQpXHJcbntcclxuICAgIHJldHVybiBmdW5jKHN0b3JlZCwgbnVsbCk7XHJcbn1wcm90ZWN0ZWQgb3ZlcnJpZGUgUHJpb3JpdHkgR2V0UHJpb3JpdHkoKVxyXG57XHJcbiAgICByZXR1cm4gRXhwcmVzc2lvblN0YWNrLlJ1c3RpY0V4cHJlc3Npb24uUnVzdGljT3BlcmF0aW9uLlByaW9yaXR5LlByZWZpeFVuYXJ5O1xyXG59XHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIFR5cGUgUHJldmlld1Jlc3VsdFR5cGUoVHlwZSBpbmNvbWluZ1N0b3JlZFR5cGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoaW5jb21pbmdTdG9yZWRUeXBlID09IHR5cGVvZihkb3VibGUpIHx8IHBhcmFtZXRlclR5cGUgPT0gdHlwZW9mKGRvdWJsZSkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGZ1bmMgPSBQcm92aWRlcnMuQ29tbW9uTWF0aC5OZWdhdGl2ZVt0eXBlb2YoZG91YmxlKV07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mKGRvdWJsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoaW5jb21pbmdTdG9yZWRUeXBlID09IHR5cGVvZihmbG9hdCkgfHwgcGFyYW1ldGVyVHlwZSA9PSB0eXBlb2YoZmxvYXQpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmdW5jID0gUHJvdmlkZXJzLkNvbW1vbk1hdGguTmVnYXRpdmVbdHlwZW9mKGZsb2F0KV07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mKGZsb2F0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGZ1bmMgPSBQcm92aWRlcnMuQ29tbW9uTWF0aC5OZWdhdGl2ZVt0eXBlb2YoaW50KV07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mKGludCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbnB1YmxpYyBvdmVycmlkZSBzdHJpbmcgVG9FeHByZXNzaW9uU3RyaW5nKClcclxue1xyXG4gICAgcmV0dXJuIHN0cmluZy5Gb3JtYXQoXCIgLVwiKTtcclxufSAgICB9XG59XG4iLCJ1c2luZyBTeXN0ZW07XG5cbm5hbWVzcGFjZSBFeHByZXNzaW9uU3RhY2suUnVzdGljRXhwcmVzc2lvbi5PcGVyYXRpb25zLlByZWZpeFVuYXJ5XG57XG4gICAgY2xhc3MgUG9zaXRpdmUgOiBSdXN0aWNPcGVyYXRpb25cbiAgICB7XG4gICAgICAgIEZ1bmM8b2JqZWN0LCBvYmplY3QsIG9iamVjdD4gZnVuYztcbnB1YmxpYyBvdmVycmlkZSBvYmplY3QgRXhlY3V0ZShvYmplY3Qgc3RvcmVkKVxyXG57XHJcbiAgICByZXR1cm4gZnVuYyhzdG9yZWQsIG51bGwpO1xyXG59cHJvdGVjdGVkIG92ZXJyaWRlIFByaW9yaXR5IEdldFByaW9yaXR5KClcclxue1xyXG4gICAgcmV0dXJuIEV4cHJlc3Npb25TdGFjay5SdXN0aWNFeHByZXNzaW9uLlJ1c3RpY09wZXJhdGlvbi5Qcmlvcml0eS5QcmVmaXhVbmFyeTtcclxufVxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBUeXBlIFByZXZpZXdSZXN1bHRUeXBlKFR5cGUgaW5jb21pbmdTdG9yZWRUeXBlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKGluY29taW5nU3RvcmVkVHlwZSA9PSB0eXBlb2YoZG91YmxlKSB8fCBwYXJhbWV0ZXJUeXBlID09IHR5cGVvZihkb3VibGUpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmdW5jID0gUHJvdmlkZXJzLkNvbW1vbk1hdGguUG9zaXRpdmVbdHlwZW9mKGRvdWJsZSldO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVvZihkb3VibGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGluY29taW5nU3RvcmVkVHlwZSA9PSB0eXBlb2YoZmxvYXQpIHx8IHBhcmFtZXRlclR5cGUgPT0gdHlwZW9mKGZsb2F0KSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZnVuYyA9IFByb3ZpZGVycy5Db21tb25NYXRoLlBvc2l0aXZlW3R5cGVvZihmbG9hdCldO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVvZihmbG9hdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmdW5jID0gUHJvdmlkZXJzLkNvbW1vbk1hdGguUG9zaXRpdmVbdHlwZW9mKGludCldO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVvZihpbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgb3ZlcnJpZGUgc3RyaW5nIFRvRXhwcmVzc2lvblN0cmluZygpXHJcbntcclxuICAgIHJldHVybiBzdHJpbmcuRm9ybWF0KFwiICtcIik7XHJcbn0gICAgfVxufVxuIiwidXNpbmcgU3lzdGVtO1xyXG5cclxubmFtZXNwYWNlIEV4cHJlc3Npb25TdGFjay5SdXN0aWNFeHByZXNzaW9uLk9wZXJhdGlvbnNcbntcbiAgICBjbGFzcyBTZXQgOiBSdXN0aWNPcGVyYXRpb25cbiAgICB7XG5wdWJsaWMgb3ZlcnJpZGUgb2JqZWN0IEV4ZWN1dGUob2JqZWN0IHN0b3JlZClcclxue1xyXG4gICAgcmV0dXJuIHBhcmFtZXRlclZhbHVlO1xyXG59cHJvdGVjdGVkIG92ZXJyaWRlIFByaW9yaXR5IEdldFByaW9yaXR5KClcclxue1xyXG4gICAgcmV0dXJuIEV4cHJlc3Npb25TdGFjay5SdXN0aWNFeHByZXNzaW9uLlJ1c3RpY09wZXJhdGlvbi5Qcmlvcml0eS5JZ25vcmVkO1xyXG59cHVibGljIG92ZXJyaWRlIFR5cGUgUHJldmlld1Jlc3VsdFR5cGUoVHlwZSBpbmNvbWluZ1N0b3JlZFR5cGUpXHJcbntcclxuICAgIHJldHVybiBwYXJhbWV0ZXJUeXBlO1xyXG59cHVibGljIG92ZXJyaWRlIGJvb2wgSGFzUmlnaHRUb0xlZnRQcmVjZWRlbmNlKClcclxue1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbn1wdWJsaWMgb3ZlcnJpZGUgc3RyaW5nIFRvRXhwcmVzc2lvblN0cmluZygpXHJcbntcclxuICAgIHJldHVybiBzdHJpbmcuRm9ybWF0KFwiIHswfVwiLGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5Ub1RlbXAoXCJrZXkxXCIscGFyYW1ldGVyKSE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbVRlbXA8UnVzdGljVmFsdWVFdmFsdWF0b3I+KFwia2V5MVwiKS5Ub1N0cmluZygpOihzdHJpbmcpbnVsbCk7XHJcbn0gICAgfVxufVxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG5cclxubmFtZXNwYWNlIEV4cHJlc3Npb25TdGFjay5SdXN0aWNFeHByZXNzaW9uLk9wZXJhdGlvbnNcclxue1xyXG4gICAgY2xhc3MgU3ViIDogUnVzdGljT3BlcmF0aW9uXHJcbiAgICB7XHJcbiAgICAgICAgRnVuYzxvYmplY3QsIG9iamVjdCwgb2JqZWN0PiBmdW5jO1xyXG5wdWJsaWMgb3ZlcnJpZGUgb2JqZWN0IEV4ZWN1dGUob2JqZWN0IHN0b3JlZClcclxue1xyXG4gICAgcmV0dXJuIGZ1bmMoc3RvcmVkLCBwYXJhbWV0ZXJWYWx1ZSk7XHJcbn1wcm90ZWN0ZWQgb3ZlcnJpZGUgUHJpb3JpdHkgR2V0UHJpb3JpdHkoKVxyXG57XHJcbiAgICByZXR1cm4gRXhwcmVzc2lvblN0YWNrLlJ1c3RpY0V4cHJlc3Npb24uUnVzdGljT3BlcmF0aW9uLlByaW9yaXR5LkFkZFN1YjtcclxufVxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBUeXBlIFByZXZpZXdSZXN1bHRUeXBlKFR5cGUgaW5jb21pbmdTdG9yZWRUeXBlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKGluY29taW5nU3RvcmVkVHlwZSA9PSB0eXBlb2YoZG91YmxlKSB8fCBwYXJhbWV0ZXJUeXBlID09IHR5cGVvZihkb3VibGUpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmdW5jID0gUHJvdmlkZXJzLkNvbW1vbk1hdGguU3ViW3R5cGVvZihkb3VibGUpXTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2YoZG91YmxlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChpbmNvbWluZ1N0b3JlZFR5cGUgPT0gdHlwZW9mKGZsb2F0KSB8fCBwYXJhbWV0ZXJUeXBlID09IHR5cGVvZihmbG9hdCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGZ1bmMgPSBQcm92aWRlcnMuQ29tbW9uTWF0aC5TdWJbdHlwZW9mKGZsb2F0KV07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mKGZsb2F0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChpbmNvbWluZ1N0b3JlZFR5cGUgPT0gdHlwZW9mKGludCkgJiYgcGFyYW1ldGVyVHlwZSA9PSB0eXBlb2YoaW50KSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZnVuYyA9IFByb3ZpZGVycy5Db21tb25NYXRoLlN1Ylt0eXBlb2YoaW50KV07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mKGludCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE5vdEltcGxlbWVudGVkRXhjZXB0aW9uKFwiQ291bGQgbm90IGluZmVyIHRoZSByZXN1bHRpbmcgdHlwZVwiKTtcclxuICAgICAgICB9XHJcbnB1YmxpYyBvdmVycmlkZSBzdHJpbmcgVG9FeHByZXNzaW9uU3RyaW5nKClcclxue1xyXG4gICAgcmV0dXJuIHN0cmluZy5Gb3JtYXQoXCIgLSB7MH1cIixnbG9iYWw6OkJyaWRnZS5TY3JpcHQuVG9UZW1wKFwia2V5MVwiLHBhcmFtZXRlcikhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21UZW1wPFJ1c3RpY1ZhbHVlRXZhbHVhdG9yPihcImtleTFcIikuVG9TdHJpbmcoKTooc3RyaW5nKW51bGwpO1xyXG59ICAgIH1cclxufVxyXG4iXQp9Cg==
